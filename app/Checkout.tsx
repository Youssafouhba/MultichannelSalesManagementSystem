import { useAppContext } from "@/components/AppContext";
import { useAppData } from "@/components/AppDataProvider";
import CustomAlert from '@/components/CustomAlert';
import NoInternetConnection from "@/components/NoInternetConnection";
import config from "@/components/config";
import useInternetCheck from "@/components/useInternetCheck";
import { Order, ProductInfos } from "@/constants/Classes";
import { useCart } from "@/contex/CartContex";
import { useUser } from "@/contex/UserContext";
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { CheckBox } from "@rneui/themed";
import axios from "axios";
import { router, usePathname } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Image, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { Color, FontSize } from "../GlobalStyles";
import VariantNeutralStateHover from "../components/VariantNeutralStateHover";

const Checkout = () => {
  const { state,updateOrderAndNotif} = useUser();
  const { statecart} = useCart();
  const { appstate,setOrderedProducts,setPreviouspage,setIsRated} = useAppContext();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const pathname = usePathname();
  const [CardChecked, setCardChecked] = useState(false);
  const [CashChecked, setCashChecked] = useState(false);
  const [adresse, setAdresse] = useState<string>(appstate.order!=null?appstate.order.adresse:'');
  const [isDelivery, setIsDelivery] = useState(false);
  const [isPickUp, setIsPickUp] = useState(false);
  const {ProductsInfos } = useAppData();
  const [sumCheckout, setSumCheckout] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isallowed, setIsallowed] = useState(true);
  const [alertTradeCustomer,setAlertTradeCustomer] = useState<boolean>(false)
  const [alertError,setAlertError] = useState<boolean>(false)
  var   cartItems = statecart.items || {};
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const isTradeCustomer = state.userInfos.user?.tradeCustomer;
  const { isConnected, connectionType } = useInternetCheck();
  const calculateDiscount = (total: number) => {
    if (isTradeCustomer) {
      if (total >= 500) {
        return 0.03; // 3% discount for trade customers
      }
    } else {
      if (total >= 1000) {
        return 0.04; // 4% discount for normal customers over £1000
      } else if (total >= 700) {
        return 0.02; // 2% discount for normal customers between £700 and £1000
      }
    }
    return 0; // No discount
  };
  const isvalid = () =>{
    return (isPickUp || (isDelivery && adresse!=null)) && (CardChecked || CashChecked);
  }
  const apiHandler = async (url: string, payload: any) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}${url}`, payload, {
        headers: {
          Authorization: `Bearer ${state.JWT_TOKEN}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return error.response;
    }
  };
  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setDatePickerVisibility(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const onChangeTime = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || time;
    setTimePickerVisibility(Platform.OS === 'ios');
    setTime(currentTime);
  };
  const showDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        onChange: onChangeDate,
      });
    } else {
      setDatePickerVisibility(true);
    }
  };
  const showTimePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: time,
        mode: 'time',
        is24Hour: false,
        onChange: onChangeTime,
      });
    } else {
      setTimePickerVisibility(true);
    }
  };
  const handleDeliveryCheck = () => {
    setIsDelivery(true);
    setIsPickUp(false);
    setCardChecked(true);
    setCashChecked(false);
  };
  const handlePickUpCheck = () => {
    setIsPickUp(true);
    setIsDelivery(false);
    setCardChecked(false);
    setCashChecked(false);
  };
  useEffect(() => {
    if (isDelivery) {
      setCardChecked(true);
      setCashChecked(false);
    }
  }, [isDelivery]);

  useEffect(() => {
    if(pathname!=="/Checkout")
      return
    const total = Object.entries(statecart.items).reduce((sum, [productId, item]) => {
      const productInfo = ProductsInfos.find((productInfo) => productInfo.product.id == productId);
      return sum + (productInfo ? productInfo.product.price * item.quantity : 0);
    }, 0);
    setSumCheckout(total);
    const discount = calculateDiscount(total);
    setDiscountPercentage(discount * 100);
    setDiscountedTotal(total * (1 - discount));
    if (isTradeCustomer && total < 500) {
      setDiscountedTotal(total);
    }
  }, [statecart.items, isTradeCustomer]);



  const getTotalQuantity = () => {
    return statecart.itemsCount;
  };

  const getProductTotalPrice = (price: number, quantity: number) => {
    return price * quantity;
  };

  const order: Order = {
    id: '',
    creationDate: '',
    adresse: isDelivery ? adresse : '', // Address only required for delivery
    totalAmount: discountedTotal,
    status: 'Pending',
    paymentMethod: CardChecked ? 'Card' : 'Cash',
    shepingDate: date,
    orderItems: []
  };

  const handleDismiss = async () => {
    setIsRated(true)
    setAlertVisible(false);
    setPreviouspage("Cart");
    router.navigate(`Orders?rated=1` as never);
  };

  const handleSubmit= async () => {
    if(isvalid()){
      submitOrder()
    }else{
      setAlertError(true)
    }
  };




  const submitOrder = async () => {
    try {
      const response = await apiHandler(`/Order/${jwtDecode(state.JWT_TOKEN).userid}`, order).then(
        res => {
        //  updateMyOrders({object: res,action: 'add'})
          updateOrderAndNotif(res)
          setAlertVisible(true);
          setOrderedProducts(cartItems)
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
      <CustomAlert visible={alertTradeCustomer} onDismiss={()=>{setAlertTradeCustomer(false)}} duration={1500} title={Alert} message={"Trade customers must have a minimum order of £500"}/>
      <CustomAlert visible={alertError} onDismiss={()=>{setAlertError(false)}} duration={2000} title={Alert} message={"Please fill all needed informations."} type="warning"/>
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
        <View style={styles.checkoutContainer}>
          <Text style={styles.sectionLabel}>Select Date</Text>
          <TouchableOpacity onPress={showDatePicker} style={styles.input}>
            <Text>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          
          {Platform.OS === 'ios' && isDatePickerVisible && (
            <RNDateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          
          <Text style={styles.sectionLabel}>Select Time</Text>
          <TouchableOpacity onPress={showTimePicker} style={styles.input}>
            <Text>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: true })}</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && isTimePickerVisible && (
            <RNDateTimePicker
              testID="timePicker"
              value={time}
              mode="time"
              display="default"
              onChange={onChangeTime}
            />
          )}
        </View>


        <View style={styles.paymentMethodContainer}>
        <Text style={styles.sectionLabel}>Payment method</Text>
        {isPickUp && (
          <>
            <View style={styles.paymentOptionContainer}>
              <CheckBox
                checked={CashChecked}
                onPress={() => { setCashChecked(true); setCardChecked(false); }}
                containerStyle={styles.checkBoxContainer}
              />
              <Text style={styles.paymentOptionText}>Cash</Text>
            </View>
            <View style={styles.paymentOptionContainer}>
              <CheckBox
                checked={CardChecked}
                onPress={() => { setCardChecked(true); setCashChecked(false); }}
                containerStyle={styles.checkBoxContainer}
              />
              <Text style={styles.paymentOptionText}>Card</Text>
            </View>
          </>
        )}
        {isDelivery && (
          <View style={styles.paymentOptionContainer}>
            <CheckBox
              checked={CardChecked}
              containerStyle={styles.checkBoxContainer}
              disabled={true}
            />
            <Text style={styles.paymentOptionText}>Card (We will contact you for payment)</Text>
          </View>
        )}
      </View>
      <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Summary</Text>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Subtotal</Text>
        <Text style={[styles.totalAmount]}>{`£ ${sumCheckout.toFixed(2)}`}</Text>
      </View>
      {discountPercentage > 0 && (
        <View style={styles.discountContainer}>
          <Text style={styles.discountLabel}>Discount ({discountPercentage}%)</Text>
          <Text style={styles.discountAmount}>{`-£ ${(sumCheckout - discountedTotal).toFixed(2)}`}</Text>
        </View>
      )}
      <View style={styles.finalTotalContainer}>
        <Text style={styles.finalTotalLabel}>Total</Text>
        <Text style={styles.finalTotalAmount}>{`£ ${discountedTotal.toFixed(2)}`}</Text>
      </View>
      {discountPercentage > 0 && (
        <Text style={styles.discountMessage}>
          You're saving <Text style={[tw`font-medium text-red-400`]}>{discountPercentage}%</Text> on your order!
        </Text>
      )}
    </View>
        <Pressable
         onPress={handleSubmit} 
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
    !isConnected?
      <NoInternetConnection/>
      :
    <FlatList
      ListHeaderComponent={
        <>
        <CustomAlert visible={alertVisible} onDismiss={handleDismiss} duration={2000} title={"Order Complete"} message={"Your order has been successfully placed. Thank you for your purchase!"} type="success"/>
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
    padding: 16,
    borderRadius: 8,
    backgroundColor: Color.colorWhitesmoke,
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
    marginBottom: 16,
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
    marginBottom: 12,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    color: "#236be0",
  },
  totalAmount: {
    color: "#236be0",
    fontWeight: 'bold',
  },
  discountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  discountLabel: {
    color: "#e63946",
  },
  discountAmount: {
    color: "#e63946",
    fontWeight: 'bold',
  },
  discountMessage: {
    fontSize: FontSize.size_sm,
    color: "#2a9d8f",
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  finalTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  finalTotalLabel: {
    fontSize: FontSize.size_lg,
    color: "#236be0",
    fontWeight: 'bold',
  },
  finalTotalAmount: {
    fontSize: FontSize.size_lg,
    color: "#236be0",
    fontWeight: 'bold',
  },
});

export default Checkout;
