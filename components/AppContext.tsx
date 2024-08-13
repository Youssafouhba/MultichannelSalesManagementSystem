import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import config from './config';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { baseurl } from './config';
import { Notification } from '@/constants/Classes';

const AppContext = createContext(null);

const initialState = {
  theme: 'light',
  API_BASE_URL: config.API_BASE_URL,
  API_BASE_URL_ADMIN: `http://${baseurl}:9999`,
  API_BASE_URL_PRODUCT: `http://${baseurl}:8080`,
  products: [],
  filtredproducts: [],
  Notifications: [],
  offers: {},
  previouspage: '',
  isLoggedIn: false,
  isRated: false,
  order: null,
  product: null,
  productId: 0,
  JWT_TOKEN: '',
  userInfos: {},
  userId: '',
  wsUrl: 'http://192.168.42.88:9001',
  cartItemsCount: 0,
  notificationsCount: 0,
  messagesCount: 0,
  cartItems: {},
};

function appReducer(state: any, action: any) {
  switch (action.type) {
    case 'Set_Notifications':
      return { 
        ...state, 
        Notifications: [action.payload, ...state.Notifications],
        notificationsCount: state.notificationsCount + 1
       };
    case 'Set_userInfos':
      if(action.payload.myOrders!=undefined){
        action.payload.myOrders = action.payload.myOrders.sort((a: any, b: any) =>
          new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );
      }
      return {
        ...state,
        userInfos: action.payload,
        JWT_TOKEN: action.payload.loginResponse.token,
        isLoggedIn: true
      };
    case 'Set_userInfos_WishList':
      return { ...state, userInfos: action.payload };
    case 'Set_isRated':
      return { ...state, isRated: action.payload };
    case 'Set_previouspage':
      return { ...state, previouspage: action.payload };
    case 'ADD_TO_CART': {
      const { id, quantity } = action.payload;
      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [id]: { quantity: (state.cartItems[id]?.quantity || 0) + quantity }
        },
        cartItemsCount: state.cartItemsCount + quantity
      };
    }
    case 'UPDATE_CART_ITEM_QUANTITY': {
      const { productId, quantity } = action.payload;
      const oldQuantity = state.cartItems[productId]?.quantity || 0;
      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [productId]: { ...state.cartItems[productId], quantity }
        },
        cartItemsCount: state.cartItemsCount - oldQuantity + quantity
      };
    }
    case 'REMOVE_FROM_CART': {
      const { [action.payload]: removedItem, ...restCartItems } = state.cartItems;
      return {
        ...state,
        cartItems: restCartItems,
        cartItemsCount: state.cartItemsCount - (removedItem?.quantity || 0)
      };
    }
    case 'CLEAN_CART': {
      return {
        ...state,
        cartItems: {},
        cartItemsCount: 0
      };
    }
    case 'CLEAN_Notifications': {
      return {
        ...state,
        Notifications: {},
        notificationsCount: 0
      };
    }
    case 'Update_Notifications': {
      const updatedNotifications = state.Notifications.map((notification: Notification)  => 
        notification.id === action.payload.id
          ? { ...notification, ...action.payload.updates }
          : notification
      );
      return {
        ...state,
        Notifications: updatedNotifications,
        notificationsCount: state.Notifications.filter((notification: Notification) => !notification.isRead).length
      };
    }
    case 'SET_JWT_TOKEN':
      return { ...state, JWT_TOKEN: action.payload };
    case 'SET_isLoggedIn':
      return { ...state, isLoggedIn: action.payload };
    case 'SET_wsUrl':
      return { ...state, wsUrl: action.payload };
    case 'SET_Product':
      return { ...state, product: action.payload };
    case 'SET_USER':
      return { ...state, userId: action.payload };
    case 'SET_notificationsCount':
      return { ...state, notificationsCount: action.payload.notifscount };
    case 'SET_messagesCount':
      return { ...state, messagesCount: action.payload.msgscount };
    case 'SET_filtredproducts':
      return { ...state, filtredproducts: action.payload };
    case "Set_Order":
      return {...state,order: action.payload}
    default:
      return state;
  }
}


export function AppProvider({ children }: { children: any }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const updateItemQuantity = (productId: string, change: number) => {
    const currentQuantity = state.cartItems[productId]?.quantity || 0;
    const newQuantity = Math.max(0, currentQuantity + change);

    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } else {
      dispatch({ type: 'UPDATE_CART_ITEM_QUANTITY', payload: { productId, quantity: newQuantity } });
    }
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, updateItemQuantity, removeItem }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}