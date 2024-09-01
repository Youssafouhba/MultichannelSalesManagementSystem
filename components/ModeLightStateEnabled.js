import React, { useMemo } from "react";
import { Text, StyleSheet, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { Color, FontFamily, FontSize, Padding } from "../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const ModeLightStateEnabled = ({
  label = "Label",
  showText,
  modeLightStateEnabledPosition,
  modeLightStateEnabledTop,
  modeLightStateEnabledLeft,
  modeLightStateColor,
}) => {
  const modeLightStateEnabledStyle = useMemo(() => {
    return {
      ...getStyleValue("position", modeLightStateEnabledPosition),
      ...getStyleValue("top", modeLightStateEnabledTop),
      ...getStyleValue("left", modeLightStateEnabledLeft),
      ...getStyleValue("color", modeLightStateColor),
    };
  }, [
    modeLightStateEnabledPosition,
    modeLightStateEnabledTop,
    modeLightStateEnabledLeft,
    modeLightStateColor
  ]);

  return (
    <View style={[styles.modelightStateenabled, modeLightStateEnabledStyle]}>
      <Text style={[styles.textTypo,tw`text-base font-normal text-lg`]}>{label}</Text>
      {showText && <Text style={[styles.text, styles.textTypo]}>􀆏</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  textTypo: {
    textAlign: "left",
    lineHeight: 18,
  },
  text: {
    marginLeft: 3,
  },
  modelightStateenabled: {
    flexDirection: "row",
    paddingHorizontal: 0,
    paddingVertical: Padding.p_smi,
  },
});

export default ModeLightStateEnabled;
