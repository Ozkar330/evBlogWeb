'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import { newPasswordSchema } from '@/lib/auth-utils'
import { z } from 'zod'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string
    confirmPassword?: string
  }>({})

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  useEffect(() => {
    if (!token) {
      router.push('/auth/signin')
    }
  }, [token, router])

  useEffect(() => {
    const password = formData.password
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    })
  }, [formData.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setFieldErrors({})

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' })
      setIsLoading(false)
      return
    }

    try {
      // Validate password
      const validatedData = newPasswordSchema.parse({
        password: formData.password,
        token: token!,
      })

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password')
      }

      setSuccess(true)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {}
        error.errors.forEach((err) => {
          if (err.path[0] === 'password') {
            errors.password = err.message
          }
        })
        setFieldErrors(errors)
      } else {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return null // Will redirect
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
              Password Reset Successful
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your password has been updated successfully. You can now sign in with your new password.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                Continue to Sign In
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length
  const strengthLevel = strengthScore <= 2 ? 'weak' : strengthScore <= 4 ? 'medium' : 'strong'
  const strengthColor = strengthLevel === 'weak' ? 'bg-red-500' : strengthLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below to complete the reset process
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
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className={fieldErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  disabled={isLoading}
                  aria-describedby="password-requirements password-strength"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-sm text-red-500" role="alert">
                  {fieldErrors.password}
                </p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      strengthLevel === 'weak' ? 'text-red-600' : 
                      strengthLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {strengthLevel.charAt(0).toUpperCase() + strengthLevel.slice(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${strengthColor}`}
                      style={{ width: `${(strengthScore / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <div id="password-requirements" className="text-xs space-y-1">
                <p className="text-gray-600 font-medium">Password must contain:</p>
                <ul className="space-y-1 ml-2">
                  <li className={`flex items-center ${passwordStrength.length ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">{passwordStrength.length ? '✓' : '○'}</span>
                    At least 8 characters
                  </li>
                  <li className={`flex items-center ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">{passwordStrength.uppercase ? '✓' : '○'}</span>
                    One uppercase letter
                  </li>
                  <li className={`flex items-center ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">{passwordStrength.lowercase ? '✓' : '○'}</span>
                    One lowercase letter
                  </li>
                  <li className={`flex items-center ${passwordStrength.number ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">{passwordStrength.number ? '✓' : '○'}</span>
                    One number
                  </li>
                  <li className={`flex items-center ${passwordStrength.special ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">{passwordStrength.special ? '✓' : '○'}</span>
                    One special character
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={fieldErrors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                  disabled={isLoading}
                  aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p id="confirm-password-error" className="text-sm text-red-500" role="alert">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || strengthScore < 5}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <div className="text-sm text-gray-500">
            <Link href="/auth/signin" className="text-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}