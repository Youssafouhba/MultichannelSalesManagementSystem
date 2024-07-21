import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    sceneContainerStyle={{}}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
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
            <TabBarIcon name={focused ? 'bag-handle-sharp' : 'bag-handle-outline'} color={color} />
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
            <TabBarIcon name={focused ? 'notifications' : 'notifications-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
