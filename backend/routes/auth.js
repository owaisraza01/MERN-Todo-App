const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
    next();
};

const signToken = (user) =>
    jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

const sendResetEmail = async (to, resetUrl) => {
    if (!process.env.EMAIL_HOST) return null;
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
        from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Reset your TaskFlow password',
        html: `<p>You requested a password reset. Click the link below (expires in 1 hour):</p>
               <a href="${resetUrl}" style="font-weight:bold;color:#2193b0">${resetUrl}</a>
               <p>If you didn't request this, ignore this email.</p>`,
    });
    return true;
};

router.post('/register',
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
    async (req, res) => {
        const { name, email, password, organization } = req.body;
        try {
            const exists = await User.findOne({ email });
            if (exists) return res.status(400).json({ message: 'User already exists' });
            const hashed = await bcrypt.hash(password, 10);
            const user = await User.create({ name, email, password: hashed, organization });
            const token = signToken(user);
            res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);

router.post('/login',
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
    async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: 'Invalid credentials' });
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ message: 'Invalid credentials' });
            const token = signToken(user);
            res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);

router.post('/forgot-password',
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    validate,
    async (req, res) => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: 'No account with that email' });

            const token = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
            user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
            await user.save();

            const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
            const resetUrl = `${clientUrl}/reset-password/${token}`;

            const sent = await sendResetEmail(email, resetUrl);
            if (sent) {
                res.json({ message: 'Reset link sent to your email' });
            } else {
                res.json({ message: 'Reset link generated (email not configured)', resetUrl });
            }
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);

router.post('/reset-password/:token',
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
    async (req, res) => {
        const { password } = req.body;
        try {
            const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
            const user = await User.findOne({
                resetPasswordToken: hashed,
                resetPasswordExpires: { $gt: Date.now() },
            });
            if (!user) return res.status(400).json({ message: 'Invalid or expired reset link' });

            user.password = await bcrypt.hash(password, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.json({ message: 'Password reset successfully' });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);

module.exports = router;
