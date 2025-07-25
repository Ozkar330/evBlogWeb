import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Welcome to evBlog - A modern blog platform for sharing ideas and stories.',
}

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-center text-4xl font-bold lg:text-left">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            evBlog
          </span>
        </h1>
      </div>

      <div className="before:bg-gradient-radial after:bg-gradient-conic relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:translate-y-1/2 before:rounded-full before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <div className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert">
          <div className="mb-8 text-6xl font-bold">📝</div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Authentication{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Secure user authentication with OAuth providers and email/password
            support.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Content Management{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Rich content editor with markdown support, image uploads, and draft
            management.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">
            Modern Stack{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              →
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Built with Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL for
            optimal performance.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          🚧 Under Development - Wave 1: Foundation & Authentication
        </p>
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <span className="flex items-center">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
            Next.js 14
          </span>
          <span className="flex items-center">
            <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
            TypeScript
          </span>
          <span className="flex items-center">
            <span className="mr-2 h-2 w-2 rounded-full bg-purple-500"></span>
            Tailwind CSS
          </span>
        </div>
      </div>
    </main>
  )
}
