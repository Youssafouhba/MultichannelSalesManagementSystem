import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, FlatList, Dimensions, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useFonts } from 'expo-font';
import axios from "axios";
import tw from 'tailwind-react-native-classnames';
import { API_BASE_URL } from "@/constants/GlobalsVeriables";
import { Product } from "@/constants/Classes";
import GroupComponent from "../components/GroupComponent";
import { Color } from "@/GlobalStyles";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ProductsService() {
  var categor = 0;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loaded, error] = useFonts({
    'KleeOne-Regular': require('../assets/fonts/KleeOne-Regular.ttf'),
    'kavoonRegular': require('../assets/fonts/Kavoon-Regular.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'VampiroOne-Regular': require('../assets/fonts/VampiroOne-Regular.ttf'),
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
    <View style={styles.productWrapper}>
      <Pressable style={styles.productInnerContainer}>
        <Image
          style={styles.productImage}
          source={{ uri: item.imageUrls[0]?.url || require("@/assets/rectangle-94.png") }}
        />
        <View style={tw`mt-1`}>
          <View style={tw`flex-row justify-between`}>
            <View style={tw`flex-row ml-1`}>
              <Text style={[tw`text-sm font-medium`, styles.priceText]}>{item.price}</Text>
              <Text style={tw`text-xs ml-1`}>£</Text>
            </View>
            <Text style={[styles.stockText]}><Text style={{color: Color.colorLimegreen}}>{item.stock}</Text> in stock</Text>
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

  const flat = () => (
    <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={11}
          onEndReachedThreshold={0.5}
          onEndReached={() => console.log("End reached")}
        />
  )

  if (!loaded) {
    return <Text>Loading fonts...</Text>;
  }

  const filterProducts = (category: string | null) => {
    if (category === "New designs") {
      categor = 1
      const filtered = products.filter(product => isNew(product.postedDate));
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <View style={styles.container}>
    <GroupComponent onCategorySelect={filterProducts} />
    
    <ScrollView
      style={[styles.scrollView,filteredProducts.length === 0 && styles.scroll]}
    >
      {filteredProducts.length === 0 ? (
        <View style={[styles.noProductsContainer, { height: '100%' }]}>
          <Text style={styles.noProductsText}>No products found</Text>
        </View>
      ) : (
        categor == 0? flat(): ''
        )
        }
    </ScrollView>
  </View>
  );
}


const getStyles = (screenWidth: number, screenHeight: number) => {
 // Calculez l'aspect ratio en fonction de la taille de l'écran
 const calculatedAspectRatio = screenWidth / screenHeight;
      
 // Ajustez l'aspect ratio du productWrapper en fonction de la taille de l'écran
 const productWrapperAspectRatio = calculatedAspectRatio > 0.5 ? 1.1 : 1;
 var s=screenHeight*0.21
 var ph = screenHeight/6+6
 // Calculez la maxHeight du ScrollView en pourcentage de la hauteur de l'écran
 const scrollViewMaxHeight = screenHeight * 0.70; // 73% de la hauteur de l'écran
 if(screenHeight<914){
  if(screenHeight<882){
      s=screenHeight*0.57
      if(screenHeight<=740)
          s=screenHeight*0.57
  }
}

if(screenHeight>=882){
  ph=screenHeight/6+26
}
return StyleSheet.create( 
  {
    
      scroll: {
          
          width: screenWidth,
          height: s,
      },
      eleme:{
          width: '50%',
          height: '100%',
          marginVertical: 4
      },
      gridContainer:{
          paddingHorizontal: 4,
          paddingVertical: 4,
          paddingBottom: 50,
      },
      product: {
          backgroundColor: 'black',
          height: ph,
          marginHorizontal: 4,
      },
  container: {
    width: '100%',
    backgroundColor: 'aliceblue',
  },
  scrollView: {
        width: screenWidth,
        maxHeight: s,
  },
  noProductsContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    
  },
  noProductsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  fullWidthProduct: {
    width: '100%', // Make the product take full width when in "New designs" category
  },
  productWrapper: {
    width: '50%',
    height: '100%',
    marginVertical: 4,
    //paddingVertical: 0,
    //paddingHorizontal: 4,
    //marginBottom: 1,
    //paddingTop: 4,
  },
  productInnerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    padding: 2,
    height: ph,
    marginHorizontal: 4,
  },
  productImage: {
    width: '100%',
    height: '70%',
    borderRadius: 8,
  },
  productInfo: {
    padding: 4,
  },
  priceStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  priceText: {
    fontFamily: 'kavoonRegular',
    fontSize: 12,
    color: Color.colorRed,
  },
  stockText: {
    fontFamily: 'kavoonRegular',
    fontSize: 10,
  },
  productName: {
    fontFamily: 'KleeOne-Regular',
    fontSize: 11,
    fontWeight: "600",
    color: 'black',
  },
  newBadge: {
    height: 30,
    width: 30,
    position: "absolute",
    top: 13,
    right: 13,
  },
}
);
  
};