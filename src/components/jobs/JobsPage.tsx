
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { JobCard } from './JobCard';
import { toast } from 'sonner';

export const JobsPage = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

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

  const applyMutation = useMutation({
    mutationFn: async (jobId: string) => {
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
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to apply for job');
    }
  });

  if (isLoading) {
    return <div className="p-6">Loading jobs...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Available Jobs</h1>
      
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
              onApply={(jobId) => applyMutation.mutate(jobId)}
              userRole={profile?.role}
            />
          ))}
        </div>
      )}
    </div>
  );
};
