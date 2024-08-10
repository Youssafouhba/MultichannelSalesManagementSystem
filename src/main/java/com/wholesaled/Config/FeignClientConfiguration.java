package com.wholesaled.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;

import com.wholesaled.security.JwtIssuer;
import com.wholesaled.security.JwtIssuer.Request;
import com.wholesaled.security.UserPrincipal;

import feign.RequestInterceptor;

@Configuration
public class FeignClientConfiguration {
    @Autowired
    private JwtIssuer jwtIssuer;


    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            // Assuming the JWT token is available in SecurityContextHolder
            UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String token = jwtIssuer.issue(Request.builder()
                    .userId(userPrincipal.getUserId())
                    .email(userPrincipal.getEmail())
                    .roles(userPrincipal.getAuthorities().stream().map(a -> a.getAuthority().replace("ROLE_", "")).toList())
                    .build());
            requestTemplate.header("Authorization", "Bearer " + token);
        };
    }
}
