
package com.resumeai.service;

import org.springframework.stereotype.Service;

import com.resumeai.dto.ResumeAnalysis;
import com.resumeai.dto.ResumeScore;

@Service
public class ResumeScoringService {

    public ResumeScore calculateScore(ResumeAnalysis analysis) {

        // 60 points for technical skills
        int matching = analysis.matchingSkills() == null
                ? 0 : analysis.matchingSkills().size();

        int missing = analysis.missingSkills() == null
                ? 0 : analysis.missingSkills().size();

        int totalSkills = matching + missing;

        int skillScore = totalSkills == 0
                ? 0
                : (int) Math.round(
                    60.0 * matching / totalSkills
                );

        // 25 points for experience
        int experienceScore = Boolean.TRUE.equals(
                analysis.experienceMeetsRequirement()
        ) ? 25 : 0;

        // 15 points for education
        int educationScore = Boolean.TRUE.equals(
                analysis.educationMeetsRequirement()
        ) ? 15 : 0;

        // Unknown criteria are excluded from available weight
        int availableWeight = 60;

        if (analysis.experienceMeetsRequirement() != null) {
            availableWeight += 25;
        }

        if (analysis.educationMeetsRequirement() != null) {
            availableWeight += 15;
        }

        int rawScore = skillScore
                + experienceScore
                + educationScore;

        // Normalize score when a criterion is unknown
        int totalScore = availableWeight == 0
                ? 0
                : (int) Math.round(
                    rawScore * 100.0 / availableWeight
                );

        String explanation =
                "Skills: " + skillScore + "/60, " +
                "Experience: " + experienceScore + "/25, " +
                "Education: " + educationScore + "/15. " +
                "Available weight: " + availableWeight +
                "/100. Unknown criteria are excluded.";

        return new ResumeScore(
                totalScore,
                skillScore,
                experienceScore,
                educationScore,
                availableWeight,
                explanation
        );
    }
}
