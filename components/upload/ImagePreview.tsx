'use client';

import React, { useState, useEffect } from 'react';
import { X, FileIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageFile extends File {
  id: string;
  preview?: string;
}

interface ImagePreviewProps {
  files: ImageFile[];
  onRemove: (fileId: string) => void;
  className?: string;
}

export default function ImagePreview({
  files,
  onRemove,
  className = ''
}: ImagePreviewProps) {
  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    const newPreviews: Record<string, string> = {};
    
    files.forEach(file => {
      if (file.type.startsWith('image/') && !previews[file.id]) {
        const url = URL.createObjectURL(file);
        newPreviews[file.id] = url;
      }
    });

    setPreviews(prev => ({ ...prev, ...newPreviews }));

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(newPreviews).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(previews).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  if (files.length === 0) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {files.map((file) => (
        <div
          key={file.id}
          className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => onRemove(file.id)}
            className="absolute top-2 right-2 z-10 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-label={`Remove ${file.name}`}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="aspect-square relative bg-gray-100">
            {file.type.startsWith('image/') && previews[file.id] ? (
              <Image
                src={previews[file.id]}
                alt={`Preview of ${file.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="p-3">
            <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}