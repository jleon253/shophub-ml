const express = require('express');
const router = express.Router();
const users = require('../../mocks/users.json');

router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    console.log('Sending user data:', user);
    res.json(user);
});

router.get('/:id/orders', (req, res) => {
    const orders = require('../../mocks/orders.json');
    const userOrders = orders.filter(o => o.userId === req.params.id);

    res.json(userOrders);
});

router.put('/:id', (req, res) => {
    if (!req.session.user || req.session.user.id !== req.params.id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { name, email, phone, address } = req.body;

    const updatedUser = {
        ...req.session.user,
        name,
        email,
        phone,
        address
    };

    req.session.user = updatedUser;
    res.json(updatedUser);
});

module.exports = router;

