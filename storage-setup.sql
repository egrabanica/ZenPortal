-- Storage bucket setup for media files
-- Run this in your Supabase SQL editor

-- Create the media bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the media bucket
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload media files" ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow everyone to view/download files (since bucket is public)
CREATE POLICY "Anyone can view media files" ON storage.objects
FOR SELECT 
TO public
USING (bucket_id = 'media');

-- Allow authenticated users to update their uploaded files
CREATE POLICY "Authenticated users can update media files" ON storage.objects
FOR UPDATE 
TO authenticated
USING (bucket_id = 'media');

-- Allow authenticated users to delete their uploaded files
CREATE POLICY "Authenticated users can delete media files" ON storage.objects
FOR DELETE 
TO authenticated
USING (bucket_id = 'media');

-- Alternative: More restrictive policy - only admins can upload
-- Uncomment these and comment out the above if you want only admins to upload

-- CREATE POLICY "Only admins can upload media files" ON storage.objects
-- FOR INSERT 
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'media' AND
--   EXISTS (
--     SELECT 1 FROM profiles 
--     WHERE profiles.id = auth.uid() 
--     AND profiles.role IN ('admin', 'editor')
--   )
-- );

-- CREATE POLICY "Only admins can update media files" ON storage.objects
-- FOR UPDATE 
-- TO authenticated
-- USING (
--   bucket_id = 'media' AND
--   EXISTS (
--     SELECT 1 FROM profiles 
--     WHERE profiles.id = auth.uid() 
--     AND profiles.role IN ('admin', 'editor')
--   )
-- );

-- CREATE POLICY "Only admins can delete media files" ON storage.objects
-- FOR DELETE 
-- TO authenticated
-- USING (
--   bucket_id = 'media' AND
--   EXISTS (
--     SELECT 1 FROM profiles 
--     WHERE profiles.id = auth.uid() 
--     AND profiles.role IN ('admin', 'editor')
--   )
-- );
