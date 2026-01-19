import imageCompression from 'browser-image-compression';
import { nanoid } from 'nanoid';

export interface CompressedImageFile extends File {
  id: string;
  originalSize: number;
  compressedSize: number;
}

export interface UploadResult {
  id: string;
  fileName: string;
  url: string;
  size: number;
}

export interface UploadError {
  id: string;
  fileName: string;
  error: string;
}

/**
 * Compress an image file to reduce its size while maintaining quality
 */
export async function compressImage(
  file: File,
  options: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    quality?: number;
  } = {}
): Promise<CompressedImageFile> {
  const defaultOptions = {
    maxSizeMB: 2, // 2MB max
    maxWidthOrHeight: 1920, // 1920px max width/height
    useWebWorker: true,
    quality: 0.8, // 80% quality
    ...options
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    
    // Create enhanced file object with metadata
    const enhancedFile = Object.assign(compressedFile, {
      id: nanoid(),
      originalSize: file.size,
      compressedSize: compressedFile.size
    }) as CompressedImageFile;

    return enhancedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    
    // If compression fails, return original file with metadata
    const fallbackFile = Object.assign(file, {
      id: nanoid(),
      originalSize: file.size,
      compressedSize: file.size
    }) as CompressedImageFile;
    
    return fallbackFile;
  }
}

/**
 * Compress multiple image files
 */
export async function compressImages(
  files: File[],
  options?: Parameters<typeof compressImage>[1],
  onProgress?: (fileName: string, progress: number) => void
): Promise<CompressedImageFile[]> {
  const compressedFiles: CompressedImageFile[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(file.name, (i / files.length) * 50); // 0-50% for compression
    
    const compressed = await compressImage(file, options);
    compressedFiles.push(compressed);
  }
  
  onProgress?.('Compression complete', 50);
  return compressedFiles;
}

/**
 * Upload files to the server
 */
export async function uploadFiles(
  files: File[],
  onProgress?: (fileName: string, progress: number) => void
): Promise<{ results: UploadResult[]; errors: UploadError[] }> {
  const formData = new FormData();
  
  // Add files to form data
  files.forEach((file, index) => {
    formData.append(`file-${index}`, file);
  });

  try {
    onProgress?.('Uploading files...', 75);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    onProgress?.('Processing response...', 90);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();
    onProgress?.('Upload complete', 100);
    
    return {
      results: data.files || [],
      errors: []
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    
    return {
      results: [],
      errors: files.map(file => ({
        id: nanoid(),
        fileName: file.name,
        error: errorMessage
      }))
    };
  }
}

/**
 * Complete upload process: compress and upload files
 */
export async function processAndUploadFiles(
  files: File[],
  options: {
    compression?: Parameters<typeof compressImage>[1];
    onProgress?: (fileName: string, progress: number) => void;
  } = {}
): Promise<{ results: UploadResult[]; errors: UploadError[] }> {
  const { compression, onProgress } = options;
  
  try {
    // Step 1: Compress images
    onProgress?.('Compressing images...', 0);
    const compressedFiles = await compressImages(files, compression, 
      (fileName, progress) => onProgress?.(fileName, progress * 0.5)
    );
    
    // Step 2: Upload compressed files
    onProgress?.('Uploading files...', 50);
    const result = await uploadFiles(compressedFiles,
      (fileName, progress) => onProgress?.(fileName, 50 + (progress * 0.5))
    );
    
    return result;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      results: [],
      errors: files.map(file => ({
        id: nanoid(),
        fileName: file.name,
        error: errorMessage
      }))
    };
  }
}

/**
 * Validate image files
 */
export function validateImageFiles(files: File[]): { valid: File[]; errors: string[] } {
  const valid: File[] = [];
  const errors: string[] = [];
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB for original files (will be compressed)
  
  files.forEach(file => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name}: Invalid file type. Only JPEG, PNG, and WebP are allowed.`);
      return;
    }
    
    if (file.size > maxFileSize) {
      errors.push(`${file.name}: File too large. Maximum size is 50MB.`);
      return;
    }
    
    valid.push(file);
  });
  
  return { valid, errors };
}