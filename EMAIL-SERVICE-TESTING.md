# Email Service Testing Guide

## Test Gmail Configuration

Create `backend/test-gmail.js`:

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
    to: 'your-test-email@gmail.com',
    subject: 'StayBook Email Test',
    html: `
        <h2>🎉 StayBook Email Test</h2>
        <p>If you see this, Gmail configuration is working!</p>
        <p>Sender: ${process.env.EMAIL_USER}</p>
        <p>Timestamp: ${new Date().toLocaleString()}</p>
    `
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.log('❌ Email Error:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Email Sent Successfully!');
        console.log('Response:', info.response);
        process.exit(0);
    }
});
```

Run test:
```bash
cd backend
node test-gmail.js
```

## Test SendGrid Configuration

Create `backend/test-sendgrid.js`:

```javascript
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: 'your-test-email@gmail.com',
    subject: 'StayBook SendGrid Test',
    html: `
        <h2>🎉 StayBook SendGrid Test</h2>
        <p>If you see this, SendGrid configuration is working!</p>
        <p>Timestamp: ${new Date().toLocaleString()}</p>
    `
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.log('❌ Email Error:', err.message);
        process.exit(1);
    } else {
        console.log('✅ Email Sent via SendGrid!');
        console.log('Message ID:', info.messageId);
        process.exit(0);
    }
});
```

Run test:
```bash
node test-sendgrid.js
```

## Test Database Connection

Create `backend/test-db.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Database URI:', process.env.MONGODB_URI);
    process.exit(0);
})
.catch(err => {
    console.log('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
});
```

Run test:
```bash
node test-db.js
```

## Test All Services

Create `backend/test-all.js`:

```javascript
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function runTests() {
    console.log('🧪 Running StayBook Configuration Tests\n');
    
    // Test 1: Database Connection
    console.log('1️⃣  Testing MongoDB Connection...');
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB connected\n');
        await mongoose.connection.close();
    } catch (err) {
        console.log('❌ MongoDB error:', err.message, '\n');
    }
    
    // Test 2: Email Service
    console.log('2️⃣  Testing Email Service...');
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        await transporter.verify();
        console.log('✅ Email service configured\n');
    } catch (err) {
        console.log('❌ Email error:', err.message, '\n');
    }
    
    // Test 3: Environment Variables
    console.log('3️⃣  Checking Environment Variables...');
    const required = ['JWT_SECRET', 'MONGODB_URI', 'EMAIL_USER', 'EMAIL_PASS'];
    let allSet = true;
    
    required.forEach(key => {
        if (process.env[key]) {
            console.log(`✅ ${key} is set`);
        } else {
            console.log(`❌ ${key} is NOT set`);
            allSet = false;
        }
    });
    
    console.log('\n' + (allSet ? '✅ All tests passed!' : '❌ Some tests failed'));
    process.exit(allSet ? 0 : 1);
}

runTests();
```

Run all tests:
```bash
node test-all.js
```

## Expected Output

### Gmail Test
```
✅ Email Sent Successfully!
Response: 250 2.0.0 OK [message ID]
```

### SendGrid Test
```
✅ Email Sent via SendGrid!
Message ID: <abc123@sendgrid.net>
```

### Database Test
```
✅ MongoDB Connected Successfully!
Database URI: mongodb://localhost:27017/staybook
```

### All Services Test
```
1️⃣  Testing MongoDB Connection...
✅ MongoDB connected

2️⃣  Testing Email Service...
✅ Email service configured

3️⃣  Checking Environment Variables...
✅ JWT_SECRET is set
✅ MONGODB_URI is set
✅ EMAIL_USER is set
✅ EMAIL_PASS is set

✅ All tests passed!
```

## Troubleshooting

### Gmail: "Invalid login credentials"
- Enable 2-Factor Authentication
- Generate new App Password
- Use full 16-character password (no spaces)
- Wait 5 minutes after generating

### SendGrid: "Invalid API key"
- Copy full key from SendGrid dashboard
- Ensure no extra spaces
- Check key has Full Access permission

### MongoDB: "Connection timeout"
- Check if MongoDB is running
- Verify connection string format
- Check firewall settings
- Try local connection: `mongodb://localhost:27017/staybook`

### Email: "SMTP Connection refused"
- Check EMAIL_SERVICE spelling
- Verify firewall allows SMTP
- Check port number (usually 587)
- Ensure credentials are correct
