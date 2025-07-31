import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => Promise.resolve(cookieStore) });
    const { id, moduleId } = await params;
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the module (videos will be cascade deleted due to foreign key constraint)
    const { error } = await supabase
      .from('course_modules')
      .delete()
      .eq('id', moduleId)
      .eq('course_id', id);

    if (error) {
      console.error('Error deleting module:', error);
      return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Error in module DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => Promise.resolve(cookieStore) });
    const { id, moduleId } = await params;
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, order_index } = body;

    const { data: module, error } = await supabase
      .from('course_modules')
      .update({
        title,
        description,
        order_index,
        updated_at: new Date().toISOString(),
      })
      .eq('id', moduleId)
      .eq('course_id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating module:', error);
      return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
    }

    return NextResponse.json(module);
  } catch (error) {
    console.error('Error in module PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
