
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { SocialLinksSection } from './sections/SocialLinksSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { InternshipsSection } from './sections/InternshipsSection';
import { AchievementsSection } from './sections/AchievementsSection';

export const StudentProfile = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);

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
    phone: '',
    bio: '',
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
        phone: profile?.phone || '',
        bio: profile?.bio || '',
        linkedin_url: profile?.linkedin_url || '',
        github_url: profile?.github_url || '',
        portfolio_url: '',
        leetcode_url: '',
        geeksforgeeks_url: '',
        codeforces_url: '',
        codechef_url: ''
      });
      setSkills(studentProfile.skills || []);
      setProjects(JSON.parse(studentProfile.projects || '[]'));
      setInternships(JSON.parse(studentProfile.internships || '[]'));
      setAchievements(JSON.parse(studentProfile.achievements || '[]'));
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
        projects: JSON.stringify(projects),
        internships: JSON.stringify(internships),
        achievements: JSON.stringify(achievements)
      };

      const { error: studentError } = await supabase
        .from('student_profiles')
        .upsert(studentData);

      if (studentError) throw studentError;

      // Update main profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
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
      queryClient.invalidateQueries({ queryKey: ['student-profile'] });
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Complete your profile to improve job matching and showcase your skills to alumni
        </p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoSection formData={formData} setFormData={setFormData} />
        </TabsContent>

        <TabsContent value="education">
          <EducationSection formData={formData} setFormData={setFormData} />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsSection skills={skills} setSkills={setSkills} />
        </TabsContent>

        <TabsContent value="social">
          <SocialLinksSection formData={formData} setFormData={setFormData} />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsSection projects={projects} setProjects={setProjects} />
        </TabsContent>

        <TabsContent value="experience">
          <InternshipsSection internships={internships} setInternships={setInternships} />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsSection achievements={achievements} setAchievements={setAchievements} />
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
