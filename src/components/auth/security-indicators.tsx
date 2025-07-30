'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface SecurityIndicatorsProps {
  className?: string
}

export function SecurityIndicators({ className }: SecurityIndicatorsProps) {
  const [securityChecks, setSecurityChecks] = useState({
    httpsEnabled: false,
    cspEnabled: false,
    secureConnection: false,
    biometricAvailable: false,
  })

  useEffect(() => {
    // Check HTTPS
    const httpsEnabled = window.location.protocol === 'https:'
    
    // Check for secure connection indicators
    const connection = (navigator as any).connection
    const secureConnection = httpsEnabled && (!connection || connection.effectiveType !== 'slow-2g')
    
    // Check if biometric authentication is available
    const biometricAvailable = 'credentials' in navigator && 'webauthn' in window
    
    // Check for CSP (simplified check)
    const cspEnabled = document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null

    setSecurityChecks({
      httpsEnabled,
      cspEnabled,
      secureConnection,
      biometricAvailable,
    })
  }, [])

  const getSecurityLevel = () => {
    const score = Object.values(securityChecks).filter(Boolean).length
    if (score >= 3) return 'high'
    if (score >= 2) return 'medium'
    return 'low'
  }

  const securityLevel = getSecurityLevel()

  return (
    <div className={className}>
      <Alert className={`border-l-4 ${
        securityLevel === 'high' ? 'border-l-green-500 bg-green-50' :
        securityLevel === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
        'border-l-red-500 bg-red-50'
      }`}>
        <Shield className={`h-4 w-4 ${
          securityLevel === 'high' ? 'text-green-600' :
          securityLevel === 'medium' ? 'text-yellow-600' :
          'text-red-600'
        }`} />
        <AlertDescription className="text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              Security Level: {securityLevel.charAt(0).toUpperCase() + securityLevel.slice(1)}
            </span>
            <div className="flex space-x-2">
              {securityChecks.httpsEnabled && (
                <CheckCircle className="h-4 w-4 text-green-600" aria-label="HTTPS Enabled" />
              )}
              {securityChecks.secureConnection && (
                <CheckCircle className="h-4 w-4 text-green-600" aria-label="Secure Connection" />
              )}
              {!securityChecks.httpsEnabled && (
                <AlertTriangle className="h-4 w-4 text-red-600" aria-label="HTTP Connection" />
              )}
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-600">
            <ul className="space-y-1">
              <li className="flex items-center">
                {securityChecks.httpsEnabled ? (
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                ) : (
                  <AlertTriangle className="h-3 w-3 text-red-600 mr-2" />
                )}
                Encrypted connection (HTTPS)
              </li>
              <li className="flex items-center">
                {securityChecks.cspEnabled ? (
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                ) : (
                  <Info className="h-3 w-3 text-gray-400 mr-2" />
                )}
                Content Security Policy
              </li>
              {securityChecks.biometricAvailable && (
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                  Biometric authentication available
                </li>
              )}
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}

interface PasswordSecurityProps {
  password: string
  showIndicator?: boolean
}

export function PasswordSecurity({ password, showIndicator = true }: PasswordSecurityProps) {
  const [isCompromised, setIsCompromised] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!password || password.length < 8) {
      setIsCompromised(false)
      return
    }

    // Simulate checking against common password databases
    // In a real app, you might use HaveIBeenPwned API or similar
    const checkPassword = async () => {
      setChecking(true)
      
      // Common weak passwords check
      const commonPasswords = [
        'password', '123456', 'password123', 'admin', 'qwerty',
        'letmein', 'welcome', 'monkey', '123456789', 'password1'
      ]
      
      const isWeak = commonPasswords.some(weak => 
        password.toLowerCase().includes(weak.toLowerCase())
      )
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setIsCompromised(isWeak)
      setChecking(false)
    }

    const timeoutId = setTimeout(checkPassword, 1000) // Debounce
    return () => clearTimeout(timeoutId)
  }, [password])

  if (!showIndicator || !password || password.length < 8) {
    return null
  }

  return (
    <div className="mt-2">
      {checking ? (
        <div className="flex items-center text-xs text-gray-500">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-300 mr-2"></div>
          Checking password security...
        </div>
      ) : isCompromised ? (
        <Alert variant="destructive" className="py-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            This password has been found in data breaches. Please choose a different password.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex items-center text-xs text-green-600">
          <CheckCircle className="h-3 w-3 mr-2" />
          Password appears secure
        </div>
      )}
    </div>
  )
}

interface RateLimitIndicatorProps {
  attempts: number
  maxAttempts: number
  resetTime?: number
}

export function RateLimitIndicator({ attempts, maxAttempts, resetTime }: RateLimitIndicatorProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    if (!resetTime) return

    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, resetTime - now)
      setTimeLeft(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [resetTime])

  const remainingAttempts = maxAttempts - attempts
  const isLimited = remainingAttempts <= 0

  if (attempts === 0) return null

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Alert variant={isLimited ? "destructive" : "default"} className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-sm">
        {isLimited ? (
          <>
            Too many failed attempts. Please try again in {formatTime(timeLeft)}.
          </>
        ) : (
          <>
            {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining.
          </>
        )}
      </AlertDescription>
    </Alert>
  )
}