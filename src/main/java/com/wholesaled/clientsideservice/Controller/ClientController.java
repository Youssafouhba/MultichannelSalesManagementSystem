package com.wholesaled.clientsideservice.Controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wholesaled.authentification.Service.UserService;
import com.wholesaled.authentification.model.User;
import com.wholesaled.authentification.repository.UserRepository;
import com.wholesaled.clientsideservice.Dto.RequestTradeCustomerDto;
import com.wholesaled.clientsideservice.Dto.UserDto;
import com.wholesaled.clientsideservice.Fiegn.TradeCustomerClient;
import com.wholesaled.clientsideservice.Model.Cart;
import com.wholesaled.clientsideservice.Model.Order1;
import com.wholesaled.clientsideservice.Model.Product;
import com.wholesaled.clientsideservice.Service.CartService;
import com.wholesaled.clientsideservice.Service.OrderService;
import com.wholesaled.clientsideservice.Service.ProductService;
import com.wholesaled.clientsideservice.exception.UserDeletionException;
import com.wholesaled.security.UserPrincipal;

import feign.FeignException.FeignClientException;
import lombok.AllArgsConstructor;




@RestController
@RequestMapping("/api/client")
@AllArgsConstructor
public class ClientController {


    private final ProductService productService;
    private final CartService cartService;
    private final UserService userService;
    private final OrderService orderService;
    private final TradeCustomerClient tradeCustomerClient;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;



    @PostMapping("/addToFavorite/{product_id}")
    public ResponseEntity<?> addProductToFavorite(@PathVariable Long product_id) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Product product = productService.getProductById(product_id);
        if (userPrincipal != null && product != null) {
            User user = userService.getClientById(userPrincipal.getUserId());
            if (user.getFavoriteProducts() == null) {
                user.setFavoriteProducts(List.of(product));
            } else if(!user.getFavoriteProducts().contains(product)) {
                user.getFavoriteProducts().add(product);
            }
            else{
                return ResponseEntity.badRequest().body("Product already added to favorite");
            }
            userService.Update(user);
            return ResponseEntity.ok("Product added to favorite successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to add product to favorite");
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody UserDto userDto) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (userPrincipal != null) {
            User user = userService.getClientById(userPrincipal.getUserId());
            user.setEmail(userDto.getEmail());
            user.setFullName(userDto.getFullName());
            user.setPhoneNumber(userDto.getPhoneNumber());
            userService.Update(user);
            return ResponseEntity.ok("Profile updated successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to update profile");
        }
    }

    @GetMapping("/getMyFavoriteProducts")
    public ResponseEntity<?> getMyFavoriteProducts() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (userPrincipal != null) {
            List<Product> favProducts = userService.getClientById(userPrincipal.getUserId()).getFavoriteProducts();
            if (favProducts == null) {
                return ResponseEntity.ok(List.of());
            }
            return ResponseEntity.ok(favProducts);
        } else {
            return ResponseEntity.badRequest().body("Failed to get favorite products");
        }
    }



    @GetMapping("/isFavorite/{productid}")
    public ResponseEntity<?> isFavorite(@PathVariable Long productid) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(userPrincipal!= null){
            List<Product> favProducts = userService.getClientById(userPrincipal.getUserId()).getFavoriteProducts();
            if (favProducts == null) {
                return ResponseEntity.ok(List.of());
            }
            if (favProducts.contains(productService.getProductById(productid))) {
                return ResponseEntity.ok(true);
            }

            return ResponseEntity.ok(false);
        } else {
            return ResponseEntity.badRequest().body("Failed to get favorite products");
        }
    }

    @DeleteMapping("/deleteFromFavorite/{product_id}")
    public ResponseEntity<?> deleteProductFromFavorite(@PathVariable Long product_id) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Product product = productService.getProductById(product_id);
        if (userPrincipal != null && product != null) {
            User user = userService.getClientById(userPrincipal.getUserId());
            if (user.getFavoriteProducts() == null) {
                user.setFavoriteProducts(List.of(product));
            } else {
                user.getFavoriteProducts().remove(product);
            }
            userService.Update(user);
            return ResponseEntity.ok("Product Deleted from favorite successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to add product to favorite");
        }
        }

    @GetMapping("/getMyOrders")
    public ResponseEntity<?> getMyOrders() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (userPrincipal != null) {
            List<Order1> myOrders = orderService.getClientOrders(userPrincipal.getUserId());
            return ResponseEntity.ok(myOrders);
        } else {
            return ResponseEntity.badRequest().body("Failed to get your orders");
        }
    }

    @GetMapping("/getMyCart")
    public ResponseEntity<?> getMyCart() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (userPrincipal != null) {
            Cart cart = cartService.getCartByClientId(userPrincipal.getUserId());
            return ResponseEntity.ok(cart.getCartElements());
        } else {
            return ResponseEntity.badRequest().body("Failed to get your orders");
        }
    }
    
    @GetMapping("/getMyProfil")
    public ResponseEntity<?> getMyProfil() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (userPrincipal != null) {
            User myUser = userService.getClientById(userPrincipal.getUserId());
            return ResponseEntity.ok(modelMapper.map(myUser, UserDto.class));
        } else {
            return ResponseEntity.badRequest().body("Failed to get your profil");
        }
    }
    
    @DeleteMapping()
    public ResponseEntity<?> deleteClient() throws UserDeletionException {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (userPrincipal != null) {
            userService.Delete(userPrincipal.getUserId());
            return ResponseEntity.ok().body("Utilisateur supprimé avec succès");
        }
        else{
            System.out.println("Failed to delete your profil");
            return  ResponseEntity.badRequest().body("Failed to delete your profil");
        }
    }

    
    @PreAuthorize("hasRole('SuperAdmin')")
    @PostMapping("/set-trade-customer/{userId}")
    public ResponseEntity<String> setUserToTradeCustomer(@PathVariable(value = "userId") Long userId) {
        userService.setUserToTradeCustomer(userId);
        return ResponseEntity.ok("User set to trade customer successfully.");
    }

    @PreAuthorize("hasRole('Client')")
    @PostMapping("/request-trade-customer")
    public ResponseEntity<?> requestTradeCustomer(@RequestBody RequestTradeCustomerDto request) {
        

            try {
                ResponseEntity<String> response = tradeCustomerClient.requestTradeCustomer(request);
            } catch (FeignClientException e) {
                if (e.status() != 200) {
                    return ResponseEntity.status(e.status()).body("Failed to Request , please try again ");
                }
                
            }
            return ResponseEntity.ok("Trade customer request submitted successfully.");
            }
           
    @PreAuthorize("hasRole('SuperAdmin')")
    @GetMapping("/getAllClient")
    public ResponseEntity<?> getAllClient() {

        
        return ResponseEntity.ok(userRepository.findAll()) ;
    }



}
