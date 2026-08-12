# 🔧 Installation & Setup Guide

## Prerequisites
- Node.js v14 or higher
- MongoDB (local or cloud)
- Stripe account (for payments)
- Email service account (Gmail or SendGrid)

## Step 1: Clone Repository

```bash
git clone https://github.com/elexsteven07-maker/Haven-Trail-.git
cd Haven-Trail-
```

## Step 2: Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Configure Environment
```bash
cp .env .env.local
```

Edit `.env` with your credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/staybook
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/staybook

# Frontend
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRE=7d

# Email (Gmail Example)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
EMAIL_FROM=noreply@staybook.com

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLIC_KEY=pk_test_your_key_here

# BML
BML_MERCHANT_ID=your_merchant_id
BML_API_KEY=your_api_key

# SIB
SIB_MERCHANT_ID=your_merchant_id
SIB_API_KEY=your_api_key
```

### Start Backend Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
📍 Environment: development
```

## Step 3: Frontend Setup

### Update API URL
Edit `frontend/script.js` and update:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Run Frontend
Option A: Using Python
```bash
cd frontend
python -m http.server 3000
```

Option B: Using Node.js
```bash
cd frontend
npx http-server -p 3000
```

Option C: Using VS Code Live Server
- Install Live Server extension
- Right-click index.html → "Open with Live Server"

Visit: `http://localhost:3000`

## Step 4: Test the Application

### Create Account
1. Click "Login / Sign Up"
2. Fill signup form
3. Check email for verification code
4. Enter verification code

### Search Hotels
1. Enter location: "Downtown City"
2. Select check-in and check-out dates
3. Click "Search"

### Make Booking
1. Click "Book Now" on a hotel
2. Fill booking details
3. Click "Proceed to Payment"

### Test Payment
1. Select payment method
2. For Stripe: Use test card `4242 4242 4242 4242`
3. Complete payment
4. Check confirmation email

## Database Setup

### Local MongoDB

**Linux:**
```bash
sudo systemctl start mongod
mongo  # Connect to database
```

**Mac:**
```bash
brew services start mongodb-community
mongo
```

**Windows:**
```cmd
net start MongoDB
```

### MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account
3. Create cluster
4. Get connection string
5. Add to MONGODB_URI in .env

## Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password
4. Use in EMAIL_PASS

### SendGrid Setup
1. Create account at https://sendgrid.com
2. Create API key
3. Update .env:
```env
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
```

## Payment Setup

### Stripe
1. Visit https://stripe.com
2. Create account
3. Get API keys from dashboard
4. Add to .env
5. Update frontend with public key

Test Cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- 3D Secure: 4000 0025 0000 3155

### BML & SIB
1. Contact respective banks
2. Get merchant credentials
3. Request API documentation
4. Implement payment endpoints

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### MongoDB Connection Failed
```bash
# Check MongoDB is running
mongo

# Restart MongoDB
sudo systemctl restart mongod
```

### Email Not Sending
- Check credentials in .env
- Enable "Less secure apps" for Gmail
- Check firewall settings
- Review Nodemailer logs

### CORS Errors
- Verify FRONTEND_URL in .env
- Check browser console
- Restart backend server

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Tools

### Postman (API Testing)
- Download: https://www.postman.com/downloads/
- Import API endpoints
- Test with different data

### MongoDB Compass (Database GUI)
- Download: https://www.mongodb.com/products/tools/compass
- Connect to your database
- View collections

### VS Code Extensions
- REST Client
- Thunder Client
- MongoDB for VS Code
- Prettier

## Next Steps

1. ✅ Test all features locally
2. ✅ Configure payment gateways
3. ✅ Set up email service
4. ✅ Deploy backend (Heroku/AWS)
5. ✅ Deploy frontend (Netlify/Vercel)
6. ✅ Configure production database
7. ✅ Update environment variables
8. ✅ Set up monitoring
9. ✅ Configure backups
10. ✅ Launch to production

## Production Deployment

### Backend (Heroku)
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set JWT_SECRET=your_secret
heroku addons:create mongolab
```

### Frontend (Netlify)
```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

## Support

For issues:
1. Check logs
2. Review documentation
3. Check GitHub issues
4. Contact support

---

**Happy Coding! 🚀**
