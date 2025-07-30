import { NextRequest, NextResponse } from 'next/server'
import { newPasswordSchema, hashPassword, checkRateLimit } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(`reset-password:${ip}`, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many password reset attempts. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validate input
    const validatedData = newPasswordSchema.parse(body)

    // Find and validate the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: validatedData.token },
      include: { user: true },
    })

    if (!resetToken || resetToken.expires < new Date()) {
      // Clean up expired token
      if (resetToken) {
        await prisma.passwordResetToken.delete({
          where: { token: validatedData.token },
        })
      }
      
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new password reset.' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await hashPassword(validatedData.password)

    // Update user password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { 
        password: hashedPassword,
        // Optionally mark email as verified if it wasn't already
        emailVerified: resetToken.user.emailVerified || new Date(),
      },
    })

    // Clean up the used reset token
    await prisma.passwordResetToken.delete({
      where: { token: validatedData.token },
    })

    // Optional: Clean up all other sessions for this user for security
    // This would require implementing session management

    return NextResponse.json(
      { message: 'Password updated successfully. You can now sign in with your new password.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Password reset error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
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