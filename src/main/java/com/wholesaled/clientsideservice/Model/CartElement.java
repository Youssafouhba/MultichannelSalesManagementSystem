package com.wholesaled.clientsideservice.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "CartElement")
public class CartElement {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private int quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    @JsonIgnore
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Double sub_total;
}