'use client';

import * as React from 'react';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { UploadCloud, Link, Trash2 } from 'lucide-react';

export interface MediaInputProps {
  onFileChange: (file: File | null) => void;
  onUrlChange: (url: string) => void;
  file: File | null;
  url: string;
  className?: string;
  label?: string;
  onRemoveImage?: () => void;
}

export function MediaInput({
  onFileChange,
  onUrlChange,
  file,
  url,
  className,
  label,
  onRemoveImage
}: MediaInputProps) {
  const [activeTab, setActiveTab] = React.useState(file ? 'upload' : 'url');
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [file]);

  return (
    <div className={cn('space-y-3', className)}>
      {label && <Label>{label}</Label>}
      
      {(preview || url) && (
        <div className="relative group">
          <div className="rounded-lg overflow-hidden border border-dashed border-gray-300 dark:border-gray-700 p-2">
            {preview && file?.type.startsWith('image') && (
              <img src={preview} alt="Preview" className="max-h-48 rounded-md mx-auto" />
            )}
            {preview && file?.type.startsWith('video') && (
              <video src={preview} controls className="max-h-48 rounded-md mx-auto" />
            )}
            {url && !preview && (
              <div className="text-center py-4">
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">{url}</a>
              </div>
            )}
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              onFileChange(null);
              onUrlChange('');
              setPreview(null);
              if (onRemoveImage) onRemoveImage();
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )}

      {!preview && !url && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => setActiveTab('upload')} className={cn(activeTab === 'upload' && 'bg-gray-100 dark:bg-gray-800')}>
              <UploadCloud className="mr-2 h-4 w-4" /> Upload File
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('url')} className={cn(activeTab === 'url' && 'bg-gray-100 dark:bg-gray-800')}>
              <Link className="mr-2 h-4 w-4" /> Use URL
            </Button>
          </div>

          <div className="mt-4">
            {activeTab === 'upload' ? (
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Input
                    type="file"
                    id="file-upload"
                    onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                    accept=".jpg, .jpeg, .png, .webp, .gif, .mp4, .mov, .avi, .webm"
                    className="sr-only"
                  />
                  <span className="text-sm text-blue-500 hover:underline">Select a file</span>
                </label>
                <p className="text-xs text-muted-foreground mt-2">Support formats: JPG, PNG, WEBP, GIF, MP4, MOV, AVI, WEBM (max 20MB)</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => onUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">Enter a direct link to an image or video</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
