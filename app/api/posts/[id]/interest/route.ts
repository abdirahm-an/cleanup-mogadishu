import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/posts/[id]/interest - Get interested users for a post (for post author only)
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: postId } = await params;

    // Verify that the user is the post author
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get interested users with their contact info (respecting consent)
    const interests = await (db as any).postInterest.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const users = interests.map((interest: any) => ({
      id: interest.user.id,
      name: interest.user.name,
      email: interest.user.email,
      phone: interest.user.phone,
      shareContactInfo: interest.shareContactInfo,
      createdAt: interest.createdAt.toISOString()
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching interested users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/posts/[id]/interest - Express interest in a post
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: postId } = await params;
    const body = await request.json();
    const { shareContactInfo = false } = body;

    // Check if post exists and is published
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { 
        id: true, 
        status: true, 
        authorId: true 
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.status !== 'PUBLISHED') {
      return NextResponse.json({ 
        error: 'Cannot express interest in unpublished posts' 
      }, { status: 400 });
    }

    // Don't allow authors to express interest in their own posts
    if (post.authorId === session.user.id) {
      return NextResponse.json({ 
        error: 'Cannot express interest in your own post' 
      }, { status: 400 });
    }

    // Create or update interest
    const interest = await (db as any).postInterest.upsert({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId
        }
      },
      create: {
        userId: session.user.id,
        postId: postId,
        shareContactInfo: shareContactInfo
      },
      update: {
        shareContactInfo: shareContactInfo,
        updatedAt: new Date()
      }
    });

    // Get updated count
    const interestCount = await (db as any).postInterest.count({
      where: { postId }
    });

    return NextResponse.json({ 
      success: true, 
      interestCount,
      shareContactInfo: interest.shareContactInfo
    });
  } catch (error) {
    console.error('Error expressing interest:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id]/interest - Remove interest from a post
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: postId } = await params;

    // Delete the interest record
    const deleted = await (db as any).postInterest.deleteMany({
      where: {
        userId: session.user.id,
        postId: postId
      }
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Interest not found' }, { status: 404 });
    }

    // Get updated count
    const interestCount = await (db as any).postInterest.count({
      where: { postId }
    });

    return NextResponse.json({ 
      success: true, 
      interestCount
    });
  } catch (error) {
    console.error('Error removing interest:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}