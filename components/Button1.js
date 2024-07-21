import * as React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import { FontSize, FontFamily, Color, StyleVariable } from "../GlobalStyles";

const Button1 = ({
  label = "Go to checkout . 45 £",
  hasIconStart = false,
  hasIconEnd = false,
}) => {
  return (
    <Pressable style={styles.button}>
      {hasIconStart && (
        <Image
          style={styles.iconLayout}
          contentFit="cover"
          source={require("../assets/star1.png")}
        />
      )}
      <Text style={styles.button1}>{label}</Text>
      {hasIconEnd && (
        <Image
          style={[styles.xIcon, styles.iconLayout]}
          contentFit="cover"
          source={require("../assets/x1.png")}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconLayout: {
    height: 16,
    width: 16,
    overflow: "hidden",
  },
  button1: {
    fontSize: FontSize.singleLineBodyBase_size,
    lineHeight: 16,
    fontFamily: FontFamily.singleLineBodyBase,
    color: Color.textBrandOnBrand,
    textAlign: "left",
    marginLeft: 8,
  },
  xIcon: {
    marginLeft: 8,
  },
  button: {
    position: "absolute",
    marginTop: 318,
    marginLeft: -85.5,
    top: "50%",
    left: "50%",
    borderRadius: StyleVariable.radius200,
    backgroundColor: Color.colorLimegreen_200,
    borderStyle: "solid",
    borderColor: Color.colorLimegreen_200,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: StyleVariable.space300,
    overflow: "hidden",
  },
});

export default Button1;
