import React, { useEffect, useState, useMemo, useCallback } from "react";
import {Image, View, Text, Pressable, StyleSheet, FlatList, Dimensions, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions, TextInput, ActivityIndicator } from "react-native";
import tw from 'tailwind-react-native-classnames';
import CeilingCalculator from "./CeillingCalculator";
import { Color, Padding } from "@/GlobalStyles";
import { groupecomponentstyles,headerstyles } from "@/GlobalStyles";
import StarRating from "@/components/StarRating";
import { useGlobalSearchParams } from 'expo-router';
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAppContext } from "@/components/AppContext";
import { useAppData } from "@/components/AppDataProvider";
import { Ionicons } from "@expo/vector-icons";
import { CommentItem, Product, ProductInfos } from "@/constants/Classes";
import { debounce } from "lodash";
import { router, useNavigation } from "expo-router";

export default function ProductsService() {
  const { width, height } = useWindowDimensions();
  const [selectedLabel, setSelectedLabel] = useState<string | null>("Best Seller");
  const { BestProducts,NewProducts,data,ProductsInfos,token} = useAppData();
  const rectangleWidth = width / 2 - 15; // 15 est la marge entre les rectangles
  const rectangleHeight =(width/height) > 0.5 ? height /4+4:height *(width/height)-124; // Ajustez cette valeur selon vos besoi28
  const imgheight = (width/height) > 0.5 ? '55%': '62%';
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const { state, dispatch } = useAppContext();
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [productsInfos, setProductsInfos] = useState<ProductInfos[] | undefined>(ProductsInfos);
  const [filteredProducts, setFilteredProducts] = useState<ProductInfos[] | undefined>([]);
  const styles = useMemo(() => createStyles(dimensions.width, dimensions.height), [dimensions]);

  const {filter} = useGlobalSearchParams()
  const [inputSearch, setInputSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSuggestionsMode, setIsSuggestionsMode] = useState(true);
  

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => subscription?.remove();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsInfos(ProductsInfos);
        setFilteredProducts(ProductsInfos)
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchData();
    
  }, [ProductsInfos]);


  useEffect(() => {
    if (isSuggestionsMode) {
      switch (selectedLabel) {
        case "New designs":
          setFilteredProducts(NewProducts);
          break;
        case "Best Seller":
          setFilteredProducts(BestProducts);
          break;
        case "Ceilling Calculator":
          break;
        default:
          break
      }
    } 
  }, [isSuggestionsMode, selectedLabel,ProductsInfos]);
 
  const gotodetails = (productinfos: ProductInfos) => {
    const payload = {
      ...productinfos,
    };
    navigation.navigate(`ProductDetails`,{payload})
  }
 

  const renderProduct = ({ item }: { item: ProductInfos }) => (
    <View style={[{width: rectangleWidth,height: rectangleHeight},styles.productWrapper, selectedLabel === "New designs" && styles.fullWidthProduct]}>
      <Pressable 
        style={[styles.productInnerContainer, selectedLabel === "New designs" && styles.fullWidthInnerContainer]}
        onPress={() => { gotodetails(item)}}
      >
        <Image
          style={[styles.productImage, selectedLabel === "New designs" && styles.fullWidthImage]}
          source={{ uri: item.product.imageUrls[0]?.url}}
        />
        <View style={[styles.productDesc, selectedLabel === "New designs" && styles.fullWidthDesc]}>
          <Text style={[styles.productName, selectedLabel === "New designs" && styles.fullWidthName]} numberOfLines={category === "New designs"?3:2} ellipsizeMode="tail">
            {item.product.name}
          </Text>
          <View style={[styles.infoArea, selectedLabel === "New designs" &&{marginTop: 5}]}>
            <Text style={[styles.priceText, selectedLabel === "New designs" && styles.fullWidthPrice]}>
              £ {item.product.price}
            </Text>
            <Text style={[styles.stockText, selectedLabel === "New designs" && styles.fullWidthStock]}>
              <Text style={{color: Color.colorize_gray}}>{item.product.quantityInStock}</Text> in stock
            </Text>
          </View>
          <View style={[styles.badgeArea, selectedLabel === "New designs" &&{marginTop: 5}]}>
            <View style={[styles.offerBadge,selectedLabel === "New designs" && { marginRight: 15,}]}>
              <Text style={[styles.offerText, selectedLabel === "New designs" && styles.fullWidthOfferText]}>Offer</Text>
            </View>
            <StarRating rating={parseFloat(item.raiting.toFixed(1))} />
          </View>
        </View>
      </Pressable>
      {item.product.isNew && (
        <Image
          style={[styles.newBadge, selectedLabel === "New designs" && styles.fullWidthNewBadge]}
          source={require("../assets/badge_143875.png")}
        />
      )}
    </View>
  );

  const renderProductList = () => (
    <View style={[styles.listContainer, tw``]}>
    {selectedLabel === "New designs"?(
      <FlatList
        style={{ flex: 1 }}
        key={selectedLabel}
        data={NewProducts} // Limiter à 4 éléments
        renderItem={renderProduct}
        keyExtractor={(item) => item.product.id.toString()}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true} // Désactiver le défilement
        contentContainerStyle={styles.flatListContent}
    />
    ):(
      <FlatList
        style={{ flex: 1 }}
        key={selectedLabel}
        data={selectedLabel === "Best Seller"?BestProducts:productsInfos} // Limiter à 4 éléments
        renderItem={renderProduct}
        keyExtractor={(item) => item.product.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true} // Désactiver le défilement
        contentContainerStyle={styles.flatListContent}
    />
    )}
    
  </View>
  );

  const filterProducts = (categoryName: string | null) => {
    setSelectedLabel(categoryName);
    setIsSuggestionsMode(categoryName !== "all");
  };

  const renderCategoryButton = (label: string) => (
    <Pressable
      key={label}
      onPress={() => filterProducts(label)}
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
  );

  const renderGroupElement = () => (
    <View style={[{backgroundColor: Color.colorWhite}, tw`w-full blur-md`]}>
      <View style={[tw`flex-row justify-between items-center text-center mx-2 pl-2 pr-2`]}>
        <Pressable onPress={() => filterProducts("Best Seller")}>
          <Text style={[tw`text-base text-gray-400 font-normal text-lg`, isSuggestionsMode && {color: 'black'}]}>
            Suggestions
          </Text>
        </Pressable>
        <Pressable onPress={() => filterProducts("all")}>
          <View style={[styles.modelightStateenabled]}>
            <Text style={[styles.textTypo, tw`text-base text-gray-400 font-normal text-lg`, !isSuggestionsMode && {color: 'black'}]}>
              View All
            </Text>
          </View>
        </Pressable>
      </View>
      <View style={tw`flex-row justify-around my-2`}>
        {renderCategoryButton("Best Seller")}
        {renderCategoryButton("New designs")}
        {renderCategoryButton("Ceilling Calculator")}
      </View>
    </View>
  );


  const debouncedSearch = useCallback(
    debounce((key: string) => {
      setIsSearching(true);
      if (key.trim() == '') {
        setIsSearching(false);
        setSelectedLabel("Best Seller")
      } else {
        const filtered = ProductsInfos.filter(
          (product: ProductInfos) =>
            product.product.name.toLowerCase().includes(key.toLowerCase()) ||
            product.product.category.toLowerCase().includes(key.toLowerCase()) ||
            product.product.price.toString().includes(key)
        );
        setProductsInfos(filtered);
        setIsSearching(false);
      }

    }, 300),
    [productsInfos]
  );

  const handleInputChange = (text: string) => {
    setInputSearch(text);
    if (text.trim() === '') {
      setIsSuggestionsMode(true);
      setSelectedLabel("Best Seller");
      setFilteredProducts(productsInfos || []);
    } else {
      setIsSuggestionsMode(false);
      debouncedSearch(text);
    }
  };

  const searchContainer = useMemo(() => (
    <View style={[tw`h-16 w-full items-center overflow-hidden bg-white`]}>
      <View style={tw`flex-row w-80 items-center px-4 py-2 bg-gray-100 rounded-full`}>
        <TextInput
          placeholder="Search..."
          value={inputSearch}
          onChangeText={handleInputChange}
          style={tw`flex-1 text-base`}
          numberOfLines={1}
        />
        {isSearching ? (
          <ActivityIndicator size="small" color="gray" style={tw`ml-3`} />
        ) : (
          <Ionicons name="search" size={25} color="gray" style={tw`ml-3`} />
        )}
      </View>
      {state.isLoggedIn && (
      <View style={[tw``,{right: '35%'}]}>
        <Text style={tw`text-blue-400 text-sm`}>Hi {state.user?.name || 'User'}</Text>
      </View>
      )}
    </View>
  ), [inputSearch, state.user, handleInputChange, isSearching]);

  return (
    <View style={styles.container}>
      {searchContainer}
      {renderGroupElement()}
      {isLoading? (
        <ScrollView contentContainerStyle={{alignItems: 'center',top: '40%',flex: 1,width: '100%'}}>
          <LoadingAnimation size={80} color="blue" />
          <Text style={[tw`text-base text-xs text-gray-400`]}>Loading...</Text>
        </ScrollView>):
      (
      <SafeAreaView style={styles.scrollView}>
      {selectedLabel === "Ceilling Calculator" ? (
        <CeilingCalculator />
      ) : filteredProducts.length === 0 ? (
        <View style={[styles.noProductsContainer,tw`blur-md brightness-200`]}>
          <Text style={styles.noProductsText}>No products found</Text>
        </View>
      ) : (
        renderProductList()
      )}
      </SafeAreaView>)}
    </View>

  );


  function createStyles(screenWidth: number, screenHeight: number)  {
    
    return StyleSheet.create({
      listContainer: {
        flex: 1,
        padding: 10,
        paddingBottom: 0,
      },
      flatListContent: {
        flexGrow: 1,
      },
      row: {
        justifyContent: 'space-between',
        marginBottom: 6,
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
      backgroundColor: Color.colorWhite,
      top: -4,
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
      backgroundColor: '#FBFDFF',
      borderRadius: 8,
      elevation: 3,
      shadowColor: 'rgba(1 ,1, 1, 0.03)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
    },
    fullWidthInnerContainer: {
      height: '100%',
      width: '100%',
      flexDirection: 'row',
      backgroundColor: '#FBFDFF',
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

