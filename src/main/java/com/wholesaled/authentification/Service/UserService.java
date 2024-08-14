package com.wholesaled.authentification.Service;

import com.wholesaled.authentification.dto.UserLoginDto;
import com.wholesaled.authentification.dto.UserRegistrationDto;
import com.wholesaled.authentification.reponse.LoginResponse;
import com.wholesaled.authentification.reponse.MessageResponse;
import org.springframework.http.ResponseEntity;

public interface UserService {
    MessageResponse register(UserRegistrationDto userRegistrationDto);
    LoginResponse login(UserLoginDto userLoginDto);
   // MessageResponse requestOtp(String email);
   // MessageResponse verifyOtp(String email, String otp);
    //MessageResponse resetPassword(ForgetPasswordDto forgetPasswordDto);
}