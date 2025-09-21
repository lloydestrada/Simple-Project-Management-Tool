package com.simple.pmtool.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.HashMap;

@Component
public class JwtUtil {

    private static final long EXPIRATION_TIME = 86400000L * 5; // 5 days

    // 512-bit (64-byte) Base64 secret for HS512
    private static final String SECRET_BASE64 = "+wb8Y90ydoEA57TfdaR3BM7rwXpkkxwk6Wvg0f4HdR0vj/DSsxUgyDuDlbAAoUUBOAWskv+YmkCWOPTZyxdmhA==";

    private final Key key;

    public JwtUtil() {
        byte[] decoded = Base64.getDecoder().decode(SECRET_BASE64);
        this.key = Keys.hmacShaKeyFor(decoded); // HS512 key
    }

    //  Generate JWT with userId + role
    public String generateToken(String userId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    // Extract userId (subject)
    public String extractUserId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Extract role from JWT claims
    public String extractRole(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    // Validate JWT
    public boolean validateToken(String token, String userId) {
        try {
            String extractedUser = extractUserId(token);
            return extractedUser.equals(userId) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }
}
