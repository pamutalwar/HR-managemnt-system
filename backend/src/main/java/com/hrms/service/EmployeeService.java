package com.hrms.service;

import com.hrms.dto.EmployeeDTO;
import com.hrms.model.Employee;
import com.hrms.model.EmployeeStatus;
import com.hrms.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<EmployeeDTO> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public Optional<EmployeeDTO> getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<EmployeeDTO> getEmployeeByEmployeeId(String employeeId) {
        return employeeRepository.findByEmployeeId(employeeId)
                .map(this::convertToDTO);
    }

    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        // Auto-generate Employee ID if not provided
        if (employeeDTO.getEmployeeId() == null || employeeDTO.getEmployeeId().trim().isEmpty()) {
            employeeDTO.setEmployeeId(generateEmployeeId());
        } else {
            // Check if provided Employee ID already exists
            if (employeeRepository.existsByEmployeeId(employeeDTO.getEmployeeId())) {
                throw new RuntimeException("Employee ID already exists: " + employeeDTO.getEmployeeId());
            }
        }

        if (employeeRepository.existsByEmail(employeeDTO.getEmail())) {
            throw new RuntimeException("Email already exists: " + employeeDTO.getEmail());
        }

        Employee employee = convertToEntity(employeeDTO);
        employee.setStatus(EmployeeStatus.ACTIVE);
        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDTO(savedEmployee);
    }

    private String generateEmployeeId() {
        // Get the current year
        int currentYear = java.time.LocalDate.now().getYear();
        String yearSuffix = String.valueOf(currentYear).substring(2); // Last 2 digits of year

        // Find the highest employee number for current year
        String prefix = "EMP" + yearSuffix;
        List<Employee> employeesThisYear = employeeRepository.findByEmployeeIdStartingWith(prefix);

        int maxNumber = 0;
        for (Employee emp : employeesThisYear) {
            String empId = emp.getEmployeeId();
            if (empId.length() > prefix.length()) {
                try {
                    int number = Integer.parseInt(empId.substring(prefix.length()));
                    maxNumber = Math.max(maxNumber, number);
                } catch (NumberFormatException e) {
                    // Skip invalid formats
                }
            }
        }

        // Generate next employee ID
        return prefix + String.format("%03d", maxNumber + 1);
    }

    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Check if email is being changed and if it already exists
        if (!employee.getEmail().equals(employeeDTO.getEmail()) &&
            employeeRepository.existsByEmail(employeeDTO.getEmail())) {
            throw new RuntimeException("Email already exists: " + employeeDTO.getEmail());
        }

        updateEmployeeFromDTO(employee, employeeDTO);
        Employee updatedEmployee = employeeRepository.save(employee);
        return convertToDTO(updatedEmployee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Soft delete by changing status
        employee.setStatus(EmployeeStatus.TERMINATED);
        employeeRepository.save(employee);
    }

    public Page<EmployeeDTO> searchEmployees(String searchTerm, Pageable pageable) {
        return employeeRepository.findBySearchTerm(searchTerm, pageable)
                .map(this::convertToDTO);
    }

    public List<EmployeeDTO> getEmployeesByDepartment(String department) {
        return employeeRepository.findByDepartment(department).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public String getNextEmployeeId() {
        return generateEmployeeId();
    }

    public List<EmployeeDTO> getEmployeesByStatus(EmployeeStatus status) {
        return employeeRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Long getEmployeeCountByStatus(EmployeeStatus status) {
        return employeeRepository.countByStatus(status);
    }

    // Conversion methods
    private EmployeeDTO convertToDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setEmployeeId(employee.getEmployeeId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setPhoneNumber(employee.getPhoneNumber());
        dto.setDepartment(employee.getDepartment());
        dto.setPosition(employee.getPosition());
        dto.setHireDate(employee.getHireDate());
        dto.setBirthDate(employee.getBirthDate());
        dto.setStatus(employee.getStatus());
        dto.setSalary(employee.getSalary());
        dto.setAddress(employee.getAddress());
        dto.setCreatedAt(employee.getCreatedAt());
        dto.setUpdatedAt(employee.getUpdatedAt());
        return dto;
    }

    private Employee convertToEntity(EmployeeDTO dto) {
        Employee employee = new Employee();
        updateEmployeeFromDTO(employee, dto);
        return employee;
    }

    private void updateEmployeeFromDTO(Employee employee, EmployeeDTO dto) {
        employee.setEmployeeId(dto.getEmployeeId());
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhoneNumber(dto.getPhoneNumber());
        employee.setDepartment(dto.getDepartment());
        employee.setPosition(dto.getPosition());
        employee.setHireDate(dto.getHireDate());
        employee.setBirthDate(dto.getBirthDate());
        if (dto.getStatus() != null) {
            employee.setStatus(dto.getStatus());
        }
        employee.setSalary(dto.getSalary());
        employee.setAddress(dto.getAddress());
    }
}
