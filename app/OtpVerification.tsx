import { useNavigation, useRoute } from "@react-navigation/native";

import { Image } from "expo-image";
import * as React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Border, Color, FontFamily, FontSize, Padding } from "../GlobalStyles";
import * as Animatable from "react-native-animatable";
import { authstyles } from "../GlobalStyles";
import { useAppContext } from "@/components/AppContext";
import axios from "axios";
import { router } from "expo-router";
import tw from "tailwind-react-native-classnames";



const OtpVerification = () => {
  const { state, dispatch } = useAppContext();
  const route = useRoute();
  const navigation = useNavigation();
  const email = route.params?.mail || null;
  const [apiResponse, setApiResponse] = React.useState(null);
  const [errorOtp, setErrorOtp] = React.useState("");
  const [otp, setOtp] = React.useState("");
  var token = state.JWT_TOKEN
  const handleOtp = (otp) => {
      setOtp(otp);
  }

  const apiHandler = async (url, payload) => {
  
    try {
      const response = await axios.post(`${state.API_BASE_URL}${url}`, payload);
      console.log(response.data);
      return response;
    } catch (error) {
      console.log(error.response.data);
      return error.response;
    }
  }
  
 
  const ConfirmationHandler = async () => {
   
      const payload = {
        email: email,
        otp: otp
      };
      console.log(payload);
      const response2 = await apiHandler("/api/auth-client/otp/verify-password-otp", payload);
      if (response2.data.message == "Password Otp is valid") {
        dispatch({ type: 'SET_JWT_TOKEN', payload: response2.data.token });
        router.navigate(`PasswordResetPage?mail=${email}&&otp=${otp}`);  
      } else {
        setErrorOtp(response2.data.message);
      }
   
  }
  
       

    
  return (
    <View style={[authstyles.iphone1415ProMax6, authstyles.labelFlexBox]}>
    <View style={[authstyles.content, authstyles.contentPosition]}>
      <Image
          style={authstyles.iphone1415ProMax6Child}
          contentFit="cover"
          source={require("../assets/rectangle-2.png")}
        />
      <SafeAreaView style={[tw`justify-center items-center`]}>
        <Text style={[styles.email]} numberOfLines={1}>
          Email verification
        </Text>
      </SafeAreaView>
      <SafeAreaView style={styles.frame1}>
        <View style={[tw`flex-row justify-between items-center`,styles.emailEdit]}>
          <View>
            <Text
              style={[styles.emailInput]}
            >{email?email:null}</Text>
          </View>
          <View>
          <Button style={styles.edit} mode="text" labelStyle={styles.editBtn} onPress={() => navigation.goBack()}>
                Edit
              </Button>
          </View>
          
        </View>
      </SafeAreaView>
      <View style={[tw`flex-col justify-center`,styles.frame]}>
        <View style={[styles.name, styles.nameFlexBox]}>
          <TextInput style={styles.label} numberOfLines={1}  value={otp} onChangeText={handleOtp} placeholder="Enter OTP (6-digit)" >
           
          </TextInput>
        </View>
        <View style={[tw`mt-4`]}>
            { errorOtp ?
          <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>{errorOtp}.</Text>
                </Animatable.View>
                : null
          }
        </View>
      </View>
      
    
      <Button
        style={[styles.button, styles.nameFlexBox]}
        mode="contained"
        labelStyle={styles.buttonBtn}
        onPress={() => ConfirmationHandler()}
        contentStyle={styles.buttonBtn1}
      >
        Submit
      </Button>
    </View>
    </View>

  );
};

const styles = StyleSheet.create({
  buttonBtn: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Roboto-Medium",

  },
  buttonBtn1: {
    backgroundColor: "#000",

    borderRadius: 100,
    height: 40,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    color: "rgba(68, 0, 255, 0.84)",
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  nameFlexBox: {
    alignItems: "center",
  },
  emailPosition: {
    color: Color.graysBlack,
    textAlign: "left",
    top: 0,
    //position: "absolute",
  },
  frame3Position: {

    position: "absolute",
  },
  button: {
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  label: {
    color: Color.colorGray,
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
    lineHeight: 20,
    fontSize: FontSize.size_sm,
    overflow: "hidden",
  },
  name: {
    //marginLeft: -171,
    //left: "50%",
    borderRadius: Border.br_5xs,
    borderStyle: "solid",
    borderColor: Color.colorGainsboro_200,
    borderWidth: 1,
    width: '100%',
    flexDirection: "row",
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_5xs,
    top: 0,
    height: 40,
    backgroundColor: Color.schemesOnPrimary,
  },
  frame: {
    //top: 404,
    //left: 44,
    width: '100%',
    marginVertical: 16,
    
    //height: 40,
    //position: "absolute",
    overflow: "hidden",
  },
  edit: {
    //left: 283,
    top: 0,
    //position: "absolute",
  },
  emailInput: {
    left: 0,
    fontFamily: FontFamily.interRegular,
    lineHeight: 20,
    fontSize: FontSize.size_sm,
    color: Color.graysBlack,
  },
  emailEdit: {
   
    width: '100%',
    //height: 20,
    left: 0,
    top: 0,
    //position: "absolute",
  },
  frame1: {
    width: '100%',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    //position: "absolute",
    overflow: "hidden",
  },
  email: {
    fontSize: 25,
    lineHeight: 35,
    fontWeight: "600",
    fontFamily: FontFamily.interSemiBold,
    height: 40,
    overflow: "hidden",
  },
  frame2: {
    top: 302,
    left: 67,
    width: 296,
    height: 40,
    position: "absolute",
    overflow: "hidden",
  },
  image3Icon: {
    width: 118,
    top: 0,
  },
  frame3: {
    top: '20%',
    justifyContent: 'center',
    width: '100%',
    overflow: "hidden",
  },
  emailverification: {
    //flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 1)",
    justifyContent:"center",
    alignItems:"center",
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
});

export default OtpVerification;
