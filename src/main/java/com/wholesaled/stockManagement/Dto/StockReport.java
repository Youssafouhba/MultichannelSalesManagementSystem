package com.wholesaled.stockManagement.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StockReport {
    private Long productId;
    private int openingStock;
    private int totalStockIn;
    private int totalStockOut;
    private int remainingStock;
}