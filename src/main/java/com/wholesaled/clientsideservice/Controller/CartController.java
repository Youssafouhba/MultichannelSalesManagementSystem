package com.wholesaled.clientsideservice.Controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.wholesaled.clientsideservice.Model.Cart;
import com.wholesaled.clientsideservice.Model.CartElement;
import com.wholesaled.clientsideservice.Service.CartElementService;
import com.wholesaled.clientsideservice.Service.CartService;
import com.wholesaled.clientsideservice.Service.ProductService;

import lombok.AllArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/Cart")
@AllArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8082"})
public class CartController {

    private final CartService cartService;

    private final CartElementService cartElementService;

    private final ProductService productService;


    @GetMapping
    public List<Cart> getCart(){
        return cartService.getAllCarts();
    }

    @PostMapping(value = "/{clientId}")
    public ResponseEntity<?> addElementToCart(
            @RequestBody Cart cart,
            @PathVariable("clientId") Long clientId){
        cartService.addCart(cart,clientId);
        return ResponseEntity.ok("OK");
    }

    @DeleteMapping("/{clientId1}")
    public ResponseEntity<?> deleteCartElement(@PathVariable("clientId1") Long clientId){
        cartService.deleteCartById(clientId);
        return ResponseEntity.ok("card cleaned success");
    }

}
