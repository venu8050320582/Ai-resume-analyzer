
package com.resumeai.dto;

import com.resumeai.entity.ScreeningStatus;

public record ScreeningResponse(
    Long screeningResultId,
    ScreeningStatus status,
    ResumeAnalysis analysis,
    ResumeScore score
) {
}
