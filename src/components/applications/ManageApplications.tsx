
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Eye, Filter, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

export const ManageApplications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['alumni-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job:jobs!inner(
            id,
            title,
            company,
            location,
            alumni_id,
            keywords
          ),
          student:profiles!job_applications_student_id_fkey(
            id,
            first_name,
            last_name,
            email,
            linkedin_url,
            github_url
          ),
          student_profile:student_profiles!job_applications_student_id_fkey(
            cgpa,
            graduation_year,
            department,
            university,
            skills,
            projects,
            internships,
            achievements
          )
        `)
        .eq('job.alumni_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Application status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['alumni-applications'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update application status');
    }
  });

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      app.student?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'applied': return 'default';
      case 'reviewed': return 'secondary';
      case 'shortlisted': return 'outline';
      case 'rejected': return 'destructive';
      case 'hired': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shortlisted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'hired': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const calculateMatchScore = (studentProfile: any, jobKeywords: string[]) => {
    if (!studentProfile?.skills || !jobKeywords || !Array.isArray(studentProfile.skills)) return 0;
    
    const studentSkills = studentProfile.skills.map((skill: string) => skill.toLowerCase());
    const matchingSkills = jobKeywords.filter(keyword => 
      studentSkills.some(skill => skill.includes(keyword.toLowerCase()))
    );
    
    return Math.round((matchingSkills.length / jobKeywords.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manage Applications</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Review and manage applications for your job postings
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by student name or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">No applications found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredApplications.map((application) => {
            const matchScore = calculateMatchScore(
              application.student_profile?.[0], 
              application.job?.keywords || []
            );

            return (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {application.student?.first_name} {application.student?.last_name}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">
                        Applied for: {application.job?.title} at {application.job?.company}
                      </p>
                      <p className="text-sm text-gray-500">
                        Applied: {new Date(application.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(application.status)} className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        {application.status}
                      </Badge>
                      {matchScore > 0 && (
                        <Badge variant="outline">
                          {matchScore}% Match
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(application.student_profile?.[0]?.skills) && 
                        application.student_profile[0].skills.slice(0, 3).map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))
                      }
                      {Array.isArray(application.student_profile?.[0]?.skills) && 
                        application.student_profile[0].skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{application.student_profile[0].skills.length - 3} more
                          </Badge>
                        )
                      }
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Select
                        value={application.status}
                        onValueChange={(status) => 
                          updateApplicationStatus.mutate({ 
                            applicationId: application.id, 
                            status 
                          })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Application Details - {selectedApplication?.student?.first_name} {selectedApplication?.student?.last_name}
            </DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Name</Label>
                      <p>{selectedApplication.student?.first_name} {selectedApplication.student?.last_name}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p>{selectedApplication.student?.email}</p>
                    </div>
                    <div>
                      <Label>University</Label>
                      <p>{selectedApplication.student_profile?.[0]?.university}</p>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <p>{selectedApplication.student_profile?.[0]?.department}</p>
                    </div>
                    <div>
                      <Label>CGPA</Label>
                      <p>{selectedApplication.student_profile?.[0]?.cgpa}</p>
                    </div>
                    <div>
                      <Label>Graduation Year</Label>
                      <p>{selectedApplication.student_profile?.[0]?.graduation_year}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Skills</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Array.isArray(selectedApplication.student_profile?.[0]?.skills) &&
                          selectedApplication.student_profile[0].skills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                    <div>
                      <Label>Projects</Label>
                      <p className="text-sm">
                        {Array.isArray(selectedApplication.student_profile?.[0]?.projects) 
                          ? selectedApplication.student_profile[0].projects.length 
                          : 0
                        } projects
                      </p>
                    </div>
                    <div>
                      <Label>Internships</Label>
                      <p className="text-sm">
                        {Array.isArray(selectedApplication.student_profile?.[0]?.internships) 
                          ? selectedApplication.student_profile[0].internships.length 
                          : 0
                        } internships
                      </p>
                    </div>
                    <div>
                      <Label>LinkedIn</Label>
                      {selectedApplication.student?.linkedin_url ? (
                        <a 
                          href={selectedApplication.student.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Profile
                        </a>
                      ) : (
                        <p className="text-sm text-gray-500">Not provided</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Position</Label>
                      <p>{selectedApplication.job?.title}</p>
                    </div>
                    <div>
                      <Label>Company</Label>
                      <p>{selectedApplication.job?.company}</p>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <p>{selectedApplication.job?.location}</p>
                    </div>
                    <div>
                      <Label>Applied Date</Label>
                      <p>{new Date(selectedApplication.applied_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Add messaging functionality
                    toast.info('Messaging feature will be available soon!');
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
