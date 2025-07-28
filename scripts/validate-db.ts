import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function validateDatabase() {
  console.log('🔍 Validating database setup...')

  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Check if User table exists by attempting to count users
    const userCount = await prisma.user.count()
    console.log(`✅ User table accessible (${userCount} users found)`)

    // Check if Account table exists
    const accountCount = await prisma.account.count()
    console.log(`✅ Account table accessible (${accountCount} accounts found)`)

    // Check if Session table exists
    const sessionCount = await prisma.session.count()
    console.log(`✅ Session table accessible (${sessionCount} sessions found)`)

    // Check if VerificationToken table exists
    const tokenCount = await prisma.verificationToken.count()
    console.log(`✅ VerificationToken table accessible (${tokenCount} tokens found)`)

    // Check if Post table exists (for future waves)
    const postCount = await prisma.post.count()
    console.log(`✅ Post table accessible (${postCount} posts found)`)

    // Check if Comment table exists (for future waves)
    const commentCount = await prisma.comment.count()
    console.log(`✅ Comment table accessible (${commentCount} comments found)`)

    console.log('\n🎉 All database tables are accessible and working correctly!')
    console.log('\n📊 Database Summary:')
    console.log(`   Users: ${userCount}`)
    console.log(`   Accounts: ${accountCount}`)
    console.log(`   Sessions: ${sessionCount}`)
    console.log(`   Verification Tokens: ${tokenCount}`)
    console.log(`   Posts: ${postCount}`)
    console.log(`   Comments: ${commentCount}`)

  } catch (error) {
    console.error('❌ Database validation failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Database connection closed')
  }
}

validateDatabase()