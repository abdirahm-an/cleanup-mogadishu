import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/posts/[id]/events - Get events for a post
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id: postId } = await params;

    // Check if post exists
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { id: true }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Get events for this post using raw query
    const rawEvents = await db.$queryRaw`
      SELECT e.*, u.name as organizer_name, u.id as organizer_id
      FROM events e
      LEFT JOIN users u ON e.organizerId = u.id
      WHERE e.postId = ${postId}
      ORDER BY e.startDate ASC
    ` as any[];

    // Get attendees for each event
    const events = [];
    for (const event of rawEvents) {
      const attendees = await db.eventAttendee.findMany({
        where: { eventId: event.id },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      events.push({
        ...event,
        organizer: {
          id: event.organizer_id,
          name: event.organizer_name
        },
        attendees
      });
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/posts/[id]/events - Create a new event for a post
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: postId } = await params;
    const body = await request.json();
    const { 
      title, 
      description, 
      startDate, 
      endDate, 
      maxAttendees, 
      requiredTools 
    } = body;

    // Validate required fields
    if (!title?.trim() || !description?.trim() || !startDate) {
      return NextResponse.json({ 
        error: 'Title, description, and start date are required' 
      }, { status: 400 });
    }

    // Check if post exists and get its location
    const post = await db.post.findUnique({
      where: { id: postId }
    });

    // Check if user is interested in the post
    const userInterest = await (db as any).postInterest.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId
        }
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check authorization: only post author or interested users can create events
    const isAuthor = post.authorId === session.user.id;
    const isInterested = !!userInterest;
    
    if (!isAuthor && !isInterested) {
      return NextResponse.json({ 
        error: 'Only the post author or interested users can create events' 
      }, { status: 403 });
    }

    // Validate dates
    const start = new Date(startDate);
    const now = new Date();
    
    if (start < now) {
      return NextResponse.json({ 
        error: 'Event start date must be in the future' 
      }, { status: 400 });
    }

    let end = null;
    if (endDate) {
      end = new Date(endDate);
      if (end <= start) {
        return NextResponse.json({ 
          error: 'End date must be after start date' 
        }, { status: 400 });
      }
    }

    // Create the event using raw SQL
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.$executeRaw`
      INSERT INTO events (
        id, title, description, startDate, endDate, status, maxAttendees,
        districtId, neighborhoodId, organizerId, postId, requiredTools,
        createdAt, updatedAt
      ) VALUES (
        ${eventId}, ${title.trim()}, ${description.trim()},
        ${start.toISOString()}, ${end?.toISOString()}, 'PLANNED', ${maxAttendees},
        ${post.districtId}, ${post.neighborhoodId}, ${session.user.id}, ${postId},
        ${requiredTools?.trim()}, ${new Date().toISOString()}, ${new Date().toISOString()}
      )
    `;

    // Get the created event with relations
    const event = {
      id: eventId,
      title: title.trim(),
      description: description.trim(),
      startDate: start.toISOString(),
      endDate: end?.toISOString(),
      status: 'PLANNED',
      maxAttendees: maxAttendees || null,
      organizerId: session.user.id,
      postId: postId,
      requiredTools: requiredTools?.trim() || null,
      organizer: {
        id: session.user.id,
        name: session.user.name || 'Unknown'
      },
      attendees: []
    };

    return NextResponse.json({ 
      success: true, 
      event 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}