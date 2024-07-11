import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.continer}>
      <ThemedText style={styles.continer}>  hello world </ThemedText>
      <StatusBar style='auto' />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    color: 'red',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
