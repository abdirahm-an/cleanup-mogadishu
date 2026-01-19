'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import ImageDropzone from '@/components/upload/ImageDropzone';
import LocationSelector from './LocationSelector';
import { cn } from '@/lib/utils';

interface PostFormData {
  title: string;
  description: string;
  photos: string[];
  districtId: string;
  neighborhoodId?: string;
  address?: string;
}

interface UploadedFile {
  id: string;
  fileName: string;
  url: string;
  size: number;
}

export default function PostForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    photos: [],
    districtId: '',
    neighborhoodId: '',
    address: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof PostFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFilesAdded = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success && result.files) {
        const newFiles = result.files as UploadedFile[];
        setUploadedFiles(prev => [...prev, ...newFiles]);
        
        // Update form data with photo URLs
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, ...newFiles.map(f => f.url)]
        }));

        // Clear photo error if present
        if (errors.photos) {
          setErrors(prev => ({ ...prev, photos: '' }));
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({ 
        ...prev, 
        photos: error instanceof Error ? error.message : 'Upload failed' 
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.photos.length === 0) {
      newErrors.photos = 'At least one photo is required';
    }

    if (!formData.districtId) {
      newErrors.districtId = 'District is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        photos: formData.photos,
        districtId: formData.districtId,
        neighborhoodId: formData.neighborhoodId || undefined,
        address: formData.address?.trim() || undefined,
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();
      
      if (result.success && result.post) {
        // Redirect to the newly created post
        router.push(`/posts/${result.post.id}`);
      } else {
        throw new Error(result.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error instanceof Error ? error.message : 'Failed to create post' 
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Cleanup Post</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Brief description of the cleanup location"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={cn(errors.title && 'border-red-500')}
              maxLength={200}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              placeholder="Provide detailed information about the cleanup location, current conditions, and any specific concerns..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={cn(
                'flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors',
                'placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500',
                'disabled:cursor-not-allowed disabled:opacity-50 resize-vertical',
                errors.description && 'border-red-500'
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos *
            </label>
            <ImageDropzone
              onFilesAdded={handleFilesAdded}
              disabled={uploading}
              maxFiles={5}
            />
            {uploading && (
              <p className="text-sm text-blue-600 mt-2">Uploading photos...</p>
            )}
            {errors.photos && (
              <p className="text-sm text-red-600 mt-2">{errors.photos}</p>
            )}
            
            {/* Photo Preview */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={file.id} className="relative">
                    <img
                      src={file.url}
                      alt={file.fileName}
                      className="w-full h-24 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Selector */}
          <div>
            <LocationSelector
              selectedDistrictId={formData.districtId}
              selectedNeighborhoodId={formData.neighborhoodId}
              onDistrictChange={(districtId) => handleInputChange('districtId', districtId)}
              onNeighborhoodChange={(neighborhoodId) => handleInputChange('neighborhoodId', neighborhoodId || '')}
            />
            {errors.districtId && (
              <p className="text-sm text-red-600 mt-1">{errors.districtId}</p>
            )}
          </div>

          {/* Optional Address/Landmark */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Specific Address or Landmark (Optional)
            </label>
            <Input
              id="address"
              type="text"
              placeholder="e.g., Near Central Market, Behind Hospital, etc."
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting || uploading}
          >
            {submitting ? 'Creating Post...' : 'Create Post'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}