package com.wholesaled.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailService customUserDetailService;
    private final UnauthorizedHandler unauthorizedHandler;

    @Bean
    public SecurityFilterChain applicationSecurity(HttpSecurity http) throws Exception {
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        http
            .cors(AbstractHttpConfigurer::disable)
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .formLogin(AbstractHttpConfigurer::disable)
            .exceptionHandling(h -> h.authenticationEntryPoint(unauthorizedHandler))
            .securityMatcher("/**")
            .authorizeHttpRequests(registry -> registry
                    .requestMatchers("/").permitAll()
                    .requestMatchers("/api/subscribe").permitAll()
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/Comments/**").permitAll()
                    .requestMatchers("/api/auth-client/otp/forgot-password").permitAll()
                    .requestMatchers("/api/auth-client/otp/reset-password").hasAnyRole("client")
                    .requestMatchers("/api/auth-client/otp/verify-password-otp").permitAll()
                    .requestMatchers(HttpMethod.OPTIONS,"**").permitAll()
                    .requestMatchers(HttpMethod.OPTIONS,"/api/auth-client/otp/**").permitAll()
                    .requestMatchers(HttpMethod.GET,"/api/Products/**").permitAll()
                    .requestMatchers(HttpMethod.POST,"/api/Products/**").hasAnyRole("Admin","SuperAdmin")
                    .requestMatchers(HttpMethod.PUT,"/api/Products/**").hasAnyRole("Admin","SuperAdmin")
                    .requestMatchers(HttpMethod.DELETE,"/api/Products/**").hasAnyRole("Admin","SuperAdmin")
                    .requestMatchers(HttpMethod.OPTIONS,"**").permitAll()
                    .requestMatchers("/api/adMin/notification/mynotif").permitAll()
                    .requestMatchers("/notifications/**").permitAll() // for webSocket
                    .requestMatchers("/api/adMin/*").hasAnyRole("Admin","SuperAdmin")
                    .requestMatchers("/api/adMin/set-trade-customer/**").permitAll()
                    .requestMatchers("/api/client/getAllClient").hasAnyRole("Admin","SuperAdmin")
                    .anyRequest().authenticated()
            );
            
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        var builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder
                .userDetailsService(customUserDetailService)
                .passwordEncoder(passwordEncoder());
        return builder.build();
    }}