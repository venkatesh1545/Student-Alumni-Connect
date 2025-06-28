
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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
    github_url: ''
  });

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
        github_url: profile?.github_url || ''
      });
    }
  }, [alumniProfile, profile]);

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
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url
        })
        .eq('id', user.id);

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['alumni-profile'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    }
  });

  if (isLoading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alumni Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="graduation_year">Graduation Year</Label>
              <Input
                id="graduation_year"
                type="number"
                value={formData.graduation_year}
                onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="experience_years">Experience (Years)</Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="mentorship">Available for Mentorship</Label>
              <Switch
                id="mentorship"
                checked={formData.availability_for_mentorship}
                onCheckedChange={(checked) => setFormData({ ...formData, availability_for_mentorship: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="referrals">Available for Referrals</Label>
              <Switch
                id="referrals"
                checked={formData.availability_for_referrals}
                onCheckedChange={(checked) => setFormData({ ...formData, availability_for_referrals: checked })}
              />
            </div>
          </div>

          <Button
            onClick={() => updateProfileMutation.mutate()}
            disabled={updateProfileMutation.isPending}
            className="w-full"
          >
            {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
