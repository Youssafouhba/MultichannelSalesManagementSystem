package com.wholesaled.clientsideservice.Service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.wholesaled.clientsideservice.Model.Product;
import com.wholesaled.clientsideservice.Model.ProductInfos;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import com.wholesaled.clientsideservice.Config.ProductUpdateHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

@Service
@AllArgsConstructor
public class WebSocketService {
    private final ProductService productService;
    private final ObjectMapper objectMapper;

    private final ProductUpdateHandler productUpdateHandler;



    public void sendProductUpdate() throws JsonProcessingException {
        // Obtenir la liste mise à jour de tous les produits
        List<ProductInfos> allProducts = productService.getAllProducts();

        // Convertir la liste en JSON
        String productsJson = objectMapper.writeValueAsString(allProducts);

        productUpdateHandler.sendProductUpdate(productsJson);
    }
}