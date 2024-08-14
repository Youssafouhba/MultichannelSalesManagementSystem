package com.wholesaled.messagin.conversation;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationMapper mapper;


    public ConversationService(ConversationRepository conversationRepository, ConversationMapper mapper) {
        this.conversationRepository = conversationRepository;
        this.mapper = mapper;
    }
    
    public List<ConvsDto> getMyConversations(String participant) {
        return conversationRepository.findByOneParticipant(participant).stream().map(mapper::toConvsDto).collect(Collectors.toList());
    }

    public List<ConvClientDto> getClientConversation(String participant){
        return conversationRepository.findByOneParticipant(participant).stream().map(mapper::toConvsClientDto).collect(Collectors.toList());

    }
    public Optional<Conversation> getConversationById(String Id){
        return conversationRepository.findById(Id);
    }

    public Conversation save(Conversation conversation) {
        return conversationRepository.save(conversation);
    }



}
