-- Migration: Add author_name column to articles table
-- Run this if you already have an existing articles table

-- Add the author_name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND column_name = 'author_name'
    ) THEN
        ALTER TABLE articles ADD COLUMN author_name TEXT;
        
        -- Optionally populate existing records with author names from profiles
        UPDATE articles 
        SET author_name = profiles.full_name 
        FROM profiles 
        WHERE articles.author_id = profiles.id 
        AND articles.author_name IS NULL;
        
        -- For records where full_name is null, use email
        UPDATE articles 
        SET author_name = profiles.email 
        FROM profiles 
        WHERE articles.author_id = profiles.id 
        AND articles.author_name IS NULL;
    END IF;
END $$;
