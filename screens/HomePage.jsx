import * as React from "react";
import { Platform } from 'react-native';
import { Image } from "expo-image";
import { useTailwind } from 'tailwind-rn';
import { ScrollView , StyleSheet, Text, View,Pressable,TouchableOpacity,Alert,Dimensions } from "react-native";
import GroupComponent from "../components/GroupComponent";
import SearchBoxContainer from "../components/SearchBoxContainer";
import Footer from "@/components/Footer";
import { FontSize,Color,FontFamily,Padding } from "@/GlobalStyles";
import tw from 'tailwind-react-native-classnames';
import { useFonts } from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import ProductsService from "@/Services/ProductsService";



const { width, height } = Dimensions.get('window');

const HomePage1 = () => {

  return (
    <ScrollView>
      <View>
        <SearchBoxContainer/>
        <GroupComponent/>
      </View>
      <ProductsService/>
      <Footer/>
    </ScrollView>
  );
};


 
export default HomePage1;
