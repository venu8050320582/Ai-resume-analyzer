
package com.resumeai.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.resumeai.entity.AppUser;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // Generate signing key
    private SecretKey getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(secretKey);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate JWT token
    public String generateToken(AppUser user) {

        Map<String, Object> claims = new HashMap<>();

        claims.put("role", user.getRole().name());
        claims.put("userId", user.getId());

        return Jwts.builder()
                .claims(claims)
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(
                    new Date(System.currentTimeMillis() + jwtExpiration)
                )
                .signWith(getSigningKey())
                .compact();
    }

    // Extract all claims and verify signature
    public Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Extract email
    public String extractEmail(String token) {

        return extractAllClaims(token).getSubject();
    }

    // Extract expiration
    public Date extractExpiration(String token) {

        return extractAllClaims(token).getExpiration();
    }

    // Check expiration
    private boolean isTokenExpired(String token) {

        return extractExpiration(token).before(new Date());
    }

    // Validate token
    public boolean isTokenValid(String token, String email) {

        try {

            String tokenEmail = extractEmail(token);

            return tokenEmail != null
                    && tokenEmail.equals(email)
                    && !isTokenExpired(token);

        } catch (JwtException | IllegalArgumentException exception) {

            return false;
        }
    }

    // Extract role
    public String extractRole(String token) {

        return extractAllClaims(token).get("role", String.class);
    }
}
