import * as React from "react";
import { Text, StyleSheet, Pressable, View ,Alert} from "react-native";
import { Image } from "expo-image";
import { FontFamily, Color, FontSize } from "../GlobalStyles";

const Product1 = () => {
  const handleImagePress = (itemName) => {
    Alert.alert("Image Pressed!" , 'You clicked on ${itemName}!')
  };
  return (
    <View style={[styles.product2, styles.product2Position]}>
      <Pressable onPress={() => handleImagePress("18+6W Blue Surface Led Panel Cool White")} >
      <Text
        style={[styles.wBlueSurface, styles.textFlexBox]}
      >{`18+6W Blue Surface Led Panel Cool White`}</Text>
      <Image
        style={[styles.product2Child, styles.product2Position]}
        contentFit="cover"
        source={require("../assets/rectangle-10.png")}
      />
      <Text style={[styles.text, styles.textFlexBox]}>
        <Text style={styles.text1}>
          <Text style={styles.text2}>{` `}</Text>
          <Text style={styles.text3}>9£</Text>
        </Text>
        <Text style={styles.text4}>{`  `}</Text>
      </Text>
      <Text style={[styles.text5, styles.iconPosition]}>1</Text>
      <Image
        style={[styles.plusIcon, styles.iconPosition]}
        contentFit="cover"
        source={require("../assets/plus.png")}
      />
      <Image
        style={[styles.deleteIcon, styles.iconPosition]}
        contentFit="cover"
        source={require("../assets/delete.png")}
      />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  product2Position: {
    height: 60,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  textFlexBox: {
    textAlign: "left",
    lineHeight: 11,
  },
  iconPosition: {
    marginTop: -11,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  wBlueSurface: {
    marginTop: -25,
    marginLeft: -98,
    fontFamily: FontFamily.kiteOneRegular,
    width: 127,
    height: 25,
    color: Color.colorBlack,
    fontSize: FontSize.size_3xs,
    left: "50%",
    top: "50%",
    position: "absolute",
    lineHeight: 11,
  },
  product2Child: {
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
    color: Color.colorDarkblue,
    fontSize: FontSize.size_3xs,
  },
  text: {
    marginTop: 0,
    marginLeft: -104,
    fontFamily: FontFamily.langarRegular,
    width: 28,
    height: 20,
    left: "50%",
    top: "50%",
    position: "absolute",
    lineHeight: 11,
  },
  text5: {
    marginLeft: 146,
    fontFamily: FontFamily.kiwiMaruRegular,
    fontSize: FontSize.size_mini,
    textAlign: "left",
    lineHeight: 11,
    color: Color.colorBlack,
  },
  plusIcon: {
    marginLeft: 172,
    width: 12,
    height: 12,
    overflow: "hidden",
  },
  deleteIcon: {
    marginLeft: 111,
    width: 13,
    height: 14,
  },
  product2: {
    marginTop: -162,
    marginLeft: -179.5,
    width: 368,
  },
});

export default Product1;
