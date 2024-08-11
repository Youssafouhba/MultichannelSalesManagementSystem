import React, { useEffect, useState, useMemo } from "react";
import { View, Image, Text, FlatList, Pressable, TouchableOpacity, Alert } from "react-native";
import { useAppContext } from "@/components/AppContext";
import { Card, CartElement, Order, Product, ProductInfos } from "@/constants/Classes";
import { Color } from "@/GlobalStyles";
import StarRating from "@/components/StarRating";
import tw from "tailwind-react-native-classnames";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ModernCustomAlert from "@/components/ModernCustomAlert";
import { useAppData } from "@/components/AppDataProvider";
import config from "@/components/config";
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
  const { state, dispatch } = useAppContext();
  const { ProductsInfos,data,cartElements,error,token} = useAppData();
  const [sumCheckout, setSumCheckout] = useState(0);
  const [first, setFirst] = useState(false);
  const [LogInAlertVisible, setLogInAlertVisible] = useState(false);
  var cartItems = state.cartItems || {};
  var isLoggedIn = state.JWT_TOKEN !=='';
  const navigation = useNavigation();


  useEffect(() => {
    const total = Object.entries(cartItems).reduce((sum, [productId, item]) => {
      const productinf = ProductsInfos.find((productinfos: ProductInfos) => productinfos.product.id == productId);
      return sum + (productinf ? productinf.product.price * item.quantity : 0);
    }, 0);
    setSumCheckout(total);
  }, [cartItems, ProductsInfos]);


  const updateItemQuantity = (productId: string, change: number) => {
    const currentQuantity = cartItems[productId]?.quantity || 0;
    const newQuantity = Math.max(0, currentQuantity + change);
  
    if (newQuantity === 0) {
      removeItem(productId);
    } else {
      dispatch({
        type: 'UPDATE_CART_ITEM_QUANTITY',
        payload: { productId, quantity: newQuantity }
      });
    }
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const renderCartElement = ({ item }: { item: ProductInfos }) => {
    const quantity = cartItems[item.product.id]?.quantity || 0;
    
    return (
      <Pressable style={[styles.cardWrapper, tw`flex-row`]} onPress={() => {}}>
        <View style={styles.productImageContainer}>
          <Image
            style={styles.productImage}
            source={{ uri: item.product.imageUrls[0]?.url }}
          />
        </View>
        <View style={styles.productDetails}>
          <View style={styles.priceQuantityContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.totalPrice}>£ {(item.product.price * quantity).toFixed(2)}</Text>
              <Text style={styles.unitPrice}>£ {item.product.price.toFixed(2)}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateItemQuantity(item.product.id, -1)}>
                <Image
                  style={styles.quantityIcon}
                  tintColor={'orangered'}
                  source={require("@/assets/minus.png")}
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateItemQuantity(item.product.id, +1)}>
                <Image
                  style={styles.quantityIcon}
                  source={require("@/assets/plus.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.productNameContainer}>
            <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
              {item.product.name}
            </Text>
          </View>
          <View style={styles.productInfoContainer}>
            <StarRating rating={parseFloat(item.raiting.toFixed(1))} />
            <Text style={styles.salesText}>| +1000 vendus</Text>
            <Pressable style={styles.deleteButton} onPress={() => removeItem(item.product.id)}>
              <Image
                style={styles.deleteIcon}
                source={require("@/assets/delete.png")}
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderCheckoutButton = () => (
    <Pressable style={styles.checkoutButton} onPress={()=> handelcheckout()}>
      <Image
        style={styles.checkoutIcon}
        source={require("@/assets/star1.png")}
      />
      <Text style={styles.checkoutText}>
        Go to checkout <Text style={styles.checkoutPrice}>£ {sumCheckout.toFixed(2)}</Text>
      </Text>
      <Image
        style={styles.checkoutIcon}
        source={require("@/assets/x1.png")}
      />
    </Pressable>
  );


  const apiHandler = async (url, payload, token) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}${url}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.log(error.response.data);
      return error.response;
    }
  }
  const submitCard =  async () => {

  
    try {
      const total = Object.entries(cartItems).reduce((sum, [productId, item]) => {
        const productinf = ProductsInfos.find(p => p.product.id === productId);
        return sum + (productinf ? productinf.product.price * item.quantity : 0);
      }, 0);
  
      const Products = ProductsInfos.filter((productinf: ProductInfos) => cartItems[productinf.product.id]?.quantity > 0);
      
      const card: Card = {
        cartElements: [],
        total_amount: total,
        id: '',
      };
  
      Products.forEach((productinf: ProductInfos) => {
        card.cartElements.push({
          id: '',
          quantity: cartItems[productinf.product.id]?.quantity,
          sub_total: cartItems[productinf.product.id]?.quantity * productinf.product.price,
          product: productinf.product
        });
      });
      const response = await apiHandler(`/api/Cart/${jwtDecode(token).userid}`, card, token);
      if (response.status === 200) {
        // Naviguer vers la page de checkout en passant les données du panier
        navigation.navigate('Checkout', { cartData: card });
      } else {
        Alert.alert('Error', 'Failed to submit the cart. Please try again.');
      }
    } catch (error) {
      console.error('Error preparing cart for checkout:', error);
      Alert.alert('Error', 'Failed to proceed to checkout. Please try again.');
    }
  };

  const handelcheckout = () => {
    if (isLoggedIn) {
      submitCard();
    } else {
      setLogInAlertVisible(true);
    }
  };

  const handleCancel = () => {
    setLogInAlertVisible(false);
  };

  const handleConfirm = () => {
      setLogInAlertVisible(false);
      router.push(`/LoginPage?id=Cart`);
  };
  const cartProducts = useMemo(() => {
    return ProductsInfos.filter((productinfos: ProductInfos) => cartItems[productinfos.product.id]?.quantity > 0);
  }, [ProductsInfos, cartItems]);


  return (
    <View style={styles.container}>
      <ModernCustomAlert
                visible={LogInAlertVisible}
                title="Login Required"
                message="You need to be logged in to proced to Checkout."
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
      {cartProducts.length > 0 ? (
        <>
          <FlatList
            data={cartProducts}
            renderItem={renderCartElement}
            keyExtractor={(item) => item.product.id?.toString()}
          />
          {renderCheckoutButton()}
        </>
      ) : (
        <View style={[tw`justify-center items-center h-80`]}>
          <Text style={[tw`text-base`]}>Your cart is empty !</Text>
          <Image source={require("@/assets/images/icons8-aucun-résultat-48.png")}/>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Color.colorWhite,
  },
  cardWrapper: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Color.COLORALICEBLUE,
  },
  productImageContainer: {
    width: '30%',
    aspectRatio: 0.8,
    marginRight: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceContainer: {
    backgroundColor: Color.COLORALICEBLUE,
    padding: 5,
    borderRadius: 5,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  unitPrice: {
    fontSize: 12,
    color: 'gray',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.COLORALICEBLUE,
    borderRadius: 5,
  },
  quantityButton: {
    padding: 5,
  },
  quantityIcon: {
    width: 15,
    height: 15,
  },
  quantityText: {
    paddingHorizontal: 10,
    backgroundColor: Color.colorWhite,
  },
  productNameContainer: {
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
  },
  productInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.COLORALICEBLUE,
    padding: 5,
    borderRadius: 5,
  },
  salesText: {
    fontSize: 12,
    marginLeft: 5,
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.COLORALICEBLUE,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  checkoutIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutPrice: {
    color: 'orange',
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Cart;