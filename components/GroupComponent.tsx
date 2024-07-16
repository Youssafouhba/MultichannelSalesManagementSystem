import * as React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import VariantNeutralStateHover from "./VariantNeutralStateHover";
import ModeLightStateEnabled from "./ModeLightStateEnabled";
import { FontSize, FontFamily, Color, StyleVariable } from "../GlobalStyles";
import tw from 'tailwind-react-native-classnames';
import { useState, useEffect } from "react";

interface GroupComponentProps {
  onCategorySelect: (category: string | null) => void;
}

const GroupComponent: React.FC<GroupComponentProps> = ({ onCategorySelect }) => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const handleImagePress = (label: string) => {
    const newLabel = label===selectedLabel? selectedLabel: label;
    console.log(newLabel)
    //console.log(selectedLabel)
    //console.log(label);
    setSelectedLabel(newLabel);
    onCategorySelect(newLabel);
  };

  const renderCategoryButton = (label: string) => (
    <Pressable
      key={label}
      onPress={() => handleImagePress(label)}
      style={({ pressed }) => [
        tw`w-28`,
        pressed && styles.pressed
      ]}
    >
      <View
        style={[
          styles.variantneutralStatehover,
          selectedLabel === label && styles.selectedButton
        ]}
      >
        <Text
          style={[
            styles.texto,
            selectedLabel === label && styles.selectedButtonText
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={tw`w-full h-40 top-3`}>
      <View style={tw`flex-row justify-between items-center text-center pl-2 pr-2`}>
        <View>
          <Pressable onPress={() => handleImagePress("suggestions")}>
            <Text style={[styles.suggestions, styles.suggestionsPosition]}>
              {`suggestions `}
            </Text>
          </Pressable>
        </View>
        <View>
          <Pressable onPress={() => handleImagePress("View All")} >
            <ModeLightStateEnabled
              label="View All"
              showText={false}
              modeLightStateEnabledPosition={undefined}
              modeLightStateEnabledTop={undefined}
              modeLightStateEnabledLeft={undefined}
            />
          </Pressable>
        </View>
      </View>
      <View style={tw`flex-row justify-around my-4`}>
        {renderCategoryButton("Best Seller")}
        {renderCategoryButton("New designs")}
        {renderCategoryButton("Ceilling Calculator")}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  texto: {
    fontSize: FontSize.singleLineBodyBase_size,
    lineHeight: 16,
    fontFamily: 'kavoonRegular',
    textAlign: "center",
    color: Color.colorize_gray,
  },
  variantneutralStatehover: {
    borderRadius: StyleVariable.radius400,
    backgroundColor: Color.colorWhitesmoke_100,
    borderStyle: "solid",
    borderColor: Color.colorWhite,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: StyleVariable.space300,
    overflow: "hidden",
    height: 60,
  },
  suggestionsPosition: {
    left: 0,
    top: 0,
  },
  suggestions: {
    fontSize: FontSize.size_xl,
    lineHeight: 24,
    fontFamily: 'kavoonRegular',
    color: Color.colorBlack,
    textAlign: "left",
    width: 115,
    height: 24,
  },
  selectedButtonText: {
    color: Color.colorWhite,
  },
  selectedButton: {
    backgroundColor: Color.colorBlack,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default GroupComponent;