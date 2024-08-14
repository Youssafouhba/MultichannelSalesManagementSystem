package com.wholesaled.clientsideservice.Dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.wholesaled.clientsideservice.Model.Images;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;

    private String name;
    private Boolean isNew;
    private Boolean isBestSeller;
    private String description;
    private Double priceAfterDiscount; // New attribute

    private Double price;
    private int quantityInStock;

    private int size;

    private Date postedDate;

    private List<Images> imageUrls;


    private String category;

}
