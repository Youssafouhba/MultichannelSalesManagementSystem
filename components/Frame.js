import * as React from "react";
import { StyleProp, ViewStyle, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

const Frame = ({ style }) => {
  return (
    <View style={[styles.frame, style]}>
      <Image
        style={styles.bellIcon}
        contentFit="cover"
        source={require("../assets/bell.png")}
      />
      <View style={styles.tabBarItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  bellIcon: {
    top: 8,
    left: 9,
    width: 32,
    height: 28,
    position: "absolute",
    overflow: "hidden",
  },
  tabBarItem: {
    marginLeft: -24.75,
    top: 0,
    left: "50%",
    width: 49,
    height: 41,
    transform: [
      {
        rotate: "-0.4deg",
      },
    ],
    position: "absolute",
  },
  frame: {
    width: 50,
    height: 42,
    overflow: "hidden",
  },
});

export default Frame;
