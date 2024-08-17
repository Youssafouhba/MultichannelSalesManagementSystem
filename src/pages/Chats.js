// Chats.js
import { Avatar } from "@windmill/react-ui";
import React, { useCallback, useEffect, useState } from "react";
import ChatSection from "../components/ChatSection";
import ChatUserCard from "../components/ChatUserCard";
import SelectChatWaiter from "../components/SelectChatWait/SelectChatWaiter";
import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import { useAuth } from "../security/Authentification";
import MessageService from "../service/MessageService";
import { UserService } from "../service/UserService";

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState(undefined);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const Auth = useAuth();
  const token = Auth.getToken();
  const user = Auth.getUser();
  const isUser = user.role[0] === 'SuperAdmin';
  const [userMap, setUserMap] = useState({});
  const [messageService, setMessageService] = useState(null);

  const onMessageReceived = useCallback((payload) => {
    const message = JSON.parse(payload.body);
    message.timestamp = new Date();

    if (message.id != null) {
      setMessages((prevMessages) => [...prevMessages, message]);

      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conv) => {
          if (conv.participants.includes(message.from,message.to)) {
            return {
              ...conv,
              lastMessage: message.content,
              lastMessageTime: message.timestamp,
            };
          }
          return conv;
        });

        // Sort conversations by lastMessageTime
        return updatedConversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      });
    }
  }, []);

  useEffect(() => {
    const service = new MessageService(token, onMessageReceived);
    setMessageService(service);
    service.activate();

    return () => {
      service.deactivate();
    };
  }, [token, onMessageReceived]);

  const handleSelect = async (conversation) => {
    const response = await messageService.getConversation(token, conversation.id);
    const data = response.data;
    setMessages(data);
    setSelectedChat(conversation);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await UserService.getAllClients(token);
      const userMap = response.data.reduce((map, user) => {
        map[user.email] = `${user.fullName}`;
        return map;
      }, {});
      setUserMap(userMap);
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchConversations = async () => {
      const response = await messageService.getMyConversations(token);
      const data = response.data;
      setConversations(data.filter(conv => conv != null));
    };

    if (messageService) {
      fetchConversations();
    }
  }, [messageService, token]);

  const getParticipantName = (participants) => {
    const participantEmail = participants.find(email => email !== "admin");
    return userMap[participantEmail] || participantEmail;
  };

  return (
    <div>
      {!selectedChat && <PageTitle>Connect with your customers</PageTitle>}
      {selectedChat && (
        <div className="flex items-center mt-6">
          <Avatar className="hidden md:inline-flex" src={"https://res.cloudinary.com/dlkvn0fpz/image/upload/v1722530752/pfsfiles/sg4ebvzr3yjfpteme7xz.webp"} />
          <p className="mx-3 inline-flex text-2xl font-semibold text-gray-700 dark:text-gray-200">
            {getParticipantName(selectedChat.participants)}
          </p>
        </div>
      )}

      <div className="grid grid-col md:grid-cols-4 gap-1">
        <div className="md:col-span-3">
          {!selectedChat ? (
            <div className="mt-32 flex flex-col justify-center items-center">
              <SelectChatWaiter />
              <p className="text-gray-600 dark:text-gray-400">Select a chat</p>
            </div>
          ) : (
            <div>
              <ChatSection messages={messages} setMessages={setMessages} messageService={messageService} receiver={selectedChat.participants.find(email => email !== "admin")} token={token} />
            </div>
          )}
        </div>
        <div className="">
          <SectionTitle>Contacts</SectionTitle>
          {conversations.map((conversation, id) => (
            <ChatUserCard
              key={id}
              participantsName={getParticipantName(conversation.participants)}
              lastMessage={conversation.lastMessage}
              lastMessageTime={conversation.lastMessageTime}
              handleClick={() => handleSelect(conversation)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chats;
