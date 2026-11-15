
package com.resumeai.dto;

import com.resumeai.entity.UserRole;

public record RegisterResponse(
    Long id,
    String fullName,
    String email,
    UserRole role,
    String message
) {}
