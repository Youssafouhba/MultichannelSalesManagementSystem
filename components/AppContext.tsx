import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Notification, Product } from '@/constants/Classes';
import config, { baseurl } from './config';
import WebSocketService from './WebsocketService';
import axios from 'axios';

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
  previouspage: 'index',
  isLoggedIn: false,
  isRated: false,
  order: null,
  orderedProducts: [],
  product: null,
  productId: 0,
  JWT_TOKEN: '',
  userInfos: {},
  userId: '',
  wsUrl: `http://${baseurl}:9001`,
  cartItemsCount: 0,
  notificationsCount: 0,
  messagesCount: 0,
  cartItems: {},
};

function appReducer(state, action) {
  switch (action.type) {
    case 'Set_userInfos':
      if (action.payload.myOrders) {
        action.payload.myOrders = action.payload.myOrders.sort((a, b) =>
          new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );

      }
      return {
        ...state,
        notificationsCount: action.payload.myNotifications.filter((item: Notification) => !item.isRead).length,
        userInfos: action.payload,
        JWT_TOKEN: action.payload.loginResponse.token,
        isLoggedIn: true,
      };

    case 'Update_myOrders':
      if (action.payload && action.payload.object && action.payload.action) {
            const { object, action: updateAction } = action.payload;
    
            // Assurez-vous que l'objet `myOrders` est un tableau
            const currentOrders = state.userInfos.myOrders || [];
    
            switch (updateAction) {
              case 'add':
                // Ajoute la nouvelle commande
                return {
                  ...state,
                  userInfos: {
                    ...state.userInfos,
                    myOrders: [object, ...currentOrders].sort((a, b) =>
                      new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
                    )
                  }
                };
    
              case 'update':
                // Met à jour la commande existante
                const updatedOrders = currentOrders.map(order =>
                  order.id === object.id ? object : order
                ).sort((a, b) =>
                  new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
                );
                return {
                  ...state,
                  userInfos: {
                    ...state.userInfos,
                    myOrders: updatedOrders
                  }
                };
    
              case 'delete':
                // Supprime la commande
                const filteredOrders = currentOrders.filter(order => order.id !== object.id);
                return {
                  ...state,
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
            return state; // Retourner l'état inchangé en cas d'erreur
          }
    case 'Set_userInfos_WishList':
      const newWishlist = state.userInfos.wishlist.filter((p: Product)=>p.id!=action.payload)
      return { ...state, userInfos: {
        ...state.userInfos,
        wishlist: newWishlist
      } };
    case 'Set_orderedProducts':
      return {...state,orderedProducts: action.payload}
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
    case 'CLEAN_CART':
      return {
        ...state,
        cartItems: {},
        cartItemsCount: 0
      };
    case 'CLEAN_Notifications':
      return {
        ...state,
        Notifications: [],
        notificationsCount: 0
      };
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
    case 'Set_Order':
      return { ...state, order: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const wsService = new WebSocketService(config.API_BASE_URL);

  useEffect(() => {
    const token = state.JWT_TOKEN;

    if (token) {
      wsService.connect(token);

      wsService.setNotificationCallback(notification => {
        const notification1 = JSON.parse(notification.body);
        dispatch({ type: 'Update_Notifications', payload: notification1 });
      });



      wsService.setOrderUpdateCallback(orderUpdate => {
        dispatch({ type: 'Update_myOrders', payload: orderUpdate });
      });

      return () => {
        wsService.disconnect();
      };
    }
  }, [state.JWT_TOKEN]);

  const updateItemQuantity = (productId, change) => {
    const currentQuantity = state.cartItems[productId]?.quantity || 0;
    const newQuantity = Math.max(0, currentQuantity + change);

    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } else {
      dispatch({ type: 'UPDATE_CART_ITEM_QUANTITY', payload: { productId, quantity: newQuantity } });
    }
  };

  const removeItem = (productId) => {
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
