package com.simple.pmtool.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return path != null && path.startsWith("/auth");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String userId = null;
        String role = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);

            try {
                userId = jwtUtil.extractUserId(jwt);
                role = jwtUtil.extractRole(jwt); // 👈 NEW: extract role
                boolean valid = jwtUtil.validateToken(jwt, userId);

                System.out.println("JWT received: " + jwt);
                System.out.println("Extracted userId: " + userId);
                System.out.println("Extracted role: " + role);
                System.out.println("Token valid? " + valid);

                if (!valid) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired JWT");
                    return;
                }

            } catch (Exception e) {
                System.out.println("JWT error: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT");
                return;
            }

            // Set authentication with role
            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                role != null
                                        ? Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                                        : Collections.emptyList()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } else {
            System.out.println("No Authorization header or invalid format (continuing filterChain)");
        }

        filterChain.doFilter(request, response);
    }


}
