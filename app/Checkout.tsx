import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList } from "react-native";
import { Image } from "expo-image";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CheckBox } from "@rneui/themed";
import VariantNeutralStateHover from "../components/VariantNeutralStateHover";
import { FontFamily, FontSize, Color,cardstyles } from "../GlobalStyles";
import tw from "tailwind-react-native-classnames";
import { ScrollView } from "react-native";
import { useAppContext } from "@/components/AppContext";
import { Card, CartElement, OrderItem, Product, ProductInfos } from "@/constants/Classes";
import { Alert } from "react-native";
import axios from "axios";
import { Order } from "@/constants/Classes";
import { router, useLocalSearchParams } from "expo-router";
import { jwtDecode } from "jwt-decode";
import CustomAlert from "@/components/CustomAlert";
import { useFocusEffect } from "@react-navigation/native";
import AnimatedCustomAlert from "@/components/AnimatedCustomAlert";
import RatingFeedbackModal from "@/components/RatingFeedbackModal"
import { useAppData } from "@/components/AppDataProvider";
import { useRoute } from '@react-navigation/native';
import config from "@/components/config";

const Checkout = () => {
  const route = useRoute();
  const { cartData } = route.params;
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [CardChecked, setCardChecked] = useState(false);
  const [CashChecked, setCashChecked] = useState(false);
  const [adresse,setAdresse] = useState<string>('')
  const {state, dispatch } = useAppContext();
  const {ProductsInfos,fetchOrders,fetchdt,error,token} = useAppData();
  const [sumCheckout, setSumCheckout] = useState(0);
  const [isRatingModalVisible,setisRatingModalVisible] = useState<boolean>(false)
  const [alertVisible, setAlertVisible] = useState(false);
  const [orderedProducts, setOrderedProducts] = useState([]);
  var cartItems = state.cartItems || {};
  var isLoggedIn = state.JWT_TOKEN !=='';

  const apiHandler = async (url, payload, token) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}${url}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
     // console.log(response.data);
      return response;
    } catch (error) {
      console.log(error.response.data);
      return error.response;
    }
  }
  
  const handleDeliveryCheck = () => {
    setCardChecked(true);
    setCashChecked(false);
  };


  useEffect(() => {
    const total = Object.entries(cartItems).reduce((sum, [productId, item]) => {
      const productinf = ProductsInfos.find((productinfos: ProductInfos) => productinfos.product.id == productId);
      return sum + (productinf ? productinf.product.price * item.quantity : 0);
    }, 0);
    setSumCheckout(total);
    console.log(total)
  }, [cartItems, ProductsInfos]);

  
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

  const ClearCart = () => {
    dispatch({ type: 'CLEAN_CART'});
  };

  const getTotalQuantity = () => {
    return state.cartItemsCount;
  };

  const getProductTotalPrice = (price, quantity) => {
    return (price * quantity);
  };


  const handleDismiss = async () => {
    setAlertVisible(false);
    await fetchOrders()
    router.navigate("/Orders?id=Cart")
  };

  const submitOrder = async () => {
    const items : OrderItem[] = []

    console.log(cartItems)
    const total = Object.entries(cartItems).reduce((sum, [productId, item]) => {
      const productinf = ProductsInfos.find((productinfos: ProductInfos) => productinfos.product.id == productId);
      items.push({
        id: '',
        quantity: item.quantity,
        sub_total: productinf.product.price * item.quantity,
        product: productinf?.product,
      })
      return sum + (productinf ? productinf.product.price * item.quantity : 0);
    }, 0);
    console.log("total is : "+total)
    console.log("items are : "+items)
    

    const order: Order = {
      id: '',
      creationDate: '',
      adresse: adresse,
      totalAmount:  total,
      status: 'Pending',
      paymentMethod: CardChecked ? 'Card' : 'Cash',
      shepingDate: date,
      orderItems: items
    }


    console.log("order is "+order.totalAmount)
    try {
      const response = await apiHandler(`/Order/${jwtDecode(token).userid}`,order,token).then(
        res => {
          setAlertVisible(true);
          setOrderedProducts(cartItems)
        });
  }catch (error) {
    console.error('Error submitting order:', error);
    Alert.alert('Erreur', 'Échec de l\'ajout du order. Veuillez réessayer.');
  }
  }

  const renderCheckoutElement =({ item }: { item: ProductInfos }) => {
    const quantity = cartItems[item.product.id]?.quantity || 0;

    return (
      <View key={item.product.id} style={styles.productRow}>
      <View style={styles.quantityContainer}>
        <Text style={[tw`text-base`,{color: Color.colorLimegreen_200}]}>{quantity}</Text>
      </View>
      <View style={styles.productDetails}>
        <Image
          style={styles.productImage}
          contentFit="cover"
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
      <View style={styles.addressContainer}>
        <Text style={styles.sectionLabel}>Your address</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#1e1e1e"
          value={adresse}
          onChangeText={setAdresse}
        />
      </View>

      <View style={styles.datePickerContainer}>
        <Text style={styles.sectionLabel}>Select Date</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.input}>
          <Text>{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
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
        <Text style={styles.sectionLabel}>Payment method</Text>
        <View style={styles.paymentOptionContainer}>
          <CheckBox
            checked={CardChecked}
            onPress={handleDeliveryCheck}
            containerStyle={styles.checkBoxContainer}
          />
          <Text style={styles.paymentOptionText}>Cash</Text>
        </View>
        <View style={styles.paymentOptionContainer}>
          <CheckBox
            checked={CashChecked}
            onPress={handlePickUpCheck}
            containerStyle={styles.checkBoxContainer}
          />
          <Text style={styles.paymentOptionText}>Card (We will contact you to finish the payment)</Text>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{`£ ${sumCheckout}`}</Text>
        </View>
      </View>
      <Pressable 
        onPress={()=>submitOrder()}
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
  )
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
              contentContainerStyle={{ flexGrow: 1,backgroundColor: Color.mainbackgroundcolor, }}
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