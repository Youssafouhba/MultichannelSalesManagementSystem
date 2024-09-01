import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Infos from "@/components/Infos";
import { Color, FontSize } from "@/GlobalStyles";
import LogInRequiredPage from "@/components/LogInRequiredPage";
import { useUser } from "@/contex/UserContext";
import useInternetCheck from "@/components/useInternetCheck";
import NoInternetConnection from "@/components/NoInternetConnection";

export default function Account() {
  const { state} = useUser();
  const { isConnected, connectionType } = useInternetCheck();
  
  return (
    <View style={styles.profile}>
       {
      !isConnected?
      <NoInternetConnection/>
      :
      state.isLoggedIn? (
        <Infos
          fullName={state.userInfos.user?.fullName}
          email={state.userInfos.user?.email}
          phoneNumber={state.userInfos.user?.phoneNumber}
          dateOfCreation={state.userInfos.user.dateOfCreation}
        />
      ) : (
        <LogInRequiredPage message='Please log in to view your profile' page='Account'/>
      )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    backgroundColor: Color.mainbackgroundcolor,
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 60,
    backgroundColor: Color.colorWhite,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopColor: '#ccc',
  },
  iconLayout: {
    height: "100%",
    width: "100%",
  },
  icon1: {
    overflow: "hidden",
  },
  touchableopacity: {
    width: '5%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconmonstrMenu11: {
    top: 0,
    right: 0,
    width: 23,
    height: 24,
    position: "absolute",
    overflow: "hidden",
  },
  icon: {
    top: 0,
    left: 45,
    width: 23,
    height: 24,
    position: "absolute",
  },
  yourProfile: {
    top: 0,
    left: 75,
    fontSize: FontSize.presetsBody2_size,
    lineHeight: 24,
    fontWeight: "600",
    color: Color.colorBlack,
    textAlign: "center",
    width: 90,
    height: 29,
    position: "absolute",
  },
  header: {
    top: 55,
    right: 37,
    width: 423,
    height: 61,
    position: "absolute",
  },
});
