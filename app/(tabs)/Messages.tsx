import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { Color, FontSize, StyleVariable } from "@/GlobalStyles";
import { useAppContext } from '@/components/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '@/components/AppDataProvider';
import { baseurl } from '@/components/config';
import { TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
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
  const { state, dispatche } = useAppContext();
  const { data, cartElements, token, error } = useAppData();
  const [stompClient, setStompClient] = React.useState<Client | null>(null);
  const [connected, setConnected] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [username, setUsername] = React.useState<string | null>(null);
  const admin = "admin";
  const chatAreaRef = React.useRef<ScrollView>(null);
  const messageInputRef = React.useRef<TextInput>(null);
  const navigation = useRouter();

  var isLoggedIn = state.JWT_TOKEN !=='';
  const SERVER_URL = `http://${baseurl}:9001`;

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

  React.useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwtToken');
      if (storedToken) {
        const decodedToken = jwtDecode<{ email: string }>(storedToken);
        console.log("email is " + decodedToken.email);
        setUsername(decodedToken.email);
      }
    };
    checkToken();
  }, []);

  React.useEffect(() => {
    console.log(`token: ${token}`)
    console.log(`username: ${username}`)
    if (token && username) {
      const client = new Client({
        debug: (str) => { console.log(str) },
        webSocketFactory: () => new SockJS(`${SERVER_URL}/secured/chat`),
        connectHeaders: { Authorization: `Bearer ${token}` },
        onConnect: () => onConnected(client),
        onStompError: onError
      });

      client.activate();
      setStompClient(client);
      findMyChat(token);

      return () => {
        if (client) {
          client.deactivate();
        }
      };
    }
  }, [token, username]);

  React.useEffect(() => {
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
     stompClient.publish({destination:"/app/client/message", body:JSON.stringify(joinMessage) , headers: {"Authorization" : `Bearer ${token}`}});
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

  if(!isLoggedIn)
    return(
        <View style={styles.container}>
            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Please log in to view your Messages</Text>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
      )

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
          <Ionicons name='send-sharp' size={26} color={connected ? 'black' : 'gray'} />
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
  chatMessages: {
    flex: 1,
    backgroundColor: '#fff',
    width : '100%',
    alignSelf: 'center',
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
    paddingHorizontal: 8,
    paddingVertical: StyleVariable.space300,
    width: "90%",
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

export default Messages;

