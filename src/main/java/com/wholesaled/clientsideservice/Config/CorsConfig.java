package com.wholesaled.clientsideservice.Config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    final AppProperties appProperties;

    public CorsConfig(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Value("${client.url}/")
    private String CLIENT_URL;

    @Bean
    CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8082"));
        corsConfiguration.setAllowedHeaders(
                Arrays.asList(
                        "Origin",
                        "Access-Control-Allow-Origin",
                        "Content-Type",
                        "Accept",
                        "Authorization",
                        "Origin, Accept",
                        "X-Requested-With",
                        "Access-Control-Request-Method",
                        "Access-Control-Request-Headers",
                        "x-user-role"
                )
        );
        corsConfiguration.setExposedHeaders(
                Arrays.asList(
                        "Origin",
                        "Content-Type",
                        "Accept",
                        "Authorization",
                        "Access-Control-Allow-Origin",
                        "Access-Control-Allow-Origin",
                        "Access-Control-Allow-Credentials"
                )
        );
        corsConfiguration.setAllowedMethods(
                Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );
        var urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration(
                "/**",
                corsConfiguration
        );

        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/subscribe")
                        .allowedOrigins("http://localhost:8081") // Remplacez par l'URL de votre application React Native
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}