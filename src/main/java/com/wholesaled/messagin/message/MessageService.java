package com.wholesaled.messagin.message;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.wholesaled.messagin.conversation.Conversation;
import com.wholesaled.messagin.conversation.ConversationRepository;
@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public MessageService(MessageRepository messageRepository, ConversationRepository conversationRepository, SimpMessagingTemplate messagingTemplate) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Message save(Message message) {
        message.setTimestamp(new Date());
        System.out.println("message is here : " + message.toString());
        Message savedMessage = messageRepository.save(message);

        Optional<Conversation> existingConversation = conversationRepository.findByParticipants(message.getFrom(), message.getTo());

        Conversation conversation;
        if (existingConversation.isPresent()) {
            conversation = existingConversation.get();
            conversation.getMessages().add(savedMessage);
        } else {
            conversation = Conversation.builder()
                .participants(Arrays.asList(message.getTo(),message.getFrom()))
                .messages(Arrays.asList(savedMessage))
                .build();
        }

        conversationRepository.save(conversation);
        
        messagingTemplate.convertAndSendToUser(message.getTo(), "/queue/messages", message);  // Send message via WebSocket

        return savedMessage;
    }

    public void initiateBotConversation(String clientEmail) {

        Message welcomeMessage = Message.builder()
                .from("admin")
                .to(clientEmail)
                .content("Hello and welcome to Wholesale Ltd!")
                .timestamp(new Date())
                .build();
        save(welcomeMessage);
    }

    public void handleClientResponse(String clientEmail) {
        // Define the time zone for the UK
        ZoneId ukZoneId = ZoneId.of("Europe/London");
        ZonedDateTime now = ZonedDateTime.now(ukZoneId);
        System.out.println("----------------------------------------------");

        // Define shop opening hours
        int openingHourWeekday = 10;
        int closingHourWeekday = 18;
        int openingHourSaturday = 11;
        int closingHourSaturday = 16;
        DayOfWeek today = now.getDayOfWeek();

        boolean isOpen;
        if (today == DayOfWeek.SATURDAY) {
            isOpen = now.getHour() >= openingHourSaturday && now.getHour() < closingHourSaturday;
        } else if (today == DayOfWeek.SUNDAY) {
            isOpen = false;
        } else {
            isOpen = now.getHour() >= openingHourWeekday && now.getHour() < closingHourWeekday;
        }

        if (isOpen) {
            return; // Shop is open, no need to send messages
        }

        // Prepare bot messages
        String[] botMessages = {
            "Thank you for reaching out to us. We appreciate your message and will respond to you as soon as possible.",
            "Our shop is open from Monday to Friday, between 10 AM and 6 PM, Saturday, between 11 AM and 4:30 PM.",
            "If you have any urgent inquiries during these hours, please feel free to contact us directly. Have a great day!"
        };

        // Check if the conversation exists
        Optional<Conversation> existingConversation = conversationRepository.findByParticipants(clientEmail, "admin");

        if (existingConversation.isPresent()) {
            // Get existing messages sent today
            Set<String> existingMessages = new HashSet<>();
            LocalDate todayDate = now.toLocalDate();
            for (Message message : existingConversation.get().getMessages()) {
                if (message.getTimestamp().toInstant().atZone(ukZoneId).toLocalDate().equals(todayDate)) {
                    existingMessages.add(message.getContent());
                }
            }

            // Send bot messages only if they haven't been sent today
            for (String content : botMessages) {
                if (!existingMessages.contains(content)) {
                    Message botMessage = Message.builder()
                        .from("admin")
                        .to(clientEmail)
                        .content(content)
                        .timestamp(new Date())
                        .build();
                    save(botMessage);
                }
            }
        }
    }

}
