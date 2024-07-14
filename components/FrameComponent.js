import * as React from "react";
import {
  StyleProp,
  ViewStyle,
  Pressable,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { Image } from "expo-image";
import { FontFamily, Border, FontSize, Color, Padding } from "../GlobalStyles";

const FrameComponent = ({ style }) => {
  return (
    <View style={[styles.frameParent, style]}>
      <Pressable style={[styles.frame, styles.frameLayout1]}>
        <View style={[styles.frame1, styles.frameFlexBox1]}>
          <View style={[styles.frame2, styles.frameFlexBox]}>
            <Text
              style={[styles.suggestions, styles.viewAllTypo]}
            >{`suggestions `}</Text>
            <Text
              style={[styles.viewAll, styles.viewAllTypo]}
            >{`view all `}</Text>
          </View>
        </View>
        <Pressable style={styles.frame3}>
          <View style={[styles.frameChild, styles.framePosition]} />
          <Image
            style={[styles.frameItem, styles.framePosition]}
            contentFit="cover"
            source={require("../assets/rectangle-4.png")}
          />
          <View style={[styles.frameInner, styles.framePosition]} />
          <Text style={[styles.bestSeller, styles.bestSellerTypo]}>
            Best seller
          </Text>
          <Text
            style={[styles.newDesigns, styles.bestSellerTypo]}
          >{`new designs `}</Text>
          <Text
            style={[styles.ceilingCalculator, styles.ceilingCalculatorLayout]}
          >
            Ceiling Calculator
          </Text>
        </Pressable>
      </Pressable>
      <View style={styles.frame4}>
        <View style={styles.frame5}>
          <View style={[styles.frame6, styles.frameFlexBox1]}>
            <View style={styles.frame7}>
              <Image
                style={styles.rectangleIcon}
                contentFit="cover"
                source={require("../assets/rectangle-8.png")}
              />
              <Text style={[styles.wUfoCoolContainer, styles.containerTypo]}>
                <Text style={styles.wUfoCool}>{`150W UFO Cool White
`}</Text>
                <Text style={styles.inStock}>55 in stock</Text>
                <Text style={styles.text}>
                  <Text style={styles.text1}>{`     `}</Text>
                  <Text style={styles.text2}>10$</Text>
                </Text>
              </Text>
              <Image
                style={[styles.frameChild1, styles.frameChildPosition]}
                contentFit="cover"
                source={require("../assets/rectangle-9.png")}
              />
              <Text style={[styles.new3wLedContainer, styles.containerLayout]}>
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
          </View>
        </View>
        <View style={styles.frame5}>
          <View style={[styles.frame8, styles.frameFlexBox1]}>
            <View style={[styles.frameGroup, styles.frameLayout]}>
              <View style={[styles.frame9, styles.frameFlexBox1]}>
                <View style={styles.frame10}>
                  <Image
                    style={[styles.frameChild2, styles.frameChildPosition]}
                    contentFit="cover"
                    source={require("../assets/rectangle-91.png")}
                  />
                  <Text
                    style={[
                      styles.wBlueSurfaceContainer,
                      styles.ceilingCalculatorLayout,
                    ]}
                  >
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
                <Image
                  style={styles.frameChild3}
                  contentFit="cover"
                  source={require("../assets/rectangle-92.png")}
                />
                <Text
                  style={[
                    styles.brittliteCobDcContainer,
                    styles.containerLayout,
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
              <View style={[styles.frame12, styles.frameLayout]}>
                <Text
                  style={[styles.newBrittliteDcContainer, styles.containerTypo]}
                >
                  <Text style={styles.new}>{`NEW
`}</Text>
                  <Text
                    style={styles.wUfoCool}
                  >{`BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum
`}</Text>
                  <Text style={styles.inStock9}>
                    <Text style={styles.inStock4}>100 in stock</Text>
                    <Text style={styles.text1}>{`    `}</Text>
                    <Text style={styles.text2}> 9$</Text>
                  </Text>
                </Text>
                <Image
                  style={styles.frameChild4}
                  contentFit="cover"
                  source={require("../assets/rectangle-93.png")}
                />
                <Image
                  style={[styles.frameChild5, styles.frameChildPosition]}
                  contentFit="cover"
                  source={require("../assets/rectangle-94.png")}
                />
                <Text
                  style={[
                    styles.borderless24wCeilingContainer,
                    styles.containerTypo,
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
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameLayout1: {
    width: 408,
    justifyContent: "center",
  },
  frameFlexBox1: {
    alignItems: "flex-end",
    overflow: "hidden",
  },
  frameFlexBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllTypo: {
    fontFamily: FontFamily.kavoonRegular,
    lineHeight: 24,
    textAlign: "left",
    height: 24,
  },
  framePosition: {
    width: 114,
    borderRadius: Border.br_xl,
    left: "50%",
    top: "50%",
    marginTop: -27.35,
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
    textAlign: "left",
    position: "absolute",
  },
  frameChildPosition: {
    top: 0,
    position: "absolute",
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
  suggestions: {
    fontSize: FontSize.size_xl,
    width: 115,
    textAlign: "left",
    color: Color.colorBlack,
  },
  viewAll: {
    fontSize: FontSize.singleLineBodyBase_size,
    width: 61,
    marginLeft: 219,
    color: Color.colorGray_100,
    textAlign: "left",
  },
  frame2: {
    width: 395,
    height: 24,
    flexDirection: "row",
    overflow: "hidden",
  },
  frame1: {
    justifyContent: "center",
    width: 408,
  },
  frameChild: {
    marginLeft: -55,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  frameItem: {
    marginLeft: 77,
  },
  frameInner: {
    marginLeft: -191,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowRadius: 19,
    elevation: 19,
    shadowOpacity: 1,
    backgroundColor: Color.colorBlack,
  },
  bestSeller: {
    marginLeft: -171,
    color: Color.colorWhite,
    width: 71,
    marginTop: -12.15,
    fontSize: FontSize.size_sm,
    textAlign: "left",
    height: 24,
    position: "absolute",
  },
  newDesigns: {
    marginLeft: -40,
    width: 84,
    marginTop: -12.15,
    fontSize: FontSize.size_sm,
    textAlign: "left",
    height: 24,
    position: "absolute",
    color: Color.colorGray_100,
  },
  ceilingCalculator: {
    marginTop: -24.35,
    marginLeft: 84,
    textAlign: "center",
    width: 105,
    fontSize: FontSize.size_sm,
    left: "50%",
    top: "50%",
    fontFamily: FontFamily.kavoonRegular,
    lineHeight: 24,
    color: Color.colorGray_100,
  },
  frame3: {
    marginTop: 32,
    height: 55,
    overflow: "hidden",
    width: 382,
  },
  frame: {
    left: -13,
    height: 111,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    top: 0,
    position: "absolute",
  },
  rectangleIcon: {
    top: 5,
    height: 124,
    width: 126,
    left: 0,
    position: "absolute",
  },
  wUfoCool: {
    fontFamily: FontFamily.kleeOneRegular,
    color: Color.colorBlack,
  },
  inStock: {
    color: Color.colorRed,
    fontFamily: FontFamily.kiwiMaruRegular,
  },
  text1: {
    color: Color.colorBlack,
  },
  text2: {
    color: Color.colorLimegreen,
  },
  text: {
    fontFamily: FontFamily.kleeOneRegular,
  },
  wUfoCoolContainer: {
    top: 135,
    height: 30,
    lineHeight: 15,
    left: 0,
    width: 105,
  },
  frameChild1: {
    left: 182,
    width: 125,
    height: 123,
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
    left: 195,
    lineHeight: 15,
    position: "absolute",
  },
  frame7: {
    width: 309,
    height: 183,
    overflow: "hidden",
  },
  frame6: {
    width: 352,
    justifyContent: "center",
  },
  frame5: {
    justifyContent: "center",
    overflow: "hidden",
    width: 382,
  },
  frameChild2: {
    height: 113,
    width: 126,
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
    width: 109,
    lineHeight: 11,
    textAlign: "left",
    alignItems: "center",
  },
  frame10: {
    height: 157,
    width: 126,
    overflow: "hidden",
  },
  frameChild3: {
    width: 124,
    marginTop: 4,
    height: 112,
  },
  brittliteCobDcContainer: {
    marginTop: 4,
    lineHeight: 11,
  },
  frame9: {
    width: 127,
    height: 338,
    paddingTop: 0,
    paddingRight: Padding.p_12xs,
    paddingBottom: 0,
  },
  inStock4: {
    color: Color.colorFirebrick,
  },
  newBrittliteDcContainer: {
    top: 275,
    left: 3,
    width: 104,
    height: 65,
    lineHeight: 11,
  },
  frameChild4: {
    top: 153,
    width: 128,
    height: 112,
    left: 0,
    position: "absolute",
  },
  frameChild5: {
    left: 2,
    width: 110,
    height: 97,
  },
  borderless24wCeilingLampCo: {
    lineHeight: 11,
  },
  blankLine: {
    fontFamily: FontFamily.kleeOneRegular,
    lineHeight: 15,
    color: Color.colorBlack,
  },
  borderless24wCeilingContainer: {
    top: 102,
    height: 51,
    width: 131,
    left: 0,
  },
  frame12: {
    marginLeft: 72,
    width: 131,
  },
  frameGroup: {
    width: 330,
    flexDirection: "row",
    alignItems: "center",
  },
  frame8: {
    width: 369,
    justifyContent: "center",
  },
  frame4: {
    top: 139,
    left: 0,
    alignItems: "center",
    overflow: "hidden",
    position: "absolute",
    width: 382,
  },
  frameParent: {
    height: 662,
    width: 382,
  },
});

export default FrameComponent;
