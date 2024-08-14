package com.wholesaled.stockManagement.Service;

import com.wholesaled.stockManagement.Model.Product;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductUpdateMessage {
    private Product product;
    private String action;

    public ProductUpdateMessage(Product product, String action) {
        this.product = product;
        this.action = action;
    }

}