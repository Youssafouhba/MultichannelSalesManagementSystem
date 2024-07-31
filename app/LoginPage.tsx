import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from "react-native-animatable";
import tw from 'tailwind-react-native-classnames';
import { useAppContext } from '@/components/AppContext';
import { authstyles } from '../GlobalStyles';
import { Color, FontSize, Padding, Border } from "../GlobalStyles";
import { Product } from "@/constants/Classes";

const LoginPage = () => {
  const { id ,idp} = useLocalSearchParams();
  const { returnTo, productId } = useLocalSearchParams();
  const navigation = useRouter();
  const { state, dispatch } = useAppContext();
  const [errorAuth, setErrorAuth] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  var cartitems = []
  const token = state.JWT_TOKEN;


  const apiHandler = async (url,token) => {
    try {
      const response = await axios.get(`${state.API_BASE_URL}${url}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      
    };
    checkToken();
  }, [navigation]);

  const isValidEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    return emailRegex.test(email);
  };

  const handleForgetPassword = () => {
    navigation.push('/ForgetPasswordPage');
  };

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setErrorAuth("Invalid email format");
      return;
    }

    const payload = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`${state.API_BASE_URL}/api/auth/singin`,payload);

      if (response.status === 200) {
        dispatch({ type: 'SET_JWT_TOKEN', payload: response.data.token });
        await AsyncStorage.setItem('jwtToken', response.data.token);
        const cart = await apiHandler('/api/client/getMyCart',response.data.token)
        console.log(idp)
        if(cart.cart!=undefined){
           cartitems = cart.data.cartElements
          cartitems.map((item: {product: Product,quantity: number})=>{
          const pro = item.product
          const quantity = item.quantity
          dispatch({ type: 'ADD_TO_CART', payload: { ...pro, quantity } });
          })
        }
        if (returnTo === 'ProductDetails' && productId) {
          router.push(`/ProductDetails?id=${productId}`);
        }else{
          id?navigation.navigate(`/${id}?p=${idp}`):navigation.navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
      setErrorAuth(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <View style={[authstyles.iphone1415ProMax6, authstyles.labelFlexBox]}>
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
          {errorAuth && (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{errorAuth}</Text>
            </Animatable.View>
          )}
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