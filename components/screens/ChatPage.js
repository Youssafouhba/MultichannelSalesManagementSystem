import { useNavigation } from '@react-navigation/core';
import { Stomp } from '@stomp/stompjs';
import axios from "axios";
import { Image } from "expo-image";
import * as React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Color, StyleVariable } from "../GlobalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';

var SockJS = require('sockjs-client/dist/sockjs.js');
const BaseUrl = "http://localhost:9001";

const apiGetHandler = async (url, token) => {
  if (token) {
    console.log("Token present: " + token);
    try {
    const response = await axios.get(`${BaseUrl}${url}`, { headers: {"Authorization" : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsImlhdCI6MTcyMTE0ODA4NywidXNlcmlkIjo0MiwiZW1haWwiOiJhbGtoc3BhbWVyQGdtYWlsLmNvbSIsInJvbGUiOlsiY2xpZW50Il19.v8fPTNciurfhn1I1QA17IQSHL3RDIj1l0NZ423zktNM`} });
    return response;
  } catch (error) {
    return error.response;
  }
  }
  
}

const ChatPage = () => {
  const [stompClient, setStompClient] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const username = "client";
  const admin = "admin";
  const chatAreaRef = React.useRef(null);
  const messageInputRef = React.useRef(null);
  const navigation = useNavigation();
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwtToken');
      console.log("Stored token: " + storedToken);
      if (storedToken) {
        setToken(storedToken);
      }
    };
    checkToken();
  }, []);

  React.useEffect(() => {
    if (token) {
      const socket = new SockJS(`${BaseUrl}/secured/chat`);
      const client = Stomp.over(socket);

      client.connect({}, () => onConnected(client), onError);

      setStompClient(client);
      findMyChat(token);

      return () => {
        if (client) {
          client.disconnect();
        }
      };
    }
  }, [token]);

  React.useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const onConnected = (client) => {
    client.subscribe(`/user/${username}/queue/messages`, onMessageReceived);
  };

  const onError = (error) => {
    console.error('STOMP error:', error);
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    setMessages(prevMessages => [...prevMessages, message]);
    chatAreaRef.current.scrollToEnd({ animated: true });
  };

  const sendMessage = () => {
    const messageContent = inputValue.trim();
    if (messageContent && stompClient) {
      const joinMessage = {
        from: username,
        to: admin,
        content: messageContent,
      };
      console.log(joinMessage);
      stompClient.send("/app/tg3edlappel", {}, JSON.stringify(joinMessage));
      setMessages(prevMessages => [...prevMessages, joinMessage]);
      setInputValue('');
      chatAreaRef.current.scrollToEnd({ animated: true });
    }
  };

  const findMyChat = async (token) => {
    if (token) {
      try {
        const userChatResponse = await apiGetHandler(`/getmyclientConversations`, token);
        console.log(userChatResponse);
        if (userChatResponse) {
          const userChat = userChatResponse.data;
          if (userChat.length > 0) {
            const selectedUser = userChat[0].participants.find(part => part !== username);
            await fetchAndDisplayUserChat({ convid: userChat[0].id, userid: selectedUser });
          }
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    } else {
      console.log("Token not stored yet");
    }
  };

  const fetchAndDisplayUserChat = async (selectedUser) => {
    try {
      const userChatResponse = await fetch(`${BaseUrl}/getConversation/${selectedUser.convid}`);
      const userChat = await userChatResponse.json();
      setMessages(userChat);
      chatAreaRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error fetching user chat:", error);
    }
  };

  const renderMessage = (message, index) => (
    <View key={index} style={[styles.messageContainer, message.from === username ? styles.sender : styles.receiver]}>
      <Text>{message.content}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <ScrollView ref={chatAreaRef} style={styles.chatMessages} contentContainerStyle={styles.contentContainer}>
        {messages.map((message, index) => renderMessage(message, index))}
      </ScrollView>
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
          <Image
            style={styles.sendIcon}
            contentFit="cover"
            source={require("../assets/send.png")}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  chatMessages: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    width : '80%',
    alignSelf: 'center',
    marginTop:"10%"
  },
  messageContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  sender: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6'
  },
  receiver: {
    alignSelf: 'flex-start',
    backgroundColor: '#dddd'
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
  input: {
    borderRadius: StyleVariable.radius200,
    borderStyle: "solid",
    borderColor: Color.borderDefaultDefault,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: StyleVariable.space400,
    paddingVertical: StyleVariable.space300,
    width: "80%",
    marginRight: 10,
    marginTop: 8,
    alignSelf: "stretch",
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
  },
  sendIcon: {
    width: 40,
    height: 40,
    overflow: "hidden",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    backgroundColor: Color.colorWhite
  },
});

export default ChatPage;
