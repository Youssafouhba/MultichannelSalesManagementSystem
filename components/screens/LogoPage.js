import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect } from 'react';
import { StyleSheet, View } from "react-native";
import { Border, Color } from "../GlobalStyles";


const LogoPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
     navigation.navigate('LoginPage'); // Replace 'TargetScreen' with the name of your target screen
    }, 0 );

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.LogoPage}>
      <Image
        style={[styles.LogoPageChild, styles.childLayout]}
        contentFit="cover"
        source={require("../assets/rectangle-1.png")}
      />
      <View style={[styles.homeIndicator, styles.homePosition]}>
        <View style={styles.homeIndicator1} />
        <View style={[styles.homeIndicatorChild, styles.homePosition]} />
      </View>
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
