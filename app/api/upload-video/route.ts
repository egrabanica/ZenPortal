import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const video = formData.get('video') as File;
    const filename = formData.get('filename') as string;

    if (!video) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = video.name.split('.').pop();
    const uniqueFilename = `${timestamp}-${filename || `video.${fileExtension}`}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('course-videos')
      .upload(`videos/${uniqueFilename}`, video, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('course-videos')
      .getPublicUrl(`videos/${uniqueFilename}`);

    return NextResponse.json({
      url: publicUrl,
      filename: uniqueFilename,
      originalFilename: video.name,
      size: video.size,
      path: uploadData.path
    });

  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
