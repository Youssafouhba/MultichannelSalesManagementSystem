import React, { useEffect } from 'react';
import { Image } from "expo-image";

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Text, View,Pressable,Alert,TouchableOpacity,Dimensions} from "react-native";
import { FontSize, FontFamily, Color, styles } from "../GlobalStyles";
import tw from 'tailwind-react-native-classnames';

import { Tabs } from 'expo-router';


interface FooterProps {
  totalItems: number;
}


export const Footer: React.FC<FooterProps> = ({ totalItems}) => {

  const [pressed,setPressed] = React.useState<boolean>(false)
  const [actualIcon,setActuelIcon] = React.useState<string>('home')
  const [numberofprd,setNumberOfprd] = React.useState<number>(totalItems)
  const [numberofnot,setNumberOfnot] = React.useState<number>(120)
  const icons = [
    {url: require("../assets/home.png"),name: 'home',value: 0,setvalue: 0},
    {url: require("../assets/images/icons8-message-50 (2).png"),name: 'message',value: 0,setvalue: 0},
    {url: require("../assets/images/icons8-stock-50.png"),name: 'card',value: totalItems,setvalue: setNumberOfprd},
    {url: require("../assets/images/icons8-compte-48.png"),name: 'account',value: 0,setvalue: 0},
    {url: require("../assets/images/icons8-notification-50.png"),name: 'notification',value: numberofnot,setvalue: setNumberOfnot},
  ]

  useEffect(()=> {
    console.log(totalItems)
  })
  return (
    <View 
    style={[styles.footer]}>
    {
      icons.map((item,index)=>(
        
        <TouchableOpacity
        key={index}
        style={styles.touchableopacity}
        activeOpacity={0.2}
        onPress={() => {
          setActuelIcon(item.name);
          navigation.navigate('Cart')
        }}
        >
        <Image
            style={styles.iconLayout}
            contentFit="cover"
            tintColor={actualIcon!=item.name?"rgb(50, 50, 50)":"orangered"}
            priority={'high'}
            focusable={true}
            source={item.url}
        />

        {
          (item.name==='notification' || item.name==='card')? (
            <View style={[styles.notification,item.value >= 10 && styles.over,item.value >= 99 && styles.over100]}>
              <Text style={[styles.notnumber]}>
              { item.value >= 100 ? (
              <Text>99+</Text>
              ): item.value}
              </Text>
            </View>
          ):``
        }

        </TouchableOpacity> 
      ))
    }
     </View>
  )
}  
