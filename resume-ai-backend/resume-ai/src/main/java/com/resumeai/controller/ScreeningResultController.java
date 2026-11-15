
package com.resumeai.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;

import com.resumeai.dto.ScreeningResultView;
import com.resumeai.entity.ScreeningResult;
import com.resumeai.repository.ScreeningRepository;
import com.resumeai.repository.JobRepository;
import com.resumeai.repository.ResumeRepository;

@RestController
@RequestMapping("/api/screening")
public class ScreeningResultController {

    private final ScreeningRepository screeningRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;

    public ScreeningResultController(
            ScreeningRepository screeningRepository,
            JobRepository jobRepository,
            ResumeRepository resumeRepository) {

        this.screeningRepository = screeningRepository;
        this.jobRepository = jobRepository;
        this.resumeRepository = resumeRepository;
    }

    // Convert entity into a safe response DTO
    private ScreeningResultView convertToView(
            ScreeningResult result) {

        return new ScreeningResultView(
                result.getId(),
                result.getResume().getId(),
                result.getJob().getId(),
                result.getMatchScore(),
                result.getMatchingSkills(),
                result.getMissingSkills(),
                result.getCandidateSummary(),
                result.getStatus(),
                result.getCreatedAt()
        );
    }

    // 1. Get screening result by ID
    @GetMapping("/{id}")
    public ScreeningResultView getResultById(
            @PathVariable Long id) {

        ScreeningResult result = screeningRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Screening result not found"));

        return convertToView(result);
    }

    // 2. Get candidates ranked for a particular job
    @GetMapping("/job/{jobId}")
    public List<ScreeningResultView> getResultsByJob(
            @PathVariable Long jobId) {

        if (!jobRepository.existsById(jobId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Job not found");
        }

        return screeningRepository
                .findByJob_IdOrderByMatchScoreDesc(jobId)
                .stream()
                .map(this::convertToView)
                .toList();
    }

    // 3. Get screening history for a resume
    @GetMapping("/resume/{resumeId}")
    public List<ScreeningResultView> getResultsByResume(
            @PathVariable Long resumeId) {

        if (!resumeRepository.existsById(resumeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Resume not found");
        }

        return screeningRepository
                .findByResume_Id(resumeId)
                .stream()
                .map(this::convertToView)
                .toList();
    }
}
