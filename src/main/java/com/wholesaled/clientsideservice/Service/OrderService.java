package com.wholesaled.clientsideservice.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.wholesaled.Notification.NotificationDto;
import com.wholesaled.Notification.NotificationService;
import com.wholesaled.authentification.Service.UserService;
import com.wholesaled.clientsideservice.Model.Cart;
import com.wholesaled.clientsideservice.Model.CartElement;
import com.wholesaled.clientsideservice.Model.Images;
import com.wholesaled.clientsideservice.Model.Order1;
import com.wholesaled.clientsideservice.Model.OrderElement;
import com.wholesaled.clientsideservice.Model.Product;
import com.wholesaled.clientsideservice.Repository.CartRepository;
import com.wholesaled.clientsideservice.Repository.OrderElementRepository;
import com.wholesaled.clientsideservice.Repository.OrderRepository;
import com.wholesaled.clientsideservice.Repository.ProductRepository;
import com.wholesaled.clientsideservice.adminOrder.AdminOrderService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    private final OrderElementRepository orderElementRepository;

    private final CartRepository cartRepository;

    private final CartService cartService;

    private final ProductRepository productRepository;

    private final EntityManager entityManager;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final UserService userService;
    private final NotificationService notificationService; // for notification user whene Order
    private final AdminOrderService adminOrderService;

    public List<Order1> getClientOrders(Long clientId) {
        return orderRepository.findOrder1sByUser_Id(clientId);
    }

    public Order1 createOrderFromCart(Long clientId,Order1 order1){

        Cart cart = cartRepository.findCartByClientId(clientId);

        Order1 order = new Order1();
        order.setTotalAmount(cart.getTotal_amount());
        order.setUser(cart.getClient());
        double totalAmount =0;
        List<OrderElement> orderItems = new ArrayList<>();
        for (CartElement cartElement : cart.getCartElements()) {
            OrderElement orderElement = new OrderElement();
            orderElement.setQuantity(cartElement.getQuantity());
            orderElement.setProduct(cartElement.getProduct());
            orderElement.setSub_total(cartElement.getSub_total());
            orderElement.setOrder(order);
            orderItems.add(orderElement);
            totalAmount += cartElement.getSub_total();
        }
        order.setTotalAmount(totalAmount);
        System.out.println(totalAmount);
        order.setOrderItems(orderItems);
        order.setCreationDate(new Date());
        order.setStatus("Pending");
        order.setAdresse(order1.getAdresse());
        order.setShepingDate(order1.getShepingDate());
        order.setPaymentMethod(order1.getPaymentMethod());
        Order1 savOrder= orderRepository.save(order);

        cartService.clearCart(cart);
        String message = String.format("Hello! Your order with ID %s has been successfully placed. We are currently processing it and will keep you updated on its status.\n\nOrder Summary:\n\n Total: %s\n Shipping Address: %s", order.getId(), order.getTotalAmount(), order.getAdresse());

        try {
            notificationService.sendPrivateNotification(NotificationDto.builder()
                    .title("Your Order Has Been Placed")
                    .message(message)
                    .userId(clientId)
                    .build());
            ObjectUpdateMessage message1 = new ObjectUpdateMessage(savOrder, "add");
            messagingTemplate.convertAndSendToUser(order.getUser().getId().toString(), "/queue/orders", message1);
            message1.setObject(adminOrderService.convertToDto(savOrder));

            messagingTemplate.convertAndSendToUser("SuperAdmin", "/updates/order", message1);
        } catch (Exception e) {

            // TODO: handle exception
        }

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
                        // Instead of merging, we'll just ensure the image is associated with the object
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
            ObjectUpdateMessage message1 = new ObjectUpdateMessage(order, "add");
            messagingTemplate.convertAndSendToUser(order.getUser().getId().toString(), "/updates/order", message1);
            message1.setObject(adminOrderService.convertToDto(order));

            messagingTemplate.convertAndSendToUser("SuperAdmin", "/updates/order", message1);
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
