const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// Get All Hotels
router.get('/', async (req, res) => {
    try {
        const { location, type, minPrice, maxPrice, rating } = req.query;
        let query = {};

        if (location) {
            query['location.city'] = { $regex: location, $options: 'i' };
        }

        if (type) {
            query.type = type;
        }

        if (minPrice || maxPrice) {
            query['rooms.pricePerNight'] = {};
            if (minPrice) query['rooms.pricePerNight'].$gte = parseInt(minPrice);
            if (maxPrice) query['rooms.pricePerNight'].$lte = parseInt(maxPrice);
        }

        if (rating) {
            query.rating = { $gte: parseFloat(rating) };
        }

        const hotels = await Hotel.find(query);
        res.json({ hotels });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Hotel by ID
router.get('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate('reviews');

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        res.json({ hotel });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;