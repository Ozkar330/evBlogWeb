import { Inter } from 'next/font/google'
import { Metadata } from 'next'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'evBlog - Modern Blog Platform',
    template: '%s | evBlog',
  },
  description:
    'A modern, full-featured blog platform built with Next.js 14, TypeScript, and Tailwind CSS.',
  keywords: [
    'blog',
    'nextjs',
    'typescript',
    'tailwindcss',
    'prisma',
    'postgresql',
  ],
  authors: [{ name: 'evBlog Team' }],
  creator: 'evBlog Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://evblog.dev',
    title: 'evBlog - Modern Blog Platform',
    description:
      'A modern, full-featured blog platform built with Next.js 14, TypeScript, and Tailwind CSS.',
    siteName: 'evBlog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'evBlog - Modern Blog Platform',
    description:
      'A modern, full-featured blog platform built with Next.js 14, TypeScript, and Tailwind CSS.',
    creator: '@evblog',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
