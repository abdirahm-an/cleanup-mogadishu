'use client';

import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export interface UploadProgressItem {
  id: string;
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UploadProgressProps {
  items: UploadProgressItem[];
  onRetry?: (id: string) => void;
  className?: string;
}

export default function UploadProgress({
  items,
  onRetry,
  className = ''
}: UploadProgressProps) {
  if (items.length === 0) return null;

  const getStatusIcon = (status: UploadProgressItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'uploading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
      default:
        return null;
    }
  };

  const getProgressColor = (status: UploadProgressItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'uploading':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = (item: UploadProgressItem) => {
    switch (item.status) {
      case 'completed':
        return 'Completed';
      case 'error':
        return item.error || 'Upload failed';
      case 'uploading':
        return `Uploading... ${item.progress}%`;
      case 'pending':
        return 'Pending';
      default:
        return '';
    }
  };

  const overallProgress = items.length > 0 
    ? items.reduce((sum, item) => sum + item.progress, 0) / items.length 
    : 0;

  const completedCount = items.filter(item => item.status === 'completed').length;
  const errorCount = items.filter(item => item.status === 'error').length;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Overall Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-900">
            Upload Progress
          </h3>
          <span className="text-sm text-gray-600">
            {completedCount} of {items.length} completed
            {errorCount > 0 && (
              <span className="text-red-600 ml-2">({errorCount} failed)</span>
            )}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Individual File Progress */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {getStatusIcon(item.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-900 truncate" title={item.fileName}>
                  {item.fileName}
                </p>
                {item.status === 'error' && onRetry && (
                  <button
                    onClick={() => onRetry(item.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
                  >
                    Retry
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ease-out ${getProgressColor(item.status)}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  {getStatusText(item)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}