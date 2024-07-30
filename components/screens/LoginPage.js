import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import axios from "axios";
import { Image } from "expo-image";
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { Border, Color, FontFamily, FontSize, Padding } from "../GlobalStyles";

const baseUrl = 'http://localhost:9000';

const LoginPage = () => {
  const navigation = useNavigation();
  const [errorAuth, setErrorAuth] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mail, setMail] = React.useState("");
   React.useEffect(() => {
      const checkToken = async () => {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          navigation.navigate('LoginPage');
          return;
        }
        else{
          navigation.navigate('ChatPage');
        }
      };
  
      checkToken();
    }, []);


  const MailCheckForm = (mail) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return emailRegex.test(mail);
  };

  const handleForgetPassword = () => {
    navigation.navigate('ForgetPasswordPage');
  };

  const handleDataRegister = async () => {
    if (!MailCheckForm(mail)) {
      setErrorAuth("Invalid email format");
      return;
    }
   
    const payload = {
      email: mail,
      password: password,
    };

    try {
      const response = await axios.post(`${baseUrl}/api/auth/singin`, payload);

      console.log(response);
      if (response.status === 200) {
        await AsyncStorage.setItem('jwtToken', response.data.token);
        console.log(response.data.token);
        navigation.navigate('ChatPage'); // Change 'NextPage' to your next page
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorAuth(error.response.data.message);
      } else {
        setErrorAuth("An error occurred. Please try again.");
      }
    }
  };


  return (
    <View style={[styles.iphone1415ProMax6, styles.labelFlexBox]}>
      <View style={[styles.content, styles.contentPosition]}>
        <View style={styles.copy}>
          <Text style={styles.completeYourProfile}>Login</Text>
        </View>
        <View style={styles.inputAndButton}>
        <View style={[styles.field1, styles.field1FlexBox]}>
            <TextInput
              style={styles.label}
              numberOfLines={1}
              onChangeText={setMail}
              placeholder="Email"
            />
          </View>
          <View style={[styles.field1, styles.field1FlexBox]}>
            <TextInput
              style={styles.label}
              numberOfLines={1}
              secureTextEntry={true}
              onChangeText={setPassword}
              placeholder="Password"
            />
          </View>
          { errorAuth ?
      <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{errorAuth}.</Text>
            </Animatable.View>
            : null
      }
          <View style={[styles.button, styles.field1FlexBox]}>
            <Pressable style={[styles.button, styles.buttonFlexBox]} onPress={handleDataRegister}>
              <Text style={[styles.confirme, styles.labelTypo]}>Sing in</Text>
            </Pressable>
          </View>

          <View style={[styles.ForgetPassword]}>
            <Pressable   onPress={handleForgetPassword} >
            <Text>Forgotten password?</Text>

            </Pressable>
          </View>
        </View>
      </View>
      <Image
        style={styles.iphone1415ProMax6Child}
        contentFit="cover"
        source={require("../assets/rectangle-2.png")}
      />
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
    fontFamily: FontFamily.interSemiBold,
    color: Color.colorBlack,
    textAlign: "center",
  },
  copy: {
    alignItems: "center",
  },
  label: {
    fontFamily: FontFamily.interRegular,
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
  
  confirme: {
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
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

export default LoginPage;
