package com.wholesaled.stockManagement.Controller;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wholesaled.stockManagement.Model.Discount;
import com.wholesaled.stockManagement.Model.Product;
import com.wholesaled.stockManagement.Repository.DiscountRepository;
import com.wholesaled.stockManagement.Repository.ProductRepository;
import com.wholesaled.stockManagement.Service.DiscountService;



@RestController
@RequestMapping("/Stock/Management/discounts")
public class DiscountController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private DiscountRepository discountRepository;
    @Autowired
    private DiscountService discountService;

   


    @PostMapping("/product/{productId}")
    public ResponseEntity<Discount> addDiscountToProduct(@PathVariable Long productId, @RequestBody Discount discount) {
        Optional<Product> product = productRepository.findById(productId);
        Optional<Discount> savedDiscount = discountService.CreateDiscount(List.of(product.get()), discount);
        if (savedDiscount.isPresent()) {
            return ResponseEntity.ok(savedDiscount.get());
        } else {
            return ResponseEntity.badRequest().build();
        }
      
    }
    @GetMapping()
    public ResponseEntity<?> getAllDiscount() {
       List<Discount> discounts = discountRepository.findAll();
       return ResponseEntity.ok(discounts);
    }
    

    @DeleteMapping("/{id}")
    public void deleteDiscount(@PathVariable Long id) {
        discountRepository.deleteById(id);
    }

    @PutMapping("updateDiscount/{id}")
    public String updateDiscount(@PathVariable String id, @RequestBody String entity) {
        //TODO: process PUT request
        
        return entity;
    }

}
