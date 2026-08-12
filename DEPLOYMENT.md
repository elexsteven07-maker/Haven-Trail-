# 🚀 Deployment Setup Guide

## Part 1: Database Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

#### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" or "Sign In"
3. Create account with email/Google
4. Verify email

#### Step 2: Create Cluster
1. Click "Create a Deployment"
2. Choose "Shared" (Free tier - up to 512MB)
3. Select region closest to you
4. Click "Create Cluster"
5. Wait 5-10 minutes for setup

#### Step 3: Configure Network Access
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (or add your IP)
4. Click "Confirm"

#### Step 4: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username: `staybook_admin`
5. Generate secure password (save it!)
6. Click "Add User"

**Example credentials:**
```
Username: staybook_admin
Password: Secure!Pass@123#2026
```

#### Step 5: Get Connection String
1. Go to "Clusters" and click "Connect"
2. Select "Connect your application"
3. Choose Node.js version
4. Copy connection string
5. It looks like:
```
mongoodb+srv://staybook_admin:Secure!Pass@123#2026@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

#### Step 6: Update .env File
```env
MONGODB_URI=mongodb+srv://staybook_admin:Secure!Pass@123#2026@cluster0.abc123.mongodb.net/staybook?retryWrites=true&w=majority
```

### Option B: Local MongoDB Setup

#### Linux (Ubuntu/Debian)
```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable auto-start
sudo systemctl enable mongod

# Verify installation
mongo --version

# Connect to MongoDB
mongo
```

#### Mac (Homebrew)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongo --version

# Connect
mongo
```

#### Windows
1. Download from https://www.mongodb.com/try/download/community
2. Run installer
3. Use default settings
4. MongoDB runs as Windows Service
5. Open Command Prompt:
```cmd
mongo
```

#### Update .env for Local
```env
MONGODB_URI=mongodb://localhost:27017/staybook
```

### Verify Database Connection

**In MongoDB shell:**
```javascript
// Show databases
show dbs

// Use staybook database
use staybook

// Create collection
db.createCollection("users")

// Verify
show collections
```

**In Node.js backend:**
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

## Part 2: Email Service Configuration

### Option A: Gmail (Recommended for Development)

#### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com
2. Click "Security" in left menu
3. Scroll to "How you sign in to Google"
4. Click "2-Step Verification"
5. Follow setup process
6. Verify with phone

#### Step 2: Generate App Password
1. After 2FA is enabled, go back to Security
2. Scroll to "App passwords"
3. Select "Mail" and "Windows Computer" (or your device)
4. Click "Generate"
5. Copy 16-character password
6. Save it safely

**Example:**
```
App Password: abcd efgh ijkl mnop
```

#### Step 3: Update .env File
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_FROM=noreply@staybook.com
```

#### Step 4: Test Email Sending
Create `backend/test-email.js`:

```javascript
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: 'test@example.com',
    subject: 'Test Email',
    html: '<h2>Test Email</h2><p>This is a test email from StayBook</p>'
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.log('❌ Email Error:', err);
    } else {
        console.log('✅ Email Sent:', info.response);
    }
    process.exit();
});
```

Run test:
```bash
node test-email.js
```

### Option B: SendGrid (Recommended for Production)

#### Step 1: Create SendGrid Account
1. Go to https://sendgrid.com
2. Click "Sign Up Free"
3. Fill registration form
4. Verify email
5. Complete setup wizard

#### Step 2: Create API Key
1. Go to https://app.sendgrid.com/settings/api_keys
2. Click "Create API Key"
3. Name it: `StayBook Production`
4. Set permissions to "Full Access"
5. Copy the key (won't show again!)

**Example:**
```
API Key: SG.xxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Step 3: Sender Authentication
1. Go to "Settings" → "Sender Authentication"
2. Click "Verify a Single Sender"
3. Enter:
   - From Name: "StayBook"
   - From Email: "noreply@staybook.com"
   - Reply To: "support@staybook.com"
4. Click "Create"
5. Verify email sent to noreply@staybook.com
6. Click confirmation link

#### Step 4: Update .env File
```env
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASS=SG.xxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@staybook.com
```

#### Step 5: Update Email Service

Edit `backend/services/emailService.js`:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: process.env.EMAIL_PASS
    }
});

// Rest of the code remains the same
```

### Option C: Mailgun (Alternative)

#### Step 1: Create Account
1. Go to https://www.mailgun.com
2. Sign up
3. Verify email

#### Step 2: Get API Key
1. Go to Dashboard
2. Copy API Key
3. Copy Domain

#### Step 3: Update .env
```env
EMAIL_SERVICE=mailgun
MAILGUN_API_KEY=your_api_key
MAILGUN_DOMAIN=sandboxabc123.mailgun.org
EMAIL_FROM=mailgun@sandboxabc123.mailgun.org
```

---

## Part 3: Backend Deployment (Heroku)

### Step 1: Install Heroku CLI

**Linux/Mac:**
```bash
brew tap heroku/brew && brew install heroku
```

**Windows:**
Download from https://devcenter.heroku.com/articles/heroku-cli

**Verify:**
```bash
heroku --version
```

### Step 2: Login to Heroku
```bash
heroku login
```

Browser opens for authentication. Log in with your Heroku account.

### Step 3: Create Heroku App
```bash
cd backend
heroku create staybook-api-2026
```

This creates:
- App name: `staybook-api-2026`
- Git remote: `heroku`
- URL: `https://staybook-api-2026.herokuapp.com`

