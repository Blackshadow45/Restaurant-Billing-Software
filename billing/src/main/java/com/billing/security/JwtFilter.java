package com.billing.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

   @Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getServletPath();
    return path.startsWith("/restaurants/login")
        || path.startsWith("/restaurants/register");
}


   @Override
protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain)
        throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
    }

    String token = authHeader.substring(7);

    if (!jwtUtil.validateToken(token)) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
    }

    // ✅ THIS IS THE MISSING PIECE
    UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(
                    "authenticatedUser",
                    null,
                    Collections.emptyList()
            );

    SecurityContextHolder.getContext().setAuthentication(authentication);

    filterChain.doFilter(request, response);
}
}