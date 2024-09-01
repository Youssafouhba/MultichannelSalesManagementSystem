import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useInternetCheck from './useInternetCheck';

const NoInternetConnection = () => {
  const { isConnected } = useInternetCheck();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isConnected) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 0.8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isConnected]);

  const animatedStyle = {
    opacity,
    transform: [
      { scale },
      {
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  if (isConnected) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <MaterialIcons name="wifi-off" size={50} color="orangered" />
      <Text style={styles.text}>No Internet Connection...</Text>
      <Text style={styles.subText}>Please check your connection and try again</Text>
    </Animated.View>  
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '0%',
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  text: {
    color: 'gray',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subText: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default NoInternetConnection;