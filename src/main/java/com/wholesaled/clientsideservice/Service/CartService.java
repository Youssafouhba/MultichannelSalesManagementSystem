package com.wholesaled.clientsideservice.Service;

import java.util.ArrayList;
import java.util.List;

import com.wholesaled.clientsideservice.Model.*;
import com.wholesaled.clientsideservice.Repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.wholesaled.authentification.Service.UserService;
import com.wholesaled.authentification.model.User;
import com.wholesaled.clientsideservice.Repository.CartRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CartService {

    private CartElementService cartElementService;

    private final CartRepository cartRepository;

    private final ProductRepository productRepository;

    private final EntityManager entityManager;

    private final UserService userService;

    public Cart getCartByClientId(Long clientId) {
        Cart cart = cartRepository.findCartByClientId(clientId);
        if(cart ==null){
            cart=new Cart();
            cart.setClient(userService.getClientById(clientId));
            cart.setTotal_amount(0.0);
            cartRepository.save(cart);
        }
        return cart;
    }

    @Transactional
    public void deleteCartById(Long id){
        cartRepository.deleteCartsByClient_Id(id);
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    @Transactional
    public void clearCart(Cart cart){
        cartRepository.delete(cart);
    }


    @Transactional
    public void addCart(Cart cart, Long clientId) {
        Cart existingCart = getCartByClientId(clientId);///new one

        if (existingCart.getCartElements() == null) {
            System.out.println("se1");
            System.out.println(cart.getCartElements().size());
            // New cart scenario


            existingCart.setTotal_amount(cart.getTotal_amount());

            List<CartElement> updatedCartElements = new ArrayList<>();

            for (CartElement newElement : cart.getCartElements()) {
                CartElement updatedElement = new CartElement();
                updatedElement.setQuantity(newElement.getQuantity());
                updatedElement.setSub_total(newElement.getSub_total());
                updatedElement.setCart(existingCart);

                // Attach existing Product
                Product existingProduct = productRepository.findById(newElement.getProduct().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Product not found"));
                updatedElement.setProduct(existingProduct);

                // Ensure images are attached
                for (Images image : existingProduct.getImageUrls()) {
                    if (image.getId() != null) {
                        entityManager.merge(image);
                    }
                }

                updatedCartElements.add(updatedElement);
            }
            existingCart.setCartElements(updatedCartElements);
            cartRepository.save(existingCart);
        } else {
            System.out.println("se2");
            // Existing cart scenario
            existingCart.setTotal_amount(existingCart.getTotal_amount() + cart.getTotal_amount());

            List<CartElement> updatedCartElements = new ArrayList<>();

            for (CartElement newElement : cart.getCartElements()) {
                CartElement updatedElement = new CartElement();
                updatedElement.setQuantity(newElement.getQuantity());
                updatedElement.setSub_total(newElement.getSub_total());
                updatedElement.setCart(existingCart);

                // Attach existing Product
                Product existingProduct = productRepository.findById(newElement.getProduct().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Product not found"));
                updatedElement.setProduct(existingProduct);

                // Ensure images are attached
                for (Images image : existingProduct.getImageUrls()) {
                    if (image.getId() != null) {
                        entityManager.merge(image);
                    }
                }

                updatedCartElements.add(updatedElement);
            }

            // Clear existing elements and add new ones
            existingCart.getCartElements().clear();
            existingCart.getCartElements().addAll(updatedCartElements);

            cartRepository.save(existingCart);
        }
    }

}
