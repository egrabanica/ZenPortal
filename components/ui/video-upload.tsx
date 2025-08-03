'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, PlayCircle, FileVideo } from 'lucide-react';

interface VideoUploadProps {
  onVideoUploaded?: (videoData: {
    url: string;
    filename: string;
    size: number;
    duration?: number;
  }) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

export function VideoUpload({
  onVideoUploaded,
  maxSizeMB = 300,
  acceptedFormats = ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
  className = ''
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      toast({
        title: 'Invalid File Type',
        description: `Please select a video file (${acceptedFormats.join(', ')})`,
        variant: 'destructive',
      });
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: 'File Too Large',
        description: `Please select a video file smaller than ${maxSizeMB}MB`,
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('filename', selectedFile.name);

      // Start upload progress simulation
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Upload to API
      const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      });

      clearInterval(uploadInterval);

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = response.statusText || `HTTP ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }
      setUploadProgress(100);

      // Get video duration (if browser supports it)
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      const getDuration = new Promise<number>((resolve) => {
        video.addEventListener('loadedmetadata', () => {
          resolve(video.duration);
        });
        video.addEventListener('error', () => {
          resolve(0); // Fallback to 0 if duration can't be determined
        });
      });

      video.src = previewUrl!;
      const duration = await getDuration;

      const videoData = {
        url: result.url,
        filename: result.originalFilename,
        size: selectedFile.size,
        duration: duration
      };

      onVideoUploaded?.(videoData);
      
      toast({
        title: 'Upload Successful',
        description: 'Your video has been uploaded successfully.',
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload video. Please try again.',
        variant: 'destructive',
      });
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="video-upload">Upload Video</Label>
        <div className="flex items-center gap-4">
          <Input
            id="video-upload"
            type="file"
            ref={fileInputRef}
            accept={acceptedFormats.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Video
          </Button>
          <span className="text-sm text-muted-foreground">
            Max size: {maxSizeMB}MB
          </span>
        </div>
      </div>

      {selectedFile && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {previewUrl ? (
                  <div className="relative">
                    <video
                      src={previewUrl}
                      className="w-32 h-20 object-cover rounded border"
                      controls={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                      <PlayCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-20 bg-muted rounded flex items-center justify-center">
                    <FileVideo className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{selectedFile.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
                
                {isUploading && (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!isUploading && uploadProgress === 0 && (
                  <Button size="sm" onClick={handleUpload}>
                    Upload
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRemove}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
