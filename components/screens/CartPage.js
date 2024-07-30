import { Image } from "expo-image";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
    Border,
    Color,
    FontFamily,
    FontSize,
    Padding,
    StyleVariable,
} from "../GlobalStyles";

const CartPage = () => {
  return (




    <View style={styles.cartpage}>
    
      <Image
        style={[styles.notchIcon, styles.iconLayout2]}
        contentFit="cover"
        source={require("../assets/notch.png")}
      />
      <Text style={[styles.checkout, styles.textText]}>Checkout</Text>
      <View style={[styles.frameParent, styles.frameLayout]}>
        <View style={[styles.frameGroup, styles.frameLayout]}>
          <View style={styles.groupWrapper}>
            <View style={styles.tabBarItemParent}>
              <View style={[styles.tabBarItem, styles.tabItemPosition]}>
                <Image
                  style={[styles.homeIcon, styles.iconLayout1]}
                  contentFit="cover"
                  source={require("../assets/home.png")}
                />
              </View>
              <View style={[styles.tabBarItem1, styles.tabItemPosition]}>
                <Image
                  style={styles.iconmonstrShoppingCart21}
                  contentFit="cover"
                  source={require("../assets/iconmonstrshoppingcart2-1.png")}
                />
              </View>
              <Image
                style={styles.icon}
                contentFit="cover"
                source={require("../assets/00.png")}
              />
              <Image
                style={[styles.chatBubbleIcon, styles.iconLayout1]}
                contentFit="cover"
                source={require("../assets/chat-bubble.png")}
              />
              <Image
                style={styles.bellIcon}
                contentFit="cover"
                source={require("../assets/bell.png")}
              />
            </View>
          </View>
          <View
            style={[styles.iconmonstrMenu11Parent, styles.frameChildPosition]}
          >
            <Image
              style={styles.iconmonstrMenu11}
              contentFit="cover"
              source={require("../assets/iconmonstrmenu1-1.png")}
            />
            <Image
              style={[styles.frameChild, styles.frameChildPosition]}
              contentFit="cover"
              source={require("../assets/rectangle-11.png")}
            />
          </View>
          <Image
            style={[styles.icon1, styles.iconLayout2]}
            contentFit="cover"
            source={require("../assets/icon.png")}
          />
          <Text style={styles.yourOrder}>Your order</Text>
          <View style={[styles.vectorParent, styles.frameItemLayout]}>
            <Image
              style={[styles.frameItem, styles.frameItemLayout]}
              contentFit="cover"
              source={require("../assets/rectangle-95.png")}
            />
            <Text
              style={styles.brittliteCobDc}
            >{`BrittLite© COB DC 12/24V Single Colour 528L
`}</Text>
          </View>
          <Text style={[styles.pickUp, styles.deliveryTypo]}>Pick up</Text>
          <Text style={[styles.payementMethod, styles.deliveryTypo]}>
            Payement method
          </Text>
          <Text style={[styles.cash, styles.cashTypo]}>{`Cash `}</Text>
          <Image
            style={[styles.checkSquareIcon, styles.checkIconLayout]}
            contentFit="cover"
            source={require("../assets/check-square.png")}
          />
          <Text style={[styles.summary, styles.deliveryTypo]}>Summary</Text>
        </View>
        <Text style={[styles.text, styles.textPosition]}>3</Text>
        <Text style={[styles.price9, styles.textPosition]}>
          <Text style={styles.price91}>
            <Text style={styles.price}>{`price: `}</Text>
            <Text style={styles.text1}>9£</Text>
          </Text>
          <Text style={styles.text2}>{`  `}</Text>
        </Text>
      </View>
      <Text style={[styles.delivery, styles.deliveryTypo]}>{`Delivery `}</Text>
      <Text style={[styles.deliveryDetails, styles.deliveryTypo]}>
        Delivery details
      </Text>
      <View style={styles.textareaField}>
        <Text style={styles.label}>Adress</Text>
        <Text style={[styles.description, styles.textareaSpaceBlock]}>
          Description
        </Text>
        <View style={[styles.textarea, styles.buttonBorder]}>
          <Text style={[styles.value, styles.cashTypo]}>Your adress</Text>
          <Image
            style={styles.dragIcon}
            contentFit="cover"
            source={require("../assets/drag.png")}
          />
        </View>
        <Text style={[styles.description, styles.textareaSpaceBlock]}>
          Hint
        </Text>
      </View>
      <Text style={styles.selectDate}>Select date</Text>
      <Text style={[styles.total, styles.deliveryTypo]}>Total</Text>
      <Text style={[styles.text3, styles.cashTypo]}>45£</Text>
      <View style={[styles.button, styles.dateFlexBox]}>
        <Image
          style={styles.iconLayout}
          contentFit="cover"
          source={require("../assets/star1.png")}
        />
        <Text style={[styles.button1, styles.cashTypo]}>Order</Text>
        <Image
          style={[styles.xIcon, styles.iconLayout]}
          contentFit="cover"
          source={require("../assets/x1.png")}
        />
      </View>
      <Image
        style={[styles.checkSquareIcon1, styles.checkIconLayout]}
        contentFit="cover"
        source={require("../assets/check-square.png")}
      />
      <View style={styles.dateAndTimeCompactColl}>
        <View style={[styles.date, styles.dateSpaceBlock]}>
          <Text style={styles.yearTypo}>Jun 10,</Text>
          <Text style={[styles.year, styles.yearTypo]}>2024</Text>
        </View>
        <View style={[styles.time, styles.dateSpaceBlock]}>
          <Text style={styles.yearTypo}>9:41 AM</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconLayout2: {
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  textText: {
    textShadowRadius: 4,
    textShadowOffset: {
      width: 0,
      height: 4,
    },
    textShadowColor: "rgba(0, 0, 0, 0.25)",
  },
  frameLayout: {
    height: 879,
    width: 430,
    left: 0,
    position: "absolute",
  },
  tabItemPosition: {
    paddingBottom: Padding.p_5xs,
    paddingTop: Padding.p_xs,
    paddingHorizontal: Padding.p_7xl,
    flexDirection: "row",
   // left: "50%",
    position: "absolute",
  },
  iconLayout1: {
    width: 24,
    height: 24,
  },
  frameChildPosition: {
    height: 30,
    top: 0,
    position: "absolute",
  },
  frameItemLayout: {
    height: 111,
    position: "absolute",
  },
  deliveryTypo: {
    fontFamily: FontFamily.inknutAntiquaRegular,
    textAlign: "left",
    position: "absolute",
  },
  cashTypo: {
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.smallText_size,
    textAlign: "left",
  },
  checkIconLayout: {
    height: 20,
    width: 20,
    position: "absolute",
    overflow: "hidden",
  },
  textPosition: {
    left: 194,
    lineHeight: 11,
    textAlign: "left",
    position: "absolute",
  },
  textareaSpaceBlock: {
    marginTop: 8,
    alignSelf: "stretch",
  },
  buttonBorder: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: StyleVariable.radius200,
    flexDirection: "row",
    overflow: "hidden",
  },
  dateFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconLayout: {
    height: 16,
    width: 16,
    display: "none",
    overflow: "hidden",
  },
  dateSpaceBlock: {
    paddingVertical: Padding.p_7xs,
    paddingHorizontal: Padding.p_2xs,
    backgroundColor: Color.fillsTertiary,
    borderRadius: Border.br_7xs,
    flexDirection: "row",
  },
  yearTypo: {
    color: Color.colorsBlue,
    fontFamily: FontFamily.bodyRegular,
    lineHeight: 22,
    letterSpacing: 0,
    fontSize: FontSize.bodyRegular_size,
    textAlign: "center",
  },
  notchIcon: {
    right: 104,
    bottom: 902,
    left: 107,
    display: "none",
    top: 0,
  },
  checkout: {
    top: 78,
    left: 182,
    fontSize: FontSize.m3LabelLarge_size,
    fontFamily: FontFamily.kavoonRegular,
    color: "#4dae4b",
    width: 79,
    textAlign: "center",
    lineHeight: 24,
    textShadowOffset: {
      width: 0,
      height: 4,
    },
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    position: "absolute",
  },
  homeIcon: {
    height: 24,
    overflow: "hidden",
  },
  tabBarItem: {
    marginLeft: -171.35,
    width: 56,
    height: 29,
    top: 0,
  },
  iconmonstrShoppingCart21: {
    height: 22,
    width: 28,
    overflow: "hidden",
  },
  tabBarItem1: {
    marginLeft: -23.35,
    top: 1,
    width: 64,
    height: 44,
  },
  icon: {
    left: 246,
    height: 25,
    top: 10,
    width: 28,
    position: "absolute",
    overflow: "hidden",
  },
  chatBubbleIcon: {
    top: 12,
    left: 102,
    height: 24,
    position: "absolute",
  },
  bellIcon: {
    left: 311,
    width: 32,
    height: 28,
    top: 10,
    position: "absolute",
    overflow: "hidden",
  },
  tabBarItemParent: {
    marginLeft: -177,
    width: 343,
    height: 45,
    left: "50%",
    top: 0,
    position: "absolute",
  },
  groupWrapper: {
    top: 803,
    height: 76,
    width: 430,
    left: 0,
    position: "absolute",
  },
  iconmonstrMenu11: {
    marginLeft: 156.95,
    top: 6,
    width: 23,
    height: 24,
    left: "50%",
    position: "absolute",
    overflow: "hidden",
  },
  frameChild: {
    marginLeft: -179.75,
    width: 50,
    left: "50%",
  },
  iconmonstrMenu11Parent: {
    left: 30,
    width: 359,
  },
  icon1: {
    height: "1.82%",
    width: "3.72%",
    top: "4.66%",
    right: "93.02%",
    bottom: "93.52%",
    left: "3.26%",
  },
  yourOrder: {
    top: 87,
    left: 80,
    fontSize: FontSize.size_xl,
    fontFamily: FontFamily.germaniaOneRegular,
    width: 160,
    textAlign: "left",
    color: Color.graysBlack,
    lineHeight: 24,
    position: "absolute",
  },
  frameItem: {
    borderRadius: 25,
    width: 138,
    left: 0,
    height: 111,
    top: 0,
  },
  brittliteCobDc: {
    top: 20,
    left: 181,
    fontFamily: FontFamily.kiteOneRegular,
    width: 127,
    lineHeight: 11,
    fontSize: FontSize.size_3xs,
    textAlign: "left",
    color: Color.graysBlack,
    height: 25,
    position: "absolute",
  },
  vectorParent: {
    top: 149,
    left: 29,
    width: 279,
  },
  pickUp: {
    top: 263,
    left: 105,
    color: Color.colorGray_100,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.inknutAntiquaRegular,
  },
  payementMethod: {
    top: 565,
    left: 54,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.inknutAntiquaRegular,
    color: Color.graysBlack,
  },
  cash: {
    top: 615,
    left: 89,
    lineHeight: 22,
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.smallText_size,
    color: Color.graysBlack,
    position: "absolute",
  },
  checkSquareIcon: {
    top: 617,
    left: 68,
  },
  summary: {
    top: 666,
    left: 95,
    color: "#3ea436",
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.inknutAntiquaRegular,
  },
  frameGroup: {
    top: 0,
  },
  text: {
    top: 201,
    fontFamily: FontFamily.knewaveRegular,
    color: "#6ccb6b",
    fontSize: FontSize.size_3xs,
    textShadowRadius: 4,
    textShadowOffset: {
      width: 0,
      height: 4,
    },
    textShadowColor: "rgba(0, 0, 0, 0.25)",
  },
  price: {
    color: Color.colorDarkblue,
  },
  text1: {
    color: Color.graysBlack,
  },
  price91: {
    fontSize: 15,
  },
  text2: {
    color: Color.colorDarkblue,
    fontSize: FontSize.size_3xs,
  },
  price9: {
    top: 189,
    fontFamily: FontFamily.kiwiMaruRegular,
  },
  frameParent: {
    top: 41,
  },
  delivery: {
    top: 334,
    left: 55,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.inknutAntiquaRegular,
    color: Color.graysBlack,
  },
  deliveryDetails: {
    top: 369,
    left: 62,
    fontSize: FontSize.size_xs,
    color: "#38a910",
  },
  label: {
    color: Color.textDefaultDefault,
    alignSelf: "stretch",
    fontFamily: FontFamily.presetsBody2,
    lineHeight: 22,
    fontSize: FontSize.smallText_size,
    textAlign: "left",
  },
  description: {
    color: Color.textDefaultSecondary,
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.smallText_size,
    textAlign: "left",
    lineHeight: 22,
    display: "none",
  },
  value: {
    color: Color.iconDefaultTertiary,
    zIndex: 0,
    lineHeight: 22,
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.smallText_size,
    flex: 1,
  },
  dragIcon: {
    right: 6,
    bottom: 7,
    width: 7,
    height: 7,
    zIndex: 1,
    position: "absolute",
  },
  textarea: {
    borderColor: Color.borderDefaultDefault,
    paddingHorizontal: StyleVariable.space400,
    paddingVertical: StyleVariable.space300,
    minWidth: 240,
    minHeight: 80,
    marginTop: 8,
    alignSelf: "stretch",
    backgroundColor: Color.schemesOnPrimary,
  },
  textareaField: {
    top: 400,
    left: 81,
    position: "absolute",
  },
  selectDate: {
    top: 530,
    left: 82,
    fontFamily: FontFamily.presetsBody2,
    lineHeight: 22,
    fontSize: FontSize.smallText_size,
    textAlign: "left",
    color: Color.graysBlack,
    position: "absolute",
  },
  total: {
    top: 741,
    left: 94,
    color: "#236be0",
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.inknutAntiquaRegular,
  },
  text3: {
    top: 753,
    left: 213,
    lineHeight: 22,
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.smallText_size,
    color: Color.graysBlack,
    position: "absolute",
  },
  button1: {
    lineHeight: 16,
    color: Color.textBrandOnBrand,
    marginLeft: 8,
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.smallText_size,
  },
  xIcon: {
    marginLeft: 8,
  },
  button: {
    top: 798,
    left: 167,
    backgroundColor: Color.backgroundBrandDefault,
    borderColor: Color.backgroundBrandDefault,
    padding: StyleVariable.space300,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: StyleVariable.radius200,
    flexDirection: "row",
    overflow: "hidden",
    position: "absolute",
  },
  checkSquareIcon1: {
    top: 348,
    left: 24,
  },
  year: {
    marginLeft: 5,
  },
  date: {
    justifyContent: "center",
    alignItems: "center",
  },
  time: {
    marginLeft: 6,
  },
  dateAndTimeCompactColl: {
    top: 559,
    justifyContent: "flex-end",
    borderRadius: Border.br_7xs,
    alignItems: "center",
    left: 82,
    flexDirection: "row",
    position: "absolute",
  },
  cartpage: {
    width: "100%",
    height: 932,
    overflow: "hidden",
    flex: 1,
    backgroundColor: Color.schemesOnPrimary,
  },
});

export default CartPage;
