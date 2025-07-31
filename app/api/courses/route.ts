import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    // Query courses with modules count
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        difficulty,
        category,
        duration,
        enrolled_count,
        rating,
        created_at,
        course_modules(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      // Return empty array if courses table doesn't exist yet
      if (error.code === 'PGRST116' || error.message.includes('relation "courses" does not exist')) {
        return NextResponse.json([]);
      }
      // If relationship error, try without modules count
      if (error.code === 'PGRST200' || error.message.includes('Could not find a relationship')) {
        const { data: basicCourses, error: basicError } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            difficulty,
            category,
            duration,
            enrolled_count,
            rating,
            created_at
          `)
          .order('created_at', { ascending: false });
        
        if (basicError) {
          return NextResponse.json([]);
        }
        
        const transformedCourses = basicCourses?.map(course => ({
          ...course,
          modules_count: 0
        })) || [];
        
        return NextResponse.json(transformedCourses);
      }
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }

    // Transform the data to include modules_count
    const transformedCourses = courses?.map(course => ({
      ...course,
      modules_count: course.course_modules?.[0]?.count || 0
    })) || [];

    return NextResponse.json(transformedCourses);
  } catch (error) {
    console.error('Error in courses GET:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, difficulty, category } = body;

    if (!title || !description || !difficulty || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        title,
        description,
        difficulty,
        category,
        created_by: user.id,
        duration: '0 hours', // Will be calculated based on modules
        enrolled_count: 0,
        rating: 0.0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error in courses POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
