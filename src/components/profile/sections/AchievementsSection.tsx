
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Award } from 'lucide-react';

interface Achievement {
  title: string;
  description: string;
  date: string;
  category: string;
}

interface AchievementsSectionProps {
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
}

export const AchievementsSection = ({ achievements, setAchievements }: AchievementsSectionProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    title: '',
    description: '',
    date: '',
    category: ''
  });

  const addAchievement = () => {
    if (newAchievement.title && newAchievement.description) {
      setAchievements([...achievements, newAchievement]);
      setNewAchievement({
        title: '',
        description: '',
        date: '',
        category: ''
      });
      setIsAdding(false);
    }
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Achievements & Certifications</CardTitle>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Achievement
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement, index) => (
          <Card key={index} className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-2">
                  <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-lg">{achievement.title}</h4>
                    <p className="text-sm text-gray-500">{achievement.category} • {achievement.date}</p>
                  </div>
                </div>
                <Button
                  onClick={() => removeAchievement(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-gray-600 ml-7">{achievement.description}</p>
            </CardContent>
          </Card>
        ))}

        {isAdding && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="pt-4 space-y-4">
              <div>
                <Label htmlFor="achievement_title">Achievement Title</Label>
                <Input
                  id="achievement_title"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                  placeholder="First Place in Hackathon"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="achievement_category">Category</Label>
                  <Input
                    id="achievement_category"
                    value={newAchievement.category}
                    onChange={(e) => setNewAchievement({ ...newAchievement, category: e.target.value })}
                    placeholder="Competition, Certification, Award"
                  />
                </div>
                <div>
                  <Label htmlFor="achievement_date">Date</Label>
                  <Input
                    id="achievement_date"
                    value={newAchievement.date}
                    onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                    placeholder="March 2024"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="achievement_description">Description</Label>
                <Textarea
                  id="achievement_description"
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                  placeholder="Describe the achievement and its significance"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addAchievement}>Add Achievement</Button>
                <Button onClick={() => setIsAdding(false)} variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};
