import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { moduleId } = await params;
    
    const { data: videos, error } = await supabase
      .from('course_videos')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }

    return NextResponse.json(videos || []);
  } catch (error) {
    console.error('Error in videos GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { moduleId } = await params;
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, video_url, duration, order_index } = body;

    if (!title || !video_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the current number of videos in the module to set order_index
    const { data: existingVideos, error: countError } = await supabase
      .from('course_videos')
      .select('id')
      .eq('module_id', moduleId);

    if (countError) {
      console.error('Error counting videos:', countError);
    }

    const nextOrderIndex = order_index !== undefined ? order_index : (existingVideos?.length || 0);

    const { data: video, error } = await supabase
      .from('course_videos')
      .insert({
        module_id: moduleId,
        title,
        description,
        video_url,
        duration: duration || 0,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating video:', error);
      return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
    }

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error in videos POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
