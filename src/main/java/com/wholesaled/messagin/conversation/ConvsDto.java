package com.wholesaled.messagin.conversation;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ConvsDto {
    private String id;
    private List<String> participants;
    private String lastMessage;
    private String lastMessageTime;
    private String lastMessageSender;
}
