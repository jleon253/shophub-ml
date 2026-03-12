const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const CART_FILE = path.join(__dirname, '../../mocks/cart.json');

const readCart = () => {
    try {
        return JSON.parse(fs.readFileSync(CART_FILE, 'utf8'));
    } catch {
        return {};
    }
};

const writeCart = (data) => {
    fs.writeFileSync(CART_FILE, JSON.stringify(data, null, 2));
};

// Resolve userId from session (preferred) or X-User-Id header (fallback for dev)
const getUserId = (req) => {
    if (req.session && req.session.user) return req.session.user.id;
    return req.headers['x-user-id'] || null;
};

// GET /api/cart — returns cart items for the authenticated user
router.get('/', (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const carts = readCart();
    res.json(carts[userId] || []);
});

// POST /api/cart — replaces the cart for the authenticated user
router.post('/', (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const { items } = req.body;

    if (!Array.isArray(items)) {
        return res.status(400).json({ message: 'items must be an array' });
    }

    const carts = readCart();
    carts[userId] = items;
    writeCart(carts);

    res.json({ success: true, items });
});

// DELETE /api/cart — clears the cart for the authenticated user
router.delete('/', (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const carts = readCart();
    carts[userId] = [];
    writeCart(carts);

    res.json({ success: true });
});

module.exports = router;
