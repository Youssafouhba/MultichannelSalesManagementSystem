package com.wholesaled.messagin.controller;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.wholesaled.messagin.message.Message;
import com.wholesaled.messagin.message.MessageRepository;


@RestController
public class CommandController {

    private final KafkaTemplate<String, Message> kafkaTemplate;
    private final SimpMessageSendingOperations messagingTemplate;
    private final MessageRepository messageRepository;



    public CommandController(KafkaTemplate<String, Message> kafkaTemplate, SimpMessageSendingOperations messagingTemplate , MessageRepository messageRepository) {
        this.kafkaTemplate = kafkaTemplate;
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
    }

    @PostMapping("/send")
    public Message send(@RequestBody Message message) {
        kafkaTemplate.send("/secured/user/queue/specific-user", message);
        Message messagee = messageRepository.save(message);
        System.out.println(message.getContent());
        messagingTemplate.convertAndSendToUser("Admin", "/secured/user",messagee);
        

        return messagee;
    }

    
    
    
    
}