
package com.resumeai.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.resumeai.dto.ResumeAnalysis;

@Service
public class GeminiService {

    private final ChatClient chatClient;

    public GeminiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    // Step 6.3: Basic Gemini connection test
    public String askGemini(String message) {

        return chatClient
                .prompt()
                .user(message)
                .call()
                .content();
    }

    // Step 6.4: Analyze resume against job requirements
    public ResumeAnalysis analyzeResume(
            String resumeText,
            String jobTitle,
            String jobDescription,
            String requiredSkills,
            String experienceRequired,
            String educationRequirement) {


String prompt = """
        You are an AI assistant supporting a human recruiter.

        Analyze the candidate's resume against the job requirements.

        RULES:
        1. Use only information in the resume and job description.
        2. Never invent qualifications or experience.
        3. Identify matching and missing required skills.
        4. Do not use protected characteristics.
        5. Do not make a final hiring decision.
        6. Include evidence supporting your findings.

        EXPERIENCE:
        - Return true only when the resume provides evidence
          that the required experience is met.
        - Return false when available evidence shows it is not met.
        - Return null when there is insufficient information.

        EDUCATION:
        - Return true only when the stated education meets
          the job's education requirement.
        - Return false when available evidence shows it does not.
        - Return null when there is insufficient information.

        Return the result using the requested structured fields.

        JOB TITLE:
        """ + jobTitle + """

        JOB DESCRIPTION:
        """ + jobDescription + """

        REQUIRED SKILLS:
        """ + requiredSkills + """

        REQUIRED EXPERIENCE:
        """ + experienceRequired + """

        EDUCATION REQUIREMENT:
        """ + educationRequirement + """

        CANDIDATE RESUME:
        """ + resumeText;


return chatClient
        .prompt()
        .user(prompt)
        .call()
        .entity(ResumeAnalysis.class);
    }
}
