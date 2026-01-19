'use client';

import { Popup } from 'react-leaflet';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  description: string;
  photos: string[];
  status: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
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
}

interface MapPopupProps {
  post: Post;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'UNDER_REVIEW':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'Open';
    case 'UNDER_REVIEW':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    case 'DRAFT':
      return 'Draft';
    default:
      return status;
  }
};

export function MapPopup({ post }: MapPopupProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const location = [
    post.neighborhood?.name,
    post.district?.name
  ].filter(Boolean).join(', ');

  return (
    <Popup 
      maxWidth={300}
      minWidth={250}
      className="cleanup-map-popup"
    >
      <div className="p-2 max-w-sm">
        {/* Main Image */}
        {post.photos.length > 0 && (
          <div className="mb-3">
            <div className="relative w-full h-32 rounded-lg overflow-hidden">
              <Image
                src={post.photos[0]}
                alt={post.title}
                fill
                sizes="(max-width: 300px) 100vw, 300px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>

        {/* Status */}
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
            {getStatusLabel(post.status)}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(post.createdAt)}
          </span>
        </div>

        {/* Location */}
        {location && (
          <p className="text-sm text-gray-600 mb-2">
            📍 {location}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {post.description}
        </p>

        {/* Author */}
        <p className="text-xs text-gray-500 mb-3">
          Reported by {post.author.name}
        </p>

        {/* Action Button */}
        <Link href={`/posts/${post.id}`}>
          <Button size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </Popup>
  );
}