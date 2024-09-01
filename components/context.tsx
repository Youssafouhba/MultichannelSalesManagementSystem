
import { Message, Product } from '@/constants/Classes';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import WebSocketService from './WebsocketService';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from './config';

const AppContext = createContext(null);

const initialState = {
  theme: 'light',
  API_BASE_URL: config.API_BASE_URL,
  API_BASE_URL_ADMIN: `http://209.38.168.154:9999`,
  API_BASE_URL_PRODUCT: `http://209.38.168.154:8080`,
  products: [],
  filtredproducts: [],
  Notifications: [],
  Messages: [],
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
  wsUrl: `http://209.38.168.154:9001`,
  cartItemsCount: 0,
  notificationsCount: 0,
  messagesCount: 0,
  cartItems: {},
  wsService: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'Set_userInfos':
      if (action.payload.myOrders) {
        action.payload.myOrders = action.payload.myOrders.sort((a, b) =>
          new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );

      }
      // Mise à jour du panier avec les éléments de shoppingList
      let updatedCartItems = { ...state.cartItems };
      let updatedCartItemsCount = state.cartItemsCount;

      if (action.payload.shoppingList) {
        action.payload.shoppingList.forEach((item) => {
          const productId = item.product.id;
          if (updatedCartItems[productId]) {
            // Si l'élément existe déjà, on ajoute la quantité
            updatedCartItems[productId].quantity += item.quantity;
          } else {
            // Sinon, on crée une nouvelle entrée
            updatedCartItems[productId] = { quantity: item.quantity };
          }
          updatedCartItemsCount += item.quantity;
        });
      }
  
        return {
          ...state,
          notificationsCount: action.payload.myNotifications.filter((item) => !item.isRead).length,
          userInfos: action.payload,
          JWT_TOKEN: action.payload.loginResponse.token,
          isLoggedIn: true,
          cartItems: updatedCartItems,
          cartItemsCount: updatedCartItemsCount
        };

    case 'Update_myOrders':
      if (action.payload) {
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
    case 'Update_Messages': {
      const currentMessages = state.Messages || [];
      return {
        ...state,
        Messages: [...currentMessages,action.payload],
        messagesCount: state.messagesCount + 1
      };
    }
    case 'Update_Messages_Batch': {
      const currentMessages = state.Messages || [];
      return {
        ...state,
        Messages: [...currentMessages,...action.payload],
      };
    }
    case 'SET_WS_SERVICE':
      return { ...state, wsService: action.payload };
    case 'SEND_MESSAGE': {
      const currentMessages = state.Messages || [];
      return {
        ...state,
        Messages: [...currentMessages,action.payload],
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
    case 'RESTORE_SESSION':
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        JWT_TOKEN: action.payload.token,
        userInfos: action.payload.userInfos,
        cartItems: action.payload.cartItems,
        cartItemsCount: action.payload.cartItemsCount,
        notificationsCount: action.payload.notificationsCount
      };
    case 'LOGOUT':
            return {
              ...state,
              isLoggedIn: false,
              JWT_TOKEN: '',
              userInfos: {},
              cartItems: {},
              cartItemsCount: 0,
              Notifications: [],
              notificationsCount: 0,
              Messages: [],
              messagesCount: 0
            };
    default:
      return state;
  }
}


export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const wsService = WebSocketService.getInstance(config.API_BASE_URL);

  useEffect(() => {
    const restoreItem = async () => {
      try {
        // Restaurer les données sécurisées (token)
        const secureData = await SecureStore.getItemAsync('secureUserSession');
        let token;
        if (secureData) {
          ({ token } = JSON.parse(secureData));
        }
  
        // Restaurer les autres données depuis AsyncStorage
        const isLoggedIn = JSON.parse(await AsyncStorage.getItem('isLoggedIn') || 'false');
        const cartItems = JSON.parse(await AsyncStorage.getItem('cartItems') || '{}');
        const userInfos = JSON.parse(await AsyncStorage.getItem('userInfos') || '{}');
        const cartItemsCount = parseInt(await AsyncStorage.getItem('cartItemsCount') || '0', 10);
        const notificationsCount = parseInt(await AsyncStorage.getItem('notificationsCount') || '0', 10);
  
        // Dispatcher toutes les données restaurées
        dispatch({
          type: 'RESTORE_SESSION',
          payload: { token, isLoggedIn, userInfos, cartItems, cartItemsCount, notificationsCount }
        });
      } catch (error) {
        console.error('Error restoring session:', error);
      }
    };
    restoreItem();
  }, []);

useEffect(() => {
  const saveSession = async () => {
    try {
      if (state.isLoggedIn && state.JWT_TOKEN && state.userInfos) {
        // Sauvegarder les données sécurisées
        await SecureStore.setItemAsync('secureUserSession', JSON.stringify({
          token: state.JWT_TOKEN,
        }));

        // Sauvegarder les autres données dans AsyncStorage
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(state.isLoggedIn));
        await AsyncStorage.setItem('userInfos', JSON.stringify(state.userInfos));
        await AsyncStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        await AsyncStorage.setItem('cartItemsCount', state.cartItemsCount.toString());
        await AsyncStorage.setItem('notificationsCount', state.notificationsCount.toString());
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };
  saveSession();
}, [state.isLoggedIn, state.JWT_TOKEN, state.userInfos, state.cartItems, state.cartItemsCount, state.notificationsCount]);

  useEffect(() => {
    const token = state.JWT_TOKEN;
    if (token && !wsService.isConnected()) {
      wsService.setCallback('onNotificationReceived', (notification) => {
        //console.log('Update_notifications : '+notification)
        dispatch({ type: 'Update_Notifications', payload: notification });
      });
      wsService.setCallback('onOrderUpdate',(orderUpdate) => {
        //console.log('Update_myOrders : '+orderUpdate.object.id)
        dispatch({ type: 'Update_myOrders', payload: orderUpdate });
      });
      wsService.setCallback('onMessageReceived', (message) => {
        console.log('received message : '+message.content)
        if(message.id){
          dispatch({ type: 'Update_Messages', payload: message });
        }
      });
      wsService.setCallback('onMessageSent',sendMessage);
      wsService.connect(token);
      dispatch({ type: 'SET_WS_SERVICE', payload: wsService });
      return () => {
      };
    }
  },[state.JWT_TOKEN]);

  const sendMessage = (message: any) => {
      wsService.sendMessage("/app/client/message",message);
  };


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

  const logout = async () => {
    if (wsService.isConnected()) {
      wsService.onDisconnect();
    }
    try {
      await AsyncStorage.clear();
      await SecureStore.deleteItemAsync('secureUserSession');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  return (
    <AppContext.Provider value={{ state, dispatch, updateItemQuantity, removeItem,sendMessage,logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
