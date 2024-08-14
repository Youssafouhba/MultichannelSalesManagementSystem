package com.wholesaled.security;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtIssuer {
    private final JwtProperties properties;

    public String issue(Request request) {
        var now = Instant.now();
        
        return JWT.create()
                .withSubject(String.valueOf(request.userId))
                .withIssuedAt(now)
                //.withExpiresAt(now.plus(properties.getTokenDuration()))
                .withClaim("userid",request.getUserId())
                .withClaim("email", request.getEmail())
                .withClaim("role", request.getRoles())
                .sign(Algorithm.HMAC256(properties.getSecretKey()));
    }

    @Getter
    @Builder
    @RequiredArgsConstructor
    public static class Request {
        private final Long userId;
        private final String email;
        private final List<String> roles;

    }
}
