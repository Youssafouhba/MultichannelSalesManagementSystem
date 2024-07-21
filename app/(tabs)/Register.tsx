import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { 
  Pressable, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData 
} from "react-native";
import { cardstyles, Border, Color, FontFamily, FontSize, Padding, registerstyles as styles } from "@/GlobalStyles";
import { API_BASE_URL } from "@/constants/GlobalsVeriables";
import { useFonts } from "expo-font";
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import axios from "axios";
import tw from "tailwind-react-native-classnames";

type InputRef = React.RefObject<TextInput>;

const Register: React.FC = () => {
  const [loaded, error] = useFonts({
    'KleeOne-Regular': require('@/assets/fonts/KleeOne-Regular.ttf'),
    'kavoonRegular': require('@/assets/fonts/Kavoon-Regular.ttf'),
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
    'VampiroOne-Regular': require('@/assets/fonts/VampiroOne-Regular.ttf'),
    'GermaniaOne-Regular': require('@/assets/fonts/GermaniaOne-Regular.ttf'),
    'Langar-Regular': require('@/assets/fonts/Langar-Regular.ttf'),
    'KiteOne-Regular': require('@/assets/fonts/KiteOne-Regular.ttf'),
  });

  const navigation = useNavigation();
  const [mail, setMail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const inviteCodeRef = useRef<TextInput>(null);

  const signUpHandler = async (): Promise<void> => {
    if (!MailCheckForm(mail)) {
      console.log("Invalid email format");
      return;
    }
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    const payload = {
      fullName: name,
      email: mail,
      password: password,
      inviteCode: inviteCode,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, payload);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const MailCheckForm = (mail: string): boolean => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return emailRegex.test(mail);
  };

  const handleEmailChange = (text: string): void => setMail(text);
  const handleName = (text: string): void => setName(text);
  const handlePhoneNumberChange = (text: string): void => setPhoneNumber(text);
  const handlePasswordChange = (text: string): void => setPassword(text);
  const handleConfirmPasswordChange = (text: string): void => setConfirmPassword(text);
  const handleInviteCodeChange = (text: string): void => setInviteCode(text);

  const focusNextInput = (nextInput: InputRef): void => {
    nextInput.current?.focus();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[{marginHorizontal: 12, flex: 1 }]}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[tw`top-7 flex-col justify-between`, { width: '100%' }]}>
          <Image
            style={[cardstyles.cartChild1]}
            contentFit="cover"
            source={require("@/assets/rectangle-111.png")}
          />
          <TouchableOpacity style={[tw``]} onPress={() => navigation.goBack()}>
            <TabBarIcon name="arrow-back" color="black" />
          </TouchableOpacity>
        </View>
        <View style={[tw`mt-40`, { width: '80%' }]}>
          <Text style={[styles.createNewAccount, styles.createNewAccountPosition]}>
            Create new Account
          </Text>
        </View>
        <View style={styles.nameParent}>
          <View style={styles.nameBorder}>
            <TextInput
              ref={nameRef}
              style={[styles.label, styles.labelTypo]}
              onChangeText={handleName}
              placeholder="Name"
              returnKeyType="next"
              onSubmitEditing={() => focusNextInput(emailRef)}
            />
          </View>
          <View style={[styles.email, styles.nameBorder]}>
            <TextInput
              ref={emailRef}
              style={[styles.label, styles.labelTypo]}
              placeholder="Email"
              onChangeText={handleEmailChange}
              returnKeyType="next"
              onSubmitEditing={() => focusNextInput(phoneRef)}
            />
          </View>
          <View style={[styles.email, styles.nameBorder]}>
            <TextInput
              ref={phoneRef}
              style={[styles.label, styles.labelTypo]}
              placeholder="PHONE NUMBER"
              onChangeText={handlePhoneNumberChange}
              returnKeyType="next"
              onSubmitEditing={() => focusNextInput(passwordRef)}
            />
          </View>
          <View style={[styles.email, styles.nameBorder]}>
            <TextInput
              ref={passwordRef}
              style={[styles.label, styles.labelTypo]}
              placeholder="PASSWORD"
              onChangeText={handlePasswordChange}
              secureTextEntry={true}
              returnKeyType="next"
              onSubmitEditing={() => focusNextInput(confirmPasswordRef)}
            />
          </View>
          <View style={[styles.email, styles.nameBorder]}>
            <TextInput
              ref={confirmPasswordRef}
              style={[styles.label, styles.labelTypo]}
              placeholder="CONFIRM PASSWORD"
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry={true}
              returnKeyType="next"
              onSubmitEditing={() => focusNextInput(inviteCodeRef)}
            />
          </View>
          <View style={[styles.email, styles.nameBorder]}>
            <TextInput
              ref={inviteCodeRef}
              style={[styles.label, styles.labelTypo]}
              placeholder="Invite code (optional)"
              onChangeText={handleInviteCodeChange}
              returnKeyType="done"
              onSubmitEditing={signUpHandler}
            />
          </View>
        </View>
        <Pressable
          style={[styles.frame, styles.frameFlexBox]}
          onPress={signUpHandler}
        >
          <Text style={[styles.signUp, styles.hereTypo]}>Sign up</Text>
        </Pressable>
        <View style={[tw`flex-row justify-between left-20`, { width: '80%'}]}>
          <Text style={[styles.alreadyRegisteredLog, styles.createNewAccountPosition]}>
            Already Registered?
          </Text>
          <Pressable
            style={[tw`ml-60`, styles.secondaryButton, styles.secondaryLayout]}
            onPress={() => navigation.navigate("Authen")}
          >
            <Text style={[styles.here, styles.hereTypo]}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;