import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider, useApp } from '../app/context/AppContext/AppContext';

const TestComponent = () => {
  const { favorites, addFavorite, removeFavorite, cart, addToCart } = useApp();

  return (
    <div>
      <div data-testid="favorites-count">{favorites.length}</div>
      <div data-testid="cart-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</div>
      <button onClick={() => addFavorite('prod1')}>Add Favorite</button>
      <button onClick={() => removeFavorite('prod1')}>Remove Favorite</button>
      <button onClick={() => addToCart({ id: 'prod1', title: 'Product 1', price: 10 } as any, 2)}>Add To Cart</button>
    </div>
  );
};

describe('AppContext', () => {
  it('should provide context values', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
  });

  it('should add favorite', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('Add Favorite'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
  });

  it('should remove favorite', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('Add Favorite'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');

    fireEvent.click(screen.getByText('Remove Favorite'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
  });

  it('should add to cart and accumulate quantity', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    fireEvent.click(screen.getByText('Add To Cart'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
    
    // Test accumulation
    fireEvent.click(screen.getByText('Add To Cart'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('4');
  });
});

