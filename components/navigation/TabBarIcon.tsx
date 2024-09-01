// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/


import { View,Image, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { usePathname } from 'expo-router';


interface TabBarIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  badgeCount?: number;
  isTradeCustomer: boolean;
}

export function TabBarIcon({ name, color, badgeCount,isTradeCustomer }: TabBarIconProps) {
  const pathname = usePathname();
  return (
    <View style={[styles.container]}>
      <Ionicons name={name} size={21} color={color} />
      {(badgeCount > 0) && (
        <View style={[styles.badge,badgeCount > 99 && {  width: 18,}]}>
          <Text style={[styles.badgeText,badgeCount > 99 && {  fontSize: 8}]}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
       {isTradeCustomer && (
      <View
        style={{
          position: 'absolute',
          bottom: -4,
          right: -12,
          width: 18,
          height: 18,
          borderRadius: 50,
        }}
      >
        <Image
          style={{ width: 18, height: 18 }}
          tintColor={'orangered'}
          source={require('@/assets/images/icons8-badge-30.png')}
        />
      </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    width: 24, height: 24, justifyContent: 'center', alignItems: 'center'
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: 'red',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});