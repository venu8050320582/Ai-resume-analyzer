
package com.resumeai.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.resumeai.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    // Skip JWT filter for login and registration
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        return path.startsWith("/api/auth/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader =
                request.getHeader("Authorization");

        System.out.println(
                "Authorization header received: " +
                (authHeader != null)
        );

        // Check Bearer token
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println("JWT TOKEN NOT RECEIVED");

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            // Extract email
            String email = jwtService.extractEmail(token);

            if (email != null &&
                    SecurityContextHolder.getContext()
                    .getAuthentication() == null) {

                // Validate token
                if (jwtService.isTokenValid(token, email)) {

                    String role = jwtService.extractRole(token);

                    if (!"ADMIN".equals(role) &&
                            !"RECRUITER".equals(role)) {

                        throw new IllegalArgumentException(
                                "Invalid user role in JWT"
                        );
                    }

                    var userDetails = User.withUsername(email)
                            .password("")
                            .authorities("ROLE_" + role)
                            .build();

                    var authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);

                    System.out.println("JWT TOKEN VALID");
                    System.out.println("Logged in user: " + email);
                    System.out.println("User role: " + role);
                }
            }

        } catch (io.jsonwebtoken.JwtException |
                 IllegalArgumentException exception) {

            SecurityContextHolder.clearContext();

            System.out.println(
                    "JWT VALIDATION FAILED: " +
                    exception.getMessage()
            );
        }

        filterChain.doFilter(request, response);
    }
}
