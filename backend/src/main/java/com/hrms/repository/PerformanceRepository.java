package com.hrms.repository;

import com.hrms.model.Employee;
import com.hrms.model.Performance;
import com.hrms.model.PerformanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerformanceRepository extends JpaRepository<Performance, Long> {
    List<Performance> findByEmployee(Employee employee);
    List<Performance> findByStatus(PerformanceStatus status);
    
    @Query("SELECT p FROM Performance p WHERE p.employee.id = :employeeId")
    List<Performance> findByEmployeeId(@Param("employeeId") Long employeeId);
    
    @Query("SELECT p FROM Performance p WHERE p.status = :status")
    Page<Performance> findByStatus(@Param("status") PerformanceStatus status, Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM Performance p WHERE p.status = :status")
    Long countByStatus(@Param("status") PerformanceStatus status);
    
    @Query("SELECT AVG(p.overallRating) FROM Performance p WHERE p.status = 'FINALIZED'")
    Double getAverageOverallRating();
    
    @Query("SELECT p.employee.department, AVG(p.overallRating) FROM Performance p WHERE p.status = 'FINALIZED' GROUP BY p.employee.department")
    List<Object[]> getAverageRatingByDepartment();
}
