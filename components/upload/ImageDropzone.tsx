'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  accept?: Record<string, string[]>;
}

export default function ImageDropzone({
  onFilesAdded,
  maxFiles = 10,
  disabled = false,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.webp']
  }
}: ImageDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections
  } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled,
    multiple: true
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive && !isDragReject 
            ? 'border-blue-500 bg-blue-50 text-blue-600' 
            : ''}
          ${isDragReject 
            ? 'border-red-500 bg-red-50 text-red-600' 
            : ''}
          ${!isDragActive && !isDragReject 
            ? 'border-gray-300 hover:border-gray-400 text-gray-600' 
            : ''}
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isDragActive ? (
            <Upload className="w-12 h-12 text-blue-500" />
          ) : (
            <ImageIcon className="w-12 h-12 text-gray-400" />
          )}
          
          <div>
            {isDragActive ? (
              <p className="text-lg font-medium">
                {isDragReject ? 'Some files will be rejected' : 'Drop the images here...'}
              </p>
            ) : (
              <>
                <p className="text-lg font-medium">
                  Drag & drop images here, or click to select
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPEG, PNG, WebP • Max {maxFiles} files
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800 font-medium mb-2">Some files were rejected:</p>
          <ul className="text-sm text-red-700 space-y-1">
            {fileRejections.map(({ file, errors }) => (
              <li key={file.name}>
                {file.name}: {errors.map(e => e.message).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}