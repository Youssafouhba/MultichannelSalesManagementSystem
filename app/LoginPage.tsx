import React, { useRef, useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Image, 
  Pressable, 
  StyleSheet, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform, 
  Keyboard,
  Dimensions,
  SafeAreaView
} from "react-native";
import { router, useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { useAppContext } from '@/components/AppContext';
import { Color, FontSize, Padding, Border } from "../GlobalStyles";
import { useAppData } from "@/components/AppDataProvider";
import LoginError from "@/components/LoginError";
import axios from "axios";
import config from "@/components/config";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoginPage = () => {
  const { id, idp } = useLocalSearchParams();
  const { login, userInfos, cartElements, token } = useAppData();
  const { returnTo, productId } = useLocalSearchParams();
  const navigation = useRouter();
  const { state, dispatch } = useAppContext();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const pathname = usePathname();
  
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
      targetRoute = `/ProductDetails?id=${productId}&&pres=LoginPage`;
    } else if (idp) {
      console.log(idp)
      targetRoute = `/${id}?p=${idp}&&pres=LoginPage`;
    }else if(id){
      console.log(id)
      targetRoute = `/${id}?pres=LoginPage`;
    }

    // Check if the target route is different from the current route
    if (targetRoute !== pathname) {
      
      if (targetRoute.startsWith('/')) {
        router.push(targetRoute);
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
      const payload = { email, password };
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/singin`, payload);
      const { message, token } = response.data;
      await login(token);
      if (token) {
        dispatch({ type: 'SET_JWT_TOKEN', payload: token });
        navigateAfterLogin();
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      
      if (error.response) {
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response received from server';
      } else {
        errorMessage = error.message;
      }
      setErrorMessage(errorMessage);
      setErrorVisible(true);
    }
  };
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const focusNextField = (nextField) => {
    nextField.current.focus();
  };

  const handleSubmitEditing = (field) => {
    if (field === 'email') {
      focusNextField(passwordRef);
    } else if (field === 'password') {
      Keyboard.dismiss();
      handleLogin();
    }
  };
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentWrapper}>
            <LoginError 
              visible={errorVisible}
              title="Login Error"
              message={errorMessage}
              onDismiss={() => setErrorVisible(false)}
              duration={3000}
              iconName="alert-circle"
              iconColor="#f44336"
            />
            <View style={styles.content}>
              <Image
                style={styles.logoImage}
                source={require("@/assets/rectangle-2.png")}
              />
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Login</Text>
              </View>
              <View style={styles.inputAndButton}>
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  onChangeText={setEmail}
                  value={email}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => handleSubmitEditing('email')}
                  blurOnSubmit={false}
                />
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  onChangeText={setPassword}
                  value={password}
                  placeholder="Password"
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={() => handleSubmitEditing('password')}
                />
                <Pressable style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Sign in</Text>
                </Pressable>
                <View style={styles.forgetPasswordContainer}>
                  <Pressable onPress={handleForgetPassword}>
                    <Text>Forgotten password?</Text>
                  </Pressable>
                  <Pressable onPress={() => navigation.push('/RegisterPage')}>
                    <Text style={styles.registerText}>Register</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  logoImage: {
    resizeMode: 'contain',
    marginBottom: 20,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: FontSize.size_lg,
    lineHeight: 27,
    fontWeight: "600",
    color: Color.colorBlack,
    textAlign: "center",
  },
  inputAndButton: {
    width: '100%',
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Border.br_5xs,
    marginTop: 16,
  },
  buttonText: {
    color: Color.colorWhite,
    fontSize: FontSize.size_sm,
    fontWeight: "500",
  },
  forgetPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  registerText: {
    fontSize: FontSize.size_base,
    fontWeight: "500",
    color: 'orangered',
  },
});

export default LoginPage;