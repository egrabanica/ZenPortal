import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for large video uploads

export async function POST(request: NextRequest) {
  try {
    console.log('🎥 Video upload request received');
    
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);

    let formData;
    try {
      formData = await request.formData();
    } catch (formError) {
      console.error('❌ FormData parsing error:', formError);
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const video = formData.get('video') as File;
    const filename = formData.get('filename') as string;

    console.log('📁 File info:', {
      hasVideo: !!video,
      filename: filename,
      videoName: video?.name,
      videoSize: video?.size,
      videoType: video?.type
    });

    if (!video || !(video instanceof File)) {
      console.log('❌ No valid video file provided');
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = video.name.split('.').pop() || 'mp4';
    const uniqueFilename = `${timestamp}-${filename || video.name}`;
    const storagePath = `videos/${uniqueFilename}`;

    console.log('📝 Upload details:', {
      uniqueFilename,
      storagePath,
      fileSize: video.size
    });

    // Convert file to buffer
    let buffer;
    try {
      const bytes = await video.arrayBuffer();
      buffer = Buffer.from(bytes);
      console.log('✅ File converted to buffer, size:', buffer.length);
    } catch (bufferError) {
      console.error('❌ Buffer conversion error:', bufferError);
      return NextResponse.json({ error: 'Failed to process video file' }, { status: 500 });
    }

    // Upload to Supabase Storage
    console.log('☁️ Starting Supabase upload...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('course-videos')
      .upload(storagePath, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: video.type || 'video/mp4'
      });

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError);
      
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      console.log('Available buckets:', buckets?.map(b => b.name));
      
      return NextResponse.json({ 
        error: `Upload failed: ${uploadError.message}`,
        details: uploadError
      }, { status: 500 });
    }

    console.log('✅ Upload successful:', uploadData);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('course-videos')
      .getPublicUrl(storagePath);

    console.log('🔗 Public URL generated:', publicUrl);

    const responseData = {
      url: publicUrl,
      filename: uniqueFilename,
      originalFilename: video.name,
      size: video.size,
      path: uploadData.path
    };

    console.log('✅ Returning success response:', responseData);
    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('💥 Video upload error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
