
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { JobCard } from './JobCard';
import { JobApplicationModal } from './JobApplicationModal';
import { toast } from 'sonner';

export const JobsPage = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          alumni:profiles!jobs_alumni_id_fkey(first_name, last_name, linkedin_url)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { data: studentProfile } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user
  });

  const applyMutation = useMutation({
    mutationFn: async ({ jobId, coverLetter }: { jobId: string; coverLetter: string }) => {
      if (!user) return;

      // Check if already applied
      const { data: existingApplication } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('student_id', user.id)
        .single();

      if (existingApplication) {
        throw new Error('You have already applied for this job');
      }

      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          student_id: user.id,
          status: 'applied'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Application submitted successfully! You will receive a confirmation email.');
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to apply for job');
    }
  });

  const handleApply = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleSubmitApplication = (coverLetter: string) => {
    if (selectedJob) {
      applyMutation.mutate({ jobId: selectedJob.id, coverLetter });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Available Jobs</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover job opportunities posted by our alumni network
        </p>
      </div>
      
      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No jobs available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={() => handleApply(job)}
              userRole={profile?.role}
            />
          ))}
        </div>
      )}

      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
        onApply={handleSubmitApplication}
        studentProfile={studentProfile}
      />
    </div>
  );
};
