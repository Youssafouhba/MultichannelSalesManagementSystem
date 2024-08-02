import { Color, FontFamily, FontSize, StyleVariable } from "@/GlobalStyles";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import { CheckBox } from "@rneui/themed";
import axios from "axios";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import config from "@/components/config";
import tw from "tailwind-react-native-classnames";

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
      <View style={[tw`py-4`,styles.CompleteTradeCustomer2]}>
        <View style={[tw`flex-col px-4`]}>
            <View style={[tw`flex-row items-center`]}>
                <Image
                    style={[styles.image10Icon]}
                    contentFit="cover"
                    source={require("@/assets/image9.png")}
                />
                <Text style={styles.businessDetails}>Business Details</Text>
            </View>
            <View style={[tw`my-3`]}>
                <TextInput
                    style={[tw`my-2`,styles.inputPosition]}
                    placeholder="VAT Number (if applicable):"
                    placeholderTextColor="#b3b3b3"
                    onChangeText={handleVatNumberChange}
                />
                <TextInput
                    style={[styles.inputPosition]}
                    placeholder="Business Registration Number (if applicable)"
                    placeholderTextColor="#b3b3b3"
                    onChangeText={handleBusinessRegistrationNumberChange}
                />
            </View>
            <View style={[tw`-mt-3`]}>
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
            </View>
        </View>
        
      </View>
    );
  };
  

const styles = StyleSheet.create({
  checkSquareLayout: {
    backgroundColor: "transparent",
    padding: 0,
    left: -10,
    top: -90,
    position: "absolute",
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
    position: "absolute",
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
    paddingHorizontal: StyleVariable.space400,
    borderColor: Color.borderDefaultDefault,
    marginTop: 8,
    alignSelf: "stretch",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: StyleVariable.radius200,
    overflow: "hidden",
    backgroundColor: Color.backgroundDefaultDefault,
    zIndex:7
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
    color: Color.textDangerOnDanger,
    marginLeft: 8,
    textAlign: "left",
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
  },
  xIcon: {
    marginLeft: 8,
  },
  buttonDanger: {
    top: 132,
    left: 124,
    backgroundColor: Color.colorLimegreen_100,
    borderColor: Color.colorLimegreen_100,
    justifyContent: "center",
    padding: StyleVariable.space300,
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: StyleVariable.radius200,
    position: "absolute",
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
    width: 343,
    height: 119,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    left: 29,
    top: -80,
    textAlign: "left",
    position: "absolute",
  },
  checkSquare: {
    overflow: "hidden",
  },
  declaration: {
    top: 674,
    left: 38,
    width: 372,
    height: 172,
    position: "absolute",
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
  input: {
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
  },
  error: {
    color: Color.textDefaultDefault,
  },
  inputField: {
    top: 470,
  },
  input1: {
    height: 41,
  },
  inputField1: {
    top: 370,
  },
  image11Icon: {
    width: 22,
    height: 24,
    left: -19,
    top: -112,
    position: "absolute",
    
  },
  inputField2: {
    top: -70,
    left: 20,
    width: 306,
    position: "absolute",
  },
  salesInformation: {
    top: -110,
    left: 27,
    width: 346,
    color: Color.colorBlack,
    lineHeight: 21,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    textAlign: "left",
    position: "absolute",
  },
  view: {
    top: 385,
    left: 35,
    width: 373,
    height: 81,
    position: "absolute",
  },
  selectField: {
    left: 24,
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
    width: "100%",
    //height: 932,
    overflow: "hidden",
    backgroundColor: Color.backgroundDefaultDefault,
  },
});

export default CompleteTradeCustomer;