// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/


import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';


interface TabBarIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  badgeCount?: number;
}

export function TabBarIcon({ name, color, badgeCount }: TabBarIconProps) {
  return (
    <View style={[styles.container]}>
      <Ionicons name={name} size={20} color={color} />
      {badgeCount >= 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    margin: 5,
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
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});