import { Image } from "expo-image";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Border, Color, FontFamily, FontSize, Padding } from "../GlobalStyles";

const HomePage = () => {
  return (
    <View style={styles.homepage}>
      <Image
        style={[styles.notchIcon, styles.iconPosition]}
        contentFit="cover"
        // source={require("../assets/notch.png")}
      />
      <View style={[styles.groupParent, styles.groupParentPosition]}>
        <View style={[styles.groupParent, styles.groupParentPosition]}>
          <View style={[styles.groupWrapper, styles.groupLayout2]}>
            <View style={[styles.groupFrame, styles.groupLayout2]}>
              <View style={[styles.groupFrame, styles.groupLayout2]}>
                <Text style={styles.suggestions}>{`suggestions `}</Text>
                <Text
                  style={[styles.viewAll, styles.labelTypo]}
                >{`view all `}</Text>
                <View style={styles.rectangleParent}>
                  <View style={[styles.groupChild, styles.groupLayout1]} />
                  <Image
                    style={[styles.groupItem, styles.groupLayout1]}
                    contentFit="cover"
                   // //source={require("../assets/rectangle-4.png")}
                  />
                  <View style={[styles.groupInner, styles.groupLayout1]} />
                  <Text style={[styles.bestSeller, styles.bestSellerTypo]}>
                    Best seller
                  </Text>
                  <Text
                    style={[styles.newDesigns, styles.bestSellerTypo]}
                  >{`new designs `}</Text>
                  <Text style={styles.ceilingCalculator}>
                    Ceiling Calculator
                  </Text>
                </View>
                <View style={styles.rectangleView} />
                <Image
                  style={[styles.rectangleIcon, styles.groupLayout]}
                  contentFit="cover"
                //source={require("../assets/rectangle-8.png")}
                />
                

                <View>
                        <Text style={[styles.wUfoCoolContainer, styles.containerTypo]}>
                            <Text style={styles.wUfoCool}>{`150W UFO Cool White `}</Text>
                            <Text style={styles.inStock}>55 in stock</Text>
                            <Text style={styles.text}>
                            <Text style={styles.text1}>{`     `}</Text>
                            <Text style={styles.text2}>10$</Text>
                            </Text>


                        </Text>
                </View>
       
                <View style={styles.vectorParent}>
                  <Image
                    style={styles.groupChild1}
                    contentFit="cover"
                 //   //source={require("../assets/rectangle-9.png")}
                  />
                  <Text
                    style={[styles.new3wLedContainer, styles.containerLayout1]}
                  >
                    <Text style={styles.new}>{`NEW
`}</Text>
                    <Text style={styles.wUfoCool}>{`3W LED Panel Cool White 
`}</Text>
                    <Text style={styles.inStock9}>
                      <Text style={styles.inStock1}>{`10 in stock `}</Text>
                      <Text style={styles.text1}>{`    `}</Text>
                      <Text style={styles.text2}>9$</Text>
                    </Text>
                  </Text>
                </View>
                <View style={[styles.vectorGroup, styles.groupLayout]}>
                  <Image
                    style={[styles.groupChild2, styles.groupLayout]}
                    contentFit="cover"
                   // //source={require("../assets/rectangle-91.png")}
                  />
                  <Text style={styles.wBlueSurfaceContainer}>
                    <Text style={styles.wBlueSurfaceContainer1}>
                      <Text
                        style={styles.wUfoCool}
                      >{`18+6W Blue Surface Led Panel Cool White
`}</Text>
                      <Text style={styles.inStock9}>
                        <Text style={styles.inStock1}>{`70 in stock `}</Text>
                        <Text style={styles.text1}>{`   `}</Text>
                        <Text style={styles.text2}> 9$</Text>
                      </Text>
                    </Text>
                  </Text>
                </View>
                <View style={[styles.vectorContainer, styles.containerLayout]}>
                  <Image
                    style={styles.groupChild3}
                    contentFit="cover"
                    ////source={require("../assets/rectangle-92.png")}
                  />
                  <Text
                    style={[
                      styles.borderless24wCeilingContainer,
                      styles.containerLayout,
                    ]}
                  >
                    <Text style={styles.borderless24wCeilingLampCo}>
                      <Text
                        style={styles.wUfoCool}
                      >{`BORDERLESS 24W CEILING LAMP Cool White
`}</Text>
                      <Text style={styles.inStock9}>
                        <Text style={styles.inStock1}>{`31 in stock `}</Text>
                        <Text style={styles.text1}>{`   `}</Text>
                        <Text style={styles.text2}>{` 9$
`}</Text>
                      </Text>
                    </Text>
                    <Text style={styles.blankLine}> </Text>
                  </Text>
                </View>
                <View style={[styles.groupView, styles.groupLayout]}>
                  <Image
                    style={[styles.groupChild4, styles.groupChildPosition]}
                    contentFit="cover"
                    //source={require("../assets/rectangle-93.png")}
                  />
                  <Text
                    style={[
                      styles.brittliteCobDcContainer,
                      styles.containerLayout1,
                    ]}
                  >
                    <Text
                      style={styles.wUfoCool}
                    >{`BrittLite© COB DC 12/24V Single Colour 528L
`}</Text>
                    <Text style={styles.inStock9}>
                      <Text style={styles.inStock1}>8 in stock</Text>
                      <Text style={styles.text1}>{`     `}</Text>
                      <Text style={styles.text2}>9$</Text>
                    </Text>
                  </Text>
                </View>
                <View style={[styles.vectorParent1, styles.groupChild5Layout]}>
                  <Image
                    style={[styles.groupChild5, styles.groupChild5Layout]}
                    contentFit="cover"
                    //source={require("../assets/rectangle-94.png")}
                  />
                  <Text
                    style={[
                      styles.newBrittliteDcContainer,
                      styles.containerTypo,
                    ]}
                  >
                    <Text style={styles.new}>{`NEW
`}</Text>
                    <Text
                      style={styles.wUfoCool}
                    >{`BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum
`}</Text>
                    <Text style={styles.inStock9}>
                      <Text style={styles.inStock5}>100 in stock</Text>
                      <Text style={styles.text1}>{`    `}</Text>
                      <Text style={styles.text2}> 9$</Text>
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.frameWrapper, styles.frameWrapperLayout]}>
            <View
              style={[styles.homeIndicatorParent, styles.frameWrapperLayout]}
            >
              <View style={[styles.homeIndicator, styles.groupParentPosition]}>
                <View
                  style={[styles.homeIndicator1, styles.rightSidePosition]}
                />
                <View style={styles.homeIndicatorChild} />
              </View>
              <View style={[styles.tabBarItemParent, styles.rightSidePosition]}>
                <View style={[styles.tabBarItem, styles.tabItemPosition]}>
                  <Image
                    style={[styles.homeIcon, styles.iconLayout1]}
                    contentFit="cover"
                    //source={require("../assets/home.png")}
                  />
                </View>
                <View style={[styles.tabBarItem1, styles.tabItemPosition]}>
                  <Image
                    style={[styles.iconmonstrShoppingCart21, styles.iconLayout]}
                    contentFit="cover"
                    //source={require("../assets/iconmonstrshoppingcart2-1.png")}
                  />
                </View>
                <Image
                  style={[styles.icon, styles.iconLayout]}
                  contentFit="cover"
                  //source={require("../assets/00.png")}
                />
              </View>
              <Image
                style={[styles.chatBubbleIcon, styles.iconLayout1]}
                contentFit="cover"
                //source={require("../assets/chat-bubble.png")}
              />
            </View>
          </View>
          <View style={[styles.searchInput, styles.tabItemPosition]}>
            <Text style={[styles.label, styles.labelTypo]} numberOfLines={1}>
              Search
            </Text>
            <Image
              style={[styles.searchIcon, styles.iconLayout1]}
              contentFit="cover"
              //source={require("../assets/search.png")}
            />
          </View>
          <View style={[styles.groupWrapper1, styles.groupWrapperLayout]}>
            <View style={[styles.groupWrapper2, styles.leftSideIconPosition]}>
              <View style={[styles.groupWrapper2, styles.leftSideIconPosition]}>
                <View style={[styles.rightSide, styles.rightSidePosition]}>
                  <Image
                    style={[styles.batteryIcon, styles.batteryIconPosition]}
                    contentFit="cover"
                    //source={require("../assets/battery.png")}
                  />
                  <Image
                    style={styles.wifiIcon}
                    contentFit="cover"
                    //source={require("../assets/wifi.png")}
                  />
                  <Image
                    style={styles.mobileSignalIcon}
                    contentFit="cover"
                    //source={require("../assets/mobile-signal.png")}
                  />
                  <Image
                    style={[styles.recordingIndicatorIcon, styles.iconPosition]}
                    contentFit="cover"
                    //source={require("../assets/recording-indicator.png")}
                  />
                </View>
                <Image
                  style={[styles.leftSideIcon, styles.leftSideIconPosition]}
                  contentFit="cover"
                  //source={require("../assets/left-side.png")}
                />
                <Image
                  style={[styles.iconmonstrMenu11, styles.batteryIconPosition]}
                  contentFit="cover"
                  //source={require("../assets/iconmonstrmenu1-1.png")}
                />
                <Image
                  style={[styles.groupChild6, styles.groupChild6Position]}
                  contentFit="cover"
                  //source={require("../assets/rectangle-11.png")}
                />
              </View>
            </View>
          </View>
        </View>
        <Image
          style={[styles.tabBarItem2, styles.groupChild6Position]}
          contentFit="cover"
          //source={require("../assets/tab-bar-item.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconPosition: {
    display: "none",
    position: "absolute",
  },
  groupParentPosition: {
    width: 430,
    left: 0,
    position: "absolute",
  },
  groupLayout2: {
    height: 662,
    width: 382,
    position: "absolute",
  },
  labelTypo: {
    fontSize: FontSize.smallText_size,
    color: Color.colorGray_100,
    textAlign: "left",
    lineHeight: 24,
  },
  groupLayout1: {
    width: 114,
    borderRadius: Border.br_xl,
    height: 55,
    top: 0,
    position: "absolute",
  },
  bestSellerTypo: {
    fontSize: FontSize.m3LabelLarge_size,
    top: 15,
    height: 24,
    textAlign: "left",
    fontFamily: FontFamily.kavoonRegular,
    lineHeight: 24,
    position: "absolute",
  },
  groupLayout: {
    width: 126,
    position: "absolute",
  },
  containerTypo: {
    fontSize: FontSize.size_3xs,
    textAlign: "left",
  },
  containerLayout1: {
    height: 61,
    fontSize: FontSize.size_3xs,
    width: 114,
    textAlign: "left",
    position: "absolute",
  },
  containerLayout: {
    width: 131,
    position: "absolute",
  },
  groupChildPosition: {
    height: 112,
    left: 0,
    top: 0,
  },
  groupChild5Layout: {
    width: 128,
    position: "absolute",
  },
  frameWrapperLayout: {
    height: 76,
    width: 430,
    left: 0,
    position: "absolute",
  },
  rightSidePosition: {
    left: "50%",
    position: "absolute",
  },
  tabItemPosition: {
    paddingBottom: Padding.p_5xs,
    flexDirection: "row",
    position: "absolute",
  },
  iconLayout1: {
    width: 24,
    height: 24,
  },
  iconLayout: {
    width: 28,
    overflow: "hidden",
  },
  groupWrapperLayout: {
    height: 71,
    width: 374,
  },
  leftSideIconPosition: {
    marginLeft: -187,
    left: "50%",
    top: 0,
    position: "absolute",
  },
  batteryIconPosition: {
    width: 23,
    left: "50%",
    position: "absolute",
  },
  groupChild6Position: {
    width: 50,
    left: "50%",
    position: "absolute",
  },
  notchIcon: {
    right: 104,
    bottom: 902,
    left: 107,
    maxWidth: "100%",
    maxHeight: "100%",
    top: 0,
    overflow: "hidden",
  },
  suggestions: {
    fontSize: 20,
    width: 115,
    height: 24,
    textAlign: "left",
    lineHeight: 24,
    color: Color.graysBlack,
    fontFamily: FontFamily.kavoonRegular,
    left: 0,
    top: 0,
    position: "absolute",
  },
  viewAll: {
    left: 313,
    width: 61,
    color: Color.colorGray_100,
    height: 24,
    fontFamily: FontFamily.kavoonRegular,
    fontSize: FontSize.smallText_size,
    top: 0,
    position: "absolute",
  },
  groupChild: {
    left: 136,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  groupItem: {
    left: 268,
  },
  groupInner: {
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowRadius: 19,
    elevation: 19,
    shadowOpacity: 1,
    backgroundColor: Color.graysBlack,
    left: 0,
  },
  bestSeller: {
    left: 20,
    color: Color.schemesOnPrimary,
    width: 71,
  },
  newDesigns: {
    left: 151,
    width: 84,
    color: Color.colorGray_100,
  },
  ceilingCalculator: {
    top: 3,
    left: 275,
    textAlign: "center",
    height: 49,
    width: 105,
    fontSize: FontSize.m3LabelLarge_size,
    color: Color.colorGray_100,
    fontFamily: FontFamily.kavoonRegular,
    lineHeight: 24,
    position: "absolute",
  },
  rectangleParent: {
    top: 57,
    height: 55,
    width: 382,
    left: 0,
    position: "absolute",
  },
  rectangleView: {
    top: 377,
    left: 8,
    width: 140,
    height: 197,
    position: "absolute",
  },
  rectangleIcon: {
    top: 144,
    height: 124,
    left: 43,
  },
  wUfoCool: {
    fontFamily: FontFamily.kleeOneRegular,
    color: Color.graysBlack,
  },
  inStock: {
    color: Color.colorRed,
    fontFamily: FontFamily.kiwiMaruRegular,
  },
  text1: {
    color: Color.graysBlack,
  },
  text2: {
    color: Color.colorLimegreen,
  },
  text: {
    fontFamily: FontFamily.kleeOneRegular,
  },
  wUfoCoolContainer: {
    top: 274,
    height: 30,
    lineHeight: 15,
    left: 43,
    width: 105,
    fontSize: FontSize.size_3xs,
    position: "absolute",
  },
  groupChild1: {
    width: 125,
    height: 123,
    left: 0,
    top: 0,
    position: "absolute",
  },
  new: {
    color: Color.colorLimegreen,
    fontFamily: FontFamily.kiwiMaruRegular,
  },
  inStock1: {
    color: Color.colorRed,
  },
  inStock9: {
    fontFamily: FontFamily.kiwiMaruRegular,
  },
  new3wLedContainer: {
    top: 123,
    left: 13,
    lineHeight: 15,
  },
  vectorParent: {
    top: 139,
    left: 225,
    width: 127,
    height: 183,
    position: "absolute",
  },
  groupChild2: {
    height: 113,
    left: 0,
    top: 0,
  },
  wBlueSurfaceContainer1: {
    width: "100%",
  },
  wBlueSurfaceContainer: {
    top: 108,
    left: 15,
    fontSize: 9,
    display: "flex",
    width: 109,
    alignItems: "center",
    lineHeight: 11,
    height: 49,
    textAlign: "left",
    position: "absolute",
  },
  vectorGroup: {
    top: 323,
    left: 39,
    height: 157,
  },
  groupChild3: {
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
    fontFamily: FontFamily.kleeOneRegular,
    lineHeight: 15,
    color: Color.graysBlack,
  },
  borderless24wCeilingContainer: {
    top: 102,
    height: 51,
    fontSize: FontSize.size_3xs,
    textAlign: "left",
    left: 0,
  },
  vectorContainer: {
    top: 322,
    height: 153,
    left: 238,
  },
  groupChild4: {
    width: 124,
    position: "absolute",
  },
  brittliteCobDcContainer: {
    top: 117,
    left: 12,
    lineHeight: 11,
  },
  groupView: {
    top: 484,
    left: 40,
    height: 177,
  },
  groupChild5: {
    height: 112,
    left: 0,
    top: 0,
  },
  inStock5: {
    color: "#af1818",
  },
  newBrittliteDcContainer: {
    top: 122,
    left: 3,
    width: 104,
    height: 65,
    lineHeight: 11,
    position: "absolute",
  },
  vectorParent1: {
    top: 475,
    height: 186,
    left: 238,
  },
  groupFrame: {
    left: 0,
    top: 0,
  },
  groupWrapper: {
    top: 171,
    left: 21,
  },
  homeIndicator1: {
    marginLeft: -67,
    bottom: 8,
    borderRadius: Border.br_81xl,
    width: 134,
    height: 5,
    backgroundColor: Color.graysBlack,
  },
  homeIndicatorChild: {
    width: 301,
    height: 63,
    left: 0,
    top: 0,
    position: "absolute",
  },
  homeIndicator: {
    height: 34,
    top: 41,
  },
  homeIcon: {
    overflow: "hidden",
  },
  tabBarItem: {
    marginLeft: -137,
    width: 56,
    height: 29,
    paddingTop: Padding.p_xs,
    paddingHorizontal: Padding.p_7xl,
    paddingBottom: Padding.p_5xs,
    flexDirection: "row",
    left: "50%",
    top: 0,
  },
  iconmonstrShoppingCart21: {
    height: 22,
  },
  tabBarItem1: {
    marginLeft: 11,
    top: 1,
    width: 64,
    height: 44,
    paddingTop: Padding.p_xs,
    paddingHorizontal: Padding.p_7xl,
    paddingBottom: Padding.p_5xs,
    flexDirection: "row",
    left: "50%",
  },
  icon: {
    top: 10,
    left: 246,
    height: 25,
    position: "absolute",
  },
  tabBarItemParent: {
    marginLeft: -177,
    width: 274,
    height: 45,
    top: 0,
  },
  chatBubbleIcon: {
    top: 12,
    left: 140,
    position: "absolute",
  },
  homeIndicatorParent: {
    top: 0,
  },
  frameWrapper: {
    top: 856,
  },
  label: {
    fontFamily: FontFamily.presetsBody2,
    width: 219,
    color: Color.colorGray_100,
    overflow: "hidden",
  },
  searchIcon: {
    marginLeft: 12,
    overflow: "hidden",
  },
  searchInput: {
    top: 99,
    left: 69,
    borderRadius: Border.br_5xs,
    borderStyle: "solid",
    borderColor: Color.colorGainsboro_200,
    borderWidth: 1,
    width: 280,
    height: 41,
    paddingLeft: Padding.p_xs,
    paddingTop: Padding.p_5xs,
    paddingRight: Padding.p_base,
    paddingBottom: Padding.p_5xs,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.schemesOnPrimary,
  },
  batteryIcon: {
    marginLeft: 8.5,
    height: 11,
    top: 0,
  },
  wifiIcon: {
    width: 14,
    height: 11,
  },
  mobileSignalIcon: {
    width: 16,
    height: 11,
  },
  recordingIndicatorIcon: {
    top: -9,
    right: 53,
    width: 6,
    height: 6,
  },
  rightSide: {
    marginLeft: 123.8,
    top: 5,
    width: 63,
    height: 11,
  },
  leftSideIcon: {
    width: 51,
    height: 21,
  },
  iconmonstrMenu11: {
    marginLeft: 150.6,
    top: 47,
    height: 24,
    overflow: "hidden",
  },
  groupChild6: {
    marginLeft: -186.1,
    top: 41,
    height: 30,
  },
  groupWrapper2: {
    height: 71,
    width: 374,
  },
  groupWrapper1: {
    marginLeft: -186,
    left: "50%",
    position: "absolute",
    top: 0,
  },
  groupParent: {
    top: 0,
    height: 932,
  },
  tabBarItem2: {
    marginLeft: 109,
    height: 42,
    top: 856,
  },
  homepage: {
    flex: 1,
    overflow: "hidden",
    height: 932,
    width: "100%",
    backgroundColor: Color.schemesOnPrimary,
  },
});

export default HomePage;
