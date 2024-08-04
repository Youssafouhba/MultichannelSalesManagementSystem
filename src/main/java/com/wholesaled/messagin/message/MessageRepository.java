package com.wholesaled.messagin.message;



import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
  //  List<Message> findByChatId(String chatId);
}