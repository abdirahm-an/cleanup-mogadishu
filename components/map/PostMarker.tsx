'use client';

import { Marker } from 'react-leaflet';
import { Icon } from 'leaflet';

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

interface PostMarkerProps {
  post: Post;
  children?: React.ReactNode;
}

// Create custom icons based on post status
const createStatusIcon = (status: string) => {
  let color = '#10b981'; // default green
  
  switch (status) {
    case 'PUBLISHED':
      color = '#10b981'; // green
      break;
    case 'UNDER_REVIEW':
      color = '#f59e0b'; // yellow
      break;
    case 'COMPLETED':
      color = '#3b82f6'; // blue
      break;
    case 'DRAFT':
      color = '#6b7280'; // gray
      break;
  }

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: '/leaflet/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
  });
};

export function PostMarker({ post, children }: PostMarkerProps) {
  if (!post.latitude || !post.longitude) {
    return null;
  }

  const icon = createStatusIcon(post.status);

  return (
    <Marker 
      position={[post.latitude, post.longitude]} 
      icon={icon}
    >
      {children}
    </Marker>
  );
}