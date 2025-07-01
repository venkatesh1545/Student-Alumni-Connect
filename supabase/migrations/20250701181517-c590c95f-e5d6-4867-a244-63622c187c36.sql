
-- Add avatar storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add college and stream fields to student profiles
ALTER TABLE student_profiles 
ADD COLUMN college_name TEXT,
ADD COLUMN stream TEXT CHECK (stream IN ('CSE', 'ECE', 'IT', 'MECH', 'CIVIL', 'OTHER')),
ADD COLUMN job_type_preference TEXT CHECK (job_type_preference IN ('tech', 'non-tech', 'both'));

-- Add preferred colleges field to jobs table for alumni referrals
ALTER TABLE jobs 
ADD COLUMN preferred_colleges TEXT[],
ADD COLUMN interview_questions TEXT;

-- Update profiles table to store avatar URLs from storage
-- (avatar_url field already exists, no need to add it)
