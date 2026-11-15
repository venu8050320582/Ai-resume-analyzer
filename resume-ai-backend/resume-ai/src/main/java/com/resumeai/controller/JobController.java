package com.resumeai.controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.resumeai.entity.Job;
import com.resumeai.repository.JobRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;

    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    // 1. CREATE JOB
    @PostMapping
    public ResponseEntity<Job> createJob(@Valid @RequestBody Job job) {
        Job savedJob = jobRepository.save(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
    }

    // 2. GET ALL JOBS
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        return ResponseEntity.ok(jobs);
    }

    // 3. GET JOB BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobRepository.findById(id);

        if (job.isPresent()) {
            return ResponseEntity.ok(job.get());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Job not found"));
    }

    // 4. UPDATE JOB
    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody Job updatedJob) {

        Optional<Job> optionalJob = jobRepository.findById(id);

        if (optionalJob.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Job not found"));
        }

        Job existingJob = optionalJob.get();

        existingJob.setTitle(updatedJob.getTitle());
        existingJob.setCompanyName(updatedJob.getCompanyName());
        existingJob.setDescription(updatedJob.getDescription());
        existingJob.setRequiredSkills(updatedJob.getRequiredSkills());
        existingJob.setExperienceRequired(updatedJob.getExperienceRequired());
        existingJob.setEducationRequirement(updatedJob.getEducationRequirement());
        existingJob.setLocation(updatedJob.getLocation());

        Job savedJob = jobRepository.save(existingJob);

        return ResponseEntity.ok(savedJob);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    // 5. DELETE JOB
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        if (!jobRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Job not found"));
        }

        jobRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }
}