package com.hrms.model;

import jakarta.persistence.*;

@Entity
public class Applicant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String status = "Pending";
    private Long jobId;
    private String resumePath;
    // ✅ Default constructor (required by JPA)
    public Applicant() {
    }

    // ✅ Custom constructor (useful for inserting data)
    public Applicant(String name, String email, String status, Long jobId, String resumePath) {
        this.name = name;
        this.email = email;
        this.status = status;
        this.jobId = jobId;
        this.resumePath = resumePath;
    }

    // ✅ Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getResumePath() {
        return resumePath;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
    }
}
