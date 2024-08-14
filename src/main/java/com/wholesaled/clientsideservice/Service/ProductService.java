package com.wholesaled.clientsideservice.Service;

import java.util.Date;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.wholesaled.authentification.model.User;
import com.wholesaled.authentification.repository.UserRepository;
import com.wholesaled.clientsideservice.Model.Images;
import com.wholesaled.clientsideservice.Model.Product;
import com.wholesaled.clientsideservice.Repository.CartElementRepository;
import com.wholesaled.clientsideservice.Repository.CommentRepository;
import com.wholesaled.clientsideservice.Repository.ImagesRepository;
import com.wholesaled.clientsideservice.Repository.OrderElementRepository;
import com.wholesaled.clientsideservice.Repository.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service("ProductService")
@AllArgsConstructor
public class ProductService {

    private final ImagesRepository imagesRepository;

    private final UserRepository userRepository;

    private final OrderElementRepository orderElementRepository;


    private final CommentRepository commentRepository;

    private final CartElementRepository cartElementRepository;
    private final ProductRepository productRepository;

    public Product getProductById(Long id) {
        return productRepository.findProductByIdIs(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.getAllByIdIsNotNull();
    }

    @Transactional
    public ResponseEntity<?> addProduct1(Product product) {
        if (productRepository.selectExistsName(product.getName()))
            return ResponseEntity.badRequest().body("The product already exists");
        product.setPostedDate(new Date());
        product.setPriceAfterDiscount(product.getPrice());
        for (Images image : product.getImageUrls()) {
            image.setProduct(product);
        }
        productRepository.save(product);
        return  ResponseEntity.ok().body("Product added successfully");
    }

    @Transactional
    public ResponseEntity<?> deleteProduct(Long id) {
        List<User> users = userRepository.findUsersByFavoriteProductsContains(productRepository.findProductByIdIs(id));
        for (User user : users) {
            List<Product> products = user.getFavoriteProducts();
            products.remove(productRepository.findProductByIdIs(id));
            user.setFavoriteProducts(products);
            userRepository.save(user);
        }
        commentRepository.deleteCommentsByProductId(id);
        cartElementRepository.deleteCartElementsByProductId(id);
        orderElementRepository.deleteOrderElementsByProductId(id);
        productRepository.deleteById(id);
        return  ResponseEntity.ok().body("Product deleted successfully");
    }

    public ResponseEntity<?> updateProduct(Product product) {
        if (!productRepository.findById(product.getId()).isPresent())
            return ResponseEntity.badRequest().body("The product does not exist");
        Product produc = productRepository.findProductByIdIs(product.getId());
        System.out.println("Update Prodect ");
        produc.setName(product.getName());
        produc.setCategory(product.getCategory());
        produc.setDescription(product.getDescription());
        produc.setPrice(product.getPrice());
        produc.setSize(product.getSize());
        produc.setIsNew(product.getIsNew());
        produc.setIsBestSeller(product.getIsBestSeller());
        produc.setQuantityInStock(product.getQuantityInStock());
        List<Images> images = product.getImageUrls();
        for (Images image : images) {
            image.setProduct(produc);
        }
        produc.setImageUrls(images);
        Product prod = productRepository.save(produc);
        return  ResponseEntity.ok().body("Product updated successfully");
    }


    @Transactional
    public ResponseEntity<?> addProduct(Product product) {
        if (productRepository.selectExistsName(product.getName()))
            return ResponseEntity.badRequest().body("The product already exists");
        product.setPostedDate(new Date());
        product.setPriceAfterDiscount(product.getPrice());
        for (Images image : product.getImageUrls()) {
            image.setProduct(product);
        }
        Product prod= productRepository.save(product);
        return  ResponseEntity.ok().body("Product added successfully");
    }


    @Transactional
    public void update(){
        productRepository.findAll().forEach(product -> {
            product.setIsNew(true);
            product.setIsBestSeller(false);
            productRepository.save(product);
        });
    }
}
