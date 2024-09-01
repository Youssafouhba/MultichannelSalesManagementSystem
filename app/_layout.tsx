import React, { useState } from 'react';
import {Stack, useNavigation, usePathname } from 'expo-router';
import { StyleSheet, Image, TouchableOpacity, View, Text, Pressable, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { AppProvider, useAppContext } from '@/components/AppContext';
import tw from 'tailwind-react-native-classnames';
import { screenHeight } from '@/constants/GlobalsVeriables';
import { Color } from '@/GlobalStyles';
import Menu from '@/components/Menu';
import { AppDataProvider } from '@/components/AppDataProvider';
import { ProductInfos } from '@/constants/Classes';
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppProviders } from '@/contex/AppProviders';

function FilterMenu({ isVisible, onClose }: { isVisible: boolean, onClose: any }) {
  if (!isVisible) return null;

  return (
    <View style={[styles.filtermenu,tw`rounded`]}>
      <Pressable style={[tw`flex-row justify-between mb-2 `,{lignContent: 'center',}]}>
        <Text style={[styles.menuItem,tw`text-base text-white font-medium`]}>Price</Text>
      </Pressable>
      <Pressable style={[tw`flex-row justify-between mb-2 `,{lignContent: 'center',}]}>
        <Text style={[styles.menuItem,tw`text-base text-white font-medium`]}>Size</Text>
      </Pressable>
      <Pressable style={[tw`flex-row justify-between mb-2 `,{lignContent: 'center',}]}>
        <Text style={[styles.menuItem,tw`text-base text-white font-medium`]}>Category</Text>
      </Pressable>
    </View>
  );
}
interface RouteParams {
  payload: ProductInfos;
}
function CustomHeader({title}: {title: string}) {
  const {appstate, setPreviouspage } = useAppContext();
  const pathname = usePathname();
  const navigation = useNavigation<any>();
  const route = useRoute()
  const goBack = () => {
    const payload = {
      ...(route.params as RouteParams)?.payload,
    };
    if(pathname=="/"+appstate.previouspage){
      setPreviouspage("index")
    }
    if(appstate.previouspage=="ProductDetails"){
      pathname=="/ProductDetails"?navigation.navigate("index" as never):navigation.navigate(appstate.previouspage as never,{payload})
      }else{
      pathname=="/"+appstate.previouspage&&appstate.previouspage!="ProductDetails"?navigation.navigate("index" as never):navigation.navigate(appstate.previouspage as never,{payload});
    }
  };
  return (
    <View style={[styles.header, { backgroundColor: 'transparent' ,justifyContent: 'flex-start',}]}>
        <TouchableOpacity onPress={() =>{goBack()}} style={styles.backButton}>
          <Ionicons name='chevron-back-outline' size={20} color="black" style={{ overflow: 'hidden' }} />
        </TouchableOpacity>
      <Text style={[tw`mx-2 text-base font-medium text-xl`,{color: Color.colorBlack,}]}>{title}</Text>
    </View>
  );
}

function CustomMainHeader({ onMenuPress}:{onMenuPress: any}) {
  const pathname = usePathname();
  return (
    pathname=="/Messages"?``
    :
    <View style={styles.header}>  
      <Image
        style={{top: 2}}
        source={require("@/assets/images/Capture d écran 2024-08-27 221952.png")}
      />
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" size={29} color="black" />
      </TouchableOpacity>
    </View>
  );
}


export default function AppLayout() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
  };

  const closeFilterMenu = () => {
    setIsFilterMenuVisible(false);
  };


  return (
    <AppDataProvider>
    <AppProvider>
    <AppProviders>
    <SafeAreaView style={{ flex: 1}}>
      <Stack>
        <Stack.Screen       
          name="(tabs)" 
          options={{
            animation: 'slide_from_right',
            header: () => <CustomMainHeader onMenuPress={toggleMenu} />,
          }} 
        />
        <Stack.Screen 
          name="ProductDetails" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={'Product Details'}/>,
          }} 
        />
        <Stack.Screen 
          name="Filter" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={'Filter'}/>,
          }} 
        />
      
        <Stack.Screen 
          name="CompleteTradeCustomer" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={'TradeCustomer'}/>,
          }} 
        />
        <Stack.Screen 
          name="TradeCustomer" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={'TradeCustomer'}/>,
          }} 
        />
        <Stack.Screen 
          name="Wishlist" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={'My Wishlist'}/>,
          }} 
        />
        <Stack.Screen 
          name="OrderDetails" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={'Order Details'}/>,
          }} 
        />
        <Stack.Screen 
          name="OtpVerification" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={'OtpVerification'}/>,
          }} 
        />
        <Stack.Screen 
          name="PasswordResetPage" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={'PasswordResetPage'}/>,
          }} 
        />
        <Stack.Screen 
          name="ForgetPasswordPage" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={''} />,
          }} 
        />
        <Stack.Screen 
          name="EmailVerificationPage" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={''}/>,
          }} 
        />
        <Stack.Screen 
          name="Checkout" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={'Checkout'}/>,
          }} 
        />
        <Stack.Screen 
          name="RegisterPage" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={''} />,
          }} 
        />
        <Stack.Screen 
          name="LoginPage" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={''}/>,
          }} 
        />
        <Stack.Screen 
          name="Orders" 
          options={{ 
            animation: 'slide_from_right',
            header: () => <CustomHeader title={'My Orders'}/>,
          }} 
        />
      </Stack>
      <Modal
          transparent={true}
          visible={isMenuVisible}
          onRequestClose={closeMenu}
        >
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View>
                  <Menu isVisible={isMenuVisible} onClose={closeMenu} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          transparent={true}
          visible={isFilterMenuVisible}
          onRequestClose={closeFilterMenu}
        >
          <TouchableWithoutFeedback onPress={closeFilterMenu}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View>
                  <FilterMenu isVisible={isFilterMenuVisible} onClose={closeFilterMenu} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </AppProviders>
  </AppProvider>
  </AppDataProvider>


  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor: 'transparent', // semi-transparent background
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    height: 40,
    paddingHorizontal: 10,
  },
  backButton: {
    backgroundColor: Color.colorWhitesmoke,
    width: 25,
    height: 25,
    borderRadius: 50,
    padding: 2,
    marginLeft: 4,
    overflow: 'hidden'
  },
  menuButton: {
    
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menu: {
    position: 'absolute',
    top: '10%',
    right: '0%',
    bottom: 0,
    width: '52%',
    height: screenHeight/2,
    backgroundColor: '#fafaff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filtermenu: {
    position: 'absolute',
    top: '11%',
    right: '52%',
    bottom: 0,
    width: '32%',
    height: screenHeight/5,
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  menuItem: {
    fontSize: 15,
    paddingTop: '3%',
  },
});