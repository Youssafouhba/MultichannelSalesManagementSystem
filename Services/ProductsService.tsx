import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, FlatList, Dimensions, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useFonts } from 'expo-font';
import axios from "axios";
import tw from 'tailwind-react-native-classnames';
import { API_BASE_URL } from "@/constants/GlobalsVeriables";
import { Product } from "@/constants/Classes";
import GroupComponent from "@/components/GroupComponent";
import CeilingCalculator from "./CeillingCalculator";
import { Color } from "@/GlobalStyles";
import { getStyles } from "@/GlobalStyles";
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ProductsService() {
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loaded, error] = useFonts({
    'KleeOne-Regular': require('../assets/fonts/KleeOne-Regular.ttf'),
    'kavoonRegular': require('../assets/fonts/Kavoon-Regular.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'VampiroOne-Regular': require('../assets/fonts/VampiroOne-Regular.ttf'),
    'GermaniaOne-Regular': require('../assets/fonts/GermaniaOne-Regular.ttf'),
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(`${API_BASE_URL}/Products`);
        setProducts(response.data);
        setFilteredProducts(response.data);
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

  const styles = useMemo(() => getStyles(screenWidth, screenHeight), [screenWidth, screenHeight]);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={[styles.productWrapper, category === "New designs" && styles.fullWidthProduct]}>
      <Pressable style={[styles.productInnerContainer,category === "New designs" &&  styles.fullproductInnerContainer ]}>
        <Image
          style={[styles.productImage, category === "New designs" && styles.fullproductImage]}
          source={{ uri: item.imageUrls[0]?.url || require("@/assets/rectangle-94.png") }}
        />
        <View style={[tw`mt-1 w-40`,category === "New designs" && tw`ml-2 h-80`]}>
       
          <Text style={styles.productName} numberOfLines={category === "new_designs"? 2:1}  ellipsizeMode="tail">{item.name}</Text>
          <View style={[tw`flex-row justify-between`,styles.infosarea]}>
            <View style={tw`flex-row ml-1`}>
              <Text style={[tw`text-sm font-medium`, styles.priceText]}>{item.price}</Text>
              <Text style={tw`text-xs ml-1`}>£</Text>
            </View>
            <Text style={[styles.stockText]}><Text style={{color: Color.colorLimegreen}}>{item.stock}</Text> in stock</Text>
          </View>
        </View>
      </Pressable>
      {isNew(item.postedDate) && (
        <Image
          style={[styles.newBadge ,category === "New designs" && styles.fullnewBadge ]}
          source={require("../assets/badge_143875.png")}
        />
      )}
    </View>
  );

  const renderProductList = () => (
    <FlatList
      key={category} // This key will force a re-render when the category changes
      data={filteredProducts}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id.toString()}
      numColumns={category === "New designs" ? 1 : 2}
      contentContainerStyle={styles.gridContainer}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={11}
      onEndReachedThreshold={0.5}
      onEndReached={() => console.log("End reached")}
    />
  );

  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }

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
      <ScrollView
        style={[styles.scrollView]}
      >
        {
          category=== "Ceilling Calculator"?(<CeilingCalculator/>):(
            filteredProducts.length === 0 ? (
              <View style={[styles.noProductsContainer, { height: '100%' }]}>
                <Text style={styles.noProductsText}>No products found</Text>
              </View>
            ) : (
              renderProductList()
            )
          )
        } 
      </ScrollView>
    </View>
  );
}

