
package com.resumeai.dto;

import java.time.LocalDateTime;

import com.resumeai.entity.ScreeningStatus;

public record ScreeningResultView(
        Long id,
        Long resumeId,
        Long jobId,
        Double matchScore,
        String matchingSkills,
        String missingSkills,
        String candidateSummary,
        ScreeningStatus status,
        LocalDateTime createdAt
) {
}
