import * as React from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, TouchableOpacity, Alert, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useTailwind } from 'tailwind-rn';
import GroupComponent from "../components/GroupComponent";
import SearchBoxContainer from "../components/SearchBoxContainer";
import {Footer} from "@/components/Footer";
import { FontSize, Color, FontFamily, Padding } from "@/GlobalStyles";
import tw from 'tailwind-react-native-classnames';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import ProductsService from "@/screens/ProductsService";
import Tab from "@/Services/tab";
const { width, height } = Dimensions.get('window');
import {screenHeight,screenWidth} from '@/constants/GlobalsVeriables'
import {footer_h} from '@/GlobalStyles'
import TabLayout from "@/app/(tabs)/_layout";

const HomePage = () => {
  
  return (
    <View>
      <SearchBoxContainer/>
      <ProductsService/>
    </View>
  );
};



export default HomePage;