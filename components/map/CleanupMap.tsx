'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PostMarker } from './PostMarker';
import { MapPopup } from './MapPopup';

// Fix for default markers in Next.js
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

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

interface CleanupMapProps {
  posts: Post[];
  className?: string;
}

// Mogadishu coordinates
const MOGADISHU_CENTER: [number, number] = [2.0469, 45.3182];

export function CleanupMap({ posts, className = '' }: CleanupMapProps) {
  // Filter posts that have coordinates
  const postsWithCoordinates = posts.filter(
    post => post.latitude && post.longitude
  );

  return (
    <div className={`h-96 md:h-[500px] lg:h-[600px] w-full rounded-lg overflow-hidden border shadow-sm ${className}`}>
      <MapContainer
        center={MOGADISHU_CENTER}
        zoom={11}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {postsWithCoordinates.map((post) => (
          <PostMarker key={post.id} post={post}>
            <MapPopup post={post} />
          </PostMarker>
        ))}
      </MapContainer>
    </div>
  );
}