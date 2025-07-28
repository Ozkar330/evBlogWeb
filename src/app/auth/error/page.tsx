'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'

const errorMessages = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support.',
    action: 'Contact Support',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in. Please contact an administrator if you believe this is an error.',
    action: 'Go Back',
  },
  Verification: {
    title: 'Email Verification Required',
    description: 'Please check your email and click the verification link before signing in.',
    action: 'Try Again',
  },
  OAuthSignin: {
    title: 'OAuth Sign In Error',
    description: 'There was an error signing in with your OAuth provider. Please try again.',
    action: 'Try Again',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'There was an error processing the OAuth callback. Please try signing in again.',
    action: 'Try Again',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Error',
    description: 'Could not create an account with the OAuth provider. The email might already be in use.',
    action: 'Try Again',
  },
  EmailCreateAccount: {
    title: 'Email Account Error',
    description: 'Could not create an account with this email. The email might already be in use.',
    action: 'Try Again',
  },
  Callback: {
    title: 'Callback Error',
    description: 'There was an error in the authentication callback. Please try signing in again.',
    action: 'Try Again',
  },
  OAuthAccountNotLinked: {
    title: 'Account Not Linked',
    description: 'This email is already associated with another account. Please sign in with your original method or link your accounts.',
    action: 'Try Again',
  },
  EmailSignin: {
    title: 'Email Sign In Error',
    description: 'The sign in link is no longer valid. It may have been used already or it may have expired.',
    action: 'Request New Link',
  },
  CredentialsSignin: {
    title: 'Invalid Credentials',
    description: 'The email or password you entered is incorrect. Please check your credentials and try again.',
    action: 'Try Again',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You must be signed in to view this page.',
    action: 'Sign In',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication. Please try again.',
    action: 'Try Again',
  },
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'
  
  const errorInfo = errorMessages[error as keyof typeof errorMessages] || errorMessages.Default

  const handleRetry = () => {
    // Clear any cached auth state and redirect to signin
    window.location.href = '/auth/signin'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 mt-4">
            {errorInfo.title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error code: {error}
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <div className="flex space-x-3 w-full">
            {error === 'CredentialsSignin' || error === 'OAuthSignin' || error === 'OAuthCallback' ? (
              <Button onClick={handleRetry} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                {errorInfo.action}
              </Button>
            ) : error === 'SessionRequired' ? (
              <Button asChild className="flex-1">
                <Link href="/auth/signin">
                  Sign In
                </Link>
              </Button>
            ) : error === 'EmailSignin' ? (
              <Button asChild className="flex-1">
                <Link href="/auth/signin">
                  Request New Link
                </Link>
              </Button>
            ) : error === 'AccessDenied' ? (
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            ) : (
              <Button onClick={handleRetry} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                {errorInfo.action}
              </Button>
            )}
          </div>
          
          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Return to homepage
            </Link>
          </div>
          
          {(error === 'Configuration' || error === 'AccessDenied') && (
            <div className="text-center">
              <a
                href="/contact"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Contact support
              </a>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}