import { NextRequest, NextResponse } from 'next/server'
import { passwordResetSchema, checkRateLimit, generateSecureToken } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - more restrictive for password reset requests
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(`password-reset:${ip}`, 3, 60 * 60 * 1000) // 3 attempts per hour
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many password reset requests. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validate input
    const validatedData = passwordResetSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json(
        { message: 'If an account with that email exists, we\'ve sent a password reset link.' },
        { status: 200 }
      )
    }

    // Check if user has a password (OAuth-only users can't reset password)
    if (!user.password) {
      return NextResponse.json(
        { message: 'If an account with that email exists, we\'ve sent a password reset link.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = generateSecureToken()
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Clean up any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expires,
      },
    })

    // In development, log the reset URL
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Password reset token for', user.email, ':', resetToken)
      // eslint-disable-next-line no-console
      console.log('Reset URL:', `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`)
    }

    // TODO: Send password reset email
    // await sendPasswordResetEmail(user.email, user.name, resetToken)

    return NextResponse.json(
      { message: 'If an account with that email exists, we\'ve sent a password reset link.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Password reset error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid email address',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}