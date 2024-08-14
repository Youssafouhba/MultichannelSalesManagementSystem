package com.wholesaled.clientsideservice.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wholesaled.clientsideservice.Model.Product;
import com.wholesaled.clientsideservice.Service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Controller
@RequestMapping("/api/subscribe")
@AllArgsConstructor
public class ProductSSEController {
    private final ProductService productService;
    private final ObjectMapper objectMapper;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> subscribe() {
        SseEmitter emitter = new SseEmitter(Duration.ofMinutes(5).toMillis());
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return ResponseEntity.status(HttpStatus.OK).body(emitter);
    }

    @Scheduled(fixedRate = 30000)
    public void notifyClients() {
        List<Product> updatedProducts = productService.getAllProducts();
        String productsJson;
        try {
            productsJson = objectMapper.writeValueAsString(updatedProducts);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return;
        }

        List<SseEmitter> deadEmitters = new ArrayList<>();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().data(productsJson));
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        }
        emitters.removeAll(deadEmitters);
    }
}