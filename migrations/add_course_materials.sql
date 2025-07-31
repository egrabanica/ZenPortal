-- Create course materials table
CREATE TABLE IF NOT EXISTS course_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  material_url TEXT NOT NULL,
  material_type TEXT CHECK (material_type IN ('pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx', 'other')) DEFAULT 'other',
  file_size BIGINT, -- file size in bytes
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for course materials
CREATE INDEX IF NOT EXISTS course_materials_module_id_idx ON course_materials(module_id);

-- Enable Row Level Security for course materials
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

-- Create policies for course materials
CREATE POLICY "Course materials are viewable by everyone" ON course_materials
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage course materials" ON course_materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );
