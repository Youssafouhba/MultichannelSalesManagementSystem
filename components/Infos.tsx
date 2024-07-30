import * as React from "react";
import { useState } from "react";
import tw from "tailwind-react-native-classnames";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Color } from "../GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, Text, Button } from "react-native-paper";

import { format, differenceInDays } from 'date-fns';

const Infos = ({ fullName, email, phoneNumber, dateOfCreation }: { fullName: string, email: string, phoneNumber: string, dateOfCreation: Date }) => {
  const handleDeleteAccount = () => {
    console.log("Delete account pressed");
  };
  const [nameEnabled, setNameEnabled] = useState<boolean>(true);
  const [phoneEnabled, setPhoneEnabled] = useState<boolean>(true);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);


  const ClientDateDisplay: React.FC<{ createdDate: string | Date }> = ({ createdDate }) => {
    const orderDateTime = new Date(createdDate);
    console.log(format(orderDateTime, 'yy-MM-dd'))
    return format(orderDateTime, 'yy-MM-dd')
  };
  return (
    <ScrollView style={[styles.infos, { backgroundColor: Color.mainbackgroundcolor }]}>
      <View style={[tw`mt-5 justify-center items-center`, { backgroundColor: Color.mainbackgroundcolor }]}>
        <Ionicons name='person-circle-outline' size={100} />
        <Text style={[tw`text-base font-bold`]}>{`Your Profile`}</Text>
      </View>
      <View style={[tw`mt-5 px-2`, { width: '100%' }]}>
        <InfoField
          label="Full Name"
          value={fullName}
          enabled={nameEnabled}
          setEnabled={setNameEnabled}
        />
        <InfoField
          label="Email"
          value={email}
          enabled={emailEnabled}
          setEnabled={setEmailEnabled}
        />
        <InfoField
          label="Phone Number"
          value={phoneNumber}
          enabled={phoneEnabled}
          setEnabled={setPhoneEnabled}
        />
        <InfoField
          label="Date of creation"
          value={dateOfCreation}
          enabled={true}
          editable={false}
        />

        <View style={[tw`flex-row justify-around items-center my-4`]}>
          <TouchableOpacity onPress={() => {}}>
            <Button buttonColor="red" textColor="white" style={[tw`text-base font-medium`, { color: Color.colorRed }]}>
              DELETE ACCOUNT
            </Button>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAccount}>
            <Button buttonColor="#0077b6" textColor="white" style={[tw`text-base font-medium`]}>
              Save Changes
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const InfoField = ({ label, value, enabled, setEnabled, editable = true }) => (
  <View style={[tw`flex-row justify-between mx-2 my-4 items-center`]}>
    <Text style={[tw`text-base font-bold`, { color: Color.colorNavy, width: '40%' }]}>
      {label} :
    </Text>
    <View style={{ flex: 1, marginRight: 10 }}>
      <TextInput
        disabled={enabled}
        value={value}
        style={[tw`text-base`, { backgroundColor: 'transparent' }]}
        multiline
      />
    </View>
    {editable ? (
      <Pressable onPress={() => setEnabled(!enabled)}>
        <Image
          style={[tw`w-5 h-5`]}
          contentFit="cover"
          tintColor={'#03045e'}
          source={require("../assets/edit.png")}
        />
      </Pressable>
    ) : (
      <Image
        style={[tw`w-5 h-5`, { opacity: 0.6 }]}
        contentFit="cover"
        source={require("../assets/edit.png")}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  infos: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
});

export default Infos;