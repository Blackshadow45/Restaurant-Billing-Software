package com.billing.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // ✅ SECURE & VALID KEY
    private static final Key SECRET_KEY =
            Keys.hmacShaKeyFor(
                "billing-super-secret-key-which-is-very-secure-256bit"
                    .getBytes()
            );

    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hrs

    // 🔹 CREATE TOKEN
    public String generateToken(String restaurantId, String role) {

        return Jwts.builder()
                .setSubject(restaurantId)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // 🔹 EXTRACT RESTAURANT ID
    public String extractRestaurantId(String token) {
        return getClaims(token).getSubject();
    }

    // 🔹 EXTRACT ROLE
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // 🔹 VALIDATE TOKEN
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
