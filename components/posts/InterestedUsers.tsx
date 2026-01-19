'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface InterestedUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  shareContactInfo: boolean;
  createdAt: string;
}

interface InterestedUsersProps {
  postId: string;
  authorId: string;
  initialUsers?: InterestedUser[];
}

export function InterestedUsers({ postId, authorId, initialUsers = [] }: InterestedUsersProps) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<InterestedUser[]>(initialUsers);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Only show to the post author
  if (session?.user?.id !== authorId) {
    return null;
  }

  const fetchInterestedUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/interest`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching interested users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded && users.length === 0) {
      fetchInterestedUsers();
    }
  }, [isExpanded]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (users.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Interested Volunteers</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1"
          >
            <span className="text-sm">{users.length} interested</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        Interested {formatDate(user.createdAt)}
                      </div>
                      
                      {user.shareContactInfo && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <a 
                              href={`mailto:${user.email}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {user.email}
                            </a>
                          </div>
                          {user.phone && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <a 
                                href={`tel:${user.phone}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {user.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {!user.shareContactInfo && (
                        <div className="mt-1 text-xs text-gray-500">
                          Contact info not shared
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  💡 <strong>Tip:</strong> Contact volunteers to coordinate cleanup times and locations. 
                  Only users who consented to share their contact info will show their email/phone.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}