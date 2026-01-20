# Setup Guide - Express.js Auth API

## ⚠️ SECURITY WARNING

**IMPORTANT: This guide and the `.env` file contain live database credentials for demonstration purposes.**

**Before committing or sharing this code:**
1. ✅ The `.env` file is already in `.gitignore` - verify it stays there
2. ⚠️ **NEVER** commit `.env` to version control
3. ⚠️ **NEVER** publish this guide with real credentials to public repositories
4. ✅ Use `.env.example` (which has placeholder values) for documentation
5. 🔒 In production, use a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)
6. 🔒 Rotate all credentials before deploying to production
7. 🔒 Generate strong JWT secrets using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

---

## Project Overview

A production-ready Express.js authentication API built with TypeScript, featuring:
- JWT authentication with access & refresh tokens
- Role-based authorization (user, admin)
- Protected CRUD endpoints for user management
- Request validation with Zod
- Rate limiting
- Security best practices (bcrypt, helmet, HTTP-only cookies)

---

## Project Structure

```
src/
├── config/
│   ├── config.ts          # Legacy config (deprecated)
│   ├── cors.ts            # CORS configuration
│   ├── database.ts        # Prisma client instance
│   ├── env.ts             # Environment configuration
│   └── jwt.ts             # JWT configuration
├── controllers/
│   ├── auth.controller.ts # Authentication endpoints
│   └── user.controller.ts # User CRUD endpoints
├── middleware/
│   ├── authenticate.ts    # JWT verification
│   ├── authorize.ts       # Role-based access control
│   ├── error.ts           # Global error handler
│   ├── rateLimiters.ts    # Rate limiting config
│   └── validate.ts        # Zod validation middleware
├── repositories/
│   └── user.repo.ts       # Database access layer
├── routes/
│   ├── auth.routes.ts     # Auth routes
│   └── user.routes.ts     # User routes
├── schemas/
│   ├── auth.schema.ts     # Auth validation schemas
│   └── user.schema.ts     # User validation schemas
├── services/
│   ├── auth.service.ts    # Authentication business logic
│   └── user.service.ts    # User management logic
├── types/
│   └── express.d.ts       # Express type extensions
├── utils/
│   ├── password.ts        # Password hashing utilities
│   └── token.ts           # JWT token utilities
├── app.ts                 # Express app configuration
└── server.ts              # Server startup & shutdown
```

---

## Installation Steps

### 1. Environment Setup
The `.env` file is already configured with your database. Review and update if needed:

```env
DATABASE_URL="postgres://postgres:31Ix8NcfXRtn03mgXgqKNdvSSiBb8N2Mjx6bhabq8sXmosPOCE5QfKEl1LQ96N0H@72.61.113.145:5432/expressjs"

# Change these in production!
JWT_SECRET="your-secret-key-change-this-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-this-in-production"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

PORT=3000
NODE_ENV=development

# Update this to your frontend URL in production
CORS_ORIGIN="*"
```

### 2. Database is Ready
The database has been migrated and is ready to use. The `users` table schema:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 3. Start Development Server
```bash
npm run dev
```

The server will start on http://localhost:3000

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build            # Compile TypeScript to JavaScript
npm start                # Run production build

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio GUI

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

---

## API Endpoints

### Public Endpoints (No Auth Required)
- `GET /health` - Health check
- `POST /api/auth/register` - Register new user (rate limited)
- `POST /api/auth/login` - Login (rate limited)
- `POST /api/auth/refresh` - Refresh access token

### Protected Endpoints (Auth Required)
- `POST /api/auth/logout` - Logout
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID

### Admin-Only Endpoints (Auth + Admin Role)
- `POST /api/users` - Create user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed endpoint documentation.

---

## Quick Start Testing

### 1. Test Health Check
```bash
curl http://localhost:3000/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

Save the `accessToken` from the response.

### 4. Access Protected Endpoint
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Security Features

### Authentication
- **Access Token**: JWT, expires in 15 minutes, sent in response
- **Refresh Token**: JWT, expires in 7 days, stored in HTTP-only cookie
- **Password Hashing**: bcrypt with 10 salt rounds

### Authorization
- **Role-Based Access Control (RBAC)**
  - `user` - Can view users
  - `admin` - Full CRUD on users

### Rate Limiting
- Auth endpoints: 5 requests / 15 min
- API endpoints: 100 requests / 15 min

### Request Validation
- Zod schemas validate all incoming requests
- Detailed validation error messages
- Type-safe runtime checks

### Security Headers
- Helmet.js for secure HTTP headers
- CORS configuration
- HTTP-only cookies for refresh tokens
- SameSite cookie protection

---

## Creating an Admin User

Since the first user will be created as a regular user, you'll need to manually update the database to create an admin:

### Option 1: Using Prisma Studio
```bash
npm run prisma:studio
```
Then edit the user's role to "admin" in the GUI.

### Option 2: Direct Database Query
```sql
UPDATE users SET role = 'admin' WHERE email = 'test@example.com';
```

---

## Production Deployment Checklist

- [ ] Update `JWT_SECRET` and `JWT_REFRESH_SECRET` to strong random values
- [ ] Set `NODE_ENV=production`
- [ ] Update `CORS_ORIGIN` to your frontend domain
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (set `secure: true` in cookie options)
- [ ] Set up proper logging (consider replacing morgan with pino)
- [ ] Configure database connection pooling
- [ ] Set up monitoring and error tracking
- [ ] Review rate limiting settings
- [ ] Test all endpoints with production data

---

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change PORT in .env file
```

### Database Connection Issues
- Verify DATABASE_URL in .env
- Check if PostgreSQL server is running
- Test connection: `npm run prisma:studio`

### TypeScript Errors
```bash
# Regenerate Prisma client
npm run prisma:generate

# Clean build
rm -rf dist/
npm run build
```

### JWT Token Issues
- Ensure JWT_SECRET and JWT_REFRESH_SECRET are set
- Check token expiration times
- Verify cookie settings for refresh token

---

## Next Steps

1. **Add More Features**:
   - Email verification
   - Password reset flow
   - OAuth/Social login
   - User profile updates
   - File uploads

2. **Enhance Security**:
   - Add Redis for token blacklisting
   - Implement CSRF protection
   - Add request logging
   - Set up monitoring

3. **Testing**:
   - Add unit tests (Jest)
   - Add integration tests
   - Add E2E tests

4. **Documentation**:
   - Set up Swagger/OpenAPI docs
   - Add JSDoc comments
   - Create API changelog

---

## Support

For issues or questions:
1. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Review error logs in the console
3. Check Prisma documentation for database issues
4. Review Express.js and TypeScript docs

---

## Architecture Decisions

### Why This Structure?
- **Controllers**: Handle HTTP layer, thin and focused
- **Services**: Business logic, reusable across controllers
- **Repositories**: Database access, abstracts Prisma
- **Middleware**: Cross-cutting concerns (auth, validation)
- **Schemas**: Single source of truth for validation

### Why These Libraries?
- **Zod**: Runtime type validation, TypeScript integration
- **bcrypt**: Industry standard for password hashing
- **jsonwebtoken**: Standard JWT implementation
- **Prisma**: Modern ORM with excellent TypeScript support
- **express-rate-limit**: Simple, effective rate limiting

---

Happy coding! 🚀
