import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; videoId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { videoId } = await params;
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get video info before deletion to clean up storage
    const { data: video, error: fetchError } = await supabase
      .from('course_videos')
      .select('video_url')
      .eq('id', videoId)
      .single();

    if (fetchError) {
      console.error('Error fetching video:', fetchError);
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Delete video from database
    const { error: deleteError } = await supabase
      .from('course_videos')
      .delete()
      .eq('id', videoId);

    if (deleteError) {
      console.error('Error deleting video:', deleteError);
      return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
    }

    // If video was uploaded to our storage, delete it from storage too
    if (video.video_url && video.video_url.includes('course-videos')) {
      try {
        // Extract the file path from the URL
        const urlParts = video.video_url.split('/');
        const bucketPath = urlParts.slice(-2).join('/'); // Get "videos/filename"
        
        const { error: storageError } = await supabase.storage
          .from('course-videos')
          .remove([bucketPath]);

        if (storageError) {
          console.warn('Failed to delete video from storage:', storageError);
          // Don't fail the request if storage deletion fails
        }
      } catch (storageError) {
        console.warn('Error cleaning up video storage:', storageError);
      }
    }

    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error in video DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; videoId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { videoId } = await params;
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, video_url, duration, order_index } = body;

    const { data: video, error } = await supabase
      .from('course_videos')
      .update({
        title,
        description,
        video_url,
        duration,
        order_index,
      })
      .eq('id', videoId)
      .select()
      .single();

    if (error) {
      console.error('Error updating video:', error);
      return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error in video PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
