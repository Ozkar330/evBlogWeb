'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved
          to a different location.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="rounded-md border border-border px-4 py-2 transition-colors hover:bg-muted"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
