import { Color, FontFamily, FontSize, StyleVariable } from "@/GlobalStyles";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import { CheckBox } from "@rneui/themed";
import axios from "axios";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import config from "@/components/config";
import tw from "tailwind-react-native-classnames";
import { ScrollView } from "react-native";
import { useAppData } from "@/components/AppDataProvider";

interface RouteParams {
    payload: any; // Replace 'any' with the actual type of payload
}



const CompleteTradeCustomer = () => {
  const { token } = useAppData();
  const [formData, setFormData] = useState({
      checkSquarechecked: false,
      selectedProduct: "",
      additionalInformation: "",
      howDidYouHearAboutUs: "",
      annualSalesVolume: "",
      vatNumber: "",
      businessRegistrationNumber: "",
  });
  const [errors, setErrors] = useState({});

  const route = useRoute();
  const payload = (route.params as RouteParams)?.payload;

  const handleInputChange = (name: string, value: string | boolean) => {
      setFormData(prevData => ({ ...prevData, [name]: value }));
      // Clear error when user starts typing
      if (errors[name]) {
          setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
      }
  };
    const validateForm = () => {
      let newErrors = {};
      if (!formData.checkSquarechecked) {
          newErrors['checkSquarechecked'] = 'Please agree to the declaration';
      }
      if (!formData.selectedProduct) {
          newErrors['selectedProduct'] = 'Please select a product of interest';
      }
      if (!formData.annualSalesVolume) {
          newErrors['annualSalesVolume'] = 'Please enter your annual sales volume';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
      if (validateForm()) {
          const updatedPayload = {
              ...payload,
              ...formData,
              userId: 3
          };

          try {
            console.log(updatedPayload)
              const response = await axios.post(
                  `${config.API_BASE_URL}/api/client/request-trade-customer`,
                  updatedPayload,
                  {
                      headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`
                      },
                  }
              );
              if (response.data === "Trade customer request submitted successfully.") {
                  Alert.alert("Success", "Your trade customer request has been submitted successfully.");
              }
          } catch (error) {
              console.error(error);
              Alert.alert("Error", "There was an error submitting your request. Please try again.");
          }
      } else {
          Alert.alert("Form Error", "Please fill in all required fields and agree to the declaration.");
      }
  };
    return (
      <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
      >
          <ScrollView
              style={[tw`py-4`, styles.CompleteTradeCustomer2]}
              contentContainerStyle={tw`pb-8`}
          >
              <View style={[tw`flex-col px-4 py-4`]}>
                  {/* Business Details Section */}
                  <View style={[tw`flex-row items-center mb-4`]}>
                      <Image
                          style={styles.image10Icon}
                          contentFit="cover"
                          source={require("@/assets/image-10.png")}
                      />
                      <Text style={styles.businessDetails}>Business Details</Text>
                  </View>

                  <TextInput
                      style={[styles.inputField, styles.inputTypo]}
                      placeholder="VAT Number (if applicable):"
                      placeholderTextColor="#b3b3b3"
                      onChangeText={(text) => handleInputChange('vatNumber', text)}
                      value={formData.vatNumber}
                  />
                  <TextInput
                      style={[styles.inputField, styles.inputTypo]}
                      placeholder="Business Registration Number (if applicable)"
                      placeholderTextColor="#b3b3b3"
                      onChangeText={(text) => handleInputChange('businessRegistrationNumber', text)}
                      value={formData.businessRegistrationNumber}
                  />

                  <Picker
                      selectedValue={formData.selectedProduct}
                      style={[styles.selectField, styles.inputTypo]}
                      onValueChange={(itemValue) => handleInputChange('selectedProduct', itemValue)}
                  >
                      <Picker.Item label="Products of Interest" value="" />
                      <Picker.Item label="LED Lighting" value="LED Lighting" />
                      <Picker.Item label="Suspended ceiling & Aluminium grid" value="Suspended ceiling & Aluminium grid" />
                      <Picker.Item label="Both" value="Both" />
                  </Picker>
                  {errors.selectedProduct && <Text style={styles.errorText}>{errors.selectedProduct}</Text>}

                  {/* Sales Information Section */}
                  <View style={[tw`flex-row items-center mb-4 mt-4`]}>
                      <Image
                          style={styles.image11Icon}
                          contentFit="cover"
                          source={require("@/assets/image-11.png")}
                      />
                      <Text style={styles.salesInformation}>Sales Information</Text>
                  </View>

                  <TextInput
                      style={[styles.inputField, styles.inputTypo]}
                      placeholder="Annual Sales Volume"
                      placeholderTextColor="#b3b3b3"
                      onChangeText={(text) => handleInputChange('annualSalesVolume', text)}
                      value={formData.annualSalesVolume}
                  />
                  {errors.annualSalesVolume && <Text style={styles.errorText}>{errors.annualSalesVolume}</Text>}

                  <View style={tw`mt-4`}>
                      <Text style={styles.label}>How did you hear about us?</Text>
                      <TextInput
                          style={[styles.input, styles.inputBorder]}
                          placeholder="Please describe"
                          onChangeText={(text) => handleInputChange('howDidYouHearAboutUs', text)}
                          value={formData.howDidYouHearAboutUs}
                      />
                  </View>

                  <View style={tw`mt-4`}>
                      <Text style={styles.label}>Additional Information</Text>
                      <TextInput
                          style={[styles.input, styles.inputBorder, { height: 100 }]}
                          multiline
                          numberOfLines={4}
                          placeholder="Any other relevant information you would like us to know"
                          placeholderTextColor="#b3b3b3"
                          onChangeText={(text) => handleInputChange('additionalInformation', text)}
                          value={formData.additionalInformation}
                          textAlignVertical="top"
                      />
                  </View>

                  {/* Declaration Section */}
                  <View style={[tw`mt-6 -ml-2`, styles.declaration]}>
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

                  <Pressable style={[tw`mt-4`, styles.buttonDanger]} onPress={handleSubmit}>
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
    marginTop: 5,
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
    marginTop: 8,
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
    height: 172,
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
  view1: {
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