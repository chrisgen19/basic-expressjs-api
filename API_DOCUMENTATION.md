# API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require authentication using a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Health Check

### GET /health
Check if the API is running.

**Public endpoint** - No authentication required

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-20T10:30:00.000Z"
}
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Public endpoint** - Rate limited (5 requests per 15 minutes)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe" // optional
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** Refresh token is automatically set as HTTP-only cookie

---

### POST /api/auth/login
Login with email and password.

**Public endpoint** - Rate limited (5 requests per 15 minutes)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

---

### POST /api/auth/refresh
Refresh access token using refresh token.

**Public endpoint** - Rate limited (10 requests per 15 minutes), validated

**Request Body (optional):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** Refresh token can be sent in request body OR automatically from HTTP-only cookie.

**Response (200 OK):**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid refresh token"
}
```
or
```json
{
  "error": "Refresh token required"
}
```

---

### POST /api/auth/logout
Logout and clear refresh token cookie.

**Protected endpoint** - Requires authentication

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

## User Management Endpoints

All user endpoints require authentication and are rate limited (100 requests per 15 minutes).

### GET /api/users
Get all users with optional search and filtering.

**Protected endpoint** - Any authenticated user

**Query Parameters:**
- `q` (optional) - Search query (searches email and name)
- `role` (optional) - Filter by role: `user` or `admin`
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Example:**
```
GET /api/users?q=john&role=user&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2026-01-20T10:00:00.000Z",
      "updatedAt": "2026-01-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### GET /api/users/:id
Get a single user by ID.

**Protected endpoint** - Any authenticated user

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T10:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

---

### POST /api/users
Create a new user.

**Protected endpoint** - Admin only

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123",
  "name": "Jane Smith", // optional
  "role": "user" // optional, default: "user", options: "user" | "admin"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "newuser@example.com",
    "name": "Jane Smith",
    "role": "user",
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T10:00:00.000Z"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "User already exists"
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "Insufficient permissions"
}
```

---

### PATCH /api/users/:id
Update an existing user.

**Protected endpoint** - Admin only

**Request Body (all fields optional):**
```json
{
  "email": "updated@example.com",
  "name": "Updated Name",
  "role": "admin"
}
```

**Response (200 OK):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "uuid",
    "email": "updated@example.com",
    "name": "Updated Name",
    "role": "admin",
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-20T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - User not found
- `409 Conflict` - Email already in use
- `403 Forbidden` - Insufficient permissions

---

### DELETE /api/users/:id
Delete a user.

**Protected endpoint** - Admin only

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `404 Not Found` - User not found
- `403 Forbidden` - Insufficient permissions

---

## Security Features

### Rate Limiting
- **Authentication endpoints** (`/api/auth/register`, `/api/auth/login`): 5 requests per 15 minutes per IP
- **Token refresh endpoint** (`/api/auth/refresh`): 10 requests per 15 minutes per IP
- **General API endpoints**: 100 requests per 15 minutes per IP

### Password Security
- Passwords are hashed using bcrypt with 10 salt rounds
- Never returned in API responses
- Must meet complexity requirements

### JWT Tokens
- **Access Token**: Short-lived (15 minutes), sent in response body
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie
- Tokens include user ID, email, and role

### HTTP-Only Cookies
- Refresh tokens are stored in secure, HTTP-only cookies
- Prevents XSS attacks
- `sameSite: strict` prevents CSRF

### Authorization
- Role-based access control (RBAC)
- Two roles: `user` and `admin`
- Admin-only endpoints for user management (create, update, delete)

---

## Error Responses

### 400 Bad Request
Validation error or malformed request
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
Missing or invalid authentication
```json
{
  "error": "Authentication required"
}
```
or
```json
{
  "error": "Token expired"
}
```

### 403 Forbidden
Insufficient permissions
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
Resource not found
```json
{
  "error": "User not found"
}
```

### 409 Conflict
Resource already exists
```json
{
  "error": "User already exists"
}
```

### 429 Too Many Requests
Rate limit exceeded
```json
{
  "error": "Too many authentication attempts, please try again later"
}
```

### 500 Internal Server Error
Server error
```json
{
  "error": "Internal server error",
  "message": "Error details (only in development)"
}
```

---

## Example Usage

### Register and Login Flow
```javascript
// 1. Register
const registerRes = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123',
    name: 'John Doe'
  }),
  credentials: 'include' // Important for cookies
});
const { accessToken } = await registerRes.json();

// 2. Use access token for protected endpoints
const usersRes = await fetch('http://localhost:3000/api/users', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// 3. Refresh token when access token expires
const refreshRes = await fetch('http://localhost:3000/api/auth/refresh', {
  method: 'POST',
  credentials: 'include' // Sends refresh token cookie
});
const { accessToken: newToken } = await refreshRes.json();
```

### Admin Operations
```javascript
// Admin creates a new user
const createUserRes = await fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminAccessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'newuser@example.com',
    password: 'SecurePass123',
    name: 'New User',
    role: 'user'
  })
});

// Admin updates user
const updateRes = await fetch('http://localhost:3000/api/users/user-id', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${adminAccessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    role: 'admin'
  })
});
```

---

## Development Notes

### Environment Variables
Make sure to set proper values in `.env`:
```env
JWT_SECRET="strong-random-secret-key-for-production"
JWT_REFRESH_SECRET="another-strong-random-secret"
CORS_ORIGIN="http://localhost:3001" # Your frontend URL
```

### Database
The API uses PostgreSQL with Prisma ORM. Run migrations:
```bash
npm run prisma:migrate
```

### Starting the Server
```bash
# Development
npm run dev

# Production
npm run build
npm start
```
