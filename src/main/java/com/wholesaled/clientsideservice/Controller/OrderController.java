package com.wholesaled.clientsideservice.Controller;

import com.wholesaled.clientsideservice.Model.Order1;
import com.wholesaled.clientsideservice.Model.OrderElement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.wholesaled.clientsideservice.Service.OrderService;

import lombok.AllArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/Order")
@AllArgsConstructor
@CrossOrigin(origins ="http://localhost:8081")
public class OrderController {

    private final OrderService orderService;


    @GetMapping("/{clientId}")
    public List<Order1> getOrder(@PathVariable("clientId") Long clientId) {
        return orderService.getClientOrders(clientId);
    }

    @PostMapping("/{clientId}")
    public Order1 display(@PathVariable("clientId") Long clientId, @RequestBody Order1 order){
        return orderService.createOrderFromCart(clientId,order);
    }

    @PostMapping("/reorder/{clientId}")
    public Order1 reorder(
            @PathVariable("clientId") Long clientId,@RequestBody Order1 order){
        return orderService.Reorder(order, clientId);
    }


}
