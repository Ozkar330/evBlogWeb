# Authentication System Documentation

## Overview

This document describes the comprehensive NextAuth.js v5 authentication system implemented for the EVBlog application, featuring multi-provider support, enterprise-grade security, and role-based access control.

## Architecture

### Core Components

1. **NextAuth.js v5** - Modern authentication library with App Router support
2. **Prisma ORM** - Database integration with PostgreSQL
3. **Multi-Provider Support** - GitHub OAuth, Google OAuth, Email/Password
4. **Role-Based Access Control** - READER, AUTHOR, ADMIN roles
5. **Security Middleware** - CSRF protection, rate limiting, secure headers

## Authentication Providers

### 1. GitHub OAuth

**Configuration**: `src/lib/auth.ts`
- **Provider**: GitHub OAuth App
- **Scope**: User profile and email
- **Callback**: `/api/auth/callback/github`
- **Default Role**: READER

### 2. Google OAuth

**Configuration**: `src/lib/auth.ts`
- **Provider**: Google Cloud Console OAuth
- **Scope**: Profile and email
- **Callback**: `/api/auth/callback/google`
- **Default Role**: READER

### 3. Email/Password Authentication

**Features**:
- Password hashing with bcryptjs (12 salt rounds)
- Email verification required
- Strong password validation
- Rate limiting protection

## Database Schema

### User Model

```prisma
model User {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email         String   @unique
  name          String
  avatarUrl     String?  @map("avatar_url")
  bio           String?
  password      String?  // For email/password authentication
  role          Role     @default(READER)
  emailVerified DateTime? @map("email_verified")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relations
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  comments      Comment[]

  @@map("users")
}
```

### Account Model (OAuth)

```prisma
model Account {
  id                String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId            String  @map("user_id") @db.Uuid
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}
```

## Security Features

### 1. Enterprise-Grade Security

**Password Security**:
- Minimum 8 characters
- Must contain: uppercase, lowercase, number, special character
- bcryptjs with 12 salt rounds

**Session Security**:
- JWT strategy with 30-day expiration
- 24-hour update interval
- Secure HTTP-only cookies
- CSRF protection built-in

### 2. Rate Limiting

**Implementation**: `src/lib/auth-utils.ts`
- **Signup**: 3 attempts per 15 minutes per IP
- **Login**: Built-in NextAuth.js protection
- **In-memory store**: Production should use Redis

### 3. Security Headers

**Middleware**: `src/middleware.ts`
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Content Security Policy
- Referrer-Policy: strict-origin-when-cross-origin

### 4. Route Protection

**Protected Routes**:
- `/dashboard/*` - AUTHOR or ADMIN only
- `/admin/*` - ADMIN only
- `/auth/*` - Redirect authenticated users

## Role-Based Access Control

### Role Hierarchy

```typescript
enum Role {
  READER  // Basic read access
  AUTHOR  // Can create and manage own content
  ADMIN   // Full system access
}
```

### Permission Matrix

| Route Pattern | READER | AUTHOR | ADMIN |
|---------------|--------|--------|-------|
| `/` | ✅ | ✅ | ✅ |
| `/blog/*` | ✅ | ✅ | ✅ |
| `/dashboard/*` | ❌ | ✅ | ✅ |
| `/admin/*` | ❌ | ❌ | ✅ |

## Authentication Pages

### 1. Sign In (`/auth/signin`)

**Features**:
- OAuth provider buttons (GitHub, Google)
- Email/password form with validation
- Password visibility toggle
- Error handling with user-friendly messages
- Responsive design

### 2. Sign Up (`/auth/signup`)

**Features**:
- OAuth provider registration
- Email/password registration with strong validation
- Email verification workflow
- Terms of service and privacy policy links
- Success state with email verification prompt

### 3. Error Page (`/auth/error`)

**Error Types Handled**:
- Configuration errors
- Access denied
- OAuth-specific errors
- Email verification errors
- Credential errors

## API Endpoints

### 1. NextAuth.js Routes (`/api/auth/[...nextauth]`)

