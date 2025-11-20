package com.hrms.repository;

import com.hrms.model.Attendance;
import com.hrms.model.AttendanceStatus;
import com.hrms.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEmployee(Employee employee);
    List<Attendance> findByEmployeeAndAttendanceDateBetween(Employee employee, LocalDate startDate, LocalDate endDate);
    Optional<Attendance> findByEmployeeAndAttendanceDate(Employee employee, LocalDate attendanceDate);
    
    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate = :date")
    List<Attendance> findByAttendanceDate(@Param("date") LocalDate date);
    
    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate BETWEEN :startDate AND :endDate")
    Page<Attendance> findByAttendanceDateBetween(@Param("startDate") LocalDate startDate, 
                                                 @Param("endDate") LocalDate endDate, 
                                                 Pageable pageable);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.attendanceDate = :date AND a.status = :status")
    Long countByDateAndStatus(@Param("date") LocalDate date, @Param("status") AttendanceStatus status);
    
    @Query("SELECT a.status, COUNT(a) FROM Attendance a WHERE a.attendanceDate = :date GROUP BY a.status")
    List<Object[]> getAttendanceStatsByDate(@Param("date") LocalDate date);
    
    @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId AND a.attendanceDate BETWEEN :startDate AND :endDate")
    List<Attendance> findByEmployeeIdAndDateRange(@Param("employeeId") Long employeeId, 
                                                  @Param("startDate") LocalDate startDate, 
                                                  @Param("endDate") LocalDate endDate);
}
