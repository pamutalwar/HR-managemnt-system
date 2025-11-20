package com.hrms.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "payroll")
public class Payroll {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "employee_name", nullable = false)
    private String employeeName;
    
    @Column(name = "gross_salary", nullable = false)
    private Double grossSalary;
    
    @Column(name = "tax_deductions", nullable = false)
    private Double taxDeductions;
    
    @Column(name = "net_pay", nullable = false)
    private Double netPay;
    
    @Column(name = "date", nullable = false)
    private LocalDate date;
    
    // Default constructor
    public Payroll() {}
    
    // Constructor with parameters
    public Payroll(String employeeName, Double grossSalary, Double taxDeductions, Double netPay, LocalDate date) {
        this.employeeName = employeeName;
        this.grossSalary = grossSalary;
        this.taxDeductions = taxDeductions;
        this.netPay = netPay;
        this.date = date;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmployeeName() {
        return employeeName;
    }
    
    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
    
    public Double getGrossSalary() {
        return grossSalary;
    }
    
    public void setGrossSalary(Double grossSalary) {
        this.grossSalary = grossSalary;
    }
    
    public Double getTaxDeductions() {
        return taxDeductions;
    }
    
    public void setTaxDeductions(Double taxDeductions) {
        this.taxDeductions = taxDeductions;
    }
    
    public Double getNetPay() {
        return netPay;
    }
    
    public void setNetPay(Double netPay) {
        this.netPay = netPay;
    }
    
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    @Override
    public String toString() {
        return "Payroll{" +
                "id=" + id +
                ", employeeName='" + employeeName + '\'' +
                ", grossSalary=" + grossSalary +
                ", taxDeductions=" + taxDeductions +
                ", netPay=" + netPay +
                ", date=" + date +
                '}';
    }
}
