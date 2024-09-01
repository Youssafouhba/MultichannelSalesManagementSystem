import { Tabs, usePathname } from 'expo-router';
import React,{ useEffect, useState} from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useUser } from '@/contex/UserContext';
import { useMessage } from '@/contex/MessageReducer';
import { useCart } from '@/contex/CartContex';

export default function TabLayout() {
  const { state } = useUser();
  const { statemessages } = useMessage();
  const {statecart} = useCart()
  const pathname = usePathname();
  const [isTradeCustomer,setIsTradeCustomer] = useState<boolean>(false)
  useEffect(()=>{
    setIsTradeCustomer(state.userInfos.user?.tradeCustomer)
  },[state.isLoggedIn])
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'red',
        headerShown: false,
        tabBarStyle: {
          height: 40,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarItemStyle: {backgroundColor: 'transparent'},
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={'home-outline'} color={color}
            isTradeCustomer={false} />
          ),
        }}
      />
      <Tabs.Screen
        name="Messages"
        options={{
          title: 'Messages',
          tabBarItemStyle: {backgroundColor: 'transparent'},
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={'mail-outline'} color={color}
            isTradeCustomer={false}
            badgeCount={pathname!="/Messages"?statemessages.messagesCount || 0:0}
             />
            
          ),
        }}
      />
      <Tabs.Screen
        name="FilterResult"
        options={{
          title: "FilterResult",
          tabBarItemStyle: {backgroundColor: 'transparent'},
          //tabBarStyle: { display: 'none' }, // Hide the tab bar item for this screen
          tabBarButton: () => null, // Optionally hide the tab button completely
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          title: 'Cart',
          tabBarItemStyle: {backgroundColor: 'transparent'},
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              isTradeCustomer={false}
              name={'bag-handle-outline'} 
              color={color}
              badgeCount={statecart.itemsCount || 0} // Use cartItemsCount from state
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          title: 'Account',
          tabBarItemStyle: {backgroundColor: 'transparent'},
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={'person-outline'} color={color} isTradeCustomer={state.userInfos.user?.tradeCustomer} />
          ),
        }}
      />
      <Tabs.Screen
        name="Notifications"
        options={{
          title: 'Notifications',
          tabBarItemStyle: {backgroundColor: 'transparent'},
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              isTradeCustomer={false}
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