'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MediaInput } from '@/components/ui/media-input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

export default function FactCheckPage() {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
  });
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [uploadedMediaData, setUploadedMediaData] = useState<{
    url: string;
    filename: string;
    size: number;
    type: string;
  } | null>(null);
  const { toast } = useToast();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let mediaInfo = '';
      if (uploadedMediaData) {
        mediaInfo = `\nUploaded Media: ${uploadedMediaData.filename} (${(uploadedMediaData.size / 1024 / 1024).toFixed(2)}MB)\nMedia URL: ${window.location.origin}${uploadedMediaData.url}`;
      } else if (mediaFile) {
        mediaInfo = `\nMedia File: ${mediaFile.name} (${(mediaFile.size / 1024 / 1024).toFixed(2)}MB)`;
      } else if (mediaUrl) {
        mediaInfo = `\nMedia URL: ${mediaUrl}`;
      }

      // Submit to server-side API
      const response = await fetch('/api/fact-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          url: formData.url,
          description: formData.description,
          mediaInfo: mediaInfo || 'No media attached',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
      }

      toast({
        title: 'Submission Received',
        description: "Thanks for submitting. We'll review your news and update it in the Fact Check section.",
      });
      
      // Clear form
      setFormData({ title: '', url: '', description: '' });
      setMediaUrl('');
      setMediaFile(null);
      setUploadedMediaData(null);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send submission. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setMediaFile(file);
    // Clear URL when file is selected
    if (file) {
      setMediaUrl('');
    }
  };

  const handleUrlChange = (url: string) => {
    setMediaUrl(url);
    // Clear file when URL is entered
    if (url) {
      setMediaFile(null);
      setUploadedMediaData(null);
    }
  };

  const handleMediaUploaded = (mediaData: { url: string; filename: string; size: number; type: string }) => {
    setUploadedMediaData(mediaData);
    // Clear URL when file is uploaded
    setMediaUrl('');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-red-500" />
          <h1 className="text-4xl font-bold">Fact Check Request</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Submit content you would like our fact-checking team to verify. We aim to
          combat misinformation by providing accurate, well-researched information.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Submit a Fact Check Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title or Claim
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter the claim you want fact-checked"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  Source URL (optional)
                </label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://example.com/article"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Additional Context
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide any additional context or information about the claim"
                  required
                  rows={5}
                />
              </div>

              <MediaInput
                label="Supporting Media (Image or Video) - Optional"
                file={mediaFile}
                url={mediaUrl}
                onFileChange={handleFileChange}
                onUrlChange={handleUrlChange}
                onMediaUploaded={handleMediaUploaded}
              />

              <Button type="submit" className="w-full">
                Submit for Fact-Checking
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}