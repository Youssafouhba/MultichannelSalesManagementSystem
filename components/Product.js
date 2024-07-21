import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, Pressable, View,Alert } from "react-native";
import { Color, FontSize, FontFamily } from "../GlobalStyles";

const Product = () => {
  const handleImagePress = (itemName) => {
    Alert.alert("Image Pressed!" , 'You clicked on ${itemName}!')
  };
  
  
  return (
    <View style={[styles.product1, styles.product1Position]}>
      <Pressable onPress={() => handleImagePress("BrittLite© COB DC 12/24V Single Colour 528L")} >
      <Image
        style={[styles.product1Child, styles.product1Position]}
        contentFit="cover"
        source={require("../assets/rectangle-96.png")}
      />
      <Text style={[styles.text, styles.textFlexBox]}>
        <Text style={styles.text1}>
          <Text style={styles.text2}>{`  `}</Text>
          <Text style={styles.text3}>36£</Text>
        </Text>
        <Text style={styles.text4}>{`  `}</Text>
      </Text>
      <Image
        style={[styles.plusIcon, styles.iconLayout]}
        contentFit="cover"
        source={require("../assets/plus.png")}
      />
      <Image
        style={[styles.minusIcon, styles.text5Position]}
        contentFit="cover"
        source={require("../assets/minus.png")}
      />
      <Text style={[styles.text5, styles.text5Position]}>4</Text>
      <Text
        style={[styles.brittliteCobDc, styles.textFlexBox]}
      >{`BrittLite© COB DC 12/24V Single Colour 528L`}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  product1Position: {
    height: 60,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  textFlexBox: {
    textAlign: "left",
    lineHeight: 11,
  },
  iconLayout: {
    overflow: "hidden",
    height: 12,
    width: 12,
  },
  text5Position: {
    marginTop: -12,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  product1Child: {
    marginTop: -30,
    marginLeft: -184,
    width: 61,
  },
  text2: {
    color: Color.colorDarkblue,
  },
  text3: {
    
  
    color: Color.colorBlack,
  },
  text1: {
    fontSize: FontSize.size_mini,
  },
  text4: {
    fontSize: FontSize.size_3xs,
    color: Color.colorDarkblue,
  },
  text: {
    marginTop: 8,
    marginLeft: -104,
    fontFamily: FontFamily.langarRegular,
    width: 28,
    height: 20,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  plusIcon: {
    marginTop: -11,
    marginLeft: 172,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  minusIcon: {
    marginLeft: 117,
    overflow: "hidden",
    height: 12,
    width: 12,
  },
  text5: {
    marginLeft: 146,
    fontFamily: FontFamily.kiwiMaruRegular,
    color: Color.colorBlack,
    fontSize: FontSize.size_mini,
    textAlign: "left",
    lineHeight: 11,
  },
  brittliteCobDc: {
    marginTop: -25,
    marginLeft: -98,
    fontFamily: FontFamily.kiteOneRegular,
    width: 127,
    height: 25,
    fontSize: FontSize.size_3xs,
    color: Color.colorBlack,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  product1: {
    marginTop: -274,
    marginLeft: -179.5,
    width: 368,
  },
});

export default Product;
