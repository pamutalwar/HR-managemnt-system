package com.hrms.controller;

import com.hrms.model.Applicant;
import com.hrms.repository.ApplicantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applicants")
public class ApplicantController {
    @Autowired private ApplicantRepository repo;

    @PostMapping("/apply")
    public Applicant apply(@RequestBody Applicant app) {
        return repo.save(app);
    }

    @GetMapping
    public List<Applicant> list() {
        return repo.findAll();
    }

    @PutMapping("/{id}/status")
    public Applicant updateStatus(@PathVariable Long id, @RequestParam String status) {
        return repo.findById(id).map(app -> {
            app.setStatus(status);
            return repo.save(app);
        }).orElseThrow();
    }
}
