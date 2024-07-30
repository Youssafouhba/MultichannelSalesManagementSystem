import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing ,Text} from 'react-native';

interface LoadingAnimationProps {
  size?: number;
  color?: string;
  circleCount?: number;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = 100,
  color = 'blue',
  circleCount = 8
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => {
      spinAnimation.stop();
    };
  }, [spinValue]);

  const createCircles = () => {
    return Array.from({ length: circleCount }).map((_, index) => {
      const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: [`${index * (360 / circleCount)}deg`, `${360 + index * (360 / circleCount)}deg`],
      });

      const opacity = spinValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          key={index}
          style={[
            styles.circle,
            {
              width: size / 6,
              height: size / 6,
              borderRadius: size / 12,
              backgroundColor: color,
              opacity,
              transform: [
                { rotate },
                { translateX: size / 3 },
              ],
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {createCircles()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
});

export default LoadingAnimation;