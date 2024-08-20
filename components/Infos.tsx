import * as React from "react";
import { useState } from "react";
import tw from "tailwind-react-native-classnames";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Modal,
  Image
} from "react-native";
import { Color } from "../GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, Text, Button } from "react-native-paper";
import { format } from 'date-fns';
import { useAppData } from "./AppDataProvider";
import { router } from "expo-router";
import { UserDTO } from "@/constants/Classes";
import AnimatedCustomAlert from "./AnimatedCustomAlert";


const Infos = ({ fullName, email, phoneNumber, dateOfCreation }: { fullName: string, email: string, phoneNumber: string, dateOfCreation: string | Date }) => {
  const { user,updateProfile, deleteAccount, error } = useAppData();
  
  const [nameEnabled, setNameEnabled] = useState<boolean>(true);
  const [phoneEnabled, setPhoneEnabled] = useState<boolean>(true);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);

  const [alertVisible, setAlertVisible] = useState(false);

  const [name, setName] = useState<string>(fullName);
  const [phone, setPhone] = useState<string>(phoneNumber);
  const [mail, setmail] = useState<string>(email);

  const [deleteAlertVisible, setDeleteAlertVisible] = useState<boolean>(false);

  const ClientDateDisplay: React.FC<{ createdDate: string | Date }> = ({ createdDate }) => {
    const orderDateTime = new Date(createdDate);
    return format(orderDateTime, 'yyyy/MM/dd')
  };

  const handleUpdateAccount = async () => {
    const userdto: UserDTO = {
      fullName: name,
      email: mail,
      phoneNumber: phone,
      dateOfCreation: '',
    }
    await updateProfile(userdto);
    setAlertVisible(true)
  };

  return (
    <ScrollView style={[styles.infos, { backgroundColor: Color.mainbackgroundcolor }]}>
      <AnimatedCustomAlert
        visible={alertVisible}
        title="Profile Update"
        message="Congrats Your Profile Updated successfully !"
        onDismiss={()=>{setAlertVisible(false),setEmailEnabled(true),setPhoneEnabled(true),setNameEnabled(true)}}
        duration={2000} // 3 seconds
      />
      <View style={[tw`mt-5 justify-center items-center`, { backgroundColor: Color.mainbackgroundcolor }]}>
        <Ionicons name='person-circle-outline' size={100} />
        <Text style={[tw`text-base font-bold`]}>{`Your Profile`}</Text>
      </View>
      <View style={[tw`mt-5 px-2`, { width: '100%' }]}>
        <InfoField
          label="Full Name"
          value={name}
          setValue={setName}
          enabled={nameEnabled}
          setEnabled={setNameEnabled}
        />
        <InfoField
          label="Email"
          value={mail}
          setValue={setmail}
          enabled={emailEnabled}
          setEnabled={setEmailEnabled}
        />
        <InfoField
          label="Phone Number"
          value={phone}
          setValue={setPhone}
          enabled={phoneEnabled}
          setEnabled={setPhoneEnabled}
        />
        <InfoField
          label="Date of creation"
          value={ClientDateDisplay({ createdDate: dateOfCreation })}
          setValue={''}
          enabled={true}
          editable={false}
        />
        
        <View style={[tw`flex-row justify-around items-center my-4`]}>
          <TouchableOpacity onPress={() => {handleUpdateAccount()}}>
            <Button buttonColor="#0077b6" textColor="white" style={[tw`text-base font-medium`]}>
              Save Changes
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const InfoField = ({ label,setValue, value, enabled, setEnabled, editable = true }) => (
  <View style={[tw`flex-row justify-between mx-2 my-4 items-center`]}>
    <Text style={[tw`text-base font-bold`, { color: Color.colorNavy, width: '40%' }]}>
      {label} :
    </Text>
    <View style={{ flex: 1, marginRight: 10 }}>
      <TextInput
        disabled={enabled}
        onChangeText={setValue}
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  buttonCancel: {
    backgroundColor: "#2196F3",
  },
  buttonConfirm: {
    backgroundColor: "#FF0000",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalSubText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#666",
  },
});

export default Infos;