package com.hrms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance")
@EntityListeners(AuditingEntityListener.class)
public class Performance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "review_period_start")
    private LocalDate reviewPeriodStart;

    @Column(name = "review_period_end")
    private LocalDate reviewPeriodEnd;

    @Min(1)
    @Max(5)
    @Column(name = "overall_rating")
    private Integer overallRating;

    @Min(1)
    @Max(5)
    @Column(name = "technical_skills")
    private Integer technicalSkills;

    @Min(1)
    @Max(5)
    @Column(name = "communication_skills")
    private Integer communicationSkills;

    @Min(1)
    @Max(5)
    @Column(name = "teamwork")
    private Integer teamwork;

    @Min(1)
    @Max(5)
    @Column(name = "leadership")
    private Integer leadership;

    @Min(1)
    @Max(5)
    @Column(name = "punctuality")
    private Integer punctuality;

    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths;

    @Column(name = "areas_for_improvement", columnDefinition = "TEXT")
    private String areasForImprovement;

    @Column(name = "goals", columnDefinition = "TEXT")
    private String goals;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @NotBlank
    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PerformanceStatus status = PerformanceStatus.DRAFT;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Performance() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public LocalDate getReviewPeriodStart() { return reviewPeriodStart; }
    public void setReviewPeriodStart(LocalDate reviewPeriodStart) { this.reviewPeriodStart = reviewPeriodStart; }

    public LocalDate getReviewPeriodEnd() { return reviewPeriodEnd; }
    public void setReviewPeriodEnd(LocalDate reviewPeriodEnd) { this.reviewPeriodEnd = reviewPeriodEnd; }

    public Integer getOverallRating() { return overallRating; }
    public void setOverallRating(Integer overallRating) { this.overallRating = overallRating; }

    public Integer getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(Integer technicalSkills) { this.technicalSkills = technicalSkills; }

    public Integer getCommunicationSkills() { return communicationSkills; }
    public void setCommunicationSkills(Integer communicationSkills) { this.communicationSkills = communicationSkills; }

    public Integer getTeamwork() { return teamwork; }
    public void setTeamwork(Integer teamwork) { this.teamwork = teamwork; }

    public Integer getLeadership() { return leadership; }
    public void setLeadership(Integer leadership) { this.leadership = leadership; }

    public Integer getPunctuality() { return punctuality; }
    public void setPunctuality(Integer punctuality) { this.punctuality = punctuality; }

    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }

    public String getAreasForImprovement() { return areasForImprovement; }
    public void setAreasForImprovement(String areasForImprovement) { this.areasForImprovement = areasForImprovement; }

    public String getGoals() { return goals; }
    public void setGoals(String goals) { this.goals = goals; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }

    public PerformanceStatus getStatus() { return status; }
    public void setStatus(PerformanceStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
