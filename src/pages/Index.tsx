
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHome } from '@/components/dashboard/DashboardHome';

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // Auth page will be shown by App.tsx
  }

  return <DashboardHome />;
};

export default Index;
