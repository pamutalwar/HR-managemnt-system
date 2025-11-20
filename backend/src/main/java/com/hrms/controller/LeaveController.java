package com.hrms.controller;

import com.hrms.dto.LeaveRequestDTO;
import com.hrms.model.LeaveStatus;
import com.hrms.service.LeaveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/leaves")
@Tag(name = "Leave Management", description = "APIs for managing employee leave requests")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @GetMapping
    @Operation(summary = "Get all leave requests", description = "Retrieve all leave requests with pagination")
    public ResponseEntity<Page<LeaveRequestDTO>> getAllLeaveRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) LeaveStatus status) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<LeaveRequestDTO> leaveRequests;
        if (status != null) {
            leaveRequests = leaveService.getLeaveRequestsByStatus(status, pageable);
        } else {
            leaveRequests = leaveService.getAllLeaveRequests(pageable);
        }
        
        return ResponseEntity.ok(leaveRequests);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get leave request by ID", description = "Retrieve a specific leave request by ID")
    public ResponseEntity<LeaveRequestDTO> getLeaveRequestById(@PathVariable Long id) {
        return leaveService.getLeaveRequestById(id)
                .map(leaveRequest -> ResponseEntity.ok(leaveRequest))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get leave requests by employee", description = "Retrieve all leave requests for a specific employee")
    public ResponseEntity<List<LeaveRequestDTO>> getLeaveRequestsByEmployee(@PathVariable Long employeeId) {
        List<LeaveRequestDTO> leaveRequests = leaveService.getLeaveRequestsByEmployee(employeeId);
        return ResponseEntity.ok(leaveRequests);
    }

    @PostMapping("/request")
    @Operation(summary = "Request leave", description = "Submit a new leave request")
    public ResponseEntity<?> requestLeave(@Valid @RequestBody LeaveRequestDTO leaveRequestDTO) {
        try {
            LeaveRequestDTO createdLeaveRequest = leaveService.requestLeave(leaveRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdLeaveRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update leave request", description = "Update an existing leave request")
    public ResponseEntity<?> updateLeaveRequest(@PathVariable Long id, @Valid @RequestBody LeaveRequestDTO leaveRequestDTO) {
        try {
            LeaveRequestDTO updatedLeaveRequest = leaveService.updateLeaveRequest(id, leaveRequestDTO);
            return ResponseEntity.ok(updatedLeaveRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve leave request", description = "Approve a pending leave request")
    public ResponseEntity<?> approveLeave(@PathVariable Long id, @RequestParam(defaultValue = "HR Manager") String approvedBy) {
        try {
            LeaveRequestDTO approvedLeaveRequest = leaveService.approveLeave(id, approvedBy);
            return ResponseEntity.ok(approvedLeaveRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject leave request", description = "Reject a pending leave request")
    public ResponseEntity<?> rejectLeave(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String rejectionReason = request.get("rejectionReason");
            String rejectedBy = request.getOrDefault("rejectedBy", "HR Manager");
            
            if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Rejection reason is required"));
            }
            
            LeaveRequestDTO rejectedLeaveRequest = leaveService.rejectLeave(id, rejectionReason, rejectedBy);
            return ResponseEntity.ok(rejectedLeaveRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete leave request", description = "Delete a leave request")
    public ResponseEntity<?> deleteLeaveRequest(@PathVariable Long id) {
        try {
            leaveService.deleteLeaveRequest(id);
            return ResponseEntity.ok(Map.of("message", "Leave request deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @Operation(summary = "Get leave statistics", description = "Get leave request statistics")
    public ResponseEntity<Map<String, Object>> getLeaveStats() {
        List<Object[]> leaveStatsByType = leaveService.getLeaveStatsByType();
        
        Map<String, Object> stats = Map.of(
            "pending", leaveService.getLeaveRequestCountByStatus(LeaveStatus.PENDING),
            "approved", leaveService.getLeaveRequestCountByStatus(LeaveStatus.APPROVED),
            "rejected", leaveService.getLeaveRequestCountByStatus(LeaveStatus.REJECTED),
            "cancelled", leaveService.getLeaveRequestCountByStatus(LeaveStatus.CANCELLED),
            "leavesByType", leaveStatsByType
        );
        
        return ResponseEntity.ok(stats);
    }
}
