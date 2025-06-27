
import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignUpForm } from '@/components/auth/SignUpForm';

export const SignUpPage = () => {
  return (
    <AuthLayout
      title="Join Us"
      subtitle="Connect students and alumni worldwide"
    >
      <SignUpForm />
    </AuthLayout>
  );
};
