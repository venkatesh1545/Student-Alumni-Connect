import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileImageUpload } from '@/components/profile/ProfileImageUpload';
import { toast } from 'sonner';

export const AlumniProfile = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: alumniProfile, isLoading } = useQuery({
    queryKey: ['alumni-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user
  });

  const [formData, setFormData] = useState({
    company: '',
    designation: '',
    department: '',
    university: '',
    graduation_year: '',
    experience_years: '',
    domain: '',
    availability_for_mentorship: false,
    availability_for_referrals: false,
    linkedin_url: '',
    github_url: '',
    bio: '',
    phone: '',
    first_name: '',
    last_name: ''
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  React.useEffect(() => {
    if (alumniProfile) {
      setFormData({
        company: alumniProfile.company || '',
        designation: alumniProfile.designation || '',
        department: alumniProfile.department || '',
        university: alumniProfile.university || '',
        graduation_year: alumniProfile.graduation_year?.toString() || '',
        experience_years: alumniProfile.experience_years?.toString() || '',
        domain: alumniProfile.domain || '',
        availability_for_mentorship: alumniProfile.availability_for_mentorship || false,
        availability_for_referrals: alumniProfile.availability_for_referrals || false,
        linkedin_url: profile?.linkedin_url || '',
        github_url: profile?.github_url || '',
        bio: profile?.bio || '',
        phone: profile?.phone || '',
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || ''
      });
    }
  }, [alumniProfile, profile]);

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      // Update alumni profile
      const alumniData = {
        id: user.id,
        company: formData.company,
        designation: formData.designation,
        department: formData.department,
        university: formData.university,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        domain: formData.domain,
        availability_for_mentorship: formData.availability_for_mentorship,
        availability_for_referrals: formData.availability_for_referrals
      };

      const { error: alumniError } = await supabase
        .from('alumni_profiles')
        .upsert(alumniData);

      if (alumniError) throw alumniError;

      // Update main profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          bio: formData.bio,
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url
        })
        .eq('id', user.id);

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['alumni-profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Alumni Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Complete your profile to help students and connect with the community
        </p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-6">
                <ProfileImageUpload
                  currentImageUrl={profile?.avatar_url || ''}
                  userInitials={getInitials()}
                  size="lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself and your professional journey..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company">Current Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="designation">Current Designation</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="domain">Domain/Industry</Label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="e.g., Software Development, Data Science, Finance"
                  />
                </div>
                <div>
                  <Label htmlFor="experience_years">Years of Experience</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="graduation_year">Graduation Year</Label>
                <Input
                  id="graduation_year"
                  type="number"
                  value={formData.graduation_year}
                  onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Community Involvement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="mentorship" className="text-base font-medium">Available for Mentorship</Label>
                    <p className="text-sm text-gray-600 mt-1">Help students with career guidance and industry insights</p>
                  </div>
                  <Switch
                    id="mentorship"
                    checked={formData.availability_for_mentorship}
                    onCheckedChange={(checked) => setFormData({ ...formData, availability_for_mentorship: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="referrals" className="text-base font-medium">Available for Referrals</Label>
                    <p className="text-sm text-gray-600 mt-1">Refer qualified students for job opportunities</p>
                  </div>
                  <Switch
                    id="referrals"
                    checked={formData.availability_for_referrals}
                    onCheckedChange={(checked) => setFormData({ ...formData, availability_for_referrals: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-center">
        <Button
          onClick={() => updateProfileMutation.mutate()}
          disabled={updateProfileMutation.isPending}
          className="px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {updateProfileMutation.isPending ? 'Updating Profile...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
};
