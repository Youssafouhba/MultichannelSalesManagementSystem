import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  starSize?: number;
  starColor?: string;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  starSize = 15, 
  starColor = 'orange',
  onRatingChange
}) => {
  const handlePress = (index: number) => {
    if (onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {[...Array(maxRating)].map((_, index) => (
          <TouchableOpacity key={index} onPress={() => handlePress(index)} disabled={!onRatingChange}>
            <FontAwesome
              name={index < Math.floor(rating) ? 'star' : index < rating ? 'star-half-o' : 'star-o'}
              size={starSize}
              color={starColor}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
        <Text style={[tw`ml-1`, {fontSize: 9, color: '#197bbd', fontWeight: '500'}]}>({rating})</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
});

export default StarRating;