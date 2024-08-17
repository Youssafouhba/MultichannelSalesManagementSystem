import React from "react";
import Icon from "../components/Icon";
import { StarIcon } from "../icons";

// Generate rating
export const genRating = (rating, reviewsCount, iconSize) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <Icon
          key={index}
          className={`text-yellow-300 w-${iconSize} h-${iconSize}`}
          icon={StarIcon}
        />
      ))}
      {halfStar === 1 && (
        <Icon
          className={`text-yellow-300 w-${iconSize} h-${iconSize}`}
          icon={StarIcon}
        />
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <Icon
          key={index + fullStars + halfStar}
          className={`text-gray-600 w-${iconSize} h-${iconSize}`}
          icon={StarIcon}
        />
      ))}
      {reviewsCount && (
        <p className="ml-2 text-sm text-gray-900 dark:text-gray-400">{`(${reviewsCount})`}</p>
      )}
    </div>
  );
};
