const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

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

        if (name) user.name = name;

        if (newPassword) {
            if (!currentPassword) return res.status(400).json({ message: 'Current password required' });
            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();
        res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
