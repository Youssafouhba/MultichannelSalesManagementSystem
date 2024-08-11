import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet,Image, Text, View, Pressable, TouchableOpacity, FlatList, SafeAreaView, ScrollView } from "react-native";

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { cardstyles, Color, FontFamily } from '@/GlobalStyles';
import tw from 'tailwind-react-native-classnames';
import {  useFocusEffect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { Product, ProductInfos } from '@/constants/Classes';
import StarRating from '@/components/StarRating';
import { useAppContext } from '@/components/AppContext';
import OptimizedDescription from '@/components/OptimizedDescription';
import CommentSystem from '@/components/CommentSystem';
import CartAddAlert from '@/components/CartAddAlert';
import Dialog, {  DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import { screenHeight } from '@/constants/GlobalsVeriables';
import axios from 'axios';
import ModernCustomAlert from '@/components/ModernCustomAlert';
import { useAppData } from '@/components/AppDataProvider';
import { router, useNavigation } from "expo-router";
import config from '@/components/config';
import { useRoute } from '@react-navigation/native';

interface RouteParams {
    payload: ProductInfos; // Replace 'any' with the actual type of payload
}

export default function ProductDetails() {
    const { state, dispatch } = useAppContext();
    const route = useRoute();
    const { p } = useGlobalSearchParams();
    const [alertVisible, setAlertVisible] = useState(false);
    const [LogInAlertVisible, setLogInAlertVisible] = useState(false);
    const [pressed, setPressed] = useState<boolean>(false)
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>('')
    const [quantity, setQuantity] = useState<number>(1)
    const [addedItem, setAddedItem] = useState({ name: '', quantity: 0 });
    var isLoggedIn = state.JWT_TOKEN !=='';
    const { data,token} = useAppData();
    const {product,comments,raiting} = (route.params as RouteParams)?.payload;
    useFocusEffect(
        useCallback(() => {
            const fetchProduct = async () => {
                setImageUrl(product.imageUrls[0].url);
            }
           // checkFavoriteStatus();
            fetchProduct();
        }, [p,product])
    );

    const checkFavoriteStatus = async () => {
        if (token!=undefined) {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/client/isFavorite/${state.product.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response.data)
                setIsFavorite(response.data);
            } catch (error) {
                console.error("Error checking favorite status:", error);
            }
        }
    };

    const handleCancel = () => {
        setLogInAlertVisible(false);
      };
    
    const handleConfirm = () => {
        setLogInAlertVisible(false);
        router.push(`/LoginPage?returnTo=ProductDetails&productId=${product.id}`);
    };
    
    const toggleFavorite = async () => {
        if (token==undefined) {
            setLogInAlertVisible(true)
            return;
        }

        try {
            const url = isFavorite
                ? `${config.API_BASE_URL}/api/client/deleteFromFavorite/${product.id}`
                : `${config.API_BASE_URL}/api/client/addToFavorite/${id}`;
            
            const response = isFavorite? await axios.delete(url,{
                headers: { Authorization: `Bearer ${token}` },
            }): await axios.post(url, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setIsFavorite(!isFavorite);
                console.log(isFavorite ? "Removed from favorites" : "Added to favorites");
            }
        } catch (error) {
            console.error("Error updating favorite status:", error);
        }
    };

    const addToCart = () => {
        if (product) {
            dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
        }
        setAddedItem({ name: 'Item', quantity });
        setAlertVisible(true)
    }

    const renderProduct = () => (
        <View style={[tw`flex-row px-2 w-full h-60`, { backgroundColor: Color.mainbackgroundcolor, borderBottomColor: 'white', borderBottomWidth: 3 }]}>
            <Image style={[tw`h-56 rounded`, { width: '80%' }]} source={{ uri: imageUrl || product.imageUrls[0].url }} />
            <View>
                {
                product.imageUrls.map((item: any , index: number) => (
                    <Pressable key={index} style={[tw`mx-2`]} onPress={() => { setImageUrl(item.url) }}>
                        <Image style={[tw`w-16 h-16 rounded mt-2`]} source={{ uri: item.url }} />
                    </Pressable>
                ))
                }
            </View>
            <TouchableOpacity 
                style={[tw`absolute -mt-2 ml-1 rounded-3xl bg-white justify-center`]} 
                onPress={toggleFavorite}
            >
                <TabBarIcon name={isFavorite ? 'heart' : 'heart-outline'} color={'orangered'} />
            </TouchableOpacity>
        </View>
    );

    const renderDetails = () => (
        <View style={[tw`w-full py-4 px-2`, { backgroundColor: Color.mainbackgroundcolor }]}>
            <Text style={[tw`text-2xl font-bold mb-2`]}>{product?.name}</Text>
            <Text style={[tw`text-xl font-semibold mb-2`]}>£ {product?.price}</Text>
            <Text style={[tw`text-base mb-2`]}>{product?.quantityInStock} in Stock</Text>
            <View style={[tw`flex-row items-center mb-4`]}>
                <StarRating rating={parseFloat(raiting.toFixed(1))} />
                <Text style={[tw`ml-2 text-sm text-gray-600`]}>| +1000 sold</Text>
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
                    onPress={addToCart}
                >
                    <Text style={[tw`text-white font-semibold`]}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
            <CommentSystem commentsItens={comments} Id={product.id} />
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
                    <ModernCustomAlert
                        visible={LogInAlertVisible}
                        title="Login Required"
                        message="You need to be logged in to add/remove favorites."
                        onCancel={handleCancel}
                        onConfirm={handleConfirm}
                    />
                    {renderProduct()}
                    {renderDetails()}
                </>
            }
            ListFooterComponent={<View style={{ height: 20 }} />} // Add footer to prevent overlap with other content
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        />
    );
}