
package com.resumeai.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.resumeai.service.GeminiService;

@RestController
@RequestMapping("/api/ai")
public class GeminiTestController {

    private final GeminiService geminiService;

    public GeminiTestController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> testGemini(
            @RequestBody Map<String, String> request) {

        String message = request.get("message");

        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Message cannot be empty"));
        }

        try {
            String response = geminiService.askGemini(message);

            return ResponseEntity.ok(
                    Map.of("response", response)
            );

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of(
                            "error", "Gemini API request failed",
                            "details", e.getMessage() == null
                                    ? "Unknown error" : e.getMessage()
                    ));
        }
    }
}
