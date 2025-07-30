import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

const supabase = createClientComponentClient<Database>();

export class StorageService {
  // Create storage bucket if it doesn't exist
  static async ensureBucketExists(bucket: string = 'media'): Promise<void> {
    try {
      // Try to list files in the bucket to check if it exists
      const { error } = await supabase.storage.from(bucket).list('', { limit: 1 });
      
      if (error && error.message.includes('Bucket not found')) {
        // Create the bucket
        const { error: createError } = await supabase.storage.createBucket(bucket, {
          public: true,
          allowedMimeTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png', 
            'image/webp',
            'video/mp4',
            'video/quicktime'
          ],
          fileSizeLimit: 20971520 // 20MB
        });
        
        if (createError) {
          throw new Error(`Failed to create bucket: ${createError.message}`);
        }
      } else if (error) {
        throw new Error(`Storage error: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Bucket check/creation error:', error);
      throw error;
    }
  }

  // Upload file to Supabase Storage
  static async uploadFile(file: File, bucket: string = 'media'): Promise<string> {
    // Ensure bucket exists
    await this.ensureBucketExists(bucket);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `articles/${fileName}`;

    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 20MB');
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'video/mp4',
      'video/quicktime' // .mov files
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPG, PNG, WEBP, MP4, and MOV files are allowed.');
    }

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  }

  // Delete file from Supabase Storage
  static async deleteFile(filePath: string, bucket: string = 'media'): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  // Get file info
  static async getFileInfo(filePath: string, bucket: string = 'media') {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(filePath);

    if (error) {
      throw new Error(`Failed to get file info: ${error.message}`);
    }

    return data;
  }

  // Extract file path from URL for deletion
  static extractFilePathFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      // Assuming the URL structure is: .../storage/v1/object/public/bucket/filepath
      const bucketIndex = pathParts.findIndex(part => part === 'public') + 1;
      if (bucketIndex > 0 && bucketIndex < pathParts.length - 1) {
        return pathParts.slice(bucketIndex + 1).join('/');
      }
      return null;
    } catch {
      return null;
    }
  }
}
