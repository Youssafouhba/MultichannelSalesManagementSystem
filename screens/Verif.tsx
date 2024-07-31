import { Border, Color } from '@/GlobalStyles';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react'
import { Image } from "expo-image";
import { View } from 'react-native';
import { verifstyles as styles } from '@/GlobalStyles';

export default function Verif() {
    const navigation = useNavigation();
    useEffect(() => {
      const timer = setTimeout(() => {
        //navigation.navigate('Register'); // Replace 'TargetScreen' with the name of your target screen
      }, 1500);
  
      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);
    }, [navigation]);
  
    return (
      <View style={styles.iphone1415ProMax1}>
        <Image
          style={[styles.iphone1415ProMax1Child, styles.childLayout]}
          contentFit="cover"
          source={require("@/assets/rectangle-1.png")}
        />
        <View style={[styles.homeIndicator, styles.homePosition]}>
          <View style={styles.homeIndicator1} />
          <View style={[styles.homeIndicatorChild, styles.homePosition]} />
        </View>
      </View>
    );
};
  


{isLoading? (
  <ScrollView contentContainerStyle={{alignItems: 'center',top: '40%'}} style={[styles.scrollView,{}]}>
    <LoadingAnimation size={80} color="blue" />
    <Text style={[tw`text-base text-xs text-gray-400`]}>Loading...</Text>
  </ScrollView>):
(
<SafeAreaView style={styles.scrollView}>
{category === "Ceilling Calculator" ? (
  <CeilingCalculator />
) : filteredProducts.length === 0 ? (
  <View style={styles.noProductsContainer}>
    <Text style={styles.noProductsText}>No products found</Text>
  </View>
) : (
  renderProductList()
)}
</SafeAreaView>)}
  