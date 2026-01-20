# Express.js Authentication API

A production-ready Express.js REST API with JWT authentication, role-based authorization, and protected CRUD endpoints.

## Features

- **JWT Authentication** - Access & refresh tokens with HTTP-only cookies
- **Role-Based Authorization** - User and admin roles with protected endpoints
- **TypeScript** - Full type safety throughout the application
- **Prisma ORM** - Type-safe database access with PostgreSQL
- **Request Validation** - Zod schemas for runtime validation
- **Security** - bcrypt password hashing, Helmet, CORS, rate limiting
- **Clean Architecture** - Controllers, services, repositories pattern
- **Error Handling** - Centralized error handling with detailed responses
- **Code Quality** - ESLint and Prettier configured

## Quick Start

### 1. Start Development Server
```bash
npm run dev
```

Server runs on http://localhost:3000

### 2. Test the API
```bash
# Health check
curl http://localhost:3000/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

## API Endpoints

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `GET /health` - Health check

### Protected Endpoints (Authenticated Users)
- `POST /api/auth/logout` - Logout
- `GET /api/users` - List users (with pagination & search)
- `GET /api/users/:id` - Get user by ID

### Admin-Only Endpoints
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

📖 **Full API documentation**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## Project Structure

```
src/
├── config/          # Configuration (env, JWT, CORS, database)
├── controllers/     # HTTP request handlers
├── middleware/      # Authentication, authorization, validation, rate limiting
├── routes/          # Route definitions
├── services/        # Business logic
├── repositories/    # Database access layer
├── schemas/         # Zod validation schemas
├── utils/           # Helper functions (password, token)
├── types/           # TypeScript type definitions
├── app.ts           # Express app setup
└── server.ts        # Server startup
```

## Available Scripts

```bash
npm run dev              # Development server with hot reload
npm run build            # Build for production
npm start                # Run production build
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI)
npm run lint             # Run ESLint
npm run format           # Format with Prettier
```

## Environment Variables

The `.env` file is already configured. Update these for production:

```env
DATABASE_URL="postgres://..."
JWT_SECRET="your-strong-secret"
JWT_REFRESH_SECRET="your-strong-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="*"
```

## Security Features

- **Password Security**: bcrypt hashing (10 rounds)
- **JWT Tokens**: Short-lived access (15min) + long-lived refresh (7d)
- **HTTP-Only Cookies**: Secure refresh token storage
- **Rate Limiting**: 5 req/15min for auth, 100 req/15min for API
- **Request Validation**: Zod runtime validation
- **Helmet**: Security HTTP headers
- **CORS**: Configurable origin policy

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String?
  role      String   @default("user") // "user" | "admin"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Creating an Admin User

After registering a regular user, promote them to admin:

```bash
# Open Prisma Studio
npm run prisma:studio
# Then edit the user's role to "admin" in the GUI
```

Or using SQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup and architecture guide
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Complete API reference
- [SECURITY.md](SECURITY.md) - Security features and best practices

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: bcrypt, helmet, express-rate-limit
- **Dev Tools**: ts-node-dev, ESLint, Prettier

## Production Checklist

- [ ] Update JWT secrets to strong random values
- [ ] Set `NODE_ENV=production`
- [ ] Update `CORS_ORIGIN` to frontend domain
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure database connection pooling
- [ ] Review rate limiting settings

## License

ISC
