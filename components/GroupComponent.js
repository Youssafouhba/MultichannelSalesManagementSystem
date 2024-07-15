import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View,Pressable,Alert,label } from "react-native";
import VariantNeutralStateHover from "./VariantNeutralStateHover";
import ModeLightStateEnabled from "./ModeLightStateEnabled";
import { FontSize, FontFamily, Color } from "../GlobalStyles";
import tw from 'tailwind-react-native-classnames';

const GroupComponent = () => {
  const handleImagePress = (itemName) => {
    Alert.alert("Image Pressed!", `You clicked on ${itemName}!`);
  };

  return (
  
    <View style={tw`w-full h-40 top-3`}>
      <View style={tw`flex-row justify-between items-center text-center pl-2 pr-2`}>
        <View>
          <Pressable onPress={() => handleImagePress("suggestions")}>
          <Text
            style={[styles.suggestions,styles.suggestionsPosition]}
          >{`suggestions `}</Text>
          </Pressable>
        </View>
        <View>
          <Pressable onPress={() => handleImagePress(label)}>
          <ModeLightStateEnabled
            label="View all"
            showText={false}
          />
          </Pressable>
        </View>
      </View>

      <View style={tw`top-6 flex-row justify-between`}>
        <View>
        <Pressable 
        onPress={() => handleImagePress(label)}
        style={tw`w-28`}>
        <VariantNeutralStateHover
          
          label="New designs"
          
          hasIconStart={false}
          hasIconEnd={false}
         
        />
        </Pressable>
        </View>
        <View>
        <Pressable 
        onPress={() => handleImagePress(label)}
        style={tw`w-28`}>
        <VariantNeutralStateHover
          
          label="Best seller"
          
          hasIconStart={false}
          hasIconEnd={false}

        />
        </Pressable>
        </View>
        <View>
        <Pressable 
        onPress={() => handleImagePress(label)}
        style={tw`w-28`}>
        <VariantNeutralStateHover
          
          label="Ceilling calc..."
        
          hasIconStart={false}
          hasIconEnd={false}
       
          />
        </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  suggestionsPosition: {
    left: 0,
    top: 0,
  },
  suggestions: {
    fontSize: FontSize.size_xl,
    lineHeight: 24,
    fontFamily: FontFamily.kavoonRegular,
    color: Color.colorBlack,
    textAlign: "left",
    width: 115,
    height: 24,
  },
  buttonParent: {
    height: 97,
  },
});

export default GroupComponent;
