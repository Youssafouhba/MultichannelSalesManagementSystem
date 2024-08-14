package com.wholesaled.authentification.otp.service;

public interface EmailService {
    void sendOtpEmail(String to, String otp);

}
