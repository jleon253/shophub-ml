import React, { useState } from 'react';
import './ProductsPage.css';
import Header from '../../components/Header/Header';
import SearchBar from '../../components/SearchBar/SearchBar';
import ProductCard from '../../components/ProductCard/ProductCard';
import Pagination from '../../components/Pagination/Pagination';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard';
import { Product } from '../../types';
import { useFetch } from '../../hooks/useFetch';

const ProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const url = `/api/products?page=${currentPage}&limit=12${searchQuery ? `&search=${searchQuery}` : ''}`;
  const { data, loading } = useFetch<{ products: Product[], totalPages: number }>(url);
  
  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Header />
      <main className="container">
        <h1 className="mt-4 mb-3">All Products</h1>

        <SearchBar onSearch={handleSearch} />

        <section aria-label="Product listing" aria-live="polite" aria-busy={loading}>
          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="products-grid">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p className="text-center p-4">
              No products found
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProductsPage;

