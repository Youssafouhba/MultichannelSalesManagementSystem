import React, { useCallback, useState } from 'react'
import {Image, Text, View, Pressable, TouchableOpacity, FlatList, SafeAreaView, ScrollView } from "react-native";

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Color } from '@/GlobalStyles';
import tw from 'tailwind-react-native-classnames';
import {  useFocusEffect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { Product, ProductInfos } from '@/constants/Classes';
import StarRating from '@/components/StarRating';
import { useAppContext } from '@/components/AppContext';
import OptimizedDescription from '@/components/OptimizedDescription';
import CommentSystem from '@/components/CommentSystem';
import CartAddAlert from '@/components/CartAddAlert';
import axios from 'axios';
import { useNavigation } from "expo-router";
import config from '@/components/config';
import { useRoute } from '@react-navigation/native';
import LoginRequiredAlert from '@/components/LoginRequiredAlert';
import { useUser } from '@/contex/UserContext';
import { useCart } from '@/contex/CartContex';

interface RouteParams {
    payload: ProductInfos; // Replace 'any' with the actual type of payload
}

export default function ProductDetails() {
    const { appstate,setPreviouspage,setProduct } = useAppContext();
    const { state } = useUser();
    const {statecart,addToCart,updateItemQuantity} = useCart()
    const route = useRoute();
    const [alertVisible, setAlertVisible] = useState(false);
    const [LogInAlertVisible, setLogInAlertVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('')
    const [quantity, setQuantity] = useState<number>(1)
    const navigation = useNavigation<any>();
    const [addedItem, setAddedItem] = useState({ name: '', quantity: 0 });
    const [isFavorit,setIsfavorit] = useState<boolean>(false)
    const {product,comments,raiting,saledQuantity} = (route.params as RouteParams)?.payload;

    useFocusEffect(
        useCallback(() => {
            const fetchProduct = async () => {
                console.log("ok")
                setIsfavorit(state.userInfos.wishlist.filter((p: Product)=>p.id==product.id).length > 0)
                setImageUrl(product.imageUrls[0]?.url);
            }
            if(state.isLoggedIn)
                fetchProduct();
        }, [state.isLoggedIn,product])
    );

    
    const handleConfirm = () => {
        setLogInAlertVisible(false);
        const payload = {
            ...{product,comments,raiting},
          };
        setProduct({product,comments,raiting} as ProductInfos);
        setPreviouspage( "ProductDetails")
        navigation.navigate(`LoginPage`,{payload})
    };
    
    const toggleFavorite = async () => {
        console.log(product)
        if (!state.isLoggedIn) {
            setLogInAlertVisible(true)
            return;
        }
        try {
            const url = isFavorit
                ? `${config.API_BASE_URL}/api/client/deleteFromFavorite/${product.id}`
                : `${config.API_BASE_URL}/api/client/addToFavorite/${product.id}`;
            
            const response =  isFavorit? await axios.delete(url,{
                headers: { Authorization: `Bearer ${state.JWT_TOKEN}` },
            }): await axios.post(url, {}, {
                headers: { Authorization: `Bearer ${state.JWT_TOKEN}` },
            });

            if (response.status === 200) {
                isFavorit?state.userInfos.wishlist = state.userInfos.wishlist.filter((p: Product)=>p.id!=product.id):state.userInfos.wishlist.push(product)
               setIsfavorit(!isFavorit)

                console.log(isFavorit ? "Removed from favorites" : "Added to favorites");
            }
        } catch (error) {
            console.error("Error updating favorite status:", error);
  
        }
    };

    const addToCard = () => {
        if (product) {
           addToCart(product.id,quantity );
        }
        setAddedItem({ name: 'Item', quantity });
        setAlertVisible(true)
    }

    const renderProduct = () => (
        <View style={[tw`flex-row pt-4 px-2 w-full h-60`, { backgroundColor: Color.mainbackgroundcolor, borderBottomColor: 'white', borderBottomWidth: 3 }]}>
            <Image style={[tw`h-56 rounded`, { width: '80%' }]} source={{ uri: imageUrl || product.imageUrls[0]?.url }} />
            <View>
                {
                product.imageUrls && product.imageUrls.map((item: any , index: number) => (
                    <Pressable key={index} style={[tw`mx-2`]} onPress={() => { setImageUrl(item.url) }}>
                        <Image style={[tw`w-16 h-16 rounded mt-2`]} source={{ uri: item.url }} />
                    </Pressable>
                ))
                }
            </View>
            <TouchableOpacity 
                style={[tw`absolute mt-2 ml-1 rounded-3xl bg-white justify-center`]} 
                onPress={toggleFavorite}
            >
                <TabBarIcon name={isFavorit? 'heart' : 'heart-outline'} color={'orangered'} isTradeCustomer={false} />
            </TouchableOpacity>
        </View>
    );

    const renderDetails = () => (
        <View style={[tw`w-full py-4 px-2`, { backgroundColor: Color.mainbackgroundcolor }]}>
            <Text style={[tw`text-2xl font-bold mb-2`]}>{product?.name}</Text>
            <Text style={[tw`text-xl font-semibold mb-2`]}>£ {product?.price}</Text>
            {product.quantityInStock <= 0 ? (
              <Text style={[{ fontSize: 12,color:  'orangered',fontWeight: 'bold',}]}>
                Out of Stock
              </Text>
            ) : (
                <Text style={[tw`text-base mb-2`]}>{product?.quantityInStock} in Stock</Text>
            )}
           
            <View style={[tw`flex-row items-center mb-4`]}>
                <StarRating rating={parseFloat(raiting.toFixed(1))} />
                {/**<Text style={[tw`ml-2 text-sm text-gray-600`]}>| +{saledQuantity} sold</Text> */}
            </View>
            <View style={[tw`mb-3`]}>
                <OptimizedDescription description={product?.description} />
            </View>
            <View style={[tw`flex-row items-center justify-between mb-4`]}>
                <View style={[tw`flex-row items-center`]}>
                    <TouchableOpacity
                        style={[tw`p-2 bg-gray-200 rounded`]}
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <Text style={[tw`text-xl`]}>-</Text>
                    </TouchableOpacity>
                    <Text style={[tw`mx-4 text-lg`]}>{quantity}</Text>
                    <TouchableOpacity
                        style={[tw`p-2 bg-gray-200 rounded`]}
                        onPress={() => setQuantity(quantity + 1)}
                    >
                        <Text style={[tw`text-xl`]}>+</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={[tw`px-4 py-2 bg-black rounded`]}
                    onPress={addToCard}
                    disabled={product.quantityInStock <= 0}
                >
                    <Text style={[tw`text-white font-semibold`]}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
            <CommentSystem commentsItens={comments} product={{product,comments,raiting,saledQuantity}} />
            {/**  */}
        </View>
    );

    return (
        <FlatList
            ListHeaderComponent={
                <>
                    <CartAddAlert
                        visible={alertVisible}
                        itemName={addedItem.name}
                        quantity={addedItem.quantity}
                        onDismiss={() => setAlertVisible(false)}
                    />
                    <LoginRequiredAlert
                        visible={LogInAlertVisible}
                        message="You need to be logged in to add/remove favorites.."
                        onLogin={() => {handleConfirm()}}
                        onCancel={() => setLogInAlertVisible(false)}
                    />
                    {renderProduct()}
                    {renderDetails()}
                </>
            }
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        />
    );
}