
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export const PostJobForm = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'full-time',
    salary_range: '',
    description: '',
    requirements: '',
    keywords: '',
    external_url: ''
  });

  const postJobMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      const jobData = {
        ...formData,
        alumni_id: user.id,
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
      };

      const { error } = await supabase
        .from('jobs')
        .insert(jobData);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Job posted successfully!');
      setFormData({
        title: '',
        company: '',
        location: '',
        job_type: 'full-time',
        salary_range: '',
        description: '',
        requirements: '',
        keywords: '',
        external_url: ''
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to post job');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postJobMutation.mutate();
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Post a New Job</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Remote, San Francisco, CA"
              />
            </div>
            <div>
              <Label htmlFor="job_type">Job Type</Label>
              <Select value={formData.job_type} onValueChange={(value) => setFormData({ ...formData, job_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="salary_range">Salary Range</Label>
              <Input
                id="salary_range"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                placeholder="e.g., $80,000 - $120,000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="requirements">Requirements (one per line)</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={4}
              placeholder="Bachelor's degree in Computer Science&#10;3+ years of experience&#10;Proficiency in React"
            />
          </div>

          <div>
            <Label htmlFor="keywords">Keywords (comma separated)</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="React, JavaScript, Frontend, Web Development"
            />
          </div>

          <div>
            <Label htmlFor="external_url">External Application URL</Label>
            <Input
              id="external_url"
              value={formData.external_url}
              onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
              placeholder="https://company.com/careers/apply"
            />
          </div>

          <Button
            type="submit"
            disabled={postJobMutation.isPending}
            className="w-full"
          >
            {postJobMutation.isPending ? 'Posting...' : 'Post Job'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
