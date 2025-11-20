package com.hrms.controller;

import com.hrms.dto.AttendanceDTO;
import com.hrms.model.AttendanceStatus;
import com.hrms.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendance")
@Tag(name = "Attendance Management", description = "APIs for managing employee attendance")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping
    @Operation(summary = "Get all attendance records", description = "Retrieve all attendance records with pagination")
    public ResponseEntity<Page<AttendanceDTO>> getAllAttendance(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "attendanceDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<AttendanceDTO> attendance;
        if (startDate != null && endDate != null) {
            attendance = attendanceService.getAttendanceByDateRange(startDate, endDate, pageable);
        } else {
            attendance = attendanceService.getAllAttendance(pageable);
        }
        
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get attendance by ID", description = "Retrieve a specific attendance record by ID")
    public ResponseEntity<AttendanceDTO> getAttendanceById(@PathVariable Long id) {
        return attendanceService.getAttendanceById(id)
                .map(attendance -> ResponseEntity.ok(attendance))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get attendance by employee", description = "Retrieve all attendance records for a specific employee")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByEmployee(@PathVariable Long employeeId) {
        List<AttendanceDTO> attendance = attendanceService.getAttendanceByEmployee(employeeId);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/date/{date}")
    @Operation(summary = "Get attendance by date", description = "Retrieve all attendance records for a specific date")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceDTO> attendance = attendanceService.getAttendanceByDate(date);
        return ResponseEntity.ok(attendance);
    }

    @PostMapping("/mark")
    @Operation(summary = "Mark attendance", description = "Mark attendance for an employee")
    public ResponseEntity<?> markAttendance(@Valid @RequestBody AttendanceDTO attendanceDTO) {
        try {
            AttendanceDTO markedAttendance = attendanceService.markAttendance(attendanceDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(markedAttendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update attendance", description = "Update an existing attendance record")
    public ResponseEntity<?> updateAttendance(@PathVariable Long id, @Valid @RequestBody AttendanceDTO attendanceDTO) {
        try {
            AttendanceDTO updatedAttendance = attendanceService.updateAttendance(id, attendanceDTO);
            return ResponseEntity.ok(updatedAttendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/checkout")
    @Operation(summary = "Check out", description = "Mark check-out time for an employee")
    public ResponseEntity<?> checkOut(
            @RequestParam Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            AttendanceDTO attendance = attendanceService.checkOut(employeeId, date);
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete attendance", description = "Delete an attendance record")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long id) {
        try {
            attendanceService.deleteAttendance(id);
            return ResponseEntity.ok(Map.of("message", "Attendance record deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats/today")
    @Operation(summary = "Get today's attendance stats", description = "Get attendance statistics for today")
    public ResponseEntity<Map<String, Object>> getTodayAttendanceStats() {
        LocalDate today = LocalDate.now();
        List<Object[]> stats = attendanceService.getAttendanceStatsByDate(today);
        
        Map<String, Object> result = Map.of(
            "date", today,
            "present", attendanceService.getAttendanceCountByDateAndStatus(today, AttendanceStatus.PRESENT),
            "absent", attendanceService.getAttendanceCountByDateAndStatus(today, AttendanceStatus.ABSENT),
            "late", attendanceService.getAttendanceCountByDateAndStatus(today, AttendanceStatus.LATE),
            "halfDay", attendanceService.getAttendanceCountByDateAndStatus(today, AttendanceStatus.HALF_DAY),
            "workFromHome", attendanceService.getAttendanceCountByDateAndStatus(today, AttendanceStatus.WORK_FROM_HOME),
            "detailedStats", stats
        );
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/stats/date/{date}")
    @Operation(summary = "Get attendance stats by date", description = "Get attendance statistics for a specific date")
    public ResponseEntity<Map<String, Object>> getAttendanceStatsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Object[]> stats = attendanceService.getAttendanceStatsByDate(date);
        
        Map<String, Object> result = Map.of(
            "date", date,
            "present", attendanceService.getAttendanceCountByDateAndStatus(date, AttendanceStatus.PRESENT),
            "absent", attendanceService.getAttendanceCountByDateAndStatus(date, AttendanceStatus.ABSENT),
            "late", attendanceService.getAttendanceCountByDateAndStatus(date, AttendanceStatus.LATE),
            "halfDay", attendanceService.getAttendanceCountByDateAndStatus(date, AttendanceStatus.HALF_DAY),
            "workFromHome", attendanceService.getAttendanceCountByDateAndStatus(date, AttendanceStatus.WORK_FROM_HOME),
            "detailedStats", stats
        );
        
        return ResponseEntity.ok(result);
    }
}