**Endpoints**:
- `GET/POST /api/auth/signin` - Sign in
- `GET/POST /api/auth/signout` - Sign out
- `GET /api/auth/callback/[provider]` - OAuth callbacks
- `GET /api/auth/session` - Get session
- `GET /api/auth/csrf` - CSRF token

### 2. Custom Authentication APIs

**Sign Up**: `POST /api/auth/signup`
```typescript
{
  name: string
  email: string
  password: string
}
```

**Email Verification**: `GET /api/auth/verify-email?token=...`
- Verifies email address
- Marks account as verified
- Redirects to sign in

## Utility Functions

### Password Management

```typescript
// Hash password
const hashedPassword = await hashPassword(plainPassword)

// Verify password
const isValid = await verifyPassword(plainPassword, hashedPassword)
```

### User Creation

```typescript
const user = await createUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123!',
  role: Role.READER
})
```

### Email Verification

```typescript
// Generate verification token
const token = await generateVerificationToken(userId)

// Verify email with token
const userId = await verifyEmailToken(token)
```

## Environment Variables

```env
# NextAuth.js Configuration
NEXTAUTH_SECRET="your-secure-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Database
DATABASE_URL="postgresql://..."
```

## Error Handling

### Authentication Errors

**Common Errors**:
- `CredentialsSignin` - Invalid email/password
- `OAuthAccountNotLinked` - Email already exists with different provider
- `EmailNotVerified` - Account needs email verification
- `AccessDenied` - Insufficient permissions

### Error Recovery

1. **Invalid Credentials**: Clear form, show error message
2. **Email Verification**: Provide verification instructions
3. **OAuth Errors**: Retry mechanism with clear messaging
4. **Rate Limiting**: Show timeout and retry time

## Testing

### Manual Testing Checklist

**OAuth Flow**:
- [ ] GitHub sign in/sign up
- [ ] Google sign in/sign up
- [ ] Account linking prevention
- [ ] Profile data sync

**Email/Password Flow**:
- [ ] User registration
- [ ] Email verification
- [ ] Password validation
- [ ] Sign in with verified account

**Security Testing**:
- [ ] Rate limiting enforcement
- [ ] Route protection
- [ ] Role-based access
- [ ] CSRF protection

## Production Deployment

### Security Checklist

- [ ] Use strong NEXTAUTH_SECRET (32+ characters)
- [ ] Enable HTTPS (secure cookies)
- [ ] Configure production OAuth redirects
- [ ] Set up email service for verification
- [ ] Implement Redis for rate limiting
- [ ] Enable security headers
- [ ] Monitor authentication logs

### Performance Optimization

- [ ] Database connection pooling
- [ ] Session storage optimization
- [ ] Rate limiting with external store
- [ ] CDN for static assets
- [ ] Caching strategies

## Troubleshooting

### Common Issues

**Database Connection**:
- Check DATABASE_URL format
- Verify Supabase connection pooling
- Ensure Prisma client generation

**OAuth Configuration**:
- Verify client IDs and secrets
- Check callback URLs
- Confirm OAuth app settings

**Email Verification**:
- Check token generation
- Verify email service configuration
- Confirm verification flow

## Future Enhancements

### Planned Features

1. **Email Service Integration** - SendGrid/Resend for email verification
2. **Two-Factor Authentication** - TOTP support
3. **Social Login Expansion** - Twitter, LinkedIn, Discord
4. **Advanced Rate Limiting** - Redis-based with sliding windows
5. **Audit Logging** - Authentication event tracking
6. **Password Reset** - Secure password recovery flow

### Security Enhancements

1. **Session Management** - Device tracking and management
2. **Suspicious Activity Detection** - Login anomaly detection
3. **Account Lockout** - Temporary account disabling
4. **Advanced CSRF Protection** - Double-submit cookies
5. **Content Security Policy** - Stricter CSP rules

---

## Quick Reference

### Key Files

- `src/lib/auth.ts` - NextAuth.js configuration
- `src/lib/auth-utils.ts` - Authentication utilities
- `src/middleware.ts` - Route protection and security
- `prisma/schema.prisma` - Database schema
- `src/app/auth/*/page.tsx` - Authentication pages

### Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Run database validation
npx tsx scripts/validate-db.ts

# Type checking
npm run type-check

# Linting
npm run lint
```