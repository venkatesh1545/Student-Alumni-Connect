
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MessageSquare, Clock, CheckCircle, XCircle, User } from 'lucide-react';

type MentorshipStatus = 'pending' | 'accepted' | 'rejected' | 'active' | 'completed';

export const MentorshipHub = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [response, setResponse] = useState('');

  const { data: mentorshipRequests = [], isLoading } = useQuery({
    queryKey: ['mentorship-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('mentorship_requests')
        .select(`
          *,
          student:profiles!mentorship_requests_student_id_fkey(
            first_name,
            last_name,
            email,
            linkedin_url
          ),
          student_profile:student_profiles!mentorship_requests_student_id_fkey(
            university,
            department,
            graduation_year,
            cgpa,
            skills
          )
        `)
        .eq('alumni_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: myRequests = [] } = useQuery({
    queryKey: ['my-mentorship-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('mentorship_requests')
        .select(`
          *,
          alumni:profiles!mentorship_requests_alumni_id_fkey(
            first_name,
            last_name,
            linkedin_url
          ),
          alumni_profile:alumni_profiles!mentorship_requests_alumni_id_fkey(
            company,
            designation,
            domain,
            experience_years
          )
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user && profile?.role === 'student'
  });

  const respondToRequest = useMutation({
    mutationFn: async ({ requestId, status, response }: { requestId: string; status: MentorshipStatus; response: string }) => {
      const { error } = await supabase
        .from('mentorship_requests')
        .update({ 
          status,
          alumni_response: response,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Response sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['mentorship-requests'] });
      setIsDialogOpen(false);
      setResponse('');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send response');
    }
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      case 'active': return 'default';
      case 'completed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'active': return <MessageSquare className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mentorship Hub</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {profile?.role === 'alumni' 
            ? 'Guide students on their career journey'
            : 'Connect with alumni for career guidance'
          }
        </p>
      </div>

      {profile?.role === 'alumni' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Mentorship Requests</h2>
          {mentorshipRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600">No mentorship requests received yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {mentorshipRequests.map((request) => {
                const studentProfile = request.student_profile?.[0];
                return (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-5 h-5" />
                            {request.student?.first_name} {request.student?.last_name}
                          </CardTitle>
                          <p className="text-gray-600 mt-1">
                            {studentProfile?.university} • {studentProfile?.department}
                          </p>
                          <p className="text-sm text-gray-500">
                            Requested: {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(request.status)} className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {request.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label>Topics of Interest</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {request.topics?.map((topic: string) => (
                              <Badge key={topic} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {request.message && (
                          <div>
                            <Label>Message</Label>
                            <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">
                              {request.message}
                            </p>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              CGPA: {studentProfile?.cgpa}
                            </span>
                            <span className="text-sm text-gray-600">
                              Grad: {studentProfile?.graduation_year}
                            </span>
                          </div>
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsDialogOpen(true);
                                }}
                              >
                                Respond
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {profile?.role === 'student' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">My Mentorship Requests</h2>
          {myRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600">You haven't sent any mentorship requests yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {myRequests.map((request) => {
                const alumniProfile = request.alumni_profile?.[0];
                return (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {request.alumni?.first_name} {request.alumni?.last_name}
                          </CardTitle>
                          <p className="text-gray-600 mt-1">
                            {alumniProfile?.designation} at {alumniProfile?.company}
                          </p>
                          <p className="text-sm text-gray-500">
                            Requested: {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(request.status)} className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {request.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {request.alumni_response && (
                        <div className="mt-4">
                          <Label>Alumni Response</Label>
                          <p className="text-sm mt-1 p-3 bg-blue-50 rounded-lg">
                            {request.alumni_response}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Respond to Mentorship Request - {selectedRequest?.student?.first_name} {selectedRequest?.student?.last_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Your Response</Label>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write your response to the student..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedRequest) {
                    respondToRequest.mutate({
                      requestId: selectedRequest.id,
                      status: 'rejected',
                      response: response || 'Unfortunately, I cannot take on additional mentorship commitments at this time.'
                    });
                  }
                }}
                disabled={respondToRequest.isPending}
              >
                Decline
              </Button>
              <Button
                onClick={() => {
                  if (selectedRequest && response.trim()) {
                    respondToRequest.mutate({
                      requestId: selectedRequest.id,
                      status: 'accepted',
                      response
                    });
                  } else {
                    toast.error('Please write a response message');
                  }
                }}
                disabled={respondToRequest.isPending || !response.trim()}
              >
                Accept & Respond
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
