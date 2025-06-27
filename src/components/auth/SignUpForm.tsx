
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

export const SignUpForm = ({ onSwitchToSignIn }: SignUpFormProps) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.role) {
      toast.error('Please select your role');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role
      });
      toast.success('Account created successfully! Please check your email to verify your account.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">First Name</Label>
          <div className="relative mt-1">
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              placeholder="John"
              required
              className="pl-10 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
            />
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div>
          <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Last Name</Label>
          <div className="relative mt-1">
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              placeholder="Doe"
              required
              className="pl-10 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
            />
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
        <div className="relative mt-1">
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="john.doe@example.com"
            required
            className="pl-10 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
          />
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div>
        <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Role</Label>
        <div className="relative mt-1">
          <Select value={formData.role} onValueChange={(value) => updateFormData('role', value)}>
            <SelectTrigger className="pl-10 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="alumni">Alumni</SelectItem>
            </SelectContent>
          </Select>
          <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
        <div className="relative mt-1">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            placeholder="Enter your password"
            required
            className="pl-10 pr-10 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
          />
          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
        <div className="relative mt-1">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            required
            className="pl-10 pr-10 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
          />
          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 dark:from-teal-400 dark:to-blue-500 dark:hover:from-teal-500 dark:hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>

      <div className="text-center">
        <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-teal-600 dark:text-teal-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors duration-300"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};
