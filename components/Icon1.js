import * as React from "react";
import { StyleProp, ViewStyle, StyleSheet } from "react-native";
import { Image } from "expo-image";

const Icon1 = ({ style }) => {
  return (
    <Image
      style={[styles.icon, style]}
      contentFit="cover"
      source={require("../assets/00.png")}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 28,
    height: 25,
    overflow: "hidden",
  },
});

export default Icon1;
