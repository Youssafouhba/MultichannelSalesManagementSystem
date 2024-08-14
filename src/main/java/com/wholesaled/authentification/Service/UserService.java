package com.wholesaled.authentification.Service;

import com.wholesaled.clientsideservice.exception.UserDeletionException;
import org.springframework.http.ResponseEntity;

import com.wholesaled.authentification.dto.UserLoginDto;
import com.wholesaled.authentification.dto.UserRegistrationDto;
import com.wholesaled.authentification.model.User;
import com.wholesaled.authentification.reponse.LoginResponse;

public interface UserService {
    LoginResponse register(UserRegistrationDto userRegistrationDto);
    LoginResponse login(UserLoginDto userLoginDto);
    User getClientById(Long id);
    User Update(User user);
    ResponseEntity<?> Delete(Long id) throws UserDeletionException;
    ResponseEntity<String> setUserToTradeCustomer(Long userId) ;
    //MessageResponse requestOtp(String email);
   // MessageResponse verifyOtp(String email, String otp);
    //MessageResponse resetPassword(ForgetPasswordDto forgetPasswordDto);
}