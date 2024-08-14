package com.wholesaled;

import com.wholesaled.clientsideservice.Config.ProductUpdateHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class AuthenticationApplication {
	@Bean
	public ProductUpdateHandler productUpdateHandler() {
		return new ProductUpdateHandler();
	}
	public static void main(String[] args) {
		SpringApplication.run(AuthenticationApplication.class, args);
	}

}
