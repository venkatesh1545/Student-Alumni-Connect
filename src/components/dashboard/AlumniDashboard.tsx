
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, MessageSquare, Award, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AlumniDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Posted Jobs', value: '3', icon: Briefcase, color: 'blue' },
    { label: 'Connections', value: '24', icon: Users, color: 'green' },
    { label: 'Messages', value: '12', icon: MessageSquare, color: 'purple' },
    { label: 'Referrals Made', value: '8', icon: Award, color: 'orange' }
  ];

  const quickActions = [
    { title: 'Post New Job', description: 'Share job opportunities with students', action: () => navigate('/post-job') },
    { title: 'View Applications', description: 'Review student applications', action: () => navigate('/applications') },
    { title: 'Messages', description: 'Connect with students', action: () => navigate('/messages') },
    { title: 'My Profile', description: 'Update your alumni profile', action: () => navigate('/profile') }
  ];

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
            <Card key={index} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
            <CardHeader>
              <CardTitle className="text-purple-800 dark:text-purple-200">{action.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-600 dark:text-purple-300 mb-4">{action.description}</p>
              <Button variant="outline" className="w-full">
                {action.title.includes('Post') ? <Plus className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
