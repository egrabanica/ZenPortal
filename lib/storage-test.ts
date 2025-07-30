import { StorageService } from './storage';

export class StorageTestUtils {
  // Test storage connection and permissions
  static async testStorageConnection(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('Testing Supabase storage connection...');
      
      // Test 1: Check storage health
      const isHealthy = await StorageService.checkStorageHealth();
      if (!isHealthy) {
        return {
          success: false,
          message: 'Storage health check failed. Please check your Supabase configuration.',
        };
      }

      // Test 2: Try to ensure bucket exists
      await StorageService.ensureBucketExists('media');
      
      return {
        success: true,
        message: 'Storage connection test passed successfully!',
      };
      
    } catch (error: any) {
      console.error('Storage test failed:', error);
      
      let message = 'Storage test failed: ';
      
      if (error.message.includes('JWT')) {
        message += 'Authentication error. Please check your Supabase keys.';
      } else if (error.message.includes('network')) {
        message += 'Network error. Please check your internet connection.';
      } else if (error.message.includes('bucket')) {
        message += 'Bucket creation failed. Check storage permissions in Supabase dashboard.';
      } else {
        message += error.message;
      }
      
      return {
        success: false,
        message,
        details: error,
      };
    }
  }

  // Test file upload with a small test file
  static async testFileUpload(): Promise<{
    success: boolean;
    message: string;
    url?: string;
  }> {
    try {
      // Create a small test image file (1x1 pixel PNG)
      const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      
      // Convert base64 to blob
      const response = await fetch(testImageData);
      const blob = await response.blob();
      const file = new File([blob], 'test-upload.png', { type: 'image/png' });
      
      console.log('Testing file upload with test image...');
      
      const url = await StorageService.uploadFile(file, 'media');
      
      return {
        success: true,
        message: 'File upload test passed successfully!',
        url,
      };
      
    } catch (error: any) {
      console.error('File upload test failed:', error);
      
      return {
        success: false,
        message: `File upload test failed: ${error.message}`,
      };
    }
  }
}
