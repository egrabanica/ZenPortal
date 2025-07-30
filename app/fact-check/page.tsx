'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function FactCheckPage() {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement fact check submission
    toast({
      title: 'Submission Received',
      description: 'Thank you for contributing to fact-checking. Our team will review your submission.',
    });
    setFormData({ title: '', url: '', description: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold">Fact Check Request</h1>
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