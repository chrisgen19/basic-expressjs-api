# Security Guide

## Overview

This document outlines the security features implemented in this API and best practices for maintaining security.

---

## 🔒 Security Features Implemented

### Authentication & Authorization

#### JWT Tokens
- **Access Token**: Short-lived (15 minutes), sent in response body
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie
- Both tokens signed with separate secrets
- Tokens include: `userId`, `email`, `role`

#### Password Security
- **bcrypt hashing** with 10 salt rounds
- Passwords never returned in API responses
- Password complexity requirements enforced:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

#### Role-Based Access Control (RBAC)
- Two roles: `user` and `admin`
- Middleware-based authorization checks
- Admin-only endpoints for user management

### Request Security

#### Rate Limiting
- **Authentication endpoints** (`/login`, `/register`): 5 requests per 15 minutes
- **Refresh token endpoint**: 10 requests per 15 minutes
- **General API**: 100 requests per 15 minutes
- Per-IP tracking

#### Request Validation
- All requests validated with Zod schemas
- Runtime type checking
- Detailed validation error messages
- Prevents injection attacks through strict typing

#### HTTP Security Headers (Helmet)
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)
- And more...

#### CORS Configuration
- Configurable allowed origins
- Credentials support for cookies
- Preflight request handling

### Cookie Security

#### HTTP-Only Cookies
- Refresh tokens stored in HTTP-only cookies
- Not accessible via JavaScript (XSS protection)
- `sameSite: strict` (CSRF protection)
- `secure: true` in production (HTTPS only)
- Automatic expiration (7 days)

---

## 🚨 Security Vulnerabilities Fixed

### 1. Credentials in Documentation
**Issue**: Live database credentials were present in `.env` and documentation files.

**Fix**:
- Added warning comments to `.env` file
- Created `.env.example` with placeholder values
- Added security warnings to SETUP_GUIDE.md
- `.env` is in `.gitignore`

**Action Required**:
- Never commit `.env` to version control
- Rotate credentials before production deployment
- Use secrets manager in production

### 2. Unprotected Refresh Endpoint
**Issue**: `/api/auth/refresh` had no rate limiting or validation.

**Fix**:
- Added `refreshLimiter` (10 requests per 15 minutes)
- Added `validate(refreshTokenSchema)` middleware
- Prevents abuse and brute force attempts

---

## 🔐 Secrets Management

### Development

The `.env` file is used for local development:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
```

**Important**:
- `.env` is in `.gitignore`
- Never commit to version control
- Never share in public channels

### Production

Use a secrets manager:

**AWS Secrets Manager**:
```javascript
const AWS = require('aws-sdk');
const client = new AWS.SecretsManager({ region: 'us-east-1' });

async function getSecret(secretName) {
  const data = await client.getSecretValue({ SecretId: secretName }).promise();
  return JSON.parse(data.SecretString);
}
```

**HashiCorp Vault**:
```javascript
const vault = require('node-vault')({
  endpoint: 'http://vault:8200',
  token: process.env.VAULT_TOKEN
});

async function getSecret(path) {
  const result = await vault.read(path);
  return result.data;
}
```

**Environment Variables** (minimum):
```bash
# On server, set via environment
export DATABASE_URL="..."
export JWT_SECRET="$(openssl rand -hex 64)"
export JWT_REFRESH_SECRET="$(openssl rand -hex 64)"
```

---

## 🛡️ Security Best Practices

### Generate Strong Secrets

```bash
# Generate secure random JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 64
```

### Update Secrets Regularly

Rotate secrets periodically:
- JWT secrets: Every 90 days
- Database passwords: Every 90 days
- API keys: Every 90 days

### HTTPS Only in Production

Update cookie configuration for production:

```typescript
// src/config/jwt.ts
export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // ✅ Already configured
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
```

Deploy behind HTTPS:
- Use Let's Encrypt for free SSL certificates
- Configure reverse proxy (nginx, Caddy)
- Or use cloud load balancer (AWS ALB, etc.)

### CORS Configuration

Update for production:

```env
# Production .env
CORS_ORIGIN="https://yourdomain.com"
# Or multiple origins
CORS_ORIGIN="https://yourdomain.com,https://app.yourdomain.com"
```

For multiple origins:

```typescript
// src/config/cors.ts
const allowedOrigins = config.cors.origin.split(',');

