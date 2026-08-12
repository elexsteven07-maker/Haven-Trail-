# StayBook Backend API

Complete Node.js/Express backend for StayBook hotel booking platform with payment gateway integration and email confirmation system.

## Features

- ✅ User Authentication (JWT)
- ✅ Email Verification System
- ✅ Booking Management
- ✅ Payment Processing (Stripe, BML, SIB)
- ✅ Hotel Reviews & Ratings
- ✅ Secure Password Management
- ✅ Email Notifications

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment variables**
Copy `.env` and update with your credentials

3. **Start the server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-email` - Verify email
- `GET /api/auth/me` - Get current user

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings

### Payments
- `POST /api/payments/stripe/create-intent` - Create Stripe payment
- `POST /api/payments/bml/process` - Process BML payment
- `POST /api/payments/sib/process` - Process SIB payment

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/hotel/:hotelId` - Get hotel reviews

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

## Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

## Support

For issues, create an issue on GitHub.
