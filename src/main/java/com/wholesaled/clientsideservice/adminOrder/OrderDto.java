package com.wholesaled.clientsideservice.adminOrder;


import java.util.Date;

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
public class OrderDto {
    private Long id;
    private Double totalAmount;
    private String adresse;
    private String paymentMethod;
    private String status;
    private Date creationDate;
    private Date shippingDate;
    private String userFullName;

}
