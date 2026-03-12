import React from 'react';
import './ProductDetails.css';
import { Product, Review } from '../../types';
import { useFetch } from '../../hooks/useFetch';
import StarRating from '../StarRating/StarRating';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { data: reviews, loading: loadingReviews } = useFetch<Review[]>(`/api/products/${product.id}/reviews`);

  return (
    <div className="details-container">
      <h4 className="mb-2">Description</h4>
      <p className="text-sm mb-3">
        {product.description}
      </p>

      <div className="mb-2">
        <strong>Category:</strong> {product.category}
      </div>
      <div className="mb-2">
        <strong>Stock:</strong> {product.stock} units
      </div>

      <h4 className="mt-3 mb-2">Reviews</h4>
      {loadingReviews ? (
        <div>Loading reviews...</div>
      ) : reviews && reviews.length > 0 ? (
        <div className="reviews-container">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div><StarRating rating={review.rating} /></div>
              <div className="text-sm">{review.comment}</div>
              <div className="text-sm text-muted">
                - {review.author}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted">
          No reviews yet
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
