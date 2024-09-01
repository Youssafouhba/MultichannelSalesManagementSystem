import MessageService from '@/components/MessageService';
import WebSocketService from '@/components/WebsocketService';
import config from '@/components/config';
import { Message } from '@/constants/Classes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { usePathname } from 'expo-router';
interface MessageState {
  messages: Message[];
  messagesCount: number;
  wsService: WebSocketService | null;
  messagingws: MessageService | null;
}

type MessageAction = 
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGES_BATCH'; payload: Message[] }
  | { type: 'SET_WS_SERVICE'; payload: WebSocketService }
  | { type: 'SET_MS'; payload: MessageService }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_MESSAGES_COUNT'; payload: number };

const initialState: MessageState = {
  messages: [],
  messagesCount: 0,
  wsService: null,
  messagingws: null,
};

function MessageReducer(statemessages: MessageState, action: MessageAction): MessageState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...statemessages, messages: action.payload };
    case 'ADD_MESSAGE':
      if(action.payload.from=="admin"){
        return {
          ...statemessages,
          messages: [...statemessages.messages, action.payload],
          messagesCount: statemessages.messagesCount + 1,
        };
      }else{
        return {
          ...statemessages,
          messages: [...statemessages.messages, action.payload],
          messagesCount: 0,
        };
      }
    case 'UPDATE_MESSAGES_BATCH':
      return {
        ...statemessages,
        messages: [...statemessages.messages, ...action.payload],
      };
    case 'SET_WS_SERVICE':
      return { ...statemessages, wsService: action.payload };
    case 'SET_MS':
      return { ...statemessages, messagingws: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...statemessages, messages: [], messagesCount: 0 };
    case 'SET_MESSAGES_COUNT':
      return { ...statemessages, messagesCount: action.payload };
    default:
      return statemessages;
  }
}

const MessageContext = createContext<{
  statemessages: MessageState;
  sendMessage: (message: any) => void;
  setMessages: (messages: any) => void;
  clearMessages: () => void;
  setMessagesCount: (count: number) => void;
  initializeWebSocket: (token: string, email: string) => void;
} | null>(null);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statemessages, dispatch] = useReducer(MessageReducer, initialState);
  const setMessagesCount = useCallback((count: number)=>{
    dispatch({type: 'SET_MESSAGES_COUNT', payload: count})
  },[]);

  useEffect(() => {
    const restoreMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem('messages');
        if (storedMessages) {
          dispatch({ type: 'SET_MESSAGES', payload: JSON.parse(storedMessages) });
        }
        const storedCount = await AsyncStorage.getItem('messagesCount');
        if (storedCount) {
          dispatch({ type: 'SET_MESSAGES_COUNT', payload: parseInt(storedCount, 10) });
        }
      } catch (error) {
        console.error('Error restoring messages:', error);
      }
    };
    restoreMessages();
  }, []);

  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem('messages', JSON.stringify(statemessages.messages));
        await AsyncStorage.setItem('messagesCount', statemessages.messagesCount.toString());
      } catch (error) {
        console.error('Error saving messages:', error);
      }
    };
    saveMessages();
  }, [statemessages.messages, statemessages.messagesCount]);

  const setMessages = useCallback((messages: any) => {
    dispatch({type: 'UPDATE_MESSAGES_BATCH', payload: messages})
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (statemessages.messagingws) {
      dispatch({ type: 'ADD_MESSAGE', payload: message });
      statemessages.messagingws.sendMessage("/app/client/message", message);
    }
  }, [statemessages.messagingws]);

  const onMessageReceived = useCallback((message: Message) => {
    if(message.id!=null){
      console.log("received message is : "+message)
      dispatch({ type: 'ADD_MESSAGE', payload: message });
    }
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const initializeWebSocket = useCallback((token: string, email: string) => {
    const wsService = WebSocketService.getInstance(config.API_BASE_URL);
    const messagingws = MessageService.getInstance(token,email);
    messagingws.connectMessaging(email);
    wsService.connect(token);
    messagingws.setCallback('onMessageSent', sendMessage);
    messagingws.setCallback('onMessageReceived', onMessageReceived);
    dispatch({ type: 'SET_MS', payload: messagingws });
    dispatch({ type: 'SET_WS_SERVICE', payload: wsService });
    return () => {
      // Cleanup function if needed
      wsService.onDisconnect()
      messagingws.onDisconnect()
    };
  }, [sendMessage,onMessageReceived]);

  return (
    <MessageContext.Provider value={{ statemessages, sendMessage, clearMessages, setMessages, initializeWebSocket,setMessagesCount }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};