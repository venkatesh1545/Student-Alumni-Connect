
import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignInForm } from '@/components/auth/SignInForm';

export const SignInPage = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Connect with your alumni network"
    >
      <SignInForm />
    </AuthLayout>
  );
};
