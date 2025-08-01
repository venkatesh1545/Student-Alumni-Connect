
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LandingPage } from '@/components/landing/LandingPage';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { VerificationSuccessPage } from '@/pages/VerificationSuccessPage';
import { DashboardHome } from '@/components/dashboard/DashboardHome';
import { JobsPage } from '@/components/jobs/JobsPage';
import { PostJobForm } from '@/components/jobs/PostJobForm';
import { ManageJobs } from '@/components/jobs/ManageJobs';
import { StudentProfile } from '@/components/profile/StudentProfile';
import { AlumniProfile } from '@/components/profile/AlumniProfile';
import { MessagesList } from '@/components/messaging/MessagesList';
import { MyApplications } from '@/components/applications/MyApplications';
import { ManageApplications } from '@/components/applications/ManageApplications';
import { MentorshipHub } from '@/components/mentorship/MentorshipHub';
import { AlumniLayout } from '@/components/layout/AlumniLayout';
import { StudentLayout } from '@/components/layout/StudentLayout';

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-bold text-white">SA</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verification-success" element={<VerificationSuccessPage />} />
      </Routes>
    );
  }

  // Alumni users get sidebar layout
  if (profile?.role === 'alumni') {
    return (
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/post-job" element={
          <AlumniLayout breadcrumb={{ items: [{ label: 'Post Job' }] }}>
            <PostJobForm />
          </AlumniLayout>
        } />
        <Route path="/manage-jobs" element={
          <AlumniLayout breadcrumb={{ items: [{ label: 'Manage Jobs' }] }}>
            <ManageJobs />
          </AlumniLayout>
        } />
        <Route path="/manage-applications" element={
          <AlumniLayout breadcrumb={{ items: [{ label: 'Applications' }] }}>
            <ManageApplications />
          </AlumniLayout>
        } />
        <Route path="/mentorship" element={
          <AlumniLayout breadcrumb={{ items: [{ label: 'Mentorship' }] }}>
            <MentorshipHub />
          </AlumniLayout>
        } />
        <Route path="/messages" element={
          <AlumniLayout breadcrumb={{ items: [{ label: 'Messages' }] }}>
            <MessagesList />
          </AlumniLayout>
        } />
        <Route path="/alumni-profile" element={
          <AlumniLayout breadcrumb={{ items: [{ label: 'Profile' }] }}>
            <AlumniProfile />
          </AlumniLayout>
        } />
        <Route path="/signin" element={<DashboardHome />} />
        <Route path="/signup" element={<DashboardHome />} />
        <Route path="/verification-success" element={<DashboardHome />} />
      </Routes>
    );
  }

  // Student users get the new sidebar layout
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="/jobs" element={
        <StudentLayout breadcrumb={{ items: [{ label: 'Browse Jobs' }] }}>
          <JobsPage />
        </StudentLayout>
      } />
      <Route path="/profile" element={
        <StudentLayout breadcrumb={{ items: [{ label: 'Profile' }] }}>
          <StudentProfile />
        </StudentLayout>
      } />
      <Route path="/applications" element={
        <StudentLayout breadcrumb={{ items: [{ label: 'My Applications' }] }}>
          <MyApplications />
        </StudentLayout>
      } />
      <Route path="/mentorship" element={
        <StudentLayout breadcrumb={{ items: [{ label: 'Mentorship' }] }}>
          <MentorshipHub />
        </StudentLayout>
      } />
      <Route path="/messages" element={
        <StudentLayout breadcrumb={{ items: [{ label: 'Messages' }] }}>
          <MessagesList />
        </StudentLayout>
      } />
      <Route path="/signin" element={<DashboardHome />} />
      <Route path="/signup" element={<DashboardHome />} />
      <Route path="/verification-success" element={<DashboardHome />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <AppContent />
            <Toaster 
              position="top-right"
              theme="light"
              className="dark:hidden"
            />
            <Toaster 
              position="top-right"
              theme="dark"
              className="hidden dark:block"
            />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
