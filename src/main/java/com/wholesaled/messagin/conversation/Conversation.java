package com.wholesaled.messagin.conversation;




import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wholesaled.messagin.message.Message;

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
@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;
    private List<String> participants; // Enforced to have 2 participants 'Admin" - client uset
    @DBRef
    private List<Message> messages;


}
