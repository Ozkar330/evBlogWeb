import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { Role } from '@prisma/client'
import { z } from 'zod'

// Validation schemas
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const passwordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  token: z.string().min(1, 'Reset token is required'),
})

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12 // High security
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// User creation utilities
export async function createUser(data: {
  name: string
  email: string
  password?: string
  role?: Role
  emailVerified?: Date | null
  avatarUrl?: string | null
}) {
  const hashedPassword = data.password ? await hashPassword(data.password) : null

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || Role.READER,
      emailVerified: data.emailVerified,
      avatarUrl: data.avatarUrl,
    },
  })
}

// Email verification utilities
export async function generateVerificationToken(userId: string): Promise<string> {
  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await prisma.verificationToken.create({
    data: {
      identifier: userId,
      token,
      expires,
    },
  })

  return token
}

export async function verifyEmailToken(token: string): Promise<string | null> {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: { token },
  })

  if (!verificationToken || verificationToken.expires < new Date()) {
    // Clean up expired token
    if (verificationToken) {
      await prisma.verificationToken.delete({
        where: { 
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token
          }
        },
      })
    }
    return null
  }

  // Mark email as verified
  await prisma.user.update({
    where: { id: verificationToken.identifier },
    data: { emailVerified: new Date() },
  })

  // Clean up used token
  await prisma.verificationToken.delete({
    where: { 
      identifier_token: {
        identifier: verificationToken.identifier,
        token: verificationToken.token
      }
    },
  })

  return verificationToken.identifier
}

// Rate limiting utilities
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now - record.lastReset > windowMs) {
    // Reset or create new record
    rateLimitMap.set(identifier, { count: 1, lastReset: now })
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetTime: now + windowMs,
    }
  }

  if (record.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.lastReset + windowMs,
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    resetTime: record.lastReset + windowMs,
  }
}

// Security utilities
export function generateSecureToken(): string {
  return `${crypto.randomUUID()}-${Date.now().toString(36)}`
}

export function sanitizeRedirectUrl(url: string | null): string {
  if (!url) return '/dashboard'
  
  // Only allow relative URLs to prevent open redirects
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url
  }
  
  return '/dashboard'
}

// User role utilities
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy = {
    [Role.READER]: 0,
    [Role.AUTHOR]: 1,
    [Role.ADMIN]: 2,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function canAccessAdmin(userRole: Role): boolean {
  return userRole === Role.ADMIN
}

export function canAccessDashboard(userRole: Role): boolean {
  return userRole === Role.AUTHOR || userRole === Role.ADMIN
}