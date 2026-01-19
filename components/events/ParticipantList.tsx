'use client';

import { UserCheck, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Participant {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
  };
}

interface ParticipantListProps {
  participants: Participant[];
  maxAttendees?: number;
  isCompact?: boolean;
  showTitle?: boolean;
}

export function ParticipantList({ 
  participants, 
  maxAttendees, 
  isCompact = false,
  showTitle = true 
}: ParticipantListProps) {
  const participantCount = participants.length;
  const isAtCapacity = maxAttendees ? participantCount >= maxAttendees : false;

  if (isCompact) {
    // Compact version for displaying in EventCard
    return (
      <div className="space-y-2">
        {showTitle && (
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="font-medium">
              {participantCount} volunteer{participantCount !== 1 ? 's' : ''} registered
              {maxAttendees && ` / ${maxAttendees}`}
              {isAtCapacity && (
                <span className="text-orange-600 font-medium"> (Full)</span>
              )}
            </span>
          </div>
        )}
        
        {participants.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">
            {participants.map((participant) => (
              <div 
                key={participant.id} 
                className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md"
              >
                <UserCheck className="w-3 h-3 text-green-500" />
                <span>{participant.user.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {participants.length === 0 && (
          <p className="text-sm text-gray-500 italic">No volunteers registered yet</p>
        )}
      </div>
    );
  }

  // Full version for standalone use
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-600" />
          Volunteers
          <span className="text-sm font-normal text-gray-500">
            ({participantCount}{maxAttendees ? ` / ${maxAttendees}` : ''})
          </span>
          {isAtCapacity && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              Full
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {participants.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {participants.map((participant) => (
              <div 
                key={participant.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                  <UserCheck className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">{participant.user.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No volunteers yet</p>
            <p className="text-gray-400 text-sm">Be the first to join this cleanup event!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}