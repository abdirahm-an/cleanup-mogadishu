'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PhotoGalleryProps {
  photos: string[];
  title: string;
}

export function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">No photos available</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setSelectedPhoto(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedPhoto(null);
  };

  const goToPrevious = () => {
    if (selectedPhoto !== null && selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1);
    } else if (selectedPhoto === 0) {
      setSelectedPhoto(photos.length - 1);
    }
  };

  const goToNext = () => {
    if (selectedPhoto !== null && selectedPhoto < photos.length - 1) {
      setSelectedPhoto(selectedPhoto + 1);
    } else if (selectedPhoto === photos.length - 1) {
      setSelectedPhoto(0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  // Add keyboard event listeners
  if (typeof window !== 'undefined') {
    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Photos ({photos.length})
        </h3>
        
        {photos.length === 1 ? (
          // Single photo - full width
          <div className="relative group cursor-pointer" onClick={() => openLightbox(0)}>
            <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden rounded-lg">
              <Image
                src={photos[0]}
                alt={`${title} - Photo 1`}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </div>
        ) : (
          // Multiple photos - grid layout
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative group cursor-pointer aspect-square"
                onClick={() => openLightbox(index)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <Image
                    src={photo}
                    alt={`${title} - Photo ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedPhoto !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          {/* Close Button */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Navigation */}
          {photos.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Image */}
          <div className="relative max-w-full max-h-full">
            <Image
              src={photos[selectedPhoto]}
              alt={`${title} - Photo ${selectedPhoto + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </div>

          {/* Photo Counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedPhoto + 1} of {photos.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}