package com.hrms.repository;

//import com.hrms.f.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hrms.model.Payroll;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    
    // Find payrolls by employee name
    List<Payroll> findByEmployeeNameContainingIgnoreCase(String employeeName);
    
    // Find payrolls by date range
    List<Payroll> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Find payrolls by specific date
    List<Payroll> findByDate(LocalDate date);
    
    // Custom query to get total salary disbursed
    @Query("SELECT SUM(p.netPay) FROM Payroll p")
    Double getTotalSalaryDisbursed();
    
    // Custom query to get total tax deductions
    @Query("SELECT SUM(p.taxDeductions) FROM Payroll p")
    Double getTotalTaxDeductions();
    
    // Get distinct employee names
    @Query("SELECT DISTINCT p.employeeName FROM Payroll p")
    List<String> getDistinctEmployeeNames();
    
    // Get recent payrolls (last 10)
    List<Payroll> findTop10ByOrderByDateDesc();
}
