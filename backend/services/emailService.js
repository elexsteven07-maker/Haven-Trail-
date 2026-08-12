const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendVerificationEmail = async (email, code, fullName) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'StayBook - Email Verification',
        html: `
            <h2>Welcome to StayBook, ${fullName}!</h2>
            <p>Please verify your email address using the code below:</p>
            <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
                ${code}
            </h3>
            <p>This code will expire in 24 hours.</p>
            <p>If you didn't create this account, please ignore this email.</p>
            <br/>
            <p>Best regards,<br/>StayBook Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Verification email sent to ${email}`);
        return true;
    } catch (err) {
        console.error('❌ Error sending verification email:', err);
        return false;
    }
};

exports.sendBookingConfirmationEmail = async (booking, user) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `StayBook Booking Confirmation - ${booking.confirmationNumber}`,
        html: `
            <h2>Booking Confirmed!</h2>
            <p>Dear ${user.fullName},</p>
            <p>Thank you for booking with StayBook. Here are your booking details:</p>
            
            <h3>Booking Details</h3>
            <ul>
                <li><strong>Confirmation Number:</strong> ${booking.confirmationNumber}</li>
                <li><strong>Check-in:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</li>
                <li><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</li>
                <li><strong>Number of Guests:</strong> ${booking.numberOfGuests}</li>
                <li><strong>Total Amount:</strong> $${booking.totalPrice}</li>
            </ul>
            
            <p>A confirmation email with your booking details has been sent.</p>
            <p>If you have any questions, contact our support team.</p>
            
            <br/>
            <p>Best regards,<br/>StayBook Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Booking confirmation email sent to ${user.email}`);
        return true;
    } catch (err) {
        console.error('❌ Error sending confirmation email:', err);
        return false;
    }
};