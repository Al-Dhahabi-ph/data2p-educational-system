import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export default function AddCourseDialog({ open, onOpenChange, onSubmit }: AddCourseDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    hasPracticals: false,
    theoryProfessors: [''],
    practicalProfessors: [''],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      theoryProfessors: formData.theoryProfessors.filter(prof => prof.trim()),
      practicalProfessors: formData.hasPracticals 
        ? formData.practicalProfessors.filter(prof => prof.trim())
        : [],
    };
    
    onSubmit(data);
    setFormData({
      name: '',
      code: '',
      description: '',
      hasPracticals: false,
      theoryProfessors: [''],
      practicalProfessors: [''],
    });
  };

  const updateProfessor = (type: 'theory' | 'practical', index: number, value: string) => {
    const field = type === 'theory' ? 'theoryProfessors' : 'practicalProfessors';
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const addProfessor = (type: 'theory' | 'practical') => {
    const field = type === 'theory' ? 'theoryProfessors' : 'practicalProfessors';
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeProfessor = (type: 'theory' | 'practical', index: number) => {
    const field = type === 'theory' ? 'theoryProfessors' : 'practicalProfessors';
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: updated }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="code">Course Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label>Theory Professors</Label>
            {formData.theoryProfessors.map((prof, index) => (
              <div key={index} className="flex space-x-2 mt-1">
                <Input
                  value={prof}
                  onChange={(e) => updateProfessor('theory', index, e.target.value)}
                  placeholder="Professor name"
                />
                {formData.theoryProfessors.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeProfessor('theory', index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addProfessor('theory')}
              className="mt-2"
            >
              Add Professor
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasPracticals"
              checked={formData.hasPracticals}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, hasPracticals: !!checked }))
              }
            />
            <Label htmlFor="hasPracticals">Has Practical Sessions</Label>
          </div>

          {formData.hasPracticals && (
            <div>
              <Label>Practical Professors</Label>
              {formData.practicalProfessors.map((prof, index) => (
                <div key={index} className="flex space-x-2 mt-1">
                  <Input
                    value={prof}
                    onChange={(e) => updateProfessor('practical', index, e.target.value)}
                    placeholder="Professor name"
                  />
                  {formData.practicalProfessors.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeProfessor('practical', index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addProfessor('practical')}
                className="mt-2"
              >
                Add Professor
              </Button>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1E94D4] hover:bg-[#153864]">
              Add Course
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
