package com.wholesaled.messagin.conversation;

import java.util.List;

import org.springframework.stereotype.Component;

import com.wholesaled.messagin.message.Message;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Builder
@Component
public class ConversationMapper {

    public ConvsDto toConvsDto(Conversation conversation){
        List<Message> messages = conversation.getMessages();
        if(!messages.isEmpty()){
            Message lastMessage = messages.get(messages.size() - 1);
        return  ConvsDto.builder()
        .id(conversation.getId())
        .participants(conversation.getParticipants())
        .lastMessage(lastMessage.getContent())
        .lastMessageSender(lastMessage.getFrom())
       // .lastMessageTime(lastMessage.getTimestamp().toString())
        .build();
        }
        else{
            return null;
        }
        
    }

    public ConvClientDto toConvsClientDto(Conversation conversation){
        return  ConvClientDto.builder()
        .id(conversation.getId())
        .participants(conversation.getParticipants())

        .build();
       
    

    }

}
