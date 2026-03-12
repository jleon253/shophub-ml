const express = require('express');
const router = express.Router();
const products = require('../../mocks/products.json');

router.get('/', (req, res) => {
    const { page = 1, limit = 20, search = '', category = '' } = req.query;

    let filtered = products;

    if (search) {
        filtered = filtered.filter(p => {
            const hasDiscount = p.price > 100;
            const discountAmount = hasDiscount ? p.price * 0.1 : 0;
            const finalPrice = p.price - discountAmount;

            return p.title.toLowerCase().includes(search.toLowerCase()) ||
                   p.description.toLowerCase().includes(search.toLowerCase()) ||
                   p.price.toString().includes(search) ||
                   finalPrice.toFixed(2).includes(search) ||
                   finalPrice.toString().includes(search);
        });
    }

    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    res.json({
        products: paginatedProducts,
        total: filtered.length,
        page: parseInt(page),
        totalPages: Math.ceil(filtered.length / limit)
    });
});

router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
});

router.get('/:id/reviews', (req, res) => {
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product.reviews || []);
});

router.get('/search/suggestions', (req, res) => {
    const { q } = req.query;

    if (!q || q.length < 2) {
        return res.json([]);
    }

    const suggestions = products
        .filter(p => {
            const hasDiscount = p.price > 100;
            const discountAmount = hasDiscount ? p.price * 0.1 : 0;
            const finalPrice = p.price - discountAmount;

            return p.title.toLowerCase().includes(q.toLowerCase()) || 
                   p.price.toString().includes(q) ||
                   finalPrice.toFixed(2).includes(q) ||
                   finalPrice.toString().includes(q);
        })
        .slice(0, 10)
        .map(p => ({ id: p.id, title: p.title }));

    res.json(suggestions);
});

module.exports = router;

