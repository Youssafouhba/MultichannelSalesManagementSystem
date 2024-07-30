import React, { useEffect, useState } from 'react';

import { AppProvider } from '@/components/AppContext';
import LogoPage from '../LogoPage';
import HomePage from '@/screens/HomePage';
import MyOrders from '../Orders';
import ORDERDETAILS from '../OrderDetails';
import Layout from '@/components/LoadingLayout';
import LoginPage from '../LoginPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { sessionManager } from '@/components/sessionManager';
import AddProductScreen from '@/components/AddProductScreen';
export default function Index() {
  return (
    <AppProvider>
      <HomePage/>
    </AppProvider>
  );
}