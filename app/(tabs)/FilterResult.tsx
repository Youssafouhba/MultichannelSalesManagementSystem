import React, { useEffect, useState, useMemo, useCallback } from "react";
import {Image, View, Text, Pressable, StyleSheet, FlatList, Dimensions, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions, TextInput } from "react-native";
import tw from 'tailwind-react-native-classnames';
import { Color, Padding } from "@/GlobalStyles";
import { groupecomponentstyles,headerstyles } from "@/GlobalStyles";
import StarRating from "@/components/StarRating";
import { useGlobalSearchParams, useRouter } from 'expo-router';
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAppContext } from "@/components/AppContext";
import { useAppData } from "@/components/AppDataProvider";
import { Ionicons } from "@expo/vector-icons";
import { Product, ProductInfos } from "@/constants/Classes";
import { debounce } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function FilterResult() {
  const { width, height } = useWindowDimensions();
  const [selectedLabel, setSelectedLabel] = useState<string | null>("Best Seller");
  const { ProductsInfos,data,user,fetchProductRating,token} = useAppData();
  const rectangleWidth = width / 2 - 15; // 15 est la marge entre les rectangles
  const rectangleHeight =(width/height) > 0.5 ? height /4+4:height *(width/height)-124; // Ajustez cette valeur selon vos besoi28
  const imgheight = (width/height) > 0.5 ? '55%': '62%';
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [sug,setsug] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<ProductInfos[] | undefined>([]);
  const styles = useMemo(() => createStyles(dimensions.width, dimensions.height), [dimensions]);
  const [inputsearch,setInputSearch] = useState<string>()

  const {filter} = useGlobalSearchParams()
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const gotodetails = (productinfos: ProductInfos) => {
    const payload = {
      ...productinfos,
    };
    dispatch({type: 'Set_previouspage',payload: "index"})
    navigation.navigate(`ProductDetails`,{payload})
  }

  useEffect(() => {
    setIsLoading(true);
    if (filter === 'applied') {
      setFilteredProducts(state.filtredproducts);
    }
    setIsLoading(false);
  }, [filter, state.filtredproducts,ProductsInfos]);

  const renderProduct = ({ item }: { item: ProductInfos }) => (
    <View style={[{ width: width / 2 - 15, height: height * 0.3 }, styles.productWrapper]}>
      <Pressable 
        style={styles.productInnerContainer}
        onPress={() => gotodetails(item)}
      >
        <Image
          style={styles.productImage}
          source={{ uri: item.product.imageUrls[0]?.url }}
        />
        <View style={styles.productDesc}>
          <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
            {item.product.name}
          </Text>
          <View style={styles.infoArea}>
            <Text style={styles.priceText}>
              £ {item.product.price}
            </Text>
            <Text style={styles.stockText}>
              <Text style={{color: Color.colorize_gray}}>{item.product.quantityInStock}</Text> in stock
            </Text>
          </View>
          <View style={styles.badgeArea}>
            <View style={styles.offerBadge}>
              <Text style={styles.offerText}>Offer</Text>
            </View>
            <StarRating rating={item.raiting} />
          </View>
        </View>
      </Pressable>
      {item.product.isNew && (
        <Image
          style={styles.newBadge}
          source={require("@/assets/badge_143875.png")}
        />
      )}
    </View>
  );

  const renderProductList = () => (
    <FlatList
      style={{ flex: 1 }}
      data={filteredProducts}
      renderItem={renderProduct}
      keyExtractor={(item) => item.product.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.flatListContent}
    />
  );

  const debouncedSearch = useCallback(
    debounce((key: string) => {
      if (key.trim() === '') {
        setFilteredProducts(state.filtredproducts || data?.products);
      } else {
        const filtered = (state.filtredproducts || data?.products)?.filter(
          (product: ProductInfos) =>
            product.product.name.toLowerCase().includes(key.toLowerCase()) ||
            product.product.category.toLowerCase().includes(key.toLowerCase()) ||
            product.product.price.toString().includes(key)
        );
        setFilteredProducts(filtered);
      }
    }, 300),
    [state.filtredproducts, data?.products]
  );

  const handleInputChange = (text: string) => {
    setInputSearch(text);
    debouncedSearch(text);
  };

  const searchContainer = useMemo(() => (
    <View style={tw`h-16 w-full items-center overflow-hidden bg-white`}>
      <View style={tw`flex-row w-80 items-center px-4 py-2 bg-gray-100 rounded-full`}>
        <TextInput
          placeholder="Search..."
          value={inputsearch}
          onChangeText={handleInputChange}
          style={tw`flex-1 text-base`}
          numberOfLines={1}
        />
        <Ionicons name="search" size={25} color="gray" style={tw`ml-3`} />
      </View>
    </View>
  ), [inputsearch, handleInputChange]);

  return (
    <View style={styles.container}>
      {searchContainer}
      {isLoading ? (
        <ScrollView contentContainerStyle={tw`items-center justify-center flex-1 w-full`}>
          <LoadingAnimation size={80} color="blue" />
          <Text style={tw`text-base text-xs text-gray-400`}>Loading...</Text>
        </ScrollView>
      ) : (
        <SafeAreaView style={styles.scrollView}>
          {filteredProducts?.length === 0 ? (
            <View style={[styles.noProductsContainer, tw`blur-md brightness-200`]}>
              <Text style={styles.noProductsText}>No products found</Text>
            </View>
          ) : (
            renderProductList()
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
      marginHorizontal: 6,
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

