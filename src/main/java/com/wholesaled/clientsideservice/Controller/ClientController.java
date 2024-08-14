package com.wholesaled.clientsideservice.Controller;

import java.util.List;

import com.wholesaled.clientsideservice.Model.*;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
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
        // Retrieve the current user from security context
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        // Retrieve the product by ID
        Product product = productService.getProductById(product_id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }

        // Retrieve the current user
        User user = userService.getClientById(userPrincipal.getUserId());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Check if the product is already in the user's favorite list
        List<ClientFavoriteProducts> favorites = user.getFavoriteProducts();
        boolean alreadyFavorite = favorites.stream()
                .anyMatch(cfp -> cfp.getProduct().equals(product));

        if (alreadyFavorite) {
            return ResponseEntity.badRequest().body("Product already added to favorite");
        }

        // Create a new favorite relationship
        ClientFavoriteProducts cfp = new ClientFavoriteProducts();
        cfp.setProduct(product);
        cfp.setUser(user);

        // Add the new favorite to the user's list
        favorites.add(cfp);
        user.setFavoriteProducts(favorites);

        // Save the updated user
        userService.Update(user);

        return ResponseEntity.ok("Product added to favorite successfully");
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
            List<Product> favProducts = userService.getClientById(userPrincipal.getUserId()).getFavoriteProducts().stream().map(ClientFavoriteProducts::getProduct).toList();
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
            List<Product> favProducts = userService.getClientById(userPrincipal.getUserId()).getFavoriteProducts().stream().map(ClientFavoriteProducts::getProduct).toList();
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
        // Retrieve the current user from security context
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        // Retrieve the product by ID
        Product product = productService.getProductById(product_id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }

        // Retrieve the current user
        User user = userService.getClientById(userPrincipal.getUserId());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Retrieve the list of favorite products
        List<ClientFavoriteProducts> favorites = user.getFavoriteProducts();
        ClientFavoriteProducts cfpToRemove = favorites.stream()
                .filter(cfp -> cfp.getProduct().equals(product))
                .findFirst()
                .orElse(null);

        if (cfpToRemove != null) {
            favorites.remove(cfpToRemove);
            userService.Update(user); // Save the updated user
            return ResponseEntity.ok("Product deleted from favorites successfully");
        } else {
            return ResponseEntity.badRequest().body("Product not found in favorites");
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
            UserInfos myUser = userService.getProfile(userPrincipal.getUserId());
            return ResponseEntity.ok(myUser);
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
