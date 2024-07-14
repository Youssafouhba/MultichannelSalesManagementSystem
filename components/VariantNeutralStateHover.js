import React, { useMemo } from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View, ImageSourcePropType } from "react-native";
import { FontSize, FontFamily, Color, StyleVariable } from "../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const VariantNeutralStateHover = ({
  star,
  label = "Button",
  x,
  hasIconStart = false,
  hasIconEnd = false,
  variantNeutralStateHoverPosition,
  variantNeutralStateHoverBackgroundColor,
  variantNeutralStateHoverBorderColor,
  variantNeutralStateHoverTop,
  variantNeutralStateHoverLeft,
  variantNeutralStateHoverWidth,
}) => {
  const variantNeutralStateHoverStyle = useMemo(() => {
    return {
      ...getStyleValue("position", variantNeutralStateHoverPosition),
      ...getStyleValue(
        "backgroundColor",
        variantNeutralStateHoverBackgroundColor
      ),
      ...getStyleValue("borderColor", variantNeutralStateHoverBorderColor),
      ...getStyleValue("top", variantNeutralStateHoverTop),
      ...getStyleValue("left", variantNeutralStateHoverLeft),
      ...getStyleValue("width", variantNeutralStateHoverWidth),
    };
  }, [
    variantNeutralStateHoverPosition,
    variantNeutralStateHoverBackgroundColor,
    variantNeutralStateHoverBorderColor,
    variantNeutralStateHoverTop,
    variantNeutralStateHoverLeft,
    variantNeutralStateHoverWidth,
  ]);

  return (
    <View
      style={[styles.variantneutralStatehover, variantNeutralStateHoverStyle]}
    >
      {hasIconStart && (
        <Image style={styles.iconLayout} contentFit="cover" source={star} />
      )}
      <Text style={styles.button}>{label}</Text>
      {hasIconEnd && (
        <Image
          style={[styles.xIcon, styles.iconLayout]}
          contentFit="cover"
          source={x}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconLayout: {
    height: 16,
    width: 16,
    overflow: "hidden",
  },
  button: {
    fontSize: FontSize.singleLineBodyBase_size,
    lineHeight: 16,
    fontFamily: FontFamily.singleLineBodyBase,
    color: Color.textDefaultDefault,
    textAlign: "left",
    marginLeft: 8,
  },
  xIcon: {
    marginLeft: 8,
  },
  variantneutralStatehover: {
    borderRadius: StyleVariable.radius200,
    backgroundColor: Color.backgroundNeutralTertiaryHover,
    borderStyle: "solid",
    borderColor: Color.borderNeutralSecondary,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: StyleVariable.space300,
    overflow: "hidden",
  },
});

export default VariantNeutralStateHover;
