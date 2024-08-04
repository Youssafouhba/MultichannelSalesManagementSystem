package com.wholesaled.messagin.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.wholesaled.messagin.payloads.UserDto;
import com.wholesaled.messagin.util.JWTDecoder;

@RestController
public class JwtController {



    @GetMapping("/get")
    public ResponseEntity<?> getMethodName(@RequestHeader(value = "Authorization", required = false) String token) {
        String jwt = extractTokenFromRequest(token);
        if (jwt == null) {
            return ResponseEntity.badRequest().body(new UserDto());
        }

        try {
            // Validate the JWT token
          //  jwtValidator.validate(jwt);
          JWTDecoder jwtValidator  = new JWTDecoder(jwt);

            // Extract claims from the validated token
            String email = jwtValidator.getClaim("email").asString();
            Long userId = jwtValidator.getClaim("userid").asLong();
            List<String> role = jwtValidator.getClaim("role").asList(String.class);
            System.out.println("email : "+email);
            System.out.println("userId : "+userId);
            System.out.println("role : "+role);
            // Create and return the UserDto
            return ResponseEntity.ok("ggg");
        } catch (Exception e) {
            // Handle JWT validation errors
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new UserDto());
        }
    }

    private String extractTokenFromRequest(String token) {
        if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return null;
    }
}
