package com.wholesaled.authentification.Service.Impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.wholesaled.Notification.NotificationDto;
import com.wholesaled.Notification.NotificationService;
import com.wholesaled.Notification.NotificationUser;
import com.wholesaled.Notification.NotificationUserRepository;
import com.wholesaled.clientsideservice.Dto.UserDto;
import com.wholesaled.clientsideservice.Model.*;
import com.wholesaled.clientsideservice.Repository.*;
import com.wholesaled.clientsideservice.Service.CartService;
import com.wholesaled.clientsideservice.Service.ObjectUpdateMessage;
import com.wholesaled.clientsideservice.Service.OrderService;
import com.wholesaled.clientsideservice.exception.UserDeletionException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.wholesaled.authentification.repository.UserRepository;
import com.wholesaled.security.JwtIssuer;
import com.wholesaled.security.UserPrincipal;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final ModelMapper modelMapper;

    private final SimpMessagingTemplate messagingTemplate;

    private final OrderElementRepository orderElementRepository;

    private final UserRepository userRepository;

    private final OrderRepository orderRepository;

    private final CommentRepository commentRepository;
    private final NotificationUserRepository notificationUserRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    private  final JwtIssuer jwtIssuer;

    private final   AuthenticationManager authenticationManager;

    @Override
    public LoginResponse register(UserRegistrationDto userRegistrationDto) {
        if (userRepository.existsByEmail(userRegistrationDto.getEmail())) {
            throw new RuntimeException("Error: Email is already taken!");
        }
        else{
        User user = User.builder()
                .fullName(userRegistrationDto.getFullName())
                .email(userRegistrationDto.getEmail())
                .password(passwordEncoder.encode(userRegistrationDto.getPassword())) // Password hashing
                .phoneNumber(userRegistrationDto.getPhoneNumber())
                .emailVerified(false)
                .dateOfCreation(new Date())
                .build();
       User savedUser = userRepository.save(user);

       var token = jwtIssuer.issue(JwtIssuer.Request.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .roles(List.of("client"))
                .build());

       ObjectUpdateMessage message1 = new ObjectUpdateMessage(savedUser, "add");
       messagingTemplate.convertAndSendToUser("SuperAdmin", "/updates/client", message1);
 
        if (token == null) {
            throw new InvalidCredentialsException("Error in token ");
        }
        return new LoginResponse("User registered successfully!",token);


    }}
    @Override
    public UserInfos login(UserLoginDto userLoginDto) throws UserNotFoundException, InvalidCredentialsException {
        User user = userRepository.findByEmail(userLoginDto.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + userLoginDto.getEmail()));

        if (!passwordEncoder.matches(userLoginDto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Incorrect password !");

        }
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
        UserInfos myUser = getProfile(user.getId());
        myUser.setLoginResponse(new LoginResponse("Login successful",token));

        if (token == null) {
            throw new InvalidCredentialsException("Error in token ");
        }

        return myUser;
    }


    @Override
    public User getClientById(Long id){
        return userRepository.findById(id).orElseThrow();
    }

    @Override
    public UserInfos getProfile(Long id){
        List<Order1> myOrders = orderRepository.findOrder1sByUser_Id(id);
        User myUser =  userRepository.findById(id).orElseThrow();
        Cart cart = cartRepository.findCartByClientId(id);
        List<NotificationUser> myNotifications = notificationUserRepository.findByUserIdOrderByPostedDateDesc(id);
        if(cart ==null){
            cart=new Cart();
            cart.setClient(myUser);
            cart.setTotal_amount(0.0);
            cartRepository.save(cart);
        }
        return new UserInfos(modelMapper.map(myUser, UserDto.class),myUser.getFavoriteProducts().stream().map(ClientFavoriteProducts::getProduct).toList(),cart.getCartElements(),myOrders,myNotifications) ;
    }

    @Override
    public User Update(User user) {
        User savedUser = userRepository.save(user);
        ObjectUpdateMessage message1 = new ObjectUpdateMessage(savedUser, "update");
        messagingTemplate.convertAndSendToUser("SuperAdmin", "/updates/client", message1);
        return savedUser;
    }


    @Override
    @Transactional
    public ResponseEntity<?> Delete(Long id){
        List<Comment> commentList = commentRepository.findCommentsByUserId(id);
        for (Comment comment : commentList) {
            commentRepository.deleteCommentByUser_IdAndProductId(id,comment.getProduct().getId());
        }
        List<Order1> order1List = orderRepository.findOrder1sByUser_Id(id);
        for (Order1 order1 : order1List) {
            orderElementRepository.deleteOrderElementsByOrderId(order1.getId());
        }

        orderRepository.deleteByUserId(id);
        //userRepository.deleteById(id);
        return ResponseEntity.ok().body("Delete successful");
    }

    @PreAuthorize("hasRole('SuperAdmin')")
    @Override
    public ResponseEntity<String> setUserToTradeCustomer(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User tradeCustomer = user.get();
            tradeCustomer.setTradeCustomer(true);
            userRepository.save(tradeCustomer);
            return ResponseEntity.ok("User set to trade customer successfully.");
        
    }
        return ResponseEntity.badRequest().body("User not found.");
    }


        
}