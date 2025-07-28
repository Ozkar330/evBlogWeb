import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailToken } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/auth/error?error=Verification', request.url))
    }

    const userId = await verifyEmailToken(token)

    if (!userId) {
      return NextResponse.redirect(new URL('/auth/error?error=Verification', request.url))
    }

    // Redirect to success page
    return NextResponse.redirect(new URL('/auth/signin?message=verified', request.url))

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(new URL('/auth/error?error=Verification', request.url))
  }
}