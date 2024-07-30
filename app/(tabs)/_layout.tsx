import { Tabs, useLocalSearchParams, useNavigation, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, TouchableOpacity, View,StyleSheet } from 'react-native';
import { Color, styles } from '@/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useAppContext } from '@/components/AppContext';

export default function TabLayout() {
  const { state } = useAppContext(); // Use the AppContext
  const colorScheme = useColorScheme();
  const [notificationCount, setNotificationCount] = useState(0);
  const pathname = usePathname();
  const { id } = useLocalSearchParams();
  useEffect(() => {
    // Ici, vous pouvez ajouter la logique pour récupérer le nombre de notifications
    // Par exemple, une requête API ou une écoute en temps réel
    // Pour l'exemple, nous allons simplement définir un nombre aléatoire
    setNotificationCount(Math.floor(Math.random() * 100));
  }, []);
  
  function CustomHeader() {
    const navigation = useNavigation();
      return (
        <View style={[styles1.header]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles1.backButton}>
            <Ionicons name='chevron-back-outline' size={20} color="black" style={{ overflow: 'hidden' }} />
          </TouchableOpacity>
        </View>
      );
  }

  return (
    <Tabs
    sceneContainerStyle={{
      
    }}
    screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme?? 'light'].tint,
      headerShown: false,
      tabBarStyle: {
        height: 40, 
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
       />
        <Tabs.Screen
        name="Messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'mail' : 'mail-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Cart"
        options={{
          title: 'Carte',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? 'bag-handle-sharp' : 'bag-handle-outline'} 
              color={color}
              badgeCount={state.cartItemsCount || 0} // Use cartItemsCount from state
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person':'person-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
              name="Notifications"
              options={{
                title: 'Notifications',
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon 
                    name={focused ? 'notifications' : 'notifications-outline'} 
                    color={color}
                    badgeCount={notificationCount}
                  />
                ),
              }}
            />
    </Tabs>
  );
}

const styles1 = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Color.mainbackgroundcolor,
    top: '5%',
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
});