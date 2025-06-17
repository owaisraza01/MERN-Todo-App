const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({}, 'name email _id');
        res.json(users);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
});

module.exports = router;