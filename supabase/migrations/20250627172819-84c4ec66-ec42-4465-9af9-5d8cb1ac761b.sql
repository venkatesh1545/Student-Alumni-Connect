
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'alumni', 'admin');

-- Create enum for referral status
CREATE TYPE public.referral_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');

-- Create enum for mentorship status
CREATE TYPE public.mentorship_status AS ENUM ('pending', 'accepted', 'rejected', 'active', 'completed');

-- Create enum for theme preference
CREATE TYPE public.theme_preference AS ENUM ('light', 'dark', 'system');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'student',
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  theme_preference theme_preference DEFAULT 'system',
  avatar_url TEXT,
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student profiles table for additional student-specific data
CREATE TABLE public.student_profiles (
  id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  student_id TEXT,
  cgpa DECIMAL(3,2),
  graduation_year INTEGER,
  department TEXT,
  university TEXT,
  skills TEXT[],
  certifications TEXT[],
  resume_url TEXT,
  resume_text TEXT,
  placement_readiness_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alumni profiles table for additional alumni-specific data
CREATE TABLE public.alumni_profiles (
  id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  company TEXT,
  designation TEXT,
  domain TEXT,
  experience_years INTEGER,
  graduation_year INTEGER,
  department TEXT,
  university TEXT,
  availability_for_mentorship BOOLEAN DEFAULT false,
  availability_for_referrals BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alumni_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  job_type TEXT,
  salary_range TEXT,
  requirements TEXT[],
  keywords TEXT[],
  external_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  status referral_status DEFAULT 'pending',
  message TEXT,
  alumni_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentorship requests table
CREATE TABLE public.mentorship_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status mentorship_status DEFAULT 'pending',
  message TEXT,
  alumni_response TEXT,
  topics TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job matches table (for AI recommendations)
CREATE TABLE public.job_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  similarity_score DECIMAL(5,4),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- RLS Policies for student profiles
CREATE POLICY "Users can view student profiles" ON public.student_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can update own profile" ON public.student_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Students can insert own profile" ON public.student_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- RLS Policies for alumni profiles
CREATE POLICY "Users can view alumni profiles" ON public.alumni_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Alumni can update own profile" ON public.alumni_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Alumni can insert own profile" ON public.alumni_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- RLS Policies for jobs
CREATE POLICY "Users can view active jobs" ON public.jobs FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Alumni can create jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'alumni')
);
CREATE POLICY "Alumni can update own jobs" ON public.jobs FOR UPDATE TO authenticated USING (alumni_id = auth.uid());

-- RLS Policies for referrals
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT TO authenticated USING (
  student_id = auth.uid() OR alumni_id = auth.uid()
);
CREATE POLICY "Students can create referrals" ON public.referrals FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Alumni can update referrals" ON public.referrals FOR UPDATE TO authenticated USING (alumni_id = auth.uid());

-- RLS Policies for mentorship requests
CREATE POLICY "Users can view own mentorship requests" ON public.mentorship_requests FOR SELECT TO authenticated USING (
  student_id = auth.uid() OR alumni_id = auth.uid()
);
CREATE POLICY "Students can create mentorship requests" ON public.mentorship_requests FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Alumni can update mentorship requests" ON public.mentorship_requests FOR UPDATE TO authenticated USING (alumni_id = auth.uid());

-- RLS Policies for job matches
CREATE POLICY "Students can view own job matches" ON public.job_matches FOR SELECT TO authenticated USING (student_id = auth.uid());

-- RLS Policies for badges
CREATE POLICY "Users can view own badges" ON public.badges FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.referrals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mentorship_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_matches;
