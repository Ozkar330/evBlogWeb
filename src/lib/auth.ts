import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { Role } from '@prisma/client'
import { loginSchema, verifyPassword } from './auth-utils'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // adapter: PrismaAdapter(prisma), // Temporarily disabled due to type compatibility issues
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: Role.READER, // Will be overridden by signIn callback
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: Role.READER, // Will be overridden by signIn callback
        }
      },
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const { email, password } = loginSchema.parse(credentials)

          // Find user with accounts (to check if they have OAuth)
          const user = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true },
          })

          if (!user) {
            throw new Error('No user found with this email')
          }

          // Check if user has OAuth accounts (GitHub/Google)
          const hasOAuthAccount = user.accounts.length > 0
          
          if (hasOAuthAccount) {
            throw new Error('Please sign in with your connected account (GitHub or Google)')
          }

          // Check if user has a password (email/password account)
          if (!user.password) {
            throw new Error('This account was created with a social provider. Please use the social sign-in option.')
          }

          // Verify password
          const isValidPassword = await verifyPassword(password, user.password)
          if (!isValidPassword) {
            throw new Error('Invalid password')
          }

          // Check email verification
          if (!user.emailVerified) {
            throw new Error('Please verify your email before signing in')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatarUrl,
            role: user.role,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'github' || account?.provider === 'google') {
        try {
          // Check if user already exists
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true }
          })

          if (!existingUser) {
            // Create new user
            existingUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || '',
                avatarUrl: user.image,
                role: Role.READER, // Default role for new users
                emailVerified: new Date(), // OAuth users are considered verified
              },
              include: { accounts: true }
            })
          } else {
            // Update user info if needed
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name || existingUser.name,
                avatarUrl: user.image || existingUser.avatarUrl,
                emailVerified: existingUser.emailVerified || new Date(),
              },
            })
          }

          // Check if account connection already exists
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              }
            }
          })

          if (!existingAccount) {
            // Create account connection
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              }
            })
          }

          // Set user role in the user object for JWT
          user.role = existingUser.role
          user.id = existingUser.id

          return true
        } catch (error) {
          console.error('Sign in error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.role = user.role
        token.id = user.id
      }

      // Update session if triggered
      if (trigger === 'update' && session) {
        token.role = session.role
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnAuth = nextUrl.pathname.startsWith('/auth')

      // Redirect logged-in users away from auth pages
      if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      // Protect dashboard routes
      if (isOnDashboard) {
        if (!isLoggedIn) return false
        const userRole = auth.user.role as Role
        return userRole === Role.AUTHOR || userRole === Role.ADMIN
      }

      // Protect admin routes
      if (isOnAdmin) {
        if (!isLoggedIn) return false
        const userRole = auth.user.role as Role
        return userRole === Role.ADMIN
      }

      return true
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  // Security configuration
  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
})