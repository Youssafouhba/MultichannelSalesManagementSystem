package com.wholesaled.clientsideservice.Model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import com.wholesaled.authentification.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "products")
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {
    @Id
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
    private Boolean isNew;
    private Boolean isBestSeller;
    @Column(length = 2000)
    private String description;

    private Double price;

    private Double priceAfterDiscount; // New attribute

    private int quantityInStock;

    private int size;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date postedDate;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Images> imageUrls;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ClientFavoriteProducts> favoredByUsers;

    private String category;

    public Product(String name, String description, Double price, int quantityInStock, int size, String category,List<Images> imagesList) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantityInStock = quantityInStock;
        this.size = size;
        this.category = category;
        this.priceAfterDiscount =price;
        this.postedDate = new Date();
        this.imageUrls = new ArrayList<>();
    }

}
