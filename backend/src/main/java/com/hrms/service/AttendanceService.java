package com.hrms.service;

import com.hrms.dto.AttendanceDTO;
import com.hrms.model.Attendance;
import com.hrms.model.AttendanceStatus;
import com.hrms.model.Employee;
import com.hrms.repository.AttendanceRepository;
import com.hrms.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<AttendanceDTO> getAllAttendance() {
        return attendanceRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<AttendanceDTO> getAllAttendance(Pageable pageable) {
        return attendanceRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public Optional<AttendanceDTO> getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<AttendanceDTO> getAttendanceByEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
        
        return attendanceRepository.findByEmployee(employee).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByAttendanceDate(date).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<AttendanceDTO> getAttendanceByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return attendanceRepository.findByAttendanceDateBetween(startDate, endDate, pageable)
                .map(this::convertToDTO);
    }

    public AttendanceDTO markAttendance(AttendanceDTO attendanceDTO) {
        Employee employee = employeeRepository.findById(attendanceDTO.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + attendanceDTO.getEmployeeId()));

        // Check if attendance already exists for this date
        Optional<Attendance> existingAttendance = attendanceRepository
                .findByEmployeeAndAttendanceDate(employee, attendanceDTO.getAttendanceDate());

        if (existingAttendance.isPresent()) {
            throw new RuntimeException("Attendance already marked for this date");
        }

        Attendance attendance = convertToEntity(attendanceDTO);
        attendance.setEmployee(employee);
        
        // Set default check-in time if not provided
        if (attendance.getCheckInTime() == null) {
            attendance.setCheckInTime(LocalTime.now());
        }

        // Calculate working hours if check-out time is provided
        if (attendance.getCheckInTime() != null && attendance.getCheckOutTime() != null) {
            calculateWorkingHours(attendance);
        }

        Attendance savedAttendance = attendanceRepository.save(attendance);
        return convertToDTO(savedAttendance);
    }

    public AttendanceDTO updateAttendance(Long id, AttendanceDTO attendanceDTO) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found with id: " + id));

        updateAttendanceFromDTO(attendance, attendanceDTO);
        
        // Recalculate working hours
        if (attendance.getCheckInTime() != null && attendance.getCheckOutTime() != null) {
            calculateWorkingHours(attendance);
        }

        Attendance updatedAttendance = attendanceRepository.save(attendance);
        return convertToDTO(updatedAttendance);
    }

    public AttendanceDTO checkOut(Long employeeId, LocalDate date) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));

        Attendance attendance = attendanceRepository.findByEmployeeAndAttendanceDate(employee, date)
                .orElseThrow(() -> new RuntimeException("No check-in record found for this date"));

        if (attendance.getCheckOutTime() != null) {
            throw new RuntimeException("Already checked out for this date");
        }

        attendance.setCheckOutTime(LocalTime.now());
        calculateWorkingHours(attendance);

        Attendance updatedAttendance = attendanceRepository.save(attendance);
        return convertToDTO(updatedAttendance);
    }

    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new RuntimeException("Attendance not found with id: " + id);
        }
        attendanceRepository.deleteById(id);
    }

    public Long getAttendanceCountByDateAndStatus(LocalDate date, AttendanceStatus status) {
        return attendanceRepository.countByDateAndStatus(date, status);
    }

    public List<Object[]> getAttendanceStatsByDate(LocalDate date) {
        return attendanceRepository.getAttendanceStatsByDate(date);
    }

    private void calculateWorkingHours(Attendance attendance) {
        if (attendance.getCheckInTime() != null && attendance.getCheckOutTime() != null) {
            Duration duration = Duration.between(attendance.getCheckInTime(), attendance.getCheckOutTime());
            double hours = duration.toMinutes() / 60.0;
            attendance.setWorkingHours(hours);

            // Calculate overtime (assuming 8 hours is standard)
            if (hours > 8) {
                attendance.setOvertimeHours(hours - 8);
            } else {
                attendance.setOvertimeHours(0.0);
            }
        }
    }

    // Conversion methods
    private AttendanceDTO convertToDTO(Attendance attendance) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(attendance.getId());
        dto.setEmployeeId(attendance.getEmployee().getId());
        dto.setEmployeeName(attendance.getEmployee().getFullName());
        dto.setEmployeeId_str(attendance.getEmployee().getEmployeeId());
        dto.setAttendanceDate(attendance.getAttendanceDate());
        dto.setCheckInTime(attendance.getCheckInTime());
        dto.setCheckOutTime(attendance.getCheckOutTime());
        dto.setStatus(attendance.getStatus());
        dto.setWorkingHours(attendance.getWorkingHours());
        dto.setOvertimeHours(attendance.getOvertimeHours());
        dto.setNotes(attendance.getNotes());
        dto.setCreatedAt(attendance.getCreatedAt());
        return dto;
    }

    private Attendance convertToEntity(AttendanceDTO dto) {
        Attendance attendance = new Attendance();
        updateAttendanceFromDTO(attendance, dto);
        return attendance;
    }

    private void updateAttendanceFromDTO(Attendance attendance, AttendanceDTO dto) {
        attendance.setAttendanceDate(dto.getAttendanceDate());
        attendance.setCheckInTime(dto.getCheckInTime());
        attendance.setCheckOutTime(dto.getCheckOutTime());
        attendance.setStatus(dto.getStatus() != null ? dto.getStatus() : AttendanceStatus.PRESENT);
        attendance.setWorkingHours(dto.getWorkingHours());
        attendance.setOvertimeHours(dto.getOvertimeHours());
        attendance.setNotes(dto.getNotes());
    }
}
