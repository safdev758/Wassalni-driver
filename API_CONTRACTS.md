# Wasselni Driver App API Contracts

This document outlines the API contracts for all buttons and actions in the Wasselni Driver App.

---

## Authentication

### Quick Login Screen - Biometric/Fingerprint Button

**Endpoint:** `POST /api/v1/driver/auth/biometric`

**Request Body:**
```json
{
  "device_id": "uuid",
  "device_type": "ios"
}
```

**Response Body:**
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "driver": {
    "id": "drv_001",
    "phone": "+213555123456",
    "name": "Marcus Thorne",
    "is_verified": true,
    "is_onboarded": false
  }
}
```

**Response Codes:**
- `200 OK`: Authentication successful
- `401 Unauthorized`: Biometric verification failed
- `404 Not Found`: Driver not found

**Next:** Navigate to Personal Documents (if not onboarded) or Dashboard

---

### Quick Login Screen - Phone Number Input

**Endpoint:** `POST /api/v1/driver/auth/phone/send`

**Request Body:**
```json
{
  "phone": "+213555123456",
  "country_code": "DZ"
}
```

**Response Codes:**
- `200 OK`: OTP sent successfully
- `400 Bad Request`: Invalid phone number format
- `429 Too Many Requests`: Too many OTP requests

**Next:** Navigate to Phone Auth Screen

---

### Phone Auth Screen - "Continue" Button

**Endpoint:** `POST /api/v1/driver/auth/phone/send`

**Request Body:**
```json
{
  "phone": "+213555123456",
  "country_code": "DZ"
}
```

**Response Codes:**
- `200 OK`: OTP sent successfully
- `400 Bad Request`: Invalid phone number format
- `429 Too Many Requests`: Too many OTP requests

**Next:** Navigate to OTP Verification Screen

---

### OTP Verification Screen - "Verify" Button

**Endpoint:** `POST /api/v1/driver/auth/phone/verify`

**Request Body:**
```json
{
  "phone": "+213555123456",
  "code": "123456",
  "device_id": "uuid",
  "device_type": "ios"
}
```

**Response Body:**
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "driver": {
    "id": "drv_001",
    "phone": "+213555123456",
    "name": "Driver",
    "is_verified": true,
    "is_onboarded": false
  }
}
```

**Response Codes:**
- `200 OK`: Verification successful
- `400 Bad Request`: Invalid or expired OTP
- `401 Unauthorized`: Invalid credentials

**Next:** Navigate to Personal Documents Screen

---

## Onboarding

### Personal Documents Screen - "Continue to Vehicle" Button

**Endpoint:** `POST /api/v1/driver/onboarding/personal-info`

**Request Body:**
```json
{
  "full_name": "Marcus Thorne",
  "email": "marcus.thorne@example.com",
  "home_address": {
    "street": "123 Main St",
    "city": "Algiers",
    "zip": "16000"
  },
  "license_front": "file_url",
  "license_back": "file_url",
  "selfie": "file_url"
}
```

**Response Codes:**
- `200 OK`: Personal information saved
- `400 Bad Request`: Invalid data
- `413 Payload Too Large`: Files too large

**Next:** Navigate to Vehicle Information Screen

---

### Vehicle Information Screen - "Continue to Background Check" Button

**Endpoint:** `POST /api/v1/driver/onboarding/vehicle-info`

**Request Body:**
```json
{
  "vehicle": {
    "make": "Lucid",
    "model": "Air Grand Touring",
    "year": 2024,
    "license_plate": "ABC-1234"
  },
  "documents": {
    "insurance": "file_url",
    "registration": "file_url"
  }
}
```

**Response Codes:**
- `200 OK`: Vehicle information saved
- `400 Bad Request`: Invalid data
- `413 Payload Too Large`: Files too large

**Next:** Navigate to Dashboard (background check initiated in background)

---

## Driver Operations

### Dashboard/Radar Dashboard - "Go Online/Offline" Button

**Endpoint:** `PUT /api/v1/driver/status`

