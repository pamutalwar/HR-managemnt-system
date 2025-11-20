package com.hrms.controller;

import com.hrms.dto.EmployeeDTO;
import com.hrms.model.EmployeeStatus;
import com.hrms.service.EmployeeService;
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
@RequestMapping("/employees")
@Tag(name = "Employee Management", description = "APIs for managing employees")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    @Operation(summary = "Get all employees", description = "Retrieve all employees with pagination and search")
    public ResponseEntity<Page<EmployeeDTO>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                   Sort.by(sortBy).descending() :
                   Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<EmployeeDTO> employees;
        if (search != null && !search.trim().isEmpty()) {
            employees = employeeService.searchEmployees(search, pageable);
        } else {
            employees = employeeService.getAllEmployees(pageable);
        }

        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID", description = "Retrieve a specific employee by their ID")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id)
                .map(employee -> ResponseEntity.ok(employee))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/employee-id/{employeeId}")
    @Operation(summary = "Get employee by employee ID", description = "Retrieve a specific employee by their employee ID")
    public ResponseEntity<EmployeeDTO> getEmployeeByEmployeeId(@PathVariable String employeeId) {
        return employeeService.getEmployeeByEmployeeId(employeeId)
                .map(employee -> ResponseEntity.ok(employee))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create new employee", description = "Add a new employee to the system")
    public ResponseEntity<?> createEmployee(@Valid @RequestBody EmployeeDTO employeeDTO) {
        try {
            EmployeeDTO createdEmployee = employeeService.createEmployee(employeeDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update employee", description = "Update an existing employee's information")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeDTO employeeDTO) {
        try {
            EmployeeDTO updatedEmployee = employeeService.updateEmployee(id, employeeDTO);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete employee", description = "Soft delete an employee (mark as terminated)")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok(Map.of("message", "Employee deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/department/{department}")
    @Operation(summary = "Get employees by department", description = "Retrieve all employees in a specific department")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByDepartment(@PathVariable String department) {
        List<EmployeeDTO> employees = employeeService.getEmployeesByDepartment(department);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get employees by status", description = "Retrieve all employees with a specific status")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByStatus(@PathVariable EmployeeStatus status) {
        List<EmployeeDTO> employees = employeeService.getEmployeesByStatus(status);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get employee statistics", description = "Get employee count by status")
    public ResponseEntity<Map<String, Object>> getEmployeeStats() {
        Map<String, Object> stats = Map.of(
            "totalEmployees", employeeService.getEmployeeCountByStatus(EmployeeStatus.ACTIVE),
            "activeEmployees", employeeService.getEmployeeCountByStatus(EmployeeStatus.ACTIVE),
            "inactiveEmployees", employeeService.getEmployeeCountByStatus(EmployeeStatus.INACTIVE),
            "terminatedEmployees", employeeService.getEmployeeCountByStatus(EmployeeStatus.TERMINATED),
            "onLeaveEmployees", employeeService.getEmployeeCountByStatus(EmployeeStatus.ON_LEAVE)
        );
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/generate-id")
    @Operation(summary = "Generate next employee ID", description = "Generate the next available employee ID")
    public ResponseEntity<Map<String, String>> generateEmployeeId() {
        String nextId = employeeService.getNextEmployeeId();
        return ResponseEntity.ok(Map.of("employeeId", nextId));
    }
}
