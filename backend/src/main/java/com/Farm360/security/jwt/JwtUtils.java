package com.Farm360.security.jwt;

import com.Farm360.utils.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    private final String jwtSecret = "FARM360_SECRET_KEY_FOR_JWT_MUST_BE_MIN_32_CHARS_LONG";
    private final int jwtExpirationMs = 86400000; // 1 day

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Generate JWT for OTP login
    public String generateToken(String phoneNumber, Role role) {

        return Jwts.builder()
                .setSubject(phoneNumber)
                .claim("role", role.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getPhoneNumberFromJwt(String token) {
        return parseClaims(token).getBody().getSubject();
    }

    public String getRoleFromJwt(String token) {
        return parseClaims(token).getBody().get("role", String.class);
    }

    public boolean validateJwtToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
    }
}
