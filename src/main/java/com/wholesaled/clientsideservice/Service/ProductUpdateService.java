package com.wholesaled.clientsideservice.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wholesaled.clientsideservice.Model.Product;
import com.wholesaled.clientsideservice.Model.ProductInfos;
import com.wholesaled.clientsideservice.Service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductUpdateService {

    private final ProductService productService;
    private final SseEmitterService sseEmitterService;
    private final ObjectMapper objectMapper;

    public ProductUpdateService(ProductService productService, SseEmitterService sseEmitterService, ObjectMapper objectMapper) {
        this.productService = productService;
        this.sseEmitterService = sseEmitterService;
        this.objectMapper = objectMapper;
    }

    public void Notify() throws Exception {

        // Obtenir la liste mise à jour de tous les produits
        List<ProductInfos> allProducts = productService.getAllProducts();

        // Convertir la liste en JSON
        String productsJson = objectMapper.writeValueAsString(allProducts);

        // Envoyer la mise à jour à tous les clients connectés
        sseEmitterService.sendProductUpdate(productsJson);
    }
}