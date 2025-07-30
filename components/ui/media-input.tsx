'use client';

import * as React from 'react';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface MediaInputProps {
  onFileChange: (file: File | null) => void;
  onUrlChange: (url: string) => void;
  file: File | null;
  url: string;
  className?: string;
  label?: string;
}

export function MediaInput({
  onFileChange,
  onUrlChange,
  file,
  url,
  className,
  label,
}: MediaInputProps) {
  const [activeTab, setActiveTab] = React.useState('upload');

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex space-x-2 border-b">
        <Button
          variant={activeTab === 'upload' ? 'ghost' : 'secondary'}
          onClick={() => setActiveTab('upload')}
          className={cn(
            "px-4 py-2 rounded-t-md",
            activeTab === 'upload' && "border-b-2 border-primary"
          )}
        >
          Upload
        </Button>
        <Button
          variant={activeTab === 'url' ? 'ghost' : 'secondary'}
          onClick={() => setActiveTab('url')}
          className={cn(
            "px-4 py-2 rounded-t-md",
            activeTab === 'url' && "border-b-2 border-primary"
          )}
        >
          URL
        </Button>
      </div>
      <div className="pt-4">
        {activeTab === 'upload' ? (
          <div>
            <Input
              type="file"
              onChange={(e) => onFileChange(e.target.files?.[0] || null)}
              accept=".jpg, .jpeg, .png, .webp, .mp4, .mov"
            />
            {file && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{file.name}</p>
                {file.type.startsWith('image') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="mt-2 max-h-48 rounded-md"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="mt-2 max-h-48 rounded-md"
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <Input
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Paste media URL"
          />
        )}
      </div>
    </div>
  );
}
