package com.wholesaled.clientsideservice.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.wholesaled.clientsideservice.Model.*;
import com.wholesaled.clientsideservice.Repository.OrderElementRepository;
import com.wholesaled.clientsideservice.Repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Table;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.wholesaled.Notification.NotificationDto;
import com.wholesaled.Notification.NotificationService;
import com.wholesaled.authentification.Service.UserService;
import com.wholesaled.clientsideservice.Repository.OrderRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    private final OrderElementRepository orderElementRepository;

    private final CartService cartService;

    private final ProductRepository productRepository;

    private final EntityManager entityManager;



    private final UserService userService;
    private final NotificationService notificationService; // for notification user whene Order

    public List<Order1> getClientOrders(Long clientId) {
        return orderRepository.findOrder1sByUser_Id(clientId);
    }

    @Transactional
    public Order1 createOrderFromCart(Long clientId,Order1 order1){

        Cart cart = cartService.getCartByClientId(clientId);
        Order1 order = new Order1();
        order.setTotalAmount(cart.getTotal_amount());
        order.setUser(cart.getClient());
        List<OrderElement> orderItems = new ArrayList<>();
        for (CartElement cartElement : cart.getCartElements()) {
            OrderElement orderElement = new OrderElement();
            orderElement.setQuantity(cartElement.getQuantity());
            orderElement.setProduct(cartElement.getProduct());
            orderElement.setSub_total(cartElement.getSub_total());
            orderElement.setOrder(order);
            orderItems.add(orderElement);
        }
        order.setOrderItems(orderItems);
        order.setCreationDate(new Date());
        order.setStatus("Pending");
        order.setAdresse(order1.getAdresse());
        order.setShepingDate(order1.getShepingDate());
        order.setPaymentMethod(order1.getPaymentMethod());


        String message = String.format("Hello! Your order with ID %s has been successfully placed. We are currently processing it and will keep you updated on its status.\n\nOrder Summary:\n\n Total: %s\n Shipping Address: %s", order.getId(), order.getTotalAmount(), order.getAdresse());
        
        try {
            notificationService.sendPrivateNotification(NotificationDto.builder()
                    .title("Your Order Has Been Placed")
                    .message(message)
                    .userId(clientId)
                    .build());
        } catch (Exception e) {
            
            // TODO: handle exception
        }
        cartService.clearCart(cart);
        return orderRepository.save(order);
    }


    @Transactional
    public Order1 Reorder(Order1 order1, Long clientId) {
        Order1 order = new Order1();
        order.setTotalAmount(order1.getTotalAmount());
        order.setUser(userService.getClientById(clientId));
        order.setCreationDate(new Date());
        order.setStatus("Pending");
        order.setAdresse(order1.getAdresse());
        order.setShepingDate(order1.getShepingDate());
        order.setPaymentMethod(order1.getPaymentMethod());

        List<OrderElement> orderItems = new ArrayList<>();
        for (OrderElement cartElement : order1.getOrderItems()) {
            OrderElement orderElement = new OrderElement();
            orderElement.setQuantity(cartElement.getQuantity());
            orderElement.setSub_total(cartElement.getSub_total());
            orderElement.setOrder(order);

            Product product = productRepository.findById(cartElement.getProduct().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found"));
            orderElement.setProduct(product);

            // Ensure images are attached
            if (product.getImageUrls() != null) {
                for (Images image : product.getImageUrls()) {
                    if (image.getId() != null) {
                        // Instead of merging, we'll just ensure the image is associated with the product
                        image.setProduct(product);
                    }
                }
            }

            System.out.println(orderElement.getSub_total());
            orderItems.add(orderElement);
        }
        order.setOrderItems(orderItems);

        // Save the order first
        order = orderRepository.save(order);

        String message = String.format("Hello! Your order with ID %s has been successfully placed. We are currently processing it and will keep you updated on its status.\n\nOrder Summary:\n\n Total: %s\n Shipping Address: %s", order.getId(), order.getTotalAmount(), order.getAdresse());

        try {
            notificationService.sendPrivateNotification(NotificationDto.builder()
                    .title("Your Order Has Been Placed")
                    .message(message)
                    .userId(clientId)
                    .build());
        } catch (Exception e) {
            // Log the exception
            // logger.error("Failed to send notification", e);
        }
        return order;
    }

    public int getOrderElements(Long productId){
        return orderElementRepository.countOrderElementsByProductId(productId);
    }

}
