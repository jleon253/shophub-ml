import React from 'react';
import './Header.css';
import { useApp } from '../../context/AppContext/AppContext';

const Header = () => {
  const { user, setUser, cart } = useApp();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('session');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <a href="/" className="logo" aria-label="ShopHub home">ShopHub</a>
          <nav aria-label="Main navigation">
            <a href="/" className={currentPath === '/' ? 'active' : ''}>Home</a>
            <a href="/products" className={currentPath === '/products' ? 'active' : ''}>Products</a>
            {user ? (
              <>
                <a href="/profile" className={currentPath === '/profile' ? 'active' : ''}>Profile</a>
                <a href="/cart" className={currentPath.startsWith('/cart') ? 'active' : ''}>
                  Cart
                  {totalCartItems > 0 && (
                    <span aria-label={`${totalCartItems} items in cart`}> ({totalCartItems})</span>
                  )}
                </a>
                <a href="#" onClick={handleLogout} className="text-danger cursor-pointer" aria-label="Log out">Exit</a>
              </>
            ) : (
              <a href="/login" className={currentPath === '/login' ? 'active' : ''}>Login</a>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

