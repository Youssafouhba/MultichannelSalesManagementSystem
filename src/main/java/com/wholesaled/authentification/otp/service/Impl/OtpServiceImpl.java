package com.wholesaled.authentification.otp.service.Impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wholesaled.authentification.exception.InvalidCredentialsException;
import com.wholesaled.authentification.model.User;
import com.wholesaled.authentification.otp.dto.ForgetPasswordDto;
import com.wholesaled.authentification.otp.dto.OtpDto;
import com.wholesaled.authentification.otp.dto.validatePasswordOtp;
import com.wholesaled.authentification.otp.model.Otp;
import com.wholesaled.authentification.otp.repository.OtpRepository;
import com.wholesaled.authentification.otp.service.EmailService;
import com.wholesaled.authentification.otp.service.OtpService;
import com.wholesaled.authentification.reponse.LoginResponse;
import com.wholesaled.authentification.repository.UserRepository;
import com.wholesaled.security.JwtIssuer;
import com.wholesaled.security.UserPrincipal;


@Service
public class OtpServiceImpl implements OtpService {

    @Autowired
    private OtpRepository otpRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private  JwtIssuer jwtIssuer;

    @Override
    public void generateOtp(String email) {
        String otp = String.valueOf(new Random().nextInt(999999));
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(15);
        if (otpRepository.findByEmail(email).isPresent()) {
            
            Otp otpEntity = otpRepository.findByEmail(email).get();
            otpEntity.setOtp(otp);
            otpEntity.setExpirationTime(expirationTime);
            otpRepository.save(otpEntity);

        }
        else{
        Otp otpEntity = Otp.builder()
                .email(email)
                .otp(otp)
                .expirationTime(expirationTime)
                .build();

        otpRepository.save(otpEntity);

        // Send OTP via email (omitted for brevity)
        emailService.sendOtpEmail(email,otp);
        }
    }

    @Override
    public boolean validateOtp(OtpDto otpDto) {
        Otp otp = otpRepository.findByEmailAndOtp(otpDto.getEmail(), otpDto.getOtp())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid OTP"));
        boolean isOtpValid = otp.getExpirationTime().isAfter(LocalDateTime.now());
        if (isOtpValid) {
            otpRepository.delete(otp);
            userRepository.findByEmail(otpDto.getEmail()).ifPresent(user -> {
                user.setEmailVerified(true);
                userRepository.save(user);
            });
        }
        return isOtpValid;
    }
    @Override
    public validatePasswordOtp validatePasswordOtp(OtpDto otpDto) {

        Otp otp = otpRepository.findByEmailAndOtp(otpDto.getEmail(), otpDto.getOtp())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid OTP"));

        Optional<User> user = userRepository.findByEmail(otpDto.getEmail());
        boolean isOtpValid = otp.getExpirationTime().isAfter(LocalDateTime.now());
        if (isOtpValid && user.isPresent()) {
            return validatePasswordOtp.builder()
                    .message("Password Otp is valid")
                    .token(jwtIssuer.issue(JwtIssuer.Request.builder()
                            .userId(user.get().getId())
                            .email(user.get().getEmail())
                            .roles(List.of("client"))
                            .build())
                    )
                    .build();
                        
        }
        else{
            throw new InvalidCredentialsException("Invalid OTP");

        }
       
        
    }



    @Override
    public LoginResponse resetPassword(ForgetPasswordDto forgetPasswordDto) {
                UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        boolean isOtpValid = validateOtp(OtpDto.builder()
        .email(userPrincipal.getEmail())
        .otp(forgetPasswordDto.getOtp())
        .build());
        if (!isOtpValid) {
            throw new InvalidCredentialsException("Invalid OTP");
            
        } else {
            User user = userRepository.findByEmail(userPrincipal.getEmail())
                    .orElseThrow(() -> new InvalidCredentialsException("User not found"));

                    user.setPassword(passwordEncoder.encode(forgetPasswordDto.getPassword()));
                    userRepository.save(user);

        return new LoginResponse("Password reset successful",null);

        }
    }
}