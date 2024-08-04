import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'tailwind-react-native-classnames';
import { useAppContext } from '@/components/AppContext';
import { authstyles } from '../GlobalStyles';
import { Color, FontSize, Padding, Border } from "../GlobalStyles";
import { Product } from "@/constants/Classes";
import { useAppData } from "@/components/AppDataProvider";
import LoginError from "@/components/LoginError";
import axios from "axios";
import config from "@/components/config";

const LoginPage = () => {
  const { id, idp } = useLocalSearchParams();
  const { login, fetchdt, cartElements, token } = useAppData();
  const { returnTo, productId } = useLocalSearchParams();
  const navigation = useRouter();
  const { state, dispatch } = useAppContext();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    return emailRegex.test(email);
  };

  const handleForgetPassword = () => {
    navigation.push('/ForgetPasswordPage');
  };

  const navigateAfterLogin = () => {
    let targetRoute = "/";
    if (returnTo === 'ProductDetails' && productId) {
      targetRoute = `/ProductDetails?id=${productId}`;
    } else if (id) {
      targetRoute = `/${id}?p=${idp}`;
    }

    // Check if the target route is different from the current route
    if (targetRoute !== navigation.pathname) {
      if (targetRoute.startsWith('/')) {
        router.push(targetRoute);
      } else {
        navigation.navigate(targetRoute);
      }
    } else {
      // If it's the same route, you might want to refresh the page or show a message
      console.log("Already on the target page");
    }
  };


  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setErrorMessage("Invalid email format");
      setErrorVisible(true);
      return;
    }

    try {
      console.log(email + "----" + password)
      const payload = { email, password };
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/singin`, payload);
      const { message, token } = response.data;
      await login(token);
      if (token) {
        await login(token);
        dispatch({ type: 'SET_JWT_TOKEN', payload: token });
        await AsyncStorage.setItem('jwtToken', token);
        
        cartElements?.forEach((item) => {
          const { product, quantity } = item;
          dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
        });
        
        navigateAfterLogin();
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from server';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }
      
      setErrorMessage(errorMessage);
      setErrorVisible(true);
      //console.error('Login error:', errorMessage);
    }
  };

  return (
    <View style={[authstyles.iphone1415ProMax6, authstyles.labelFlexBox]}>
      <LoginError 
        visible={errorVisible}
        title="Login Error"
        message={errorMessage}
        onDismiss={() => setErrorVisible(false)}
        duration={3000}
        iconName="alert-circle"
        iconColor="#f44336"
      />
      <View style={authstyles.content}>
        <Image
          style={authstyles.iphone1415ProMax6Child}
          contentFit="cover"
          source={require("@/assets/rectangle-2.png")}
        />
        <View style={styles.copy}>
          <Text style={styles.title}>Login</Text>
        </View>
        <View style={styles.inputAndButton}>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry
          />
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign in</Text>
          </Pressable>
          <View style={[styles.forgetPasswordContainer, tw`flex-row justify-between`]}>
            <Pressable onPress={handleForgetPassword}>
              <Text>Forgotten password?</Text>
            </Pressable>
            <Pressable onPress={() => navigation.push('/RegisterPage')}>
              <Text style={[tw`text-base font-medium`, { color: 'orangered' }]}>Register</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: FontSize.size_lg,
    lineHeight: 27,
    fontWeight: "600",
    color: Color.colorBlack,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    borderRadius: Border.br_5xs,
    paddingHorizontal: Padding.p_base,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Color.colorBlack,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_5xs,
    marginTop: 16,
  },
  buttonText: {
    color: Color.colorWhite,
    fontSize: FontSize.size_sm,
    fontWeight: "500",
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
    marginBottom: 16,
  },
  forgetPasswordContainer: {
    marginTop: "10%",
  },
  copy: {
    alignItems: "center",
    marginBottom: 24,
  },
  inputAndButton: {
    width: 327,
  },
});

export default LoginPage;