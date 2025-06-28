
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

export const StudentProfile = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const { data: studentProfile, isLoading } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user
  });

  const [formData, setFormData] = useState({
    student_id: '',
    cgpa: '',
    graduation_year: '',
    department: '',
    university: '',
    certifications: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    leetcode_url: '',
    geeksforgeeks_url: '',
    codeforces_url: '',
    codechef_url: ''
  });

  React.useEffect(() => {
    if (studentProfile) {
      setFormData({
        student_id: studentProfile.student_id || '',
        cgpa: studentProfile.cgpa?.toString() || '',
        graduation_year: studentProfile.graduation_year?.toString() || '',
        department: studentProfile.department || '',
        university: studentProfile.university || '',
        certifications: studentProfile.certifications?.join('\n') || '',
        linkedin_url: profile?.linkedin_url || '',
        github_url: profile?.github_url || '',
        portfolio_url: '',
        leetcode_url: '',
        geeksforgeeks_url: '',
        codeforces_url: '',
        codechef_url: ''
      });
      setSkills(studentProfile.skills || []);
    }
  }, [studentProfile, profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      // Update student profile
      const studentData = {
        id: user.id,
        student_id: formData.student_id,
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        department: formData.department,
        university: formData.university,
        skills: skills,
        certifications: formData.certifications.split('\n').filter(cert => cert.trim())
      };

      const { error: studentError } = await supabase
        .from('student_profiles')
        .upsert(studentData);

      if (studentError) throw studentError;

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
      queryClient.invalidateQueries({ queryKey: ['student-profile'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    }
  });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  if (isLoading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="student_id">Student ID</Label>
              <Input
                id="student_id"
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="cgpa">CGPA</Label>
              <Input
                id="cgpa"
                type="number"
                step="0.01"
                max="4.0"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
            />
          </div>

          <div>
            <Label>Skills</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} type="button">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="certifications">Certifications (one per line)</Label>
            <Textarea
              id="certifications"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              rows={4}
            />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="portfolio_url">Portfolio URL</Label>
              <Input
                id="portfolio_url"
                value={formData.portfolio_url}
                onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="leetcode_url">LeetCode URL</Label>
              <Input
                id="leetcode_url"
                value={formData.leetcode_url}
                onChange={(e) => setFormData({ ...formData, leetcode_url: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="geeksforgeeks_url">GeeksforGeeks URL</Label>
              <Input
                id="geeksforgeeks_url"
                value={formData.geeksforgeeks_url}
                onChange={(e) => setFormData({ ...formData, geeksforgeeks_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="codeforces_url">Codeforces URL</Label>
              <Input
                id="codeforces_url"
                value={formData.codeforces_url}
                onChange={(e) => setFormData({ ...formData, codeforces_url: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="codechef_url">CodeChef URL</Label>
            <Input
              id="codechef_url"
              value={formData.codechef_url}
              onChange={(e) => setFormData({ ...formData, codechef_url: e.target.value })}
            />
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
