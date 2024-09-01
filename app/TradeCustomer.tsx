import React, { useState, useCallback, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Pressable, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";
import InputField from "../components/InputField";
import { FontFamily, FontSize, Color, StyleVariable } from "../GlobalStyles";
import tw from "tailwind-react-native-classnames";
import {useNavigation } from "expo-router";
import { useAppContext } from "@/components/AppContext";
import LogInRequiredPage from "@/components/LogInRequiredPage";
import { Alert } from "react-native";
import { OPTIONS } from "@/constants/Classes";
import { inputFields } from "@/constants/Classes";
import { useUser } from "@/contex/UserContext";
import useInternetCheck from "@/components/useInternetCheck";
import NoInternetConnection from "@/components/NoInternetConnection";



const Inputoptions = ({ onSelectOption, selectedOption }: { onSelectOption: any, selectedOption: any }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 48, bottom: 'auto' });
  const selectRef = useRef(null);

  const toggleDropdown = useCallback(() => {
    setDropdownPosition({top: -110, bottom: 'auto' })
    setDropdownVisible(prev => !prev);
  }, [isDropdownVisible]);

  const handleOptionSelect = useCallback((option) => {
    onSelectOption(option);
    setDropdownVisible(false);
  }, [onSelectOption]);

  return (
    <View style={[tw`mx-4`]}>
      <TouchableOpacity onPress={toggleDropdown}>
        <Text style={styles.description}>Type of Business</Text>
      </TouchableOpacity>
      <TouchableOpacity ref={selectRef} style={styles.select} onPress={toggleDropdown}>
        <Text style={styles.selectValue}>{selectedOption || "Select an option"}</Text>
        <Image
          style={styles.icon}
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
  const navigation = useNavigation<any>();
  const {state} = useUser()
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otherTypeOfBusiness, setOtherTypeOfBusiness] = useState("");
  const { isConnected, connectionType } = useInternetCheck();
  const [formData, setFormData] = useState<any>({
    companyName: "",
    contactPerson: "",
    businessAddress: "",
    country: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    emailAddress: "",
    website: "",
    typeOfBusiness: "",
  });


  const handleNextButton = (): void => {
    if (validateForm()) {
      const payload = {
        ...formData,
        typeOfBusiness: formData.typeOfBusiness === "Other" ? otherTypeOfBusiness : formData.typeOfBusiness,
      };
      navigation.navigate("CompleteTradeCustomer", { payload });
    } else {
      Alert.alert("Error", "Please fill in all required fields.");
    }
  };

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleOtherTypeChange = (value: string) => {
    setOtherTypeOfBusiness(value);
    if (errors.typeOfBusiness) {
      setErrors(prevErrors => ({ ...prevErrors, typeOfBusiness: '' }));
    }
  };



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
      } else if (formData.typeOfBusiness === "Other" && !otherTypeOfBusiness) {
        newErrors.typeOfBusiness = "Please specify the business type";
        isValid = false;
      }
    setErrors(newErrors);
    return isValid;
  };

  return (
  
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {  
      !isConnected?
      <NoInternetConnection/>
      :state.isLoggedIn?(
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <Text style={[styles.title,tw`mx-2 my-2`]}>Open a trade account (minimum buy £500)</Text>
          <View style={tw`flex-row justify-start items-center my-2 ml-4`}>
            <Image
              style={styles.icon}
              source={require("../assets/image9.png")}
            />
            <Text style={[styles.subtitle, tw`mx-2`]}>
              Company/Individual Information:
            </Text>
          </View>
          {inputFields.map((field, index) => (
            <View key={field.name} style={[styles.inputContainer,tw`mx-4`]}>
              <InputField
                inputFieldPlaceholder={field.label}
                borderColor={errors[field.name] ? 'red' : field.required ? "#b3b3b3" : "#d3d3d3"}
                onChangeText={(text: string) => handleInputChange(field.name, text)}
                value={formData[field.name]}
                style={field.required ? styles.requiredField : styles.optionalField}
              />
            </View>
          ))}
          <Inputoptions 
            onSelectOption={(option: any) => handleInputChange('typeOfBusiness', option)}
            selectedOption={formData.typeOfBusiness}
          />
          {formData.typeOfBusiness === "Other" && (
            <View style={[tw`mx-4 mt-4`]}>
            <InputField 
                inputFieldPlaceholder="Please Specify" 
                color={errors.typeOfBusiness ? 'red' : "#b3b3b3"}
                onChangeText={handleOtherTypeChange}
                value={otherTypeOfBusiness}
                style={styles.requiredField}
              />
            </View>

          )}
          <Pressable onPress={handleNextButton} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
            <Image
              style={styles.icon}
              tintColor={'white'}
              source={require("../assets/arrow-right.png")}
            />
          </Pressable>
        </View>
    </ScrollView>
      ):(
        <LogInRequiredPage message='Please log in to view your trade customer page' page='TradeCustomer' />
      )}

    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.BackgroundBrandDefault,
  },
  scrollContainer: {
  
    flexGrow: 1,
  },
  contentContainer: {
    marginVertical: 8,
    flex: 1,
  },
  title: {
    fontSize: FontSize.size_lg,
    lineHeight: 27,
    color: "#0d2e6e",
    fontWeight: "500",
  },
  description: {
    color: Color.textDefaultSecondary,
    textAlign: "left",
    lineHeight: 22,
    fontSize: FontSize.presetsBody2_size,
  },
  subtitle: {
    fontSize: FontSize.size_sm,
    lineHeight: 21,
    color: Color.colorBlack,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
  },
  icon: {
    width: 16,
    height: 16,
  },
  inputContainer: {
    marginBottom: StyleVariable.space300,
  },
  requiredField: {
    borderColor: Color.colorGray_100,
  },
  optionalField: {
    borderColor: Color.colorGray_200,
    borderStyle: 'dashed',
  },
  button: {
    backgroundColor: Color.colorsBlue,
    borderRadius: StyleVariable.radius200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    paddingHorizontal: StyleVariable.space300,
    paddingVertical: StyleVariable.space200,
    marginTop: 10,
    marginHorizontal: 16,
  },
  buttonText: {
    fontSize: FontSize.presetsBody2_size,
    lineHeight: 16,
    fontFamily: FontFamily.presetsBody2,
    color: "white",
  },
  select: {
    height: 41,

    flexDirection: "row",
    alignItems: "center",
    //marginHorizontal: 8,
    paddingTop: StyleVariable.space300,
    paddingRight: StyleVariable.space300,
    paddingBottom: StyleVariable.space300,
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