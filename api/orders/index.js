const express = require('express');
const router = express.Router();
const orders = require('../../mocks/orders.json');

router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const userOrders = orders.filter(o => o.userId === req.session.user.id);
    res.json(userOrders);
});

router.get('/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.session.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
});

router.post('/', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const { items, shippingAddress, paymentMethod } = req.body;

    const newOrder = {
        id: `ORD${Date.now()}`,
        userId: req.session.user.id,
        items,
        shippingAddress,
        paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString(),
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    res.status(201).json(newOrder);
});

module.exports = router;

