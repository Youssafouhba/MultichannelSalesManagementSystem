import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from 'react';
import { StyleSheet, View ,Image} from "react-native";
import { Border, Color } from "../GlobalStyles";
import LoadingAnimation from "@/components/LoadingAnimation";

const LogoPage = () => {
  return (
    <View style={styles.LogoPage}>
      <LoadingAnimation size={160} color="aliceblue" circleCount={15}/>
    </View>
  );
};

const styles = StyleSheet.create({
  childLayout: {
    height: 63,
    width: 301,
  },
  homePosition: {
    left: 0,
    position: "absolute",
  },
  LogoPageChild: {
    // Remove unnecessary absolute positioning
  },
  homeIndicator1: {
    marginLeft: -67,
    bottom: 8,
    left: "50%",
    borderRadius: Border.br_81xl,
    backgroundColor: Color.colorBlack,
    width: 134,
    height: 5,
    position: "absolute",
  },
  homeIndicatorChild: {
    top: 0,
    height: 63,
    width: 301,
  },
  homeIndicator: {
    top: 898,
    width: 430,
    height: 34,
  },
  LogoPage: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
    justifyContent: 'center', // Center the image vertically
    alignItems: 'center',  // Center the image horizontally
  },
  centeredImage: {
    // No need for additional styles here
  },
});

export default LogoPage;
