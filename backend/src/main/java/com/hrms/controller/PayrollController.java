package com.hrms.controller;

import com.hrms.model.Payroll;
import com.hrms.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/payroll")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PayrollController {

    @Autowired
    private PayrollRepository payrollRepository;

    // GET: All payrolls
    @GetMapping
    public ResponseEntity<List<Payroll>> getAllPayrolls() {
        try {
            List<Payroll> payrolls = payrollRepository.findAll();
            return new ResponseEntity<>(payrolls, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Optional: use a logger
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET: Payroll by ID
    @GetMapping("/{id}")
    public ResponseEntity<Payroll> getPayrollById(@PathVariable("id") Long id) {
        Optional<Payroll> payrollData = payrollRepository.findById(id);
        return payrollData
                .map(payroll -> new ResponseEntity<>(payroll, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // POST: Create new payroll
    @PostMapping
    public ResponseEntity<Payroll> createPayroll(@RequestBody Payroll payroll) {
        try {
            if (payroll.getNetPay() == null) {
                double netPay = payroll.getGrossSalary() - payroll.getTaxDeductions();
                payroll.setNetPay(netPay);
            }

            if (payroll.getDate() == null) {
                payroll.setDate(LocalDate.now());
            }

            Payroll savedPayroll = payrollRepository.save(payroll);
            return new ResponseEntity<>(savedPayroll, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace(); // Optional: use a logger
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // PUT: Update payroll
    @PutMapping("/{id}")
    public ResponseEntity<Payroll> updatePayroll(@PathVariable("id") Long id, @RequestBody Payroll payroll) {
        Optional<Payroll> payrollData = payrollRepository.findById(id);

        if (payrollData.isPresent()) {
            Payroll existingPayroll = payrollData.get();
            existingPayroll.setEmployeeName(payroll.getEmployeeName());
            existingPayroll.setGrossSalary(payroll.getGrossSalary());
            existingPayroll.setTaxDeductions(payroll.getTaxDeductions());
            existingPayroll.setNetPay(payroll.getNetPay());
            existingPayroll.setDate(payroll.getDate());

            Payroll updated = payrollRepository.save(existingPayroll);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // DELETE: Payroll by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletePayroll(@PathVariable("id") Long id) {
        try {
            payrollRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            e.printStackTrace(); // Optional: use a logger
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET: Payrolls by employee name
    @GetMapping("/employee/{employeeName}")
    public ResponseEntity<List<Payroll>> getPayrollsByEmployee(@PathVariable("employeeName") String employeeName) {
        try {
            List<Payroll> payrolls = payrollRepository.findByEmployeeNameContainingIgnoreCase(employeeName);
            return new ResponseEntity<>(payrolls, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Optional: use a logger
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET: Dashboard stats
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();

            Double totalSalary = payrollRepository.getTotalSalaryDisbursed();
            Double totalDeductions = payrollRepository.getTotalTaxDeductions();
            Long payrollCount = payrollRepository.count();
            List<String> employeeNames = payrollRepository.getDistinctEmployeeNames();
            List<Payroll> recentPayrolls = payrollRepository.findTop10ByOrderByDateDesc();

            stats.put("totalSalaryDisbursed", totalSalary != null ? totalSalary : 0.0);
            stats.put("totalTaxDeductions", totalDeductions != null ? totalDeductions : 0.0);
            stats.put("payrollCount", payrollCount);
            stats.put("employeeCount", employeeNames != null ? employeeNames.size() : 0);
            stats.put("recentPayrolls", recentPayrolls);

            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Optional: use a logger
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
