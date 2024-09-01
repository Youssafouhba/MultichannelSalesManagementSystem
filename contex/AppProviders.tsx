// AppProviders.js
import React from 'react';
import { UserProvider } from '@/contex/UserContext'
import { CartProvider } from '@/contex/CartContex'
import { MessageProvider } from './MessageReducer';


export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CartProvider>
        <MessageProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </MessageProvider>
    </CartProvider>
  );
};