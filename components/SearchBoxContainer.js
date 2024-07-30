import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View,Dimensions, TextInput } from "react-native";
import { FontSize, FontFamily, Color, Border, Padding } from "../GlobalStyles";
import tw from 'tailwind-react-native-classnames';
import { headerstyles as styles } from "../GlobalStyles";
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/components/AppContext';
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const SearchBoxContainer = () => {
  const { state,dispatch } = useAppContext();
  var isLoggedIn = state.JWT_TOKEN !=='';
  const [logen,setLoged] = React.useState(false)

  return (
    <View style={[{marginTop: '5%',height: 80,width: '100%',justifyContent: "center",alignItems: "center",overflow: "hidden",backgroundColor: Color.mainbackgroundcolor,}]}>
      <View style={[styles.searchInput]}>
        <TextInput
        placeholder="Search..."
        style={styles.label} numberOfLines={1}>
        </TextInput>
        <Ionicons style={[{marginLeft: 12,overflow: "hidden",}]} name='search' size={25} color="gray" />
      </View>
      {logen?(
         <View style={[{right: '30%',top: 5}]}>
         <Text style={[tw`text-base text-gray-900 font-normal text-lg`]}>Hi Youssef</Text>
       </View>
      ):(``)}
    </View>
  );
};


export default SearchBoxContainer;
