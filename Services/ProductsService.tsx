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
import axios from "axios";


interface Product {
    name: string;
    description: string;
    price: number;
    stock: number;
    size: number;
    imageUrls: { Url: string }[];
    category: String;
  }
  
const API_BASE_URL = 'http://192.168.42.159:8080'; 
const products = [
    {
      imageUrl: require("../assets/rectangle-96.png"),
      price: 9,
      title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
      new: `NEW`,
      stock: 100
    },
    {
      imageUrl: require("../assets/rectangle-97.png"),
      price: 9,
      title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
      new: `NEW`,
      stock: 100
    },
    {
      imageUrl: require("../assets/rectangle-98.png"),
      price: 9,
      title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
      new: `NEW`,
      stock: 100
    },
    {
      imageUrl: require("../assets/rectangle-99.png"),
      price: 9,
      title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
      new: `NEW`,
      stock: 100
    },
    {
      imageUrl: require("../assets/rectangle-98.png"),
      price: 9,
      title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
      new: `NEW`,
      stock: 100
    },
    {
      imageUrl: require("../assets/rectangle-99.png"),
      price: 9,
      title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
      new: `NEW`,
      stock: 100
    },
    {
      imageUrl: require("../assets/rectangle-95.png"),
      price: 7,
      title: `BORDERLESS 24W CEILING LAMP Cool White\n`,
      new: ``,
      stock: 90
    },
  ];

export default function ProductsService() {
    const [loaded, error] = useFonts({
        'KleeOne-Regular': require('../assets/fonts/KleeOne-Regular.ttf'),
        'kavoonRegular': require('../assets/fonts/Kavoon-Regular.ttf'),
        'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
        'VampiroOne-Regular': require('../assets/fonts/VampiroOne-Regular.ttf')  
    });
    
 
  return (
    <View style={tw`flex-row flex-wrap justify-around mt-1 mx-2 my-2`}>
    { products.map((item,index)=>
    (
     <View key={index} style={tw`mt-3`}>
       <Pressable onPress={() => handleImagePress(item.title)} style={{width: 160,height: 230}}>
         <Image
           style={{height: 160,width: 160,borderRadius: 12}}
           source={item.imageUrl}
         />
         <View style={tw`top-1`}>
           <View style={tw`flex-row justify-between`}>
               <View style={tw`flex-row ml-2`}>
               <Text style={[tw`text-lg font-medium`, { fontFamily: 'kavoonRegular' }]}>{item.price}</Text>
                 <Text style={tw`left-1`}>£</Text>
               </View>
               <Text style={[tw`mr-3`,{fontFamily: 'kavoonRegular',fontSize: 11}]}>{item.stock} in stock</Text>     
           </View>
           <Text style={[styles.brittliteDc24v,{fontFamily: 'KleeOne-Regular'}]}>{item.title}</Text>
         </View>
       </Pressable>
       {
         item.new? <Image
           style={{height: 80,width: 80,borderRadius: 12,position: "absolute",top: -9,left: -9}}
           source={require("../assets/new.png")}
       />: ''
       }
     </View>
)
)}
</View>
  )
}
const styles = StyleSheet.create({
    brittliteDc24v: {
      color: Color.colorBlack,
      fontFamily: FontFamily.kavoonRegular,
      fontSize: 10,
      fontWeight: "600"
    },
    
    Pressable: {
      width: '100%',
      alignItems: 'center'
    },
  });
