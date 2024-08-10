package com.wholesaled.stockManagement.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wholesaled.stockManagement.Dto.RegisterStockDto;
import com.wholesaled.stockManagement.Dto.ReportRequestDto;
import com.wholesaled.stockManagement.Dto.StockReport;
import com.wholesaled.stockManagement.Model.StockAction;
import com.wholesaled.stockManagement.Service.StockService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/Stock/Management/stocks")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8082"})
@AllArgsConstructor
public class StockController {

    private final StockService stockService;

    @PostMapping("/in")
    @PreAuthorize("hasRole('StockManager')")
    public ResponseEntity<?> inStockAction(@RequestBody RegisterStockDto registerStockDto) {
        try {
            if (!"Returned".equalsIgnoreCase(registerStockDto.getType()) && !"New container".equalsIgnoreCase(registerStockDto.getType())) {
                throw new IllegalArgumentException("Invalid stock in type. Must be 'Returned' or 'New container'.");
            }
            stockService.requestStockAction(registerStockDto.getProductId(), registerStockDto.getQuantity(), "in-" + registerStockDto.getType());
            return ResponseEntity.ok("Stock action registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/out")
    public ResponseEntity<?> outStockAction(@RequestBody RegisterStockDto registerStockDto) {
        try {
            if (!"out".equalsIgnoreCase(registerStockDto.getType())) {
                throw new IllegalArgumentException("Invalid stock out type. Must be 'out'.");
            }
            stockService.requestStockAction(registerStockDto.getProductId(), registerStockDto.getQuantity(), registerStockDto.getType());
            return ResponseEntity.ok("Stock action registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/report")
    public ResponseEntity<Map<Long, StockReport>> generateReport(@RequestBody ReportRequestDto reportRequestDto) {
        try {
            Map<Long, StockReport> reports = stockService.generateReports(reportRequestDto.getStartDate(), reportRequestDto.getEndDate());
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> getReportById(@PathVariable Long id) {
        try {
            List<StockAction> reports = stockService.getAllByProductId(id);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/alert")
    public ResponseEntity<String> checkStockAlerts(@RequestParam int threshold) {
        stockService.checkStockAlerts(threshold);
        return ResponseEntity.ok("Stock alert check completed");
    }


    @PostMapping("/review/action/{stockActionId}")
    public ResponseEntity<?> reviewStockAction(@PathVariable Long stockActionId, @RequestParam String status) {
        try {
            return stockService.reviewStockAction(stockActionId, status);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    
    }


    @GetMapping("/pending")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<List<StockAction>> getAllPendingStockActions() {
        try {
            List<StockAction> pendingActions = stockService.getPendingStockActions();
            return ResponseEntity.ok(pendingActions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }



}
