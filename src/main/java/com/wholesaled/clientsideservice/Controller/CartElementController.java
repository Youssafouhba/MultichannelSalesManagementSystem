package com.wholesaled.clientsideservice.Controller;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.wholesaled.clientsideservice.Service.CartElementService;

@RestController
@RequestMapping("/CartElement")
@AllArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8082"})
public class CartElementController {

    private final CartElementService cartElementService;

}
