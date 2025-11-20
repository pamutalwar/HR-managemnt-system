package com.hrms.repository;

import com.hrms.model.Employee;
import com.hrms.model.Training;
import com.hrms.model.TrainingStatus;
import com.hrms.model.TrainingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingRepository extends JpaRepository<Training, Long> {
    List<Training> findByEmployee(Employee employee);
    List<Training> findByStatus(TrainingStatus status);
    List<Training> findByTrainingType(TrainingType trainingType);
    
    @Query("SELECT t FROM Training t WHERE t.employee.id = :employeeId")
    List<Training> findByEmployeeId(@Param("employeeId") Long employeeId);
    
    @Query("SELECT t FROM Training t WHERE t.status = :status")
    Page<Training> findByStatus(@Param("status") TrainingStatus status, Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Training t WHERE t.status = :status")
    Long countByStatus(@Param("status") TrainingStatus status);
    
    @Query("SELECT t.trainingType, COUNT(t) FROM Training t GROUP BY t.trainingType")
    List<Object[]> getTrainingStatsByType();
    
    @Query("SELECT t.status, COUNT(t) FROM Training t GROUP BY t.status")
    List<Object[]> getTrainingStatsByStatus();
    
    @Query("SELECT AVG(t.completionPercentage) FROM Training t WHERE t.status = 'COMPLETED'")
    Double getAverageCompletionPercentage();
}
