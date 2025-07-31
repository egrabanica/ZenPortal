'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { VideoUpload } from '@/components/ui/video-upload';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, PlayCircle, Clock, FileVideo } from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  videos: Video[];
}

interface Video {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  duration: number;
  order_index: number;
}

interface NewModule {
  title: string;
  description: string;
}

interface NewVideo {
  title: string;
  description: string;
  video_url: string;
  duration: number;
}

export default function CourseManagementPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [newModule, setNewModule] = useState<NewModule>({ title: '', description: '' });
  const [newVideo, setNewVideo] = useState<NewVideo>({ title: '', description: '', video_url: '', duration: 0 });
  const { toast } = useToast();

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchModules();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/modules`);
      if (response.ok) {
        const data = await response.json();
        setModules(data);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newModule,
          order_index: modules.length
        }),
      });

      if (response.ok) {
        toast({
          title: 'Module Created',
          description: 'Your module has been created successfully.',
        });
        setIsModuleDialogOpen(false);
        setNewModule({ title: '', description: '' });
        fetchModules();
      } else {
        throw new Error('Failed to create module');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create module. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleVideoUploaded = (videoData: { url: string; filename: string; size: number; duration?: number }) => {
    setNewVideo(prev => ({
      ...prev,
      video_url: videoData.url,
      duration: videoData.duration || 0
    }));
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId) {
      toast({
        title: 'Error',
        description: 'No module selected.',
        variant: 'destructive',
      });
      return;
    }

    if (!newVideo.title.trim()) {
      toast({
        title: 'Error',
        description: 'Video title is required.',
        variant: 'destructive',
      });
      return;
    }

    if (!newVideo.video_url.trim()) {
      toast({
        title: 'Error',
        description: 'Video URL is required.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Creating video with data:', {
      courseId,
      selectedModuleId,
      videoData: newVideo
    });

    try {
      const response = await fetch(`/api/courses/${courseId}/modules/${selectedModuleId}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newVideo,
          order_index: 0 // Will be updated based on existing videos
        }),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        toast({
          title: 'Video Added',
          description: 'Your video has been added to the module successfully.',
        });
        setIsVideoDialogOpen(false);
        setSelectedModuleId(null);
        setNewVideo({ title: '', description: '', video_url: '', duration: 0 });
        fetchModules();
      } else {
        throw new Error(responseData.error || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Video creation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add video. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? All videos in this module will also be deleted.')) return;

    try {
      const response = await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Module Deleted',
          description: 'The module has been deleted successfully.',
        });
        fetchModules();
      } else {
        throw new Error('Failed to delete module');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete module. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openVideoDialog = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setIsVideoDialogOpen(true);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Course not found.</p>
            <Link href="/courses/admin">
              <Button className="mt-4">Back to Course Management</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
          </div>
          <Link href="/courses/admin">
            <Button variant="outline">Back to Courses</Button>
          </Link>
        </div>

        <div className="flex gap-4">
          <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Module</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateModule} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="module-title" className="text-sm font-medium">
                    Module Title
                  </label>
                  <Input
                    id="module-title"
                    value={newModule.title}
                    onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                    placeholder="Enter module title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="module-description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="module-description"
                    value={newModule.description}
                    onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                    placeholder="Enter module description"
                    required
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">Add Module</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModuleDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {modules.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <PlayCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No modules created yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first module to start adding course content.
            </p>
            <Button onClick={() => setIsModuleDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Module
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {modules.map((module, index) => (
            <AccordionItem key={module.id} value={module.id} className="border rounded-lg">
              <div className="flex items-center">
                <AccordionTrigger className="flex-1 px-6 py-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">
                        Module {index + 1}: {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mr-4">
                      <span>{module.videos?.length || 0} videos</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <div className="px-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteModule(module.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Videos</h4>
                    <Button
                      size="sm"
                      onClick={() => openVideoDialog(module.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Video
                    </Button>
                  </div>

                  {module.videos && module.videos.length > 0 ? (
                    <div className="space-y-2">
                      {module.videos.map((video, videoIndex) => (
                        <div key={video.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <FileVideo className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{video.title}</p>
                              {video.description && (
                                <p className="text-sm text-muted-foreground">{video.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileVideo className="h-12 w-12 mx-auto mb-2" />
                      <p>No videos added yet</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Video Upload Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Video to Module</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateVideo} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="video-title" className="text-sm font-medium">
                Video Title
              </label>
              <Input
                id="video-title"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                placeholder="Enter video title"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="video-description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="video-description"
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                placeholder="Enter video description"
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm font-medium mb-2">Upload Video or Use URL</p>
                  </div>
                  
                  <VideoUpload
                    onVideoUploaded={handleVideoUploaded}
                    maxSizeMB={500}
                  />
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">or</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="video-url" className="text-sm font-medium">
                      Video URL (Direct Link)
                    </label>
                    <Input
                      id="video-url"
                      type="url"
                      value={newVideo.video_url}
                      onChange={(e) => setNewVideo({ ...newVideo, video_url: e.target.value })}
                      placeholder="https://example.com/video.mp4"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a direct link to a video file or use the upload option above
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={!newVideo.video_url}
              >
                Add Video
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsVideoDialogOpen(false);
                  setSelectedModuleId(null);
                  setNewVideo({ title: '', description: '', video_url: '', duration: 0 });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
