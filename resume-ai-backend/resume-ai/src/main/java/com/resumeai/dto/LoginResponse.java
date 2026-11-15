package com.resumeai.dto;

import com.resumeai.entity.UserRole;

public record LoginResponse(
    Long id,
    String fullName,
    String email,
    UserRole role,
    String token,
    String message
) {}