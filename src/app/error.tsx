'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-semibold">Something went wrong!</h2>
        <p className="max-w-md text-muted-foreground">
          An error occurred while loading this page. Please try again or contact
          support if the problem persists.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={reset}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="rounded-md border border-border px-4 py-2 transition-colors hover:bg-muted"
          >
            Go home
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 rounded-md bg-muted p-4 text-left text-sm">
            <summary className="cursor-pointer font-medium">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto">{error.message}</pre>
            {error.stack && (
              <pre className="mt-2 overflow-auto text-xs text-muted-foreground">
                {error.stack}
              </pre>
            )}
          </details>
        )}
      </div>
    </div>
  )
}
