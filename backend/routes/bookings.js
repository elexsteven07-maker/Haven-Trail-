const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const { verifyToken, getCurrentUser } = require('../middleware/auth');
const { sendBookingConfirmationEmail } = require('../services/emailService');

// Create Booking
router.post('/', verifyToken, getCurrentUser, async (req, res) => {
    try {
        const { hotelId, roomName, checkInDate, checkOutDate, numberOfGuests, specialRequests } = req.body;

        if (!hotelId || !roomName || !checkInDate || !checkOutDate || !numberOfGuests) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        const room = hotel.rooms.find(r => r.name === roomName);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkIn >= checkOut) {
            return res.status(400).json({ error: 'Check-out date must be after check-in date' });
        }

        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const totalPrice = nights * room.pricePerNight;
        const confirmationNumber = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const booking = new Booking({
            user: req.user._id,
            hotel: hotelId,
            room: {
                name: room.name,
                price: room.pricePerNight,
                beds: room.beds,
                capacity: room.capacity
            },
            checkInDate,
            checkOutDate,
            numberOfGuests,
            numberOfNights: nights,
            totalPrice,
            pricePerNight: room.pricePerNight,
            specialRequests,
            confirmationNumber,
            status: 'pending',
            paymentMethod: 'card'
        });

        await booking.save();
        req.user.bookings.push(booking._id);
        await req.user.save();

        res.status(201).json({
            message: 'Booking created successfully',
            booking: {
                id: booking._id,
                confirmationNumber: booking.confirmationNumber,
                totalPrice: booking.totalPrice,
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get User Bookings
router.get('/', verifyToken, getCurrentUser, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('hotel', 'name location')
            .sort({ createdAt: -1 });

        res.json({ bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;