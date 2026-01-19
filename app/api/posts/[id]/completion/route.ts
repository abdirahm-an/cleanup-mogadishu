import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const completionSchema = z.object({
  beforePhoto: z.string().url('Before photo must be a valid URL'),
  afterPhoto: z.string().url('After photo must be a valid URL'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const result = completionSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid photo URLs', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { beforePhoto, afterPhoto } = result.data;
    const { id: postId } = await params;

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

    // Check if user is the author
    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only update your own posts' },
        { status: 403 }
      );
    }

    // Parse current photos and add completion photos
    const currentPhotos = JSON.parse(post.photos || '[]');
    const updatedPhotos = [...currentPhotos, beforePhoto, afterPhoto];

    // Update the post with completion photos and status
    const updatedPost = await db.post.update({
      where: { id: postId },
      data: { 
        photos: JSON.stringify(updatedPhotos),
        status: 'COMPLETED',
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
      beforePhoto,
      afterPhoto,
      message: 'Cleanup completed successfully!'
    });

  } catch (error) {
    console.error('Completion photos error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}