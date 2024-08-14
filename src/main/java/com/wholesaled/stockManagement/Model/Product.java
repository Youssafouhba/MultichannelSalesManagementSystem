package com.wholesaled.stockManagement.Model;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
//@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
    private Boolean isNew;
    private Boolean isBestSeller;
    @Column(length = 3000)
    private String description;
    private Double priceAfterDiscount; // New attribute

    private Double price;
    @Column(name = "quantity_in_stock", nullable = false) // Match the column name and ensure it's not nullable
    private int quantityInStock;

    private int size;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private Date postedDate;

    @OneToMany(targetEntity = Images.class,cascade = CascadeType.ALL ,mappedBy = "product")
    @JsonManagedReference
    private List<Images> imageUrls;


    private String category;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonBackReference("StockAction")
    private List<StockAction> stockActions;


    public Product(String name, String description, Double price, int quantityInStock, int size, String category,List<Images> productImages) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantityInStock = quantityInStock;
        this.size = size;
        this.category = category;
        this.priceAfterDiscount =price;
        this.postedDate = new Date();
        this.imageUrls = productImages;
    }

    public void applyDiscount(Discount discount) {
        Double discountedPrice = this.price;
        if (discount.getPercentage() != null) {
            discountedPrice -= discountedPrice * (discount.getPercentage() / 100);
        } else if (discount.getAmount() != null) {
            discountedPrice -= discount.getAmount();
        }
        this.priceAfterDiscount = discountedPrice < 0 ? 0 : discountedPrice;
    }

    public void adjustStock(int quantity, String type) {
        if (type.equalsIgnoreCase("in-Returned") || type.equalsIgnoreCase("in-New container")) {
            this.quantityInStock += quantity;
        } else if (type.equalsIgnoreCase("out") && this.quantityInStock >= quantity) {
            this.quantityInStock -= quantity;
        }
    }
}
