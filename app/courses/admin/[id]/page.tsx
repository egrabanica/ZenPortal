'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MediaInput } from '@/components/ui/media-input';
import { FileInput } from '@/components/ui/file-input';
import { DocumentUpload } from '@/components/ui/document-upload';
import { useToast } from '@/hooks/use-toast';
import { StorageService } from '@/lib/storage';
import { isVideoFile } from '@/lib/media-utils';
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
  materials: Material[];
}

interface Video {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  duration: number;
  order_index: number;
}

interface Material {
  id: string;
  title: string;
  description?: string;
  material_url: string;
  material_type: string;
  file_size?: number;
  order_index: number;
}

interface NewModule {
  title: string;
  description: string;
}

interface NewMaterial {
  title: string;
  description: string;
  material_url: string;
  material_type: string;
  file_size: number;
}

interface NewVideo {
  title: string;
  description: string;
  video_url: string;
  duration: number;
  video_file: File | null;
}

export default function CourseManagementPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const [selectedMaterialModuleId, setSelectedMaterialModuleId] = useState<string | null>(null);
  const [newMaterial, setNewMaterial] = useState<NewMaterial>({ title: '', description: '', material_url: '', material_type: 'other', file_size: 0 });
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [newModule, setNewModule] = useState<NewModule>({ title: '', description: '' });
  const [newVideo, setNewVideo] = useState<NewVideo>({ title: '', description: '', video_url: '', duration: 0, video_file: null });
  const [isEditModuleDialogOpen, setIsEditModuleDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
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

  const handleVideoFileChange = (file: File | null) => {
    setNewVideo(prev => ({
      ...prev,
      video_file: file,
      video_url: file ? '' : prev.video_url // Clear URL if file is selected
    }));
  };

  const handleVideoUrlChange = (url: string) => {
    setNewVideo(prev => ({
      ...prev,
      video_url: url,
      video_file: url ? null : prev.video_file // Clear file if URL is entered
    }));
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialModuleId) {
      toast({
        title: 'Error',
        description: 'No module selected for material.',
        variant: 'destructive',
      });
      return;
    }

    if (!newMaterial.title.trim() || !newMaterial.material_url.trim()) {
      toast({
        title: 'Error',
        description: 'Material title and URL are required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/modules/${selectedMaterialModuleId}/materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMaterial),
      });

      const responseData = await response.json();
      if (response.ok) {
        toast({
          title: 'Material Added',
          description: 'Your material has been added to the module successfully.',
        });
        setIsMaterialDialogOpen(false);
        setSelectedMaterialModuleId(null);
        setNewMaterial({ title: '', description: '', material_url: '', material_type: 'other', file_size: 0 });
        fetchModules();
      } else {
        throw new Error(responseData.error || `Server error: ${response.status}`);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add material. Please try again.',
        variant: 'destructive',
      });
    }
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

    if (!newVideo.video_url.trim() && !newVideo.video_file) {
      toast({
        title: 'Error',
        description: 'Please provide either a video file or video URL.',
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
      let finalVideoUrl = newVideo.video_url;
      
      // If a file was selected, upload it first
      if (newVideo.video_file) {
        if (!isVideoFile(newVideo.video_file)) {
          toast({
            title: 'Error',
            description: 'Please select a valid video file.',
            variant: 'destructive',
          });
          return;
        }
        
        toast({
          title: 'Uploading Video',
          description: 'Please wait while your video is being uploaded...',
        });
        
        try {
          finalVideoUrl = await StorageService.uploadFile(newVideo.video_file);
        } catch (uploadError: any) {
          toast({
            title: 'Upload Failed',
            description: uploadError.message || 'Failed to upload video file.',
            variant: 'destructive',
          });
          return;
        }
      }
      
      const response = await fetch(`/api/courses/${courseId}/modules/${selectedModuleId}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newVideo.title,
          description: newVideo.description,
          video_url: finalVideoUrl,
          duration: newVideo.duration,
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
        setNewVideo({ title: '', description: '', video_url: '', duration: 0, video_file: null });
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

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setIsEditModuleDialogOpen(true);
  };

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    try {
      const response = await fetch(`/api/courses/${courseId}/modules/${editingModule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingModule.title,
          description: editingModule.description,
          order_index: editingModule.order_index,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Module Updated',
          description: 'The module has been updated successfully.',
        });
        setIsEditModuleDialogOpen(false);
        setEditingModule(null);
        fetchModules();
      } else {
        throw new Error('Failed to update module');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update module. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openMaterialDialog = (moduleId: string) => {
    setSelectedMaterialModuleId(moduleId);
    setIsMaterialDialogOpen(true);
  };

  const openVideoDialog = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setIsVideoDialogOpen(true);
  };

  const handleDeleteVideo = async (courseId: string, moduleId: string, videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/modules/${moduleId}/videos/${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Video Deleted',
          description: 'The video has been deleted successfully.',
        });
        fetchModules(); // Refresh the modules to update the video list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete video');
      }
    } catch (error) {
      console.error('Delete video error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete video. Please try again.',
        variant: 'destructive',
      });
    }
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
              <div className="flex items-center gap-4">
                <AccordionTrigger className="flex-1 px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold">
                          {module.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-11">{module.description}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mr-4">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4" />
                        <span>{module.videos?.length || 0} videos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileVideo className="h-4 w-4" />
                        <span>{module.materials?.length || 0} materials</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <div className="px-4 py-2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditModule(module)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteModule(module.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
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
                        <div key={video.id} className="flex items-center justify-between p-3 border rounded group">
                          <div className="flex items-center gap-3">
                            <FileVideo className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{video.title}</p>
                              {video.description && (
                                <p className="text-sm text-muted-foreground">{video.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {formatDuration(video.duration)}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVideo(courseId, module.id, video.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-opacity"
                              title="Delete video"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Materials</h4>
                    <Button size="sm" onClick={() => openMaterialDialog(module.id)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Material
                    </Button>
                  </div>

                  {/* Material list */}
                  {module.materials && module.materials.length > 0 ? (
                    <div className="space-y-2">
                      {module.materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <FileVideo className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{material.title}</p>
                              {material.description && (
                                <p className="text-sm text-muted-foreground">{material.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            {material.material_type}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileVideo className="h-12 w-12 mx-auto mb-2" />
                      <p>No materials added yet</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {/* Material Upload Dialog */}
        <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Material to Module</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateMaterial} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="material-title" className="text-sm font-medium">
                  Material Title
                </label>
                <Input
                  id="material-title"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  placeholder="Enter material title"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="material-description" className="text-sm font-medium">
                  Description (optional)
                </label>
                <Textarea
                  id="material-description"
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  placeholder="Enter material description"
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <DocumentUpload
                  onDocumentUploaded={(data) => {
                    setNewMaterial({
                      ...newMaterial,
                      material_url: data.url,
                      material_type: data.type,
                      file_size: data.size
                    });
                  }}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={!newMaterial.material_url}
                >
                  Add Material
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsMaterialDialogOpen(false);
                    setSelectedMaterialModuleId(null);
                    setNewMaterial({ title: '', description: '', material_url: '', material_type: 'other', file_size: 0 });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

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

            <MediaInput
              label="Video"
              file={newVideo.video_file}
              url={newVideo.video_url}
              onFileChange={handleVideoFileChange}
              onUrlChange={handleVideoUrlChange}
            />

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={!newVideo.video_url && !newVideo.video_file}
              >
                Add Video
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsVideoDialogOpen(false);
                  setSelectedModuleId(null);
                  setNewVideo({ title: '', description: '', video_url: '', duration: 0, video_file: null });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Module Dialog */}
      <Dialog open={isEditModuleDialogOpen} onOpenChange={setIsEditModuleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
          </DialogHeader>
          {editingModule && (
            <form onSubmit={handleUpdateModule} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="edit-module-title" className="text-sm font-medium">
                  Module Title
                </label>
                <Input
                  id="edit-module-title"
                  value={editingModule.title}
                  onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                  placeholder="Enter module title"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-module-description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="edit-module-description"
                  value={editingModule.description}
                  onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                  placeholder="Enter module description"
                  required
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">Update Module</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModuleDialogOpen(false);
                    setEditingModule(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
