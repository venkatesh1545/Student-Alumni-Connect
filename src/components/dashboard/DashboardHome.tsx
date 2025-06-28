
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StudentDashboard } from './StudentDashboard';
import { AlumniDashboard } from './AlumniDashboard';

export const DashboardHome = () => {
  const { profile } = useAuth();

  if (profile?.role === 'student') {
    return <StudentDashboard />;
  }

  if (profile?.role === 'alumni') {
    return <AlumniDashboard />;
  }

  // Default fallback
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold mb-4">Welcome to Smart Alumni</h1>
      <p className="text-gray-600">Please complete your profile setup.</p>
    </div>
  );
};
