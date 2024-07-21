import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View,Dimensions } from "react-native";
import { FontSize, FontFamily, Color, Border, Padding } from "../GlobalStyles";
import tw from 'tailwind-react-native-classnames';
import { headerstyles as styles } from "../GlobalStyles";
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
      <View style={[styles.frame2,tw`mb-1`]}>
        <View style={[styles.searchInput]}>
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


export default SearchBoxContainer;
