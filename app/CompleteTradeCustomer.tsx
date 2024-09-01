import React, { useState,useContext } from 'react';
import { Image,View, Text, TextInput, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { CheckBox } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import config from "@/components/config";
import tw from "tailwind-react-native-classnames";
import { FontFamily, FontSize, StyleVariable, Color } from '@/GlobalStyles';
import { useAppContext } from '@/components/AppContext';
import { useRoute } from "@react-navigation/native";
import { router } from 'expo-router';
import MultiSelectPicker from '@/components/MultiSelectPicker';
import { isValidEmail,isValidPhoneNumber,productOptions } from '@/constants/Classes';
import { hearAboutUsSuggestions } from '@/constants/Classes';
import CustomAlert from '@/components/CustomAlert';
import { useUser } from '@/contex/UserContext';
import useInternetCheck from '@/components/useInternetCheck';
import NoInternetConnection from '@/components/NoInternetConnection';
interface RouteParams {
  payload: any; // Replace 'any' with the actual type of payload
}
const CompleteTradeCustomer = () => {
  const { state} = useUser();
  const [alertVisible, setAlertVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const route = useRoute();
  const payload = (route.params as RouteParams)?.payload;
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { isConnected, connectionType } = useInternetCheck();
  const [formData, setFormData] = useState({
    checkSquarechecked: false,
    productsOfInterest: selectedProducts,
    howDidYouHearAboutUs: "",
    emailAddress: "",
    phoneNumber: "",
    vatNumber: "",
    businessRegistrationNumber: "",
  });
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (name: any, value: any) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors: any) => ({ ...prevErrors, [name]: null }));
    }
  };

  const validateForm = () => {
    let newErrors: any = {};
    if (!formData.checkSquarechecked) {
      newErrors['checkSquarechecked'] = 'Please agree to the declaration';
    }
    if (formData.productsOfInterest.length==0) {
      newErrors['productsOfInterest'] = 'Please select a product of interest';
    }
    if (!formData.howDidYouHearAboutUs) {
      newErrors['howDidYouHearAboutUs'] = 'Please tell us how you heard about us';
    }
    if (!isValidEmail(formData.emailAddress)) {
      newErrors['emailAddress']="Invalid email format";
    }
    if (!isValidPhoneNumber(formData.phoneNumber)) {
      newErrors['phoneNumber']="Invalid phoneNumber format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const updatedPayload = {
          ...payload,
          ...formData,
          productsOfInterest: formData.productsOfInterest.join(', '),
          userId: jwtDecode<any>(state.JWT_TOKEN).userid
        };
        const response = await axios.post(
          `${config.API_BASE_URL}/api/client/request-trade-customer`,updatedPayload,
          {
            headers: {
              Authorization: `Bearer ${state.JWT_TOKEN}`
            },
          }
        );
        if (response.data === "Trade customer request submitted successfully.") {
          setAlertVisible(true);
        }
      } catch (error) {
        setErrorVisible(true);
        setErrorMessage("There was an error submitting your request. Please try again.");
      }
    } else {
      setErrorVisible(true);
      setErrorMessage("Please fill in all required fields and agree to the declaration.");
    }
  };

  return ( 
      !isConnected?
      <NoInternetConnection/>
      :
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <CustomAlert visible={alertVisible} onDismiss={()=>{setAlertVisible(false),router.push("/");}} duration={2000} title={"Request Success"} message={"Your trade customer request has been submitted successfully."} type="success"/>
      <ScrollView
        style={[tw``, styles.CompleteTradeCustomer2]}
        contentContainerStyle={tw`pb-8`}
      >
        <View style={[tw`flex-col px-4`]}>
          {/* Contact Information Section */}
          <View style={[tw`flex-row items-center mb-4 mt-4`]}>
            <Image
              style={styles.image11Icon}
              source={require("@/assets/image-10.png")}
            />
            <Text style={styles.salesInformation}>Contact Information</Text>
          </View>

          <TextInput
            style={[styles.inputField, styles.inputTypo, errors.phoneNumber && styles.inputError]}
            placeholder="Phone Number *"
            keyboardType='numeric'
            placeholderTextColor="#b3b3b3"
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            value={formData.phoneNumber}
          />
          <TextInput
            style={[styles.inputField, styles.inputTypo, errors.emailAddress && styles.inputError]}
            placeholder="Email Address *"
            keyboardType='email-address'
            placeholderTextColor="#b3b3b3"
            onChangeText={(text) => handleInputChange('emailAddress', text)}
            value={formData.emailAddress}
          />
          {/* Business Details Section */}
          <View style={[tw`flex-row items-center mb-4`]}>
            <Image
              style={styles.image10Icon}
              source={require("@/assets/image-11.png")}
            />
            <Text style={styles.businessDetails}>Business Details</Text>
          </View>

          <TextInput
            style={[styles.inputField, styles.inputTypo,{ borderStyle: 'dashed',}]}
            placeholder="VAT Number (if applicable):"
            placeholderTextColor="#b3b3b3"
            onChangeText={(text) => handleInputChange('vatNumber', text)}
            value={formData.vatNumber}
          />
          <TextInput
            style={[styles.inputField, styles.inputTypo,{ borderStyle: 'dashed',fontSize: 14}]}
            placeholder="Business Registration Number (if applicable)"
            placeholderTextColor="#b3b3b3"
            onChangeText={(text) => handleInputChange('businessRegistrationNumber', text)}
            value={formData.businessRegistrationNumber}
          />
          <Text style={[styles.label,tw`text-base font-medium text-gray-400`,errors.productsOfInterest && {color: 'red'}]}>Products of Interest <Text style={tw`text-red-400`}>*</Text></Text>
          <MultiSelectPicker
            options={productOptions}
            selectedValues={formData.productsOfInterest}
            onValueChange={(selectedProducts: any) => handleInputChange('productsOfInterest', selectedProducts)}
          />
     
          <View style={tw``}>
            <Text style={[styles.label,tw`text-base font-medium text-gray-400`, errors.howDidYouHearAboutUs &&{color: 'red' }]}>How did you hear about us? <Text style={tw`text-red-400`}>*</Text></Text>
            <Picker
              selectedValue={formData.howDidYouHearAboutUs}
              style={[styles.input, styles.inputBorder, errors.howDidYouHearAboutUs && styles.inputError]}
              onValueChange={(itemValue) => handleInputChange('howDidYouHearAboutUs', itemValue)}
            >
              <Picker.Item label="Select an option" value="" />
              {hearAboutUsSuggestions.map((item, index) => (
                <Picker.Item key={index} label={item} value={item} />
              ))}
            </Picker>
          </View>
          {/* Declaration Section */}
          <View style={[tw`-ml-2`, styles.declaration]}>
            <View style={tw`flex-row items-start`}>
              <CheckBox
                checked={formData.checkSquarechecked}
                onPress={() => handleInputChange('checkSquarechecked', !formData.checkSquarechecked)}
                checkedColor="#000"
                containerStyle={styles.checkSquareLayout}
              />
              <Text style={[tw`flex-1`, styles.declarationText]}>
                <Text style={styles.declaration1}>Declaration</Text>
                <Text style={styles.text}>{` : `}</Text>
                <Text style={styles.iweCertifyThat}>
                  I/we certify that the information provided above is true and
                  accurate to the best of my/our knowledge. I/we agree to abide
                  by Wholesale Ltd.'s terms and conditions for trade customers
                </Text>
                <Text style={styles.text}>{`.`}</Text>
              </Text>
            </View>
          </View>
          {errors.checkSquarechecked && <Text style={styles.errorText}>{errors.checkSquarechecked}</Text>}

          <Pressable style={[tw`mt-4`, styles.buttonDanger]} onPress={()=>handleSubmit()}>
            <Text style={styles.button}>SEND</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
  

const styles = StyleSheet.create({
  checkSquareLayout: {
    backgroundColor: "transparent",
    padding: 0,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
},
  iconLayout: {
    display: "none",
    height: 16,
    width: 16,
    overflow: "hidden",
  },
  inputPosition1: {
    width: 378,
    left: 29,
  },
  errorTypo: {
    marginTop: 8,
    lineHeight: 22,
    textAlign: "left",
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
    display: "none",
  },
  inputBorder: {
    minWidth: 240,
    paddingVertical: StyleVariable.space300,
    paddingHorizontal: 10,
    borderColor: Color.BorderDefaultDefault,
    //marginTop: 8,
    minHeight: 50,
    alignSelf: 'stretch',
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: StyleVariable.radius200,
    overflow: "hidden",
    backgroundColor: Color.BackgroundBrandDefault,
    zIndex:7,
    
  },

  inputTypo: {
    fontSize: FontSize.presetsBody2_size,
  },
  inputPosition: {
    width: 317,
    left: 36,
    fontSize: 15,
    //position: "absolute",
  },
  button: {
    lineHeight: 16,
    color: Color.colorWhite,
    marginLeft: 8,
    textAlign: "left",
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
  },
  xIcon: {
    marginLeft: 8,
  },
  buttonDanger: {
    backgroundColor: '#00a6fb',
    borderColor: '#00a6fb',
    justifyContent: "center",
    padding: StyleVariable.space300,
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: StyleVariable.radius200,
    overflow: "hidden",
  },
  declaration1: {
    color: Color.colorRed,
  },
  text: {
    color: Color.colorDarkslateblue,
  },
  iweCertifyThat: {
    color: "#1b1b1b",
  },
  declarationIweCertifyContainer: {
    fontSize: 15,
    lineHeight: 24,
    width: 340,
    height: 119,
    fontWeight: "500",
    left: 29,
    textAlign: "left",
  },
  checkSquare: {
    overflow: "hidden",
  },
  declaration: {
    width: 360,
  },
  label: {
    color: Color.textDefaultDefault,
    lineHeight: 22,
    alignSelf: "stretch",
    textAlign: "left",
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
  },
  description: {
    color: Color.textDefaultSecondary,
    alignSelf: "stretch",
    marginTop: 8,
  },
  error: {
    color: Color.textDefaultDefault,
  },
  input1: {
    width: 300,
    height: 41,
  },
  inputField1: {
    top: 370,
  },
  image11Icon: {
    width: 22,
    height: 24,    
  },
  inputField2: {
    left: 20,
    width: 306,
  },
  salesInformation: {
   
    left: 20,
    width: 346,
    color: Color.colorBlack,
    lineHeight: 21,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    textAlign: "left",
  },
  view: {
    top: 385,
    left: 35,
    width: 373,
    height: 81,
    position: "absolute",
  },
  selectField: {
    top: -16,
    marginBottom: -10,
    width: 316,
  },
  inputField3: {
    //top: 75,
  },
  inputField4: {
    top: 24,
  },
  businessDetails: {
    width: 359,
    left: 36,
    color: Color.colorBlack,
    lineHeight: 21,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    textAlign: "left",
    position: "absolute",
  },
  image10Icon: {
    width: 23,
    height: 24,
  },
  inputError: {
    borderColor: 'red',
  },
  icon: {
    marginLeft: -176,
    top: 55,
    left: "50%",
    height: 16,
    width: 16,
    position: "absolute",
  },
  CompleteTradeCustomer2: {
    flex: 1,
    backgroundColor: Color.backgroundDefaultDefault,
},
inputField: {
    minHeight: 44,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Color.borderDefaultDefault,
    borderRadius: StyleVariable.radius200,
    fontSize: FontSize.presetsBody2_size,
},
input: {
   minHeight: 44,
    paddingHorizontal: 10,
    fontSize: FontSize.presetsBody2_size,
},
declarationText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "500",
},
});

export default CompleteTradeCustomer;