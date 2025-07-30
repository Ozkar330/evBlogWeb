import { forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  required?: boolean
  children?: React.ReactNode
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, required, className, children, ...props }, ref) => {
    const fieldId = props.id || props.name
    const errorId = error ? `${fieldId}-error` : undefined
    const helperId = helperText ? `${fieldId}-helper` : undefined
    
    const describedBy = [errorId, helperId, props['aria-describedby']]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId} className="text-sm font-medium">
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </Label>
        
        <div className="relative">
          <Input
            ref={ref}
            {...props}
            id={fieldId}
            className={cn(
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            aria-describedby={describedBy}
            aria-invalid={error ? 'true' : 'false'}
            required={required}
          />
          {children}
        </div>
        
        {error && (
          <p 
            id={errorId} 
            className="text-sm text-red-600" 
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id={helperId} 
            className="text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'