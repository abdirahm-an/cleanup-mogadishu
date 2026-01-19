import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const flagSchema = z.object({
  reason: z.enum(['spam', 'inappropriate', 'misleading', 'other']),
  comment: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to flag content' },
        { status: 401 }
      )
    }

    const postId = (await params).id
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Verify post exists
    const post = await db.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Get user
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const validation = flagSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { reason, comment } = validation.data

    // Check if user has already flagged this post
    const existingFlag = await db.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM flags WHERE postId = ${postId} AND userId = ${user.id}
    `

    if (existingFlag.length > 0) {
      return NextResponse.json(
        { error: 'You have already flagged this post' },
        { status: 409 }
      )
    }

    // Create flag using raw SQL since Prisma client might not be updated
    const flagId = `flag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await db.$executeRaw`
      INSERT INTO flags (id, postId, userId, reason, comment, createdAt, updatedAt)
      VALUES (${flagId}, ${postId}, ${user.id}, ${reason}, ${comment || null}, datetime('now'), datetime('now'))
    `

    return NextResponse.json(
      { message: 'Content flagged successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error flagging post:', error)
    
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'You have already flagged this post' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}