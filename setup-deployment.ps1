# Windows Deployment Setup
# Run in PowerShell: .\setup-deployment.ps1

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  🚀 StayBook Production Deployment Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (Test-Path "backend\.env") {
    Write-Host "⚠️  backend\.env already exists" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite it? (y/n)"
    if ($response -ne 'y') {
        Write-Host "❌ Cancelled" -ForegroundColor Red
        exit
    }
}

Write-Host "📝 MongoDB Configuration" -ForegroundColor Green
Write-Host ""
$mongoUri = Read-Host "Enter MongoDB URI (leave empty for local)"
if ([string]::IsNullOrEmpty($mongoUri)) {
    $mongoUri = "mongodb://localhost:27017/staybook"
}
Write-Host "✅ MongoDB URI: $mongoUri" -ForegroundColor Green
Write-Host ""

Write-Host "📧 Email Configuration" -ForegroundColor Green
Write-Host "Choose email service:"
Write-Host "1. Gmail"
Write-Host "2. SendGrid"
Write-Host "3. Mailgun"
$emailChoice = Read-Host "Select (1-3)"

switch ($emailChoice) {
    "1" {
        $emailService = "gmail"
        $emailUser = Read-Host "Enter Gmail address"
        $emailPass = Read-Host "Enter Gmail app password"
        $emailFrom = "noreply@staybook.com"
    }
    "2" {
        $emailService = "SendGrid"
        $emailUser = "apikey"
        $emailPass = Read-Host "Enter SendGrid API key"
        $emailFrom = Read-Host "Enter sender email"
    }
    "3" {
        $emailService = "mailgun"
        $mailgunKey = Read-Host "Enter Mailgun API key"
        $mailgunDomain = Read-Host "Enter Mailgun domain"
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit
    }
}

Write-Host "✅ Email service configured: $emailService" -ForegroundColor Green
Write-Host ""

Write-Host "💳 Stripe Configuration" -ForegroundColor Green
$stripeSecret = Read-Host "Enter Stripe Secret Key (optional)"
$stripePublic = Read-Host "Enter Stripe Public Key (optional)"

Write-Host ""
Write-Host "🔐 JWT Configuration" -ForegroundColor Green
$jwtResponse = Read-Host "Auto-generate JWT Secret? (y/n)"
if ($jwtResponse -eq 'y') {
    $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    Write-Host "Generated JWT Secret: $jwtSecret" -ForegroundColor Green
} else {
    $jwtSecret = Read-Host "Enter your JWT Secret"
}

Write-Host ""
Write-Host "🌐 Frontend URL" -ForegroundColor Green
$frontendUrl = Read-Host "Enter frontend URL (default: http://localhost:3000)"
if ([string]::IsNullOrEmpty($frontendUrl)) {
    $frontendUrl = "http://localhost:3000"
}

Write-Host ""
Write-Host "📝 Creating .env file..." -ForegroundColor Green

# Create .env content
$envContent = @"
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=$mongoUri

# Frontend URL
FRONTEND_URL=$frontendUrl

# JWT
JWT_SECRET=$jwtSecret
JWT_EXPIRE=7d

# Email Configuration
EMAIL_SERVICE=$emailService
EMAIL_USER=$emailUser
EMAIL_PASS=$emailPass
EMAIL_FROM=$emailFrom

# Stripe
STRIPE_SECRET_KEY=$stripeSecret
STRIPE_PUBLIC_KEY=$stripePublic

# BML (Bank of Maldives)
BML_MERCHANT_ID=your_bml_merchant_id
BML_API_KEY=your_bml_api_key
BML_API_URL=https://api.bml.com.mv/v1

# SIB (State Bank of India)
SIB_MERCHANT_ID=your_sib_merchant_id
SIB_API_KEY=your_sib_api_key
SIB_API_URL=https://api.sbi.co.in/v1
"@

# Save .env file
$envContent | Out-File -FilePath "backend\.env" -Encoding UTF8

Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  ✅ Setup Complete!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review backend\.env and update any missing values"
Write-Host "2. Update frontend/script.js API_BASE_URL if needed"
Write-Host "3. Run: cd backend && npm install"
Write-Host "4. Test: npm run dev"
Write-Host ""
