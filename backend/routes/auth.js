const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, organization } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ msg: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, organization });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, user });
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'No user' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: 'Wrong password' });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, user });
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
});

module.exports = router;