package com.wholesaled.clientsideservice.Fiegn;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.wholesaled.clientsideservice.Dto.RequestTradeCustomerDto;


@FeignClient(name = "AUTH-ADMIN-SERVICE", configuration = FeignClientConfiguration.class)
public interface TradeCustomerClient {

    
    @PostMapping("/api/clientTradeCustomers/request")
    ResponseEntity<String> requestTradeCustomer(@RequestBody RequestTradeCustomerDto request);


}