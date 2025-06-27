
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, MessageSquare, Award } from 'lucide-react';

export const DashboardHome = () => {
  const { profile } = useAuth();

  const getRoleSpecificContent = () => {
    switch (profile?.role) {
      case 'student':
        return {
          title: 'Student Dashboard',
          subtitle: 'Connect with alumni and discover opportunities',
          stats: [
            { label: 'Job Matches', value: '8', icon: Briefcase, color: 'blue' },
            { label: 'Alumni Connections', value: '12', icon: Users, color: 'green' },
            { label: 'Active Applications', value: '3', icon: MessageSquare, color: 'purple' },
            { label: 'Profile Score', value: '85%', icon: Award, color: 'orange' }
          ]
        };
      case 'alumni':
        return {
          title: 'Alumni Dashboard',
          subtitle: 'Mentor students and share opportunities',
          stats: [
            { label: 'Posted Jobs', value: '3', icon: Briefcase, color: 'blue' },
            { label: 'Student Connections', value: '24', icon: Users, color: 'green' },
            { label: 'Pending Requests', value: '5', icon: MessageSquare, color: 'purple' },
            { label: 'Referrals Made', value: '8', icon: Award, color: 'orange' }
          ]
        };
      default:
        return {
          title: 'Welcome to Smart Alumni',
          subtitle: 'Your platform for meaningful connections',
          stats: [
            { label: 'Total Users', value: '1,234', icon: Users, color: 'blue' },
            { label: 'Active Jobs', value: '89', icon: Briefcase, color: 'green' },
            { label: 'Connections Made', value: '456', icon: MessageSquare, color: 'purple' },
            { label: 'Success Rate', value: '92%', icon: Award, color: 'orange' }
          ]
        };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
          {content.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {content.subtitle}
        </p>
        <div className="mt-4">
          <Badge variant="secondary" className="capitalize">
            {profile?.role || 'User'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-600 dark:text-blue-300">
              {profile?.role === 'student' 
                ? 'Browse jobs, connect with alumni, or update your profile'
                : profile?.role === 'alumni'
                ? 'Post a job, mentor students, or manage referrals'
                : 'Manage the platform and view analytics'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-800 dark:text-purple-200">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-600 dark:text-purple-300">
              Stay updated with your latest connections and opportunities
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
