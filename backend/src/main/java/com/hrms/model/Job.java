package com.hrms.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String department;
    @Column(length = 1000)
    private String description;
    private LocalDate postedDate = LocalDate.now();

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDepartment() {
        return department;
    }
    public void setDepartment(String department) {
        this.department = department;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public LocalDate getPostedDate() {
        return postedDate;
    }
    public void setPostedDate(LocalDate postedDate) {
        this.postedDate = postedDate;
    }
}