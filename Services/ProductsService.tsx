import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useFonts } from 'expo-font';
import axios from "axios";
import tw from 'tailwind-react-native-classnames';
import { API_BASE_URL } from "@/constants/GlobalsVeriables";
import { Product } from "@/constants/Classes";
import GroupComponent from "../components/GroupComponent";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ProductsService() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [loaded, error] = useFonts({
    'KleeOne-Regular': require('../assets/fonts/KleeOne-Regular.ttf'),
    'kavoonRegular': require('../assets/fonts/Kavoon-Regular.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'VampiroOne-Regular': require('../assets/fonts/VampiroOne-Regular.ttf')  
  });
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(`${API_BASE_URL}/Products`);
        setProducts(response.data);
        setFilteredProducts(response.data)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const isNew = (postedDate: string | Date): boolean => {
    const now = new Date();
    const posted = new Date(postedDate);
    const diffInDays = (now.getTime() - posted.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 7;
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productContainer}>
      <Pressable style={styles.productInnerContainer}>
        <Image
          style={styles.productImage}
          source={{ uri: item.imageUrls[0]?.url || require("@/assets/rectangle-94.png") }}
        />
        <View style={tw`mt-1`}>
          <View style={tw`flex-row justify-between`}>
            <View style={tw`flex-row`}>
              <Text style={[tw`text-sm font-medium`, styles.priceText]}>{item.price}</Text>
              <Text style={tw`text-xs ml-1`}>£</Text>
            </View>
            <Text style={[styles.stockText]}>{item.stock} in stock</Text>     
          </View>
          <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
        </View>
      </Pressable>
      {isNew(item.postedDate) && (
        <Image
          style={styles.newBadge}
          source={require("../assets/badge_143875.png")}
        />
      )}
    </View>
  );

  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }

  const filterProducts = (category: string | null) => {
    if (category === "New designs") {
      const filtered = products.filter(product => isNew(product.postedDate));
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const renderHeader = () => (
    <GroupComponent onCategorySelect={filterProducts} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={filteredProducts.slice(0, 6)}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: screenHeight - 200, // Adjust this value based on your header and footer sizes
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 8,
  },
  productContainer: {
    width: (screenWidth - 32) / 3, // 32 is total horizontal padding (8 * 4)
    marginBottom: 8,
    marginRight: 8,
  },
  productInnerContainer: {
    width: '100%',
    aspectRatio: 0.75, // Adjust this value to fit your design
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  priceText: {
    fontFamily: 'kavoonRegular',
  },
  stockText: {
    fontFamily: 'kavoonRegular',
    fontSize: 9,
  },
  productName: {
    fontFamily: 'KleeOne-Regular',
    fontSize: 10,
    fontWeight: "600",
    color: 'black',
  },
  newBadge: {
    height: 30,
    width: 30,
    zIndex: 1000,
    borderRadius: 8,
    position: "absolute",
    top: 4,
    right: 4,
  },
});