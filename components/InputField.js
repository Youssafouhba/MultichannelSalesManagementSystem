import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { FontFamily, FontSize, Color, StyleVariable } from "../GlobalStyles";

const InputField = ({
  inputFieldPlaceholder,
  hasLabel = false,
  hasError = false,
  hasDescription = false,
  onChangeText,
  style,
  color = Color.textDefaultSecondary,
  borderColor,
  required = true,
}) => {
  return (
    <TextInput
      style={[
        styles.inputField,
        hasError && styles.inputFieldError,
        !required && styles.inputFieldOptional,
        { color },
        {borderColor},
        style,
      ]}
      placeholder={inputFieldPlaceholder}
      placeholderTextColor={color}
      onChangeText={onChangeText}
      borderColor={borderColor}
    />
  );
};

const styles = StyleSheet.create({
  inputField: {
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
    paddingHorizontal: StyleVariable.space300,
    paddingVertical: StyleVariable.space200,
    borderWidth: 1,
    borderRadius: StyleVariable.radius200,
    marginBottom: StyleVariable.space300,
  },
  inputFieldError: {
    borderColor: Color.colorRed,
  },
  inputFieldOptional: {
    borderStyle: 'dashed',
    borderColor: Color.colorGray_200,
  },
});

export default InputField;