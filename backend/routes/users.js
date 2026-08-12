const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, getCurrentUser } = require('../middleware/auth');

// Get User Profile
router.get('/profile', verifyToken, getCurrentUser, (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            phone: req.user.phone,
            isVerified: req.user.isVerified,
            createdAt: req.user.createdAt
        }
    });
});

// Update User Profile
router.put('/profile', verifyToken, getCurrentUser, async (req, res) => {
    try {
        const { fullName, phone } = req.body;

        if (fullName) req.user.fullName = fullName;
        if (phone) req.user.phone = phone;

        await req.user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: req.user._id,
                fullName: req.user.fullName,
                email: req.user.email,
                phone: req.user.phone
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;