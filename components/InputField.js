import React, { useMemo } from "react";
import { TextInput, StyleSheet } from "react-native";
import { FontFamily, FontSize } from "../GlobalStyles";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};
const InputField = ({
  inputFieldPlaceholder,
  hasLabel = false,
  hasError = false,
  hasDescription = false,
  propTop,
}) => {
  const inputFieldStyle = useMemo(() => {
    return {
      ...getStyleValue("top", propTop),
    };
  }, [propTop]);

  return (
    <TextInput
      style={[styles.inputField, inputFieldStyle]}
      placeholder={inputFieldPlaceholder}
      placeholderTextColor="#b3b3b3"
    />
  );
};

const styles = StyleSheet.create({
  inputField: {
    top: 272,
    left: 30,
    width: 312,
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
  },
});

export default InputField;
