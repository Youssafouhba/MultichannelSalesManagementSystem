package com.wholesaled.messagin.conversation;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {

    @Query("{'participants': {$all: [?0, ?1]}}")
    Optional<Conversation> findByParticipants(String participant1, String participant2);

    @Query("{'participants': ?0}")
    List<Conversation> findByOneParticipant(String participant);
}