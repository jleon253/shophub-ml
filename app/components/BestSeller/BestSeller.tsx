import React from 'react';

interface Product {
  id: string;
  title: string;
  isBestSeller: boolean;
}

interface BestSellerProps {
  products: Product[];
}

const BestSeller: React.FC<BestSellerProps> = ({ products }) => {
  const bestSellers = products.filter(p => p.isBestSeller);

  if (bestSellers.length === 0) {
    return <div>No best sellers available</div>;
  }

  return (
    <ul aria-label="Best Selling Products">
      {bestSellers.map(product => (
        <li key={product.id}>
          {product.title}
        </li>
      ))}
    </ul>
  );
};

export default BestSeller;
