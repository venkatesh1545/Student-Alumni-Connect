
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LandingPage } from '@/components/landing/LandingPage';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { Header } from '@/components/layout/Header';
import { DashboardHome } from '@/components/dashboard/DashboardHome';
import { JobsPage } from '@/components/jobs/JobsPage';
import { PostJobForm } from '@/components/jobs/PostJobForm';
import { StudentProfile } from '@/components/profile/StudentProfile';
import { MessagesList } from '@/components/messaging/MessagesList';

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

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
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/post-job" element={<PostJobForm />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/messages" element={<MessagesList />} />
          <Route path="/signin" element={<DashboardHome />} />
          <Route path="/signup" element={<DashboardHome />} />
        </Routes>
      </main>
    </div>
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
