'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { passwordResetSchema } from '@/lib/auth-utils'
import { z } from 'zod'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setFieldError('')

    try {
      // Validate email
      const validatedData = passwordResetSchema.parse({ email })

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reset email')
      }

      setSuccess(true)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const emailError = error.errors.find(err => err.path[0] === 'email')
        if (emailError) {
          setFieldError(emailError.message)
        }
      } else {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 mt-4">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-600">
              We&apos;ve sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                If you don&apos;t see the email in your inbox, please check your spam folder. 
                The reset link will expire in 1 hour for security reasons.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                Back to Sign In
              </Link>
            </Button>
            <div className="text-center text-sm">
              <button
                onClick={() => {
                  setSuccess(false)
                  setEmail('')
                }}
                className="text-primary hover:underline"
              >
                Try a different email
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldError ? 'border-red-500' : ''}
                disabled={isLoading}
                aria-describedby={fieldError ? "email-error" : undefined}
              />
              {fieldError && (
                <p id="email-error" className="text-sm text-red-500" role="alert">
                  {fieldError}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center">
            <Link 
              href="/auth/signin" 
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to Sign In
            </Link>
          </div>
          <div className="text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in instead
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}