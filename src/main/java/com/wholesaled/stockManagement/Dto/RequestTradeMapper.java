package com.wholesaled.stockManagement.Dto;


import org.springframework.stereotype.Component;

import com.wholesaled.stockManagement.Model.TradeCustomerRequest;
@Component
public class RequestTradeMapper {


    public static TradeCustomerRequest toEntity(RequestTradeCustomerDto dto) {
        TradeCustomerRequest entity = new TradeCustomerRequest();
        entity.setUserId(dto.getUserId());
        entity.setCompanyName(dto.getCompanyName());
        entity.setContactPerson(dto.getContactPerson());
        entity.setBusinessAddress(dto.getBusinessAddress());
        entity.setCity(dto.getCity());
        entity.setPostalCode(dto.getPostalCode());
        entity.setCountry(dto.getCountry());
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setEmailAddress(dto.getEmailAddress());
        entity.setWebsite(dto.getWebsite());
        entity.setTypeOfBusiness(dto.getTypeOfBusiness());
        entity.setBusinessRegistrationNumber(dto.getBusinessRegistrationNumber());
        entity.setVatNumber(dto.getVatNumber());
        entity.setProductsOfInterest(dto.getProductsOfInterest());
        entity.setAnnualSalesVolume(dto.getAnnualSalesVolume());
        entity.setHowDidYouHearAboutUs(dto.getHowDidYouHearAboutUs());
        entity.setAdditionalInformation(dto.getAdditionalInformation());
        return entity;
    }

    public static RequestTradeCustomerDto toDto(TradeCustomerRequest entity) {
        RequestTradeCustomerDto dto = new RequestTradeCustomerDto();
        dto.setUserId(entity.getUserId());
        dto.setCompanyName(entity.getCompanyName());
        dto.setContactPerson(entity.getContactPerson());
        dto.setBusinessAddress(entity.getBusinessAddress());
        dto.setCity(entity.getCity());
        dto.setPostalCode(entity.getPostalCode());
        dto.setCountry(entity.getCountry());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setEmailAddress(entity.getEmailAddress());
        dto.setWebsite(entity.getWebsite());
        dto.setTypeOfBusiness(entity.getTypeOfBusiness());
        dto.setBusinessRegistrationNumber(entity.getBusinessRegistrationNumber());
        dto.setVatNumber(entity.getVatNumber());
        dto.setProductsOfInterest(entity.getProductsOfInterest());
        dto.setAnnualSalesVolume(entity.getAnnualSalesVolume());
        dto.setHowDidYouHearAboutUs(entity.getHowDidYouHearAboutUs());
        dto.setAdditionalInformation(entity.getAdditionalInformation());
        return dto;
    }

}
