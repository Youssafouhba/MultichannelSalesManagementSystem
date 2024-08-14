package com.wholesaled.clientsideservice.adminOrder;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;





@RestController
@RequestMapping("/api/adMin/Orders")
@AllArgsConstructor
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping("/getAllOrders")
    public ResponseEntity<?> getAllOrders() {
        return adminOrderService.getAllOrders();
    }

    @GetMapping("/getPendingOrders")
    public ResponseEntity<?> getPendingOrder(){
        return adminOrderService.getPendingOrders();
    }


    @PostMapping("/delivered/{order_id}")
    public ResponseEntity<?> deliveredOrder(@PathVariable Long order_id) {
        //TODO: process POST request
        
        return adminOrderService.reviewOrder(order_id,"delivered");

    }


    @PostMapping("/cancelled/{order_id}")
    public ResponseEntity<?> cancelledOrder(@PathVariable Long order_id) {
        //TODO: process POST request
        
        return adminOrderService.reviewOrder(order_id,"cancelled");

    }
    
    @PostMapping("/pickedUp/{order_id}")
    public ResponseEntity<?> postMethodName(@PathVariable Long order_id) {
        //TODO: process POST request
        
        return adminOrderService.reviewOrder(order_id,"picked up");

    }
    
    



}
