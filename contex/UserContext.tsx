import WebSocketService from '@/components/WebsocketService';
import config from '@/components/config';
import { Product, UserDTO, UserInfos } from '@/constants/Classes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { useCart } from './CartContex';
import { useMessage } from './MessageReducer';
import axios from 'axios';

interface UserState {
  isLoggedIn: boolean;
  JWT_TOKEN: string;
  userInfos: UserInfos;
  userId: string;
  orderedProducts: Product[];
  isRated: boolean;
  notificationsCount: number;
  isEmpty: boolean;
}

type UserAction =
  | { type: 'SET_USER_INFOS'; payload: UserInfos }
  | { type: 'SET_JWT_TOKEN'; payload: string }
  | { type: 'SET_LOGGED_IN'; payload: boolean }
  | { type: 'UPDATE_MY_ORDERS'; payload: any }
  | { type: 'UPDATE_MY_WISHLIST'; payload: string }
  | { type: 'Update_Notifications'; payload: any }
  | { type: 'Set_isRated'; payload: boolean }
  | { type: 'SET_notificationsCount'; payload: number}
  | { type: 'RESTORE_SESSION'; payload: UserState }
  | {type: 'Set_isEmpty'; payload: boolean}
  | { type: 'LOGOUT' };

const initialState: UserState = {
  isLoggedIn: false,
  JWT_TOKEN: '',
  isRated: false,
  isEmpty: false,
  orderedProducts: [],
  userInfos: {
    user: {} as UserDTO,
    wishlist: [],
    shoppingList: [],
    myOrders: [],
    loginResponse: { message: '', token: '' },
    myNotifications: [],
  },
  userId: '',
  notificationsCount: 0,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_USER_INFOS':
      const sortedOrders = action.payload.myOrders ? 
        action.payload.myOrders.sort((a, b) =>
          new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        ) : [];
      const token = action.payload.loginResponse!=null?action.payload.loginResponse.token:state.JWT_TOKEN;
      return {
        ...state,
        isEmpty: true,
        notificationsCount: action.payload.myNotifications.filter((item) => !item.isRead).length,
        userInfos: { ...action.payload, myOrders: sortedOrders },
        JWT_TOKEN: token,
        isLoggedIn: true,
      };
    case 'SET_JWT_TOKEN':
      return { ...state, JWT_TOKEN: action.payload };
    case 'Set_isRated':
      return { ...state, isRated: action.payload };
    case 'SET_LOGGED_IN':
      return { ...state, isLoggedIn: action.payload };
    case 'UPDATE_MY_ORDERS':
      if (action.payload && action.payload.object && action.payload.action) {
        const { object, action: updateAction } = action.payload;
        const currentOrders = state.userInfos.myOrders || [];
        switch (updateAction) {
          case 'add':
            return {
              ...state,
              isEmpty: true,
              userInfos: {
                ...state.userInfos,
                myOrders: [object, ...currentOrders].sort((a, b) =>
                  new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
                )
              }
            };
          case 'update':
            const updatedOrders = currentOrders.map(order =>
              order.id === object.id ? object : order
            ).sort((a, b) =>
              new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
            );
            return {
              ...state,
              isEmpty: true,
              userInfos: {
                ...state.userInfos,
                myOrders: updatedOrders
              }
            };
          case 'delete':
            const filteredOrders = currentOrders.filter(order => order.id !== object.id);
            return {
              ...state,
              isEmpty: true,
              userInfos: {
                ...state.userInfos,
                myOrders: filteredOrders
              }
            };
          default:
            return state;
        }
      } else {
        console.error('Invalid payload for Update_myOrders:', action.payload);
        return state;
      }
    case 'Update_Notifications': {
      const currentNotifications = state.userInfos.myNotifications || [];
      return {
        ...state,
        userInfos: {
          ...state.userInfos,
          myNotifications: [action.payload, ...currentNotifications]
        },
        notificationsCount: state.notificationsCount + 1
      };
    }
    case 'UPDATE_MY_WISHLIST':
      const newWishlist = state.userInfos.wishlist.filter((p: Product) => p.id != action.payload)
      return {
        ...state,
        isEmpty: true,
        userInfos: {
          ...state.userInfos,
          wishlist: newWishlist
        }
      };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_notificationsCount':
      return { ...state, notificationsCount: action.payload };
    default:
      return state;
  }
}

