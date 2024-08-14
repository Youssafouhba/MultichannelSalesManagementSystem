package com.wholesaled.clientsideservice.Controller;

import com.wholesaled.clientsideservice.Service.SseEmitterService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
public class SseController {

    private final SseEmitterService sseEmitterService;

    public SseController(SseEmitterService sseEmitterService) {
        this.sseEmitterService = sseEmitterService;
    }

    @GetMapping("/products-stream")
    public SseEmitter streamProducts() {
        return sseEmitterService.createEmitter();
    }
}