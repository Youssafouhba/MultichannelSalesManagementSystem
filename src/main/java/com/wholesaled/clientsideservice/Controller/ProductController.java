package com.wholesaled.clientsideservice.Controller;

import java.util.List;

import com.wholesaled.clientsideservice.Model.ProductInfos;
import com.wholesaled.clientsideservice.Service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wholesaled.clientsideservice.Dto.ProductDto;
import com.wholesaled.clientsideservice.Dto.ProductMapper;
import com.wholesaled.clientsideservice.Model.Product;

import lombok.AllArgsConstructor;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/Products")
@AllArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8082"})
public class ProductController {
    private final ProductService productService;
    private final OrderService orderService;


    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody ProductDto product) throws Exception {
        System.out.println("Client Add Product" + ProductMapper.toEntity(product).getName() + " "+ ProductMapper.toEntity(product).getImageUrls().get(0).getUrl());
        return productService.addProduct(ProductMapper.toEntity(product));
    }

    @GetMapping("/Best/{productId}")
    public ResponseEntity<?> getOrderElements(@PathVariable("productId") Long productId) {
        return ResponseEntity.ok().body(orderService.getOrderElements(productId));
    }

    @GetMapping
    public List<ProductInfos> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PutMapping
    public ResponseEntity<?> updateProduct(@RequestBody Product product) throws Exception {
        return productService.updateProduct(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) throws Exception {
        return productService.deleteProduct(id);
    }

   /*
    @GetMapping("/stream")
    public SseEmitter streamProducts() {
        return sseEmitterService.createEmitter();
    }
   * */
}
