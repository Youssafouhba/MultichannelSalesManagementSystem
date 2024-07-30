import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View,Pressable ,Alert,TouchableOpacity, FlatList} from "react-native";
import Button1 from "../../components/Button1";
import { Product } from "@/constants/Classes";
import { Color, FontSize, FontFamily,productlistheight } from "../../GlobalStyles";
import { cardstyles as styles } from "../../GlobalStyles";
import tw from 'tailwind-react-native-classnames';
import { useFonts } from 'expo-font';
import axios from "axios";
import { API_BASE_URL } from "@/constants/GlobalsVeriables";
import { Footer } from "@/components/Footer";

import { cartItemsNumber } from "@/constants/GlobalsVeriables";

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import StarRating from "@/components/StarRating";
import { useAppContext } from "@/components/AppContext";
var cartPItems: {[key: string]: number} ={}
const Cart = () => {

  const { state, dispatch } = useAppContext();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
 
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [sumCheckout, setSumCheckout] = useState<number>(0);
  const [actualId,setActualId] = useState<string>()
  const route = useRoute();
  
  const navigation = useNavigation();
  const [loaded, error] = useFonts({
    'KleeOne-Regular': require('@/assets/fonts/KleeOne-Regular.ttf'),
    'kavoonRegular': require('@/assets/fonts/Kavoon-Regular.ttf'),
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
    'VampiroOne-Regular': require('@/assets/fonts/VampiroOne-Regular.ttf'),
    'GermaniaOne-Regular': require('@/assets/fonts/GermaniaOne-Regular.ttf'),
    'Langar-Regular': require('@/assets/fonts/Langar-Regular.ttf'),
    'KiteOne-Regular': require('@/assets/fonts/KiteOne-Regular.ttf'),
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(state.products);
      const initialCart = state.products.reduce((acc, product) => {
        acc[product.id] = 1;
        return acc;
      }, {} as {[key: string]: number});
      setCartItems(initialCart);
      cartPItems = cartItems
      console.log(initialCart)
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Calculate sum and total items whenever cartItems or products change
    const total = products.reduce((sum, product) => {
      return sum + (cartItems[product.id] || 0) * product.price;
    }, 0);

    const itemCount = Object.values(cartItems).reduce((count, quantity) => count + quantity, 0);

    setSumCheckout(total);
    setTotalItems(itemCount);
    
  }, [products, cartItems]);


  
  const updateItemQuantity = (productId: string, change: number) => {
    setCartItems(prev => {
      const newQuantity = Math.max(0, (prev[productId] || 0) + change);
      if (newQuantity === 0) {
        const { [productId]: _, ...rest } = prev;
        console.log(prev)
        return rest;
      }
      console.log(prev)
      return { ...prev, [productId]: newQuantity };
    });
  };

  const removeItem = (productId: string) => {
    setCartItems(prev => {
      const { [productId]: _, ...rest } = prev;
      
      return rest;
    });
    console.log('rest')
  };
  
  const renderCartElement = ({item}: {item: Product}) => (
    <Pressable style={[tw`flex-row`,styles.CardsProductWrapper]} onPress={() => {}}>
      <View style={[tw`flex-row justify-between`,{width: '100%'}]}>
        <View style={[styles.productImage]}>
          <Image
            style={[tw`rounded-lg`,{width: '100%',height: '100%'}]}
            contentFit="cover"
            source={{uri: item.imageUrls[0]?.url}}
          />
        </View>
        <View style={[tw`flex-col w-60 mx-1`,{}]}>
            <View style={[tw`flex-row`,{height: '30%',}]}>
              <View style={[tw`flex-row justify-between px-2`,{backgroundColor: Color.COLORALICEBLUE,width: '56%'}]}>
                <Text style={[tw`text-base text-gray-900 font-medium text-xl`]}>£ {item.price}</Text>
                <View style={[tw`flex-col `,{width: 'max-content'}]}>
                  <Text style={[tw`text-base text-gray-400 font-normal text-xs`,{marginTop: '10%'} ]}>
                    £ {100}
                  </Text>
                </View>
              </View>
              <View style={[tw`flex-row text-center justify-start`,{backgroundColor: Color.COLORALICEBLUE,width: '44%'}]}>
                  <TouchableOpacity
                    style={[tw`text-center rounded  pt-2 pl-2 pr-2`,{alignContent: 'center',backgroundColor: Color.COLORALICEBLUE}]}
                        onPress={() => {}}>
                        <Image
                            style={[tw`w-3 h-4`]}
                            contentFit="cover"
                            tintColor={'orangered'}
                            source={require("@/assets/minus.png")}
                        />
                    </TouchableOpacity>
                    <Text style={[tw`text-base text-gray-400 font-normal w-10 bg-white text-center h-8  pt-1 `,{alignContent: 'center',}]}>
                      {cartItems[item.id]}
                    </Text>
                    <TouchableOpacity
                        style={[tw`text-center rounded pt-2 pl-1 pr-2`,{alignContent: 'center',backgroundColor: Color.COLORALICEBLUE}]}
                        onPress={() => {}}>
                        <Image
                            style={[tw`w-4 h-4 left-1`]}
                            contentFit="cover"
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
                </View>
              </View>
            </View>
        </View>
      </View>
 {
  /*
  
  <View style={[tw`flex-row w-40`,{},]}>
            <View style={[tw``]}>
              <Text style={[tw`text-base text-gray-900 font-medium text-xl`]}>£ {item.price}</Text>
              <Text style={[tw`text-base text-gray-600 font-normal`]}>{item.stock} in Stock</Text>
            </View>
            <View style={[tw`flex-col `,{width: 'max-content'}]}>
              <Text style={[tw`text-base text-gray-400 font-normal mt-3`,{} ]}>£ {100}</Text>
              <Text style={[tw`-top-7`,{fontWeight: 2,color: Color.colorGray_100,}]}>______</Text>
            </View>
          </View>
          <View style={[tw`flex-row text-center justify-end w-32 -top-10 left-28`,{}]}>
              <TouchableOpacity
                    style={[tw`text-center  pt-2 pl-2 pr-2`,{alignContent: 'center',backgroundColor: Color.colorWhitesmoke_50}]}
                        onPress={() => {}}>
                        <Image
                            style={[tw`w-3 h-4`]}
                            contentFit="cover"
                            tintColor={'orangered'}
                            source={require("@/assets/minus.png")}
                        />
                    </TouchableOpacity>
                    <Text style={[tw`text-base text-gray-400 font-normal w-10 bg-white text-center h-8  pt-1 `,{alignContent: 'center',}]}>
                      {cartItems[item.id]}
                    </Text>
                    <TouchableOpacity
                        style={[tw`text-center pt-2 pl-1 pr-2`,{alignContent: 'center',backgroundColor: Color.colorWhitesmoke_50}]}
                        onPress={() => {}}>
                        <Image
                            style={[tw`w-4 h-4 left-1`]}
                            contentFit="cover"
                            source={require("@/assets/plus.png")}
                        />
                    </TouchableOpacity>
              
          </View>
          <View style={[tw`flex-col -mt-9 pb-2`,{}]}>
              <Text style={[tw`text-base text-gray-900 font-normal `]}  ellipsizeMode="tail">{item.name}</Text>
              <View style={[tw`absolute mt-12 flex-row `,{alignItems: 'center'}]}>
                  <View style={[tw`flex-row justify-start`,{}]}>
                      <StarRating rating={4.5} /> 
                  </View>
                  <Text style={[tw`text-base text-gray-900 font-normal ml-2 text-xs`]}>| +1000 vendus</Text>
              </View>
          </View>
  */
 }
    </Pressable>
  );

  const renderCheckoutButton = () => (
    <Pressable style={styles.button}>
      <Image
        style={styles.iconLayout}
        contentFit="cover"
        source={require("@/assets/star1.png")}
      />
      <Text style={styles.button1}>{`Go to checkout . ${sumCheckout.toFixed(2)} £`}</Text>
      <Image
        style={[styles.xIcon, styles.iconLayout]}
        contentFit="cover"
        source={require("@/assets/x1.png")}
      />
    </Pressable>
  );

  const cartProducts = useMemo(() => {
    return products.filter(product => cartItems[product.id] > 0);
  }, [products, cartItems]);

  return (
    <View style={styles.cart}>
  
      <View style={[styles.CardsProduct]}>
        <FlatList
          data={cartProducts}
          renderItem={renderCartElement}
          keyExtractor={(item) => item.id.toString()}
          />
      </View>
      {renderCheckoutButton()} 
    </View>
  );
};



export default Cart;
