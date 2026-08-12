# 🔌 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

## Response Format
```json
{
  "status": "success/error",
  "message": "Description",
  "data": {}
}
```

---

## 🔐 Authentication Endpoints

### POST /auth/signup
Register new user

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201):**
```json
{
  "message": "User created. Verification email sent.",
  "userId": "user_id",
  "email": "john@example.com"
}
```

### POST /auth/verify-email
Verify user email

**Request:**
```json
{
  "email": "john@example.com",
  "verificationCode": "123456"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST /auth/login
User login

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Logged in successfully",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

### GET /auth/me
Get current user (Protected)

**Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "isVerified": true,
    "createdAt": "2026-08-12"
  }
}
```

---

## 🏨 Hotel Endpoints

### GET /hotels
List all hotels with filters

**Query Parameters:**
- `location` - City name (optional)
- `type` - hotel/apartment/villa (optional)
- `minPrice` - Minimum price (optional)
- `maxPrice` - Maximum price (optional)
- `rating` - Minimum rating (optional)

**Response (200):**
```json
{
  "hotels": [
    {
      "_id": "hotel_id",
      "name": "Luxury Palace Hotel",
      "type": "hotel",
      "location": {
        "city": "Downtown City",
        "address": "123 Main St"
      },
      "amenities": ["WiFi", "Pool", "Gym"],
      "rooms": [
        {
          "name": "Deluxe Room",
          "beds": 2,
          "capacity": 4,
          "pricePerNight": 150
        }
      ],
      "rating": 4.8,
      "totalReviews": 45
    }
  ]
}
```

### GET /hotels/:id
Get hotel details

**Response (200):**
```json
{
  "hotel": {
    "_id": "hotel_id",
    "name": "Luxury Palace Hotel",
    "description": "Experience luxury...",
    "type": "hotel",
    "location": {...},
    "amenities": [...],
    "rooms": [...],
    "reviews": [...],
    "rating": 4.8,
    "totalReviews": 45
  }
}
```

---

## 📅 Booking Endpoints

### POST /bookings (Protected)
Create new booking

**Request:**
```json
{
  "hotelId": "hotel_id",
  "roomName": "Deluxe Room",
  "checkInDate": "2026-09-01",
  "checkOutDate": "2026-09-05",
  "numberOfGuests": 2,
  "specialRequests": "High floor preferred"
}
```

**Response (201):**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "booking_id",
    "confirmationNumber": "BK_ABC123",
    "hotelName": "Luxury Palace Hotel",
    "totalPrice": 600,
    "checkInDate": "2026-09-01",
    "checkOutDate": "2026-09-05"
  }
}
```

### GET /bookings (Protected)
Get user bookings

**Response (200):**
```json
{
  "bookings": [
    {
      "_id": "booking_id",
      "hotel": {
        "name": "Luxury Palace Hotel"
      },
      "checkInDate": "2026-09-01",
      "checkOutDate": "2026-09-05",
      "totalPrice": 600,
      "status": "confirmed",
      "confirmationNumber": "BK_ABC123"
    }
  ]
}
```

---

## 💳 Payment Endpoints

### POST /payments/stripe/create-intent (Protected)
Create Stripe payment intent

**Request:**
```json
{
  "bookingId": "booking_id"
}
```

**Response (200):**
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### POST /payments/bml/process (Protected)
Process BML payment

**Request:**
```json
{
  "bookingId": "booking_id",
  "accountNumber": "BML_ACCOUNT_NUMBER"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Redirecting to BML payment gateway",
  "transactionId": "BML_TXN_ID"
}
```

### POST /payments/sib/process (Protected)
Process SIB payment

**Request:**
```json
{
  "bookingId": "booking_id",
  "accountNumber": "SIB_ACCOUNT_NUMBER"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Redirecting to SIB payment gateway",
  "transactionId": "SIB_TXN_ID"
}
```

---

## ⭐ Review Endpoints

### POST /reviews (Protected)
Create review

**Request:**
```json
{
  "hotelId": "hotel_id",
  "bookingId": "booking_id",
  "rating": 5,
  "title": "Amazing stay!",
  "comment": "Great service and clean rooms..."
}
```

**Response (201):**
```json
{
  "message": "Review submitted successfully",
  "review": {
    "_id": "review_id",
    "rating": 5,
    "title": "Amazing stay!",
    "comment": "Great service...",
    "createdAt": "2026-08-12"
  }
}
```

### GET /reviews/hotel/:hotelId
Get hotel reviews

**Response (200):**
```json
{
  "reviews": [
    {
      "_id": "review_id",
      "user": {
        "fullName": "John Doe"
      },
      "rating": 5,
      "title": "Amazing stay!",
      "comment": "Great service...",
      "createdAt": "2026-08-12"
    }
  ]
}
```

---

## 👤 User Endpoints

### GET /users/profile (Protected)
Get user profile

**Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "isVerified": true,
    "createdAt": "2026-08-12"
  }
}
```

### PUT /users/profile (Protected)
Update user profile

**Request:**
```json
{
  "fullName": "Jane Doe",
  "phone": "+1234567890"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {...}
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": "Email is required"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized access"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Server error",
  "message": "Error details"
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

**API Documentation Last Updated**: August 2026
