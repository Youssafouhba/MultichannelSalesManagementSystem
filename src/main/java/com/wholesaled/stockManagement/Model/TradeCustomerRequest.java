package com.wholesaled.stockManagement.Model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class TradeCustomerRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;

    private String companyName;
    private String contactPerson;
    private String businessAddress;
    private String city;
    private String postalCode;
    private String country;
    private String phoneNumber;
    private String emailAddress;
    private String website;
    private String typeOfBusiness;
    private String businessRegistrationNumber;
    private String vatNumber;
    private String productsOfInterest;
    private String annualSalesVolume;
    private String howDidYouHearAboutUs;
    private String additionalInformation;

    private String status;

    private Date date;

}
