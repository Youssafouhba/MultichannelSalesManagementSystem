import { useNavigation } from '@react-navigation/core';
import axios from "axios";
import { authstyles } from '../GlobalStyles';
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View,Image } from "react-native";
import { Border, Color, FontSize, Padding } from "../GlobalStyles";
import tw from 'tailwind-react-native-classnames';
import { isValidEmail } from '@/constants/Classes';
import * as Animatable from "react-native-animatable";
import config from '@/components/config';



const ForgerPasswordPage = () => {

  const navigation = useNavigation();  
  const [error, setError] = React.useState("");
  const [mail, setMail] = React.useState("");
  

  const handleForgetPassword = async() => {
    if(isValidEmail(mail)){
        try {
          const response = await axios.post(`${config.API_BASE_URL}/api/auth-client/otp/forgot-password`,{email:mail});
          console.log(response.data)
        if (response.status === 200) {
          navigation.navigate("OtpVerification",{mail:mail});
        }    
        else{
            console.log("Invalid email format");
            setError("Invalid email format");
          } 
        } catch (error: any) {
          console.error(error.response.data.message);
          setError(error.response.data.message);
        }
    }
    else{
      console.log("Invalid email format");
      setError("Invalid email format");
    }

  };




  return (
    <View style={[authstyles.iphone1415ProMax6, authstyles.labelFlexBox]}>
      <View style={[authstyles.content, authstyles.contentPosition]}>
      <Image
        style={authstyles.iphone1415ProMax6Child}
        source={require("../assets/rectangle-2.png")}
      />
        <View style={styles.copy}>
          <Text style={styles.completeYourProfile}>Find Your Account</Text>
          <Text style={[tw`top-4`]}>
          Please enter your email address to search for your account.
          </Text>
        </View>
        { error ?
      <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={[tw`mt-8`,styles.errorMsg]}>{error}.</Text>
            </Animatable.View>
            : null
      }
        <View style={styles.inputAndButton}>
        <View style={[styles.field1, styles.field1FlexBox]}>
            <TextInput
              style={styles.label}
              numberOfLines={1}
              onChangeText={setMail}
              placeholder="Email"
            />
          </View>

          <View style={[styles.button, styles.field1FlexBox]}>
          <Pressable style={[styles.button]} onPress={handleForgetPassword}>
              <Text style={[styles.Search, styles.labelTypo]}>Submit</Text>
            </Pressable>
            
            
          </View>

          
        </View>
      </View>

      <View style={[styles.homeIndicator, styles.homePosition]}>
        <View style={[styles.homeIndicator1, styles.contentPosition]} />
        <View style={[styles.homeIndicatorChild, styles.homePosition]} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  ForgetPassword:{
    marginTop:"10%"
  },
  labelFlexBox: {
    overflow: "hidden",
    flex: 1,
  },
  contentPosition: {
    left: "50%",
    position: "absolute",
  },
  fieldBorder: {
    paddingVertical: Padding.p_5xs,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    borderStyle: "solid",
    backgroundColor: Color.colorWhite,
  },
  labelTypo: {
    textAlign: "left",
    lineHeight: 20,
    fontSize: FontSize.size_sm,
  },
  field1FlexBox: {
    marginTop: 16,
    paddingHorizontal: Padding.p_base,
    flexDirection: "row",
    height: 40,
    borderRadius: Border.br_5xs,
    alignSelf: "stretch",
    alignItems: "center",
  },
  homePosition: {
    left: 0,
    position: "absolute",
  },
  completeYourProfile: {
    fontSize: FontSize.size_lg,
    lineHeight: 27,
    fontWeight: "600",
    color: Color.colorBlack,
    textAlign: "center",
  },
  copy: {
    alignItems: "center",
    top: '3%',
  },
  label: {
    color: Color.colorGray,
    overflow: "hidden",
    flex: 1,
  },
  field: {
    paddingHorizontal: Padding.p_base,
    flexDirection: "row",
    height: 40,
    borderRadius: Border.br_5xs,
    alignSelf: "stretch",
    paddingVertical: Padding.p_5xs,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    borderStyle: "solid",
    alignItems: "center",
  },
  
  Search: {
    fontWeight: "500",
    color: Color.colorWhite,
  },
  button: {
    justifyContent: "center",
    backgroundColor: Color.colorBlack,
    paddingVertical: 0,
  },
  inputAndButton: {
    width: 327,
    marginTop: 24,
  },
  content: {
    marginTop: -129.5,
    marginLeft: -188,
    top: "50%",
    paddingHorizontal: Padding.p_5xl,
    paddingVertical: 0,
    alignItems: "center",
  },
  iphone1415ProMax6Child: {
    top: 171,
    left: 87,
    width: 256,
    height: 52,
    position: "absolute",
  },
  homeIndicatorChild: {
    top: 0,
    width: 301,
    height: 63,
  },
  homeIndicator: {
    top: 885,
    width: 430,
    height: 34,
  },
  iphone1415ProMax6: {
    width: "100%",
    height: 932,
    backgroundColor: Color.colorWhite,
    flex: 1,
  },

  homeIndicator1: {
    marginLeft: -67,
    bottom: 8,
    borderRadius: Border.br_81xl,
    width: 134,
    height: 5,
    backgroundColor: Color.colorBlack,
  },
  field1: {
    paddingVertical: Padding.p_5xs,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    borderStyle: "solid",
    backgroundColor: Color.colorWhite,
    marginTop: 16,
  },
      errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },

});

export default ForgerPasswordPage;
