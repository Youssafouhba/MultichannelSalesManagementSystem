import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect } from 'react';
import { StyleSheet, View } from "react-native";
import { Border, Color } from "../GlobalStyles";



const LogoPage = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('RegisterPage'); // Replace 'TargetScreen' with the name of your target screen
    }, 1500);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.iphone1415ProMax1}>
      <Image
        style={[styles.iphone1415ProMax1Child, styles.childLayout]}
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
  iphone1415ProMax1Child: {
    top: 403,
    left: 65,
    position: "absolute",
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
  iphone1415ProMax1: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
  },
});

export default LogoPage;
