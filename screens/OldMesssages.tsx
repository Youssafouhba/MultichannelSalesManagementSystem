import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, Image, Pressable, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Client } from '@stomp/stompjs';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Color, FontSize } from "@/GlobalStyles";
import { useAppContext } from '@/components/AppContext';
import { useAppData } from '@/components/AppDataProvider';
import { baseurl } from '@/components/config';
import tw from 'tailwind-react-native-classnames';
import { set } from 'lodash';

const SockJS = require('sockjs-client/dist/sockjs.js');

interface Message {
  from: string;
  to: string;
  content: string;
}

interface UserChat {
  id: string;
  participants: string[];
}

const Messages: React.FC = () => {
  const { state,dispatch } = useAppContext();
  const { data,userInfos, cartElements, token } = useAppData();
  const [stompClient, setStompClient] = React.useState<Client | null>(null);
  const [connected, setConnected] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [username, setUsername] = React.useState<string | null>(null);
  const admin = "admin";
  const chatAreaRef = React.useRef<ScrollView>(null);
  const messageInputRef = React.useRef<TextInput>(null);
  const navigation = useRouter();

  const isLoggedIn = state.JWT_TOKEN !== '' && userInfos!=undefined;
  const SERVER_URL = `http://${baseurl}:9001`;
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSuggestions1, setShowSuggestions1] = useState(true);
  const [suggestions] = useState([
    "Do you have any questions about our products ?",
    "Would you like a personalized quote ?",
    "Can I help you with a specific issue ?",
  ]);

  const apiGetHandler = async (url: string, token: string) => {
    if (token) {
      console.log("Token present: " + token);
      try {
        const response = await axios.get(`${SERVER_URL}${url}`, { headers: { "Authorization": `Bearer ${token}` } });
        console.log(response.data);
        return response;
      } catch (error: any) {
        console.log(error.response);
        return error.response;
      }
    }
  }

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwtToken');
      if (storedToken) {
        const decodedToken = jwtDecode<{ email: string }>(storedToken);
        console.log("email is " + decodedToken.email);
        setUsername(decodedToken.email);
      }
    };
   
    setTimeout(() => {
      setShowSuggestions1(false)
    }, 2000);
    setShowSuggestions1(true)
    checkToken();
  }, []);

  useEffect(() => {
    console.log(`token: ${token}`)
    console.log(`username: ${username}`)
    if (isLoggedIn) {
      const client = new Client({
        debug: (str) => { console.log(str) },
        webSocketFactory: () => new SockJS(`${SERVER_URL}/secured/chat`),
        connectHeaders: { Authorization: `Bearer ${token}` },
        onConnect: () => onConnected(client),
        onStompError: onError
      });

      client.activate();
      setStompClient(client);
      findMyChat(token)
      return () => {
        if (client) {
          client.deactivate();
        }
      };
    }
  }, [token]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);


  const onConnected = (client: Client) => {
    setConnected(true);
    if (username) {
      client.subscribe(`/user/${username}/queue/messages`, onMessageReceived, { Authorization: `Bearer ${token}` });
    }
  };

  const onError = (error: any) => {
    console.error('STOMP error:', error);
    setConnected(false);
    Alert.alert("Connection Error", "Failed to connect to the chat server. Please try again later.");
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    state.messagesCount = state.messagesCount + 1
    if (message.id != null) {
      setMessages(prevMessages => [...prevMessages, message]);
    }
  };

  const sendMessage = () => {
    const messageContent = inputValue.trim();
    console.log(messageContent)
    if (messageContent && stompClient) {
      const joinMessage = {
        from: username,
        to: admin,
        content: messageContent,
      };
      console.log(joinMessage);
      stompClient.publish({ destination: "/app/client/message", body: JSON.stringify(joinMessage), headers: { "Authorization": `Bearer ${token}` } });
      setMessages(prevMessages => [...prevMessages, joinMessage]);
      setInputValue('');
    }
  };

  const findMyChat = async (token: string) => {
    if (token) {
      try {
        const userChatResponse = await apiGetHandler(`/getmyclientConversations`, token);
        console.log(userChatResponse);
        if (userChatResponse && userChatResponse.data) {
          const userChat: UserChat[] = userChatResponse.data;
          if (userChat.length > 0 && username) {
            const selectedUser = userChat[0].participants.find(part => part !== username);
            if (selectedUser) {
              await fetchAndDisplayUserChat({ convid: userChat[0].id, userid: selectedUser }, token);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    } else {
      console.log("Token not stored yet");
    }
  };

  const handleLogin = () => {
    navigation.navigate("LoginPage?id=Messages");
  };

  const fetchAndDisplayUserChat = async (selectedUser: { convid: string, userid: string }, token: string) => {
    try {
      const userChatResponse = await apiGetHandler(`/getConversation/${selectedUser.convid}`, token);

      if (userChatResponse && userChatResponse.data) {
        const userChat: Message[] = userChatResponse.data;
        setMessages(userChat);
        chatAreaRef.current?.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("Error fetching user chat:", error);
    }
  };

  const renderMessage = (message: Message, index: number) => (
    <View key={index} style={[styles.messageContainer, message.from === username ? styles.sender : styles.receiver]}>
      <Text>{message.content}</Text>
    </View>
  );

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Please log in to view your Messages</Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView ref={chatAreaRef} style={styles.chatMessages} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {messages.map((message, index) => renderMessage(message, index))}
      </ScrollView>
 
          <View style={[tw`flex-col `]}>
            {showSuggestions1?
              <View style={[styles.suggestionsList1]}>
              <TouchableOpacity
                  style={[]}
                  onPress={() => setShowSuggestions(true)}
                >
                  <Text>Hello, how can I assist you today ?</Text>
              </TouchableOpacity>
            </View>
            :``}
            <TouchableOpacity onPress={toggleSuggestions} style={styles.robotIconContainer}>
                <Image style={[{ width: 50, height: 50, borderRadius: 50, }]} source={require("@/assets/images/robot_10817242.png")} />
            </TouchableOpacity>
          </View>
      

      <View style={styles.send}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          multiline={true}
          numberOfLines={1}
          ref={messageInputRef}
          value={inputValue}
          onChangeText={setInputValue}
        />
        <Pressable onPress={sendMessage}>
          <Ionicons name='send-sharp' size={26} color={connected ? 'black' : 'gray'} />
        </Pressable>
      </View>
      <Modal
        visible={showSuggestions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSuggestions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionClick(suggestion)}
              >
                <Text>{suggestion}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.suggestionItem, styles.closeButton]}
              onPress={() => setShowSuggestions(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatMessages: {
    flex: 1,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    marginBottom: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  sender: {
    alignSelf: 'flex-end',
    backgroundColor: '#E0EAFC',
  },
  receiver: {
    alignSelf: 'flex-start',
    backgroundColor: Color.COLORALICEBLUE,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  senderText: {
    color: '#FFFFFF',
  },
  receiverText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: '#FFFFFF',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: FontSize.presetsBody2_size,
    color: Color.colorBlack,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: Color.colorBlack,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: Color.colorWhite,
    fontSize: FontSize.presetsBody2_size,
  },
  send: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff'
  },
  contentContainer: {
    paddingVertical: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
    backgroundColor: Color.colorWhite
  },
  robotIconContainer: {
    backgroundColor: 'transparent',
    width: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  suggestionsList: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  suggestionsList1: {
    position: 'absolute',
    bottom: 35,
    width: '80%',
    left: 40,
    backgroundColor: 'whitesmoke',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default Messages;
