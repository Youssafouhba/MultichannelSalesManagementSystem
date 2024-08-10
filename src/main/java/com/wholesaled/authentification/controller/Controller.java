package com.wholesaled.authentification.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/AdminUser/Controll")
@RequiredArgsConstructor
public class Controller {

@GetMapping("/get")
public String getMethodName(@RequestParam String param) {
    return new String("All products HHHHH");
}

@DeleteMapping("/delete")
public ResponseEntity<?> deleteUser(@RequestParam String email){
    return ResponseEntity.ok(email+" deleted");

}

}
