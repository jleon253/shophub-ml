import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './context/AppContext/AppContext';
import HomePage from './pages/HomePage/HomePage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import CartPage from './pages/CartPage/CartPage';

const App = () => {
  const path = window.location.pathname;

  let PageComponent;

  switch (path) {
    case '/products':
      PageComponent = ProductsPage;
      break;
    case '/cart':
      PageComponent = CartPage;
      break;
    case '/login':
      PageComponent = LoginPage;
      break;
    case '/profile':
      PageComponent = ProfilePage;
      break;
    case '/':
    default:
      PageComponent = HomePage;
  }

  return (
    <AppProvider>
      <PageComponent />
    </AppProvider>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

