package com.wholesaled.SpringBatch;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wholesaled.clientsideservice.Model.Product;
import com.wholesaled.clientsideservice.Service.ProductService;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobScope;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;

@Configuration
public class ProductSSEJobConfig {

    private final ObjectMapper objectMapper;
    private final ProductService productService;
    private final PlatformTransactionManager transactionManager;

    @Autowired
    public ProductSSEJobConfig(ObjectMapper objectMapper, ProductService productService, PlatformTransactionManager transactionManager) {
        this.objectMapper = objectMapper;
        this.productService = productService;
        this.transactionManager = transactionManager;
    }

    @Bean
    public Job productSSEJob(Step productSSEStep) {
        return new JobBuilder("productSSEJob", jobRepository())
                .incrementer(new RunIdIncrementer())
                .start(productSSEStep)
                .build();
    }

    @Bean
    @JobScope
    public Step productSSEStep() {
        return new StepBuilder("productSSEStep", jobRepository())
                .<List<Product>, String>chunk(10, transactionTemplate())
                .reader(productItemReader())
                .processor(productItemProcessor())
                .writer(productItemWriter())
                .build();
    }

    @Bean
    @StepScope
    public ItemReader<List<Product>> productItemReader() {
        return () -> productService.getAllProducts();
    }

    @Bean
    @StepScope
    public ItemProcessor<List<Product>, String> productItemProcessor() {
        return products -> {
            try {
                return objectMapper.writeValueAsString(products);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        };
    }

    @Bean
    @StepScope
    public ItemWriter<String> productItemWriter() {
        return products -> {
            // ...
        };
    }

    @Bean
    public JobRepository jobRepository() {
        // Configure the JobRepository
        // ...
        return null;
    }

    @Bean
    public PlatformTransactionManager transactionTemplate() {
        return (PlatformTransactionManager) new TransactionTemplate(transactionManager);
    }
}