**Request Body:**
```json
{
  "is_online": true,
  "location": {
    "latitude": 36.7538,
    "longitude": 3.0588
  }
}
```

**Response Codes:**
- `200 OK`: Status updated
- `400 Bad Request`: Invalid location data
- `403 Forbidden`: Driver not approved

---

### Radar Dashboard - Get Earnings Summary

**Endpoint:** `GET /api/v1/driver/earnings/today`

**Response Body:**
```json
{
  "today_earnings": 142.50,
  "today_trips": 12,
  "online_hours": 6.5,
  "rating": 4.98
}
```

**Response Codes:**
- `200 OK`: Earnings data returned

---

### Radar Dashboard - Get Demand Areas

**Endpoint:** `GET /api/v1/driver/demand-areas`

**Query Parameters:** `latitude`, `longitude`, `radius`

**Response Body:**
```json
{
  "areas": [
    {
      "id": "area_001",
      "name": "Downtown",
      "surge_multiplier": 1.5,
      "estimated_wait_time": 5
    }
  ]
}
```

**Response Codes:**
- `200 OK`: Demand areas returned

---

### Ride Request Screen - "Accept Ride" Button

**Endpoint:** `POST /api/v1/driver/rides/{ride_id}/accept`

**Request Body:**
```json
{
  "driver_location": {
    "latitude": 36.7538,
    "longitude": 3.0588
  }
}
```

**Response Body:**
```json
{
  "ride": {
    "id": "ride_001",
    "type": "Black SUV",
    "pickup": {
      "address": "1240 Avenue of the Americas",
      "latitude": 40.7580,
      "longitude": -73.9855
    },
    "dropoff": {
      "address": "JFK International Airport",
      "latitude": 40.6413,
      "longitude": -73.7781
    },
    "estimated_fare": 42.50,
    "rider": {
      "name": "John Doe",
      "rating": 4.92
    }
  }
}
```

**Response Codes:**
- `200 OK`: Ride accepted
- `400 Bad Request`: Invalid ride ID or driver location
- `409 Conflict`: Ride already accepted by another driver
- `403 Forbidden`: Driver not online

**Next:** Navigate to Navigation Screen

---

### Ride Request Screen - "Reject Ride" Button

**Endpoint:** `POST /api/v1/driver/rides/{ride_id}/reject`

**Response Codes:**
- `204 No Content`: Ride rejected
- `404 Not Found`: Ride not found
- `409 Conflict`: Ride already accepted

**Next:** Return to Radar Dashboard

---

## Earnings

### Earnings Screen - "Cash Out Now" Button

**Endpoint:** `POST /api/v1/driver/earnings/cashout`

**Request Body:**
```json
{
  "amount": 1248.50,
  "destination": "card_4921"
}
```

**Response Body:**
```json
{
  "transaction_id": "txn_001",
  "status": "pending",
  "estimated_arrival": "2-3 business days"
}
```

**Response Codes:**
- `201 Created`: Cashout initiated
- `400 Bad Request`: Insufficient balance or invalid amount
- `402 Payment Required`: Payment method declined

---

### Earnings Screen - Get Transaction History

**Endpoint:** `GET /api/v1/driver/earnings/transactions`

**Query Parameters:** `limit`, `offset`

**Response Body:**
```json
{
  "transactions": [
    {
      "id": "txn_001",
      "type": "trip_earning",
      "amount": 84.50,
      "description": "Trip to LAX Airport",
      "date": "2024-01-15T14:45:00Z",
      "tip": 15.00
    },
    {
      "id": "txn_002",
      "type": "payout",
      "amount": -2450.00,
      "description": "Weekly Payout",
      "date": "2024-01-14T00:00:00Z",
      "status": "processed"
    }
  ],
  "total": 50,
  "limit": 10,
  "offset": 0
}
```

**Response Codes:**
- `200 OK`: Transactions returned

---

### Trip History Screen - Get Trip Details

**Endpoint:** `GET /api/v1/driver/trips/{trip_id}`

