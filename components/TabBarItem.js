import * as React from "react";
import { StyleProp, ViewStyle, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Padding } from "../GlobalStyles";

const TabBarItem = ({ style }) => {
  return <View style={[styles.tabBarItem, style]} />;
};

const styles = StyleSheet.create({
  tabBarItem: {
    width: 56,
    height: 45,
    flexDirection: "row",
    paddingHorizontal: Padding.p_7xl,
    paddingTop: Padding.p_xs,
    paddingBottom: Padding.p_5xs,
  },
});

export default TabBarItem;
