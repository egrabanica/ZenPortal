'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, Clock, Users, Star, FileVideo, BookOpen, GraduationCap, Trophy, Target, Award, X } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  duration: string;
  enrolled_count: number;
  rating: number;
  created_at: string;
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

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTotalVideos = () => {
    return modules.reduce((total, module) => total + (module.videos?.length || 0), 0);
  };

  const getTotalDuration = () => {
    const totalSeconds = modules.reduce((total, module) => {
      return total + (module.videos?.reduce((videoTotal, video) => videoTotal + video.duration, 0) || 0);
    }, 0);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleEnroll = () => {
    // TODO: Implement enrollment logic
    setEnrolled(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
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
            <Link href="/courses">
              <Button className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/courses">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
      </div>

      {/* Course Header */}
      <div className="grid gap-8 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge className={getDifficultyColor(course.difficulty)}>
                {course.difficulty}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                {course.rating.toFixed(1)}
              </div>
            </div>
            
            <h1 className="text-4xl font-bold">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {getTotalDuration()}
              </div>
              <div className="flex items-center">
                <FileVideo className="h-4 w-4 mr-1" />
                {getTotalVideos()} videos
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {modules.length} modules
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {course.enrolled_count} enrolled
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Start Learning Today</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join {course.enrolled_count} other students
                  </p>
                </div>
                
                {!enrolled ? (
                  <Button onClick={handleEnroll} className="w-full" size="lg">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Enroll Now - Free
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-muted-foreground">0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Content */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Course Content</h2>
        
        {modules.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No modules available yet</h3>
              <p className="text-muted-foreground">
                This course is still being prepared. Check back soon for content updates.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {modules.map((module, index) => (
                  <AccordionItem key={module.id} value={module.id} className="border-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="text-left">
                          <h3 className="text-lg font-semibold">
                            Module {index + 1}: {module.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{module.videos?.length || 0} videos</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      {module.videos && module.videos.length > 0 ? (
                        <div className="space-y-2">
                          {module.videos.map((video, videoIndex) => (
                            <div 
                              key={video.id} 
                              className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedVideo(video);
                                setIsVideoDialogOpen(true);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                                  <PlayCircle className="h-4 w-4 text-primary" />
                                </div>
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
                          <p>No videos in this module yet</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Video Player Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              {selectedVideo?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={selectedVideo.video_url}
                  controls
                  className="w-full h-full"
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              {selectedVideo.description && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Description</h4>
                  <p className="text-muted-foreground">{selectedVideo.description}</p>
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Duration: {formatDuration(selectedVideo.duration)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsVideoDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
