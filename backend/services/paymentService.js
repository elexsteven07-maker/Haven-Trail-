const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// ==================== STRIPE PAYMENT ====================

exports.createStripePaymentIntent = async (booking, user) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(booking.totalPrice * 100),
            currency: 'usd',
            metadata: {
                bookingId: booking._id.toString(),
                userId: user._id.toString(),
                confirmationNumber: booking.confirmationNumber
            },
            description: `Hotel booking`
        });

        const payment = new Payment({
            booking: booking._id,
            user: user._id,
            amount: booking.totalPrice,
            currency: 'USD',
            paymentMethod: 'stripe',
            status: 'pending',
            stripePaymentIntentId: paymentIntent.id
        });

        await payment.save();

        return {
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        };
    } catch (err) {
        console.error('❌ Stripe error:', err);
        return { success: false, error: err.message };
    }
};

// ==================== BML PAYMENT ====================

exports.processBMLPayment = async (booking, user, accountNumber) => {
    try {
        const payment = new Payment({
            booking: booking._id,
            user: user._id,
            amount: booking.totalPrice,
            currency: 'USD',
            paymentMethod: 'bml',
            status: 'processing',
            bmlTransactionId: `BML${Date.now()}`
        });

        await payment.save();

        return {
            success: true,
            message: 'Redirecting to BML payment gateway',
            transactionId: payment.bmlTransactionId
        };
    } catch (err) {
        console.error('❌ BML error:', err);
        return { success: false, error: err.message };
    }
};

// ==================== SIB PAYMENT ====================

exports.processSIBPayment = async (booking, user, accountNumber) => {
    try {
        const payment = new Payment({
            booking: booking._id,
            user: user._id,
            amount: booking.totalPrice,
            currency: 'USD',
            paymentMethod: 'sib',
            status: 'processing',
            sibTransactionId: `SIB${Date.now()}`
        });

        await payment.save();

        return {
            success: true,
            message: 'Redirecting to SIB payment gateway',
            transactionId: payment.sibTransactionId
        };
    } catch (err) {
        console.error('❌ SIB error:', err);
        return { success: false, error: err.message };
    }
};

// ==================== REFUND ====================

exports.processRefund = async (bookingId, reason) => {
    try {
        const booking = await Booking.findById(bookingId);
        const payment = await Payment.findOne({ booking: bookingId });

        if (!payment || payment.status !== 'completed') {
            return { success: false, error: 'Payment not found or not completed' };
        }

        payment.status = 'refunded';
        payment.refundAmount = booking.totalPrice;
        payment.refundReason = reason;
        payment.refundedAt = new Date();
        await payment.save();

        booking.status = 'cancelled';
        await booking.save();

        return { success: true, message: 'Refund processed successfully' };
    } catch (err) {
        console.error('❌ Refund error:', err);
        return { success: false, error: err.message };
    }
};