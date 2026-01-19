'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Upload, X, Camera, CheckCircle, AlertCircle } from 'lucide-react';

interface CompletionUploadProps {
  postId: string;
  onUploadComplete?: (beforePhoto?: string, afterPhoto?: string) => void;
  onCancel?: () => void;
}

interface PhotoUpload {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
}

export function CompletionUpload({ postId, onUploadComplete, onCancel }: CompletionUploadProps) {
  const [beforePhoto, setBeforePhoto] = useState<PhotoUpload>({
    file: null,
    preview: null,
    isUploading: false,
    error: null,
  });
  
  const [afterPhoto, setAfterPhoto] = useState<PhotoUpload>({
    file: null,
    preview: null,
    isUploading: false,
    error: null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (type: 'before' | 'after', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const setter = type === 'before' ? setBeforePhoto : setAfterPhoto;
      setter(prev => ({
        ...prev,
        error: 'Please select an image file'
      }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      const setter = type === 'before' ? setBeforePhoto : setAfterPhoto;
      setter(prev => ({
        ...prev,
        error: 'Image must be smaller than 5MB'
      }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const setter = type === 'before' ? setBeforePhoto : setAfterPhoto;
      setter({
        file,
        preview: e.target?.result as string,
        isUploading: false,
        error: null,
      });
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }

    const result = await response.json();
    return result.url;
  };

  const handleSubmit = async () => {
    if (!beforePhoto.file || !afterPhoto.file) {
      alert('Please upload both before and after photos');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload both photos
      setBeforePhoto(prev => ({ ...prev, isUploading: true }));
      setAfterPhoto(prev => ({ ...prev, isUploading: true }));

      const [beforeUrl, afterUrl] = await Promise.all([
        uploadPhoto(beforePhoto.file),
        uploadPhoto(afterPhoto.file),
      ]);

      // Update post with completion photos
      const response = await fetch(`/api/posts/${postId}/completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beforePhoto: beforeUrl,
          afterPhoto: afterUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save completion photos');
      }

      if (onUploadComplete) {
        onUploadComplete(beforeUrl, afterUrl);
      }

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload photos. Please try again.');
    } finally {
      setBeforePhoto(prev => ({ ...prev, isUploading: false }));
      setAfterPhoto(prev => ({ ...prev, isUploading: false }));
      setIsSubmitting(false);
    }
  };

  const removePhoto = (type: 'before' | 'after') => {
    const setter = type === 'before' ? setBeforePhoto : setAfterPhoto;
    setter({
      file: null,
      preview: null,
      isUploading: false,
      error: null,
    });

    // Clear input
    const inputRef = type === 'before' ? beforeInputRef : afterInputRef;
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const PhotoUploadSlot = ({ 
    type, 
    photo, 
    inputRef, 
    onFileSelect 
  }: { 
    type: 'before' | 'after'; 
    photo: PhotoUpload; 
    inputRef: React.RefObject<HTMLInputElement | null>;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
        <Camera className="w-4 h-4" />
        {type === 'before' ? 'Before Photo' : 'After Photo'}
      </h4>
      
      {photo.preview ? (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={photo.preview}
              alt={`${type} cleanup photo`}
              fill
              className="object-cover"
            />
          </div>
          
          {photo.isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-sm">Uploading...</div>
            </div>
          )}
          
          <button
            onClick={() => removePhoto(type)}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            disabled={photo.isUploading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => inputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 text-center px-4">
            Click to upload {type} photo
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
        </div>
      )}

      {photo.error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {photo.error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold">Mark as Completed</h3>
            <p className="text-sm text-gray-600">
              Upload before and after photos to showcase the cleanup progress
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhotoUploadSlot
            type="before"
            photo={beforePhoto}
            inputRef={beforeInputRef}
            onFileSelect={(e) => handleFileSelect('before', e)}
          />
          
          <PhotoUploadSlot
            type="after"
            photo={afterPhoto}
            inputRef={afterInputRef}
            onFileSelect={(e) => handleFileSelect('after', e)}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!beforePhoto.file || !afterPhoto.file || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Uploading...' : 'Complete Cleanup'}
          </Button>
          
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}