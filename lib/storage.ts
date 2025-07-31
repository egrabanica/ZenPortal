import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';
import { isImageFile, isVideoFile } from './media-utils';

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
      console.log('🚀 Starting file upload:', { 
        fileName: file.name, 
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`, 
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      // Check file size - use Supabase free tier limit of 50MB for all files
      const maxSize = 50 * 1024 * 1024; // 50MB for all files (Supabase free tier limit)
      
      if (file.size > maxSize) {
        throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 50MB limit`);
      }

      // Validate file type - support all image and video types
      console.log('📁 File type validation:', {
        mimeType: file.type,
        isImage: isImageFile(file),
        isVideo: isVideoFile(file)
      });
      
      if (!isImageFile(file) && !isVideoFile(file)) {
        throw new Error('Invalid file type. Only image and video files are allowed.');
      }

      // Check authentication first
      console.log('🔐 Checking authentication...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Authentication required for file upload');
      }
      console.log('✅ User authenticated:', user.email);

      // Check if bucket exists (do not try to create it)
      console.log('🪣 Checking bucket exists...');
      const bucketExists = await this.checkBucketExists(bucket);
      if (!bucketExists) {
        throw new Error(`Storage bucket '${bucket}' does not exist. Please run the storage-setup.sql script in your Supabase dashboard.`);
      }
      console.log('✅ Bucket exists and is accessible');

      // Generate unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}-${randomStr}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      console.log('📝 Generated file path:', filePath);

      // Upload file to Supabase Storage with retry logic
      let uploadAttempt = 0;
      const maxAttempts = 3;
      let uploadResult: any;
      let lastError: any;
      
      while (uploadAttempt < maxAttempts) {
        uploadAttempt++;
        console.log(`🔄 Upload attempt ${uploadAttempt}/${maxAttempts}`);
        
        // Use different upload options for different file sizes
        const uploadOptions: any = {
          cacheControl: '3600',
          upsert: uploadAttempt > 1 // Allow overwrite on retry
        };
        
        // Always set content type for better compatibility
        if (file.type) {
          uploadOptions.contentType = file.type;
        }
        
        console.log('⬆️ Upload options:', uploadOptions);
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, uploadOptions);

        if (!error && data) {
          uploadResult = { data, error };
          console.log('✅ Upload successful:', data);
          break;
        }
        
        lastError = error;
        console.error(`❌ Upload attempt ${uploadAttempt} failed:`, {
          message: error?.message,
          statusCode: error?.statusCode,
          error: error
        });
        
        // Check for specific error types
        if (error?.message?.includes('row-level security')) {
          throw new Error('Storage permissions error: Please ensure the storage bucket policies are set up correctly. Run the storage-setup.sql script.');
        }
        
        if (error?.message?.includes('JWT expired') || error?.message?.includes('Invalid JWT')) {
          throw new Error('Authentication expired. Please sign in again.');
        }
        
        if (uploadAttempt === maxAttempts) {
          throw new Error(`Upload failed after ${maxAttempts} attempts. Last error: ${error?.message || 'Unknown error'}`);
        }
        
        // Wait before retry (exponential backoff)
        const waitTime = 1000 * Math.pow(2, uploadAttempt - 1);
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      if (!uploadResult?.data) {
        throw new Error('Upload completed but no data returned');
      }

      // Get public URL
      console.log('🔗 Generating public URL...');
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(uploadResult.data.path);

      console.log('✅ Upload complete! Public URL:', publicUrl);
      
      // Verify the file is accessible
      try {
        const response = await fetch(publicUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.warn('⚠️ Warning: Uploaded file may not be publicly accessible');
        } else {
          console.log('✅ File verified as publicly accessible');
        }
      } catch (verifyError) {
        console.warn('⚠️ Could not verify file accessibility:', verifyError);
      }
      
      return publicUrl;
      
    } catch (error: any) {
      console.error('💥 File upload error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
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
