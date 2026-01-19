'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ChevronDown, Loader2 } from 'lucide-react';

interface StatusUpdaterProps {
  postId: string;
  currentStatus: string;
  isAuthor: boolean;
  onStatusUpdate?: (newStatus: string) => void;
}

const statusOptions = [
  { value: 'PUBLISHED', label: 'Open', description: 'Cleanup site identified and ready for action' },
  { value: 'UNDER_REVIEW', label: 'In Progress', description: 'Cleanup work is currently underway' },
  { value: 'COMPLETED', label: 'Completed', description: 'Cleanup has been finished' },
];

export function StatusUpdater({ postId, currentStatus, isAuthor, onStatusUpdate }: StatusUpdaterProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  if (!isAuthor) {
    return null;
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setShowDropdown(false);
      return;
    }

    setIsUpdating(true);
    setShowDropdown(false);

    try {
      const response = await fetch(`/api/posts/${postId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const result = await response.json();
      
      // Call the callback if provided
      if (onStatusUpdate) {
        onStatusUpdate(newStatus);
      }

      // Refresh the page to show updated status
      router.refresh();

    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentOption = statusOptions.find(option => option.value === currentStatus);

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isUpdating}
        className="min-w-[140px] justify-between"
      >
        {isUpdating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            {currentOption?.label || currentStatus}
            <ChevronDown className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border z-50">
          <div className="py-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusUpdate(option.value)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors
                  ${option.value === currentStatus ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
                `}
                disabled={option.value === currentStatus}
              >
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}