export const corsConfig = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});
```

### Database Security

#### Use Connection Pooling

```typescript
// src/config/database.ts
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Add connection pooling
  __internal: {
    engine: {
      connection_limit: 10,
    },
  },
});
```

#### Use Read Replicas

For high traffic:
- Write to primary database
- Read from replicas
- Configure Prisma with multiple datasources

#### Enable SSL for Database

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### Input Validation

All inputs are validated with Zod:

```typescript
// Always validate untrusted input
const userInput = registerSchema.parse(req.body);
```

**Never**:
- Trust user input
- Concatenate SQL queries (use Prisma's query builder)
- Use `eval()` or `Function()` with user input
- Return detailed error messages in production

### Error Handling

Production error responses:

```typescript
// src/middleware/error.ts
res.status(500).json({
  error: 'Internal server error',
  // Only show details in development
  message: process.env.NODE_ENV === 'development' ? err.message : undefined,
});
```

**Never expose**:
- Stack traces in production
- Database errors to users
- Internal file paths
- Dependency versions

### Logging

Implement secure logging:

```typescript
// Don't log sensitive data
logger.info('User login', {
  userId: user.id,
  // ❌ Don't log: password, tokens, email
});

// Use structured logging (pino, winston)
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['password', 'token', 'secret'], // Auto-redact sensitive fields
});
```

### Dependency Security

Regularly update dependencies:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Or use automated tools
npm install -g npm-check-updates
ncu -u
npm install
```

---

## 🎯 Pre-Production Security Checklist

- [ ] Rotate all secrets (database, JWT, API keys)
- [ ] Generate strong random JWT secrets (64+ bytes)
- [ ] Enable HTTPS and set `secure: true` for cookies
- [ ] Update `CORS_ORIGIN` to your frontend domain
- [ ] Set `NODE_ENV=production`
- [ ] Review and adjust rate limits for your use case
- [ ] Enable database SSL connections
- [ ] Set up secrets manager (AWS Secrets Manager, Vault, etc.)
- [ ] Configure database connection pooling
- [ ] Set up monitoring and alerting (Sentry, DataDog, etc.)
- [ ] Enable structured logging with log rotation
- [ ] Review error messages (no sensitive data exposure)
- [ ] Run security audit: `npm audit`
- [ ] Test authentication flows end-to-end
- [ ] Test authorization (try accessing admin endpoints as user)
- [ ] Test rate limiting (verify it works)
- [ ] Review database permissions (principle of least privilege)
- [ ] Set up database backups
- [ ] Document incident response procedures
- [ ] Enable 2FA for admin accounts (future enhancement)
- [ ] Set up WAF (Web Application Firewall) if needed

---

## 🚫 Common Security Mistakes to Avoid

### 1. Committing Secrets
❌ **Never**:
```bash
git add .env
git commit -m "Add config"
```

✅ **Always**:
- Keep `.env` in `.gitignore`
- Use `.env.example` for documentation
- Use secrets manager in production

### 2. Weak JWT Secrets
❌ **Never**:
```env
JWT_SECRET="secret123"
```

✅ **Always**:
```bash
JWT_SECRET="$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"
```

### 3. Exposing Error Details
❌ **Never**:
```javascript
res.status(500).json({ error: error.stack });
```

✅ **Always**:
```javascript
res.status(500).json({
  error: 'Internal server error',
  ...(process.env.NODE_ENV === 'development' && { details: error.message })
});
```

### 4. No Rate Limiting
❌ **Never** leave endpoints without rate limiting

✅ **Always** protect all public endpoints

### 5. Storing Passwords in Plain Text
❌ **Never** store passwords unhashed

✅ **Always** use bcrypt (or better)

### 6. Not Validating Input
❌ **Never** trust user input

✅ **Always** validate with schemas (Zod, Joi)

### 7. Missing HTTPS
❌ **Never** run production without HTTPS

✅ **Always** use SSL/TLS certificates

---

## 📊 Monitoring & Incident Response

### Logging What Matters

**Do log**:
- Authentication attempts (success/failure)
- Authorization failures
- Rate limit violations
- Password changes
- Role changes
- Suspicious patterns

**Don't log**:
- Passwords
- Tokens (access or refresh)
- Full credit card numbers
- Social security numbers
- Personal identifiable information (PII)

### Set Up Alerts

Alert on:
- Multiple failed login attempts from same IP
- Unusual number of 401/403 responses
- Rate limit violations
- Sudden traffic spikes
- Database connection errors
- Application errors (500s)

### Incident Response Plan

1. **Detect**: Monitor logs and alerts
2. **Identify**: Determine scope of breach
3. **Contain**: Block attacker, revoke tokens
4. **Eradicate**: Fix vulnerability
5. **Recover**: Restore normal operations
6. **Learn**: Post-mortem analysis

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT.io Best Practices](https://jwt.io/introduction)

---

## 🐛 Reporting Security Vulnerabilities

If you discover a security vulnerability:

1. **Do NOT** open a public issue
2. Email security concerns to: [your-security-email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours.

---

**Remember**: Security is not a one-time setup. It requires continuous monitoring, updates, and vigilance. Stay informed about new vulnerabilities and keep your dependencies up to date.
