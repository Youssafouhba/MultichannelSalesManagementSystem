import { useNavigation } from '@react-navigation/core';
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Border, Color, FontFamily, FontSize, Padding } from "../GlobalStyles";
import { authstyles } from '../GlobalStyles';
import * as Animatable from "react-native-animatable";
import { useAppContext } from '@/components/AppContext';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';



const PasswordResetPage = () => {
  const { state, dispatch } = useAppContext();
  const route = useRoute();
  const navigation = useNavigation();
  const ref_confirm_password = React.useRef();
  var token = state.JWT_TOKEN

  const confirmPasswordRef = React.useRef();

  const email = route.params?.mail || null;
  const otp = route.params?.otp || null;

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [errorPassword, setErrorPassword] = React.useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = React.useState("");

  const handleConfirmationPassword = async () => {
    if (!password) {
      setErrorPassword("Password is required");
      return;
    }
    if (!confirmPassword) {
      setErrorConfirmPassword("Confirm password is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
        try {
          const response = await axios.post(`${state.API_BASE_URL}/api/auth-client/otp/reset-password`, {
            email,
            password,
            otp,
          });
          if(response.status==200){
            console.log(response.data)
          }
        }
        catch(error){}
      };

  const handleDataRegister = async () => {

    if (!MailCheckForm(mail)) {
      console.log("Invalid email format");
      return;
    }
    const payload = {
      email: mail,
      password: password,
    };
    try {
      const response = await axios.post(`${baseUrl}/api/auth/singin`,payload);

      if (response.status === 200) {
        await AsyncStorage.setItem('jwtToken', response.data.token);}
    }


    catch (error) {
      console.error(error);
      // setError();
    }

    console.log(AsyncStorage.getItem('jwtToken'));

  };

  


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Change your password</Text>

        {error && (
          <Animatable.Text animation="fadeInLeft" duration={500} style={styles.errorText}>
            {error}
          </Animatable.Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="PASSWORD"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current.focus()}
          />
          {errorPassword && (
            <Animatable.Text animation="fadeInLeft" duration={500} style={styles.errorText}>
              {errorPassword}
            </Animatable.Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={confirmPasswordRef}
            style={styles.input}
            placeholder="CONFIRM PASSWORD"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            returnKeyType="done"
          />
          {errorConfirmPassword && (
            <Animatable.Text animation="fadeInLeft" duration={500} style={styles.errorText}>
              {errorConfirmPassword}
            </Animatable.Text>
          )}
        </View>

        <Pressable style={styles.button} onPress={()=>handleConfirmationPassword()}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </Pressable>
      </View>
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
};



const COLORS = {
  white: "#FFFFFF",
  black: "#000000",
  gray: "#808080",
  gainsboro: "#DCDCDC",
  error: "#FF0000",
};

const SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
};

const FONTS = {
  regular: "InterRegular",
  medium: "InterMedium",
  semiBold: "InterSemiBold",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.semiBold,
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: Color.colorBlack,
    borderRadius: 4,
    paddingHorizontal: 16,
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.gray,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.xs,
    marginTop: 4,
  },
  button: {
    backgroundColor: COLORS.black,
    height: 40,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
  },
  homeIndicator: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    width: 134,
    height: 5,
    backgroundColor: COLORS.black,
    borderRadius: 100,
    marginLeft: -67,
  },
});

export default PasswordResetPage;
