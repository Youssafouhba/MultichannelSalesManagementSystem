import React, { useEffect } from 'react';
import { AppProvider } from '@/components/AppContext';
import { AppDataProvider } from '@/components/AppDataProvider';
import { TextEncoder } from 'text-encoding';
import { View } from 'react-native';
import ProductsService from "@/screens/ProductsService";
import { AppProviders } from '@/contex/AppProviders';
import { useUser } from '@/contex/UserContext';
import { useMessage } from '@/contex/MessageReducer';
global.TextEncoder = TextEncoder;
export default function Index() {
  const {state} = useUser();
  const {initializeWebSocket} = useMessage();
  useEffect(() => {
    if (state.isLoggedIn) {
      initializeWebSocket(state.JWT_TOKEN,state.userInfos.user.email)
    }
  }, [state.isLoggedIn]);
  return (
    <AppProviders>
      <AppDataProvider>
        <AppProvider>
          <View style={{ flex: 1 }}>
            <ProductsService/>
          </View>
        </AppProvider>
      </AppDataProvider>
    </AppProviders>
  );
}