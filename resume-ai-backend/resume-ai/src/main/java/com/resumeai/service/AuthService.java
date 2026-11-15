
package com.resumeai.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.resumeai.dto.LoginRequest;
import com.resumeai.dto.LoginResponse;
import com.resumeai.dto.RegisterRequest;
import com.resumeai.dto.RegisterResponse;

import com.resumeai.entity.AppUser;
import com.resumeai.entity.UserRole;

import com.resumeai.repository.AppUserRepository;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Constructor injection
    public AuthService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // USER REGISTRATION
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        AppUser user = new AppUser();

        user.setFullName(request.fullName());
        user.setEmail(request.email());

        user.setPassword(
                passwordEncoder.encode(request.password())
        );

        user.setRole(UserRole.RECRUITER);

        AppUser savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                "Registration successful"
        );
    }

    // USER LOGIN + JWT TOKEN GENERATION
    public LoginResponse login(LoginRequest request) {

        AppUser user = userRepository
                .findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        // Verify password using BCrypt
        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);

        return new LoginResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                token,
                "Login successful"
        );
    }
}
