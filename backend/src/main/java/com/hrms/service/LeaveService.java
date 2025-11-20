package com.hrms.service;

import com.hrms.dto.LeaveRequestDTO;
import com.hrms.model.Employee;
import com.hrms.model.LeaveRequest;
import com.hrms.model.LeaveStatus;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<LeaveRequestDTO> getAllLeaveRequests() {
        return leaveRequestRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<LeaveRequestDTO> getAllLeaveRequests(Pageable pageable) {
        return leaveRequestRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public Optional<LeaveRequestDTO> getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<LeaveRequestDTO> getLeaveRequestsByEmployee(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<LeaveRequestDTO> getLeaveRequestsByStatus(LeaveStatus status, Pageable pageable) {
        return leaveRequestRepository.findByStatus(status, pageable)
                .map(this::convertToDTO);
    }

    public LeaveRequestDTO requestLeave(LeaveRequestDTO leaveRequestDTO) {
        Employee employee = employeeRepository.findById(leaveRequestDTO.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + leaveRequestDTO.getEmployeeId()));

        // Check for overlapping approved leaves
        List<LeaveRequest> overlappingLeaves = leaveRequestRepository.findApprovedOverlappingLeaves(
                employee.getId(), leaveRequestDTO.getStartDate(), leaveRequestDTO.getEndDate());

        if (!overlappingLeaves.isEmpty()) {
            throw new RuntimeException("Leave request overlaps with existing approved leave");
        }

        LeaveRequest leaveRequest = convertToEntity(leaveRequestDTO);
        leaveRequest.setEmployee(employee);
        leaveRequest.setStatus(LeaveStatus.PENDING);
        
        // Calculate days requested
        long days = ChronoUnit.DAYS.between(leaveRequest.getStartDate(), leaveRequest.getEndDate()) + 1;
        leaveRequest.setDaysRequested((int) days);

        LeaveRequest savedLeaveRequest = leaveRequestRepository.save(leaveRequest);
        return convertToDTO(savedLeaveRequest);
    }

    public LeaveRequestDTO updateLeaveRequest(Long id, LeaveRequestDTO leaveRequestDTO) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException("Cannot update leave request that is not pending");
        }

        updateLeaveRequestFromDTO(leaveRequest, leaveRequestDTO);
        
        // Recalculate days requested
        long days = ChronoUnit.DAYS.between(leaveRequest.getStartDate(), leaveRequest.getEndDate()) + 1;
        leaveRequest.setDaysRequested((int) days);

        LeaveRequest updatedLeaveRequest = leaveRequestRepository.save(leaveRequest);
        return convertToDTO(updatedLeaveRequest);
    }

    public LeaveRequestDTO approveLeave(Long id, String approvedBy) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException("Leave request is not pending approval");
        }

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setApprovedBy(approvedBy);
        leaveRequest.setApprovalDate(LocalDateTime.now());

        LeaveRequest updatedLeaveRequest = leaveRequestRepository.save(leaveRequest);
        return convertToDTO(updatedLeaveRequest);
    }

    public LeaveRequestDTO rejectLeave(Long id, String rejectionReason, String rejectedBy) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException("Leave request is not pending approval");
        }

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setRejectionReason(rejectionReason);
        leaveRequest.setApprovedBy(rejectedBy);
        leaveRequest.setApprovalDate(LocalDateTime.now());

        LeaveRequest updatedLeaveRequest = leaveRequestRepository.save(leaveRequest);
        return convertToDTO(updatedLeaveRequest);
    }

    public void deleteLeaveRequest(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));

        if (leaveRequest.getStatus() == LeaveStatus.APPROVED) {
            throw new RuntimeException("Cannot delete approved leave request");
        }

        leaveRequestRepository.deleteById(id);
    }

    public Long getLeaveRequestCountByStatus(LeaveStatus status) {
        return leaveRequestRepository.countByStatus(status);
    }

    public List<Object[]> getLeaveStatsByType() {
        return leaveRequestRepository.getLeaveStatsByType();
    }

    // Conversion methods
    private LeaveRequestDTO convertToDTO(LeaveRequest leaveRequest) {
        LeaveRequestDTO dto = new LeaveRequestDTO();
        dto.setId(leaveRequest.getId());
        dto.setEmployeeId(leaveRequest.getEmployee().getId());
        dto.setEmployeeName(leaveRequest.getEmployee().getFullName());
        dto.setEmployeeId_str(leaveRequest.getEmployee().getEmployeeId());
        dto.setLeaveType(leaveRequest.getLeaveType());
        dto.setStartDate(leaveRequest.getStartDate());
        dto.setEndDate(leaveRequest.getEndDate());
        dto.setDaysRequested(leaveRequest.getDaysRequested());
        dto.setReason(leaveRequest.getReason());
        dto.setStatus(leaveRequest.getStatus());
        dto.setApprovedBy(leaveRequest.getApprovedBy());
        dto.setApprovalDate(leaveRequest.getApprovalDate());
        dto.setRejectionReason(leaveRequest.getRejectionReason());
        dto.setCreatedAt(leaveRequest.getCreatedAt());
        dto.setUpdatedAt(leaveRequest.getUpdatedAt());
        return dto;
    }

    private LeaveRequest convertToEntity(LeaveRequestDTO dto) {
        LeaveRequest leaveRequest = new LeaveRequest();
        updateLeaveRequestFromDTO(leaveRequest, dto);
        return leaveRequest;
    }

    private void updateLeaveRequestFromDTO(LeaveRequest leaveRequest, LeaveRequestDTO dto) {
        leaveRequest.setLeaveType(dto.getLeaveType());
        leaveRequest.setStartDate(dto.getStartDate());
        leaveRequest.setEndDate(dto.getEndDate());
        leaveRequest.setReason(dto.getReason());
        if (dto.getStatus() != null) {
            leaveRequest.setStatus(dto.getStatus());
        }
    }
}
