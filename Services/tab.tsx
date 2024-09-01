import { StyleSheet,FlatList, Pressable, ScrollView, View,Text,Dimensions } from 'react-native'
import tw from 'tailwind-react-native-classnames';
import React, { useEffect, useState, useMemo } from "react";
import GroupComponent from '@/components/GroupComponent';

export const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const products = [
    {
        imageUrl: require("../assets/rectangle-96.png"),
        price: 9,
        title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
        new: `NEW`,
        stock: 100
      },
    {
      imageUrl: require("../assets/rectangle-96.png"),
      price: 9,
      title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
      new: `NEW`,
      stock: 100
    },
    {
      imageUrl: require("../assets/rectangle-97.png"),
      price: 9,
      title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
      new: `NEW`,
      stock: 100
    },
    {
        imageUrl: require("../assets/rectangle-98.png"),
        price: 9,
        title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
        new: `NEW`,
        stock: 100
      },
      {
        imageUrl: require("../assets/rectangle-99.png"),
        price: 9,
        title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
        new: `NEW`,
        stock: 100
      },
      {
        imageUrl: require("../assets/rectangle-95.png"),
        price: 7,
        title: `BORDERLESS 24W CEILING LAMP Cool White\n`,
        new: ``,
        stock: 90
      },
    {
      imageUrl: require("../assets/rectangle-98.png"),
      price: 9,
      title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
      new: `NEW`,
      stock: 100
    },
    {
      imageUrl: require("../assets/rectangle-99.png"),
      price: 9,
      title: `BrittLite© DC 24V 28355mm/8mm 120L Full Spectrum`,
      new: `NEW`,
      stock: 100
    },
    {
      imageUrl: require("../assets/rectangle-95.png"),
      price: 7,
      title: `BORDERLESS 24W CEILING LAMP Cool White\n`,
      new: ``,
      stock: 90
    },
  ];
export default function Tab() {
    const styles = useMemo(() => getStyles(screenWidth, screenHeight), [screenWidth, screenHeight]);
   
    const rr = ({ item }: { item: any }) => (
        <View style={[styles.eleme]}>
            <Pressable style={[styles.product]}>
            <View>
            <Text style={{}}>huhu</Text>
            </View>
            </Pressable>
        </View> 
    )
  return (
    <View>
        <GroupComponent onCategorySelect={products} />
        <ScrollView style={[styles.scroll]}>
        <FlatList
          data={products}
          renderItem={rr}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={11}
          onEndReachedThreshold={0.5}
          onEndReached={() => console.log("End reached")}
        />
        </ScrollView>
    </View>
  )
}

const getStyles = (screenWidth: number, screenHeight: number) => {
    // Calculez l'aspect ratio en fonction de la taille de l'écran
    const calculatedAspectRatio = screenWidth / screenHeight;
      
    // Ajustez l'aspect ratio du productWrapper en fonction de la taille de l'écran
    const productWrapperAspectRatio = calculatedAspectRatio > 0.5 ? 1.1 : 1;
    var s=screenHeight*0.621
    var ph = screenHeight/6
    // Calculez la maxHeight du ScrollView en pourcentage de la hauteur de l'écran
    const scrollViewMaxHeight = screenHeight * 0.70; // 73% de la hauteur de l'écran
    if(screenHeight<914){
        if(screenHeight<882){
            s=screenHeight*0.57
            if(screenHeight<=740)
                s=screenHeight*0.54
        }
    }

    if(screenHeight>=882){
        ph=screenHeight/6+26
    }
    return StyleSheet.create( 
       
      {
        scroll: {
            backgroundColor: 'red',
            width: screenWidth,
            maxHeight: s,
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
        }
      }
    )}
