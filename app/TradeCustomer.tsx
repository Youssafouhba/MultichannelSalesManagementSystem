import React, { useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Pressable } from "react-native";
import { Image } from "expo-image";
import InputField from "../components/InputField";
import { FontFamily, FontSize, Color, StyleVariable } from "../GlobalStyles";
import tw from "tailwind-react-native-classnames";
import { router, useNavigation } from "expo-router";
import { useAppContext } from "@/components/AppContext";
import LogInRequiredPage from "@/components/LogInRequiredPage";
import { useAppData } from "@/components/AppDataProvider";
import { Alert } from "react-native";


const OPTIONS = ["Sole Trader", "Partnership", "Limited Company", "Other"];

const Inputoptions = ({ onSelectOption, selectedOption }) => {
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
    onSelectOption(option);
    setDropdownVisible(false);
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

interface RouteParams {
  payload: any; // Replace 'any' with the actual type of payload
}


const TradeCustomer = () => {
  const { token } = useAppData();
  const navigation = useNavigation<any>();
  const { state } = useAppContext()
  const [errors, setErrors] = useState<Record<string, string>>({});
  const payload = (navigation.params as RouteParams)?.payload;

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    businessAddress: "",
    city: "",
    country: "",
    postalCode: "",
    phoneNumber: "",
    emailAddress: "",
    website: "",
    typeOfBusiness: "",
  });

  var isLoggedIn = state.JWT_TOKEN !== '';

  const handleNextButton = (): void => {
    if (validateForm()) {
      const payload = {
        ...formData,
      };
      // Navigate to CompleteTradeCustomer screen
      navigation.navigate("CompleteTradeCustomer", { payload });
    } else {
      Alert.alert("Error", "Please fill in all required fields.");
    }
  };

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const inputFields = [
    { name: "companyName", label: "Company Name (if applicable)", required: true },
    { name: "contactPerson", label: "Contact Person", required: true },
    { name: "businessAddress", label: "Business Address", required: true },
    { name: "city", label: "City", required: true },
    { name: "country", label: "Country", required: true },
    { name: "postalCode", label: "Postal Code", required: true },
    { name: "phoneNumber", label: "Phone Number", required: true },
    { name: "emailAddress", label: "Email Address", required: true },
    { name: "website", label: "Website (if applicable)", required: false },
  ];

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    let isValid = true;

    inputFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    if (!formData.typeOfBusiness) {
      newErrors.typeOfBusiness = "Please select a business type";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <View style={[tw`items-center py-4`, styles.container]}>
      {isLoggedIn ? (
        <View>
          <Text style={styles.title}>Open a trade account (minimum buy £500)</Text>
          <View style={tw`flex-row justify-start items-center mt-4`}>
            <Image
              style={styles.icon}
              contentFit="cover"
              source={require("../assets/image9.png")}
            />
            <Text style={[styles.subtitle, tw`mx-2`]}>
              Company/Individual Information :
            </Text>
          </View>
          {inputFields.map((field, index) => (
            <View key={field.name}>
              <InputField
                inputFieldPlaceholder={field.label}
                propTop={30 + index * 20}
                color={errors[field.name] ? 'red' : "#b3b3b3"}
                onChangeText={(text) => handleInputChange(field.name, text)}
                value={formData[field.name]}
              />
            </View>
          ))}
          <Inputoptions 
            onSelectOption={(option) => handleInputChange('typeOfBusiness', option)}
            selectedOption={formData.typeOfBusiness}
          />
          {formData.typeOfBusiness === "Other" && (
            <InputField 
              inputFieldPlaceholder="Please Specify" 
              propTop={225}
              color={errors.typeOfBusiness ? 'red' : "#b3b3b3"}
              onChangeText={(text) => handleInputChange('typeOfBusiness', text)}
              value={formData.typeOfBusiness}
            />
          )}
          <Pressable onPress={handleNextButton} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
            <Image
              style={styles.icon}
              contentFit="cover"
              tintColor={'white'}
              source={require("../assets/arrow-right.png")}
            />
          </Pressable>
        </View>
      ) : (
        <LogInRequiredPage message='Please log in to view your trade customer page' page='TradeCustomer' />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.BackgroundBrandDefault,
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
    backgroundColor: Color.colorsBlue,
    borderRadius: StyleVariable.radius200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    paddingHorizontal: StyleVariable.space300,
    paddingVertical: StyleVariable.space200,
    opacity: 1,
  },
  buttonText: {
    fontSize: FontSize.presetsBody2_size,
    lineHeight: 16,
    fontFamily: FontFamily.presetsBody2,
    color: "white",
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
  errorText: {
    color: 'red',
    fontSize: FontSize.presetsBody2_size,
    marginTop: 4,
  },
});

export default TradeCustomer;