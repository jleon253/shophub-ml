# new_feature.md - ShopHub new feature Specifications

## Main Goal
- Implementar una nueva función que aporte el máximo valor con el mínimo esfuerzo de desarrollo

## Requirements
- Justifique por qué esta función aporta un valor significativo
- Explique por qué el esfuerzo de implementación es mínimo
- Proporcione especificaciones detalladas de implementación para las herramientas de IA
- Incluya el código de la función implementada


------

## Justification

A shopping cart is the single most critical missing piece in an e-commerce funnel. The app already allows users to add items to a cart (via `addToCart`) and displays a cart item count in the Header, yet there was **no page where users could review, adjust, or place their order**. Without a CartPage, every item added to the cart is effectively invisible to the user — they cannot see what they selected, change quantities, or proceed to checkout. This feature closes that gap and completes the core purchase workflow.

Key value delivered:
- Users can review all cart items with product image, title, category, and unit price.
- Inline quantity selector (1–10) lets users adjust amounts without removing and re-adding items.
- Per-item subtotal updates immediately on quantity change.
- One-click item removal via a clearly labelled button.
- Order Summary sidebar shows total item count and grand total, keeping the user informed before proceeding.
- **Cart is persisted across page navigations** — `localStorage` (keyed by `cart_{userId}`) is the immediate source of truth, so the cart loads synchronously on every page reload without any server dependency. `mocks/cart.json` records the definitive state via background API sync.
- Auth-guard redirects unauthenticated users to `/login`, protecting the route.

------

## Why is minimal enforcement?

The implementation required minimal effort because almost all necessary infrastructure already existed:

1. **Cart state was already in `AppContext`** — `cart: CartItem[]`, `addToCart`, and `removeFromCart` were all present. Only `updateQuantity` needed to be added (three lines of logic: `prev.map` over the array).
2. **`CartItem` type was already defined** in `app/types/index.ts` with `id`, `title`, `image`, `price`, `currency`, `category`, and `quantity`.
3. **The Header already linked to `/cart`** — the navigation badge and anchor were already pointing to the route; only the route registration in `app/index.tsx` was missing (`case '/cart': PageComponent = CartPage`).
4. **The cart API follows the exact same pattern as existing APIs** — `api/orders/index.js` already reads a JSON file with `fs.readFileSync`; `api/cart/index.js` replicates that structure. The API accepts the user ID from either the express-session (`req.session.user.id`) or a `X-User-Id` request header as fallback, so it works regardless of whether the server has been restarted and the session lost.
5. **`localStorage` handles immediate persistence without any async gap** — since the app uses full-page navigation (`window.location.href`), each page load re-mounts `AppProvider`. Using `localStorage` as the primary store means the cart loads synchronously in a `useEffect`, with no flash of empty content and no dependency on network availability.
6. **The project's existing CSS conventions** (`.container`, `.btn`, `.btn-primary`, `.text-muted`, `.mb-3`, etc.) cover most of the layout; the only new styles needed were the two-column grid layout and cart item card shape.

Total new code: ~110 lines of TSX + ~110 lines of CSS + ~60 lines in `api/cart/index.js` + ~45 lines in AppContext + 2 lines in `app/index.tsx` + `mocks/cart.json` with 3 example entries.

------

## Specifications

**Route:** `/cart`

**Auth:** If `user` is `null`, immediately redirect to `/login`.

**Layout:** Two-column grid with `<aside>` sidebar (sticky on desktop, stacks below on mobile ≤768 px):
- Left column: `<section aria-label="Cart items">` — scrollable list of cart items.
- Right column: `<aside aria-label="Order summary">` — item count, subtotal, total, "Proceed to Checkout" CTA.

**Empty state:** When `cart.length === 0`, show a centred message with a link to `/products`.

**Cart item card (`<li className="cart-item">`):**
- Product image (or placeholder `<div>` on missing/error).
- Title (`<h2>`), category (muted), and unit price.
- Quantity `<select>` (options 1–10), labelled with `aria-label="Quantity for {title}"`.
- Subtotal = `price × quantity` (updates reactively).
- Remove button (`×`) with `aria-label="Remove {title} from cart"`.

**Order Summary sidebar:**
- Row: "Items (N)" — total quantity sum.
- Row: currency + subtotal.
- Bold total row.
- Full-width "Proceed to Checkout" `<button>`.
- "Continue Shopping" link back to `/products`.

**AppContext cart persistence strategy (dual-store):**
- `localStorage` key `cart_{userId}` — synchronous, immediate, survives server restarts and full-page navigations.
- `mocks/cart.json` via `/api/cart` — persistent file store, source of record; synced in the background.

