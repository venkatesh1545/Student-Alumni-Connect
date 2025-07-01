
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileImageUpload } from '@/components/profile/ProfileImageUpload';
import { useAuth } from '@/contexts/AuthContext';

interface PersonalInfoSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const PersonalInfoSection = ({ formData, setFormData }: PersonalInfoSectionProps) => {
  const { profile } = useAuth();

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return 'U';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-6">
          <ProfileImageUpload
            currentImageUrl={profile?.avatar_url || ''}
            userInitials={getInitials()}
            size="lg"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="student_id">Student ID</Label>
            <Input
              id="student_id"
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="college_name">College Name</Label>
            <Input
              id="college_name"
              value={formData.college_name}
              onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
              placeholder="Enter your college name"
            />
          </div>
          <div>
            <Label htmlFor="stream">Stream</Label>
            <Select value={formData.stream} onValueChange={(value) => setFormData({ ...formData, stream: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your stream" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CSE">Computer Science Engineering</SelectItem>
                <SelectItem value="ECE">Electronics & Communication</SelectItem>
                <SelectItem value="IT">Information Technology</SelectItem>
                <SelectItem value="MECH">Mechanical Engineering</SelectItem>
                <SelectItem value="CIVIL">Civil Engineering</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="job_type_preference">Job Type Preference</Label>
          <Select value={formData.job_type_preference} onValueChange={(value) => setFormData({ ...formData, job_type_preference: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technical</SelectItem>
              <SelectItem value="non-tech">Non-Technical</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
