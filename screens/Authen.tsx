import { Image } from "expo-image";
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Border, Color, FontFamily, FontSize, Padding,authstyles as styles } from "@/GlobalStyles";
import { API_BASE_URL } from "@/constants/GlobalsVeriables";

export default function Authen() {
    const [fullName, setFullName] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState();
    const [address, setAddress] = React.useState("");
    const [password, setPassword] = React.useState(""); // Enforce empty string for password
    const [inviteCode, setInviteCode]= React.useState("");
  

    const handleDataRegister = async () => {
  
      console.log(mail);
      console.log(fullName);
      console.log(phoneNumber);
      console.log(address);
      console.log(password);
    };

    const handlePhoneNumberChange = (text: any) => {
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
            <Image
            style={styles.iphone1415ProMax6Child}
            contentFit="cover"
            source={require("@/assets/rectangle-2.png")}
            />
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

        <View style={[styles.homeIndicator, styles.homePosition]}>
          <View style={[styles.homeIndicator1, styles.contentPosition]} />
          <View style={[styles.homeIndicatorChild, styles.homePosition]} />
        </View>
      </View>
    );
};


