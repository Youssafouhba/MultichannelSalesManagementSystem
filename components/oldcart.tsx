import React, { useEffect, useState, useMemo } from "react";
import { View,Image, Text, FlatList, Pressable, TouchableOpacity } from "react-native";
import { useAppContext } from "@/components/AppContext";
import { Product } from "@/constants/Classes";
import { Color,cardstyles as styles} from "@/GlobalStyles";
import StarRating from "@/components/StarRating";
import tw from "tailwind-react-native-classnames";

const Cart = () => {
  const { state, dispatch } = useAppContext();
  const [sumCheckout, setSumCheckout] = useState(0);

  const cartItems = state.cartItems || {};

  useEffect(() => {
    const total = Object.entries(cartItems).reduce((sum, [productId, item]) => {
      const product = state.products.find(p => p.id === productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    setSumCheckout(total);
    console.log(total)
  }, [cartItems, state.products]);

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

  const renderCartElement = ({ item }: { item: Product }) => {
    const quantity = cartItems[item.id]?.quantity || 0;
    
    return (
      <Pressable style={[tw`flex-row`, styles.CardsProductWrapper]} onPress={() => {}}>
        <View style={[tw`flex-row justify-between`, { width: '100%' }]}>
          <View style={[styles.productImage]}>
            <Image
              style={[tw`rounded-lg`, { width: '100%', height: '100%' }]}
              source={{ uri: item.imageUrls[0]?.url }}
            />
          </View>
          <View style={[tw`flex-col w-60 mx-1`]}>
            <View style={[tw`flex-row`, { height: '30%' }]}>
              <View style={[tw`flex-row justify-between px-2`, { backgroundColor: Color.COLORALICEBLUE, width: '56%' }]}>
                <Text style={[tw`text-base text-gray-900 font-medium text-xl`]}>£ {(item.price * quantity).toFixed(2)}</Text>
                <View style={[tw`flex-col`, { width: 'max-content' }]}>
                  <Text style={[tw`text-base text-gray-400 font-normal text-xs`, { marginTop: '10%' }]}>
                    £ {item.price.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={[tw`flex-row text-center justify-start`, { backgroundColor: Color.COLORALICEBLUE, width: '44%', borderLeftWidth: 2, borderLeftColor: 'white' }]}>
                <TouchableOpacity
                  style={[tw`text-center rounded pt-2 pl-2 pr-2`, { alignContent: 'center', backgroundColor: Color.COLORALICEBLUE }]}
                  onPress={() => updateItemQuantity(item.id, -1)}>
                  <Image
                    style={[tw`w-3 h-4`]}
                    tintColor={'orangered'}
                    source={require("@/assets/minus.png")}
                  />
                </TouchableOpacity>
                <Text style={[tw`text-base text-gray-400 font-normal w-10 bg-white text-center h-8 pt-1`, { alignContent: 'center' }]}>
                  {quantity}
                </Text>
                <TouchableOpacity
                  style={[tw`text-center rounded pt-2 pl-1 pr-2`, { alignContent: 'center', backgroundColor: Color.COLORALICEBLUE }]}
                  onPress={() => updateItemQuantity(item.id, +1)}>
                  <Image
                    style={[tw`w-4 h-4 left-1`]}
                    source={require("@/assets/plus.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[tw`flex-col`,{height: '70%',}]}>
              <View style={[tw`px-1`,{backgroundColor: Color.colorWhite,width: '100%',height: '70%'}]}>
                <Text style={[tw`text-base text-gray-900 font-normal `]}  ellipsizeMode="tail">
                  {item.name}
                </Text>
              </View>
              <View style={[tw`px-1 py-1`,{backgroundColor: Color.COLORALICEBLUE,width: '100%',height: '30%'}]}>
                <View style={[tw`flex-row `,{alignItems: 'center'}]}>
                    <View style={[tw`flex-row justify-start`,{}]}>
                        <StarRating rating={4.5} /> 
                    </View>
                    <Text style={[tw`text-base text-gray-900 font-normal ml-2 text-xs`]}>| +1000 vendus</Text>
                    <Pressable onPress={()=>{removeItem(item.id)}}>
                      <Image
                      style={[tw`w-4 h-4`,{left: '100%'}]}
                      source={require("@/assets/delete.png")}
                      />
                    </Pressable>
                </View>
              </View>
            </View>
        </View>
      </View>
    </Pressable>
  )}


 
  const renderCheckoutButton = () => (
    <Pressable style={styles.button}>
      <Image
        style={styles.iconLayout}
        source={require("@/assets/star1.png")}
      />
      <Text style={styles.button1}>Go to checkout <Text style={[tw`text-base font-medium`, { color: 'orange' }]}>£ {sumCheckout.toFixed(2)}</Text></Text>
      <Image
        style={[styles.xIcon, styles.iconLayout]}
        source={require("@/assets/x1.png")}
      />
    </Pressable>
  );

  const cartProducts = useMemo(() => {
    return state.products.filter((product: Product) => cartItems[product.id]?.quantity > 0);
  }, [state.products, cartItems]);

  return (
    <View style={styles.cart}>
      {cartProducts.length > 0 ? (
        <>
          <FlatList
            data={cartProducts}
            renderItem={renderCartElement}
            keyExtractor={(item) => item.id.toString()}
          />
          {renderCheckoutButton()}
        </>
      ) : (
        <Text style={[tw`text-center mt-4`]}>Your cart is empty</Text>
      )}
    </View>
  );
};

export default Cart;