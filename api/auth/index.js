const express = require('express');
const router = express.Router();
const users = require('../../mocks/users.json');

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt:', email);

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User not found'
        });
    }

    if (user.password !== password) {
        return res.status(401).json({
            success: false,
            message: 'Incorrect password'
        });
    }

    const { password: _, ...userWithoutPassword } = user;
    req.session.user = userWithoutPassword;

    res.json({
        success: true,
        message: 'Login successful',
        user: userWithoutPassword
    });
});

router.post('/logout', (req, res) => {
    console.log("logout in progress");
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/me', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json(req.session.user);
});

module.exports = router;

