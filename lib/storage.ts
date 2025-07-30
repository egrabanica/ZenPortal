import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

const supabase = createClientComponentClient<Database>();

export class StorageService {
  // Check if storage bucket exists and is accessible
  static async checkBucketExists(bucket: string = 'media'): Promise<boolean> {
    try {
      // Try to list files in the bucket to verify it exists and is accessible
      const { error } = await supabase.storage.from(bucket).list('', { limit: 1 });
      
      if (error) {
        console.error('Bucket check failed:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Bucket check failed:', error);
      return false;
    }
  }

  // Upload file to Supabase Storage with improved error handling
  static async uploadFile(file: File, bucket: string = 'media'): Promise<string> {
    try {
      console.log('Starting file upload:', { fileName: file.name, size: file.size, type: file.type });
      
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
        'image/gif',
        'video/mp4',
        'video/quicktime', // .mov files
        'video/avi',
        'video/webm',
        'video/x-msvideo' // .avi files alternative MIME type
      ];

      console.log('File type:', file.type);
      
      if (!allowedTypes.includes(file.type)) {
        // Additional check for common video extensions if MIME type is not recognized
        const fileName = file.name.toLowerCase();
        const videoExtensions = ['.mp4', '.mov', '.avi', '.webm'];
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        
        const hasValidExtension = [...videoExtensions, ...imageExtensions].some(ext => fileName.endsWith(ext));
        
        if (!hasValidExtension) {
          throw new Error('Invalid file type. Only JPG, PNG, WEBP, GIF, MP4, MOV, AVI, and WEBM files are allowed.');
        }
        
        console.log('File type not recognized by MIME, but extension is valid:', fileName);
      }

      // Check if bucket exists (do not try to create it)
      const bucketExists = await this.checkBucketExists(bucket);
      if (!bucketExists) {
        throw new Error(`Storage bucket '${bucket}' does not exist. Please create it manually in the Supabase dashboard.`);
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}-${randomStr}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      console.log('Uploading to path:', filePath);

      // Upload file to Supabase Storage with retry logic
      let uploadAttempt = 0;
      const maxAttempts = 3;
      let uploadResult: any;
      
      while (uploadAttempt < maxAttempts) {
        uploadAttempt++;
        console.log(`Upload attempt ${uploadAttempt}/${maxAttempts}`);
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: uploadAttempt > 1 // Allow overwrite on retry
          });

        if (!error) {
          uploadResult = { data, error };
          break;
        }
        
        console.error(`Upload attempt ${uploadAttempt} failed:`, error);
        
        if (uploadAttempt === maxAttempts) {
          throw new Error(`Upload failed after ${maxAttempts} attempts: ${error.message}`);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempt));
      }

      console.log('Upload successful:', uploadResult.data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);
      return publicUrl;
      
    } catch (error: any) {
      console.error('File upload error:', error);
      throw new Error(`Upload failed: ${error.message || 'Unknown error occurred'}`);
    }
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
