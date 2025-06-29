
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, MessageSquare, Award, Plus, Eye, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        shortlistedApplications: applications?.filter(app => app.status === 'shortlisted')?.length || 0,
        totalMentorshipRequests: mentorshipRequests?.length || 0,
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
      color: 'blue',
      description: 'Jobs currently active'
    },
    { 
      label: 'Applications', 
      value: dashboardStats?.totalApplications || 0, 
      icon: Users, 
      color: 'green',
      description: 'Total applications received'
    },
    { 
      label: 'Shortlisted', 
      value: dashboardStats?.shortlistedApplications || 0, 
      icon: CheckCircle, 
      color: 'purple',
      description: 'Candidates shortlisted'
    },
    { 
      label: 'Mentorship', 
      value: `${dashboardStats?.pendingMentorshipRequests || 0}/${dashboardStats?.totalMentorshipRequests || 0}`, 
      icon: Award, 
      color: 'orange',
      description: 'Pending/Total requests'
    }
  ];

  const quickActions = [
    { 
      title: 'Post New Job', 
      description: 'Share job opportunities with students', 
      action: () => navigate('/post-job'),
      icon: Plus
    },
    { 
      title: 'Manage Jobs', 
      description: 'Edit and manage your job postings', 
      action: () => navigate('/manage-jobs'),
      icon: Briefcase
    },
    { 
      title: 'View Applications', 
      description: 'Review student applications', 
      action: () => navigate('/manage-applications'),
      icon: Users
    },
    { 
      title: 'Mentorship Hub', 
      description: 'Mentor students and build connections', 
      action: () => navigate('/mentorship'),
      icon: Award
    },
    { 
      title: 'Messages', 
      description: 'Connect with students', 
      action: () => navigate('/messages'),
      icon: MessageSquare
    },
    { 
      title: 'My Profile', 
      description: 'Update your alumni profile', 
      action: () => navigate('/alumni-profile'),
      icon: Eye
    }
  ];

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
          Alumni Dashboard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Welcome back, {profile?.first_name}! Help students succeed in their careers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <Icon className={`w-4 h-4 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/manage-applications')}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No recent applications</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {quickActions.slice(0, 3).map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                <CardHeader>
                  <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-600 dark:text-purple-300 mb-4 text-sm">{action.description}</p>
                  <Button variant="outline" className="w-full" size="sm">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.slice(3).map((action, index) => {
          const Icon = action.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
              <CardHeader>
                <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-600 dark:text-purple-300 mb-4 text-sm">{action.description}</p>
                <Button variant="outline" className="w-full" size="sm">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
