
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github, Linkedin, Globe, Code2, Terminal } from 'lucide-react';

interface SocialLinksSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const SocialLinksSection = ({ formData, setFormData }: SocialLinksSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media & Portfolio Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin_url" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn URL
            </Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github_url" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub URL
            </Label>
            <Input
              id="github_url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/yourusername"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="portfolio_url" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Portfolio URL
            </Label>
            <Input
              id="portfolio_url"
              value={formData.portfolio_url}
              onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
              placeholder="https://yourportfolio.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leetcode_url" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              LeetCode URL
            </Label>
            <Input
              id="leetcode_url"
              value={formData.leetcode_url}
              onChange={(e) => setFormData({ ...formData, leetcode_url: e.target.value })}
              placeholder="https://leetcode.com/yourusername"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="geeksforgeeks_url" className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              GeeksforGeeks URL
            </Label>
            <Input
              id="geeksforgeeks_url"
              value={formData.geeksforgeeks_url}
              onChange={(e) => setFormData({ ...formData, geeksforgeeks_url: e.target.value })}
              placeholder="https://auth.geeksforgeeks.org/user/yourusername"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codeforces_url" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Codeforces URL
            </Label>
            <Input
              id="codeforces_url"
              value={formData.codeforces_url}
              onChange={(e) => setFormData({ ...formData, codeforces_url: e.target.value })}
              placeholder="https://codeforces.com/profile/yourusername"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
