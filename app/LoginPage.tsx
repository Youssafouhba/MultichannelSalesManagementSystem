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
  SafeAreaView
} from "react-native";
import {useNavigation} from 'expo-router';
import { useAppContext } from '@/components/AppContext';
import { Color, FontSize, Padding, Border } from "../GlobalStyles";
import { isValidEmail } from "@/constants/Classes";
import axios from "axios";
import config from "@/components/config";
import { ProductInfos, UserInfos } from "@/constants/Classes";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "@/components/CustomAlert";
import { useUser } from "@/contex/UserContext";
interface RouteParams {
  payload: ProductInfos; // Replace 'any' with the actual type of payload
}

const LoginPage = () => {
  const navigation = useNavigation<any>();
  const { login } = useUser();
  const {appstate,setPreviouspage} = useAppContext(); 
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const route = useRoute()
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const goTo = () => {
    const payload = {
      ...(route.params as RouteParams)?.payload,
    };
    
    setPreviouspage("index")
    
    if(appstate.previouspage=="ProductDetails"){
      navigation.navigate(appstate.previouspage,{payload})
    }else{
      navigation.navigate(appstate.previouspage)
    }
  }


  const handleForgetPassword = () => {
    setPreviouspage("LoginPage");
    navigation.navigate('ForgetPasswordPage');
  };


  const handleLogin = async () => {
    if (!isValidEmail(email)||password=="") {
      setErrorMessage("Please fill all Fields !");
      setErrorVisible(true);
      return;
    }

    try {
      const payload = { email, password };
      const response = await axios.post<UserInfos>(`${config.API_BASE_URL}/api/auth/singin`, payload);
      if (response.data) {
        login(response.data);
        goTo();
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
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
  const focusNextField = (nextField: any) => {
    nextField.current.focus();
  };
  const handleSubmitEditing = (field: string) => {
    if (field === 'email') {
      focusNextField(passwordRef);
    } else if (field === 'password') {
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
          <CustomAlert 
            visible={errorVisible} 
            onDismiss={()=>{setErrorVisible(false)}} 
            duration={2000}
            title={"Login Error"} 
            message={errorMessage} 
            type="error"
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
               <View style={styles.passwordContainer}>
                  <TextInput
                    ref={passwordRef}
                    style={styles.passwordInput}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={() => handleSubmitEditing('password')}
                  />
                  <Pressable onPress={togglePasswordVisibility} style={styles.showPasswordButton}>
                    <Text style={styles.showPasswordButtonText}>
                      {showPassword ? <Ionicons name='eye-off-outline' size={18} /> : <Ionicons name='eye-outline' size={18} />}
                    </Text>
                  </Pressable>
                </View>
                <Pressable style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Sign in</Text>
                </Pressable>
                <View style={styles.forgetPasswordContainer}>
                  <Pressable onPress={handleForgetPassword}>
                    <Text>Forgotten password?</Text>
                  </Pressable>
                  <Pressable onPress={() =>{setPreviouspage("LoginPage"),navigation.navigate('RegisterPage')}}>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    height: 40,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    borderRadius: Border.br_5xs,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: Padding.p_base,
  },
  showPasswordButton: {
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
  },
  showPasswordButtonText: {
    color: Color.colorBlack,
    fontSize: FontSize.size_sm,
  },
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
    fontWeight: "500",
    color: 'orangered',
  },
});

export default LoginPage;