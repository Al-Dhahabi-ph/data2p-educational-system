import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface AddResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

interface ResourceFormData {
  title: string;
  type: 'file' | 'audio' | 'video';
  originalLink: string;
}

export default function AddResourceDialog({ open, onOpenChange, onSubmit }: AddResourceDialogProps) {
  const [resources, setResources] = useState<ResourceFormData[]>([
    { title: '', type: 'file', originalLink: '' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validResources = resources.filter(resource => 
      resource.title.trim() && resource.originalLink.trim()
    );
    
    if (validResources.length === 0) return;
    
    // Submit each resource individually
    validResources.forEach(resource => {
      onSubmit(resource);
    });
    
    setResources([{ title: '', type: 'file', originalLink: '' }]);
  };

  const updateResource = (index: number, field: keyof ResourceFormData, value: string) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    setResources(updated);
  };

  const addResource = () => {
    setResources([...resources, { title: '', type: 'file', originalLink: '' }]);
  };

  const removeResource = (index: number) => {
    if (resources.length > 1) {
      setResources(resources.filter((_, i) => i !== index));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Resources</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {resources.map((resource, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Resource {index + 1}</h4>
                {resources.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeResource(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div>
                <Label>Resource Title</Label>
                <Input
                  value={resource.title}
                  onChange={(e) => updateResource(index, 'title', e.target.value)}
                  placeholder="Enter resource title"
                  required
                />
              </div>
              
              <div>
                <Label>Resource Type</Label>
                <Select 
                  value={resource.type} 
                  onValueChange={(value: 'file' | 'audio' | 'video') => 
                    updateResource(index, 'type', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">File</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Original Link</Label>
                <Textarea
                  value={resource.originalLink}
                  onChange={(e) => updateResource(index, 'originalLink', e.target.value)}
                  placeholder="Enter Google Drive or YouTube link"
                  rows={2}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports Google Drive and YouTube links
                </p>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addResource}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Resource
          </Button>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1E94D4] hover:bg-[#153864]">
              Add Resources
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
