'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, X, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  onDocumentUploaded: (documentData: { url: string; filename: string; size: number; type: string }) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export function DocumentUpload({ 
  onDocumentUploaded, 
  maxSizeMB = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx', '.xls', '.xlsx']
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `Please select a file smaller than ${maxSizeMB}MB`,
        variant: 'destructive',
      });
      return;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      toast({
        title: 'Invalid file type',
        description: `Please select a file with one of these extensions: ${acceptedTypes.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', 'document');

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      onDocumentUploaded({
        url: data.url,
        filename: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type || 'application/octet-stream'
      });

      toast({
        title: 'Document uploaded successfully',
        description: `${selectedFile.name} has been uploaded`,
      });

      // Reset state
      setSelectedFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
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
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
        <div className="text-center">
          <File className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="document-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                Upload Document
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Supported formats: {acceptedTypes.join(', ')} (max {maxSizeMB}MB)
              </span>
            </label>
            <input
              ref={fileInputRef}
              id="document-upload"
              type="file"
              className="hidden"
              accept={acceptedTypes.join(',')}
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isUploading && (
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  Upload
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemoveFile}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isUploading && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-muted-foreground flex items-start space-x-2">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div>
          <p>Acceptable file formats: PDF, Word documents, PowerPoint presentations, Excel spreadsheets, and text files.</p>
          <p className="mt-1">Maximum file size: {maxSizeMB}MB</p>
        </div>
      </div>
    </div>
  );
}