const UserContext = createContext<{
  state: UserState;
  login: (userData: UserInfos) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: () => Promise<boolean>;
  updateMyOrders: (orders: any) => void;
  updateOrderAndNotif: (OrderNotif:any)=>void;
  setnotifcount: (count: number) => void;
  setJWT_TOKEN: (jwt: string)=>void;
  updateMyWishList: (id: string)=> void;
  OnReload: (userInfo: UserInfos)=> void;
} | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { cleanCart, addToCart} = useCart();
  const {clearMessages,initializeWebSocket} = useMessage()
  const wsService = WebSocketService.getInstance(config.API_BASE_URL);

  const initizeapp = useCallback(async(token: string)=>{
    const response = await axios.get<UserInfos>(`${config.API_BASE_URL}/api/client/getMyProfil`,{ headers: { Authorization: `Bearer ${token}` } });
    dispatch({ type: 'SET_USER_INFOS', payload: response.data });
  },[])

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const secureData = await SecureStore.getItemAsync('secureUserSession');
        if (secureData) {
          const { token } = JSON.parse(secureData);
          dispatch({ type: 'SET_JWT_TOKEN', payload: token });
          const response = await axios.get<UserInfos>(`${config.API_BASE_URL}/api/client/getMyProfil`,{ headers: { Authorization: `Bearer ${token}` } });
          dispatch({ type: 'SET_USER_INFOS', payload: response.data });
          initializeWebSocket(token,response.data.user.email)
        }
        const userInfos = JSON.parse(await AsyncStorage.getItem('userInfos') || '{}');     
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
          dispatch({ type: 'SET_LOGGED_IN', payload: true });
        }
      } catch (error) {
        console.error('Error restoring user session:', error);
      }
    };
    restoreSession();
    
  }, []);



  const updateMyWishList = useCallback((id: string)=>{
    dispatch({type: "UPDATE_MY_WISHLIST",payload: id})
  },[])
  const setJWT_TOKEN = useCallback((jwt: string)=>{
    dispatch({ type: 'SET_JWT_TOKEN', payload: jwt});
  },[])
  const updateMyOrders = useCallback((orders: any) => {
    dispatch({ type: 'UPDATE_MY_ORDERS', payload: orders });
  }, []);
  wsService.setCallback('onNotificationReceived',async (notification) => {
    console.log('Update_notifications : '+notification)
    dispatch({ type: 'Update_Notifications', payload: notification });
  });
  wsService.setCallback('onOrderUpdate', async (orderUpdate) => {
    console.log('Update_myOrders : '+orderUpdate.object.id)
    if(orderUpdate.object.id){
      dispatch({ type: 'UPDATE_MY_ORDERS', payload: orderUpdate });
    }
   
  });

  const login = useCallback(async (userData: UserInfos) => {
    try {
      dispatch({ type: 'SET_USER_INFOS', payload: userData });
      dispatch({ type: 'SET_JWT_TOKEN', payload: userData.loginResponse.token });
      dispatch({ type: 'SET_LOGGED_IN', payload: true });
      initializeWebSocket(userData.loginResponse.token,userData.user.email)
      await SecureStore.setItemAsync('secureUserSession', JSON.stringify({ token: userData.loginResponse.token }));
      await AsyncStorage.setItem('userInfos', JSON.stringify(userData));
      await AsyncStorage.setItem('isLoggedIn', 'true');
     /* if(userData.shoppingList!=null)
        console.log("shoping list ....")
        userData.shoppingList.forEach(item => {
          addToCart(item.product.id, item.quantity);
        });*/
      wsService.setCallback('onNotificationReceived',async (notification) => {
        initizeapp(state.JWT_TOKEN);
        //console.log('Update_notifications : '+notification)
        dispatch({ type: 'Update_Notifications', payload: notification });
      });
      wsService.setCallback('onOrderUpdate', async (orderUpdate) => {
        //console.log('Update_myOrders : '+orderUpdate.object.id)
        initizeapp(state.JWT_TOKEN);
        dispatch({ type: 'UPDATE_MY_ORDERS', payload: orderUpdate });
      });
    } catch (error) {
      console.error('Error during login:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      dispatch({ type: 'LOGOUT' });
      await SecureStore.deleteItemAsync('secureUserSession');
      await AsyncStorage.removeItem('userInfos');
      await AsyncStorage.setItem('isLoggedIn', 'false');
     // cleanCart();
      clearMessages();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [clearMessages]);

  const isLoggedIn = useCallback(async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      return loggedIn === 'true';
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }, []);


  const updateOrderAndNotif = useCallback((OrderNotif: any) => {
    dispatch({ type: 'UPDATE_MY_ORDERS', payload: {object: OrderNotif.order,action: 'add'} });
    dispatch({ type: 'Update_Notifications', payload: OrderNotif.notification });
  }, []);

  useEffect(() => {
    console.log(state.isEmpty)
    const saveSession = async () => {
      try {
        console.log("saving....")
        await AsyncStorage.setItem('userInfos', JSON.stringify(state.userInfos));
      } catch (error) {
        console.error('Error saving session:', error);
      }
    };
    if(state.isEmpty==true)
      saveSession();
  }, [state.isEmpty]);


  
  const setnotifcount = useCallback((count: number) => {
    dispatch({ type: 'SET_notificationsCount', payload: count });
  }, []);

  const setUserInfos = useCallback((userInfos: UserInfos) => {
    dispatch({ type: 'SET_USER_INFOS', payload: userInfos });
  }, []);

  const OnReload = useCallback((userInfo: UserInfos) => {
    dispatch({ type: 'SET_USER_INFOS', payload: userInfo });
  }, []);



  const value = useMemo(() => ({
    state,
    login,
    logout,
    isLoggedIn,
    updateMyOrders,
    setUserInfos,
    setnotifcount,
    setJWT_TOKEN,
    updateMyWishList,
    updateOrderAndNotif,
    OnReload
  }), [state]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};