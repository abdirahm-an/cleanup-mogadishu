'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { PostGrid } from '@/components/posts/PostGrid';
import { Map, List } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const CleanupMap = dynamic(() => import('@/components/map/CleanupMap').then(mod => ({ default: mod.CleanupMap })), {
  ssr: false,
  loading: () => (
    <div className="h-96 md:h-[500px] lg:h-[600px] w-full rounded-lg border bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
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

interface PostsViewToggleProps {
  posts: Post[];
  initialView?: 'list' | 'map';
}

export function PostsViewToggle({ posts, initialView = 'list' }: PostsViewToggleProps) {
  const [currentView, setCurrentView] = useState<'list' | 'map'>(initialView);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleViewChange = (view: 'list' | 'map') => {
    setCurrentView(view);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (view === 'list') {
      params.delete('view');
    } else {
      params.set('view', view);
    }
    
    const newUrl = `/posts${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl);
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1 bg-white rounded-lg border p-1 shadow-sm">
          <Button 
            variant={currentView === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => handleViewChange('list')}
          >
            <List className="w-4 h-4" />
            List
          </Button>
          <Button 
            variant={currentView === 'map' ? 'default' : 'ghost'}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => handleViewChange('map')}
          >
            <Map className="w-4 h-4" />
            Map
          </Button>
        </div>
      </div>

      {/* Content */}
      {currentView === 'map' ? (
        <CleanupMap posts={posts} />
      ) : (
        <PostGrid 
          posts={posts}
          emptyMessage="No posts found matching your filters"
          showEmpty={true}
        />
      )}
    </div>
  );
}