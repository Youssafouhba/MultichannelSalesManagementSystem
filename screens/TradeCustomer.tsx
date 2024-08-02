import { Color, FontFamily, FontSize, StyleVariable } from "@/GlobalStyles";
import InputField from "@/components/InputField";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Inputoptions = ({ onSelectOption }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const options = ["Sole Trader", "Partnership", "Limited Company", "Other"];

  const handleOptionSelect = (option:any) => {
    setSelectedOption(option);
    setDropdownVisible(false);
    onSelectOption(option);
  };

  return (
    <View style={styles.inputoptions}>
      <TouchableOpacity onPress={() => setDropdownVisible(!isDropdownVisible)}>
        <Text style={[styles.description, styles.optionTypo]}>
          Type of Business
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.select}
        onPress={() => setDropdownVisible(!isDropdownVisible)}
      >
        <Text style={[styles.value, styles.labelTypo]}>
          {selectedOption || "Select an option"}
        </Text>
        <Image
          style={styles.chevronDownIcon}
          contentFit="cover"
          source={require("@/assets/chevron-down.png")}
        />
      </TouchableOpacity>
      {isDropdownVisible && (
        <View style={[styles.options, styles.optionsShadowBox]}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={[styles.option, styles.optionTypo]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const TradeCustomer: React.FC = () => {

  const [companyName, setCompanyName] = useState<string>("");
  const [contactPerson, setContactPerson] = useState<string>("");
  const [businessAddress, setBusinessAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("");
  const [otherBusinessType, setOtherBusinessType] = useState<string>("");



  const handleCompanyNameChange = (text: string): void => setCompanyName(text);
  const handleContactPersonChange = (text: string): void => setContactPerson(text);
  const handleBusinessAddressChange = (text: string): void => setBusinessAddress(text);
  const handleCityChange = (text: string): void => setCity(text);
  const handleCountryChange = (text: string): void => setCountry(text);
  const handlePostalCodeChange = (text: string): void => setPostalCode(text);
  const handlePhoneNumberChange = (text: string): void => setPhoneNumber(text);
  const handleEmailAddressChange = (text: string): void => setEmailAddress(text);
  const handleWebsiteChange = (text: string): void => setWebsite(text);
  const handleOtherBusinessTypeChange = (text: string): void => setOtherBusinessType(text);

  const navigation = useNavigation<any>();

  const handleNextButton = (): void => {
    const payload = {
      companyName,
      contactPerson,
      businessAddress,
      city,
      country,
      postalCode,
      phoneNumber,
      emailAddress,
      website,
      typeOfBusiness: selectedBusinessType === "Other" ? otherBusinessType : selectedBusinessType,
    };
    
    console.log(payload);
    // Navigate to CompleteTradeCustomer screen
    navigation.navigate("CompleteTradeCustomer", { payload });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}>
        <View style={styles.tradeCustomer1}>
          <Pressable style={styles.nextbutton} onPress={handleNextButton}>
            <Text style={styles.next}>Next</Text>
            <Image
              style={[styles.arrowRightIcon, styles.iconLayout]}
              contentFit="cover"
              source={require("@/assets/arrow-right.png")}
            />
          </Pressable>
          <View style={styles.inputs}>
            <InputField inputFieldPlaceholder="Company Name (if applicable)" propTop={50} onChangeText={handleCompanyNameChange}/>
            <InputField inputFieldPlaceholder="Contact Person" propTop={95} onChangeText={handleContactPersonChange}/>
            <InputField inputFieldPlaceholder="Business Address" propTop={145} onChangeText={handleBusinessAddressChange}/>
            <InputField inputFieldPlaceholder="City" propTop={190} onChangeText={handleCityChange}/>
            <InputField inputFieldPlaceholder="Country" propTop={235} onChangeText={handleCountryChange}/>
            <InputField inputFieldPlaceholder="Postal Code" propTop={280} onChangeText={handlePostalCodeChange}/>
            <InputField inputFieldPlaceholder="Phone Number" propTop={325} onChangeText={handlePhoneNumberChange}/>
            <InputField inputFieldPlaceholder="Email Address" propTop={370} onChangeText={handleEmailAddressChange}/>
            <InputField inputFieldPlaceholder="Website (if applicable)" propTop={415} onChangeText={handleWebsiteChange}/>
            <Inputoptions onSelectOption={setSelectedBusinessType} />
            {selectedBusinessType === "Other" && (
              <InputField inputFieldPlaceholder="Please Specify" propTop={570} onChangeText={handleOtherBusinessTypeChange}/>
            )}

            
            <View style={[styles.title1, styles.title1Position]}>
              <ImageBackground
                style={[styles.image9Icon, styles.title1Position]}
                resizeMode="cover"
                source={require("@/assets/image9.png")}
              />
              <Text
                style={[styles.companyindividualInformation, styles.openATradeTypo]}
              >
                Company/Individual Information :
              </Text>
            </View>
          </View>
          <View style={[styles.header, styles.headerLayout]}>
            <Text style={[styles.openATrade, styles.headerLayout]}>
              Open a trade account (minimum buy £500)
            </Text>
            <Image
              style={[styles.icon, styles.iconPosition]}
              contentFit="cover"
              source={require("@/assets/icon.png")}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  iconLayout: {
    height: 16,
    width: 16,
  },
  title1Position: {
    height: 24,
    left: 0,
    top: 0,
    position: "absolute",
  },
  openATradeTypo: {
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    textAlign: "left",
  },
  headerLayout: {
    width: 370,
    position: "absolute",
  },
  iconPosition: {
    top: 0,
    position: "absolute",
  },
  next: {
    fontSize: FontSize.presetsBody2_size,
    lineHeight: 16,
    fontFamily: FontFamily.presetsBody2,
    color: "#1e7d15",
    textAlign: "left",
  },
  arrowRightIcon: {
    marginLeft: 8,
    overflow: "hidden",
  },
  nextbutton: {
    top: 852,
    left: 328,
    borderRadius: StyleVariable.radius200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: StyleVariable.space300,
    paddingVertical: StyleVariable.space200,
    opacity: 0.5,
    position: "absolute",
  },
  image9Icon: {
    width: 23,
  },
  companyindividualInformation: {
    fontSize: FontSize.size_sm,
    lineHeight: 21,
    color: Color.colorBlack,
    width: 354,
    top: 0,
    position: "absolute",
    left: 33,
  },
  title1: {
    width: 387,
  },
  inputs: {
    top: 145,
    height: 696,
    width: 387,
    left: 33,
    position: "absolute",
  },
  openATrade: {
    top: 29,
    fontSize: FontSize.size_lg,
    lineHeight: 27,
    color: "#0d2e6e",
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    textAlign: "left",
    left: 0,
    width: 370,
  },
  icon: {
    marginLeft: -167,
    left: "50%",
    height: 16,
    width: 16,
  },
  header: {
    top: 55,
    left: 21,
    height: 56,
  },
  tradeCustomer1: {
    backgroundColor: Color.backgroundDefaultDefault,
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
  },
  labelTypo: {
    zIndex: 0,
    fontFamily: FontFamily.presetsBody2,
    textAlign: "left",
    color: Color.textDefaultDefault,
    fontSize: FontSize.presetsBody2_size,
  },
  optionTypo: {
    marginTop: 8,
    textAlign: "left",
    fontFamily: FontFamily.presetsBody2,
    lineHeight: 22,
    fontSize: FontSize.presetsBody2_size,
  },
  optionsShadowBox: {
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: "rgba(12, 12, 13, 0.1)",
    left: 8,
    top: 8,
    borderWidth: 1,
    borderColor: Color.borderDefaultDefault,
    borderStyle: "solid",
    backgroundColor: Color.backgroundDefaultDefault,
    borderRadius: StyleVariable.radius200,
    position: "absolute",
  },
  label: {
    display: "none",
    lineHeight: 22,
    zIndex: 0,
    fontFamily: FontFamily.presetsBody2,
    alignSelf: "stretch",
  },
  description: {
    color: Color.textDefaultSecondary,
    zIndex: 1,
    marginTop: 8,
    alignSelf: "stretch",
  },
  value: {
    flex: 1,
    lineHeight: 16,
  },
  chevronDownIcon: {
    width: 16,
    height: 16,
    overflow: "hidden",
    marginLeft: 8,
    zIndex: 1,
  },
  
  option: {
    color: Color.textDefaultDefault,
    marginTop: 8,
    fontSize: FontSize.presetsBody2_size,
    lineHeight: 22,
    fontFamily: FontFamily.presetsBody2,
  },
  options: {
    padding: StyleVariable.space200,
    zIndex: 2,
  },
  select: {
    height: 41,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: StyleVariable.space400,
    paddingTop: StyleVariable.space300,
    paddingRight: StyleVariable.space300,
    paddingBottom: StyleVariable.space300,
    minWidth: 240,
    zIndex: 2,
    borderWidth: 1,
    borderColor: Color.borderDefaultDefault,
    borderStyle: "solid",
    backgroundColor: Color.backgroundDefaultDefault,
    borderRadius: StyleVariable.radius200,
    marginTop: 8,
    alignSelf: "stretch",
  },
  inputoptions: {
    top: 465,
    left: 40,
    width: 311,
    position: "absolute",
  },
});

export default TradeCustomer;
