import React from 'react';
import { render, screen } from '@testing-library/react';
import BestSeller from '../app/components/BestSeller/BestSeller';

// Candidate must implement BestSeller component to pass these tests

describe('BestSeller Component', () => {
  const mockProducts = [
    { id: '1', title: 'Product 1', isBestSeller: true },
    { id: '2', title: 'Product 2', isBestSeller: false },
    { id: '3', title: 'Product 3', isBestSeller: true },
    { id: '4', title: 'Product 4', isBestSeller: false },
    { id: '5', title: 'Product 5', isBestSeller: true },
  ];

  it('should display only best seller products', () => {
    render(<BestSeller products={mockProducts} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    expect(screen.getByText('Product 3')).toBeInTheDocument();
    expect(screen.queryByText('Product 4')).not.toBeInTheDocument();
    expect(screen.getByText('Product 5')).toBeInTheDocument();
  });

  it('should display "No best sellers available" when list is empty', () => {
    render(<BestSeller products={[]} />);
    expect(screen.getByText('No best sellers available')).toBeInTheDocument();
  });

  it('should display "No best sellers available" when no products are best sellers', () => {
    const nonBestSellers = [
      { id: '1', title: 'Product 1', isBestSeller: false },
      { id: '2', title: 'Product 2', isBestSeller: false },
    ];
    render(<BestSeller products={nonBestSellers} />);
    expect(screen.getByText('No best sellers available')).toBeInTheDocument();
  });

  it('should render product titles in a list', () => {
    const bestSellers = [
      { id: '1', title: 'Amazing Product', isBestSeller: true },
      { id: '2', title: 'Great Item', isBestSeller: true },
    ];
    render(<BestSeller products={bestSellers} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Amazing Product')).toBeInTheDocument();
    expect(screen.getByText('Great Item')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<BestSeller products={mockProducts} />);

    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-label', 'Best Selling Products');
  });
});

