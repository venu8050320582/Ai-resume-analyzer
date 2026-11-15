
package com.resumeai.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.resumeai.dto.ResumeAnalysis;
import com.resumeai.dto.ResumeScore;
import com.resumeai.dto.ScreeningResponse;

import com.resumeai.entity.Resume;
import com.resumeai.entity.Job;
import com.resumeai.entity.ScreeningResult;
import com.resumeai.entity.ScreeningStatus;

import com.resumeai.repository.ResumeRepository;
import com.resumeai.repository.JobRepository;
import com.resumeai.repository.ScreeningRepository;

@Service
public class ScreeningAnalysisService {

    private final ResumeRepository resumeRepository;
    private final JobRepository jobRepository;
    private final ScreeningRepository screeningRepository;
    private final GeminiService geminiService;
    private final ResumeScoringService scoringService;

    public ScreeningAnalysisService(
            ResumeRepository resumeRepository,
            JobRepository jobRepository,
            ScreeningRepository screeningRepository,
            GeminiService geminiService,
            ResumeScoringService scoringService) {

        this.resumeRepository = resumeRepository;
        this.jobRepository = jobRepository;
        this.screeningRepository = screeningRepository;
        this.geminiService = geminiService;
        this.scoringService = scoringService;
    }

    @Transactional
    public ScreeningResponse analyze(Long resumeId, Long jobId) {

        // 1. Retrieve resume
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Resume not found"));

        // 2. Retrieve job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Job not found"));

        // 3. Validate resume text
        String resumeText = resume.getExtractedText();

        if (resumeText == null || resumeText.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Resume text is empty");
        }

        // 4. Analyze using Gemini
        ResumeAnalysis analysis = geminiService.analyzeResume(
                resumeText,
                job.getTitle(),
                job.getDescription(),
                job.getRequiredSkills(),
                String.valueOf(job.getExperienceRequired()),
                job.getEducationRequirement()
        );

        // 5. Calculate score
        ResumeScore score =
                scoringService.calculateScore(analysis);

        // 6. Create screening result
        ScreeningResult result = new ScreeningResult();

        result.setResume(resume);
        result.setJob(job);

        result.setMatchScore((double) score.totalScore());

        result.setMatchingSkills(
                analysis.matchingSkills() == null
                        ? ""
                        : String.join(", ", analysis.matchingSkills())
        );

        result.setMissingSkills(
                analysis.missingSkills() == null
                        ? ""
                        : String.join(", ", analysis.missingSkills())
        );

        result.setCandidateSummary(
                analysis.candidateSummary()
        );

        result.setStatus(ScreeningStatus.COMPLETED);

        // 7. Save into MySQL
        ScreeningResult savedResult =
                screeningRepository.save(result);

        // 8. Return saved result and score
        return new ScreeningResponse(
                savedResult.getId(),
                savedResult.getStatus(),
                analysis,
                score
        );
    }
}
