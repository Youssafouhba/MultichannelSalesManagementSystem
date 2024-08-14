package com.wholesaled.clientsideservice.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@ConfigurationProperties("app")
public class AppProperties {

    private String clientUrl;
    private String jwtSecret;

    public void setClientUrl(String clientUrl) {
        this.clientUrl = clientUrl;
    }

    public void setJwtSecret(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }
}