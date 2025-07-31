import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const { id } = await params;
    
    // Fetch modules with their videos
    const { data: modules, error } = await supabase
      .from('course_modules')
      .select(`
        id,
        title,
        description,
        order_index,
        created_at,
course_videos (
          id,
          title,
          description,
          video_url,
          duration,
          order_index
        ),
        course_materials (
          id,
          title,
          description,
          material_url,
          material_type,
          file_size,
          order_index
        )
      `)
      .eq('course_id', id)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching modules:', error);
      return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });
    }

    // Transform the data to match the expected format
    const transformedModules = modules?.map(module => ({
      ...module,
      videos: module.course_videos || [],
      materials: module.course_materials || []
    })) || [];

    return NextResponse.json(transformedModules);
  } catch (error) {
    console.error('Error in modules GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const { id } = await params;
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, order_index } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: module, error } = await supabase
      .from('course_modules')
      .insert({
        course_id: id,
        title,
        description,
        order_index: order_index || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating module:', error);
      return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
    }

    // Return module with empty videos array
    const moduleWithVideos = {
      ...module,
      videos: []
    };

    return NextResponse.json(moduleWithVideos, { status: 201 });
  } catch (error) {
    console.error('Error in modules POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
