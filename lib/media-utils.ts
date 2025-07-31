/**
 * Utility functions for media type detection
 */

/**
 * Determine if a file or URL is a video based on MIME type and extension
 */
export function isVideoFile(file: File): boolean {
  // Check MIME type first
  if (file.type.startsWith('video/')) {
    return true;
  }
  
  // If MIME type is not available or not recognized, check extension
  const fileName = file.name.toLowerCase();
  const videoExtensions = [
    '.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv', '.m4v',
    '.3gp', '.3g2', '.asf', '.f4v', '.m2v', '.m4p', '.mpg', '.mpeg',
    '.mpe', '.mpv', '.mp2', '.svi', '.vob', '.drc', '.ogv', '.ogg',
    '.gifv', '.mng', '.qt', '.yuv', '.rm', '.rmvb', '.viv', '.amv',
    '.m2ts', '.mts', '.ts', '.dvr-ms'
  ];
  
  return videoExtensions.some(ext => fileName.endsWith(ext));
}

/**
 * Determine if a file is an image based on MIME type and extension
 */
export function isImageFile(file: File): boolean {
  // Check MIME type first
  if (file.type.startsWith('image/')) {
    return true;
  }
  
  // If MIME type is not available or not recognized, check extension
  const fileName = file.name.toLowerCase();
  const imageExtensions = [
    '.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.tif',
    '.svg', '.ico', '.heic', '.heif', '.avif', '.jfif', '.pjpeg', '.pjp'
  ];
  
  return imageExtensions.some(ext => fileName.endsWith(ext));
}

/**
 * Determine media type from file
 */
export function getMediaTypeFromFile(file: File): 'image' | 'video' | null {
  if (isImageFile(file)) {
    return 'image';
  }
  if (isVideoFile(file)) {
    return 'video';
  }
  return null;
}

/**
 * Determine if a URL points to a video based on common patterns
 */
export function isVideoUrl(url: string): boolean {
  const urlLower = url.toLowerCase();
  
  // Check for video file extensions in URL
  const videoExtensions = [
    '.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv', '.m4v',
    '.3gp', '.3g2', '.asf', '.f4v', '.m2v', '.m4p', '.mpg', '.mpeg',
    '.mpe', '.mpv', '.mp2', '.svi', '.vob', '.drc', '.ogv', '.ogg',
    '.gifv', '.mng', '.qt', '.yuv', '.rm', '.rmvb', '.viv', '.amv',
    '.m2ts', '.mts', '.ts', '.dvr-ms'
  ];
  
  const hasVideoExtension = videoExtensions.some(ext => urlLower.includes(ext));
  
  // Check for common video hosting patterns
  const videoHosts = [
    'youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com',
    'twitch.tv', 'facebook.com/video', 'instagram.com/p/',
    'tiktok.com', 'streamable.com'
  ];
  
  const hasVideoHost = videoHosts.some(host => urlLower.includes(host));
  
  // Check for generic video indicators
  const videoIndicators = ['video', '/v/', '/watch'];
  const hasVideoIndicator = videoIndicators.some(indicator => urlLower.includes(indicator));
  
  return hasVideoExtension || hasVideoHost || hasVideoIndicator;
}

/**
 * Determine media type from URL
 */
export function getMediaTypeFromUrl(url: string): 'image' | 'video' | null {
  if (isVideoUrl(url)) {
    return 'video';
  }
  
  // Check for image extensions
  const urlLower = url.toLowerCase();
  const imageExtensions = [
    '.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.tif',
    '.svg', '.ico', '.heic', '.heif', '.avif', '.jfif', '.pjpeg', '.pjp'
  ];
  
  const hasImageExtension = imageExtensions.some(ext => urlLower.includes(ext));
  
  if (hasImageExtension) {
    return 'image';
  }
  
  // Default to image for unknown URLs (backward compatibility)
  return 'image';
}
