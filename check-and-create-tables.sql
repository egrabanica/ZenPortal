-- Check if tables exist and create them if they don't
-- Run this in your Supabase SQL editor

-- Check if course_modules table exists and create it
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check if course_videos table exists and create it
CREATE TABLE IF NOT EXISTS course_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration INTEGER DEFAULT 0, -- duration in seconds
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS course_modules_course_id_idx ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS course_videos_module_id_idx ON course_videos(module_id);

-- Enable Row Level Security
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Course modules are viewable by everyone" ON course_modules;
DROP POLICY IF EXISTS "Admins can manage course modules" ON course_modules;
DROP POLICY IF EXISTS "Course videos are viewable by everyone" ON course_videos;
DROP POLICY IF EXISTS "Admins can manage course videos" ON course_videos;

-- Create policies for course modules
CREATE POLICY "Course modules are viewable by everyone" ON course_modules
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage course modules" ON course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Create policies for course videos
CREATE POLICY "Course videos are viewable by everyone" ON course_videos
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage course videos" ON course_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );
