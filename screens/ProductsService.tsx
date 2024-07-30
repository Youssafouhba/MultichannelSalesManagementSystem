import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, FlatList, Dimensions, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import axios from "axios";
import tw from 'tailwind-react-native-classnames';
import { Product } from "@/constants/Classes";
import GroupComponent from "@/components/GroupComponent";
import CeilingCalculator from "./CeillingCalculator";
import { Color } from "@/GlobalStyles";
import { getStyles } from "@/GlobalStyles";
import StarRating from "@/components/StarRating";
import { useRouter } from 'expo-router';
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAppContext } from "@/components/AppContext";
import {sessionManager} from "@/components/sessionManager"
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');



export default function ProductsService() {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  var cartItems = state.cartItems || {};
  var isLoggedIn = state.JWT_TOKEN !=='';
  var token = state.JWT_TOKEN;

  const apiHandler = async (url) => {
    try {
      const response = await axios.get<Product[]>(`${state.API_BASE_URL}${url}`);
      console.log(response.data);
      return response;
    } catch (error) {
      console.log(error.response.data);
      return error.response;
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await apiHandler(`/api/Products`);
      setTimeout(() => {
        setProducts(response.data);
        state.products = response.data
        setFilteredProducts(response.data);
        setIsLoading(false);
      }, 2000);
    };
    fetchProducts();
  }, []);

  const isNew = (postedDate: string | Date): boolean => {
    const now = new Date();
    const posted = new Date(postedDate);
    const diffInDays = (now.getTime() - posted.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 7;
  }

  const styles = useMemo(() => createStyles(screenWidth, screenHeight), [screenWidth, screenHeight]);


  const renderProduct = ({ item }: { item: Product }) => (
    <View style={[styles.productWrapper, category === "New designs" && styles.fullWidthProduct]}>
      <Pressable 
        style={[styles.productInnerContainer, category === "New designs" && styles.fullWidthInnerContainer]}
        onPress={() => { router.push(`/ProductDetails?id=${item.id}`)}}
      >
        <Image
          contentFit="cover"
          style={[styles.productImage, category === "New designs" && styles.fullWidthImage]}
          source={{ uri: item.imageUrls[0]?.url || require("@/assets/rectangle-94.png") }}
        />
        <View style={[styles.productDesc, category === "New designs" && styles.fullWidthDesc]}>
          <Text style={[styles.productName, category === "New designs" && styles.fullWidthName]} numberOfLines={category === "New designs"?3:2} ellipsizeMode="tail">
            {item.name}
          </Text>
          <View style={[styles.infoArea, category === "New designs" &&{marginTop: 5}]}>
            <Text style={[styles.priceText, category === "New designs" && styles.fullWidthPrice]}>
              £ {item.price}
            </Text>
            <Text style={[styles.stockText, category === "New designs" && styles.fullWidthStock]}>
              <Text style={{color: Color.colorize_gray}}>{item.quantityInStock}</Text> in stock
            </Text>
          </View>
          <View style={[styles.badgeArea, category === "New designs" &&{marginTop: 5}]}>
            <View style={[styles.offerBadge,category === "New designs" && { marginRight: 15,}]}>
              <Text style={[styles.offerText, category === "New designs" && styles.fullWidthOfferText]}>Offer</Text>
            </View>
            <StarRating rating={4.5} />
          </View>
        </View>
      </Pressable>
      {isNew(item.postedDate) && (
        <Image
          style={[styles.newBadge, category === "New designs" && styles.fullWidthNewBadge]}
          source={require("../assets/badge_143875.png")}
        />
      )}
    </View>
  );

  const renderProductList = () => (
    <FlatList
      key={category}
      data={filteredProducts}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id.toString()}
      numColumns={category === "New designs" ? 1 : 2}
      contentContainerStyle={styles.gridContainer}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={11}
      onEndReachedThreshold={0.5}
      onEndReached={() => console.log("End reached")}
    />
  );

  const filterProducts = (categoryName: string | null) => {
    if (categoryName === "New designs") {
      setCategory(categoryName);
      const filtered = products.filter(product => isNew(product.postedDate));
      setFilteredProducts(filtered);
    } else  if (categoryName === "Ceilling Calculator")  {
      setCategory(categoryName);
      setFilteredProducts(products);
    }else{
      setCategory("all");
      setFilteredProducts(products);
    }
  };

  return (
    <View style={styles.container}>
      <GroupComponent onCategorySelect={filterProducts} />
      {isLoading? (
        <ScrollView contentContainerStyle={{alignItems: 'center',top: '40%'}} style={[styles.scrollView,{}]}>
          <LoadingAnimation size={80} color="blue" />
          <Text style={[tw`text-base text-xs text-gray-400`]}>Loading...</Text>
        </ScrollView>):
      (
      <SafeAreaView style={styles.scrollView}>
      {category === "Ceilling Calculator" ? (
        <CeilingCalculator />
      ) : filteredProducts.length === 0 ? (
        <View style={styles.noProductsContainer}>
          <Text style={styles.noProductsText}>No products found</Text>
        </View>
      ) : (
        renderProductList()
      )}
    </SafeAreaView>)}
      
    </View>
  );
}

const createStyles = (screenWidth: number, screenHeight: number) => StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
  },
  scrollView: {
    width: screenWidth,
    backgroundColor: '#ffffff',
    height: '73%',
    top: -10 
    //height: (screenHeight*0.61),
  },
  gridContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  productWrapper: {
    width: '51%',
    height: ((screenHeight*0.62)/2),//nwe
    marginBottom: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  fullWidthProduct: {
    height: ((screenHeight*0.61)/3),//nwe
    width: '100%',
  },
  productInnerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 3
  },
  fullWidthInnerContainer: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
  },
  productImage: {
    width: '100%',
    height: screenWidth * 0.4,
    borderRadius: 8,
  },
  fullWidthImage: {
    width: '45%',
    height: '100%',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  productDesc: {
    padding: 3,
  },
  fullWidthDesc: {
    width: '50%',
    padding: 15,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  fullWidthName: {
    fontSize: 16,
  },
  infoArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Color.colorRed,
  },
  fullWidthPrice: {
    fontSize: 16,
  },
  stockText: {
    fontSize: 12,
    color: Color.colorize_gray,
  },
  fullWidthStock: {
    fontSize: 14,
  },
  badgeArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 1,
    marginBottom: 2,
  },
  offerBadge: {
    backgroundColor: '#e71d36',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 5,
  },
  offerText: {
    color: '#f3de2c',
    fontSize: 10,
  },
  fullWidthOfferText: {
    fontSize: 12,
  },
  newBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 30,
    height: 30,
  },
  fullWidthNewBadge: {
    position: 'absolute',
    top: 0,
    right: -5,
    width: 50,
    height: 20,
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight * 0.7,
  },
  noProductsText: {
    fontSize: 18,
    color: Color.colorNavy,
  },
});