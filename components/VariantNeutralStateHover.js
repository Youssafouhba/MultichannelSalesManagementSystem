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
  variantNeutralStateHoverBorderColor,
  variantNeutralStateHoverBorderRaduis,
  variantNeutralStateHoverTop,
  variantNeutralStateHoverLeft,
  variantNeutralStateHoverWidth,
  variantNeutralStateHoverHieght,
}) => { /**  color: Color.colorize_gray, */
  const variantNeutralStateHoverStyle = useMemo(() => {
    return {
      ...getStyleValue("position", variantNeutralStateHoverPosition),    
      ...getStyleValue("borderColor", variantNeutralStateHoverBorderColor),
      ...getStyleValue("borderRadius", variantNeutralStateHoverBorderRaduis),
      ...getStyleValue("top", variantNeutralStateHoverTop),
      ...getStyleValue("left", variantNeutralStateHoverLeft),
      ...getStyleValue("width", variantNeutralStateHoverWidth),
      ...getStyleValue("height", variantNeutralStateHoverHieght),
    };
  }, [
    variantNeutralStateHoverPosition,
    variantNeutralStateHoverBorderColor,
    variantNeutralStateHoverBorderRaduis,
    variantNeutralStateHoverTop,
    variantNeutralStateHoverLeft,
    variantNeutralStateHoverWidth,
    variantNeutralStateHoverHieght
  ]);

  return (
    <View
      style={[styles.variantneutralStatehover, variantNeutralStateHoverStyle]}
    >
      {hasIconStart && (
        <Image style={styles.iconLayout} contentFit="cover" source={star} />
      )}
      <Text 
      style={{ 
        fontSize: FontSize.singleLineBodyBase_size,
        lineHeight: 16,
        textAlign: "left",
        marginLeft: 2,

        }}>{label}</Text>
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
    fontFamily: 'kavoonRegular',
    textAlign: "left",
    marginLeft: 2,
  },
  xIcon: {
    marginLeft: 8,
  },
  variantneutralStatehover: {
    borderRadius: StyleVariable.radius200,
    backgroundColor: Color.backgroundNeutralTertiaryHover,
    borderStyle: "solid",
    borderColor: 'blue',
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: StyleVariable.space300,
    paddingLeft: 1,
    paddingRight: 1,
    overflow: "hidden",
  },
});

export default VariantNeutralStateHover;
