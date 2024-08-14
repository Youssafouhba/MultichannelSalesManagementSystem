package com.wholesaled.SpringBatch;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wholesaled.clientsideservice.Model.Product;
import com.wholesaled.clientsideservice.Service.ProductService;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobScope;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Configuration
@EnableScheduling
@EnableBatchProcessing
@Import(ProductSSEJobConfig.class)
public class ProductSSEJob {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper;
    private final ProductService productService;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Autowired
    public ProductSSEJob(ObjectMapper objectMapper, ProductService productService) {
        this.objectMapper = objectMapper;
        this.productService = productService;
    }

    @Scheduled(fixedRate = 30000)
    public void runProductSSEJob() {
        // Trigger the Spring Batch Job every 30 seconds
        // ...
    }

    public void addSseEmitter(SseEmitter emitter) {
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
    }
}