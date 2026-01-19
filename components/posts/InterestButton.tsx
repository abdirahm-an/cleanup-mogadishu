'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Heart, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface InterestButtonProps {
  postId: string;
  initialIsInterested: boolean;
  initialCount: number;
  onInterestChange?: (isInterested: boolean, newCount: number) => void;
}

export function InterestButton({ 
  postId, 
  initialIsInterested, 
  initialCount,
  onInterestChange 
}: InterestButtonProps) {
  const { data: session } = useSession();
  const [isInterested, setIsInterested] = useState(initialIsInterested);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [shareContactInfo, setShareContactInfo] = useState(false);

  const handleToggleInterest = async () => {
    if (!session?.user) {
      // Redirect to login or show auth modal
      alert('Please log in to express interest');
      return;
    }

    if (!isInterested && !showConsentDialog) {
      // Show consent dialog for new interest
      setShowConsentDialog(true);
      return;
    }

    setIsLoading(true);

    try {
      const method = isInterested ? 'DELETE' : 'POST';
      const body = method === 'POST' ? JSON.stringify({ shareContactInfo }) : undefined;
      
      const response = await fetch(`/api/posts/${postId}/interest`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body,
      });

      if (!response.ok) {
        throw new Error('Failed to update interest');
      }

      const newIsInterested = !isInterested;
      const newCount = newIsInterested ? count + 1 : count - 1;
      
      setIsInterested(newIsInterested);
      setCount(newCount);
      setShowConsentDialog(false);
      onInterestChange?.(newIsInterested, newCount);
    } catch (error) {
      console.error('Error toggling interest:', error);
      alert('Failed to update interest. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showConsentDialog) {
    return (
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Express Interest</h4>
          <p className="text-sm text-gray-600">
            By expressing interest, you're letting the post author know you'd like to help with this cleanup.
          </p>
          
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={shareContactInfo}
              onChange={(e) => setShareContactInfo(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
              I consent to sharing my contact information (email and phone number if provided) 
              with the post author so they can coordinate the cleanup effort.
            </span>
          </label>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={handleToggleInterest}
            disabled={isLoading}
            size="sm"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Express Interest
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowConsentDialog(false)}
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handleToggleInterest}
        disabled={isLoading}
        variant={isInterested ? "default" : "outline"}
        size="sm"
        className={isInterested ? "bg-red-600 hover:bg-red-700 text-white" : ""}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Heart 
            className={`mr-2 h-4 w-4 ${isInterested ? "fill-current" : ""}`} 
          />
        )}
        {isInterested ? "Interested" : "I'm Interested"}
      </Button>
      {count > 0 && (
        <span className="text-sm text-gray-600">
          {count} {count === 1 ? 'person' : 'people'} interested
        </span>
      )}
    </div>
  );
}