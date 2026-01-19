import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().min(1, 'Description is required'),
  photos: z.array(z.string()).min(1, 'At least one photo is required'),
  districtId: z.string().min(1, 'District is required'),
  neighborhoodId: z.string().optional(),
  address: z.string().optional(),
});

export async function POST(request: NextRequest) {
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
    const result = createPostSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, photos, districtId, neighborhoodId, address } = result.data;

    // Verify district exists
    const district = await db.district.findUnique({
      where: { id: districtId }
    });
    
    if (!district) {
      return NextResponse.json(
        { error: 'Invalid district' },
        { status: 400 }
      );
    }

    // Verify neighborhood exists if provided
    if (neighborhoodId) {
      const neighborhood = await db.neighborhood.findUnique({
        where: { id: neighborhoodId, districtId }
      });
      
      if (!neighborhood) {
        return NextResponse.json(
          { error: 'Invalid neighborhood for selected district' },
          { status: 400 }
        );
      }
    }

    // Create the post
    const post = await db.post.create({
      data: {
        title,
        description: address ? `${description}\n\nLocation: ${address}` : description,
        photos: JSON.stringify(photos),
        districtId,
        neighborhoodId: neighborhoodId || null,
        authorId: session.user.id,
        status: 'PUBLISHED',
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
        ...post,
        photos: JSON.parse(post.photos || '[]'),
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const districtId = searchParams.get('district') || searchParams.get('districtId'); // Support both for compatibility
    const neighborhoodId = searchParams.get('neighborhood') || searchParams.get('neighborhoodId'); // Support both for compatibility
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const sortBy = searchParams.get('sort') || 'newest';
    
    const skip = (page - 1) * limit;

    const where: any = {};
    
    // Default to showing non-draft posts if no status specified
    if (status) {
      where.status = status;
    } else {
      where.status = { not: 'DRAFT' }; // Show all non-draft posts
    }
    
    if (districtId) {
      where.districtId = districtId;
    }
    
    if (neighborhoodId) {
      where.neighborhoodId = neighborhoodId;
    }

    // Date range filtering
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        // Add 1 day to include the entire end date
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        where.createdAt.lt = endDate;
      }
    }

    // Build orderBy clause based on sort parameter
    let orderBy: any;
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
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
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.post.count({ where })
    ]);

    const postsWithParsedPhotos = posts.map(post => ({
      ...post,
      photos: JSON.parse(post.photos || '[]'),
      interestCount: 0, // Default to 0 for now, can be implemented later when interest system is ready
    }));

    return NextResponse.json({
      success: true,
      posts: postsWithParsedPhotos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}