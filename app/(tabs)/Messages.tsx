import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { Client } from '@stomp/stompjs';
import axios from "axios";
import { Image } from "expo-image";
import { jwtDecode } from "jwt-decode";
import * as React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Color, StyleVariable } from "@/GlobalStyles";
import { useAppContext } from '@/components/AppContext';
import { Ionicons } from '@expo/vector-icons';
import config from '@/components/config';


const Messages = () => {
  const {state,dispatche} = useAppContext()
  const [stompClient, setStompClient] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const [username , setUsername] = React.useState(null);
  const admin = "admin";
  const chatAreaRef = React.useRef(null);
  const messageInputRef = React.useRef(null);
  const navigation = useNavigation();
  const [token, setToken] = React.useState(null);

  var SockJS = require('sockjs-client/dist/sockjs.js');

  const apiGetHandler = async (url, token) => {
    if (token) {
      console.log("Token present: " + token);
      try {
      const response = await axios.get(`http://192.168.42.250:9001${url}`, { headers: {"Authorization" : `Bearer ${token}`} });
      console.log(response);

      return response;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
    }
    
  }

  React.useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwtToken');
      if (storedToken) {
        setToken(storedToken);
        const decodedToken = jwtDecode(storedToken);
        console.log("email is " + decodedToken.email);
        setUsername(decodedToken.email);
      }
      
    };
    checkToken();
  }, []);





  React.useEffect(() => {
    if (token && username ) {
      const client = new Client(
        {   debug: (a)=>{console.log(a)} ,
            brokerURL: state.wsUrl,
            connectHeaders : {Authorization: `Bearer ${token}` },
            appendMissingNULLonIncoming:true,
            onConnect : () => onConnected(client),
            onStompError : () => onError
        });
        client.webSocketFactory = function () {
              return new SockJS(state.wsUrl);

        }

      client.activate();
      
      setStompClient(client);
      findMyChat(token);

      return () => {
        if (client) {
          client.deactivate();
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
    client.subscribe(`/user/${username}/queue/messages`, onMessageReceived, { Authorization: `Bearer ${token}` });
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
     stompClient.publish({destination:"/app/tg3edlappel", body:JSON.stringify(joinMessage) , headers: {"Authorization" : `Bearer ${token}`}});
   setMessages(prevMessages => [...prevMessages, joinMessage]);
      setInputValue('');
      chatAreaRef.current.scrollToEnd({ animated: true });
    }
      
  };

  const findMyChat = async (token) => {
    console.log(token)
    if (token) {
      try {
        const userChatResponse = await apiGetHandler(`/getmyclientConversations`, token);
        console.log(userChatResponse);
        if (userChatResponse) {
          const userChat = userChatResponse.data;
          if (userChat.length > 0) {
            const selectedUser = userChat[0].participants.find(part => part !== username);
            await fetchAndDisplayUserChat({ convid: userChat[0].id, userid: selectedUser },token);
          }
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    } else {
      console.log("Token not stored yet");
    }
  };

  const fetchAndDisplayUserChat = async (selectedUser,token) => {
    console.log(token);
   try {
      const userChatResponse = await apiGetHandler(`/getConversation/${selectedUser.convid}`,token);

      if (userChatResponse) {
        const userChat = userChatResponse.data;
         setMessages(userChat);
      chatAreaRef.current.scrollToEnd({ animated: true });
      }
     
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
          <Ionicons name='send-sharp' size={26} color={'black'} />
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

