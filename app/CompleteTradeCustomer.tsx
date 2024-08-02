import { Color, FontFamily, FontSize, StyleVariable } from "@/GlobalStyles";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import { CheckBox } from "@rneui/themed";
import axios from "axios";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import config from "@/components/config";
import tw from "tailwind-react-native-classnames";
import { ScrollView } from "react-native";

interface RouteParams {
    payload: any; // Replace 'any' with the actual type of payload
}



const CompleteTradeCustomer = () => {
    const [checkSquarechecked, setCheckSquarechecked] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [additionalInformation, setadditionalInformation] = useState("");
    const [howDidYouHearAboutUs, sethowDidYouHearAboutUs] = useState("");
    const [annualSalesVolume, setAnnualSalesVolume] = useState("");
    const [vatNumber, setVatNumber] = useState("");
    const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
  
    const scrollViewRef = useRef(null);

    
    const route = useRoute();
    const payload = (route.params as RouteParams)?.payload;
  
    const handleadditionalInformationChange = (text: string) => setadditionalInformation(text);
    const handlehowDidYouHearAboutUsChange = (text: string) => sethowDidYouHearAboutUs(text);
    const handleAnnualSalesVolumeChange = (text: string) => setAnnualSalesVolume(text);
    const handleVatNumberChange = (text: string) => setVatNumber(text);
    const handleBusinessRegistrationNumberChange = (text: string) =>
      setBusinessRegistrationNumber(text);
  
    const handleSubmit = async () => {
        if (checkSquarechecked && payload) {
      const updatedPayload = {
        ...payload,
        additionalInformation:additionalInformation,
        howDidYouHearAboutUs:howDidYouHearAboutUs,
        annualSalesVolume:annualSalesVolume,
        vatNumber:vatNumber,
        businessRegistrationNumber:businessRegistrationNumber,
        "userId":3
      };

      console.log(updatedPayload);
  

      try {
        const response = await axios.post(`${config.API_BASE_URL}/api/client/request-trade-customer`, updatedPayload, {
          headers: {
            "Content-Type": "application/json",
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiaWF0IjoxNzIyMjE0MDA0LCJ1c2VyaWQiOjMsImVtYWlsIjoiYmF5bG9yLmFzbGFhbUBmbG9vZG91dHMuY29tIiwicm9sZSI6WyJjbGllbnQiXX0._aPIjV1jMStJaPofgo0pFN6aOGn30RM0EmAM9Sg26GA`
              
          },
        });
        if(response.data==="Trade customer request submitted successfully."){
            console.log("navigate to Another Page");

        };
      } catch (error) {
        console.error(error);
      }
    }
      else{
        console.log("Please check the box to continue");
      }
      // You can now use updatedPayload to send data to your backend or perform other actions
    };
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView
                ref={scrollViewRef}
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
                        onChangeText={handleVatNumberChange}
                        returnKeyType="next"
                    />
                    <TextInput
                        style={[styles.inputField, styles.inputTypo]}
                        placeholder="Business Registration Number (if applicable)"
                        placeholderTextColor="#b3b3b3"
                        onChangeText={handleBusinessRegistrationNumberChange}
                        returnKeyType="next"
                    />

                    <Picker
                        selectedValue={selectedProduct}
                        style={[styles.selectField, styles.inputTypo]}
                        onValueChange={(itemValue) => setSelectedProduct(itemValue)}
                    >
                        <Picker.Item label="Products of Interest" value="" />
                        <Picker.Item label="LED Lighting" value="LED Lighting" />
                        <Picker.Item
                            label="Suspended ceiling & Aluminium grid"
                            value="Suspended ceiling & Aluminium grid"
                        />
                        <Picker.Item label="Both" value="Both" />
                    </Picker>

                    {/* Sales Information Section */}
                    <View style={[tw`flex-row items-center mb-4`]}>
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
                        onChangeText={handleAnnualSalesVolumeChange}
                        returnKeyType="next"
                    />

                    <View style={tw``}>
                        <Text style={styles.label}>How did you hear about us?</Text>
                        <TextInput
                            style={[styles.input, styles.inputBorder]}
                            placeholder="Please describe"
                            onChangeText={handlehowDidYouHearAboutUsChange}
                            returnKeyType="next"
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
                            onChangeText={handleadditionalInformationChange}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Declaration Section */}
                    <View style={[tw`mt-6 -ml-2`, styles.declaration]}>
                        <View style={tw`flex-row items-start`}>
                            <CheckBox
                                checked={checkSquarechecked}
                                onPress={() => setCheckSquarechecked(!checkSquarechecked)}
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

                    <Pressable style={[tw`-mt-4`, styles.buttonDanger]} onPress={handleSubmit}>
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
    borderColor: Color.borderDefaultDefault,
    marginTop: 8,
    alignSelf: 'stretch',
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: StyleVariable.radius200,
    overflow: "hidden",
    backgroundColor: Color.backgroundDefaultDefault,
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