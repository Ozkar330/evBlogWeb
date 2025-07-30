import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthErrorBoundary } from './auth-error-boundary'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  footer?: React.ReactNode
  className?: string
}

export function AuthLayout({ 
  children, 
  title, 
  description, 
  footer, 
  className 
}: AuthLayoutProps) {
  return (
    <AuthErrorBoundary>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Pattern for Desktop */}
        <div className="absolute inset-0 hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
        
        <Card className={cn(
          'w-full max-w-sm sm:max-w-md',
          'relative z-10',
          'shadow-xl border-0 bg-white/95 backdrop-blur-sm',
          'animate-in fade-in-50 slide-in-from-bottom-5 duration-300',
          className
        )}>
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-900">
              {title}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-sm sm:text-base">
              {description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 sm:space-y-6">
            {children}
          </CardContent>
          
          {footer && (
            <CardFooter className="flex flex-col space-y-3 pt-4">
              {footer}
            </CardFooter>
          )}
        </Card>
        
        {/* Mobile-specific enhancements */}
        <style jsx global>{`
          @media (max-width: 640px) {
            /* Ensure proper viewport height on mobile */
            .min-h-screen {
              min-height: 100vh;
              min-height: 100dvh; /* Dynamic viewport height for modern browsers */
            }
            
            /* Improve touch targets */
            button, a {
              min-height: 44px;
            }
            
            /* Better focus indicators for mobile */
            input:focus,
            button:focus,
            a:focus {
              outline: 2px solid #3b82f6;
              outline-offset: 2px;
            }
          }
          
          /* Reduce motion for users who prefer it */
          @media (prefers-reduced-motion: reduce) {
            .animate-in {
              animation: none;
            }
          }
        `}</style>
      </div>
    </AuthErrorBoundary>
  )
}

interface AuthLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function AuthLink({ href, children, className }: AuthLinkProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        'text-primary hover:underline focus:underline',
        'inline-block min-h-[44px] flex items-center', // Better touch target
        'transition-colors duration-200',
        className
      )}
    >
      {children}
    </Link>
  )
}

interface AuthFooterProps {
  primaryAction?: {
    href: string
    text: string
  }
  secondaryAction?: {
    href: string
    text: string
  }
  tertiaryText?: string
  className?: string
}

export function AuthFooter({ 
  primaryAction, 
  secondaryAction, 
  tertiaryText, 
  className 
}: AuthFooterProps) {
  return (
    <div className={cn('flex flex-col space-y-3 text-center', className)}>
      {primaryAction && (
        <div className="text-sm">
          <AuthLink href={primaryAction.href}>
            {primaryAction.text}
          </AuthLink>
        </div>
      )}
      
      {secondaryAction && (
        <div className="text-sm">
          <AuthLink href={secondaryAction.href}>
            {secondaryAction.text}
          </AuthLink>
        </div>
      )}
      
      {tertiaryText && (
        <div className="text-xs text-gray-500">
          {tertiaryText}
        </div>
      )}
    </div>
  )
}