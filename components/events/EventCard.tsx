'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Wrench, 
  UserCheck,
  UserX
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ParticipantList } from './ParticipantList';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: string;
  maxAttendees?: number;
  organizerId: string;
  requiredTools?: string;
  organizer: {
    id: string;
    name: string;
  };
  attendees: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
    };
  }>;
}

interface EventCardProps {
  event: Event;
  onEventUpdate: () => void;
}

export function EventCard({ event, onEventUpdate }: EventCardProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { dateStr, timeStr };
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-blue-100 text-blue-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isAttending = session?.user 
    ? event.attendees.some(attendee => attendee.userId === session.user.id)
    : false;

  const isOrganizer = session?.user?.id === event.organizerId;
  const attendeeCount = event.attendees.length;
  const isMaxCapacityReached = event.maxAttendees ? attendeeCount >= event.maxAttendees : false;

  const handleAttendanceToggle = async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    try {
      const method = isAttending ? 'DELETE' : 'POST';
      const response = await fetch(`/api/events/${event.id}/attendance`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update attendance');
      }

      onEventUpdate();
    } catch (error) {
      console.error('Error updating attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const { dateStr: startDateStr, timeStr: startTimeStr } = formatDateTime(event.startDate);
  const endInfo = event.endDate ? formatDateTime(event.endDate) : null;

  const isPastEvent = new Date(event.startDate) < new Date();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            {event.title}
          </CardTitle>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(event.status)}`}>
            {event.status.toLowerCase()}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{event.description}</p>

        {/* Date and Time */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">{startDateStr}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              {startTimeStr}
              {endInfo && ` - ${endInfo.dateStr === startDateStr ? endInfo.timeStr : `${endInfo.dateStr} ${endInfo.timeStr}`}`}
            </span>
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4" />
          <span>Organized by <span className="font-medium">{event.organizer.name}</span></span>
        </div>

        {/* Participant List */}
        <ParticipantList 
          participants={event.attendees}
          maxAttendees={event.maxAttendees}
          isCompact={true}
          showTitle={true}
        />

        {/* Required Tools */}
        {event.requiredTools && (
          <div className="flex items-start gap-2 text-gray-600">
            <Wrench className="w-4 h-4 mt-0.5" />
            <div>
              <span className="font-medium">Required tools:</span>
              <p className="text-sm">{event.requiredTools}</p>
            </div>
          </div>
        )}

        {/* Attendance Actions */}
        {session?.user && !isOrganizer && event.status === 'PLANNED' && !isPastEvent && (
          <div className="pt-4 border-t">
            <Button
              onClick={handleAttendanceToggle}
              disabled={isLoading || (!isAttending && isMaxCapacityReached)}
              variant={isAttending ? 'outline' : 'default'}
              className="w-full"
            >
              {isLoading ? (
                'Loading...'
              ) : isAttending ? (
                <>
                  <UserX className="w-4 h-4 mr-2" />
                  Leave Event
                </>
              ) : isMaxCapacityReached ? (
                'Event Full'
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Join Event
                </>
              )}
            </Button>
            
            {!isAttending && isMaxCapacityReached && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                This event has reached maximum capacity
              </p>
            )}
          </div>
        )}

        {/* Past Event Notice */}
        {isPastEvent && event.status !== 'COMPLETED' && event.status !== 'CANCELLED' && (
          <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-md">
            This event has passed. Consider updating its status.
          </div>
        )}
      </CardContent>
    </Card>
  );
}