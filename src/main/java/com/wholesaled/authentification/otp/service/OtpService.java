package com.wholesaled.authentification.otp.service;


import com.wholesaled.authentification.otp.dto.ForgetPasswordDto;
import com.wholesaled.authentification.otp.dto.OtpDto;
import com.wholesaled.authentification.otp.dto.validatePasswordOtp;
import com.wholesaled.authentification.reponse.LoginResponse;

public interface OtpService {
    void generateOtp(String email);
    boolean validateOtp(OtpDto otpDto);
    LoginResponse resetPassword(ForgetPasswordDto forgetPasswordDto);
    validatePasswordOtp validatePasswordOtp(OtpDto otpDto) ;
}

