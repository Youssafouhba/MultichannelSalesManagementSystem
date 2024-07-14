import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View,Pressable,Alert,label } from "react-native";
import VariantNeutralStateHover from "./VariantNeutralStateHover";
import ModeLightStateEnabled from "./ModeLightStateEnabled";
import { FontSize, FontFamily, Color } from "../GlobalStyles";

const GroupComponent = () => {
  const handleImagePress = (itemName) => {
    Alert.alert("Image Pressed!", `You clicked on ${itemName}!`);
  };
  return (
  
    <View style={[styles.buttonParent, styles.suggestionsPosition,styles.responsive]}>
      <View>
      <Pressable onPress={() => handleImagePress(label)}>
      <VariantNeutralStateHover
        
        label="New designs"
        
        hasIconStart={false}
        hasIconEnd={false}
        variantNeutralStateHoverPosition="absolute"
        variantNeutralStateHoverBackgroundColor="#cdcdcd"
        variantNeutralStateHoverBorderColor="#767676"
        variantNeutralStateHoverTop={57}
        variantNeutralStateHoverLeft={110}
        variantNeutralStateHoverWidth={119}
      />
      </Pressable>
      </View>
      <View>
      <Pressable onPress={() => handleImagePress(label)}>
      <VariantNeutralStateHover
        
        label="Best seller"
        
        hasIconStart={false}
        hasIconEnd={false}
        variantNeutralStateHoverPosition="absolute"
        variantNeutralStateHoverBackgroundColor="#000000"
        variantNeutralStateHoverBorderColor="#000000"
        variantNeutralStateHoverTop={57}
        variantNeutralStateHoverLeft={0}
        variantNeutralStateHoverWidth={95}
      />
      </Pressable>
      </View>
      <View>
      <Pressable onPress={() => handleImagePress(label)}>
      <VariantNeutralStateHover
        
        label="Ceilling calculator"
       
        hasIconStart={false}
        hasIconEnd={false}
        variantNeutralStateHoverPosition="absolute"
        variantNeutralStateHoverBackgroundColor="#cdcdcd"
        variantNeutralStateHoverBorderColor="#767676"
        variantNeutralStateHoverTop={57}
        variantNeutralStateHoverLeft={249}
        variantNeutralStateHoverWidth={150}
      />
      </Pressable>
      </View>
      <View>
      <Pressable onPress={() => handleImagePress(label)}>
      <ModeLightStateEnabled
        label="View all"
        showText={false}
        modeLightStateEnabledPosition="absolute"
        modeLightStateEnabledTop={0}
        modeLightStateEnabledLeft={313}
      />
      </Pressable>
      </View>
      <View>
      <Pressable onPress={() => handleImagePress("suggestions")}>
      <Text
        style={[styles.suggestions, styles.suggestionsPosition]}
      >{`suggestions `}</Text>
      </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  suggestionsPosition: {
    left: 0,
    top: 0,
    position: "absolute",
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
    width: 399,
    height: 97,
  },
});

export default GroupComponent;
