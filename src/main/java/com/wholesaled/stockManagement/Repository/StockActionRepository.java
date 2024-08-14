package com.wholesaled.stockManagement.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wholesaled.stockManagement.Model.StockAction;

@Repository
public interface StockActionRepository extends JpaRepository<StockAction, Long> {
    List<StockAction> findByProductIdAndLastUpdatedBetween(Long productId, LocalDateTime startDate, LocalDateTime endDate);
    List<StockAction> findByProductId(Long productId);
    List<StockAction> findByStatus(String status);
}

