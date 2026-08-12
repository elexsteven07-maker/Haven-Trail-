# 🏨 StayBook - Hotel & Room Booking Platform

A complete, production-ready hotel booking platform with user authentication, payment gateway integration, email confirmations, and review system.

## 🚀 Features

### User Management
- ✅ User registration and login
- ✅ Email verification system
- ✅ JWT authentication
- ✅ User profiles
- ✅ Password management

### Hotel & Room Management
- ✅ Browse hotels and apartments
- ✅ Filter by location, price, rating
- ✅ View detailed hotel information
- ✅ Room availability and pricing
- ✅ Multiple room types

### Booking System
- ✅ Create and manage bookings
- ✅ Booking confirmation numbers
- ✅ Check-in/check-out dates
- ✅ Guest information management
- ✅ Special requests handling

### Payment Processing
- ✅ **Stripe** integration
- ✅ **Google Pay** support
- ✅ **Apple Pay** support
- ✅ **BML** (Bank of Maldives) integration
- ✅ **SIB** (State Bank of India) integration
- ✅ Direct card payments
- ✅ Payment status tracking
- ✅ Refund processing

### Review & Rating System
- ✅ Star ratings (1-5)
- ✅ Guest reviews with comments
- ✅ Average rating calculation
- ✅ Review moderation
- ✅ Filter by rating

### Email System
- ✅ Welcome emails
- ✅ Email verification codes
- ✅ Booking confirmations
- ✅ Payment notifications
- ✅ Cancellation emails

## 📋 Project Structure

```
Haven-Trail-/
├── frontend/
│   ├── index.html          # Main HTML
│   ├── styles.css          # Styling
│   └── script.js           # Frontend logic
│
├── backend/
│   ├── server.js           # Express server
│   ├── package.json        # Dependencies
│   ├── .env                # Environment variables
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Hotel.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   └── Payment.js
│   │
│   ├── routes/
│   │   ├── auth.js         # Authentication
│   │   ├── hotels.js       # Hotel operations
│   │   ├── bookings.js     # Booking operations
│   │   ├── payments.js     # Payment processing
│   │   ├── reviews.js      # Reviews
│   │   ├── users.js        # User profile
│   │   └── emails.js       # Email sending
│   │
│   ├── services/
│   │   ├── emailService.js # Email functionality
│   │   └── paymentService.js # Payment handling
│   │
│   ├── middleware/
│   │   └── auth.js         # JWT verification
│   │
│   └── README.md           # Backend docs
│
└── README.md               # This file
```

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3 (Responsive Design)
- Vanilla JavaScript (ES6+)
- Stripe.js
- Google Pay API

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Stripe** - Payment processing
- **Axios** - HTTP client
- **Helmet** - Security
- **CORS** - Cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- Stripe account (for payments)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file and add your credentials
cp .env.example .env

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Update API_BASE_URL in script.js if needed
# Open index.html in browser or use a local server
python -m http.server 3000
```

Visit `http://localhost:3000` in your browser

## 📝 Environment Variables

Create a `.env` file in the backend folder:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/staybook

# Frontend
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@staybook.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# BML
BML_MERCHANT_ID=your_id
BML_API_KEY=your_key

# SIB
SIB_MERCHANT_ID=your_id
SIB_API_KEY=your_key
```

## 🔐 Security Features

- ✅ JWT Token authentication
- ✅ Password hashing with bcryptjs
- ✅ Email verification
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/signup           - Register new user
POST   /api/auth/login            - Login user
POST   /api/auth/verify-email     - Verify email
GET    /api/auth/me               - Get current user
```

### Hotels
```
GET    /api/hotels                - List all hotels
GET    /api/hotels?location=city  - Search hotels
GET    /api/hotels?type=hotel     - Filter by type
GET    /api/hotels/:id            - Get hotel details
```

### Bookings
```
POST   /api/bookings              - Create booking
GET    /api/bookings              - Get user bookings
GET    /api/bookings/:id          - Get booking details
```

