const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const { verifyToken, getCurrentUser } = require('../middleware/auth');

// Create Review
router.post('/', verifyToken, getCurrentUser, async (req, res) => {
    try {
        const { hotelId, bookingId, rating, title, comment } = req.body;

        if (!hotelId || !bookingId || !rating || !title || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking || booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const existingReview = await Review.findOne({ booking: bookingId, hotel: hotelId });
        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this hotel' });
        }

        const review = new Review({
            user: req.user._id,
            hotel: hotelId,
            booking: bookingId,
            rating,
            title,
            comment
        });

        await review.save();

        const hotel = await Hotel.findById(hotelId);
        const reviews = await Review.find({ hotel: hotelId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        hotel.rating = avgRating;
        hotel.totalReviews = reviews.length;
        hotel.reviews.push(review._id);
        await hotel.save();

        req.user.reviews.push(review._id);
        await req.user.save();

        res.status(201).json({ message: 'Review submitted successfully', review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Hotel Reviews
router.get('/hotel/:hotelId', async (req, res) => {
    try {
        const reviews = await Review.find({ hotel: req.params.hotelId })
            .populate('user', 'fullName')
            .sort({ createdAt: -1 });

        res.json({ reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;