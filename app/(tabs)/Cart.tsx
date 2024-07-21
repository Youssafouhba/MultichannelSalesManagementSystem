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
var cartPItems: {[key: string]: number} ={}
const Cart = () => {
  
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
 
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [sumCheckout, setSumCheckout] = useState<number>(0);
  const [actualId,setActualId] = useState<string>()
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
      try {
        const response = await axios.get<Product[]>(`${API_BASE_URL}/Products`);
        setProducts(response.data);
        // Initialize cart items
        const initialCart = response.data.reduce((acc, product) => {
          acc[product.id] = 1; // Start with 1 item for each product
          return acc;
        }, {} as {[key: string]: number});
        setCartItems(initialCart);
        cartPItems = cartItems
      } catch (error) {
        console.error("Error fetching products:", error);
      }
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
    <View>
      <Pressable style={[tw`flex-row`, styles.CardsProductWrapper]} onPress={() => {}}>
        <View style={[styles.productImage]}>
          <Image
            style={[tw`w-20 h-20 rounded-lg`]}
            contentFit="cover"
            source={{uri: item.imageUrls[0]?.url}}
          />
        </View>
        <View style={[tw`flex-row w-40 ml-4 mt-2`]}>
          <View>
            <Text
              style={[styles.productText]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Text style={[tw`mt-3`, {fontFamily: 'Langar-Regular', color: Color.colorDarkblue, fontSize: FontSize.size_mini, lineHeight: 14}]}>
              {(cartItems[item.id] || 0) * item.price}£
            </Text>
          </View>
          <View style={[tw`flex-row top-7 -right-16 absolute`]}>
            <TouchableOpacity
              onPress={() => updateItemQuantity(item.id, -1)}>
              <Image
                style={[tw`w-3 h-4`]}
                contentFit="cover"
                source={require("@/assets/minus.png")}
              />
            </TouchableOpacity>
            <Text style={[tw`w-6 h-8 -mt-2 pt-1 ml-3`]}>{cartItems[item.id] || 0}</Text>
            <TouchableOpacity
              onPress={() => updateItemQuantity(item.id, 1)}>
              <Image
                style={[tw`w-4 h-4 left-1`]}
                contentFit="cover"
                source={require("@/assets/plus.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => removeItem(item.id)}
              style={[tw`-top-9`]}
              >
              <Image
                style={[tw`h-4 w-4 left-4 rounded-lg`]}
                tintColor={Color.colorGray_100}
                source={require("@/assets/images/icons8-effacer-48.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </View>
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
      <Image
        style={styles.cartChild}
        contentFit="cover"
        source={require("@/assets/rectangle-111.png")}
      />
      <View style={[styles.cartheader]}>
        <View>
        <TouchableOpacity onPress={() => {}}>
           <TabBarIcon name={'arrow-back'} color={'black'} />
        </TouchableOpacity>
        </View>
        <View>
          <Text style={[styles.cartText,{fontFamily: 'kavoonRegular'}]}>Cart</Text>
        </View>
      </View>
      <Text style={[styles.yourCart, styles.cartTypo]}>Your Cart</Text>
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
