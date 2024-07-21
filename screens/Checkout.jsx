import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CheckBox } from "@rneui/themed";
import VariantNeutralStateHover from "../components/VariantNeutralStateHover";
import Frame from "../components/Frame";
import { FontFamily, FontSize, Color } from "../GlobalStyles";

const Checkout = () => {
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [CardChecked, setCardChecked] = useState(false);
  const [CashChecked, setCashChecked] = useState(false);

  const handleDeliveryCheck = () => {
    setCardChecked(true);
    setCashChecked(false);
  };

  const handlePickUpCheck = () => {
    setCardChecked(false);
    setCashChecked(true);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate || date);
    hideDatePicker();
  };

  // State for products
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "18+6W Blue Surface Led Panel Cool White",
      price: "9£",
      quantity: 1,
      image: require("../assets/x2.png"),
    },
    {
      id: 2,
      name: "BrittLite© COB DC 12/24V Single Colour 528L",
      price: "9£",
      quantity: 4,
      image: require("../assets/x2.png"),
    },
  ]);

  const getTotalQuantity = () => {
    return products.reduce((total, product) => total + product.quantity, 0);
  };

  const getTotalOrder = () => {
    return products.reduce((total, product) => {
      const priceNumber = parseFloat(product.price.replace('£', ''));
      return total + priceNumber * product.quantity;
    }, 0);
  };

  const getProductTotalPrice = (price, quantity) => {
    const priceNumber = parseFloat(price.replace('£', ''));
    return (priceNumber * quantity) + '£';
  };

  return (
    <View style={styles.checkout}>
      <Pressable style={styles.frame}>
        <VariantNeutralStateHover
          star={require("../assets/star1.png")}
          label="Order"
          x={require("../assets/x1.png")}
          hasIconStart={false}
          hasIconEnd={false}
          variantNeutralStateHoverPosition="absolute"
          variantNeutralStateHoverBackgroundColor="green"
          variantNeutralStateHoverBorderColor="green"
          variantNeutralStateHoverTop="50%"
          variantNeutralStateHoverLeft="50%"
          variantNeutralStateHoverWidth="set"
          variantNeutralStateHoverMarginTop={-20}
          variantNeutralStateHoverMarginLeft={28.5}
        />
      </Pressable>
      <View style={styles.addressContainer}>
        <Text style={styles.addressLabel}>Your address</Text>
        <TextInput
          style={styles.addressInput}
          placeholderTextColor="#1e1e1e"
        />
      </View>
      <View style={styles.datePickerContainer}>
        <Text style={styles.datePickerLabel}>Select Date</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
          <Text style={styles.dateText}>{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={date}
          display="default"
        />
      </View>
      <View style={styles.paymentMethodContainer}>
        <Text style={[styles.paymentMethod, styles.summaryTypo]}>Payment method</Text>
        <View style={styles.paymentOptionContainer}>
          <CheckBox
            checked={CardChecked}
            onPress={handleDeliveryCheck}
            containerStyle={styles.checkBoxOutlineBlankLayout}
          />
          <Text style={[styles.cash, styles.textTypo1]}>Cash</Text>
        </View>
        <View style={styles.paymentOptionContainer}>
          <CheckBox
            checked={CashChecked}
            onPress={handlePickUpCheck}
            containerStyle={styles.checkSquareLayout}
          />
          <Text style={[styles.cash, styles.textTypo1]}>Card ( We will contact You to finish the payment )</Text>
        </View>
      </View>
      <View style={[styles.frame5, styles.frame5Layout]}>
        <View style={[styles.product2, styles.frame5Layout]}>
          <Text style={[styles.text, styles.textTypo1]}>
           {`${getProductTotalPrice("9", 1)}`}
          </Text>
          <Text style={[styles.wBlueSurface, styles.wBlueSurfaceTypo]}>
            18+6W Blue Surface Led Panel Cool White
          </Text>
          <Image
            style={[styles.xIcon, styles.xIconPosition]}
            contentFit="cover"
            source={require("../assets/x2.png")}
          />
          <Text style={[styles.text1, styles.textTypo]}>1</Text>
        </View>
      </View>
      <View style={styles.frame6}>
        <View style={[styles.product1, styles.text2Position]}>
          <Image
            style={[styles.xIcon1, styles.text3Position]}
            contentFit="cover"
            source={require("../assets/x2.png")}
          />
          <Text style={[styles.text2, styles.text2Position]}>
            {getProductTotalPrice("9£", 4)}
          </Text>
          <Text style={[styles.brittliteCobDc, styles.wBlueSurfaceTypo]}>
            BrittLite© COB DC 12/24V Single Colour 528L
          </Text>
          <Text style={[styles.text3, styles.text3Position]}>4</Text>
        </View>
      </View>
      <View style={[styles.frame9, styles.frameLayout1]}>
        <View style={[styles.frame10, styles.frame10Position]}>
          <Text style={[styles.products, styles.totalPosition]}>
            {`${getTotalQuantity()} products`}
          </Text>
          <Text style={[styles.yourOrder, styles.frame10Position]}>Your order</Text>
        </View>
      </View>
      <View style={[styles.frame7, styles.frameLayout2]}>
        <Image
          style={[styles.frameChild, styles.frameLayout2]}
          contentFit="cover"
          source={require("../assets/rectangle-111.png")}
        />
      </View>
      <View style={styles.frame8}>
        <Pressable>
          <Image
            style={[styles.icon, styles.iconPosition]}
            contentFit="cover"
            source={require("../assets/icon.png")}
          />
        </Pressable>
        <Text style={[styles.checkout1, styles.checkout1Layout]}>Checkout</Text>
      </View>
      <View style={[styles.frame9, styles.frameLayout1]}>
        <View style={[styles.frame10, styles.frame10Position]}>
          <Text style={[styles.yourOrder, styles.frame10Position]}>Your order</Text>
        </View>
      </View>
      <Frame />
      <View style={[styles.frame13, styles.frameLayout]}>
        <View style={[styles.frame14, styles.frameLayout]}>
          <Text style={[styles.text4, styles.textTypo1]}>
            {`${getTotalOrder()}£`}
          </Text>
          <Text style={[styles.total, styles.totalPosition]}>Total</Text>
          <Text style={[styles.summary, styles.iconPosition]}>Summary</Text>
        </View>
      </View>
      <View style={[styles.footer]}>
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

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 60,
    backgroundColor: Color.colorWhite,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: "#ccc",
  },
  touchableopacity: {
    width: "5%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon1: {
    overflow: "hidden",
  },
  iconLayout: {
    height: "100%",
    width: "100%",
  },
  summaryTypo: {
    textAlign: "left",
    fontFamily: FontFamily.inknutAntiquaRegular,
    fontSize: FontSize.size_lg,
  },
  textTypo1: {
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
  },
  frame5Layout: {
    height: 25,
    position: "absolute",
  },
  wBlueSurfaceTypo: {
    fontFamily: FontFamily.kiteOneRegular,
    lineHeight: 11,
    fontSize: FontSize.size_3xs,
    height: 25,
    left: "50%",
    top: "50%",
    textAlign: "left",
    color: Color.colorBlack,
    position: "absolute",
  },
  xIconPosition: {
    height: 15,
    width: 15,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  textTypo: {
    fontFamily: FontFamily.langarRegular,
    fontSize: FontSize.size_mini,
    lineHeight: 11,
    textAlign: "left",
    color: Color.colorBlack,
  },
  text2Position: {
    marginTop: -13.5,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  text3Position: {
    marginTop: -6.5,
    height: 15,
    width: 15,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  frameLayout2: {
    height: 30,
    position: "absolute",
  },
  iconPosition: {
    left: 0,
    position: "absolute",
  },
  checkout1Layout: {
    lineHeight: 24,
    textAlign: "left",
  },
  frameLayout1: {
    height: 50,
    overflow: "hidden",
  },
  frame10Position: {
    left: 12,
    top: 0,
    position: "absolute",
  },
  totalPosition: {
    marginTop: -6,
    left: "50%",
    top: "50%",
    textAlign: "left",
    fontFamily: FontFamily.inknutAntiquaRegular,
    position: "absolute",
  },
  frameLayout: {
    height: 80,
    position: "absolute",
    overflow: "hidden",
  },
  frame: {
    top: 803,
    left: 22,
    width: 219,
    height: 40,
    position: "absolute",
    overflow: "hidden",
  },
  paymentMethodContainer: {
    top: 511,
    left: 14,
    width: 301,
    position: "absolute",
  },
  paymentOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  paymentMethod: {
    color: Color.colorBlack,
  },
  addressContainer: {
    top: 401,
    width: 301,
    left: 14,
    position: "absolute",
  },
  addressLabel: {
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
    color: Color.colorBlack,
    marginBottom: 5,
  },
  addressInput: {
    borderColor: "#9ee1f4",
    borderWidth: 1,
    padding: 10,
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
    textAlign: "center",
    borderRadius: 10,
  },
  datePickerContainer: {
    top: 461,
    width: 301,
    left: 14,
    position: "absolute",
  },
  datePickerLabel: {
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
    color: Color.colorBlack,
    marginBottom: 5,
  },
  dateInput: {
    borderColor: "#9ee1f4",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  dateText: {
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
    color: Color.colorBlack,
  },
  text: {
    marginLeft: 132.5,
    marginTop: -12.5,
    lineHeight: 22,
    fontFamily: FontFamily.presetsBody2,
    textAlign: "left",
    color: Color.colorBlack,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  wBlueSurface: {
    marginLeft: -114.5,
    width: 127,
    marginTop: -12.5,
  },
  xIcon: {
    marginTop: -10.5,
    marginLeft: -145.5,
    overflow: "hidden",
  },
  text1: {
    marginTop: -5.5,
    marginLeft: -153.5,
    height: 15,
    width: 15,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  product2: {
    left: 35,
    width: 307,
    top: 0,
  },
  frame5: {
    top: 229,
    width: 342,
    left: 14,
    overflow: "hidden",
  },
  xIcon1: {
    marginLeft: -145.5,
    overflow: "hidden",
  },
  text2: {
    marginLeft: 125.5,
    fontFamily: FontFamily.presetsBody2,
    fontSize: FontSize.presetsBody2_size,
    lineHeight: 22,
    textAlign: "left",
    color: Color.colorBlack,
  },
  brittliteCobDc: {
    marginTop: -11.5,
    marginLeft: -116.5,
    width: 133,
  },
  text3: {
    marginLeft: -156.5,
    fontFamily: FontFamily.langarRegular,
    fontSize: FontSize.size_mini,
    lineHeight: 11,
    textAlign: "left",
    color: Color.colorBlack,
  },
  product1: {
    marginLeft: -140.5,
    width: 313,
    height: 27,
  },
  frame6: {
    top: 191,
    width: 345,
    height: 27,
    left: 14,
    position: "absolute",
    overflow: "hidden",
  },
  frameChild: {
    left: 16,
    width: 50,
    top: 0,
  },
  frame7: {
    top: 41,
    width: 66,
    overflow: "hidden",
    left: 14,
  },
  icon: {
    top: 4,
    width: 16,
    height: 16,
  },
  checkout1: {
    marginTop: -12,
    marginLeft: 36.6,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.kavoonRegular,
    color: "#4dae4b",
    width: 79,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: {
      width: 0,
      height: 4,
    },
    textShadowRadius: 4,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  frame8: {
    top: 78,
    width: 231,
    height: 24,
    left: 14,
    position: "absolute",
    overflow: "hidden",
  },
  products: {
    marginLeft: -86,
    fontSize: FontSize.size_xs,
    color: Color.colorBlack,
  },
  yourOrder: {
    fontFamily: FontFamily.germaniaOneRegular,
    width: 160,
    lineHeight: 24,
    textAlign: "left",
    fontSize: FontSize.presetsBody2_size,
    left: 12,
    color: Color.colorBlack,
  },
  frame10: {
    width: 172,
    height: 50,
    overflow: "hidden",
  },
  frame9: {
    top: 121,
    width: 184,
    left: 14,
    position: "absolute",
  },
  checkSquare: {
    overflow: "hidden",
  },
  cash: {
    lineHeight: 22,
    fontFamily: FontFamily.presetsBody2,
    textAlign: "left",
    color: Color.colorBlack,
  },
  text4: {
    marginTop: 6,
    marginLeft: 57.5,
    lineHeight: 22,
    fontFamily: FontFamily.presetsBody2,
    textAlign: "left",
    color: Color.colorBlack,
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  total: {
    marginLeft: -61.5,
    color: "#236be0",
    fontSize: FontSize.size_lg,
    marginTop: -6,
  },
  summary: {
    bottom: 34,
    color: "#3ea436",
    textAlign: "left",
    fontFamily: FontFamily.inknutAntiquaRegular,
    fontSize: FontSize.size_lg,
  },
  frame14: {
    left: 25,
    width: 177,
    top: 0,
  },
  frame13: {
    top: 707,
    width: 202,
    left: 14,
  },
  checkout: {
    backgroundColor: Color.backgroundDefaultDefault,
    flex: 1,
    width: "100%",
    height: 932,
    overflow: "hidden",
  },
});

export default Checkout;
