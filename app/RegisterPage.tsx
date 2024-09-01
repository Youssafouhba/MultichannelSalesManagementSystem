import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as React from "react";
import { Pressable, StyleSheet, Text, TextInput, View, Image, ScrollView } from "react-native";
import { authstyles } from "../GlobalStyles";
import { Border, Color, FontFamily, FontSize, Padding } from "../GlobalStyles";
import * as Animatable from "react-native-animatable";
import { useAppContext } from "@/components/AppContext";
import config from "@/components/config";
import { useAppData } from "@/components/AppDataProvider";
import { isValidEmail,isValidPhoneNumber } from "@/constants/Classes";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/contex/UserContext";
const RegisterPage = () => {
  const {setJWT_TOKEN} = useUser();
  const navigation = useNavigation<any>();
  const [mail, setMail] = React.useState("");
  const [name, setName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm,setshowPasswordConfirm] = React.useState<boolean>(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordConfirmVisibility = () => {
    setshowPasswordConfirm(!showPasswordConfirm);
  };
  // États pour gérer les erreurs
  const [errorMail, setErrorMail] = React.useState(false);
  const [errorName, setErrorName] = React.useState(false);
  const [errorPhoneNumber, setErrorPhoneNumber] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = React.useState(false);
  const [errorRegistration, setErrorRegistration] = React.useState("");

  const { loginn } = useAppData();

  // Créer des refs pour chaque TextInput
  const ref_name = React.useRef<TextInput>(null);
  const ref_email = React.useRef<TextInput>(null);
  const ref_phone = React.useRef<TextInput>(null);
  const ref_password = React.useRef<TextInput>(null);
  const ref_confirm_password = React.useRef<TextInput>(null);

  // Fonction pour gérer l'appel API
  const apiHandler = async (url: string, payload: object) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}${url}`, payload);
      return response;
    } catch (error: any) {
      return error.response;
    }
  };

  // Fonction pour gérer l'inscription
  const signUpHandler = async () => {
    const isNameValid = name !== "";
    const isMailValid = isValidEmail(mail);
    const isPhoneNumberValid = isValidPhoneNumber(phoneNumber);
    const isPasswordValid = password !== "";
    const isConfirmPasswordValid = confirmPassword !== "" && password === confirmPassword;

    setErrorName(!isNameValid);
    setErrorMail(!isMailValid);
    setErrorPhoneNumber(!isPhoneNumberValid);
    setErrorPassword(!isPasswordValid);
    setErrorConfirmPassword(!isConfirmPasswordValid);

    if (isNameValid && isMailValid && isPhoneNumberValid && isPasswordValid && isConfirmPasswordValid) {
      const payload = {
        fullName: name,
        email: mail,
        password: password,
        phoneNumber: phoneNumber,
      };

      const response = await apiHandler("/api/auth/register", payload);
      if (response.data.token && response.data.message === "User registered successfully!") {
        setJWT_TOKEN(response.data.token);
        loginn(response.data.token);
        navigation.navigate("EmailVerificationPage", { mail, password });
      } else {
        setErrorRegistration(response.data.message);
      }
    }
  };

  // Utilisation de useEffect pour supprimer l'erreur dès que la valeur est corrigée
  React.useEffect(() => {
    if (name !== "") setErrorName(false);
    if (isValidEmail(mail)) setErrorMail(false);
    if (isValidPhoneNumber(phoneNumber)) setErrorPhoneNumber(false);
    if (password !== "") setErrorPassword(false);
    if (confirmPassword !== "" && password === confirmPassword) setErrorConfirmPassword(false);
  }, [name, mail, phoneNumber, password, confirmPassword]);

  return (
    <ScrollView contentContainerStyle={authstyles.contentContainerStyle}>
      <View style={[authstyles.iphone1415ProMax6, authstyles.labelFlexBox, authstyles.register]}>
        <View style={[{ paddingHorizontal: Padding.p_5xl, paddingVertical: 0, alignItems: "center" }]}>
          <Image
            style={[authstyles.iphone1415ProMax6Child]}
            source={require("@/assets/rectangle-2.png")}
          />
          <View style={[{ top: '3%' }]}>
            <Text style={[styles.createNewAccount, styles.createNewAccountPosition]}>
              Create new Account
            </Text>
          </View>
          <View style={[{ top: '3%' }]}>
            <Text style={[styles.alreadyRegisteredLog]}>
              Already Registered? Log in
            </Text>
            <Pressable
              style={[styles.secondaryButton, { top: '1%' }]}
              onPress={() => {
                navigation.navigate("LoginPage")
              }}
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
          <View style={[{ top: '5%' }]}>
            <View style={[styles.nameBorder, errorName && styles.errorInput]}>
              <TextInput
                style={[styles.label, styles.labelTypo]}
                numberOfLines={1}
                returnKeyType="next"
                onSubmitEditing={() => ref_email.current?.focus()}
                autoFocus={true}
                onChangeText={setName}
                placeholder="Full Name"
                ref={ref_name}
              />
            </View>
            <View style={[styles.email, styles.nameBorder, errorMail && styles.errorInput]}>
              <TextInput
                style={[styles.label, styles.labelTypo]}
                numberOfLines={1}
                placeholder="Email"
                returnKeyType="next"
                onSubmitEditing={() => ref_phone.current?.focus()}
                ref={ref_email}
                keyboardType="email-address"
                onChangeText={setMail}
              />
            </View>
            <View style={[styles.email, styles.nameBorder, errorPhoneNumber && styles.errorInput]}>
              <TextInput
                style={[styles.label, styles.labelTypo]}
                numberOfLines={1}
                placeholder="PHONE NUMBER"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => ref_password.current?.focus()}
                ref={ref_phone}
                onChangeText={setPhoneNumber}
              />
            </View>
            <View style={[styles.email, styles.nameBorder,styles.passwordContainer,errorPassword && styles.errorInput]}>
              <TextInput
                  style={[styles.label, styles.labelTypo]}
                  numberOfLines={1}
                  placeholder="PASSWORD"
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="next"
                  onSubmitEditing={() => ref_confirm_password.current?.focus()}
                  ref={ref_password}
                />
                <Pressable onPress={togglePasswordVisibility} style={styles.showPasswordButton}>
                  <Text style={styles.showPasswordButtonText}>
                    {showPassword ? <Ionicons name='eye-off-outline' size={18} /> : <Ionicons name='eye-outline' size={18} />}
                  </Text>
                </Pressable>
            </View>
            <View style={[styles.email, styles.nameBorder,styles.passwordContainer, errorConfirmPassword && styles.errorInput]}>
              <TextInput
                style={[styles.label, styles.labelTypo]}
                numberOfLines={1}
                placeholder="CONFIRM PASSWORD"
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPasswordConfirm}
                returnKeyType="done"
                ref={ref_confirm_password}
              />
              <Pressable onPress={togglePasswordConfirmVisibility} style={styles.showPasswordButton}>
                <Text style={styles.showPasswordButtonText}>
                  {showPasswordConfirm ? <Ionicons name='eye-off-outline' size={18} /> : <Ionicons name='eye-outline' size={18} />}
                </Text>
              </Pressable>
            </View>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    height: 40,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    borderRadius: Border.br_5xs,
  },
  showPasswordButton: {
    height: '100%',
    justifyContent: 'center',
  },
  showPasswordButtonText: {
    color: Color.colorBlack,
    fontSize: FontSize.size_sm,
  },
  frameFlexBox: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: Border.br_5xs,
  },
  hereTypo: {
    fontWeight: "500",
    textAlign: "left",
  },
  labelTypo: {
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
  errorInput: {
    borderColor: '#FF0000', // Change the border color to red
  },
  createNewAccountPosition: {
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
    marginTop: 25,
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
  here: {
    color: "#f04949",
    textAlign: "left",
  },
  secondaryButton: {
    top: 0,
    paddingVertical: 0,
    paddingHorizontal: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorWhite,
  },
  alreadyRegisteredLog: {
    fontSize: FontSize.size_sm,
  },
  createNewAccount: {
    fontSize: 32,
    lineHeight: 48,
    fontWeight: "600",
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
});

export default RegisterPage;
