package com.wholesaled.authentification.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wholesaled.authentification.Service.UserService;
import com.wholesaled.authentification.dto.UserLoginDto;
import com.wholesaled.authentification.dto.UserRegistrationDto;
import com.wholesaled.authentification.exception.InvalidCredentialsException;
import com.wholesaled.authentification.exception.UserNotFoundException;
import com.wholesaled.authentification.reponse.LoginResponse;
import com.wholesaled.authentification.reponse.MessageResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:8081" )
public class AuthController {
    private final UserService userService;

    @PostMapping("/singin")
    public ResponseEntity<?>  login(@RequestBody @Validated UserLoginDto request) {
        
        try{
            LoginResponse loginResponse = userService.login(request);
            return ResponseEntity.ok(loginResponse);
        }
        catch(UserNotFoundException e ){
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
        catch(InvalidCredentialsException e){
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDto userRegistrationDto) {
        try {
            LoginResponse messageResponse = userService.register(userRegistrationDto);
            return ResponseEntity.ok(messageResponse);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
}