import { Color, } from "@/GlobalStyles";
import LogInRequiredPage from '@/components/LogInRequiredPage';
import NoInternetConnection from '@/components/NoInternetConnection';
import useInternetCheck from '@/components/useInternetCheck';
import { Message } from '@/constants/Classes';
import { useMessage } from '@/contex/MessageReducer';
import { useUser } from '@/contex/UserContext';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';



interface UserChat {
  id: string;
  participants: string[];
}
const Messages: React.FC = () => {
  const { sendMessage,statemessages,setMessages , initializeWebSocket,setMessagesCount } = useMessage();
  const {state} = useUser()
  const [inputValue, setInputValue] = useState<string>('');
  const chatAreaRef = React.useRef<ScrollView>(null);
  const messageInputRef = React.useRef<TextInput>(null);
  const SERVER_URL = `https://messaging.wholesaled.xyz`;
  const [loaded, setloaded] = useState<boolean>(true);
  const { isConnected, connectionType } = useInternetCheck();

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      const message = {
        content: inputValue,
        from: state.userInfos.user?.email,
        to: "admin",
      };
      setInputValue(''); // Clear the input after sending the message
      sendMessage(message); // Send the message using the context method
    }
  };

  const apiGetHandler = async (url: string) => {
    console.log(state.JWT_TOKEN)
    if (state.JWT_TOKEN!=undefined) {
      try {
        const response = await axios.get(`${SERVER_URL}${url}`, { headers: { Authorization: `Bearer ${state.JWT_TOKEN}` } });
        return response;
      } catch (error: any) {
        console.log(error.response);
        return error.response;
      }
    }
  }

  useEffect(() => {
    const fetchAndDisplayUserChat = async (convid: string, userid: string) => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/getConversation/${convid}`, {
          headers: { Authorization: `Bearer ${state.JWT_TOKEN}` },
        });
  
        if (data) {
          setMessages(data)
          chatAreaRef.current?.scrollToEnd({ animated: true }); // Scroll to the end after fetching messages
        }
        setloaded(false)
      } catch (error) {
        console.error("Error fetching user chat:", error);
      }
      finally{
        
      }
    };
  
    const findMyChat = async () => {
      try {
        const { data } = await apiGetHandler(`/getmyclientConversations`);
        if (data && state.userInfos.user?.email) {
          const userChat = data as UserChat[];
          const selectedUser = userChat[0]?.participants.find(
            (part) => part !== state.userInfos.user?.email
          );
          
          if (selectedUser) {
            await fetchAndDisplayUserChat(userChat[0].id, selectedUser);
          }
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };
  
    if (state.isLoggedIn) {
      findMyChat();
    }
  }, [state.isLoggedIn]);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    chatAreaRef.current?.scrollToEnd({ animated: true });
  }, [statemessages.messages]);

  const renderMessage = (message: Message, index: number) => (
    <View key={index} style={[styles.messageContainer, message.from === state.userInfos.user?.email ? styles.sender : styles.receiver]}>
      <Text>{message.content}</Text>
    </View>
  );

  if (!state.isLoggedIn)
    return (
      <View style={styles.container}>
        <LogInRequiredPage message="Please log in to view your Messages" page="Messages" />
      </View>
    );

  return (
      !isConnected?
      <NoInternetConnection/>
      :
    <View style={styles.container}>
      <Spinner
        visible={loaded}
        overlayColor='rgba(0,0,0,0.1)'
        textContent={'Loading...'}
        textStyle={{color: '#fff'}}
      />

      <ScrollView
        ref={chatAreaRef}
        style={styles.chatMessages}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {statemessages.messages.map((message: Message, index: number) => renderMessage(message, index))}
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
        <Pressable onPress={handleSendMessage}>
          <Ionicons name="send-sharp" size={26} color={inputValue.trim() ? 'black' : 'gray'} />
        </Pressable>
      </View>
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
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    fontSize: 16,
  },
  contentContainer: {
    paddingVertical: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
    backgroundColor: Color.colorWhite
  },
});

export default Messages;