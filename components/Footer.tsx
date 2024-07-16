import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View,Pressable,Alert,TouchableOpacity, } from "react-native";
import VariantNeutralStateHover from "./VariantNeutralStateHover";
import ModeLightStateEnabled from "./ModeLightStateEnabled";
import { FontSize, FontFamily, Color } from "../GlobalStyles";
import tw from 'tailwind-react-native-classnames';


const icons = [
  {url: require("../assets/home.png")},
  {url: require("../assets/chat-bubble2.png")},
  {url: require("../assets/iconmonstrshoppingcart2-12.png")},
  {url: require("../assets/cardgf.gif")},
  {url: require("../assets/bell1.png")},
]
export default function Footer() {
  return (
    <View 
    style={[ {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: 40,
      paddingTop: 20,
      backgroundColor: Color.colorWhite,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTopColor: '#ccc',
    }]}>
    {
      icons.map((item,index)=>(
        <TouchableOpacity
        key={index}
        style={styles.touchableopacity}
        activeOpacity={0.2}
        onPress={() => {}}
        >
        <Image
            style={styles.iconLayout}
            contentFit="cover"
            source={item.url}
        />

        </TouchableOpacity> 
      ))
    }
     </View>
  )
}

const styles = StyleSheet.create({
    iconLayout: {
        height: "100%",
        width: "100%",
      },
    touchableopacity: {
      width: '5%',
      aspectRatio:1,
      alignItems:'center',
      justifyContent:'center'
    },
    Pressable: {
      width: '100%',
      alignItems: 'center'
    },
  });
  
