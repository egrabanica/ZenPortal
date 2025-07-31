import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => Promise.resolve(cookieStore) });
    const { moduleId } = await params;
    
    const { data: materials, error } = await supabase
      .from('course_materials')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching materials:', error);
      return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
    }

    return NextResponse.json(materials || []);
  } catch (error) {
    console.error('Error in materials GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => Promise.resolve(cookieStore) });
    const { moduleId } = await params;
    
    // Check if user is authenticated and has admin/editor role
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, material_url, material_type, file_size, order_index } = body;

    if (!title || !material_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the current number of materials in the module to set order_index
    const { data: existingMaterials, error: countError } = await supabase
      .from('course_materials')
      .select('id')
      .eq('module_id', moduleId);

    if (countError) {
      console.error('Error counting materials:', countError);
    }

    const nextOrderIndex = order_index !== undefined ? order_index : (existingMaterials?.length || 0);

    const { data: material, error } = await supabase
      .from('course_materials')
      .insert({
        module_id: moduleId,
        title,
        description,
        material_url,
        material_type: material_type || 'other',
        file_size: file_size || null,
        order_index: nextOrderIndex,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating material:', error);
      return NextResponse.json({ error: 'Failed to create material' }, { status: 500 });
    }

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error('Error in materials POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerComponentClient({ cookies: () => Promise.resolve(cookieStore) });
    
    // Check if user is authenticated and has admin/editor role
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const materialId = url.searchParams.get('materialId');

    if (!materialId) {
      return NextResponse.json({ error: 'Material ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('course_materials')
      .delete()
      .eq('id', materialId);

    if (error) {
      console.error('Error deleting material:', error);
      return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in materials DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
