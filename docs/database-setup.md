# Database Setup Documentation

## Overview

This project uses Prisma ORM with PostgreSQL database for Wave 1 implementation following the specifications in `wave1.md`.

## Database Schema

### Core Authentication Models

#### User Model
- **Purpose**: Stores user account information and authentication data
- **Key Features**: 
  - UUID primary key with PostgreSQL `gen_random_uuid()`
  - Role-based access control (READER, AUTHOR, ADMIN)
  - Email verification support
  - Profile information (name, bio, avatar)

#### Account Model
- **Purpose**: OAuth provider account linking for NextAuth.js
- **Key Features**:
  - Supports multiple OAuth providers (GitHub, Google)
  - Secure token storage
  - Cascading delete with user

#### Session Model
- **Purpose**: User session management
- **Key Features**:
  - JWT session tokens
  - Automatic expiration
  - User relationship

#### VerificationToken Model
- **Purpose**: Email verification and password reset tokens
- **Key Features**:
  - Secure token generation
  - Expiration handling

### Future Wave Models

#### Post Model
- **Purpose**: Blog post content (Wave 2+)
- **Key Features**:
  - Rich content with excerpts
  - Published/draft states
  - SEO-friendly slugs
  - Author relationships

#### Comment Model
- **Purpose**: User comments on posts (Wave 3+)
- **Key Features**:
  - Threaded comments support
  - Moderation capabilities
  - User attribution

## Environment Setup

### Required Environment Variables

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/evblog_db?schema=public"

# NextAuth.js Configuration
NEXTAUTH_SECRET="your-secure-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Database Commands

### Development Workflow

```bash
# Generate Prisma client
npm run db:generate

# Apply schema changes to database
npm run db:push

# Create and apply migrations
npm run db:migrate

# Open Prisma Studio (database browser)
npm run db:studio

# Seed development data
npm run db:seed

# Validate database setup
npm run tsx scripts/validate-db.ts
```

### Migration Commands

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Seed Data

The seed script creates:
- Admin user (`admin@evblog.dev`) with ADMIN role
- Author user (`author@evblog.dev`) with AUTHOR role  
- Reader user (`reader@evblog.dev`) with READER role
- Sample blog post with comment

## Security Considerations

### Data Protection
- All passwords hashed with NextAuth.js providers
- OAuth tokens encrypted in database
- UUID primary keys prevent enumeration attacks
- Cascading deletes maintain referential integrity

### Role-Based Access Control
- **READER**: Can view published content
- **AUTHOR**: Can create and manage own content
- **ADMIN**: Full system access

### Database Security
- PostgreSQL with secure connection strings
- Environment variable protection
- No sensitive data in seed files

## Troubleshooting

### Common Issues

#### Connection Errors
```bash
# Check database connectivity
npx prisma db pull

# Verify environment variables
echo $DATABASE_URL
```

#### Migration Issues
```bash
# Check migration status
npx prisma migrate status

# Resolve migration conflicts
npx prisma migrate resolve --rolled-back migration_name
```

#### Schema Sync Issues
```bash
# Force schema sync (development only)
npx prisma db push --force-reset
```

### Validation Scripts

Run database validation:
```bash
npm run tsx scripts/validate-db.ts
```

This will verify:
- Database connectivity
- Table accessibility
- Data integrity
- Relationship constraints

## Performance Considerations

### Indexes
- Unique indexes on email fields
- Composite indexes on provider + providerAccountId
- Session token index for fast lookups

### Query Optimization
- Use `select` for partial data loading
- Include relationships strategically
- Implement pagination for large datasets

## Future Enhancements

### Wave 2 Additions
- Category model for post organization
- Tag system for content discovery
- Media upload support

### Wave 3+ Additions
- Full-text search indexes
- Analytics and metrics tables
- Content versioning system
- Advanced user permissions

## Monitoring

### Health Checks
- Database connection monitoring
- Query performance tracking
- Storage usage alerts

### Maintenance
- Regular backup procedures
- Migration rollback plans
- Performance optimization reviews