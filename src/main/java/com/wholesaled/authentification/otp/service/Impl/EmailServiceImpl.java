package com.wholesaled.authentification.otp.service.Impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.wholesaled.authentification.otp.service.EmailService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class EmailServiceImpl implements EmailService {

    
    private final JavaMailSender emailSender;

    @Override
    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is: " + otp);
        emailSender.send(message);
    }
}