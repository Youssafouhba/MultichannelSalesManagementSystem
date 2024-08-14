package com.wholesaled.clientsideservice.adminOrder;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.wholesaled.Notification.NotificationDto;
import com.wholesaled.Notification.NotificationService;
import com.wholesaled.clientsideservice.Model.Order1;
import com.wholesaled.clientsideservice.Repository.OrderRepository;
import com.wholesaled.clientsideservice.Service.ObjectUpdateMessage;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final NotificationService notificationService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ResponseEntity<?> getAllOrders() {
        List<Order1> orders = orderRepository.findAll();
        List<OrderDto> orderDtos = orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderDtos);
    }

    public ResponseEntity<?> getPendingOrders() {
        List<Order1> orders = orderRepository.findByStatus("Pending");
        List<OrderDto> orderDtos = orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderDtos);
    }

    public OrderDto convertToDto(Order1 order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setAdresse(order.getAdresse());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setStatus(order.getStatus());
        dto.setCreationDate(order.getCreationDate());
        dto.setShippingDate(order.getShepingDate());
        dto.setUserFullName(order.getUser().getFullName());
        return dto;
    }
    public ResponseEntity<?> reviewOrder(Long id, String status) {
        Optional<Order1> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isPresent()) {
            Order1 order = optionalOrder.get();
            if (order.getStatus().equalsIgnoreCase("Pending")) {
                order.setStatus(status);
                Order1 savedOne = orderRepository.save(order);

                // notify user
                String message = String.format("Thank you for your order! We've received your order for %s and are %s.\n\nOrder Summary:\n\n    Total: %s\n    Shipping Address: %s",
                        order.getId(), status, order.getTotalAmount(), order.getAdresse());
                ObjectUpdateMessage message1 = new ObjectUpdateMessage(savedOne, "update");
                messagingTemplate.convertAndSendToUser(order.getUser().getId().toString(), "/queue/orders", message1);
                message1.setObject(convertToDto(savedOne));
                messagingTemplate.convertAndSendToUser("SuperAdmin", "/updates/order", message1);

                notificationService.sendPrivateNotification(NotificationDto.builder()
                        .title("Your order is " + status)
                        .message(message)
                        .userId(order.getUser().getId())
                        .build());

                return ResponseEntity.ok(order);
            }
            return ResponseEntity.status(400).body("Order is already " + order.getStatus());

        } else {
            return ResponseEntity.status(404).body("Order not found");
        }
    }
}
