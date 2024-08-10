package com.wholesaled.stockManagement.Dto;


import org.springframework.stereotype.Component;

import com.wholesaled.stockManagement.Model.Product;
@Component
public class ProductMapper {

    // Convert Product to ProductDto
    public static ProductDto toDto(Product product) {
        if (product == null) {
            return null;
        }
        
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .priceAfterDiscount(product.getPriceAfterDiscount())
                .quantityInStock(product.getQuantityInStock())
                .size(product.getSize())
                .postedDate(product.getPostedDate())
                .imageUrls(product.getImageUrls())
                .category(product.getCategory())
                .isNew(product.getIsNew())
                .isBestSeller(product.getIsBestSeller())
                .build();
    }

    // Convert ProductDto to Product
    public static Product toEntity(ProductDto productDto) {
        if (productDto == null) {
            return null;
        }
        
        Product product = new Product();
        product.setId(productDto.getId());
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setPriceAfterDiscount(productDto.getPriceAfterDiscount());
        product.setQuantityInStock(productDto.getQuantityInStock());
        product.setSize(productDto.getSize());
        product.setPostedDate(productDto.getPostedDate());
        product.setImageUrls(productDto.getImageUrls());
        product.setCategory(productDto.getCategory());
        product.setIsNew(productDto.getIsNew());
        product.setIsBestSeller(productDto.getIsBestSeller());
        
        return product;
    }
}
