
-- Create messages table for communication between students and alumni
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_applications table for students to apply to jobs
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, student_id)
);

-- Enable Row Level Security for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security for job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- RLS policies for messages - users can only see messages they sent or received
CREATE POLICY "Users can view their own messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their sent messages" 
  ON public.messages 
  FOR UPDATE 
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their sent messages" 
  ON public.messages 
  FOR DELETE 
  USING (auth.uid() = sender_id);

-- RLS policies for job_applications - students can view their applications, alumni can view applications for their jobs
CREATE POLICY "Students can view their own applications" 
  ON public.job_applications 
  FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Alumni can view applications for their jobs" 
  ON public.job_applications 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = job_applications.job_id 
      AND jobs.alumni_id = auth.uid()
    )
  );

CREATE POLICY "Students can create job applications" 
  ON public.job_applications 
  FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own applications" 
  ON public.job_applications 
  FOR UPDATE 
  USING (auth.uid() = student_id);

CREATE POLICY "Students can delete their own applications" 
  ON public.job_applications 
  FOR DELETE 
  USING (auth.uid() = student_id);
