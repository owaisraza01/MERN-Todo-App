const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.put('/:id/read', auth, async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { read: true }
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

router.put('/read-all', auth, async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
