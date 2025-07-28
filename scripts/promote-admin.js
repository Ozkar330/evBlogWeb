const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function promoteToAdmin(email) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    })
    
    console.log(`✅ User ${email} promoted to ADMIN role`)
    console.log(`User ID: ${user.id}`)
    console.log(`Name: ${user.name}`)
    console.log(`Role: ${user.role}`)
  } catch (error) {
    if (error.code === 'P2025') {
      console.error(`❌ User with email ${email} not found`)
    } else {
      console.error('❌ Error promoting user:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Get email from command line arguments
const email = process.argv[2]

if (!email) {
  console.error('❌ Please provide an email address')
  console.log('Usage: node scripts/promote-admin.js your@email.com')
  process.exit(1)
}

promoteToAdmin(email)