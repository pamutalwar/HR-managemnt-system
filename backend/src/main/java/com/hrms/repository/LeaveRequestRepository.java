package com.hrms.repository;

import com.hrms.model.Employee;
import com.hrms.model.LeaveRequest;
import com.hrms.model.LeaveStatus;
import com.hrms.model.LeaveType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployee(Employee employee);
    List<LeaveRequest> findByStatus(LeaveStatus status);
    List<LeaveRequest> findByLeaveType(LeaveType leaveType);
    
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee.id = :employeeId")
    List<LeaveRequest> findByEmployeeId(@Param("employeeId") Long employeeId);
    
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.status = :status")
    Page<LeaveRequest> findByStatus(@Param("status") LeaveStatus status, Pageable pageable);
    
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.startDate <= :endDate AND lr.endDate >= :startDate")
    List<LeaveRequest> findOverlappingLeaves(@Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);
    
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee.id = :employeeId AND " +
           "lr.startDate <= :endDate AND lr.endDate >= :startDate AND lr.status = 'APPROVED'")
    List<LeaveRequest> findApprovedOverlappingLeaves(@Param("employeeId") Long employeeId,
                                                    @Param("startDate") LocalDate startDate, 
                                                    @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.status = :status")
    Long countByStatus(@Param("status") LeaveStatus status);
    
    @Query("SELECT lr.leaveType, COUNT(lr) FROM LeaveRequest lr WHERE lr.status = 'APPROVED' GROUP BY lr.leaveType")
    List<Object[]> getLeaveStatsByType();
}
