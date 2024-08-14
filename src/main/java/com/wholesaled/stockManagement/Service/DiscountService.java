package com.wholesaled.stockManagement.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.wholesaled.stockManagement.Model.Discount;
import com.wholesaled.stockManagement.Model.Product;
import com.wholesaled.stockManagement.Repository.DiscountRepository;
import com.wholesaled.stockManagement.Repository.ProductRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor

public class DiscountService {

    private final DiscountRepository discountRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;



    public Optional<Discount> CreateDiscount(List<Product> products,Discount discount) {
        if (products.isEmpty()) {
            return Optional.empty();
        }
        else {
            discount.setProducts(products);
            Discount savedDiscount = discountRepository.save(discount);
            for (Product product : products) {
                product.applyDiscount(savedDiscount);
               // productRepository.save(product);
                productService.updateProduct(product);
            }
            return Optional.of(savedDiscount);
        }
    }

}
