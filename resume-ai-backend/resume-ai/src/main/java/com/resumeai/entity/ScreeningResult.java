
package com.resumeai.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "screening_results")
public class ScreeningResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double matchScore;

    @Column(columnDefinition = "TEXT")
    private String matchingSkills;

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    @Column(columnDefinition = "TEXT")
    private String candidateSummary;

    @Enumerated(EnumType.STRING)
    private ScreeningStatus status;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    public ScreeningResult() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = ScreeningStatus.PENDING;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

    public String getMatchingSkills() { return matchingSkills; }
    public void setMatchingSkills(String matchingSkills) { this.matchingSkills = matchingSkills; }

    public String getMissingSkills() { return missingSkills; }
    public void setMissingSkills(String missingSkills) { this.missingSkills = missingSkills; }

    public String getCandidateSummary() { return candidateSummary; }
    public void setCandidateSummary(String candidateSummary) { this.candidateSummary = candidateSummary; }

    public ScreeningStatus getStatus() { return status; }
    public void setStatus(ScreeningStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }
}
