// Re-export the prisma client from the main prisma module
// This ensures all database access uses the correctly configured client with adapter
export { prisma as db } from './prisma'
