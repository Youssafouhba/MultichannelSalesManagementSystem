import React, { useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Pressable } from "react-native";
import { Image } from "expo-image";
import InputField from "../components/InputField";
import { FontFamily, FontSize, Color, StyleVariable } from "../GlobalStyles";
import tw from "tailwind-react-native-classnames";
import { router } from "expo-router";
import { useAppContext } from "@/components/AppContext";
import LogInRequiredPage from "@/components/LogInRequiredPage";

const OPTIONS = ["Sole Trader", "Partnership", "Limited Company", "Other"];

const Inputoptions = ({ onSelectOption }) => {

  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 48, bottom: 'auto' });
  const selectRef = useRef(null);


  const toggleDropdown = useCallback(() => {
    if (!isDropdownVisible) {
      selectRef.current.measure((x, y, width, height, pageX, pageY) => {
        const windowHeight = Dimensions.get('window').height;
        const spaceBelow = windowHeight - pageY - height;
        const spaceAbove = pageY;
        
        setDropdownPosition(spaceBelow < 200 && spaceAbove > spaceBelow
          ? { bottom: height, top: 'auto' }
          : { top: height, bottom: 'auto' }
        );
      });
    }
    setDropdownVisible(prev => !prev);
  }, [isDropdownVisible]);

  const handleOptionSelect = useCallback((option) => {
    setSelectedOption(option);
    setDropdownVisible(false);
    onSelectOption(option);
  }, [onSelectOption]);

  return (
    <View style={styles.inputoptions}>
      <TouchableOpacity onPress={toggleDropdown}>
        <Text style={styles.description}>Type of Business</Text>
      </TouchableOpacity>
      <TouchableOpacity ref={selectRef} style={styles.select} onPress={toggleDropdown}>
        <Text style={styles.selectValue}>{selectedOption || "Select an option"}</Text>
        <Image
          style={styles.icon}
          contentFit="cover"
          source={require("../assets/chevron-down.png")}
        />
      </TouchableOpacity>
      {isDropdownVisible && (
        <View style={[styles.options, dropdownPosition]}>
          {OPTIONS.map((option) => (
            <TouchableOpacity key={option} onPress={() => handleOptionSelect(option)}>
              <Text style={styles.option}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const TradeCustomer = () => {
  const {state} = useAppContext()
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  var isLoggedIn = state.JWT_TOKEN !=='';
  var token = state.JWT_TOKEN;
  return (
    <View style={[tw`items-center py-4`, styles.container]}>
      {isLoggedIn?(
        <View>
          <Text style={styles.title}>Open a trade account (minimum buy £500)</Text>
          <View style={tw`flex-row justify-start items-center mt-4 -ml-16`}>
            <Image
              style={styles.icon}
              contentFit="cover"
              source={require("../assets/image9.png")}
            />
            <Text style={[styles.subtitle, tw`mx-2`]}>
              Company/Individual Information :
            </Text>
          </View>
          {[
            "Company Name (if applicable )", "Contact Person", "Business Address", "City",
            "Country", "Postal Code", "Phone Number", "Email Address", "Website (if applicable)"
          ].map((placeholder, index) => (
            <InputField key={placeholder} inputFieldPlaceholder={placeholder} propTop={30 + index * 20} />
          ))}
          <Inputoptions onSelectOption={setSelectedBusinessType} />
          {selectedBusinessType === "Other" && (
            <InputField inputFieldPlaceholder="Please Specify" propTop={225} />
          )}
          <Pressable onPress={() => router.navigate("/CompleteTradeCustomer")} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
            <Image
              style={styles.icon}
              contentFit="cover"
              tintColor={'red'}
              source={require("../assets/arrow-right.png")}
            />
          </Pressable>
        </View>
      ):(
        <LogInRequiredPage message='Please log in to view your trade customer page' page='TradeCustomer'/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.backgroundBrandDefault,
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
  title: {
    fontSize: FontSize.size_lg,
    lineHeight: 27,
    color: "#0d2e6e",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    textAlign: "left",
  },
  subtitle: {
    fontSize: FontSize.size_sm,
    lineHeight: 21,
    color: Color.colorBlack,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    textAlign: "left",
  },
  icon: {
    width: 16,
    height: 16,
  },
  button: {
    top: 235,
    left: 130,
    borderRadius: StyleVariable.radius200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'flex-end',
    paddingHorizontal: StyleVariable.space300,
    paddingVertical: StyleVariable.space200,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: FontSize.presetsBody2_size,
    lineHeight: 16,
    fontFamily: FontFamily.presetsBody2,
    color: "red",
    textAlign: "left",
  },
  inputoptions: {
    top: 220,
  },
  description: {
    color: Color.textDefaultSecondary,
    marginTop: 8,
    textAlign: "left",
    lineHeight: 22,
    fontSize: FontSize.presetsBody2_size,
  },
  select: {
    height: 41,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: StyleVariable.space400,
    paddingTop: StyleVariable.space300,
    paddingRight: StyleVariable.space300,
    paddingBottom: StyleVariable.space300,
    minWidth: 240,
    borderWidth: 1,
    borderColor: Color.colorGray_100,
    borderStyle: "solid",
    backgroundColor: Color.backgroundDefaultDefault,
    borderRadius: StyleVariable.radius200,
    marginTop: 8,
  },
  selectValue: {
    flex: 1,
    textAlign: "center",
    color: Color.textDefaultDefault,
    fontSize: FontSize.presetsBody2_size,
    lineHeight: 16,
  },
  options: {
    padding: StyleVariable.space200,
    position: 'absolute',
    left: 0,
    right: 0,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: "rgba(12, 12, 13, 0.1)",
    borderWidth: 1,
    borderColor: Color.colorGray_100,
    borderStyle: "solid",
    backgroundColor: Color.colorWhite,
    borderRadius: StyleVariable.radius200,
  },
  option: {
    color: Color.colorGray_100,
    marginTop: 8,
    textAlign: "left",
    lineHeight: 22,
    fontSize: FontSize.presetsBody2_size,
    fontFamily: FontFamily.presetsBody2,
  },
});

export default TradeCustomer;