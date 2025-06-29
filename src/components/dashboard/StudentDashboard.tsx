
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, MessageSquare, Award, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  // Get student applications count
  const { data: applicationsCount = 0 } = useQuery({
    queryKey: ['applications-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', user.id);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user
  });

  // Get messages count
  const { data: messagesCount = 0 } = useQuery({
    queryKey: ['messages-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user
  });

  // Get student profile completion score
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

  // Get active jobs count for matching
  const { data: activeJobsCount = 0 } = useQuery({
    queryKey: ['active-jobs-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      if (error) throw error;
      return count || 0;
    }
  });

  // Calculate profile completion score
  const calculateProfileScore = () => {
    if (!profile || !studentProfile) return 0;
    
    let score = 0;
    const fields = [
      profile.first_name,
      profile.last_name,
      profile.email,
      profile.phone,
      profile.bio,
      studentProfile.university,
      studentProfile.department,
      studentProfile.graduation_year,
      studentProfile.cgpa,
      studentProfile.skills?.length > 0,
      profile.linkedin_url,
      profile.github_url
    ];
    
    const filledFields = fields.filter(field => field && field !== '').length;
    score = Math.round((filledFields / fields.length) * 100);
    
    return score;
  };

  const profileScore = calculateProfileScore();

  const stats = [
    { 
      label: 'Job Matches', 
      value: activeJobsCount.toString(), 
      icon: Briefcase, 
      color: 'blue',
      description: 'Available positions'
    },
    { 
      label: 'Applications', 
      value: applicationsCount.toString(), 
      icon: FileText, 
      color: 'green',
      description: 'Jobs applied to'
    },
    { 
      label: 'Messages', 
      value: messagesCount.toString(), 
      icon: MessageSquare, 
      color: 'purple',
      description: 'From alumni'
    },
    { 
      label: 'Profile Score', 
      value: `${profileScore}%`, 
      icon: Award, 
      color: 'orange',
      description: 'Completion level'
    }
  ];

  const quickActions = [
    { 
      title: 'Browse Jobs', 
      description: 'Find matching job opportunities', 
      action: () => navigate('/jobs'),
      color: 'blue'
    },
    { 
      title: 'Update Profile', 
      description: 'Complete your student profile', 
      action: () => navigate('/profile'),
      color: 'green'
    },
    { 
      title: 'View Messages', 
      description: 'Check messages from alumni', 
      action: () => navigate('/messages'),
      color: 'purple'
    },
    { 
      title: 'My Applications', 
      description: 'Track your job applications', 
      action: () => navigate('/applications'),
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
          Student Dashboard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Welcome back, {profile?.first_name}! Find your dream job and connect with alumni
        </p>
        {profileScore < 70 && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-yellow-800 dark:text-yellow-200">
              🚀 Complete your profile to improve job matching! ({profileScore}% completed)
            </p>
          </div>
        )}
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
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={action.action}>
            <CardHeader>
              <CardTitle className={`text-${action.color}-800 dark:text-${action.color}-200 group-hover:text-${action.color}-600`}>
                {action.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-${action.color}-600 dark:text-${action.color}-300 mb-4`}>
                {action.description}
              </p>
              <Button variant="outline" className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent transition-all">
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
