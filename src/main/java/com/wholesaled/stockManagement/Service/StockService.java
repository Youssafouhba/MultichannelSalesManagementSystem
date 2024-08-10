package com.wholesaled.stockManagement.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wholesaled.stockManagement.Dto.ProductMapper;
import com.wholesaled.stockManagement.Dto.StockReport;
import com.wholesaled.stockManagement.Feign.ClientSideProducts;
import com.wholesaled.stockManagement.Model.Product;
import com.wholesaled.stockManagement.Model.StockAction;
import com.wholesaled.stockManagement.Repository.ProductRepository;
import com.wholesaled.stockManagement.Repository.StockActionRepository;

import feign.FeignException.FeignClientException;
import lombok.AllArgsConstructor;

@Service("StockService")
@AllArgsConstructor
public class StockService {

    private final ProductRepository productRepository;
    private final ClientSideProducts clientSideProducts;
    private final StockActionRepository stockActionRepository;
    private final NotificationService notificationService;


    @PreAuthorize("hasRole('StockManager')")
    @Transactional
    public ResponseEntity<?> requestStockAction(Long productId, int quantity, String type) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String requestedBy = SecurityContextHolder.getContext().getAuthentication().getName();

        StockAction stockAction = new StockAction();
        stockAction.setProduct(product);
        stockAction.setQuantity(quantity);
        stockAction.setType(type);
        stockAction.setStatus("PENDING");
        stockAction.setRequestedBy(requestedBy);
        stockAction.setLastUpdated(LocalDateTime.now());
        stockAction.setQuantityBeforeAction(product.getQuantityInStock());

        stockActionRepository.save(stockAction);

       notificationService.notifySuperAdmin("New stock action requested by " + requestedBy);

        return ResponseEntity.ok("Stock action requested successfully.");
    }

    @PreAuthorize("hasRole('Admin')")
    @Transactional
    public ResponseEntity<String> reviewStockAction(Long actionId, String status) {
        StockAction stockAction = stockActionRepository.findById(actionId)
                .orElseThrow(() -> new RuntimeException("Stock action not found"));
    
        String approvedBy = SecurityContextHolder.getContext().getAuthentication().getName();
    
        if (!status.equalsIgnoreCase("APPROVED") && !status.equalsIgnoreCase("REJECTED")) {
            return ResponseEntity.badRequest().body("Invalid status");
        }
    
        if (status.equalsIgnoreCase("APPROVED")) {
            Product product = stockAction.getProduct();
            System.out.println(product.getId() + " " + product.getName() +" Quantity in stock : "+ product.getQuantityInStock());
            product.adjustStock(stockAction.getQuantity(), stockAction.getType());

            System.out.println(product.getId() + " " + product.getName() +" Quantity in stock : "+ product.getQuantityInStock());

    
            try {
                ResponseEntity<String> response = clientSideProducts.updateProduct(ProductMapper.toDto(product));
            } catch (FeignClientException e) {
                if (e.status() != 200) {
                    return ResponseEntity.status(e.status()).body("Failed to update client-side product: " + e.getMessage());
                }
                if (e.status() == 200) {
                    stockAction.setStatus(status);
                    productRepository.save(product);
                }
            }
            productRepository.save(product);
        }
    
        stockAction.setStatus(status);
        stockAction.setApprovedBy(approvedBy);
        stockAction.setLastUpdated(LocalDateTime.now());
    
        stockActionRepository.save(stockAction);
    
        notificationService.notifySuperAdmin("Stock action " + status + " by " + approvedBy);
    
        return ResponseEntity.ok("Stock action " + status + " successfully.");
    }
    

    @Transactional(readOnly = true)
    public Map<Long, StockReport> generateReports(LocalDateTime startDate, LocalDateTime endDate) {
        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) {
            throw new RuntimeException("No products found");
        }

        Map<Long, StockReport> reportMap = new HashMap<>();

        for (Product product : products) {
            List<StockAction> stockActions = stockActionRepository.findByProductIdAndLastUpdatedBetween(product.getId(), startDate, endDate);

            int totalStockIn = stockActions.stream()
                    .filter(action -> action.getType().equalsIgnoreCase("in-Returned") || action.getType().equalsIgnoreCase("in-New container"))
                    .mapToInt(StockAction::getQuantity)
                    .sum();

            int totalStockOut = stockActions.stream()
                    .filter(action -> action.getType().equalsIgnoreCase("out"))
                    .mapToInt(StockAction::getQuantity)
                    .sum();

            int openingStock = stockActions.isEmpty() ? 0 : stockActions.get(0).getQuantityBeforeAction(); // Assume we are starting from the last known stock

            StockReport report = new StockReport(
                    product.getId(),
                    openingStock,
                    totalStockIn,
                    totalStockOut,
                    openingStock + totalStockIn - totalStockOut
            );

            reportMap.put(product.getId(), report);
        }

        return reportMap;
    }

    @Transactional(readOnly = true)
    public List<StockAction> getAllByProductId(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        return stockActionRepository.findByProductId(id);
    }

    @Transactional
    public void checkStockAlerts(int threshold) {
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            if (product.getQuantityInStock() <= threshold) {
                notificationService.notifySuperAdmin("Alert: Low stock for product " + product.getName());
            }
        }
    }

    @Transactional(readOnly = true)
    public List<StockAction> getPendingStockActions() {
        return stockActionRepository.findByStatus("PENDING");
    }
}
