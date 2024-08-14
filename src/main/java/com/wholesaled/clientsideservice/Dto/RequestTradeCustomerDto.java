package com.wholesaled.clientsideservice.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class RequestTradeCustomerDto {

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
    private Boolean checkSquarechecked;


}
