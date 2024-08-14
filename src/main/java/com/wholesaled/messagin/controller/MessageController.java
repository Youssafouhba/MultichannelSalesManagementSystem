package com.wholesaled.messagin.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.wholesaled.messagin.conversation.ConvClientDto;
import com.wholesaled.messagin.conversation.Conversation;
import com.wholesaled.messagin.conversation.ConversationService;
import com.wholesaled.messagin.conversation.ConvsDto;
import com.wholesaled.messagin.jwt.UserPrincipal;
import com.wholesaled.messagin.message.Message;
import com.wholesaled.messagin.message.MessageService;


@RestController
@CrossOrigin(origins = {"http://localhost:8081"})
public class MessageController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private  MessageService messageService;
    @Autowired
    private  ConversationService conversationService;

    @MessageMapping("/client/message")
    public void handleClientMessage(@Payload Message message) {
        this.messagingTemplate.convertAndSendToUser("admin", "/queue/messages", message);
        System.out.println(message.toString());
        messageService.save(message);
        messageService.handleClientResponse(message.getFrom());
        System.out.println("message is here");
    }



    @MessageMapping("/tg3edlappel")
    public void sift(@Payload Message message){
        
        this.messagingTemplate.convertAndSendToUser(message.getTo(), "/queue/messages", message);

        messageService.save(message);





    }
    @GetMapping("/getmyclientConversations")
    public ResponseEntity<?> getConnversations() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<ConvClientDto> conver = conversationService.getClientConversation(userPrincipal.getEmail());

        if (conver.isEmpty()) {
            messageService.initiateBotConversation(userPrincipal.getEmail());
            return ResponseEntity.ok(conversationService.getClientConversation(userPrincipal.getEmail()));
        }

        return ResponseEntity.ok(conver);
    }


    @GetMapping("/getMyConversations")
    public ResponseEntity<?> getmyConnversations() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<ConvsDto> conver = conversationService.getMyConversations("admin");
        return ResponseEntity.ok(conver);
    }
    


    @GetMapping("/getConversation/{conversationId}")
    public ResponseEntity<?> getMethodName(@PathVariable String conversationId) {
        Optional<Conversation> conversationOpt = conversationService.getConversationById(conversationId);
        if (conversationOpt.isPresent()) {
            List<Message> conver = conversationOpt.get().getMessages();
            return ResponseEntity.ok(conver);
        } else {
            return ResponseEntity.notFound().build();
        }}

    
   
}