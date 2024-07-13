import * as React from "react";
import { StyleProp, ViewStyle, StyleSheet } from "react-native";
import { Image } from "expo-image";

const IconmonstrShoppingCart2 = ({ style }) => {
  return (
    <Image
      style={[styles.iconmonstrShoppingCart21, style]}
      contentFit="cover"
      source={require("../assets/iconmonstrshoppingcart2-1.png")}
    />
  );
};

const styles = StyleSheet.create({
  iconmonstrShoppingCart21: {
    width: 28,
    height: 22,
    overflow: "hidden",
  },
});

export default IconmonstrShoppingCart2;
