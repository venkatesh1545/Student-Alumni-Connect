
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, MessageSquare, Award, Plus, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AlumniLayout } from '@/components/layout/AlumniLayout';

export const AlumniDashboard = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['alumni-dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get jobs posted
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, is_active')
        .eq('alumni_id', user.id);

      // Get applications received
      const { data: applications } = await supabase
        .from('job_applications')
        .select(`
          id, 
          status,
          job:jobs!inner(alumni_id)
        `)
        .eq('job.alumni_id', user.id);

      // Get mentorship requests
      const { data: mentorshipRequests } = await supabase
        .from('mentorship_requests')
        .select('id, status')
        .eq('alumni_id', user.id);

      // Get messages
      const { data: messages } = await supabase
        .from('messages')
        .select('id')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      return {
        totalJobs: jobs?.length || 0,
        activeJobs: jobs?.filter(job => job.is_active)?.length || 0,
        totalApplications: applications?.length || 0,
        pendingMentorshipRequests: mentorshipRequests?.filter(req => req.status === 'pending')?.length || 0,
        totalMessages: messages?.length || 0
      };
    },
    enabled: !!user
  });

  const { data: recentApplications } = useQuery({
    queryKey: ['recent-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job:jobs!inner(title, company, alumni_id),
          student:profiles!job_applications_student_id_fkey(first_name, last_name)
        `)
        .eq('job.alumni_id', user.id)
        .order('applied_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const stats = [
    { 
      label: 'Active Jobs', 
      value: `${dashboardStats?.activeJobs || 0}/${dashboardStats?.totalJobs || 0}`, 
      icon: Briefcase, 
      color: 'blue'
    },
    { 
      label: 'New Applications', 
      value: dashboardStats?.totalApplications || 0, 
      icon: Users, 
      color: 'green'
    },
    { 
      label: 'Pending Mentorship', 
      value: dashboardStats?.pendingMentorshipRequests || 0, 
      icon: Award, 
      color: 'orange'
    },
    { 
      label: 'Messages', 
      value: dashboardStats?.totalMessages || 0, 
      icon: MessageSquare, 
      color: 'purple'
    }
  ];

  if (isLoading) {
    return (
      <AlumniLayout breadcrumb={{ items: [{ label: 'Dashboard' }] }}>
        <div className="space-y-6">
          <div className="text-center py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </AlumniLayout>
    );
  }

  return (
    <AlumniLayout breadcrumb={{ items: [{ label: 'Dashboard' }] }}>
      <div className="space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            Welcome back, {profile?.first_name}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Here's your alumni dashboard overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                    <Icon className={`w-4 h-4 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentApplications && recentApplications.length > 0 ? (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {application.student?.first_name} {application.student?.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Applied for {application.job?.title} at {application.job?.company}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(application.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate('/manage-applications')}
                      >
                        View All Applications
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No recent applications</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  onClick={() => navigate('/post-job')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/manage-jobs')}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Manage Jobs
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/manage-applications')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Applications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AlumniLayout>
  );
};
