const express = require('express');
const router = express.Router();
const { verifyToken, getCurrentUser } = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const Booking = require('../models/Booking');

// Create Stripe Payment Intent
router.post('/stripe/create-intent', verifyToken, getCurrentUser, async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId).populate('hotel');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const result = await paymentService.createStripePaymentIntent(booking, req.user);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Process BML Payment
router.post('/bml/process', verifyToken, getCurrentUser, async (req, res) => {
    try {
        const { bookingId, accountNumber } = req.body;

        const booking = await Booking.findById(bookingId).populate('hotel');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const result = await paymentService.processBMLPayment(booking, req.user, accountNumber);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Process SIB Payment
router.post('/sib/process', verifyToken, getCurrentUser, async (req, res) => {
    try {
        const { bookingId, accountNumber } = req.body;

        const booking = await Booking.findById(bookingId).populate('hotel');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const result = await paymentService.processSIBPayment(booking, req.user, accountNumber);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;