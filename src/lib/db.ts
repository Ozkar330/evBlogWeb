import { prisma } from './prisma'
import { User, Role } from '@prisma/client'

export type { User, Role } from '@prisma/client'

export interface CreateUserData {
  email: string
  name: string
  avatarUrl?: string | null
  bio?: string | null
  role?: Role
  emailVerified?: Date | null
}

export interface UpdateUserData {
  name?: string
  avatarUrl?: string | null
  bio?: string | null
  role?: Role
}

// User operations
export const userOperations = {
  // Create a new user
  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        role: data.role || Role.READER,
        emailVerified: data.emailVerified,
      },
    })
  },

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
        sessions: true,
      },
    })
  },

  // Find user by ID
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        posts: {
          where: { published: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })
  },

  // Update user
  async update(id: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    })
  },

  // Get all users (admin only)
  async findAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    })
  },

  // Count users by role
  async countByRole(): Promise<Record<Role, number>> {
    const counts = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    })

    const result: Record<Role, number> = {
      READER: 0,
      AUTHOR: 0,
      ADMIN: 0,
    }

    counts.forEach(({ role, _count }) => {
      result[role] = _count.role
    })

    return result
  },
}

// Account operations for OAuth
export const accountOperations = {
  // Find account by provider and provider account ID
  async findByProvider(provider: string, providerAccountId: string) {
    return prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
    })
  },

  // Find all accounts for a user
  async findByUserId(userId: string) {
    return prisma.account.findMany({
      where: { userId },
    })
  },
}

// Database health check
export const dbHealth = {
  async check(): Promise<{ connected: boolean; userCount: number }> {
    try {
      const userCount = await prisma.user.count()
      return { connected: true, userCount }
    } catch (error) {
      console.error('Database health check failed:', error)
      return { connected: false, userCount: 0 }
    }
  },
}

export { prisma }