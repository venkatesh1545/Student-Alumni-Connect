
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building, DollarSign, Clock, User, MessageSquare } from 'lucide-react';
import { SendMessage } from '@/components/messaging/SendMessage';
import { useState } from 'react';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    job_type: string;
    salary_range: string;
    description: string;
    requirements: string[];
    keywords: string[];
    created_at: string;
    alumni_id: string;
    alumni: {
      first_name: string;
      last_name: string;
      linkedin_url?: string;
    };
  };
  onApply?: (jobId: string) => void;
  userRole?: string;
}

export const JobCard = ({ job, onApply, userRole }: JobCardProps) => {
  const [showMessageForm, setShowMessageForm] = useState(false);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <Building className="w-4 h-4" />
              <span>{job.company}</span>
            </div>
          </div>
          <Badge variant="secondary" className="capitalize">
            {job.job_type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{job.location}</span>
          </div>
          {job.salary_range && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span>{job.salary_range}</span>
            </div>
          )}
        </div>

        <p className="text-gray-700">{job.description}</p>

        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Requirements:</h4>
            <ul className="list-disc list-inside space-y-1">
              {job.requirements.map((req, index) => (
                <li key={index} className="text-gray-600">{req}</li>
              ))}
            </ul>
          </div>
        )}

        {job.keywords && job.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline">{keyword}</Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>Posted by {job.alumni.first_name} {job.alumni.last_name}</span>
          {job.alumni.linkedin_url && (
            <a
              href={job.alumni.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              (LinkedIn)
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
        </div>

        {userRole === 'student' && (
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => onApply?.(job.id)}
              className="flex-1"
            >
              Apply Now
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowMessageForm(!showMessageForm)}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Alumni
            </Button>
          </div>
        )}

        {showMessageForm && (
          <SendMessage
            receiverId={job.alumni_id}
            receiverName={`${job.alumni.first_name} ${job.alumni.last_name}`}
          />
        )}
      </CardContent>
    </Card>
  );
};