**AppContext changes:**
- Add `updateQuantity(productId: string, quantity: number): void` to `AppContextType`.
- Replace `cartLoaded` ref with `suppressNextSave` ref to prevent saving back what was just loaded.
- On `user?.id` change: immediately load from `localStorage` (synchronous); then background-fetch from `/api/cart` (with `X-User-Id` header) and, if the server returns items, overwrite state and update `localStorage`.
- On `cart` change: if `suppressNextSave` flag is set, clear it and skip; otherwise save to `localStorage` and background-POST to `/api/cart`.

**Cart persistence (`mocks/cart.json`):**
- Object keyed by `userId`: `{ "user001": [...CartItem[]], "user002": [...] }`.
- Ships with 3 example items under `user001` (john.doe@example.com) for demonstration.
- `GET /api/cart` — resolves userId from `req.session.user.id` OR `X-User-Id` header; returns user's array.
- `POST /api/cart` — receives `{ items: CartItem[] }`, writes updated entry; same userId resolution.
- `DELETE /api/cart` — clears user's array.

**Routing change (`app/index.tsx`):**
- Import `CartPage` from `./pages/CartPage/CartPage`.
- Add `case '/cart': PageComponent = CartPage;` in the path switch.

------

## Code

### `app/pages/CartPage/CartPage.tsx`

```tsx
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
                      <p className="cart-item-price">{item.currency} {item.price.toFixed(2)}</p>
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
                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
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
              <button className="btn btn-primary w-100 mt-3">Proceed to Checkout</button>
              <a href="/products" className="cart-continue-link">Continue Shopping</a>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
```

### `app/context/AppContext/AppContext.tsx` — diff

```ts
// In AppContextType interface, add:
updateQuantity: (productId: string, quantity: number) => void;

// Replace the old cartLoaded approach with suppressNextSave:
const suppressNextSave = useRef(false);

// Load cart: localStorage first (instant), then API background sync
useEffect(() => {
  if (!user) {
    setCart([]);
    return;
  }
  // 1. Immediate load from localStorage — no async gap
  suppressNextSave.current = true;
  try {
    const stored = localStorage.getItem(`cart_${user.id}`);
    setCart(stored ? JSON.parse(stored) : []);
  } catch {
    setCart([]);
  }
  // 2. Background sync from mocks/cart.json (overwrites if server has data)
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

const updateQuantity = (productId: string, quantity: number) => {
  setCart(prev => prev.map(item =>
    item.id === productId ? { ...item, quantity } : item
  ));
};

// Add to value object:
updateQuantity,
```

### `api/cart/index.js`

```js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const CART_FILE = path.join(__dirname, '../../mocks/cart.json');

const readCart = () => {
    try { return JSON.parse(fs.readFileSync(CART_FILE, 'utf8')); }
    catch { return {}; }
};
const writeCart = (data) => {
    fs.writeFileSync(CART_FILE, JSON.stringify(data, null, 2));
};

// Resolve userId from session (preferred) or X-User-Id header (fallback)
const getUserId = (req) => {
    if (req.session && req.session.user) return req.session.user.id;
    return req.headers['x-user-id'] || null;
};

router.get('/', (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });
    res.json(readCart()[userId] || []);
});

router.post('/', (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: 'items must be an array' });
    const carts = readCart();
    carts[userId] = items;
    writeCart(carts);
    res.json({ success: true, items });
});

router.delete('/', (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });
    const carts = readCart();
    carts[userId] = [];
    writeCart(carts);
    res.json({ success: true });
});

module.exports = router;
```

### `mocks/cart.json` (with 3 example items for user001)

```json
{
  "user001": [
    {
      "id": "prod001",
      "title": "Wireless Bluetooth Headphones",
      "price": 199.99,
      "currency": "USD",
      "category": "Electronics",
      "image": "/assets/headphones.jpg",
      "stock": 45,
      "quantity": 1
    },
    {
      "id": "prod002",
      "title": "Smart Fitness Watch",
      "price": 249.99,
      "currency": "USD",
      "category": "Wearables",
      "image": "/assets/smartwatch.jpg",
      "stock": 30,
      "quantity": 2
    },
    {
      "id": "prod003",
      "title": "Mechanical Gaming Keyboard",
      "price": 129.99,
      "currency": "USD",
      "category": "Electronics",
      "image": "/assets/keyboard.jpg",
      "stock": 60,
      "quantity": 1
    }
  ]
}
```

### `api/index.js` — diff

```js
const cartRouter = require('./cart');
// ...
app.use('/api/cart', cartRouter);
```

### `app/index.tsx` — diff

```tsx
import CartPage from './pages/CartPage/CartPage';

// In the path switch, add:
case '/cart':
  PageComponent = CartPage;
  break;
```
