
package com.resumeai.dto;

import java.util.List;

public record ResumeAnalysis(

    List<String> matchingSkills,

    List<String> missingSkills,

    String experienceAssessment,

    String educationAssessment,

    String candidateSummary,

    List<String> evidence,

    Boolean experienceMeetsRequirement,

    Boolean educationMeetsRequirement

) {
}
