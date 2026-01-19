import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const uploadedFiles: { id: string; fileName: string; url: string; size: number }[] = [];

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Process each uploaded file
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof File) {
        const file = value as File;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          continue; // Skip non-image files
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
          return NextResponse.json(
            { error: `File ${file.name} is too large. Maximum size is 10MB.` },
            { status: 400 }
          );
        }

        // Generate unique filename
        const fileExtension = path.extname(file.name);
        const uniqueId = nanoid();
        const fileName = `${uniqueId}${fileExtension}`;
        const filePath = path.join(uploadsDir, fileName);

        // Convert file to buffer and write to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Add file info to response
        uploadedFiles.push({
          id: uniqueId,
          fileName: file.name,
          url: `/uploads/${fileName}`,
          size: file.size
        });
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: 'No valid image files were uploaded' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error during file upload' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Upload endpoint is working. Use POST to upload files.',
    supportedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxFileSize: '10MB',
    maxFiles: 10
  });
}