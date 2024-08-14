package com.wholesaled.stockManagement.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wholesaled.stockManagement.Dto.RequestTradeCustomerDto;
import com.wholesaled.stockManagement.Model.TradeCustomerRequest;
import com.wholesaled.stockManagement.Service.TradeCustomerRequestService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/clientTradeCustomers")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8082"})

@AllArgsConstructor
public class TradeCustomerController {

        private TradeCustomerRequestService tradeCustomerRequestService;

    @PreAuthorize("hasRole('client')")
    @PostMapping("/request")
    public ResponseEntity<String> requestTradeCustomer(@RequestBody RequestTradeCustomerDto request) {
        return tradeCustomerRequestService.requestToBecomeATradeCustomer(request);
    }

    @PreAuthorize("hasRole('SuperAdmin')")
    @GetMapping("/requests")
    public ResponseEntity<List<TradeCustomerRequest>> getAllRequests() {
        return ResponseEntity.ok(tradeCustomerRequestService.getAllRequests());
    }

    @PreAuthorize("hasRole('SuperAdmin')")
    @GetMapping("/request/{id}")
    public ResponseEntity<Optional<TradeCustomerRequest>> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(tradeCustomerRequestService.getRequestById(id));
    }

    @PreAuthorize("hasRole('SuperAdmin')")
    @PostMapping("/review/{id}/{status}")
    public ResponseEntity<?> reviewTradeCustomerRequest(@PathVariable Long id, @PathVariable String status) {
        return tradeCustomerRequestService.reviewRequest(id, status);
    }

    
}
