import React from 'react';
import './SkeletonCard.css';

const SkeletonCard: React.FC = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton skeleton-image" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-rating" />
    <div className="skeleton skeleton-price" />
    <div className="skeleton skeleton-btn" />
  </div>
);

export default SkeletonCard;
