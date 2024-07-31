import React, { createContext, useContext, useReducer } from 'react';
import { Product } from "@/constants/Classes";
import { jwtDecode } from 'jwt-decode';
const AppContext = createContext();

const baseurl = '192.168.100.45'

const initialState = {
  theme: 'light',
  API_BASE_URL: `http://${baseurl}:9000`,
  API_BASE_URL_ADMIN: `http://${baseurl}:9999`,
  API_BASE_URL_PRODUCT: `http://${baseurl}:8080`,
  products: [],
  offers: {},
  productId: 0,
  JWT_TOKEN: '',
  userId: '',
  wsUrl: 'ws://172.28.128.1:8080',
  cartItemsCount: 0,
  cartItems: {},
};

function appReducer(state, action) {
  switch (action.type) {
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
        cartItems: [],
        cartItemsCount: 0
      };
    }
    case 'SET_JWT_TOKEN':
      return { ...state, JWT_TOKEN: action.payload };
    case 'SET_wsUrl':
      return { ...state, wsUrl: action.payload };
    case 'SET_USER':
      return { ...state, userId: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  const updateItemQuantity = (productId: string, change: number) => {
    const currentQuantity = state.cartItems[productId]?.quantity || 0;
    const newQuantity = Math.max(0, currentQuantity + change);
    
    if (newQuantity === 0) {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: productId
      });
    } else {
      dispatch({
        type: 'UPDATE_CART_ITEM_QUANTITY',
        payload: { productId, quantity: newQuantity }
      });
    }
  };

  const removeItem = (productId: string) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: productId
    });
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