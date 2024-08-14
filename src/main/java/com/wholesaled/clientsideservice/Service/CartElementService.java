package com.wholesaled.clientsideservice.Service;

import org.springframework.stereotype.Service;

import com.wholesaled.clientsideservice.Model.Cart;
import com.wholesaled.clientsideservice.Model.CartElement;
import com.wholesaled.clientsideservice.Model.Product;
import com.wholesaled.clientsideservice.Repository.CartElementRepository;
import com.wholesaled.clientsideservice.Repository.CartRepository;
import com.wholesaled.clientsideservice.exception.NotFoundException;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CartElementService {

    private final CartElementRepository cartElementRepository;

    private final CartRepository cartRepository;

    public CartElement addCartElement(Cart cart,Product product,int quantity){
        CartElement cartElement = new CartElement();
        cartElement.setCart(cart);
        cartElement.setProduct(product);
        cartElement.setQuantity(quantity);
        cartElement.setSub_total(quantity*product.getPriceAfterDiscount()); ///  object.getPrice()   object.getPriceAfetDiscount()
        cart.setTotal_amount(cart.getTotal_amount() + cartElement.getSub_total());
        return cartElementRepository.save(cartElement);
    }

    public void deleteElementById(Long id) {
        cartElementRepository.deleteById(id);
    }

    public CartElement getCartElementById(Long id) {
        return cartElementRepository.findById(id).orElseThrow(() -> new NotFoundException("CartElement not found"));
    }
}
