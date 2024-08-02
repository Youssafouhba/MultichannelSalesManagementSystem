import { Color, FontFamily, FontSize, StyleVariable } from "@/GlobalStyles";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import { CheckBox } from "@rneui/themed";
import axios from "axios";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const API_BASE_URL = "http://localhost:9000";

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
        const response = await axios.post(`${API_BASE_URL}/api/client/request-trade-customer`, updatedPayload, {
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
      <View style={styles.CompleteTradeCustomer2}>
        <View style={styles.declaration}>
          <Pressable style={styles.buttonDanger} onPress={handleSubmit}>
            <Image
              style={styles.iconLayout}
              contentFit="cover"
              source={require("@/assets/image9.png")}
            />
            <Text style={styles.button}>SEND</Text>
            <Image
              style={[styles.xIcon, styles.iconLayout]}
              contentFit="cover"
              source={require("@/assets/x2.png")}
            />
          </Pressable>
          <Text style={styles.declarationIweCertifyContainer}>
            <Text style={styles.declaration1}>Declaration</Text>
            <Text style={styles.text}>{`: `}</Text>
            <Text style={styles.iweCertifyThat}>
              I/we certify that the information provided above is true and
              accurate to the best of my/our knowledge. I/we agree to abide by
              Wholesale Ltd.'s terms and conditions for trade customers
            </Text>
            <Text style={styles.text}>{`.`}</Text>
          </Text>
          <CheckBox
            style={styles.checkSquare}
            checked={checkSquarechecked}
            onPress={() => setCheckSquarechecked(!checkSquarechecked)}
            checkedColor="#000"
            containerStyle={styles.checkSquareLayout}
          />
        </View>
        <View style={[styles.inputField, styles.inputPosition1]}>
          <Text style={styles.label}>Additional Information</Text>
          <Text style={[styles.description, styles.errorTypo]}>Description</Text>
          <TextInput
            style={[styles.input, styles.inputBorder]}
            placeholder="Any other relevant information you would like us to know"
            placeholderTextColor="#b3b3b3"
            onChangeText={handleadditionalInformationChange}
          />
          <Text style={[styles.error, styles.errorTypo]}>Error</Text>
        </View>
        <View style={[styles.inputField1, styles.inputPosition1]}>
          <Text style={styles.label}>How did you hear about us?</Text>
          <Text style={[styles.description, styles.errorTypo]}>Description</Text>
          <TextInput
            style={[styles.input1, styles.inputBorder]}
            placeholder="AAAAAAA"
            onChangeText={handlehowDidYouHearAboutUsChange}
          />
          <Text style={[styles.error, styles.errorTypo]}>Error</Text>
        </View>
        <View style={styles.view}>
          <Image
            style={[styles.image11Icon, styles.iconPosition]}
            contentFit="cover"
            source={require("@/assets/image9.png")}
          />
          <TextInput
            style={[styles.inputField2, styles.inputTypo]}
            placeholder="Annual Sales Volume"
            placeholderTextColor="#b3b3b3"
            onChangeText={handleAnnualSalesVolumeChange}
          />
          <Text style={styles.salesInformation}>Sales Information</Text>
        </View>
        <View style={styles.view1}>
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
          <TextInput
            style={[styles.inputField3, styles.inputPosition]}
            placeholder="VAT Number (if applicable):"
            placeholderTextColor="#b3b3b3"
            onChangeText={handleVatNumberChange}
          />
          <TextInput
            style={[styles.inputField4, styles.inputPosition]}
            placeholder="Business Registration Number (if applicable)"
            placeholderTextColor="#b3b3b3"
            onChangeText={handleBusinessRegistrationNumberChange}
          />
          <Text style={styles.businessDetails}>Business Details</Text>
          <Image
            style={[styles.image10Icon, styles.iconPosition]}
            contentFit="cover"
            source={require("@/assets/image9.png")}
          />
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
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
  },
  inputPosition: {
    width: 317,
    left: 36,
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
    position: "absolute",
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
    top: 120,
    left: 40,
    width: 316,
    position: "absolute",
  },
  inputField3: {
    top: 75,
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
    top: 0,
    textAlign: "left",
    position: "absolute",
  },
  image10Icon: {
    width: 23,
    
    height: 24,
    left: 0,
    top: -3,
    position: "absolute",
  
  },
  view1: {
    top: 95,
    left: 14,
    width: 395,
    height: 198,
    position: "absolute",
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
    height: 932,
    overflow: "hidden",
    backgroundColor: Color.backgroundDefaultDefault,
  },
});

export default CompleteTradeCustomer;