### Step 4: Set Environment Variables
```bash
heroku config:set JWT_SECRET="your_super_secret_key_here"
heroku config:set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/staybook"
heroku config:set EMAIL_SERVICE="SendGrid"
heroku config:set EMAIL_USER="apikey"
heroku config:set EMAIL_PASS="SG.xxxxxxxxxxxxx"
heroku config:set STRIPE_SECRET_KEY="sk_live_xxxxx"
heroku config:set STRIPE_PUBLIC_KEY="pk_live_xxxxx"
heroku config:set FRONTEND_URL="https://yourdomain.com"
heroku config:set NODE_ENV="production"
```

### Step 5: Create Procfile
Create `backend/Procfile`:
```
web: node server.js
```

### Step 6: Deploy to Heroku
```bash
# Add to git
git add .
git commit -m "Deploy to Heroku"

# Push to Heroku
git push heroku main
```

Watch deployment logs:
```bash
heroku logs --tail
```

### Step 7: Verify Deployment
```bash
# Open app in browser
heroku open

# Test API health
curl https://staybook-api-2026.herokuapp.com/api/health
```

Should return:
```json
{"status": "API is running", "timestamp": "2026-08-12T..."}
```

### Heroku Troubleshooting

**App won't start:**
```bash
heroku logs --tail
heroku restart
```

**Environment variables not set:**
```bash
heroku config
```

**Reset database:**
```bash
heroku config:unset MONGODB_URI
heroku config:set MONGODB_URI="new_url"
```

---

## Part 4: Frontend Deployment (Netlify)

### Step 1: Create Netlify Account
1. Go to https://netlify.com
2. Click "Sign up"
3. Connect GitHub account
4. Authorize Netlify

### Step 2: Update API URL
Edit `frontend/script.js`:
```javascript
const API_BASE_URL = 'https://staybook-api-2026.herokuapp.com/api';
```

### Step 3: Deploy to Netlify

**Option A: Via GitHub**
1. Push frontend to GitHub
2. Go to Netlify
3. Click "New site from Git"
4. Select GitHub
5. Choose repository: `Haven-Trail-`
6. Set build settings:
   - Build command: `echo "No build needed"`
   - Publish directory: `frontend`
7. Click "Deploy site"

**Option B: Via Netlify CLI**
```bash
npm install -g netlify-cli

cd frontend
netlify init
netlify deploy --prod
```

### Step 3: Configure Domain
1. Go to Netlify Dashboard
2. Site Settings → Domain Management
3. Click "Add domain"
4. Connect custom domain (optional)
5. Set DNS records

### Access Your App
- Frontend: `https://your-site.netlify.app`
- Backend API: `https://staybook-api-2026.herokuapp.com/api`

---

## Part 5: Alternative Deployment Options

### AWS Deployment

**Elastic Beanstalk (Backend):**
```bash
pip install awsebcli
cd backend
eb init -p node.js-16
eb create staybook-env
eb deploy
```

**S3 + CloudFront (Frontend):**
1. Create S3 bucket
2. Upload frontend files
3. Create CloudFront distribution
4. Point to S3 bucket

### DigitalOcean Deployment

**Create Droplet:**
1. Sign up at https://digitalocean.com
2. Create Droplet (Ubuntu 20.04)
3. Connect via SSH

**Setup Backend:**
```bash
sudo apt update && sudo apt upgrade
sudo apt install nodejs npm mongodb
git clone your-repo
cd backend
npm install
npm start
```

**Setup Frontend (Nginx):**
```bash
sudo apt install nginx
cd /var/www/html
# Copy frontend files
sudo systemctl restart nginx
```

---

## Part 6: Production Checklist

### Database
- [ ] MongoDB Atlas cluster created
- [ ] User credentials generated
- [ ] Network access configured
- [ ] Backup enabled
- [ ] Connection string updated

### Email Service
- [ ] Email service configured (SendGrid/Gmail)
- [ ] API keys stored securely
- [ ] Test email sent successfully
- [ ] From address verified
- [ ] Templates created

### Backend
- [ ] Heroku app created
- [ ] Environment variables set
- [ ] Procfile created
- [ ] Deployed successfully
- [ ] Health check working

### Frontend
- [ ] API URL updated
- [ ] Deployed to Netlify
- [ ] Domain configured
- [ ] Tested all features
- [ ] CORS issues resolved

### Security
- [ ] JWT_SECRET is strong
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] API rate limiting active
- [ ] No sensitive data in code

### Monitoring
- [ ] Error logging setup
- [ ] Performance monitoring
- [ ] Backup schedule configured
- [ ] SSL certificate valid
- [ ] Auto-scaling enabled

---

## Part 7: Monitoring & Maintenance

### View Heroku Logs
```bash
# Real-time logs
heroku logs --tail

# Last 50 lines
heroku logs -n 50

# Errors only
heroku logs --dyno=web
```

### Monitor Database
```bash
# Connect to MongoDB Atlas
mongo "mongodb+srv://user:pass@cluster.mongodb.net/staybook"

# Check collections
show collections

# Monitor performance
db.currentOp()
```

### Scale Backend
```bash
# Add more dynos (not free)
heroku ps:scale web=2

# Check dynos
heroku ps
```

### Update Backend
```bash
# Make changes locally
git add .
git commit -m "Update features"

# Push to production
git push heroku main

# Watch deployment
heroku logs --tail
```

---

## Support & Resources

- **MongoDB**: https://docs.mongodb.com
- **SendGrid**: https://sendgrid.com/docs
- **Heroku**: https://devcenter.heroku.com
- **Netlify**: https://docs.netlify.com

---

**Deployment Status**: ✅ Ready for Production
