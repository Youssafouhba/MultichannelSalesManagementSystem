import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View,Dimensions } from "react-native";
import { FontSize, FontFamily, Color, Border, Padding } from "../GlobalStyles";

const { width } = Dimensions.get('window');



const SearchBoxContainer = () => {
  return (
    <View style={[styles.header]}>
      <View style={[styles.rectangleParent, styles.frameFlexBox1]}>
      <Image
          style={styles.frameChild}
          contentFit="cover"
          source={require("../assets/rectangle-111.png")}
        />
        <Image
          style={styles.iconmonstrMenu11}
          contentFit="cover"
          source={require("../assets/iconmonstrmenu1-11.png")}
        />
      </View>
      <View style={styles.frame2}>
        <View style={styles.searchInput}>
          <Text style={styles.label} numberOfLines={1}>
            Search
          </Text>
          <Image
            style={styles.searchIcon}
            contentFit="cover"
            source={require("../assets/search1.png")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: Color.colorWhite,
    alignItems: 'center',
    
  },

  rectangleParent: {
    height: 30,
  },

  frameFlexBox1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '100%',
  },

  frameChild: {
    width: 50,
    height: 30,
  },

  iconmonstrMenu11: {
    width: 24,
    height: 24,
  },

  frame2: {
    width: '100%',
    marginTop: 28,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  searchInput: {
    borderRadius: Border.br_5xs,
    borderStyle: "solid",
    borderColor: Color.colorGainsboro,
    borderWidth: 1,
    width: '90%',
    paddingLeft: Padding.p_xs,
    paddingVertical: Padding.p_5xs,
    height: 41,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.colorWhite,
  },

  label: {
    fontFamily: FontFamily.singleLineBodyBase,
    flex: 1,
    textAlign: "left",
    color: Color.colorGray_100,
    lineHeight: 24,
    fontSize: FontSize.singleLineBodyBase_size,
    overflow: "hidden",
  },

  searchIcon: {
    width: 24,
    height: 24,
    marginLeft: 12,
    overflow: "hidden",
  },
});
export default SearchBoxContainer;
