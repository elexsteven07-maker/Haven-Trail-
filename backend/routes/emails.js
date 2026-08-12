const express = require('express');
const router = express.Router();
const { sendVerificationEmail, sendBookingConfirmationEmail } = require('../services/emailService');

// Send Verification Email
router.post('/send-verification', async (req, res) => {
    try {
        const { email, code, fullName } = req.body;

        const result = await sendVerificationEmail(email, code, fullName);

        if (!result) {
            return res.status(400).json({ error: 'Failed to send email' });
        }

        res.json({ message: 'Verification email sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;