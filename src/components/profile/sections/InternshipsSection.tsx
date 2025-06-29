
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Calendar } from 'lucide-react';

interface Internship {
  company: string;
  role: string;
  duration: string;
  description: string;
  skills_gained: string;
}

interface InternshipsSectionProps {
  internships: Internship[];
  setInternships: (internships: Internship[]) => void;
}

export const InternshipsSection = ({ internships, setInternships }: InternshipsSectionProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newInternship, setNewInternship] = useState<Internship>({
    company: '',
    role: '',
    duration: '',
    description: '',
    skills_gained: ''
  });

  const addInternship = () => {
    if (newInternship.company && newInternship.role) {
      setInternships([...internships, newInternship]);
      setNewInternship({
        company: '',
        role: '',
        duration: '',
        description: '',
        skills_gained: ''
      });
      setIsAdding(false);
    }
  };

  const removeInternship = (index: number) => {
    setInternships(internships.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Internships & Work Experience</CardTitle>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {internships.map((internship, index) => (
          <Card key={index} className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-lg">{internship.role}</h4>
                  <p className="text-blue-600 font-medium">{internship.company}</p>
                </div>
                <Button
                  onClick={() => removeInternship(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                {internship.duration}
              </div>
              <p className="text-gray-600 mb-2">{internship.description}</p>
              {internship.skills_gained && (
                <p className="text-sm text-green-600">
                  <strong>Skills Gained:</strong> {internship.skills_gained}
                </p>
              )}
            </CardContent>
          </Card>
        ))}

        {isAdding && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="internship_company">Company</Label>
                  <Input
                    id="internship_company"
                    value={newInternship.company}
                    onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <Label htmlFor="internship_role">Role/Position</Label>
                  <Input
                    id="internship_role"
                    value={newInternship.role}
                    onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
                    placeholder="Software Developer Intern"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="internship_duration">Duration</Label>
                <Input
                  id="internship_duration"
                  value={newInternship.duration}
                  onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                  placeholder="Jun 2023 - Aug 2023"
                />
              </div>
              <div>
                <Label htmlFor="internship_description">Description</Label>
                <Textarea
                  id="internship_description"
                  value={newInternship.description}
                  onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                  placeholder="Describe your role and responsibilities"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="internship_skills">Skills Gained</Label>
                <Input
                  id="internship_skills"
                  value={newInternship.skills_gained}
                  onChange={(e) => setNewInternship({ ...newInternship, skills_gained: e.target.value })}
                  placeholder="React, API Integration, Team Collaboration"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addInternship}>Add Experience</Button>
                <Button onClick={() => setIsAdding(false)} variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