**Response Body:**
```json
{
  "id": "trip_001",
  "type": "Luxe Black",
  "status": "completed",
  "pickup": {
    "address": "1200 Luxury Ave, Downtown",
    "latitude": 36.7538,
    "longitude": 3.0588,
    "timestamp": "2024-01-15T14:45:00Z"
  },
  "dropoff": {
    "address": "4500 Business Pkwy, Tech District",
    "latitude": 36.7600,
    "longitude": 3.0650,
    "timestamp": "2024-01-15T15:17:00Z"
  },
  "fare": 45.20,
  "distance_km": 12.5,
  "duration_minutes": 32,
  "rider": {
    "name": "John Doe",
    "rating": 4.92
  }
}
```

**Response Codes:**
- `200 OK`: Trip details returned
- `404 Not Found`: Trip not found

---

### Trip History Screen - Get Weekly Summary

**Endpoint:** `GET /api/v1/driver/trips/weekly-summary`

**Response Body:**
```json
{
  "week_start": "2024-01-08",
  "week_end": "2024-01-14",
  "earnings": 1458.50,
  "trips": 42,
  "online_hours": 36.5,
  "performance": {
    "acceptance_rate": 94,
    "cancellation_rate": 2,
    "rating": 4.98
  }
}
```

**Response Codes:**
- `200 OK`: Weekly summary returned

---

## Profile

### Profile Screen - Get Driver Profile

**Endpoint:** `GET /api/v1/driver/profile`

**Response Body:**
```json
{
  "id": "drv_001",
  "name": "Alexander Vance",
  "phone": "+213555123456",
  "email": "alexander.vance@example.com",
  "rating": 4.98,
  "total_trips": 1250,
  "status": "approved",
  "vehicle": {
    "make": "Lucid",
    "model": "Air Grand Touring",
    "year": 2024,
    "license_plate": "ABC-1234",
    "color": "Black"
  }
}
```

**Response Codes:**
- `200 OK`: Profile returned

---

## General

### All Screens - Language Change

**Endpoint:** `POST /api/v1/driver/language`

**Request Body:**
```json
{
  "language": "ar"
}
```

**Response Codes:**
- `200 OK`: Language updated

---

### All Screens - Error Handling

All API errors should display user-friendly messages:
- `400`: "Invalid request. Please try again."
- `401`: "Session expired. Please log in again."
- `403`: "Access denied. Contact support if you believe this is an error."
- `404`: "Resource not found."
- `429`: "Too many requests. Please wait and try again."
- `500`: "Server error. Please try again later."

---

## Status Code Summary

| Code | Meaning |
|------|---------|
| 200 | Success - GET, PUT, DELETE |
| 201 | Created - POST |
| 204 | No Content - DELETE success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 402 | Payment Required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate/invalid state |
| 413 | Payload Too Large - File upload too big |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error |

---

## WebSocket Events

### Ride Request Event

**Event:** `ride_request`

**Payload:**
```json
{
  "ride_id": "ride_001",
  "type": "Black SUV",
  "pickup": {
    "address": "1240 Avenue of the Americas",
    "latitude": 40.7580,
    "longitude": -73.9855
  },
  "dropoff": {
    "address": "JFK International Airport",
    "latitude": 40.6413,
    "longitude": -73.7781
  },
  "estimated_fare": 42.50,
  "distance": "5.2 mi",
  "duration": "32 min",
  "rider": {
    "name": "John Doe",
    "rating": 4.92
  },
  "expires_in": 12
}
```

**Action:** Show Ride Request modal with countdown timer

---

### Ride Cancelled Event

**Event:** `ride_cancelled`

**Payload:**
```json
{
  "ride_id": "ride_001",
  "reason": "rider_cancelled"
}
```

**Action:** Return to Radar Dashboard

---

### Driver Status Update Event

**Event:** `driver_status_update`

**Payload:**
```json
{
  "status": "approved",
  "message": "Your account has been approved"
}
```

**Action:** Update driver status and navigate accordingly
