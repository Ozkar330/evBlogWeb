import { NextRequest, NextResponse } from 'next/server'
import { signupSchema, createUser, generateVerificationToken, checkRateLimit } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimit = checkRateLimit(`signup:${ip}`, 3, 15 * 60 * 1000) // 3 attempts per 15 minutes
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many signup attempts. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validate input
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: { accounts: true }
    })

    if (existingUser) {
      // Check if user has OAuth accounts
      if (existingUser.accounts.length > 0) {
        const providers = existingUser.accounts.map(account => account.provider).join(', ')
        return NextResponse.json(
          { 
            error: `An account with this email already exists and is connected to ${providers}. Please sign in with your connected account.`
          },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 400 }
        )
      }
    }

    // Create user
    const user = await createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      emailVerified: null, // Require email verification
    })

    // Generate verification token
    const verificationToken = await generateVerificationToken(user.id)

    // In a real app, you would send an email here
    // For now, we'll just log it for development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Verification token for', user.email, ':', verificationToken)
      // eslint-disable-next-line no-console
      console.log('Verification URL:', `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`)
    }

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, user.name, verificationToken)

    return NextResponse.json(
      { 
        message: 'Account created successfully. Please check your email to verify your account.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)

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