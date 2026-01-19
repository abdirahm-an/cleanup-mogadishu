import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

// POST /api/events/[id]/attendance - Join an event
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Check if event exists and is joinable
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        attendees: true
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.status !== 'PLANNED') {
      return NextResponse.json({ 
        error: 'Cannot join events that are not in planned status' 
      }, { status: 400 });
    }

    if (event.organizerId === session.user.id) {
      return NextResponse.json({ 
        error: 'Cannot join your own event' 
      }, { status: 400 });
    }

    // Check if event is full
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return NextResponse.json({ 
        error: 'Event is full' 
      }, { status: 400 });
    }

    // Check if user is already attending
    const existingAttendance = await db.eventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: session.user.id
        }
      }
    });

    if (existingAttendance) {
      return NextResponse.json({ 
        error: 'Already attending this event' 
      }, { status: 400 });
    }

    // Create attendance record
    await db.eventAttendee.create({
      data: {
        eventId: eventId,
        userId: session.user.id
      }
    });

    // TODO: Implement notifications to event organizer when new participants join
    // This would require adding a notification system to the database schema
    // For now, logging the notification that would be sent
    if (event.organizerId !== session.user.id) {
      console.log(`Notification: ${session.user.name || session.user.email} joined event "${event.title}" organized by ${event.organizerId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error joining event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]/attendance - Leave an event
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Check if event exists
    const event = await db.event.findUnique({
      where: { id: eventId },
      select: { id: true, status: true }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.status !== 'PLANNED') {
      return NextResponse.json({ 
        error: 'Cannot leave events that are not in planned status' 
      }, { status: 400 });
    }

    // Delete the attendance record
    const deleted = await db.eventAttendee.deleteMany({
      where: {
        eventId: eventId,
        userId: session.user.id
      }
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Not attending this event' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error leaving event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}