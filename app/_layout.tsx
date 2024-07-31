import React, { useState } from 'react';
import { router, Stack, useGlobalSearchParams, useLocalSearchParams, useNavigation, usePathname, useRouter } from 'expo-router';
import { StyleSheet, Image, TouchableOpacity, View, Text, Pressable, FlatList, Modal, TouchableWithoutFeedback } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { AppProvider, useAppContext } from '@/components/AppContext';
import tw from 'tailwind-react-native-classnames';
import { screenHeight } from '@/constants/GlobalsVeriables';
import { Color } from '@/GlobalStyles';
import { color } from '@rneui/themed/dist/config';
import Menu from '@/components/Menu';

function FilterMenu({ isVisible, onClose }) {
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

function CustomHeader({title}) {
  const { id } = useGlobalSearchParams();
  const navigation = useNavigation();
  console.log(id)
  return (
    <View style={[styles.header, { backgroundColor: Color.mainbackgroundcolor }]}>
      <TouchableOpacity onPress={() =>{id=='Cart'? navigation.navigate(`${id}`): navigation.goBack()}} style={styles.backButton}>
        <Ionicons name='chevron-back-outline' size={20} color="black" style={{ overflow: 'hidden' }} />
      </TouchableOpacity>
      <Text style={[tw`mx-2 font-medium`,{color: Color.colorsBlue}]}>{title}</Text>
    </View>
  );
}

function CustomMainHeader({ onMenuPress}) {
  const pathname = usePathname();
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {pathname !== '/'?(
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name='chevron-back-outline' size={20} color="black" style={{ overflow: 'hidden' }} />
        </TouchableOpacity>
      ):(
        <TouchableOpacity onPress={() => {}} style={[]}>
          <Image
            style={[]}
            contentFit="cover"
            source={require("../assets/rectangle-111.png")}
          />
        </TouchableOpacity>
      )}
   
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" size={29} color="black" />
      </TouchableOpacity>
    </View>
  );
}

export default function AppLayout() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuVisible(!isFilterMenuVisible);
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
  };

  const closeFilterMenu = () => {
    setIsFilterMenuVisible(false);
  };

  
  return (
    <AppProvider>
    <View style={styles.container}>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{
            header: () => <CustomMainHeader onMenuPress={toggleMenu} />,
          }} 
        />
        <Stack.Screen 
          name="LogoPage" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ProductDetails" 
          options={{ 
            header: () => <CustomHeader title={'Product Details'}/>,
          }} 
        />
        <Stack.Screen 
          name="OrderDetails" 
          options={{ 
            header: () => <CustomHeader title={'Order Details'}/>,
          }} 
        />
        <Stack.Screen 
          name="OtpVerification" 
          options={{ 
            header: () => <CustomHeader title={'OtpVerification'}/>,
          }} 
        />
        <Stack.Screen 
          name="PasswordResetPage" 
          options={{ 
            header: () => <CustomHeader title={'PasswordResetPage'}/>,
          }} 
        />
        <Stack.Screen 
          name="ForgetPasswordPage" 
          options={{ 
            header: () => <CustomHeader title={''} />,
          }} 
        />
        <Stack.Screen 
          name="EmailVerificationPage" 
          options={{ 
            header: () => <CustomHeader title={''}/>,
          }} 
        />
        <Stack.Screen 
          name="Checkout" 
          options={{ 
            header: () => <CustomHeader title={'Checkout'}/>,
          }} 
        />
        <Stack.Screen 
          name="RegisterPage" 
          options={{ 
            header: () => <CustomHeader title={''} />,
          }} 
        />
        <Stack.Screen 
          name="LoginPage" 
          options={{ 
            header: () => <CustomHeader title={''}/>,
          }} 
        />
        <Stack.Screen 
          name="Orders" 
          options={{ 
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
      </View>
    </AppProvider>

  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // semi-transparent background
  },
  container: {  //main header
    top: '2%',
    paddingTop: 6,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#faffff',
    //top: '5%',
    height: 46,
    paddingHorizontal: 10,
  },
  backButton: {
    backgroundColor: 'white',
    width: 30,
    height: 30,
    borderRadius: 50,
    padding: 4,
    overflow: 'hidden'
  },
  menuButton: {
    padding: 10,
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menu: {
    position: 'absolute',
    top: '7%',
    right: '0%',
    bottom: 0,
    width: '52%',
    height: screenHeight/2,
    backgroundColor: '#fafaff',
   // paddingHorizontal: 5,
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