package com.wholesaled.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableHystrix
@RequiredArgsConstructor
public class GatewayConfig {

    private final AuthenticationFilter filter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-client-service", r -> r.path("/api/auth/**")
                   //     .filters(f -> f.filter(filter))
                        .uri("lb://auth-client-service"))
                .route("messaging-service", r -> r.path("/send/**","/get/**").filters(f-> f.filter(filter))
                .uri("lb://messaging-service"))
                .route("auth-admin-service", r -> r.path("/api/auth/**")
                    .uri("lb://auth-admin-service"))
                .build();
    }

}