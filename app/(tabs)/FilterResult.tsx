import React, { useEffect, useState, useMemo, useCallback } from "react";
import {Image, View, Text, Pressable, StyleSheet, FlatList, Dimensions, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions, TextInput } from "react-native";
import tw from 'tailwind-react-native-classnames';
import { Color, Padding } from "@/GlobalStyles";
import StarRating from "@/components/StarRating";
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from "@/components/AppContext";
import { useAppData } from "@/components/AppDataProvider";
import { ProductInfos } from "@/constants/Classes";
import { useNavigation } from "@react-navigation/native";
import DynamicSearchBar from "@/components/DynamicSearchBar";
import Spinner from "react-native-loading-spinner-overlay";
import useInternetCheck from "@/components/useInternetCheck";
import NoInternetConnection from "@/components/NoInternetConnection";

export default function FilterResult() {
  const { width, height } = useWindowDimensions();
  const { ProductsInfos} = useAppData();
  const imgheight = (width/height) > 0.5 ? '55%': '62%';
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const { appstate } = useAppContext();
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<ProductInfos[] | undefined>([]);
  const styles = useMemo(() => createStyles(dimensions.width, dimensions.height), [dimensions]);
  const {filter} = useGlobalSearchParams()
  const {setPreviouspage} = useAppContext()
  const { isConnected, connectionType } = useInternetCheck();
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
    setPreviouspage("index")
    navigation.navigate(`ProductDetails`,{payload})
  }

  useEffect(() => {
    setIsLoading(true);
    if (filter === 'applied') {
      setFilteredProducts(appstate.filtredproducts);
    }
    setIsLoading(false);
  }, [filter, appstate.filtredproducts,ProductsInfos]);

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
            {item.product.quantityInStock <= 0 ? (
              <Text style={[styles.outOfStockText]}>
                Out of Stock
              </Text>
            ) : (
              <Text style={[styles.stockText]}>
                <Text style={{color: Color.colorize_gray}}>{item.product.quantityInStock}</Text> in stock
              </Text>
            )}
          </View>
          <View style={styles.badgeArea}>
            <View style={styles.offerBadge}>
              <Text style={styles.offerText}>Offer</Text>
            </View>
            <StarRating rating={parseFloat(item.raiting.toFixed(1))} />
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

  const handelselectItem = (item: ProductInfos[]) => {
    if(item.length>0){
      setFilteredProducts(item)
    }else{
      setFilteredProducts([])
    }
  }
  return (
    <View style={styles.container}>
        <DynamicSearchBar data={ProductsInfos} onItemSelect={handelselectItem} />
        <Spinner
          visible={isLoading}
          overlayColor="rgba(0,0,0,0.01)"
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
         {
      !isConnected?
      <NoInternetConnection/>
      :
        <SafeAreaView style={styles.scrollView}>
          {filteredProducts?.length === 0 ? (
            <View style={[styles.noProductsContainer, tw`blur-md brightness-200`]}>
              <Text style={styles.noProductsText}>No products found</Text>
            </View>
          ) : (
            renderProductList()
          )}
        </SafeAreaView>
        }
    </View>
  );
  function createStyles(screenWidth: number, screenHeight: number)  {
    return StyleSheet.create({
      outOfStockText: {
        fontSize: 12,
        color:  Color.colorize_gray,
        fontWeight: 'bold',
      },
      fullWidthOutOfStock: {
        fontSize: 14,
      },
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
      height: imgheight,
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
      paddingTop: 2,
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