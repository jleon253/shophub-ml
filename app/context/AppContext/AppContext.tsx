import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import './AppContext.css';

import { User, Product, CartItem } from '../../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  favorites: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const sessionStr = localStorage.getItem('session');
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session.email && session.id) {
            return { id: session.id, name: session.name, email: session.email };
          }
        } catch (err) {
          console.error('Invalid session in localStorage');
        }
      }
    }
    return null;
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const suppressNextSave = useRef(false);

  // Load cart for the current user: localStorage first (instant), then API sync (background)
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    // Immediate load from localStorage — no async gap, survives server restarts
    suppressNextSave.current = true;
    try {
      const stored = localStorage.getItem(`cart_${user.id}`);
      setCart(stored ? JSON.parse(stored) : []);
    } catch {
      setCart([]);
    }

    // Background sync from mocks/cart.json via API (overwrites localStorage if server has data)
    fetch('/api/cart', { headers: { 'X-User-Id': user.id } })
      .then(res => res.ok ? res.json() : null)
      .then((items: CartItem[] | null) => {
        if (items && Array.isArray(items) && items.length > 0) {
          suppressNextSave.current = true;
          setCart(items);
          localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
        }
      })
      .catch(() => {});
  }, [user?.id]);

  // Persist every cart mutation to localStorage + background API sync
  useEffect(() => {
    if (!user) return;
    if (suppressNextSave.current) {
      suppressNextSave.current = false;
      return;
    }
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Id': user.id },
      body: JSON.stringify({ items: cart }),
    }).catch(() => {});
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addFavorite = (productId: string) => {
    setFavorites([...favorites, productId]);
  };

  const removeFavorite = (productId: string) => {
    setFavorites(favorites.filter(id => id !== productId));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const value = {
    user,
    setUser,
    toastMessage,
    showToast,
    favorites,
    addFavorite,
    removeFavorite,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {toastMessage && (
        <div
          className="toast-notification"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {toastMessage}
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

