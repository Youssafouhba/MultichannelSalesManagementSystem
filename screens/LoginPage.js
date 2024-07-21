import { Image } from "expo-image";
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Border, Color, FontFamily, FontSize, Padding } from "../GlobalStyles";

const IPhone1415ProMax2 = () => {
  const [fullName, setFullName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [address, setAddress] = React.useState("");
  const [password, setPassword] = React.useState(""); // Enforce empty string for password
  const [inviteCode, setInviteCode]= React.useState("");

  const baseUrl = 'https://localhost:8081';
  const handleDataRegister = async () => {

    console.log(mail);
    console.log(fullName);
    console.log(phoneNumber);
    console.log(address);
    console.log(password);




    // Implement secure password storage and hashing here (e.g., react-native-keychain)

    // Example (replace with actual implementation):
    // const hashedPassword = await hashPassword(password);
    // store the hashedPassword securely
  };

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);

    // Validate UK phone number format using regex
    const ukPhoneRegex = /^(\+44\s?|0)?(7\d{3}|\d{2}\s?\d{4})?\s?\d{3}\s?\d{3}$/;
    if (!ukPhoneRegex.test(text)) {
      // Display an error message or highlight the field for invalid format
      console.error("Invalid UK phone number format");
    }
  };

  return (
    <View style={[styles.iphone1415ProMax6, styles.labelFlexBox]}>
      <View style={[styles.content, styles.contentPosition]}>
        <View style={styles.copy}>
          <Text style={styles.completeYourProfile}>Complete Your Profile</Text>
        </View>
        <View style={styles.inputAndButton}>
          <View style={[styles.field, styles.fieldBorder]}>
            <TextInput
              style={styles.label}
              numberOfLines={1}
              onChangeText={setFullName}
              placeholder="Full Name"
            />
          </View>
          <View style={[styles.field1, styles.field1FlexBox]}>
            <TextInput
              style={styles.label}
              numberOfLines={1}
              onChangeText={handlePhoneNumberChange}
              placeholder="Phone Number"
              keyboardType="phone-pad" // Enable phone number keyboard
            />
          </View>
          <View style={[styles.field1, styles.field1FlexBox]}>
            <TextInput
              style={styles.label}
              numberOfLines={1}
              onChangeText={setAddress}
              placeholder="Adress"
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
          <View style={[styles.field1, styles.field1FlexBox]}>
            <TextInput
              style={styles.label}
              numberOfLines={1}
              secureTextEntry={true}
              onChangeText={setInviteCode}
              placeholder="Invite Code (Optional)"
            />
          </View>
          <View style={[styles.button, styles.field1FlexBox]}>
            <Pressable style={[styles.button, styles.buttonFlexBox]} onPress={handleDataRegister}>
              <Text style={[styles.confirme, styles.labelTypo]}>Confirme</Text>
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
  field1: {
    paddingVertical: Padding.p_5xs,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    borderStyle: "solid",
    backgroundColor: Color.colorWhite,
    marginTop: 16,
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
  homeIndicator1: {
    marginLeft: -67,
    bottom: 8,
    borderRadius: Border.br_81xl,
    width: 134,
    height: 5,
    backgroundColor: Color.colorBlack,
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
});

export default IPhone1415ProMax2;
