#!/bin/bash

# StayBook Deployment Setup Script
# Run this script to set up environment variables for deployment

echo "================================================"
echo "  🚀 StayBook Production Deployment Setup"
echo "================================================"
echo ""

# Check if .env file exists
if [ -f "backend/.env" ]; then
    echo "⚠️  backend/.env already exists"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled"
        exit 1
    fi
fi

echo "📝 MongoDB Configuration"
echo ""
read -p "Enter MongoDB URI (leave empty for local): " MONGODB_URI
if [ -z "$MONGODB_URI" ]; then
    MONGODB_URI="mongodb://localhost:27017/staybook"
fi
echo "✅ MongoDB URI: $MONGODB_URI"
echo ""

echo "📧 Email Configuration"
echo "Choose email service:"
echo "1. Gmail"
echo "2. SendGrid"
echo "3. Mailgun"
read -p "Select (1-3): " EMAIL_CHOICE

case $EMAIL_CHOICE in
    1)
        EMAIL_SERVICE="gmail"
        read -p "Enter Gmail address: " EMAIL_USER
        read -p "Enter Gmail app password: " EMAIL_PASS
        ;;
    2)
        EMAIL_SERVICE="SendGrid"
        EMAIL_USER="apikey"
        read -p "Enter SendGrid API key: " EMAIL_PASS
        read -p "Enter sender email: " EMAIL_FROM
        ;;
    3)
        EMAIL_SERVICE="mailgun"
        read -p "Enter Mailgun API key: " MAILGUN_API_KEY
        read -p "Enter Mailgun domain: " MAILGUN_DOMAIN
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo "✅ Email service configured: $EMAIL_SERVICE"
echo ""

echo "💳 Stripe Configuration"
read -p "Enter Stripe Secret Key (leave empty to skip): " STRIPE_SECRET_KEY
read -p "Enter Stripe Public Key (leave empty to skip): " STRIPE_PUBLIC_KEY

echo ""
echo "🔐 JWT Configuration"
read -p "Enter JWT Secret (auto-generate? y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT Secret: $JWT_SECRET"
else
    read -p "Enter your JWT Secret: " JWT_SECRET
fi

echo ""
echo "🌐 Frontend URL"
read -p "Enter frontend URL (default: http://localhost:3000): " FRONTEND_URL
if [ -z "$FRONTEND_URL" ]; then
    FRONTEND_URL="http://localhost:3000"
fi

echo ""
echo "📝 Creating .env file..."

# Create .env file
cat > "backend/.env" << EOF
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=$MONGODB_URI

# Frontend URL
FRONTEND_URL=$FRONTEND_URL

# JWT
JWT_SECRET=$JWT_SECRET
JWT_EXPIRE=7d

# Email Configuration
EMAIL_SERVICE=$EMAIL_SERVICE
EMAIL_USER=$EMAIL_USER
EMAIL_PASS=$EMAIL_PASS
EMAIL_FROM=${EMAIL_FROM:-noreply@staybook.com}

# Stripe
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
STRIPE_PUBLIC_KEY=$STRIPE_PUBLIC_KEY

# BML (Bank of Maldives)
BML_MERCHANT_ID=your_bml_merchant_id
BML_API_KEY=your_bml_api_key
BML_API_URL=https://api.bml.com.mv/v1

# SIB (State Bank of India)
SIB_MERCHANT_ID=your_sib_merchant_id
SIB_API_KEY=your_sib_api_key
SIB_API_URL=https://api.sbi.co.in/v1
EOF

echo "✅ .env file created successfully!"
echo ""
echo "================================================"
echo "  ✅ Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Review backend/.env and update any missing values"
echo "2. Update frontend/script.js API_BASE_URL if needed"
echo "3. Run: cd backend && npm install"
echo "4. Test: npm run dev"
echo ""
