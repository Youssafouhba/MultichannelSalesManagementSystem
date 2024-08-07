import { Tabs, useLocalSearchParams, useNavigation, usePathname } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View, StyleSheet } from 'react-native';
import { Color } from '@/GlobalStyles';
import { useAppContext } from '@/components/AppContext';

export default function TabLayout() {
  const { state } = useAppContext(); // Use the AppContext
  const colorScheme = useColorScheme();

  return (
    <Tabs
      sceneContainerStyle={{
        backgroundColor: Color.mainbackgroundcolor,
      }}
      screenOptions={{
        tabBarActiveTintColor: 'red',
        headerShown: false,
        tabBarStyle: {
          height: 51,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={'mail-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="FilterResult"
        options={{
          title: "FilterResult",
          //tabBarStyle: { display: 'none' }, // Hide the tab bar item for this screen
          tabBarButton: () => null, // Optionally hide the tab button completely
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={'bag-handle-outline'} 
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
            <TabBarIcon name={'person-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={'notifications-outline'} 
              color={color}
              badgeCount={state.notificationsCount || 0}
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
    backgroundColor: Color.colorWhite,
    top: '6%',
    height: 46,
    paddingHorizontal: 10,
  },
  backButton: {
    backgroundColor: 'white',
    width: 30,
    height: 30,
    borderRadius: 50,
    padding: 4,
    overflow: 'hidden',
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