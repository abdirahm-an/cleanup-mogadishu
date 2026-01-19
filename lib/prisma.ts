import { PrismaClient } from './generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    console.warn('DATABASE_URL not set, creating mock Prisma client')
    // Return a client that will fail on actual queries but won't crash at import time
    return new PrismaClient({ 
      adapter: undefined as any // Will error on use, not on instantiation
    })
  }
  
  try {
    // Use Neon serverless driver for edge/serverless environments
    const adapter = new PrismaNeon({ connectionString })
    return new PrismaClient({ adapter })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    throw error
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
