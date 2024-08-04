package com.wholesaled.messagin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.wholesaled.messagin.jwt.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
       private final JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    public SecurityFilterChain applicationSecurity(HttpSecurity http) throws Exception {
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        http
            .cors(AbstractHttpConfigurer::disable)
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .formLogin(AbstractHttpConfigurer::disable)
            .securityMatcher("/**")
            .authorizeHttpRequests(registry -> registry
                    .requestMatchers("/app/**").hasAnyRole("client","SuperAdmin")
                    .requestMatchers("/secured/chat").permitAll()
                    .requestMatchers("/secured/chat/**").permitAll()
                    .requestMatchers(HttpMethod.OPTIONS,"/getmyclientConversations").permitAll()
                    .requestMatchers("/getmyclientConversations").hasRole("client")
                    .requestMatchers("/getConversation").hasAnyRole("client","SuperAdmin")
                    .requestMatchers(HttpMethod.OPTIONS,"/getConversation/**").permitAll()
                    .requestMatchers(HttpMethod.OPTIONS,"**").permitAll()
                    .requestMatchers("/secured/chat/info").permitAll()

                    .requestMatchers("/getMyConversations").hasRole("SuperAdmin")
                    .anyRequest().authenticated()

            );
            return http.build();
    }


}
