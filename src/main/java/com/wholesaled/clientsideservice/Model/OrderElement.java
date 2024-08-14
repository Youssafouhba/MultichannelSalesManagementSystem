package com.wholesaled.clientsideservice.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.wholesaled.clientsideservice.Model.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "order_elements")
public class OrderElement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "productId")
    private Product product;

    private Double sub_total;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderId")
    @JsonIgnore
    private Order1 order;
}
