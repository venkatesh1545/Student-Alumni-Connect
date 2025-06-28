
import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

export const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <AuthLayout
      title={isSignIn ? 'Welcome Back' : 'Join Us'}
      subtitle={isSignIn ? 'Connect with your alumni network' : 'Connect students and alumni worldwide'}
    >
      {isSignIn ? (
        <SignInForm />
      ) : (
        <SignUpForm />
      )}
    </AuthLayout>
  );
};
