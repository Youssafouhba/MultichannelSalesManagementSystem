import React, { useEffect, useMemo, useCallback } from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View, Pressable, TouchableOpacity, FlatList } from "react-native";
import { Color, FontSize, FontFamily } from "../../GlobalStyles";
import tw from 'tailwind-react-native-classnames';
import { useFonts } from 'expo-font';
import StarRating from "@/components/StarRating";
import { useAppContext } from "@/components/AppContext";
import { Product } from "@/constants/Classes";

const Cart = () => {
  const { state, dispatch } = useAppContext();
  
  // Vérification de sécurité pour s'assurer que state.products et state.cartItems existent
  const products = state?.products || [];
  const cartItems = state?.cartItems || {};

  const [fontsLoaded] = useFonts({
    'KleeOne-Regular': require('@/assets/fonts/KleeOne-Regular.ttf'),
    'kavoonRegular': require('@/assets/fonts/Kavoon-Regular.ttf'),
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
    'VampiroOne-Regular': require('@/assets/fonts/VampiroOne-Regular.ttf'),
    'GermaniaOne-Regular': require('@/assets/fonts/GermaniaOne-Regular.ttf'),
    'Langar-Regular': require('@/assets/fonts/Langar-Regular.ttf'),
    'KiteOne-Regular': require('@/assets/fonts/KiteOne-Regular.ttf'),
  });

  const cartProducts = useMemo(() => {
    return products.filter(product => cartItems[product.id] > 0);
  }, [products, cartItems]);

  const { totalItems, sumCheckout } = useMemo(() => {
    return cartProducts.reduce((acc, product) => {
      const quantity = cartItems[product.id] || 0;
      return {
        totalItems: acc.totalItems + quantity,
        sumCheckout: acc.sumCheckout + quantity * product.price,
      };
    }, { totalItems: 0, sumCheckout: 0 });
  }, [cartProducts, cartItems]);

  useEffect(() => {
    console.log(cartItems)
    if (dispatch) {
      dispatch({ type: 'UPDATE_CART_COUNT', payload: totalItems });
    }
  }, [totalItems, dispatch]);

  const updateItemQuantity = useCallback((productId: string, change: number) => {
    if (dispatch) {
      dispatch({ type: 'UPDATE_CART_ITEM_QUANTITY', payload: { productId, change } });
    }
  }, [dispatch]);

  const removeItem = useCallback((productId: string) => {
    if (dispatch) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
    }
  }, [dispatch]);

  const renderCartElement = useCallback(({ item }: { item: Product }) => (
    <Pressable style={[tw`flex-row`, styles.CardsProductWrapper]}>
      <View style={[tw`flex-row justify-between`, { width: '100%' }]}>
        <View style={styles.productImage}>
          <Image
            style={[tw`rounded-lg`, { width: '100%', height: '100%' }]}
            contentFit="cover"
            source={{ uri: item.imageUrls[0]?.url }}
          />
        </View>
        <View style={[tw`flex-col w-60 mx-1`]}>
          <View style={[tw`flex-row`, { height: '30%' }]}>
            <View style={[tw`flex-row justify-between px-2`, { backgroundColor: Color.COLORALICEBLUE, width: '56%' }]}>
              <Text style={[tw`text-base text-gray-900 font-medium text-xl`]}>£ {((item.price || 0) * (cartItems[item.id] || 0)).toFixed(2)}</Text>
              <View style={[tw`flex-col`, { width: 'max-content' }]}>
                <Text style={[tw`text-base text-gray-400 font-normal text-xs`, { marginTop: '10%' }]}>
                  £ {(item.price || 0).toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={[tw`flex-row text-center justify-start`, { backgroundColor: Color.COLORALICEBLUE, width: '44%', borderLeftWidth: 2, borderLeftColor: 'white' }]}>
              <TouchableOpacity
                style={[tw`text-center rounded pt-2 pl-2 pr-2`, { alignContent: 'center', backgroundColor: Color.COLORALICEBLUE }]}
                onPress={() => updateItemQuantity(item.id, -1)}>
                <Image
                  style={[tw`w-3 h-4`]}
                  contentFit="cover"
                  tintColor={'orangered'}
                  source={require("@/assets/minus.png")}
                />
              </TouchableOpacity>
              <Text style={[tw`text-base text-gray-400 font-normal w-10 bg-white text-center h-8 pt-1`, { alignContent: 'center' }]}>
                {cartItems[item.id] || 0}
              </Text>
              <TouchableOpacity
                style={[tw`text-center rounded pt-2 pl-1 pr-2`, { alignContent: 'center', backgroundColor: Color.COLORALICEBLUE }]}
                onPress={() => updateItemQuantity(item.id, 1)}>
                <Image
                  style={[tw`w-4 h-4 left-1`]}
                  contentFit="cover"
                  source={require("@/assets/plus.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[tw`flex-col`, { height: '70%' }]}>
            <View style={[tw`px-1`, { backgroundColor: Color.colorWhite, width: '100%', height: '70%' }]}>
              <Text style={[tw`text-base text-gray-900 font-normal`]} ellipsizeMode="tail">
                {item.name}
              </Text>
            </View>
            <View style={[tw`px-1 py-1`, { backgroundColor: Color.COLORALICEBLUE, width: '100%', height: '30%' }]}>
              <View style={[tw`flex-row`, { alignItems: 'center' }]}>
                <View style={[tw`flex-row justify-start`]}>
                  <StarRating rating={4.5} />
                </View>
                <Text style={[tw`text-base text-gray-900 font-normal ml-2 text-xs`]}>| +1000 vendus</Text>
                <Pressable onPress={() => removeItem(item.id)}>
                  <Image
                    style={[tw`w-4 h-4`, { left: '100%' }]}
                    contentFit="cover"
                    source={require("@/assets/delete.png")}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  ), [cartItems, updateItemQuantity, removeItem]);

  const renderCheckoutButton = useCallback(() => (
    <Pressable style={styles.button}>
      <Image
        style={styles.iconLayout}
        contentFit="cover"
        source={require("@/assets/star1.png")}
      />
      <Text style={styles.button1}>Go to checkout <Text style={[tw`text-base font-medium`, { color: 'orange' }]}>£ {sumCheckout.toFixed(2)}</Text></Text>
      <Image
        style={[styles.xIcon, styles.iconLayout]}
        contentFit="cover"
        source={require("@/assets/x1.png")}
      />
    </Pressable>
  ), [sumCheckout]);

  if (!fontsLoaded) {
    return null; // ou un indicateur de chargement
  }

  return (
    <View style={styles.cart}>
      {cartProducts.length > 0 ? (
        <>
          <View style={styles.CardsProduct}>
            <FlatList
              data={cartProducts}
              renderItem={renderCartElement}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
          {renderCheckoutButton()}
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Votre panier est vide</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cart: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  CardsProduct: {
    flex: 1,
  },
  CardsProductWrapper: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Color.colorWhitesmoke_50,
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.colorOrange,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  button1: {
    color: Color.colorWhite,
    fontSize: FontSize.size_base,
    fontWeight: 'bold',
  },
  iconLayout: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  xIcon: {
    tintColor: Color.colorWhite,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: Color.colorGray_100,
  },
});

export default Cart;