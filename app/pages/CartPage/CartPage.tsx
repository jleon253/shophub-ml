import React from 'react';
import './CartPage.css';
import Header from '../../components/Header/Header';
import { useApp } from '../../context/AppContext/AppContext';
import { CartItem } from '../../types';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, user } = useApp();

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currency = cart[0]?.currency ?? 'USD';

  return (
    <div>
      <Header />
      <main className="container">
        <h1 className="my-4">Shopping Cart</h1>

        {cart.length === 0 ? (
          <section className="cart-empty">
            <p className="text-muted mb-3">Your cart is empty.</p>
            <a href="/products" className="btn btn-primary">Browse Products</a>
          </section>
        ) : (
          <div className="cart-layout">
            <section aria-label="Cart items">
              <ul className="cart-list">
                {cart.map((item: CartItem) => (
                  <li key={item.id} className="cart-item">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="cart-item-image"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="cart-item-image cart-item-image-placeholder" aria-hidden="true" />
                    )}

                    <div className="cart-item-info">
                      <h2 className="cart-item-title">{item.title}</h2>
                      <p className="text-muted text-sm">{item.category}</p>
                      <p className="cart-item-price">
                        {item.currency} {item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="cart-item-controls">
                      <label htmlFor={`qty-${item.id}`} className="text-sm">Qty:</label>
                      <select
                        id={`qty-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="quantity-selector ml-2"
                        aria-label={`Quantity for ${item.title}`}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>

                    <div className="cart-item-subtotal">
                      {item.currency} {(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="cart-summary" aria-label="Order summary">
              <h2 className="mb-3">Order Summary</h2>
              <div className="cart-summary-row">
                <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>{currency} {subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <strong>Total</strong>
                <strong>{currency} {subtotal.toFixed(2)}</strong>
              </div>
              <button className="btn btn-primary w-100 mt-3">
                Proceed to Checkout
              </button>
              <a href="/products" className="cart-continue-link">
                Continue Shopping
              </a>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
