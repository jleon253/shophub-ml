import React from 'react';
import Header from '../../components/Header/Header';
import ProductCard from '../../components/ProductCard/ProductCard';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard';
import { Product } from '../../types';
import { useFetch } from '../../hooks/useFetch';

const HomePage = () => {
  const { data, loading } = useFetch<{ products: Product[] }>('/api/products?limit=8');
  const products = data?.products || [];

  return (
    <div>
      <Header />
      <main className="container">
        <h1 className="my-4">Welcome to ShopHub</h1>
        <p className="mb-4 text-lg">
          Discover amazing products at great prices
        </p>

        <section aria-labelledby="best-sellers-heading">
          <h2 id="best-sellers-heading" className="mb-3">Best Sellers</h2>
          <div className="products-grid">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : products
                  .filter((p: Product) => p.isBestSeller)
                  .slice(0, 4)
                  .map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
            }
          </div>
        </section>

        <section aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="mt-4 mb-3">Featured Products</h2>
          <div className="products-grid">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : products
                  .filter((p: Product) => !p.isBestSeller && p.price > 100)
                  .map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
            }
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;

