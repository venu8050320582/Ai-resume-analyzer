
package com.resumeai.dto;

public record ResumeScore(
    int totalScore,
    int skillScore,
    int experienceScore,
    int educationScore,
    int availableWeight,
    String explanation
) {
}
