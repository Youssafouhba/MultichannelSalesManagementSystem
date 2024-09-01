import React, {useCallback } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { useAppContext } from "@/components/AppContext";
import { Product } from "@/constants/Classes";
import { Color, FontFamily, FontSize } from "@/GlobalStyles";
import LogInRequiredPage from '@/components/LogInRequiredPage';
import { useAppData } from '@/components/AppDataProvider';
import StarRating from '@/components/StarRating';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';
import config from '@/components/config';
import { useUser } from '@/contex/UserContext';
import useInternetCheck from '@/components/useInternetCheck';
import NoInternetConnection from '@/components/NoInternetConnection';

const Wishlist: React.FC = () => {
    const { state,updateMyWishList } = useUser();
    const {data} = useAppData()
    const { isConnected, connectionType } = useInternetCheck();
    const removefromfavorite = async (id: string) => {
        updateMyWishList(id)
        try {
            const url = `${config.API_BASE_URL}/api/client/deleteFromFavorite/${id}`;
            const response = await axios.delete(url,{
                headers: { Authorization: `Bearer ${state.JWT_TOKEN}` },
            })
        } catch (error) {
            console.error("Error updating favorite status:", error);
        }
    }

    const renderItem = useCallback(({ item }: { item: Product }) => (
        <View style={styles.productContainer}>
            <Pressable>
                <Image
                    style={styles.productImage}
                    source={{ uri: item.imageUrls[0]?.url }}
                />
            </Pressable>

            <View style={[{width: '60%',padding: 15,}]}>
                <Text style={[{width: '100%',fontSize: 16,}]} numberOfLines={3} ellipsizeMode="tail">
                    {item.name}
                </Text>
                <View style={[styles.infoArea]}>
                    <Text style={[styles.fullWidthPrice]}>
                    £ {item.price}
                    </Text>
                    <Text style={[styles.fullWidthStock]}>
                    <Text style={{color: Color.colorize_gray}}>{item.quantityInStock}</Text> in stock
                    </Text>
                </View>
                <View style={[styles.badgeArea]}>
                    <View style={[styles.offerBadge,{ marginRight: 15,}]}>
                    <Text style={[styles.fullWidthOfferText]}>Offer</Text>
                    </View>
                    <StarRating rating={parseFloat(data?.ratings[parseInt(item.id)].toFixed(1))} />
                </View>
                <Pressable onPress={()=>removefromfavorite(item.id)} style={[tw`absolute`,{right: 2,top: 2}]}>
                    <Ionicons name='close' size={16} color={'red'}  />
                </Pressable>
                
        </View>
        </View>
    ), []);
    

    const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

    return (
        !isConnected?
        <NoInternetConnection/>
        :
        <View style={styles.container}>
            {state.isLoggedIn?
            (state.userInfos.wishlist.length  > 0? 
                <FlatList
                    renderItem={renderItem}
                    data={state.userInfos.wishlist}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.listContent}
                />:
                <View style={[tw`justify-center items-center h-80`]}>
                    <Text style={[tw`text-base`]}>Your favorite list is empty !</Text>
                    <Image source={require("@/assets/images/icons8-aucun-résultat-48.png")}/>
                </View>
            ):(
                <LogInRequiredPage message='Please log in to view your WishList' page='Wishlist'/>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    offerBadge: {
        backgroundColor: '#e71d36',
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
      },
    infoArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fullWidthPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Color.colorRed,
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
      offerText: {
        color: '#f3de2c',
        fontSize: 10,
      },
      fullWidthOfferText: {
        color: '#f3de2c',
        fontSize: 12,
      },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loginText: {
        fontSize: FontSize.presetsBody2_size,
        color: Color.colorBlack,
        marginBottom: 20,
      },
      loginButton: {
        backgroundColor: Color.colorBlack,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
      },
      loginButtonText: {
        color: Color.colorWhite,
        fontSize: FontSize.presetsBody2_size,
      },
    container: {
        flex: 1,
        backgroundColor: Color.mainbackgroundcolor,
    },
    listContent: {
        padding: 16,
    },
    productContainer: {
        backgroundColor: Color.colorWhitesmoke,
        borderTopRightRadius: 18,
        flexDirection: 'row',
        marginBottom: 16,
        elevation: 2,
        shadowColor: Color.COLORALICEBLUE,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productImage: {
        width: 130,
        height: 135,
        borderRadius: 8,
    },
    productInfo: {
        marginLeft: 16,
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontFamily: FontFamily.kleeOneRegular,
        color: Color.colorBlack,
        marginBottom: 4,
    },
    stockInfo: {
        fontFamily: FontFamily.kiwiMaruRegular,
        fontSize: FontSize.size_3xs,
        color: Color.colorRed,
        marginBottom: 4,
    },
    price: {
        fontFamily: FontFamily.kiwiMaruRegular,
        color: Color.colorLimegreen,
    },
});

export default Wishlist;