const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['hotel', 'apartment', 'villa', 'resort'],
        required: true
    },
    location: {
        address: String,
        city: String,
        country: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    images: [String],
    amenities: [String],
    rooms: [{
        name: String,
        description: String,
        beds: Number,
        capacity: Number,
        pricePerNight: Number
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    contactPerson: {
        name: String,
        email: String,
        phone: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hotel', hotelSchema);