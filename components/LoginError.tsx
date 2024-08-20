import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, Modal, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const LoginError = ({ 
  visible, 
  title, 
  message, 
  duration = 5000, 
  onDismiss,
  iconName = 'alert-circle',
  iconColor = '#f44336'
}) => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animate = useCallback((toValue) => {
    return Animated.parallel([
      Animated.timing(slideAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: toValue === 0 ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);
  }, [slideAnim, opacityAnim]);

  const handleDismiss = useCallback(() => {
    animate(100).start(() => onDismiss());
  }, [animate, onDismiss]);

  useEffect(() => {
    if (visible) {
      animate(0).start();

      if (duration > 0) {
        const timer = setTimeout(handleDismiss, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [visible, duration, animate, handleDismiss]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} onRequestClose={handleDismiss}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
            <Ionicons name={iconName} size={40} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  alertContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%',
    maxWidth: 400,
  },
  iconContainer: {
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  dismissButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LoginError;