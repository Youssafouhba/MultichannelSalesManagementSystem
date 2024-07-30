
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View,Image, ScrollView } from "react-native";
import { authstyles } from "../GlobalStyles";
import { Border, Color, FontFamily, FontSize, Padding } from "../GlobalStyles";

const baseUrl = 'http://localhost:9000';
const MailCheckForm = (mail) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  return emailRegex.test(mail);
};

const apiHandler = async (url, payload) => {
  try {
    const response = await axios.post(`${baseUrl}${url}`, payload);
    console.log(response.data);
    return response;
  } catch (error) {
    console.log(error.response.data);
    return error.response;
  }
}

const RegisterPage = () => {
  const navigation = useNavigation();
  const [mail, setMail] = React.useState("");
  const [name, setName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [inviteCode, setInviteCode] = React.useState(null);
  const [errorMail, setErrorMail] = React.useState("");
  const [errorName, setErrorName] = React.useState("");
  const [errorPhoneNumber, setErrorPhoneNumber] = React.useState("");
  const [errorPassword, setErrorPassword] = React.useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = React.useState("");
  const [errorRegistration, setErrorRegistration] = React.useState("");

  const ref_email = React.useRef();
  const ref_phone = React.useRef();
  const ref_password = React.useRef();
  const ref_confirm_password = React.useRef();

  const signUpHandler = async () => {
    setErrorName(name === "" ? "Full Name is required" : "");
    setErrorMail(mail === "" ? "Email is required" : "");
    setErrorPhoneNumber(phoneNumber === "" ? "Phone number is required" : "");
    setErrorPassword(password === "" ? "Password is required" : "");
    setErrorConfirmPassword(confirmPassword === "" ? "Confirm password is required" : "");

    if (!MailCheckForm(mail)) {
      setErrorMail("Invalid email format");
    }
    if (password !== confirmPassword) {
      setErrorConfirmPassword("Passwords do not match");
    }

    if (
      name !== "" &&
      mail !== "" &&
      phoneNumber !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      MailCheckForm(mail) &&
      password === confirmPassword
    ) {
      const payload = {
        fullName: name,
        email: mail,
        password: password,
        phoneNumber: phoneNumber,
        inviteCode: inviteCode,
      };

      const response = await apiHandler("/api/auth/register", payload);
      if (response.data.token && response.data.message === "User registered successfully!") {
        await AsyncStorage.setItem('jwtToken', response.data.token);
        navigation.navigate("EmailVerificationPage", { mail });
      } else {
        setErrorRegistration(response.data.message);
      }
    }
  };
  return (
    <ScrollView contentContainerStyle={authstyles.contentContainerStyle}>
    <View style={[authstyles.iphone1415ProMax6, authstyles.labelFlexBox,authstyles.register]}>
      <View style={[{paddingHorizontal: Padding.p_5xl,paddingVertical: 0,alignItems: "center",}]}>
      <Image
            style={[authstyles.iphone1415ProMax6Child]}
            contentFit="cover"
            source={require("@/assets/rectangle-2.png")}
            />
        <View style={[{top: '3%'}]}>
          <Text style={[styles.createNewAccount, styles.createNewAccountPosition]}>
            Create new Account
          </Text>
        </View>
        <View style={[{top: '3%'}]}>
          <Text style={[styles.alreadyRegisteredLog]}>
            Already Registered? Log in
          </Text>
          <Pressable
            style={[styles.secondaryButton, {top: '1%'}]}
            onPress={() => navigation.navigate("LoginPage")}
          >
            <Text style={[styles.here, styles.hereTypo]}>here</Text>
          </Pressable>
          <View>
            {errorRegistration ?
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>{errorRegistration}.</Text>
              </Animatable.View>
              : null
            }
          </View>
        </View>
        <View style={[{top: '5%'}]}>
          <View style={styles.nameBorder}>
            <TextInput
              style={[styles.label, styles.labelTypo]}
              numberOfLines={1}
              returnKeyType="next"
              onSubmitEditing={() => ref_email.current.focus()}
              autoFocus={true}
              onChangeText={setName}
              placeholder="Full Name"
            />
          </View>
          {errorName ?
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{errorName}.</Text>
            </Animatable.View>
            : null
          }
          <View style={[styles.email, styles.nameBorder]}>
            <TextInput
              style={[styles.label, styles.labelTypo]}
              numberOfLines={1}
              placeholder="Email"
              returnKeyType="next"
              onSubmitEditing={() => ref_phone.current.focus()}
              ref={ref_email}
              keyboardType="email-address"
              onChangeText={setMail}
            />
          </View>
          {errorMail ?
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{errorMail}.</Text>
            </Animatable.View>
            : null
          }
          <View style={[styles.email, styles.nameBorder]}>
            <TextInput
              style={[styles.label, styles.labelTypo]}
              numberOfLines={1}
              placeholder="PHONE NUMBER"
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => ref_password.current.focus()}
              ref={ref_phone}
              onChangeText={setPhoneNumber}
            />
          </View>
          {errorPhoneNumber ?
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{errorPhoneNumber}.</Text>
            </Animatable.View>
            : null
          }
          <View style={[styles.email, styles.nameBorder]}>
            <TextInput
              style={[styles.label, styles.labelTypo]}
              numberOfLines={1}
              placeholder="PASSWORD"
              onChangeText={setPassword}
              secureTextEntry={true}
              returnKeyType="next"
              onSubmitEditing={() => ref_confirm_password.current.focus()}
              ref={ref_password}
            />
          </View>
          {errorPassword ?
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{errorPassword}.</Text>
            </Animatable.View>
            : null
          }
          <View style={[styles.email, styles.nameBorder]}>
            <TextInput
              style={[styles.label, styles.labelTypo]}
              numberOfLines={1}
              placeholder="CONFIRM PASSWORD"
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              returnKeyType="done"
              ref={ref_confirm_password}
            />
          </View>
          {errorConfirmPassword ?
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{errorConfirmPassword}.</Text>
            </Animatable.View>
            : null
          }
          <View>
            <Pressable
              style={[styles.frame, styles.frameFlexBox]}
              onPress={signUpHandler}
            >
              <Text style={[styles.signUp]}>Sign up</Text>
            </Pressable>
          </View>
        </View> 
      </View>
    </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
frameFlexBox: {
  paddingVertical: 0,
  paddingHorizontal: Padding.p_base,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  borderRadius: Border.br_5xs,
},
hereTypo: {
  fontFamily: FontFamily.smallText,
  fontWeight: "500",
  textAlign: "left",
},
labelTypo: {
  fontFamily: FontFamily.interRegular,
  fontSize: FontSize.size_sm,
},
nameBorder: {
  paddingVertical: Padding.p_5xs,
  borderWidth: 1,
  borderColor: Color.colorGainsboro_200,
  borderStyle: "solid",
  alignSelf: "stretch",
  paddingHorizontal: Padding.p_base,
  alignItems: "center",
  flexDirection: "row",
  height: 40,
  borderRadius: Border.br_5xs,
  backgroundColor: Color.colorWhite,
},
secondaryLayout: {
 // height: 32,
 top: '2%'

},
createNewAccountPosition: {
  marginBottom: "2vh",
  textAlign: "center",
  color: Color.colorBlack,
  left: 0,
},
signUp: {
  
  color: Color.colorWhite,
  textAlign: "left",
  lineHeight: 20,
  fontSize: FontSize.size_sm,
  fontWeight: "500",
},
frame: {
  marginTop : 25,
  backgroundColor: Color.colorBlack,
  width: 327,
  height: 40,
  paddingVertical: 0,
  paddingHorizontal: Padding.p_base,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  borderRadius: Border.br_5xs,
},
label: {
  flex: 1,
  color: Color.colorGray,
  textAlign: "left",
  lineHeight: 20,
  overflow: "hidden",
},
email: {
  marginTop: 25,
},
nameParent: {
 // marginLeft: -164.5,
  width: 330,
  alignItems: "center",
  paddingLeft: 6,
 // left: "50%",
},
here: {
  fontSize: FontSize.smallText_size,
  color: "#f04949",
  textAlign: "left",
},
secondaryButton: {
  top: 0,
 // left: 177,
//  width: 46,
  paddingVertical: 0,
  paddingHorizontal: Padding.p_base,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  borderRadius: Border.br_5xs,
 // height: 32,
  backgroundColor: Color.colorWhite,
},
alreadyRegisteredLog: {
 // Width: 200,
//  lineHeight: 21,
  fontFamily: FontFamily.interRegular,
  fontSize: FontSize.size_sm,
},
createNewAccount: {
  fontSize: 32,
  lineHeight: 48,
  fontWeight: "600",
  fontFamily: FontFamily.interSemiBold,
},
secondaryButtonParent: {
  marginLeft: -111.5,
  top: 198,
 // width: 223,
  left: "50%",
},
registerpage: {
  
  height: 932,
  overflow: "hidden",
  backgroundColor: Color.colorWhite,
  justifyContent:'center',
  alignItems:'center'
},
errorMsg: {
  color: '#FF0000',
  fontSize: 14,
},
});

export default RegisterPage;
