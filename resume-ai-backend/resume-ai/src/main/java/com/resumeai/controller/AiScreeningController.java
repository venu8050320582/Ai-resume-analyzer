
package com.resumeai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.resumeai.dto.ScreeningResponse;
import com.resumeai.service.ScreeningAnalysisService;

@RestController
@RequestMapping("/api/ai")
public class AiScreeningController {

    private final ScreeningAnalysisService screeningService;

    public AiScreeningController(
            ScreeningAnalysisService screeningService) {
        this.screeningService = screeningService;
    }

    @PostMapping("/analyze/{resumeId}/{jobId}")
    public ResponseEntity<ScreeningResponse> analyzeResume(
            @PathVariable Long resumeId,
            @PathVariable Long jobId) {

        ScreeningResponse result =
                screeningService.analyze(resumeId, jobId);

        return ResponseEntity.ok(result);
    }
}
