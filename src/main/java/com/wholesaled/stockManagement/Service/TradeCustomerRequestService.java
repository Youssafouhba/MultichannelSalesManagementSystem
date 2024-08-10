package com.wholesaled.stockManagement.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wholesaled.security.UserPrincipal;
import com.wholesaled.stockManagement.Dto.NotificationDto;
import com.wholesaled.stockManagement.Dto.RequestTradeCustomerDto;
import com.wholesaled.stockManagement.Dto.RequestTradeMapper;
import com.wholesaled.stockManagement.Feign.ClientSideProducts;
import com.wholesaled.stockManagement.Model.TradeCustomerRequest;
import com.wholesaled.stockManagement.Repository.TradeCustomerRequestRepository;

import feign.FeignException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TradeCustomerRequestService {

    
    private final TradeCustomerRequestRepository repository;
   // private final NotificationService notificationService;
    private final RequestTradeMapper requestTradeMapper;
    private final ClientSideProducts clientSideProducts;




    @PreAuthorize("hasRole('Client')")
    @Transactional
    public ResponseEntity<String> requestToBecomeATradeCustomer(RequestTradeCustomerDto requestDto) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        TradeCustomerRequest requests = requestTradeMapper.toEntity(requestDto);
        requests.setDate(new Date());
        requests.setStatus("PENDING");

        repository.save(requests);
        try {
            clientSideProducts.sendPrivateNotification(NotificationDto.builder()
            .message("Your request to become a trade customer has been submitted and is currently under review. We will notify you once your application has been processed"  )
            .title("Trade customer request submitted successfully")
            .userId(requestDto.getUserId())
            .isPublic(false)
            .build());
        } catch (FeignException e) {
            System.out.println(e.getMessage());
        }
       
        String requestedBy = SecurityContextHolder.getContext().getAuthentication().getName();
   //     notificationService.notifySuperAdmin("New trade customer request by " + requestedBy);

        return ResponseEntity.ok("Trade customer request submitted successfully.");
    }

    @PreAuthorize("hasRole('SuperAdmin')")
    @Transactional(readOnly = true)
    public List<TradeCustomerRequest> getAllRequests() {
        return repository.findAll();
    }

    @PreAuthorize("hasRole('SuperAdmin')")
    @Transactional(readOnly = true)
    public Optional<TradeCustomerRequest> getRequestById(Long id) {
        return repository.findById(id);
    }

    @PreAuthorize("hasRole('SuperAdmin')")
    @Transactional
    public ResponseEntity<?> reviewRequest(Long id, String status) {
        TradeCustomerRequest request = repository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));

        if (!status.equalsIgnoreCase("APPROVED") && !status.equalsIgnoreCase("REJECTED")) {
            return ResponseEntity.badRequest().body("Invalid status");
        }

        request.setStatus(status);
        if(status.equalsIgnoreCase("APPROVED")){

            try {
                ResponseEntity<String>  response = clientSideProducts.setUserToTradeCustomer(request.getUserId());
            } catch (FeignException e) {
                if (e.status() != 200) {
                    return ResponseEntity.status(e.status()).body("Failed , please try again " + e.getMessage());
                }
            }
        }
   
        
        repository.save(request);
        try {
        clientSideProducts.sendPrivateNotification(NotificationDto.builder()
        .message("Your trade customer request has been " + status.toLowerCase())
        .title("Trade Customer Request")
        .userId(request.getUserId())
        .isPublic(false)
        .build()
        
        
        );

    } catch (FeignException e) {
        System.out.println(e.getMessage());
    }
   

      //  notificationService.notifyUser(request.getEmailAddress(), "Your trade customer request has been " + status.toLowerCase());

        return ResponseEntity.ok("Trade customer request " + status + " successfully.");
    }

    
}
