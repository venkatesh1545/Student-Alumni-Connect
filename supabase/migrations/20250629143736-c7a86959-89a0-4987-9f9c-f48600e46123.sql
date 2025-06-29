
-- Add missing columns to student_profiles table
ALTER TABLE public.student_profiles 
ADD COLUMN IF NOT EXISTS projects jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS internships jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS achievements jsonb DEFAULT '[]'::jsonb;
