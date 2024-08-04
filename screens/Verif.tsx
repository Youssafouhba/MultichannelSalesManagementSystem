import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, FlatList, Dimensions, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions, TextInput } from "react-native";
import { Image } from "expo-image";
import tw from 'tailwind-react-native-classnames';
import CeilingCalculator from "./CeillingCalculator";
import { Color, Padding, styles } from "@/GlobalStyles";
import { groupecomponentstyles, headerstyles } from "@/GlobalStyles";
import StarRating from "@/components/StarRating";
import { useRouter } from 'expo-router';
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAppContext } from "@/components/AppContext";
import { useAppData } from "@/components/AppDataProvider";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/constants/Classes";

export default function ProductsService() {
  const { width, height } = useWindowDimensions();
  const [selectedLabel, setSelectedLabel] = useState<string>("Best Seller");
  const { BestProducts, NewProducts, data, user, token } = useAppData();
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productRatings, setProductRatings] = useState<{[key: number]: number}>({});
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [inputSearch, setInputSearch] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const isLoggedIn = token !== '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProducts(data?.products || []);
        dispatch({ type: 'SET_PRODUCTS', payload: data?.products || [] });
        setProductRatings(data?.ratings || {});
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [data]);

  useEffect(() => {
    if (products.length > 0) {
      switch (selectedLabel) {
        case "New designs":
          setFilteredProducts(NewProducts);
          break;
        case "Best Seller":
          setFilteredProducts(BestProducts);
          break;
        default:
          setFilteredProducts(products);
          break;
      }
      setShowSuggestions(selectedLabel !== "all");
    }
  }, [products, selectedLabel, NewProducts, BestProducts]);

  const styles = useMemo(() => createStyles(width, height), [width, height]);

  const debouncedSearch = useCallback(
    debounce((key: string) => {
      if (key.trim() === '') {
        setFilteredProducts(products);
        setSelectedLabel('all');
        setShowSuggestions(true);
      } else {
        const filtered = products.filter(
          (product) =>
            product.name.toLowerCase().includes(key.toLowerCase()) ||
            product.price.toString().includes(key)
        );
        setFilteredProducts(filtered);
        setSelectedLabel('all');
        setShowSuggestions(false);
      }
    }, 300),
    [products]
  );

  const handleInputChange = (text: string) => {
    setInputSearch(text);
    debouncedSearch(text);
  };

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <Pressable 
      style={[styles.productWrapper, selectedLabel === "New designs" && styles.fullWidthProduct]}
      onPress={() => router.push(`/ProductDetails?id=${item.id}`)}
    >
      <View style={[styles.productInnerContainer, selectedLabel === "New designs" && styles.fullWidthInnerContainer]}>
        <Image
          contentFit="cover"
          style={[styles.productImage, selectedLabel === "New designs" && styles.fullWidthImage]}
          source={{ uri: item.imageUrls[0]?.url || require("@/assets/rectangle-94.png") }}
        />
        <View style={[styles.productDesc, selectedLabel === "New designs" && styles.fullWidthDesc]}>
          <Text style={[styles.productName, selectedLabel === "New designs" && styles.fullWidthName]} numberOfLines={selectedLabel === "New designs" ? 3 : 2} ellipsizeMode="tail">
            {item.name}
          </Text>
          <View style={[styles.infoArea, selectedLabel === "New designs" && { marginTop: 5 }]}>
            <Text style={[styles.priceText, selectedLabel === "New designs" && styles.fullWidthPrice]}>
              £ {item.price}
            </Text>
            <Text style={[styles.stockText, selectedLabel === "New designs" && styles.fullWidthStock]}>
              <Text style={{ color: Color.colorize_gray }}>{item.quantityInStock}</Text> in stock
            </Text>
          </View>
          <View style={[styles.badgeArea, selectedLabel === "New designs" && { marginTop: 5 }]}>
            <View style={[styles.offerBadge, selectedLabel === "New designs" && { marginRight: 15 }]}>
              <Text style={[styles.offerText, selectedLabel === "New designs" && styles.fullWidthOfferText]}>Offer</Text>
            </View>
            <StarRating rating={productRatings[parseInt(item.id)]} />
          </View>
        </View>
      </View>
      {item.isNew && (
        <Image
          style={[styles.newBadge, selectedLabel === "New designs" && styles.fullWidthNewBadge]}
          source={require("../assets/badge_143875.png")}
        />
      )}
    </Pressable>
  ), [selectedLabel, productRatings, router]);

  const renderProductList = useMemo(() => (
    <FlatList
      style={{ flex: 1 }}
      data={filteredProducts}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id.toString()}
      numColumns={selectedLabel === "New designs" ? 1 : 2}
      columnWrapperStyle={selectedLabel !== "New designs" ? styles.row : undefined}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.flatListContent}
    />
  ), [filteredProducts, selectedLabel, renderProduct, styles]);

  const renderCategoryButton = useCallback((label: string) => (
    <Pressable
      key={label}
      onPress={() => setSelectedLabel(label)}
      style={({ pressed }) => [
        tw`w-28`,
        pressed && groupecomponentstyles.pressed
      ]}
    >
      <View
        style={[
          groupecomponentstyles.variantneutralStatehover,
          selectedLabel === label && groupecomponentstyles.selectedButton
        ]}
      >
        <Text
          style={[
            groupecomponentstyles.texto,
            selectedLabel === label && groupecomponentstyles.selectedButtonText,
            tw`text-base font-normal text-sm`
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  ), [selectedLabel]);

  const renderGroupElement = useMemo(() => (
    <View style={[tw`w-full`, { backgroundColor: Color.mainbackgroundcolor }]}>
      <View style={[tw`flex-row justify-between items-center text-center mx-2 pl-2 pr-2`]}>
        <Pressable onPress={() => setSelectedLabel("Best Seller")}>
          <Text style={[tw`text-base text-gray-400 font-normal text-lg`, showSuggestions && { color: 'black' }]}>
            Suggestions
          </Text>
        </Pressable>
        <Pressable onPress={() => setSelectedLabel("all")}>
          <View style={styles.modelightStateenabled}>
            <Text style={[styles.textTypo, tw`text-base text-gray-400 font-normal text-lg`, !showSuggestions && { color: 'black' }]}>View All</Text>
          </View>
        </Pressable>
      </View>
      <View style={tw`flex-row justify-around my-2`}>
        {renderCategoryButton("Best Seller")}
        {renderCategoryButton("New designs")}
        {renderCategoryButton("Ceilling Calculator")}
      </View>
    </View>
  ), [showSuggestions, renderCategoryButton]);

  const searchContainer = useMemo(() => (
    <View style={tw`h-15 w-full items-center overflow-hidden bg-white`}>
      <View style={tw`flex-row items-center px-4 py-2 bg-gray-100 rounded-full`}>
        <TextInput
          placeholder="Search..."
          value={inputSearch}
          onChangeText={handleInputChange}
          style={tw`flex-1 text-base`}
          numberOfLines={1}
        />
        <Ionicons name="search" size={25} color="gray" style={tw`ml-3`} />
      </View>
      {user && (
        <View style={tw`absolute right-4 top-2`}>
          <Text style={tw`text-blue-400 text-sm`}>Hi {user.name}</Text>
        </View>
      )}
    </View>
  ), [inputSearch, user, handleInputChange]);

  return (
    <View style={styles.container}>
      {searchContainer}
      {renderGroupElement}
      {isLoading ? (
        <ScrollView contentContainerStyle={{ alignItems: 'center', top: '40%' }} style={styles.scrollView}>
          <LoadingAnimation size={80} color="blue" />
          <Text style={tw`text-base text-xs text-gray-400`}>Loading...</Text>
        </ScrollView>
      ) : (
        <SafeAreaView style={styles.scrollView}>
          {selectedLabel === "Ceilling Calculator" ? (
            <CeilingCalculator />
          ) : filteredProducts.length === 0 ? (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsText}>No products found</Text>
            </View>
          ) : (
            renderProductList
          )}
        </SafeAreaView>
      )}
    </View>
  );


  function createStyles(screenWidth: number, screenHeight: number)  {
    
    return StyleSheet.create({
      listContainer: {
        flex: 1,
        padding: 10,
      },
      flatListContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
      },
      row: {
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      rectangle: {
        borderRadius: 8,
        marginBottom: 10,
      },
    container: {
      flex: 1,
      width: '100%',
    },
    scrollView: {
      flex: 1,
      width: '100%',
    },
    gridContainer: {
      justifyContent: 'space-between',
    },
    productWrapper: {
      marginBottom: 10,
      borderRadius: 8,
      overflow: 'hidden',
    },
    fullWidthProduct: {
      height: ((screenHeight*0.62)/3),//nwe
      width: '100%',
    },
    productInnerContainer: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 3,
      shadowColor: 'gray',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    fullWidthInnerContainer: {
      height: '100%',
      width: '100%',
      flexDirection: 'row',
    },
    productImage: {
      width: '100%',
      height: imgheight, // 60% de la hauteur du wrapper
      borderRadius: 8,
    },
    fullWidthImage: {
      width: '45%',
      height: '100%',
      borderBottomRightRadius: 10,
      borderTopRightRadius: 10,
    },
    productDesc: {
      padding: 8,
      paddingTop: 2,//
      flex: 1,
      justifyContent: 'space-between',
    },
    fullWidthDesc: {
      
      width: '50%',
      padding: 15,
    },
    productName: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    fullWidthName: {
      width: '80%',
      fontSize: 16,
    },
    infoArea: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      alignItems: 'center',
      marginTop: 4,
    },
    offerBadge: {
      backgroundColor: '#e71d36',
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 2,
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
    textTypo: {
      textAlign: "left",
      lineHeight: 18,
    },
    text: {
      marginLeft: 3,
    },
    modelightStateenabled: {
      flexDirection: "row",
      paddingHorizontal: 0,
      paddingVertical: Padding.p_smi,
    },
  })};
}



