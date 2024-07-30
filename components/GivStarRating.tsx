import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StarRatingProps {
  maxStars?: number;
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  color?: string;
}

const GivStarRating: React.FC<StarRatingProps> = ({
  maxStars = 5,
  rating,
  onRatingChange,
  size = 30,
  color = 'orange'
}) => {
  const [userRating, setUserRating] = useState<number>(rating);

  const handlePress = (selectedRating: number) => {
    setUserRating(selectedRating);
    onRatingChange(selectedRating);
  };

  return (
    <View style={styles.container}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(starValue)}
            style={styles.starContainer}
          >
            <Ionicons
              name={starValue <= userRating ? 'star' : 'star-outline'}
              size={size}
              color={color}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    padding: 2,
  },
});

export default GivStarRating;