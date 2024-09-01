import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CartItem = { quantity: number };
export type CartItems = { [productId: string]: CartItem };

interface CartState {
  items: CartItems;
  itemsCount: number;
  isEmpty: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_CART_ITEM_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAN_CART' }
  | { type: 'RESTORE_CART'; payload: CartState }
  | {type: 'Set_isEmpty'; payload: boolean};

const CartContext = createContext<{
  statecart: CartState;
  addToCart: (id: string, quantity: number) => void;
  updateItemQuantity: (productId: string, change: number) => void;
  removeItem: (productId: string) => void;
  cleanCart: () => void;
} | null>(null);

const cartReducer = (statecart: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { id, quantity } = action.payload;
      const newQuantity = (statecart.items[id]?.quantity || 0) + quantity;
      return {
        isEmpty: true,
        items: { ...statecart.items, [id]: { quantity: newQuantity } },
        itemsCount: statecart.itemsCount + quantity
      };
    }
    case 'UPDATE_CART_ITEM_QUANTITY': {
      const { productId, quantity } = action.payload;
      const oldQuantity = statecart.items[productId]?.quantity || 0;
      const quantityDiff = quantity - oldQuantity;
      return {
        isEmpty: true,
        items: { ...statecart.items, [productId]: { quantity } },
        itemsCount: statecart.itemsCount + quantityDiff
      };
    }
    case 'REMOVE_FROM_CART': {
      const { [action.payload]: removedItem, ...restItems } = statecart.items;
      return {
        isEmpty: true,
        items: restItems,
        itemsCount: statecart.itemsCount - (removedItem?.quantity || 0)
      };
    }
    case 'CLEAN_CART':
      return {     isEmpty: true,items: {}, itemsCount: 0 };
    case 'RESTORE_CART':
      console.log(action.payload);
      return {
        isEmpty: false,
        items: action.payload.items,
        itemsCount: action.payload.itemsCount
      };
    default:
      return statecart;
  }
};


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statecart, dispatch] = useReducer(cartReducer, {isEmpty: false,items: {}, itemsCount: 0 });

  useEffect(() => {
    const initializeCartState = async () => {
      const storedItems = await AsyncStorage.getItem('cartItems');
      const storedCount = await AsyncStorage.getItem('cartItemsCount');
      //console.log(storedItems)
      const  initialState = {    isEmpty: statecart.isEmpty,items: storedItems ? JSON.parse(storedItems) : {},itemsCount: storedCount ? parseInt(storedCount, 10) : 0}
      dispatch({ type: 'RESTORE_CART', payload: initialState });
    };
    initializeCartState();

  }, []);

  const addToCart = useCallback((id: string, quantity: number) => {
    console.log("add carte items......")
    dispatch({ type: 'ADD_TO_CART', payload: { id, quantity } });
  }, []);
  const updateItemQuantity = useCallback((productId: string, change: number) => {
    console.log("update carte items......")
    const currentQuantity = statecart.items[productId]?.quantity || 0;
    const newQuantity = Math.max(0, currentQuantity + change);

    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } else {
      dispatch({ type: 'UPDATE_CART_ITEM_QUANTITY', payload: { productId, quantity: newQuantity } });
    }
  }, [statecart.items]);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  }, []);

  const cleanCart = useCallback(() => {
    dispatch({ type: 'CLEAN_CART' });
  }, []);

  useEffect(() => {
    console.log(statecart.isEmpty)
    const saveSession = async () => {
      try {
        console.log("saving....")
        await AsyncStorage.setItem('cartItems', JSON.stringify(statecart.items));
        await AsyncStorage.setItem('cartItemsCount', statecart.itemsCount.toString());
      } catch (error) {
        console.error('Error saving session:', error);
      }
    };
    if(statecart.isEmpty==true)
      saveSession();
  }, [addToCart,updateItemQuantity,removeItem,cleanCart]);
  
  const value = useMemo(() => ({
    statecart,
    addToCart,
    updateItemQuantity,
    removeItem,
    cleanCart
  }), [statecart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};