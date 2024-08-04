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
import tw from 'tailwind-react-native-classnames';
import { View } from 'react-native';
import QuatreCarres from '@/components/QuatreCarres';
import { AppDataProvider } from '@/components/AppDataProvider';
import { TextEncoder } from 'text-encoding';

global.TextEncoder = TextEncoder;
export default function Index() {
  return (
    <AppDataProvider>
      <AppProvider>
        <HomePage/>
      </AppProvider>
    </AppDataProvider>

  );
}