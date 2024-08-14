package com.wholesaled.authentification.otp.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wholesaled.authentification.exception.InvalidCredentialsException;
import com.wholesaled.authentification.otp.dto.ForgetPasswordDto;
import com.wholesaled.authentification.otp.dto.OtpDto;
import com.wholesaled.authentification.otp.dto.requestOtpDto;
import com.wholesaled.authentification.otp.dto.validatePasswordOtp;
import com.wholesaled.authentification.otp.service.OtpService;
import com.wholesaled.authentification.reponse.LoginResponse;
import com.wholesaled.authentification.reponse.MessageResponse;
import com.wholesaled.authentification.repository.UserRepository;

@RestController
@RequestMapping("/api/auth-client/otp")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8082"})

public class OtpController {
    @Autowired
    private OtpService otpService;
    @Autowired
    private UserRepository userRepository;
   

    //
        Logger logger = LoggerFactory.getLogger(OtpController.class);

    //
    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody requestOtpDto email) {
        logger.info("Received OTP request for email: {}", email.getEmail());
        otpService.generateOtp(email.getEmail());
        return ResponseEntity.ok(new MessageResponse("OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpDto otp) {
        logger.info("Received OTP verification request");
        try {
            boolean valid = otpService.validateOtp(otp);
            if (valid) {
                return ResponseEntity.ok(new MessageResponse("OTP verified successfully"));
            }
            
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid OTP"));
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Invalid OTP"));

    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgetPassword(@RequestBody requestOtpDto email) {
        if (userRepository.existsByEmail(email.getEmail())) {
            otpService.generateOtp(email.getEmail());
            return ResponseEntity.ok(new MessageResponse("OTP sent successfully"));
        }
        else{
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid email"));
        }}

    @PostMapping("/verify-password-otp")
    public ResponseEntity<?> verifyPasswordOtp(@RequestBody OtpDto otp) {
        try {
            validatePasswordOtp valid = otpService.validatePasswordOtp(otp);
            if (valid.getMessage() == "Password Otp is valid" && valid.getToken() != null) {
                return ResponseEntity.ok(valid);
            }
            
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid OTP"));
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Invalid OTP"));

    }
    
    
        @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ForgetPasswordDto forgetPasswordDto) {
        try {
            LoginResponse messageResponse = otpService.resetPassword(forgetPasswordDto);
            return ResponseEntity.ok(messageResponse);
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    
    

}
