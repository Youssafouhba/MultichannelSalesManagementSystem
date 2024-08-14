package com.wholesaled.clientsideservice.Service;

import com.wholesaled.authentification.model.User;
import com.wholesaled.authentification.repository.UserRepository;
import com.wholesaled.clientsideservice.Dto.CommentDto;
import com.wholesaled.clientsideservice.Model.Comment;
import com.wholesaled.clientsideservice.Model.Images;
import com.wholesaled.clientsideservice.Model.Product;
import com.wholesaled.clientsideservice.Model.ProductInfos;
import com.wholesaled.clientsideservice.Repository.CartElementRepository;
import com.wholesaled.clientsideservice.Repository.CommentRepository;
import com.wholesaled.clientsideservice.Repository.OrderElementRepository;
import com.wholesaled.clientsideservice.Repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service("ProductService")
@AllArgsConstructor
public class ProductService {

    private final UserRepository userRepository;
    @Autowired
    private  SimpMessagingTemplate messagingTemplate;
    private final ModelMapper modelMapper;
    private final OrderElementRepository orderElementRepository;

    private final CommentRepository commentRepository;

    private final CartElementRepository cartElementRepository;
    private final ProductRepository productRepository;

    public Product getProductById(Long id) {
        return productRepository.findProductByIdIs(id);
    }

    public List<ProductInfos> getAllProducts() {
        List<ProductInfos> productInfosList = new ArrayList<>();
        for (Product product : productRepository.findAll()) {
            List<CommentDto> comments = commentRepository.findCommentsByProduct_Id(product.getId()).stream().map(
                    this::CommentToDto).toList();
            int totalRating = 0;
            for (CommentDto comment : comments) {
                totalRating += comment.getRating();
            }
            float rating = !comments.isEmpty() ?(float) totalRating / comments.size(): 0;
            productInfosList.add(new ProductInfos(product,comments,rating));
        }

        return productInfosList;
    }

    @Transactional
    public ResponseEntity<?> addProduct(Product product) throws Exception {
        if (productRepository.selectExistsName(product.getName()))
            return ResponseEntity.badRequest().body("The object already exists");
        product.setPostedDate(new Date());
        product.setPriceAfterDiscount(product.getPrice());
        for (Images image : product.getImageUrls()) {
            image.setProduct(product);
        }
        Product savedOne = productRepository.save(product);
        ObjectUpdateMessage message = new ObjectUpdateMessage(savedOne, "add");
        messagingTemplate.convertAndSend("/updates/product", message);
        return  ResponseEntity.ok().body("Product added successfully 1");
    }
    @Transactional
    public ResponseEntity<?> deleteProduct(Long id) {
        try {
            // Fetch the product once
            Product product = productRepository.findProductByIdIs(id);

            if (product == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
            }

            // Remove product from users' favorite lists
            List<User> users = userRepository.findUsersByFavoriteProductsContains(product);
            for (User user : users) {
                user.getFavoriteProducts().remove(product);
                userRepository.save(user);
            }

            // Delete related entities
            commentRepository.deleteCommentsByProductId(id);
            cartElementRepository.deleteCartElementsByProductId(id);
            orderElementRepository.deleteOrderElementsByProductId(id);

            // Notify via messaging template
            ObjectUpdateMessage message = new ObjectUpdateMessage(product, "delete");
            messagingTemplate.convertAndSend("/updates/product", message);

            // Delete the product
            productRepository.deleteById(id);

            return ResponseEntity.ok().body("Product deleted successfully");
        } catch (Exception e) {
            // Log and handle the exception
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the product");
        }
    }


    @Transactional
    public ResponseEntity<?> updateProduct(Product product) {
        if (!productRepository.findById(product.getId()).isPresent()) {
            return ResponseEntity.badRequest().body("The object does not exist");
        }

        // Retrieve the existing object entity
        Product existingProduct = productRepository.findProductByIdIs(product.getId());
        System.out.println("Update Product");

        // Update basic object fields
        existingProduct.setName(product.getName());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setSize(product.getSize());
        existingProduct.setIsNew(product.getIsNew());
        existingProduct.setIsBestSeller(product.getIsBestSeller());
        existingProduct.setQuantityInStock(product.getQuantityInStock());

        // Clear the existing imageUrls collection
        existingProduct.getImageUrls().clear();

        // Re-add each image while maintaining the bidirectional relationship
        for (Images image : product.getImageUrls()) {
            image.setProduct(existingProduct);  // Set the parent object reference
            existingProduct.getImageUrls().add(image);  // Add the image to the collection
        }

        // Save the updated object entity
        Product savedOne = productRepository.save(existingProduct);
        ObjectUpdateMessage message = new ObjectUpdateMessage(savedOne, "update");
        messagingTemplate.convertAndSend("/updates/product", message);
        return ResponseEntity.ok().body("Product updated successfully");
    }


    @Transactional
    public void update(){
        productRepository.findAll().forEach(product -> {
            product.setIsNew(true);
            product.setIsBestSeller(false);
            productRepository.save(product);
        });
    }
    public CommentDto CommentToDto(Comment comment) {
        CommentDto commentDto = modelMapper.map(comment, CommentDto.class);
        commentDto.setAuthor(comment.getUser().getFullName());
        return commentDto;
    }

}
