import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { FontSize, FontFamily, Color } from "../GlobalStyles";
import { productData } from "../components/App"; // Import the productData from App.js

const Favorite = () => {
  const { name, stock, price, image } = productData;

  return (
    <View style={styles.favorite}>
      <Pressable>
        <Image
          style={[styles.iconmonstrMenu11, styles.arrowBackIconPosition]}
          contentFit="cover"
          source={require("../assets/iconmonstrmenu1-1.png")}
        />
        <Image
          style={[styles.arrowBackIcon, styles.arrowBackIconPosition]}
          contentFit="cover"
          source={require("../assets/arrow-back.png")}
        />
      </Pressable>
      <Text style={styles.wishlist}>Wishlist</Text>

      <View style={[styles.product, styles.productLayout]}>
        <Pressable>
          <Image
            style={[styles.productChild, styles.productLayout]}
            contentFit="cover"
            source={image}
          />
        </Pressable>
        <Text style={styles.wRgbSurfaceContainer}>
          <Text style={styles.blankLine}> </Text>
          <Text style={styles.wRgbSurfaceLedPanelCoolW}>
            <Pressable>
              <Text style={styles.wRgbSurface}>{name}</Text>
            </Pressable>
            <Text style={styles.inStock}>
              <Text style={styles.inStock1}>{stock}</Text>
            </Text>
          </Text>
          <Text style={styles.inStock}>
            <Text style={styles.inStock1}>
              <Text style={styles.text2}>{` `}</Text>
            </Text>
            <Text style={styles.text2}>
              <Text style={styles.text4}>{`    `}</Text>
            </Text>
            <Text style={styles.text5}>{price}</Text>
          </Text>
        </Text>
        <Pressable>
          <Image
            style={styles.image5Icon}
            contentFit="cover"
            source={require("../assets/image-5.png")}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowBackIconPosition: {
    height: 24,
    top: 67,
    position: "absolute",
  },
  productLayout: {
    height: 130,
    position: "absolute",
  },
  iconmonstrMenu11: {
    right: 12,
    width: 23,
    overflow: "hidden",
  },
  arrowBackIcon: {
    left: 21,
    width: 24,
  },
  wishlist: {
    left: 66,
    fontSize: FontSize.presetsBody2_size,
    lineHeight: 24,
    fontWeight: "600",
    fontFamily: FontFamily.interSemiBold,
    textAlign: "center",
    color: Color.colorBlack,
    top: 67,
    position: "absolute",
  },
  productChild: {
    top: 0,
    left: 0,
    width: 130,
  },
  blankLine: {
    color: Color.colorLimegreen,
    fontFamily: FontFamily.kiwiMaruRegular,
    fontSize: FontSize.size_3xs,
  },
  wRgbSurface: {
    fontFamily: FontFamily.kleeOneRegular,
    color: Color.colorBlack,
  },
  inStock1: {
    color: Color.colorRed,
  },
  inStock: {
    fontFamily: FontFamily.kiwiMaruRegular,
  },
  wRgbSurfaceLedPanelCoolW: {
    fontSize: FontSize.size_mini,
  },
  text2: {
    fontSize: FontSize.size_3xs,
  },
  text4: {
    color: Color.colorBlack,
  },
  text5: {
    fontSize: FontSize.size_mini,
    color: Color.colorLimegreen,
  },
  wRgbSurfaceContainer: {
    marginTop: -40,
    top: "50%",
    left: 177,
    lineHeight: 15,
    textAlign: "left",
    width: 171,
    height: 80,
    position: "absolute",
  },
  image5Icon: {
    top: 52,
    right: 25,
    width: 25,
    height: 25,
    position: "absolute",
  },
  product: {
    top: 126,
    left: 18,
    width: 428,
  },
  favorite: {
    backgroundColor: Color.backgroundDefaultDefault,
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
  },
});

export default Favorite;
