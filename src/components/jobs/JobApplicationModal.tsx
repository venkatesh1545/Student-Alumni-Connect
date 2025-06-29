
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, GraduationCap } from 'lucide-react';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  onApply: (coverLetter: string) => void;
  studentProfile?: any;
}

export const JobApplicationModal = ({ isOpen, onClose, job, onApply, studentProfile }: JobApplicationModalProps) => {
  const { profile } = useAuth();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    onApply(coverLetter);
    onClose();
  };

  const handleTermsChange = (checked: boolean | 'indeterminate') => {
    setAgreedToTerms(checked === true);
  };

  const ProfilePreview = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Resume Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              <span>{profile?.first_name} {profile?.last_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{profile?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{profile?.phone || 'Not provided'}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="w-4 h-4 text-gray-500" />
              <span>{studentProfile?.university || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{studentProfile?.department || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {studentProfile?.cgpa && (
          <div>
            <span className="text-sm font-medium">CGPA: </span>
            <span className="text-sm">{studentProfile.cgpa}/4.0</span>
          </div>
        )}

        {studentProfile?.skills && studentProfile.skills.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {studentProfile.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}

        {profile?.bio && (
          <div>
            <h4 className="font-medium mb-2">About</h4>
            <p className="text-sm text-gray-600">{profile.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" 
               className="text-blue-500 hover:underline">
              LinkedIn Profile
            </a>
          )}
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" 
               className="text-gray-700 hover:underline">
              GitHub Profile
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {job?.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{job?.title}</CardTitle>
              <p className="text-gray-600">{job?.company} • {job?.location}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{job?.description?.substring(0, 200)}...</p>
              {job?.salary_range && (
                <p className="text-sm font-medium text-green-600">Salary: {job.salary_range}</p>
              )}
            </CardContent>
          </Card>

          <div>
            <Label htmlFor="cover_letter">Cover Letter (Optional)</Label>
            <Textarea
              id="cover_letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a brief cover letter explaining why you're interested in this position..."
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              className="w-full"
            >
              {showPreview ? 'Hide' : 'Preview'} Resume Information
            </Button>

            {showPreview && <ProfilePreview />}
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={handleTermsChange}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </Label>
                <p className="text-xs text-muted-foreground">
                  By applying, you agree that your profile information will be shared with the employer
                  and you confirm that all information provided is accurate.
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Application Questions:</h4>
              <div className="space-y-2 text-sm">
                <p>• Are you legally authorized to work in this location?</p>
                <p>• Do you meet the minimum requirements for this position?</p>
                <p>• Are you willing to relocate if required?</p>
                <p className="text-xs text-gray-500 mt-2">
                  Note: These questions will be addressed during the interview process.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!agreedToTerms}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Submit Application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
