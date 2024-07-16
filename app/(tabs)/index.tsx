import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import LoginScreen from '@/screens/LoginScreen';
import AddProductScreen from '@/components/AddProductScreen';

export default function HomeScreen() {
  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar style="auto" />
      <LoginScreen/>
    </View>
  );
}