import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Define protected routes
const protectedRoutes = ['/dashboard', '/admin']
const authRoutes = ['/auth/signin', '/auth/signup', '/auth/forgot-password']
const adminRoutes = ['/admin']
const authorRoutes = ['/dashboard', '/dashboard/posts', '/dashboard/settings']

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request
  const pathname = nextUrl.pathname

  // Get the session
  const session = await auth()
  const isLoggedIn = !!session?.user
  const userRole = session?.user?.role

  // Security headers
  const response = NextResponse.next()

  // CSRF protection - check for state changing operations
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    
    // For API routes, require same-origin requests
    if (pathname.startsWith('/api/')) {
      if (!origin || new URL(origin).host !== host) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    // Check for CSRF token in forms (excluding NextAuth routes)
    if (!pathname.startsWith('/api/auth/')) {
      const contentType = request.headers.get('content-type')
      if (contentType?.includes('application/x-www-form-urlencoded')) {
        // In a real app, you'd check for a CSRF token here
        // For now, we rely on NextAuth's built-in CSRF protection
      }
    }
  }

  // Rate limiting for auth endpoints
  if (pathname.startsWith('/api/auth/') || pathname.startsWith('/auth/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    // In a real app, implement rate limiting here
    // For now, we rely on the built-in rate limiting in auth-utils.ts
  }

  // Redirect logged-in users away from auth pages (except for debugging)
  if (isLoggedIn && authRoutes.some(route => pathname.startsWith(route))) {
    const callbackUrl = nextUrl.searchParams.get('callbackUrl')
    const redirectUrl = callbackUrl && callbackUrl.startsWith('/') ? callbackUrl : '/'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // Protect routes that require authentication
  if (!isLoggedIn && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/auth/signin', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin-only routes
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/auth/signin', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Author and Admin routes (dashboard)
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/auth/signin', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    if (userRole !== 'AUTHOR' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // NextJS requires unsafe-eval and unsafe-inline in dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https: wss:",
    "frame-ancestors 'none'",
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}