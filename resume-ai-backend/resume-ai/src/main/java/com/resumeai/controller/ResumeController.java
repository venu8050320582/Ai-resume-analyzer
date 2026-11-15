package com.resumeai.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.resumeai.entity.Candidate;
import com.resumeai.entity.Resume;
import com.resumeai.repository.CandidateRepository;
import com.resumeai.repository.ResumeRepository;
import com.resumeai.service.ResumeTextExtractor;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final CandidateRepository candidateRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeTextExtractor textExtractor;

    public ResumeController(
            CandidateRepository candidateRepository,
            ResumeRepository resumeRepository,
            ResumeTextExtractor textExtractor) {

        this.candidateRepository = candidateRepository;
        this.resumeRepository = resumeRepository;
        this.textExtractor = textExtractor;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(

            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam(required = false) String phone,
            @RequestParam("file") MultipartFile file) {

        Path savedFile = null;

        try {
            // Validate candidate name and email format
            if (!StringUtils.hasText(fullName)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Full name is required");
            }
            if (!StringUtils.hasText(email) || !email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please provide a valid email address");
            }

            // Validate file
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Please select a resume"));
            }

            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Maximum file size is 5 MB"));
            }

            String originalName = file.getOriginalFilename();

            if (originalName == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid filename"));
            }

            String lowerName = originalName.toLowerCase();

            if (!lowerName.endsWith(".pdf")
                    && !lowerName.endsWith(".docx")) {

                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Only PDF and DOCX files are allowed"));
            }

            // Extract text before storing the file
            String extractedText = textExtractor.extractText(file);

            if (extractedText == null || extractedText.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "No readable text found in resume"));
            }

            // Find existing candidate or create new candidate
            Candidate candidate = candidateRepository
                    .findByEmail(email)
                    .orElseGet(() -> {

                        Candidate newCandidate = new Candidate();

                        newCandidate.setFullName(fullName);
                        newCandidate.setEmail(email);
                        newCandidate.setPhone(phone);

                        return candidateRepository.save(newCandidate);
                    });

            // Create upload directory
            Path uploadDirectory =
                    Path.of("uploads", "resumes");

            Files.createDirectories(uploadDirectory);

            // Generate unique filename
            String extension = lowerName.endsWith(".pdf")
                    ? ".pdf" : ".docx";

            String generatedName =
                    UUID.randomUUID().toString() + extension;

            savedFile = uploadDirectory.resolve(generatedName);

            // Save resume file
            file.transferTo(savedFile);

            // Create Resume entity
            Resume resume = new Resume();

            resume.setFileName(originalName);
            resume.setStoragePath(
                    savedFile.toAbsolutePath().toString());
            resume.setContentType(file.getContentType());
            resume.setExtractedText(extractedText);
            resume.setCandidate(candidate);

            // Save resume in MySQL
            Resume savedResume =
                    resumeRepository.save(resume);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Resume uploaded successfully",
                            "resumeId", savedResume.getId(),
                            "candidateId", candidate.getId(),
                            "fileName", savedResume.getFileName(),
                            "uploadedAt", savedResume.getUploadedAt(),
                            "extractedTextLength", extractedText.length()
                    ));

        } catch (Exception e) {

            if (savedFile != null) {
                try {
                    Files.deleteIfExists(savedFile);
                } catch (Exception ignored) {
                    // File cleanup failed
                }
            }

            HttpStatus status = HttpStatus.BAD_REQUEST;
            if (e instanceof ResponseStatusException) {
                status = (HttpStatus) ((ResponseStatusException) e).getStatusCode();
            }

            return ResponseEntity.status(status)
                    .body(Map.of(
                            "error",
                            e.getMessage() == null
                                    ? "Resume upload failed"
                                    : e.getMessage()
                    ));
        }
    }
}