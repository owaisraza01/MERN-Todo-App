const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const signToken = (user) =>
    jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({}, 'name email _id role avatar');
        res.json(users);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.put('/profile', auth, async (req, res) => {
    const { name, currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const trimmedName = typeof name === 'string' ? name.trim() : undefined;
        if (trimmedName) user.name = trimmedName;

        if (newPassword) {
            if (!currentPassword) return res.status(400).json({ message: 'Current password required' });
            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        res.json({
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
            token: signToken(user),
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
