import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Border, Color, FontFamily, FontSize, Padding } from "../GlobalStyles";

const baseUrl = 'http://localhost:8080';
const RegisterPage = () => {
  const navigation = useNavigation();
  const [mail, setMail] = React.useState("");
  const [name, setName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [inviteCode, setInviteCode] = React.useState(null);

  const signUpHandler = async () => {
    // Handle sign up logic here
    if (!MailCheckForm(mail)) {
      console.log("Invalid email format");
      return;
    }
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    // Perform sign up API call
    //payload
    const payload = {
      fullName: name,
      email: mail,
      password: password,
      inviteCode: inviteCode,
    };
    try {
      const response = await axios.post(`${baseUrl}/api/auth/register`,payload);
      console.log(response.data);}
    catch (error) {
      console.error(error);
    }
   // navigation.navigate("LoginPage");
  };

  const MailCheckForm= (mail) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return emailRegex.test(mail)
  };

  const handleEmailChange = (text) => {
    setMail(text);
  };

  const handleName = (text) => {
    setName(text);
  };
  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
  };
  const handlePasswordChange = (text) => {
    setPassword(text);
  };
  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
  };
  const handleInviteCodeChange = (text) => {
    setInviteCode(text);
  };



   return (
    <View style={styles.registerpage}>
    <Pressable
      style={[styles.frame, styles.frameFlexBox]}
      onPress={() => signUpHandler()}
    >
      <Text style={[styles.signUp, styles.hereTypo]}>Sign up</Text>
    </Pressable>
    
    <View style={styles.nameParent}>
      <View style={styles.nameBorder}>
        <TextInput style={[styles.label, styles.labelTypo]} numberOfLines={1} onChangeText={handleName} placeholder="Name"/>
      </View>
      <View style={[styles.email, styles.nameBorder]}>
      <TextInput style={[styles.label, styles.labelTypo]} numberOfLines={1} placeholder="Email" onChangeText={handleEmailChange}/>
      </View>
      <View style={[styles.email, styles.nameBorder]}>
      <TextInput style={[styles.label, styles.labelTypo]} numberOfLines={1} placeholder="PHONE NUMBER" onChangeText={handlePhoneNumberChange}/>
      </View>
      <View style={[styles.email, styles.nameBorder]}>
        <TextInput style={[styles.label, styles.labelTypo]} numberOfLines={1} placeholder="PASSWORD" onChangeText={handlePasswordChange} secureTextEntry={true}/>
      </View>
      <View style={[styles.email, styles.nameBorder]}>
        <TextInput style={[styles.label, styles.labelTypo]} numberOfLines={1} placeholder="CONFIRM PASSWORD" onChangeText={handleConfirmPasswordChange} secureTextEntry={true}/>
      </View>
      <View style={[styles.email, styles.nameBorder]}>
        <TextInput style={[styles.label, styles.labelTypo]} numberOfLines={1} placeholder="Invite code (optional)" onChangeText={handleInviteCodeChange}/>
      </View>
    </View>
    <View style={[styles.secondaryButtonParent, styles.secondaryLayout]}>
      <Pressable
        style={[styles.secondaryButton, styles.secondaryLayout]}
        onPress={() => navigation.navigate("LoginPage")}
      >
        <Text style={[styles.here, styles.hereTypo]}>here</Text>
      </Pressable>
      <Text
        style={[styles.alreadyRegisteredLog, styles.createNewAccountPosition]}
      >{`Already Registered? Log in `}</Text>
      <Text
        style={[styles.createNewAccount, styles.createNewAccountPosition]}
      >{`Create new
Account`}</Text>
    </View>
  </View>
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
  height: 32,
  position: "absolute",
},
createNewAccountPosition: {
  textAlign: "center",
  color: Color.colorBlack,
  left: 0,
  position: "absolute",
},
signUp: {
  color: Color.colorWhite,
  textAlign: "left",
  lineHeight: 20,
  fontSize: FontSize.size_sm,
  fontWeight: "500",
},
frame: {
  marginLeft: -163.5,
  top: 716,
  backgroundColor: Color.colorBlack,
  width: 327,
  height: 40,
  paddingVertical: 0,
  paddingHorizontal: Padding.p_base,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  borderRadius: Border.br_5xs,
  left: "50%",
  position: "absolute",
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
  marginLeft: -164.5,
  top: 289,
  width: 330,
  justifyContent: "flex-end",
  paddingLeft: 6,
  left: "50%",
  position: "absolute",
},
here: {
  fontSize: FontSize.smallText_size,
  lineHeight: 24,
  color: "#f04949",
  textAlign: "left",
},
secondaryButton: {
  top: 0,
  left: 177,
  width: 46,
  paddingVertical: 0,
  paddingHorizontal: Padding.p_base,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  borderRadius: Border.br_5xs,
  height: 32,
  backgroundColor: Color.colorWhite,
},
alreadyRegisteredLog: {
  top: 6,
  lineHeight: 21,
  fontFamily: FontFamily.interRegular,
  fontSize: FontSize.size_sm,
},
createNewAccount: {
  top: -104,
  fontSize: 32,
  lineHeight: 48,
  fontWeight: "600",
  fontFamily: FontFamily.interSemiBold,
},
secondaryButtonParent: {
  marginLeft: -111.5,
  top: 198,
  width: 223,
  left: "50%",
},
registerpage: {
  width: 431,
  height: 932,
  overflow: "hidden",
  backgroundColor: Color.colorWhite,
},
});

export default RegisterPage;
