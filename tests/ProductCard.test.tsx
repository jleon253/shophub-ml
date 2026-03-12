import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../app/components/ProductCard/ProductCard';
import { AppContext } from '../app/context/AppContext/AppContext';

const mockProduct = {
  id: 'prod1',
  title: 'Test Product',
  description: 'Test description',
  price: 99,
  currency: 'USD',
  category: 'electronics',
  image: '',
  stock: 10,
  rating: 4.5,
  reviewCount: 10,
  isBestSeller: true
};

const renderWithContext = (ui: React.ReactElement, contextValue: any) => {
  return render(
    <AppContext.Provider value={contextValue}>
      {ui}
    </AppContext.Provider>
  );
};

describe('ProductCard', () => {
  const mockAddToCart = jest.fn();
  const mockAddFavorite = jest.fn();
  const mockRemoveFavorite = jest.fn();

  // Mock global fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  ) as jest.Mock;

  const baseContextValue = {
    cart: [],
    favorites: [],
    addToCart: mockAddToCart,
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
    user: { id: 'user1', name: 'Test User', email: 'test@example.com' },
    showToast: jest.fn(),
    toastMessage: null,
    removeFromCart: jest.fn(),
    logout: jest.fn(),
    setUser: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product details correctly', () => {
    renderWithContext(<ProductCard product={mockProduct} />, baseContextValue);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('USD 99.00')).toBeInTheDocument();
    expect(screen.getByText('Best Seller')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('handles add to cart correctly', () => {
    renderWithContext(<ProductCard product={mockProduct} />, baseContextValue);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('toggles favorite status correctly', () => {
    // Render as not favorite
    const { rerender } = renderWithContext(
      <ProductCard product={mockProduct} />, 
      baseContextValue
    );
    
    const favButton = screen.getByRole('button', { name: /add.*favorites/i });
    fireEvent.click(favButton);
    expect(mockAddFavorite).toHaveBeenCalledWith(mockProduct.id);

    // Re-render as favorite
    rerender(
      <AppContext.Provider value={{ ...baseContextValue, favorites: [mockProduct.id] }}>
        <ProductCard product={mockProduct} />
      </AppContext.Provider>
    );
    
    const unfavButton = screen.getByRole('button', { name: /remove.*favorites/i });
    fireEvent.click(unfavButton);
    expect(mockRemoveFavorite).toHaveBeenCalledWith(mockProduct.id);
  });

  it('disables add to cart when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    renderWithContext(<ProductCard product={outOfStockProduct} />, baseContextValue);
    
    expect(screen.getAllByText('Out of Stock').length).toBeGreaterThan(0);
    const addButton = screen.getByRole('button', { name: /out of stock/i });
    expect(addButton).toBeDisabled();
  });

  it('shows details when "View Details" is clicked', () => {
    renderWithContext(<ProductCard product={mockProduct} />, baseContextValue);
    
    const detailsBtn = screen.getByText('View Details');
    fireEvent.click(detailsBtn);
    
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Hide Details')).toBeInTheDocument();
  });
});
