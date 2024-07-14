import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { FontFamily, Border, FontSize, Padding, Color } from "../GlobalStyles";

const HomePage = () => {
  return (
    <View style={styles.homepage}>
      <View style={styles.frameParent}>
        <View style={[styles.frame, styles.frameLayout2]}>
          <View style={styles.frameLayout2}>
            <View style={[styles.rectangleParent, styles.frameFlexBox1]}>
              <Image
                style={styles.frameChild}
                contentFit="cover"
                source={require("../assets/rectangle-11.png")}
              />
              <Image
                style={[styles.iconmonstrMenu11, styles.frame6Layout]}
                contentFit="cover"
                source={require("../assets/iconmonstrmenu1-1.png")}
              />
            </View>
          </View>
          <View style={styles.frame2}>
            <View style={styles.searchInput}>
              <Text style={styles.label} numberOfLines={1}>
                Search
              </Text>
              <Image
                style={[styles.searchIcon, styles.iconLayout1]}
                contentFit="cover"
                source={require("../assets/search.png")}
              />
            </View>
          </View>
        </View>
        <View style={styles.frame3}>
          <View style={styles.parent}>
            <View style={[styles.tabBarItem, styles.tabItemPosition]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameLayout2: {
    width: 370,
    justifyContent: "center",
    overflow: "hidden",
  },
  frameFlexBox1: {
    flexDirection: "row",
    alignItems: "center",
  },
  frame6Layout: {
    height: 24,
    overflow: "hidden",
  },
  iconLayout1: {
    width: 24,
    height: 24,
  },
  frameLayout1: {
    width: 408,
    justifyContent: "center",
  },
  frameFlexBox: {
    alignItems: "flex-end",
    overflow: "hidden",
  },
  viewAllTypo: {
    fontFamily: FontFamily.kavoonRegular,
    textAlign: "left",
    lineHeight: 24,
    height: 24,
  },
  framePosition: {
    width: 114,
    borderRadius: Border.br_xl,
    top: "50%",
    marginTop: -27.35,
    left: "50%",
    height: 55,
    position: "absolute",
  },
  bestSellerTypo: {
    fontSize: FontSize.size_sm,
    left: "50%",
    top: "50%",
    fontFamily: FontFamily.kavoonRegular,
    lineHeight: 24,
  },
  ceilingCalculatorLayout: {
    height: 49,
    position: "absolute",
  },
  containerTypo: {
    fontSize: FontSize.size_3xs,
    position: "absolute",
    textAlign: "left",
  },
  containerLayout: {
    height: 61,
    fontSize: FontSize.size_3xs,
    width: 114,
    textAlign: "left",
  },
  frameLayout: {
    height: 339,
    overflow: "hidden",
  },
  iconLayout: {
    width: 28,
    overflow: "hidden",
  },
  tabItemPosition: {
    paddingTop: Padding.p_xs,
    paddingHorizontal: Padding.p_7xl,
    left: "50%",
    position: "absolute",
    paddingBottom: Padding.p_5xs,
    flexDirection: "row",
  },
  frameChild: {
    width: 50,
    height: 30,
  },
  iconmonstrMenu11: {
    width: 23,
    marginLeft: 286,
  },
  rectangleParent: {
    width: 359,
    height: 30,
  },
  label: {
    fontFamily: FontFamily.singleLineBodyBase,
    width: 219,
    textAlign: "left",
    color: Color.colorGray_100,
    lineHeight: 24,
    fontSize: FontSize.singleLineBodyBase_size,
    overflow: "hidden",
  },
  searchIcon: {
    marginLeft: 12,
    overflow: "hidden",
  },
  searchInput: {
    borderRadius: Border.br_5xs,
    borderStyle: "solid",
    borderColor: Color.colorGainsboro,
    borderWidth: 1,
    width: 280,
    paddingLeft: Padding.p_xs,
    paddingTop: Padding.p_5xs,
    paddingRight: Padding.p_base,
    paddingBottom: Padding.p_5xs,
    height: 41,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.colorWhite,
  },
  frame2: {
    width: 292,
    marginTop: 28,
    justifyContent: "center",
    overflow: "hidden",
  },
  frame: {
    height: 99,
    alignItems: "center",
  },
  tabBarItem: {
    marginLeft: -29,
    top: 1,
    width: 64,
    height: 44,
  },
  parent: {
    height: 76,
    marginTop: 20,
    width: 430,
  },
  frame3: {
    height: 758,
    marginTop: 34,
    alignItems: "center",
    overflow: "hidden",
    width: 430,
  },
  frameParent: {
    height: 891,
    justifyContent: "center",
    alignItems: "center",
    width: 430,
  },
  homepage: {
    height: 932,
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
    width: 430,
    backgroundColor: Color.colorWhite,
  },
});

export default HomePage;
