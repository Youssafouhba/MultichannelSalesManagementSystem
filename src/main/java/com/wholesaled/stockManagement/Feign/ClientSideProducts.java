package com.wholesaled.stockManagement.Feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.wholesaled.Config.FeignClientConfiguration;
import com.wholesaled.stockManagement.Dto.NotificationDto;
import com.wholesaled.stockManagement.Dto.ProductDto;

@FeignClient(name = "AUTH-CLIENTSIDE-SERVICE", configuration = FeignClientConfiguration.class)
public interface ClientSideProducts {

    
    @PostMapping("/api/Products")
    ResponseEntity<String> createProduct(@RequestBody ProductDto product);

    @PutMapping("/api/Products")
    ResponseEntity<String> updateProduct(@RequestBody ProductDto product);

    @DeleteMapping("/api/Products/{id}")
    ResponseEntity<?> deleteProduct(@PathVariable("id") Long id);
    
    @PostMapping("/api/client/set-trade-customer/{userId}")
    ResponseEntity<String> setUserToTradeCustomer(@PathVariable(value = "userId") Long userId);


    @PostMapping("/api/adMin/notification/sendPrivateNotification")
    ResponseEntity<?> sendPrivateNotification(@RequestBody NotificationDto notificationDto);

    @PostMapping("/api/adMin/notification/sendPublicNotification")
    ResponseEntity<?> sendPublicNotification(@RequestBody NotificationDto notificationDto);

}