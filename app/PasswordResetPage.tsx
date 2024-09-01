import axios from "axios";
import * as React from "react";
import { Pressable,Image, StyleSheet, Text, TextInput, View } from "react-native";
import { Border, Color, FontFamily, FontSize, Padding } from "../GlobalStyles";
import { authstyles } from '../GlobalStyles';
import * as Animatable from "react-native-animatable";
import { useAppContext } from '@/components/AppContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppData } from '@/components/AppDataProvider';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "@/contex/UserContext";
import config from "@/components/config";

const PasswordResetPage = () => {
  const { state } = useUser();
  const { loginn } = useAppData();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm,setshowPasswordConfirm] = React.useState<boolean>(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordConfirmVisibility = () => {
    setshowPasswordConfirm(!showPasswordConfirm);
  };
  const ref_password = React.useRef<TextInput>(null);
  const ref_confirm_password = React.useRef<TextInput>(null);
  const {mail,otp,token} = useLocalSearchParams()
  const [error, setError] = React.useState("");
  

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [errorPassword, setErrorPassword] = React.useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = React.useState("");

 
  const handleConfirmationPassword = async () => {

    if(password==""){
        setErrorPassword("Password is required")
      }
      if(confirmPassword==""){
        setErrorConfirmPassword("Confirm password is required")
      }
      if(password!=confirmPassword){
        setError("Passwords do not match."); // Set the error message
      } else {
        setError(""); // Clear the error if they match
        const payload = {
          email: mail,
          password: password,
          otp:otp,
        };
        try {
          const response = await axios.post(`${config.API_BASE_URL}/api/auth-client/otp/reset-password`,payload, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log(response.status)
          if(response.status==200){
            loginn(state.JWT_TOKEN);
            router.push("/LoginPage" as never);
          }
        }
        catch(error){}
      }
  };


  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };
  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
  };


  return (
    <View style={[authstyles.iphone1415ProMax6, authstyles.labelFlexBox]}>
      <View style={[styles.content, styles.contentPosition]}>
        <Image
          style={authstyles.iphone1415ProMax6Child}
          source={require("../assets/rectangle-2.png")}
        />
        <View style={styles.copy}>
          <Text style={styles.completeYourProfile}>Change your password</Text>
        </View>
        { error ?
      <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{error}.</Text>
            </Animatable.View>
            : null
      }
      <View style={styles.inputAndButton}>
        <View style={[styles.email,styles.passwordContainer]}>
          <TextInput
            style={[styles.label, styles.labelTypo]}
            numberOfLines={1}
            placeholder="PASSWORD" 
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
            returnKeyType="next"
            onSubmitEditing={() => ref_confirm_password.current?.focus()}
            ref={ref_password}
          />
          <Pressable onPress={togglePasswordVisibility} style={styles.showPasswordButton}>
            <Text style={styles.showPasswordButtonText}>
              {showPassword ? <Ionicons name='eye-off-outline' size={20} /> : <Ionicons name='eye-outline' size={20} />}
            </Text>
          </Pressable>
        </View>
      { errorPassword ?
      <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{errorPassword}.</Text>
            </Animatable.View>
            : null
      }


      <View style={[styles.email,styles.passwordContainer]}>
        <TextInput 
          style={[styles.label, styles.labelTypo]} 
          numberOfLines={1} placeholder="CONFIRM PASSWORD" 
          onChangeText={handleConfirmPasswordChange}
          secureTextEntry={!showPasswordConfirm}
          returnKeyType="done"
          ref={ref_confirm_password}
        />
        <Pressable onPress={togglePasswordConfirmVisibility} style={styles.showPasswordButton}>
          <Text style={styles.showPasswordButtonText}>
            {showPasswordConfirm ? <Ionicons name='eye-off-outline' size={18} /> : <Ionicons name='eye-outline' size={18} />}
          </Text>
        </Pressable>
      </View>
      { errorConfirmPassword ?
      <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{errorConfirmPassword}.</Text>
            </Animatable.View>
            : null
      }


          <View style={[styles.button, styles.field1FlexBox]}>
          <Pressable style={[styles.button]} onPress={handleConfirmationPassword}>
              <Text style={[styles.Search, styles.labelTypo]}>Confirm</Text>
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
  email: {
    fontSize: 25,
    lineHeight: 35,
    fontWeight: "600",
    height: 40,
    overflow: "hidden",
  },
  passwordContainer: {
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    height: 40,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    borderRadius: Border.br_5xs,
  },
  showPasswordButton: {
    height: '100%',
    justifyContent: 'center',
  },
  showPasswordButtonText: {
    color: Color.colorBlack,
    fontSize: FontSize.size_sm,
  },
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

export default PasswordResetPage;
