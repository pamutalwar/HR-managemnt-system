package com.hrms.controller;

import com.hrms.model.Job;
import com.hrms.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {
    @Autowired private JobRepository repo;

    @PostMapping
    public Job postJob(@RequestBody Job job) {
        return repo.save(job);
    }

    @GetMapping
    public List<Job> listJobs() {
        return repo.findAll();
    }

    @PutMapping("/{id}")
    public Job editJob(@PathVariable Long id, @RequestBody Job updated) {
        return repo.findById(id).map(j -> {
            j.setTitle(updated.getTitle());
            j.setDepartment(updated.getDepartment());
            j.setDescription(updated.getDescription());
            return repo.save(j);
        }).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
