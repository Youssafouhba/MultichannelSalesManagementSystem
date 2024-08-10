package com.wholesaled.stockManagement.Service;

import java.util.Date;
import java.util.List;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.wholesaled.stockManagement.Dto.ProductMapper;
import com.wholesaled.stockManagement.Feign.ClientSideProducts;
import com.wholesaled.stockManagement.Model.Product;
import com.wholesaled.stockManagement.Repository.ProductRepository;

import feign.FeignException;
import lombok.AllArgsConstructor;

@Service("ProductService")
@AllArgsConstructor
public class ProductService {


    private final ProductRepository productRepository;
    private final ClientSideProducts clientSideProducts;



    public Product getProductById(Long id) {
        return productRepository.findProductByIdIs(id);
    }

    public List<Product> getAllProducts() {
        /*
            List<Product> products = (List<Product>) productRepository.findAll();

            for (Product product : products) {
                ResponseEntity<String> response = clientSideProducts.createProduct(ProductMapper.toDto(product));
            }
         */
        return productRepository.findAll();
    }

    public ResponseEntity<?> addProduct(Product product) {
        if (productRepository.selectExistsName(product.getName()))
            return ResponseEntity.badRequest().body("The product already exists");
        product.setPostedDate(new Date());
        Product saveProduct = productRepository.save(product);
  
        try {
            ResponseEntity<String> response = clientSideProducts.createProduct(ProductMapper.toDto(saveProduct));

                
           
        } catch (FeignException e) {
            if (e.status() ==200) {

                return ResponseEntity.ok("Product added successfully");

            }
            String responseBody =new String(e.responseBody().get().array());


            if (e.status() == 400 && responseBody.equals("The product already exists")) {
                clientSideProducts.deleteProduct(saveProduct.getId());
                productRepository.deleteById(saveProduct.getId());

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The product already exists");
            
            }
            else if (e.status() != 200) {
                System.out.println("Failed to add product to Client database");
                productRepository.deleteById(saveProduct.getId());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add product to Client database");
            }
            else {
                System.out.println("Failed to add product to Client database");
                productRepository.deleteById(saveProduct.getId());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add product to Client database");
            }
        }
        return ResponseEntity.ok("Product added successfully");
    }

    public ResponseEntity<?> deleteProduct(Long id) {
        if (productRepository.findById(id).isPresent()) {
            try {
                clientSideProducts.deleteProduct(id);
            } catch (FeignException e) {
                System.out.println(e.getMessage());
            }
            productRepository.deleteById(id);
            return  ResponseEntity.ok().body("Product deleted successfully");
        }
        try {
            clientSideProducts.deleteProduct(id);
        } catch (FeignException e) {
            System.out.println(e.getMessage());
        }
        clientSideProducts.deleteProduct(id);
        return ResponseEntity.badRequest().body("The product does not exist");
        
    }

    @Transactional
    public void update(){
        productRepository.findAll().forEach(product -> {
            product.setIsNew(true);
            product.setIsBestSeller(false);
            productRepository.save(product);
        });
    }
    public ResponseEntity<?> updateProduct(Product product) {
        if (!productRepository.findById(product.getId()).isPresent())
            return ResponseEntity.badRequest().body("The product does not exist");
        Product produc = productRepository.findProductByIdIs(product.getId());
        produc.setName(product.getName());
        produc.setCategory(product.getCategory());
        produc.setDescription(product.getDescription());
        produc.setPrice(product.getPrice());
        produc.setSize(product.getSize());
        produc.setQuantityInStock(product.getQuantityInStock());

        System.out.println("updated Product : "+ produc.getId() + " " + produc.getName());
        try {
            ResponseEntity<String> response = clientSideProducts.updateProduct(ProductMapper.toDto(produc));
            Product saveProduct = productRepository.save(produc);
            return ResponseEntity.ok("Product added successfully");
        } catch (FeignException e) {
            // TODO: handle exception

            String responseBody =new String(e.responseBody().get().array());
            System.out.println(e.status());
            
            if (e.status() ==200) {
                Product saveProduct = productRepository.save(produc);
                return ResponseEntity.ok("Product added successfully");

            }
            return ResponseEntity.badRequest().body("Problem in updating product");

        }
        
    }
}
