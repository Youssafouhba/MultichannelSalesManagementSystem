import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View,Pressable,TouchableOpacity,Alert,Dimensions } from "react-native";
import GroupComponent from "../components/GroupComponent";
import SearchBoxContainer from "../components/SearchBoxContainer";
import { FontSize,Padding, Color, FontFamily } from "../GlobalStyles";






const products = [
  {
    imageUrl: require("../assets/rectangle-96.png"),
    price: 9,
    title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
    new: `NEW`,
    stock: 100
  },
  {
    imageUrl: require("../assets/rectangle-97.png"),
    price: 9,
    title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
    new: `NEW`,
    stock: 100
  },
  {
    imageUrl: require("../assets/rectangle-98.png"),
    price: 9,
    title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
    new: `NEW`,
    stock: 100
  },
  {
    imageUrl: require("../assets/rectangle-99.png"),
    price: 9,
    title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
    new: `NEW`,
    stock: 100
  },
  {
    imageUrl: require("../assets/rectangle-95.png"),
    price: 7,
    title: `BORDERLESS 24W CEILING LAMP Cool White\n`,
    new: ``,
    stock: 90
  },
];

const productViews = [];
for (let i = 0; i < products.length; i++) {
  const item = products[i];
  productViews.push(
    <View key={i} style={styles.g6}>
      <Pressable onPress={() => handleImagePress(item.title)} style={styles.g6Child}>
        <Image
          style={[styles.g6Child, styles.childPosition]}
          source={item.imageUrl}
        />
        <Text style={[styles.newBrittliteDcContainer, styles.containerTypo]}>
          <Text style={styles.new}>{item.new}</Text>
          <Text style={styles.brittliteDc24v}>{item.title}</Text>
          <Text style={styles.inStock9}>
            <Text style={styles.inStock}>{item.stock} in stock</Text>
            <Text style={styles.text}>{`    `}</Text>
            <Text style={styles.text1}>{item.price}$</Text>
          </Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPosition: {
    top: 130,
    left: 0,
    position: "absolute",
  },
  childPosition: {
    height: 112,
    top: 0,
    left: 0,
    position: "absolute",
  },
  containerTypo: {
    fontSize: FontSize.size_3xs,
    textAlign: "left",
  },
  childLayout: {
    width: 126,
    position: "absolute",
  },
  containerLayout: {
    height: 61,
    width: 114,
    textAlign: "left",
    fontSize: FontSize.size_3xs,
    position: "absolute",
  },
  g4Layout: {
    width: 131,
    position: "absolute",
  },
 
  g6Child: {
    width: 128,
  },
  new: {
    color: Color.colorLimegreen,
    fontFamily: FontFamily.kiwiMaruRegular,
  },
  brittliteDc24v: {
    color: Color.colorBlack,
    fontFamily: FontFamily.kleeOneRegular,
  },
  inStock: {
    color: Color.colorFirebrick,
  },
  text: {
    color: Color.colorBlack,
  },
  text1: {
    color: Color.colorLimegreen,
  },
  inStock9: {
    fontFamily: FontFamily.kiwiMaruRegular,
  },
  newBrittliteDcContainer: {
    top: 122,
    left: 3,
    width: 104,
    height: 65,
    textAlign: "left",
    lineHeight: 11,
    position: "absolute",
  },
  g6: {
    top: 336,

    left: 199,
    position: "absolute",
    width: '48%', // Adjust the width to fit two items per row with some spacing
    marginBottom: 20,
  },
  g5Child: {
    width: 124,
  },
  inStock1: {
    color: Color.colorRed,
  },
  brittliteCobDcContainer: {
    top: 116,
    left: 12,
    lineHeight: 11,
  },
  g5: {
    top: 345,
    left: 1,
    height: 177,
  },
  g4Child: {
    left: 2,
    width: 110,
    height: 97,
    top: 0,
    position: "absolute",
  },
  borderless24wCeilingLampCo: {
    lineHeight: 11,
  },
  blankLine: {
    lineHeight: 15,
    color: Color.colorBlack,
    fontFamily: FontFamily.kleeOneRegular,
  },
  borderless24wCeilingContainer: {
    top: 102,
    height: 51,
    textAlign: "left",
    fontSize: FontSize.size_3xs,
    left: 0,
  },
  g4: {
    top: 183,
    height: 153,
    left: 199,
  },
  g3Child: {
    height: 113,
    top: 0,
    left: 0,
  },
  wBlueSurfaceContainer1: {
    width: "100%",
  },
  wBlueSurfaceContainer: {
    top: 108,
    left: 15,
    fontSize: FontSize.size_4xs,
    display: "flex",
    alignItems: "center",
    width: 109,
    height: 49,
    textAlign: "left",
    lineHeight: 11,
    position: "absolute",
  },
  g3: {
    top: 184,
    height: 157,
    left: 0,
  },
  g2Child: {
    width: 125,
    height: 123,
    top: 0,
    left: 0,
    position: "absolute",
  },
  new3wLedContainer: {
    top: 123,
    left: 13,
    lineHeight: 15,
  },
  g2: {
    left: 186,
    width: 127,
    height: 183,
    top: 0,
    position: "absolute",
  },
  inStock5: {
    color: Color.colorRed,
    fontFamily: FontFamily.kiwiMaruRegular,
  },
  text10: {
    fontFamily: FontFamily.kleeOneRegular,
  },
  wUfoCoolContainer: {
    width: 105,
    lineHeight: 15,
    textAlign: "left",
    left: 0,
    top: 130,
    position: "absolute",
    height: 30,
  },
  g1Child: {
    height: 124,
    top: 0,
    left: 0,
  },
  g1: {
    top: 5,
    left: 4,
    height: 160,
  },
  g6Parent: {
    top: 139,
    left: 39,
    position: "absolute",
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  groupContainer: {
    height: 662,
    left: 0,
    width: 399,
  },
  groupParent: {
    top: 31,
    left: 16,
    height: 855,
    width: 399,

  },
  homepage: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
  },

  homeIconFlexBox: {
    flexDirection: "row",
    overflow: "hidden",
  },
  tabItemSpaceBlock: {
    paddingBottom: Padding.p_5xs,
    paddingTop: Padding.p_xs,
    paddingHorizontal: Padding.p_7xl,
    height: 44,
    flexDirection: "row",
  },
  iconLayout: {
    height: "100%",
    width: "100%",
  },
  tabBarItem: {
    width: 63,
  },
  chatBubble: {
    height: 24,
    marginLeft: 22,
    width: 24,
  },
  iconmonstrShoppingCart21: {
    height: 22,
    width: 28,
    overflow: "hidden",
  },
  tabBarItem1: {
    width: 64,
    marginLeft: 22,
  },
  icon1: {
    overflow: "hidden",
  },
  touchableopacity: {
    width: '5%',
    aspectRatio:1,
    alignItems:'center',
    justifyContent:'center'
  },
  bell: {
    width: 32,
    height: 28,
    marginLeft: 22,
  },
  guestPage: {
    backgroundColor: Color.colorWhite,
    width: 430,
    height: 932,
    alignItems: "center",
    paddingHorizontal: 48,
    paddingTop: 857,
    paddingBottom: 31,
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

  Pressable: {
    width: '100%',
    alignItems:'center'

  },


}); 
const { width, height } = Dimensions.get('window');
const HomePage1 = () => {
  const handleImagePress = (itemName) => {
    Alert.alert("Image Pressed!", `You clicked on ${itemName}!`);
  };
 
  return (
    <View style={[styles.homepage, styles.homeIconFlexBox]}>
      <View style={styles.groupParent}>
        
        <View style={[styles.groupContainer, styles.containerPosition]}>
          <GroupComponent />
          <View style={styles.g6Parent}>
            {productViews}
          </View>
          </View>
        <SearchBoxContainer />
      </View>
      <View style={[ styles.footer]}>
     

      <TouchableOpacity
        style={styles.touchableopacity}
        activeOpacity={0.2}
        onPress={() => {}}
      >
        <Image
          style={styles.iconLayout}
          contentFit="cover"
          source={require("../assets/home.png")}
        />

       </TouchableOpacity> 
     
     
      <TouchableOpacity 
       style={styles.touchableopacity}
        activeOpacity={0.2}
        onPress={() => {}}
      >
        <Image
          style={styles.iconLayout}
          contentFit="cover"
          source={require("../assets/chat-bubble2.png")}
        />
      </TouchableOpacity>
     
     
     
      <TouchableOpacity
        style={styles.touchableopacity}
        activeOpacity={0.2}
        onPress={() => {}}
      >
        <Image
          style={styles.iconLayout}
          contentFit="cover"
          source={require("../assets/iconmonstrshoppingcart2-12.png")}
        />
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.touchableopacity}
        activeOpacity={0.2}
        onPress={() => {}}
      >
        <Image
          style={[styles.icon1, styles.iconLayout]}
          contentFit="cover"
          source={require("../assets/cardgf.gif")}
        />
      </TouchableOpacity>
     
     
      <TouchableOpacity
        style={styles.touchableopacity}
        activeOpacity={0.2}
        onPress={() => {}}
      >
        <Image
          style={[styles.icon1, styles.iconLayout]}
          contentFit="cover"
          source={require("../assets/bell1.png")}
        />
      </TouchableOpacity>


      </View>
    </View>
  );
};



export default HomePage1;
