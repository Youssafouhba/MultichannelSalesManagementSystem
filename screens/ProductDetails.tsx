import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View,Pressable ,Alert,TouchableOpacity, FlatList} from "react-native";
import { Image } from "expo-image";
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { cardstyles, Color, FontFamily } from '@/GlobalStyles';
import tw from 'tailwind-react-native-classnames';
import { useFonts } from 'expo-font';
import {cartItemsNumber } from "@/constants/GlobalsVeriables"

export default function ProductDetails() {
    const [loaded, error] = useFonts({
        'KleeOne-Regular': require('@/assets/fonts/KleeOne-Regular.ttf'),
        'kavoonRegular': require('@/assets/fonts/Kavoon-Regular.ttf'),
        'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
        'VampiroOne-Regular': require('@/assets/fonts/VampiroOne-Regular.ttf'),
        'GermaniaOne-Regular': require('@/assets/fonts/GermaniaOne-Regular.ttf'),
        'Langar-Regular': require('@/assets/fonts/Langar-Regular.ttf'),
        'KiteOne-Regular': require('@/assets/fonts/KiteOne-Regular.ttf'),
      });
    const [starItems, setStarItems] = useState<{[key: string]: boolean}>({});
    const [pressed,setPressed] = useState<boolean>()
    const [star,setStar] = useState<boolean>()
    const stars = [{id: 1,is: true,setIs: setStar},{id: 2,is: false,setIs: setStar},{id: 3,is: false,setIs: setStar},{id: 4,is: false,setIs: setStar},{id: 5,is: false,setIs: setStar}]

    useEffect(() => {
        const fetchstars = () => {
            const initialStars = stars.reduce((acc, star) => {
                acc[star.id] = star.is;
                return acc;
            }, {} as {[key: string]: boolean});
            setStarItems(initialStars);
            console.log(starItems)
        };
        fetchstars();
      }, []);
    const renderstars = ({item}: {item: {id: number,is: boolean}}) => (
        <TouchableOpacity onPress={() => {starItems[item.id]=true,setStarItems(starItems),console.log(starItems)}}>
            <TabBarIcon size={19} name={item.is?'star':'star-outline'} color={'black'} />
        </TouchableOpacity>
    )

  
    const starslist = useMemo(() => {
        stars.map((star)=> star.id <= 22/5 ? star.is=true: star.is=false)
        return stars;
      }, [stars, starItems]);

    const productItemsnumber = useMemo(() => {
        stars.map((star)=> star.id <= 22/5 ? star.is=true: star.is=false)
        return stars;
      }, [stars, starItems]);
    
    return (
    <View style={[cardstyles.cart]}>
      <View style={[tw`w-80 top-6 flex-row justify-between`]}>
        <Image
            style={[cardstyles.cartChild1]}
            contentFit="cover"
            source={require("@/assets/rectangle-111.png")}
            />
        <TouchableOpacity onPress={() => {}}>
            <TabBarIcon name={'menu-sharp'} color={'black'} />
        </TouchableOpacity>
      </View>
      <View style={[cardstyles.cartheader,tw`top-10`]}>
        <TouchableOpacity onPress={() => {}}>
            <TabBarIcon name={'arrow-back'} color={'black'} />
        </TouchableOpacity>       
      </View>
      <View>
        <Image
            style={[tw`w-60 h-56 rounded-3xl mt-2`]}
            contentFit="cover"
            source={require("@/assets/rectangle-92.png")}
        />
        <View style={[tw`flex-row`]}>
            <View style={tw`mt-3 w-40`}>
                <Text style={[cardstyles.productText,{fontSize: 10}]}  ellipsizeMode="tail">{`BrittLite© COB DC 24V RGB 576L 10 meter roll`}</Text>
                <View style={[tw`flex-row justify-around -ml-2`,]}>
                    <Text style={{color: Color.colorRed,fontFamily: 'kavoonRegular'}}>{90} in stock</Text>
                    <View style={tw`flex-row ml-1`}>
                        <Text style={[tw`text-sm font-medium`,{fontFamily: 'kavoonRegular',color: Color.colorLimegreen} ]}>{900} £</Text>
                    </View>
                </View>
            </View>
            <View>
                <TouchableOpacity style={[tw`w-10 h-5 mt-2 ml-10`]}  onPress={() => {setPressed(!pressed)}}>
                    <TabBarIcon size={20} style={[tw`ml-4`]} name={pressed?'heart':'heart-outline'} color={'red'} />
                </TouchableOpacity>
                <View style={[tw`flex-row top-4 left-3`]}>
                    <TouchableOpacity
                    onPress={() => {}}>
                    <Image
                        style={[tw`w-3 h-4`]}
                        contentFit="cover"
                        source={require("@/assets/minus.png")}
                    />
                    </TouchableOpacity>
                    <Text style={[tw`w-6 h-8 -mt-2 pt-1 ml-3`]}>{0}</Text>
                    <TouchableOpacity
                    onPress={() => {}}>
                    <Image
                        style={[tw`w-4 h-4 left-1`]}
                        contentFit="cover"
                        source={require("@/assets/plus.png")}
                    />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <View style={[tw`ml-2 mt-1`]} >
            <FlatList
                data={starslist}
                renderItem={renderstars}
                keyExtractor={(item)=>item.id.toString()}
                numColumns={5}
            />
        </View>
      </View>
      <View style={[tw``]} >
            <Text style={[tw``,{color: 'red'}]} numberOfLines={20}>
               ffftt
            </Text>
        </View>
    </View>
  )
}
