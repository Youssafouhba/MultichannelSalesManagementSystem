

export function ProductRating(product) {
    
    const totalRating = product.comments.reduce((sum, item) => sum + item.rating, 0);

    // Calculate the average rating
    const averageRating = product.comments.length > 0 ? totalRating / product.comments.length : 0;
  
    // Format the average rating to one decimal place
    return averageRating.toFixed(1);
}

