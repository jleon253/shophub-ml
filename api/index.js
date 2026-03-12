const express = require('express');
const path = require('path');
const session = require('express-session');
const authRouter = require('./auth');
const productsRouter = require('./products');
const usersRouter = require('./users');
const ordersRouter = require('./orders');
const cartRouter = require('./cart');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
    secret: 'ecommerce-secret-key-12345',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/cart', cartRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;

