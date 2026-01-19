import { PrismaClient } from './generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

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
    const pool = new Pool({ 
      connectionString,
      ssl: { rejectUnauthorized: false } // Required for Neon
    })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    throw error
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
