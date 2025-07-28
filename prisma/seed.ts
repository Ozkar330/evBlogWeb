import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@evblog.dev' },
    update: {},
    create: {
      email: 'admin@evblog.dev',
      name: 'Admin User',
      role: Role.ADMIN,
      bio: 'System administrator with full access to all features.',
      avatarUrl: null,
      emailVerified: new Date(),
    },
  })

  // Create author user
  const authorUser = await prisma.user.upsert({
    where: { email: 'author@evblog.dev' },
    update: {},
    create: {
      email: 'author@evblog.dev',
      name: 'John Doe',
      role: Role.AUTHOR,
      bio: 'Content creator and technical writer passionate about web development.',
      avatarUrl: null,
      emailVerified: new Date(),
    },
  })

  // Create reader user
  const readerUser = await prisma.user.upsert({
    where: { email: 'reader@evblog.dev' },
    update: {},
    create: {
      email: 'reader@evblog.dev',
      name: 'Jane Smith',
      role: Role.READER,
      bio: 'Technology enthusiast and avid reader.',
      avatarUrl: null,
      emailVerified: new Date(),
    },
  })

  // Create a sample blog post for the author (prepared for future waves)
  const samplePost = await prisma.post.upsert({
    where: { slug: 'welcome-to-evblog' },
    update: {},
    create: {
      title: 'Welcome to EVBlog',
      slug: 'welcome-to-evblog',
      excerpt: 'A modern blog platform built with Next.js 14, TypeScript, and Tailwind CSS.',
      content: `# Welcome to EVBlog

This is a sample blog post to demonstrate the blog functionality. EVBlog is built with modern web technologies:

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Prisma** for database management
- **NextAuth.js** for authentication

## Getting Started

This blog supports multiple user roles:

- **Readers** can browse and read blog posts
- **Authors** can create and manage their own content
- **Admins** have full access to all features

Stay tuned for more exciting content!`,
      published: true,
      authorId: authorUser.id,
    },
  })

  // Create a sample comment
  await prisma.comment.upsert({
    where: { id: 'sample-comment-id' },
    update: {},
    create: {
      id: 'sample-comment-id',
      content: 'Great introduction! Looking forward to more posts about web development.',
      postId: samplePost.id,
      authorId: readerUser.id,
    },
  })

  console.log('Database seed completed successfully!')
  console.log('Created users:')
  console.log('- Admin:', adminUser.email)
  console.log('- Author:', authorUser.email)
  console.log('- Reader:', readerUser.email)
  console.log('- Sample post:', samplePost.title)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })