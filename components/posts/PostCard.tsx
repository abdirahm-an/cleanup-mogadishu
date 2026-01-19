import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { MapPin, Calendar, User } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    description: string;
    photos: string[];
    status: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      email: string;
    };
    district?: {
      id: string;
      name: string;
    } | null;
    neighborhood?: {
      id: string;
      name: string;
    } | null;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'UNDER_REVIEW':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'Open';
    case 'COMPLETED':
      return 'Completed';
    case 'UNDER_REVIEW':
      return 'In Progress';
    case 'DRAFT':
      return 'Draft';
    default:
      return status;
  }
};

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

export function PostCard({ post }: PostCardProps) {
  const thumbnailPhoto = post.photos?.[0];
  const location = [post.district?.name, post.neighborhood?.name].filter(Boolean).join(', ');
  
  return (
    <Link href={`/posts/${post.id}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group-hover:border-primary/20">
        <div className="relative">
          {/* Thumbnail */}
          {thumbnailPhoto ? (
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <Image
                src={thumbnailPhoto}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="h-48 w-full bg-gray-100 rounded-t-lg flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No photo</p>
              </div>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
              {getStatusText(post.status)}
            </span>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {post.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Location */}
            {location && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </div>
            )}

            {/* Author and Date */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="line-clamp-1">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="w-3 h-3" />
                <span>{getRelativeTime(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}