package com.wholesaled.authentification.Service.Impl;

import com.wholesaled.stockManagement.Feign.ClientSideProducts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wholesaled.authentification.Service.UserService;
import com.wholesaled.authentification.dto.UserLoginDto;
import com.wholesaled.authentification.dto.UserRegistrationDto;
import com.wholesaled.authentification.exception.InvalidCredentialsException;
import com.wholesaled.authentification.exception.UserNotFoundException;
import com.wholesaled.authentification.model.User;
import com.wholesaled.authentification.reponse.LoginResponse;
import com.wholesaled.authentification.reponse.MessageResponse;
import com.wholesaled.authentification.repository.UserRepository;
import com.wholesaled.security.JwtIssuer;
import com.wholesaled.security.UserPrincipal;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private  JwtIssuer jwtIssuer;
    @Autowired
    private ClientSideProducts clientSideProducts;
    @Autowired
    private  AuthenticationManager authenticationManager;


    @Override
    public MessageResponse register(UserRegistrationDto userRegistrationDto) {
        if (userRepository.existsByEmail(userRegistrationDto.getEmail())) {
            throw new RuntimeException("Error: Email is already taken!");
        }
        else{
            
        User user = User.builder()
                .fullName(userRegistrationDto.getFullName())
                .email(userRegistrationDto.getEmail())
                .password(passwordEncoder.encode(userRegistrationDto.getPassword()))

                //.role() // 
                .build();
                user.setRole(userRegistrationDto.getRole());
        userRepository.save(user);
        return new MessageResponse("Admin registered successfully!");


    }
    }
    @Override
    public LoginResponse login(UserLoginDto userLoginDto) throws UserNotFoundException, InvalidCredentialsException {
        User user = userRepository.findByEmail(userLoginDto.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Admin not found with email: " + userLoginDto.getEmail()));

        if (!passwordEncoder.matches(userLoginDto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");

        }
        System.out.println("is called attemptLogin");
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userLoginDto.getEmail(), userLoginDto.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        var principal = (UserPrincipal) authentication.getPrincipal();

        var token = jwtIssuer.issue(JwtIssuer.Request.builder()
                .userId(principal.getUserId())
                .email(principal.getEmail())
                .roles(principal.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList())
                .build());
        System.out.println("token");
        System.out.println(token);
        if (token == null) {
             throw new InvalidCredentialsException("Error in token ");
        }

        return new LoginResponse("Login successful",token);
    }

    public boolean isInviteCodeValid(String inviteCode) {
        return true;
    }
    
        
}