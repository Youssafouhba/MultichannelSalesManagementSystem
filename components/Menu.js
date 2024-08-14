import React from 'react';
import { View, Text, Pressable, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';
import { screenHeight } from '@/constants/GlobalsVeriables';
import { useAppContext } from '@/components/AppContext';
import { Color } from '@/GlobalStyles';
import { Linking } from 'react-native';
import { useAppData } from "@/components/AppDataProvider";



function Menu({ isVisible, onClose }) {
  const { state, dispatch } = useAppContext();
  const navigation = useNavigation()
  const { logout, token,error } = useAppData();
  if (!isVisible) return null;
  const MenuOptions = [
    {name: 'Filter', icon: require('@/assets/images/icons8-réglages-vertical-50.png'), path: 'Filter'},
    {name: 'My Orders', icon: require('@/assets/images/icons8-sac-de-courses-80.png'), path: 'Orders'},
    {name: 'My Favorite', icon: require('@/assets/images/icons8-coeurs-50.png'), path: 'Wishlist'},
    //{name: 'Offers', icon: require('@/assets/images/icons8-offer-58.png'), path: 'Profile'},
    {name: 'Trade Customer', icon: require('@/assets/images/icons8-badge-50.png'), path: 'TradeCustomer'},
    {name: !state.isLoggedIn?'Log In' :'Log Out', icon: !state.isLoggedIn?require(`@/assets/images/icons8-déconnexion-arrondi-50.png`):require(`@/assets/icons8-déconnexion-50.png`), path: !state.isLoggedIn?`LoginPage` :'index'},
  ];
  
  const SocialMediaIcons = [
    { name: require('@/assets/images/apple_16566143.png'), id: 'wtsp' },
    { name: require('@/assets/images/messenger_5968771 (1).png'), id: 'fb' },
  ];
  const handleMenuItemPress = async (path) => {
    onClose();
    if (path === 'index') {
      state.notificationsCount = 0;
      logout();
      state.messagesCount = 0;
      dispatch({ type: 'CLEAN_CART'});
      dispatch({ type: 'CLEAN_Notifications'});
      dispatch({ type: 'SET_JWT_TOKEN', payload: '' });
      dispatch({ type: 'SET_isLoggedIn', payload: false });
   
    }
    if(path=="LoginPage"){
      dispatch({type: 'Set_previouspage',payload: "LoginPage"})
    }
    dispatch({type: 'Set_previouspage',payload: "index"})
    navigation.navigate(path);
  };

  const renderMenuItem = ({ item }) => (
    <Pressable
      onPress={() => handleMenuItemPress(item.path)}
      style={[tw`flex-row justify-between px-2`, { alignItems: 'center' }]}
    >
      <Text style={[styles.menuItem, tw`text-base text-gray-900 font-medium`]}>{item.name}</Text>
      <Image
        style={{ width: 26, height: 26 }}
        source={item.icon}
      />
    </Pressable>
  );

  const renderSocialIcon = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        const url = item.id === 'fb'
          ? 'fb://Profile'
          : 'https://wa.me/+447864975607'; // Assurez-vous que le numéro est correctement formaté
        Linking.canOpenURL(url)
          .then(supported => {
            if (supported) {
              return Linking.openURL(url);
            } else {
              console.log(`Can't open URL: ${url}`);
            }
          })
          .catch(err => console.error('An error occurred', err));
      }}
      style={styles.socialIcon}
    >
      <Image style={{ width: 26, height: 26 }} source={item.name} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.menu, tw`flex-col justify-between rounded`]}>
      <View style={[{}]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="gray" />
        </TouchableOpacity>
        <FlatList
          data={MenuOptions}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.name}
        />
      </View>
      <View style={[styles.socialIconsContainer]}>
        <FlatList
          data={SocialMediaIcons}
          renderItem={renderSocialIcon}
          keyExtractor={(item) => item.name}
          horizontal
          contentContainerStyle={styles.socialIconsList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: screenHeight * 0.04,
    right: '0%',
    bottom: 0,
    width: '52%',
    height: screenHeight / 2,
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
  closeButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    padding: 10,
  },
  menuItem: {
    fontSize: 15,
    paddingVertical: 10,
  },
  socialIconsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    //left: 0,
    //right: 0,
  },
  socialIconsList: {
    backgroundColor: Color.mainbackgroundcolor,
    width: '100%',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  socialIcon: {
    padding: 10,
  },
});

export default Menu;