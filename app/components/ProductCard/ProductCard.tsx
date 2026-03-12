import React, { useState } from 'react';
import './ProductCard.css';
import { useApp } from '../../context/AppContext/AppContext';
import StarRating from '../StarRating/StarRating';
import ProductDetails from '../ProductDetails/ProductDetails';

import { Product, Review } from '../../types';

interface ProductCardProps {
  product: Product;
}


const ProductCard = ({ product }: ProductCardProps) => {
  const { user, favorites, addFavorite, removeFavorite, cart, addToCart, showToast } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const cardId = `${product.id}-${Math.random().toString(36).substring(2, 7)}`;

  const isFavorite = favorites.includes(product.id);

  const inCart = cart.find(item => item.id === product.id);
  const cartQuantity = inCart ? inCart.quantity : 0;

  const hasDiscount = product.price > 100;
  const discountAmount = hasDiscount ? product.price * 0.1 : 0;
  const finalPrice = product.price - discountAmount;

  let stockStatus = '';
  let stockClass = '';
  if (product.stock === 0) {
    stockStatus = 'Out of Stock';
    stockClass = 'stock-danger';
  } else if (product.stock < 10) {
    stockStatus = `Only ${product.stock} left!`;
    stockClass = 'stock-warning';
  } else {
    stockStatus = 'In Stock';
    stockClass = 'stock-success';
  }

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      showToast('Please login to add to cart.');
      return;
    }

    if (product.stock > 0) {
      addToCart(product, quantity);
      showToast(`Added ${quantity} ${product.title} to cart!`);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const formatPrice = (price: number) => {
    return `${product.currency} ${price.toFixed(2)}`;
  };

  return (
    <article id={cardId} className="product-card position-relative" aria-label={product.title}>
      {product.isBestSeller && (
        <span className="badge badge-bestseller position-absolute top-10 left-10" aria-label="Best Seller">
          Best Seller
        </span>
      )}

      <button
        className="favorite-btn"
        onClick={handleFavoriteToggle}
        aria-label={isFavorite ? `Remove ${product.title} from favorites` : `Add ${product.title} to favorites`}
        aria-pressed={isFavorite}
      >
        <span aria-hidden="true">
          {isFavorite ? '❤️' : '🤍'}
        </span>
      </button>

      {product.image && !imgError ? (
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="product-image product-image-placeholder" aria-hidden="true">
          <span className="text-muted">No Image</span>
        </div>
      )}

      <h3 className="product-title">{product.title}</h3>

      <div className="product-rating" aria-label={`Rating: ${Math.floor(product.rating)} out of 5 stars`}>
        <StarRating rating={Math.floor(product.rating)} />
        <span className="ml-2">
          ({product.reviewCount} reviews)
        </span>
      </div>

      <div className="my-2">
        {hasDiscount ? (
          <div>
            <span className="text-strike">
              {formatPrice(product.price)}
            </span>
            <span className="product-price">{formatPrice(finalPrice)}</span>
            <span className="text-success text-sm ml-2">
              Save {discountAmount.toFixed(2)}!
            </span>
          </div>
        ) : (
          <div className="product-price">{formatPrice(product.price)}</div>
        )}
      </div>

      <div className={`stock-status ${stockClass}`}>
        {stockStatus}
      </div>

      {cartQuantity > 0 && (
        <div className="cart-indicator">
          {cartQuantity} in cart
        </div>
      )}

      <div className="my-2">
        <label htmlFor={`quantity-${product.id}`} className="text-sm mr-2">
          Qty:
        </label>
        <select
          id={`quantity-${product.id}`}
          value={quantity}
          onChange={handleQuantityChange}
          className="quantity-selector"
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      <button
        className={`btn btn-primary w-100 mb-2 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>

      <button
        className="btn btn-secondary w-100"
        onClick={() => setShowDetails(!showDetails)}
        aria-expanded={showDetails}
        aria-controls={`details-${product.id}`}
      >
        {showDetails ? 'Hide Details' : 'View Details'}
      </button>

      {showDetails && (
        <div id={`details-${product.id}`}>
          <ProductDetails product={product} />
        </div>
      )}
    </article>
  );
};

export default ProductCard;

