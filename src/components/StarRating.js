import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import PropTypes from 'prop-types';

const StarRating = ({ 
  rating, 
  maxRating = 5, 
  starSize = 15, 
  starColor = 'orange',
  onRatingChange
}) => {
  const handlePress = (index) => {
    if (onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div style={styles.container}>
      {[...Array(maxRating)].map((_, index) => (
        <button 
          key={index} 
          onClick={() => handlePress(index)} 
          disabled={!onRatingChange} 
          style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}
        >
          {index < Math.floor(rating) ? (
            <FaStar size={starSize} color={starColor} />
          ) : index < rating ? (
            <FaStarHalfAlt size={starSize} color={starColor} />
          ) : (
            <FaRegStar size={starSize} color={starColor} />
          )}
        </button>
      ))}
      <span style={{ marginLeft: '4px', fontSize: '9px', color: '#197bbd', fontWeight: '500' }}>
        ({rating})
      </span>
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
  maxRating: PropTypes.number,
  starSize: PropTypes.number,
  starColor: PropTypes.string,
  onRatingChange: PropTypes.func,
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default StarRating;