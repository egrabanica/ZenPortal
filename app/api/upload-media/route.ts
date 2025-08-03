import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file size limits
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 300 * 1024 * 1024 : 50 * 1024 * 1024; // 300MB for video, 50MB for images
    
    if (file.size > maxSize) {
      const limitMB = isVideo ? 300 : 50;
      return NextResponse.json(
        { error: `File size exceeds ${limitMB}MB limit` },
        { status: 400 }
      );
    }

    // Check file type
    const allowedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/tiff'
    ];

    const allowedVideoTypes = [
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/x-msvideo',
      'video/webm',
      'video/ogg',
      'video/3gpp',
      'video/x-flv'
    ];

    const isValidType = [...allowedImageTypes, ...allowedVideoTypes].includes(file.type);
    
    if (!isValidType) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload images (JPEG, PNG, GIF, WebP, SVG, BMP, TIFF) or videos (MP4, MPEG, MOV, AVI, WebM, OGG, 3GP, FLV).' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;

    // Determine upload directory based on file type
    const uploadType = isVideo ? 'videos' : 'images';
    const mediaDir = path.join(process.cwd(), 'public', 'uploads', 'media', uploadType);
    
    try {
      await mkdir(mediaDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Write file to public/uploads/media/{images|videos}
    const filePath = path.join(mediaDir, filename);
    await writeFile(filePath, buffer);

    // Return the URL where the media can be accessed
    const mediaUrl = `/uploads/media/${uploadType}/${filename}`;

    return NextResponse.json({
      success: true,
      url: mediaUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      category: uploadType
    });

  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
