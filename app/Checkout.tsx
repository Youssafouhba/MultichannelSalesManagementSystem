import React, {useEffect, useMemo, useState } from "react";
import {Image, Pressable, StyleSheet, Text,Platform, View, TextInput, TouchableOpacity, FlatList } from "react-native";
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { CheckBox } from "@rneui/themed";
import VariantNeutralStateHover from "../components/VariantNeutralStateHover";
import {  FontSize, Color } from "../GlobalStyles";
import tw from "tailwind-react-native-classnames";
import { useAppContext } from "@/components/AppContext";
import { Card,ProductInfos } from "@/constants/Classes";
import { Alert } from "react-native";
import axios from "axios";
import { Order } from "@/constants/Classes";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import AnimatedCustomAlert from "@/components/AnimatedCustomAlert";
import { useAppData } from "@/components/AppDataProvider";
import config from "@/components/config";


interface RouteParams {
  payload: Card; // Replace 'any' with the actual type of payload
}

const Checkout = () => {
  const { state, dispatch } = useAppContext();
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [CardChecked, setCardChecked] = useState(false);
  const [CashChecked, setCashChecked] = useState(false);
  const [adresse, setAdresse] = useState<string>(state.order != null ? state.order.adresse : '');
  const [isDelivery, setIsDelivery] = useState(false);
  const [isPickUp, setIsPickUp] = useState(false);
  const {ProductsInfos } = useAppData();
  const [sumCheckout, setSumCheckout] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  var cartItems = state.cartItems || {};

  const apiHandler = async (url: string, payload: any) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}${url}`, payload, {
        headers: {
          Authorization: `Bearer ${state.JWT_TOKEN}`
        }
      });
      return response;
    } catch (error: any) {
      console.log(error.response.data);
      return error.response;
    }
  };


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility(Platform.OS === 'ios'); // On iOS, the picker doesn't automatically close
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setDatePickerVisibility(true);
  };

  const showDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'datetime',
        is24Hour: true,
        onChange: onChange,
      });
    } else {
      setDatePickerVisibility(true);
    }
  };

  const hideDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.dismiss('datetime')
        .then((dismissed) => {
          if (dismissed) {
            setDatePickerVisibility(false);
          }
        })
        .catch((error) => {
          console.error("Error dismissing date picker:", error);
        });
    } else {
      setDatePickerVisibility(false);
    }
  };

  const handleDeliveryCheck = () => {
    setIsDelivery(true);
    setIsPickUp(false);
    setCardChecked(true); // Automatically select "Card" and disable "Cash"
    setCashChecked(false);
  };

  const handlePickUpCheck = () => {
    setIsPickUp(true);
    setIsDelivery(false);
    setCardChecked(false); // Automatically select "Cash" and disable "Card"
    setCashChecked(true);
  };

  useEffect(() => {
    const total = Object.entries(cartItems).reduce((sum, [productId, item]) => {
      const productinf = ProductsInfos.find((productinfos: ProductInfos) => productinfos.product.id == productId);
      return sum + (productinf ? productinf.product.price * item.quantity : 0);
    }, 0);
    setSumCheckout(parseFloat(total.toFixed(1)));
  }, [cartItems, ProductsInfos]);

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate || date);
    hideDatePicker();
  };

  const getTotalQuantity = () => {
    return state.cartItemsCount;
  };

  const getProductTotalPrice = (price, quantity) => {
    return price * quantity;
  };

  const order: Order = {
    id: '',
    creationDate: '',
    adresse: isDelivery ? adresse : '', // Address only required for delivery
    totalAmount: 0,
    status: 'Pending',
    paymentMethod: CardChecked ? 'Card' : 'Cash',
    shepingDate: date,
    orderItems: []
  };

  const handleDismiss = async () => {
    setAlertVisible(false);
    dispatch({ type: 'Set_previouspage', payload: "Cart" });
    dispatch({ type: 'Set_isRated', payload: true });
    router.navigate(`Orders` as never);
  };

  const submitOrder = async () => {
    order.totalAmount = Object.entries(cartItems).reduce((sum, [productId, item]) => {
      const productinf = ProductsInfos.find((productinfos: ProductInfos) => productinfos.product.id == productId);
      order.orderItems.push({
        id: '',
        quantity: item.quantity,
        sub_total: productinf.product.price * item.quantity,
        product: productinf?.product,
      })
      return sum + (productinf ? productinf.product.price * item.quantity : 0);
    }, 0);

    console.log("order is "+order.totalAmount)

    try {
      const response = await apiHandler(`/Order/${jwtDecode(state.JWT_TOKEN).userid}`, order).then(
        res => {
          setAlertVisible(true);
          dispatch({ type: 'Set_orderedProducts', payload: cartItems });
          setAdresse('');
          setCardChecked(false);
          setCashChecked(false);
        });
    } catch (error) {
      console.error('Error submitting order:', error);
      Alert.alert('Erreur', 'Échec de l\'ajout du order. Veuillez réessayer.');
    }
  };

  

  const renderCheckoutElement = ({ item }: { item: ProductInfos }) => {
    const quantity = cartItems[item.product.id]?.quantity || 0;

    return (
      <View key={item.product.id} style={styles.productRow}>
      <View style={styles.quantityContainer}>
        <Text style={[tw`text-base`,{color: Color.colorLimegreen_200}]}>{quantity}</Text>
      </View>
      <View style={styles.productDetails}>
        <Image
          style={styles.productImage}
          source={require("../assets/x2.png")}
        />
        <Text style={[tw`text-base text-sm font-medium`]}>{item.product.name}</Text>
      </View>
      <View style={[styles.priceContainer]}>
        <Text  style={[tw`text-base text-sm font-medium`,{color: 'orangered'}]}>£{getProductTotalPrice(item.product.price,quantity)}</Text>
      </View>
    </View>
    )
  }

  const cartProducts = useMemo(() => {
    return ProductsInfos.filter((product: ProductInfos) => cartItems[product.product.id]?.quantity > 0);
  }, [ProductsInfos, cartItems]);

  const rendetDetails = ()=>(
    <View style={styles.checkoutContainer}>
    <View style={styles.checkoutHeader}>
      <Text style={tw`text-xl font-medium`}>Your order</Text>
      <Text style={tw`text-base ml-4`}>{`${getTotalQuantity()} products`}</Text>
    </View>

      <View style={styles.checkoutBody}>
        <FlatList
          data={cartProducts}
          renderItem={renderCheckoutElement}
          scrollEnabled={true}
          keyExtractor={(item) => item.product.id.toString()}
        />

        {/* Pick Up / Delivery Options */}
        <View style={styles.deliveryMethodContainer}>
          <Text style={styles.sectionLabel}>Select Delivery Method</Text>
          <View style={styles.deliveryOptionContainer}>
            <CheckBox
              checked={isPickUp}
              onPress={handlePickUpCheck}
              containerStyle={styles.checkBoxContainer}
            />
            <Text style={styles.deliveryOptionText}>Pick Up</Text>
          </View>
          <View style={styles.deliveryOptionContainer}>
            <CheckBox
              checked={isDelivery}
              onPress={handleDeliveryCheck}
              containerStyle={styles.checkBoxContainer}
            />
            <Text style={styles.deliveryOptionText}>Delivery</Text>
          </View>
        </View>

        {/* Address Input for Delivery */}
        {isDelivery && (
          <View style={styles.addressContainer}>
            <Text style={styles.sectionLabel}>Your address</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#1e1e1e"
              value={adresse}
              onChangeText={setAdresse}
            />
          </View>
        )}

        {/* Date Picker for Both Options */}
        <View style={styles.datePickerContainer}>
          <Text style={styles.sectionLabel}>Select Date</Text>
          <TouchableOpacity onPress={showDatePicker} style={styles.input}>
            <Text>{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          {Platform.OS === 'ios' && isDatePickerVisible && (
              <RNDateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
        </View>
      
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.sectionLabel}>Payment method</Text>
          {isPickUp && (
            <View style={styles.paymentOptionContainer}>
              <CheckBox
                checked={CashChecked}
                onPress={() => { setCashChecked(true); setCardChecked(false); }}
                containerStyle={styles.checkBoxContainer}
                disabled={true} // Disable changing the payment method if Pick Up is selected
              />
              <Text style={styles.paymentOptionText}>Cash</Text>
            </View>
          )}
          {isDelivery && (
            <View style={styles.paymentOptionContainer}>
              <CheckBox
                checked={CardChecked}
                onPress={() => { setCardChecked(true); setCashChecked(false); }}
                containerStyle={styles.checkBoxContainer}
                disabled={true} // Disable changing the payment method if Delivery is selected
              />
              <Text style={styles.paymentOptionText}>Card (We will contact you for payment)</Text>
            </View>
          )}
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{`£ ${sumCheckout}`}</Text>
          </View>
        </View>
        <Pressable
         onPress={submitOrder} 
         style={[]}>
          <VariantNeutralStateHover
            star={require("../assets/star1.png")}
            label="Confirm Order"
            x={require("../assets/x1.png")}
            hasIconStart={false}
            hasIconEnd={false}
            variantNeutralStateHoverPosition="relative"
            variantNeutralStateHoverBackgroundColor="green"
            variantNeutralStateHoverBorderColor="green"
            variantNeutralStateHoverWidth="set"
            variantNeutralStateHoverMarginTop={-20}
            variantNeutralStateHoverMarginLeft={28.5}
          />
        </Pressable>
      </View>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <AnimatedCustomAlert
            visible={alertVisible}
            title="Order Complete"
            message="Your order has been successfully placed. Thank you for your purchase!"
            onDismiss={handleDismiss}
            duration={2000} // 3 seconds
          />
          {rendetDetails()}
        </>
      }
      ListFooterComponent={<View style={{ height: 20 }} />} // Add footer to prevent overlap with other content
      contentContainerStyle={{ flexGrow: 1, backgroundColor: Color.mainbackgroundcolor }}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.mainbackgroundcolor,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  checkoutContainer: {
    flex: 1,
    padding: 16,
  },
  checkoutHeader: {
    marginVertical: 10,
  },
  checkoutBody: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityContainer: {
    width: '10%',
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '66%',
  },
  productImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  productName: {
    flex: 1,
    fontSize: FontSize.size_3xs,
  },
  priceContainer: {
    width: '22%',
    alignItems: 'flex-end',
  },
  deliveryMethodContainer: {
    marginTop: 20,
  },
  deliveryOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  deliveryOptionText: {
    fontSize: FontSize.presetsBody2_size,
  },
  addressContainer: {
    marginTop: 20,
  },
  datePickerContainer: {
    marginTop: 20,
  },
  paymentMethodContainer: {
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: FontSize.presetsBody2_size,
    marginBottom: 8,
  },
  input: {
    borderColor: "#9ee1f4",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: FontSize.presetsBody2_size,
  },
  paymentOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkBoxContainer: {
    padding: 0,
    marginLeft: 0,
    marginRight: 8,
  },
  paymentOptionText: {
    fontSize: FontSize.presetsBody2_size,
  },
  summaryContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
  },
  summaryTitle: {
    fontSize: FontSize.size_lg,
    color: "#3ea436",
    marginBottom: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: FontSize.size_lg,
    color: "#236be0",
  },
  totalAmount: {
    fontSize: FontSize.size_lg,
    color: "#236be0",
    fontWeight: 'bold',
  },
});

export default Checkout;
