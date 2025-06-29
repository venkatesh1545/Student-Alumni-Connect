
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  technologies: string;
  github_url?: string;
  live_url?: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

export const ProjectsSection = ({ projects, setProjects }: ProjectsSectionProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState<Project>({
    title: '',
    description: '',
    technologies: '',
    github_url: '',
    live_url: ''
  });

  const addProject = () => {
    if (newProject.title && newProject.description) {
      setProjects([...projects, newProject]);
      setNewProject({
        title: '',
        description: '',
        technologies: '',
        github_url: '',
        live_url: ''
      });
      setIsAdding(false);
    }
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projects</CardTitle>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">{project.title}</h4>
                <Button
                  onClick={() => removeProject(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-gray-600 mb-2">{project.description}</p>
              <p className="text-sm text-blue-600 mb-2">
                <strong>Technologies:</strong> {project.technologies}
              </p>
              {(project.github_url || project.live_url) && (
                <div className="flex gap-2 text-sm">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-500 hover:underline">
                      GitHub
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" 
                       className="text-green-500 hover:underline">
                      Live Demo
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {isAdding && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="pt-4 space-y-4">
              <div>
                <Label htmlFor="project_title">Project Title</Label>
                <Input
                  id="project_title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="Enter project title"
                />
              </div>
              <div>
                <Label htmlFor="project_description">Description</Label>
                <Textarea
                  id="project_description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Describe your project"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="project_technologies">Technologies Used</Label>
                <Input
                  id="project_technologies"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  placeholder="React, Node.js, MongoDB, etc."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project_github">GitHub URL (Optional)</Label>
                  <Input
                    id="project_github"
                    value={newProject.github_url}
                    onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="project_live">Live Demo URL (Optional)</Label>
                  <Input
                    id="project_live"
                    value={newProject.live_url}
                    onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })}
                    placeholder="https://yourproject.com"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addProject}>Add Project</Button>
                <Button onClick={() => setIsAdding(false)} variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
