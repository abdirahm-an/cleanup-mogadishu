import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['PUBLISHED', 'UNDER_REVIEW', 'COMPLETED', 'DRAFT', 'ARCHIVED']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = updateStatusSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const { status } = result.data;
    const postId = params.id;

    // Check if post exists and user is the author
    const post = await db.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or has moderator role
    const isAuthor = post.authorId === session.user.id;
    const isModerator = session.user.role === 'MODERATOR';
    
    if (!isAuthor && !isModerator) {
      return NextResponse.json(
        { error: 'You can only update your own posts' },
        { status: 403 }
      );
    }

    // Update the post status
    const updatedPost = await db.post.update({
      where: { id: postId },
      data: { 
        status,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        district: true,
        neighborhood: true,
      }
    });

    return NextResponse.json({
      success: true,
      post: {
        ...updatedPost,
        photos: JSON.parse(updatedPost.photos || '[]'),
      },
      message: `Post status updated to ${status.toLowerCase().replace('_', ' ')}`
    });

  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}