### Payments
```
POST   /api/payments/stripe/create-intent   - Create Stripe payment
POST   /api/payments/stripe/confirm         - Confirm payment
POST   /api/payments/bml/process            - Process BML payment
POST   /api/payments/sib/process            - Process SIB payment
POST   /api/payments/refund                 - Process refund
```

### Reviews
```
POST   /api/reviews               - Create review
GET    /api/reviews/hotel/:id     - Get hotel reviews
GET    /api/reviews/user/me       - Get user reviews
PUT    /api/reviews/:id           - Update review
DELETE /api/reviews/:id           - Delete review
```

### Users
```
GET    /api/users/profile         - Get profile
PUT    /api/users/profile         - Update profile
```

## 🔄 User Flow

1. **Sign Up** → User creates account with email verification
2. **Email Verification** → User receives verification code
3. **Login** → User logs in with credentials
4. **Search Hotels** → Browse and filter hotels
5. **View Details** → Check hotel info and reviews
6. **Book Room** → Select dates and create booking
7. **Pay** → Choose payment method (Stripe, BML, SIB, etc.)
8. **Confirmation** → Receive booking confirmation email
9. **Review** → Leave review after stay
10. **Manage Bookings** → View and cancel bookings

## 💳 Payment Gateway Setup

### Stripe
1. Go to https://stripe.com
2. Create account and get API keys
3. Add keys to .env
4. Test with card `4242 4242 4242 4242`

### BML (Bank of Maldives)
1. Contact BML for merchant account
2. Get Merchant ID and API Key
3. Add to .env
4. Implement callback handling

### SIB (State Bank of India)
1. Contact SIB for merchant account
2. Get credentials
3. Add to .env
4. Implement callback handling

## 📧 Email Configuration

### Gmail
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use app password in EMAIL_PASS

### SendGrid
1. Create account at sendgrid.com
2. Get API key
3. Update EMAIL_SERVICE and credentials

## 🧪 Testing

### Test User Account
```
Email: test@staybook.com
Password: test123456
```

### Test Hotel Search
- Location: "Downtown City"
- Price: $50-$150
- Rating: 4+ stars

### Test Payment Cards (Stripe)
```
Visa:        4242 4242 4242 4242
Mastercard:  5555 5555 5555 4444
AmEx:        3782 822463 10005
```

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet optimization
- ✅ Desktop experience
- ✅ Touch-friendly buttons
- ✅ Fast loading

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
```

### Email Not Sending
- Check email credentials in .env
- Enable "Less secure app access" for Gmail
- Check spam folder

### Payment Processing Failed
- Verify Stripe keys are correct
- Check webhook endpoints
- Ensure CORS is configured

### CORS Issues
- Update FRONTEND_URL in .env
- Check browser console for errors
- Verify origin matches

## 📈 Performance

- ✅ Database indexing
- ✅ Caching strategies
- ✅ Lazy loading images
- ✅ Minified assets
- ✅ Rate limiting

## 📦 Deployment

### Deploy Backend (Heroku)
```bash
heroku create haven-trail-api
git push heroku main
heroku config:set JWT_SECRET=your_secret_key
```

### Deploy Frontend (Netlify)
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to AWS
- Use Elastic Beanstalk for backend
- Use S3 + CloudFront for frontend
- Use RDS for MongoDB

## 📞 Support

For issues and questions:
1. Check troubleshooting section
2. Review API documentation
3. Check GitHub issues
4. Contact support team

## 📄 License

MIT License - feel free to use this project

## 👥 Contributors

- **Developer**: elexsteven07-maker
- **Platform**: GitHub
- **Year**: 2026

## 🎯 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Advanced search filters
- [ ] Wishlist feature
- [ ] Multi-language support
- [ ] AI recommendations
- [ ] Real-time notifications
- [ ] Video tours
- [ ] Live chat support
- [ ] Analytics dashboard
- [ ] Admin panel

## 📊 Project Status

✅ **PRODUCTION READY**

- All core features implemented
- Security measures in place
- Payment gateways integrated
- Email system functional
- Testing completed
- Documentation complete

---

**Built with ❤️ by StayBook Team**

**Last Updated**: August 2026
