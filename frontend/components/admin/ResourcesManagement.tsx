import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Volume2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useFirebase } from '../../contexts/FirebaseContext';
import { ref, push, update, remove } from 'firebase/database';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import { convertLinks } from '../../utils/linkConverter';
import AddResourceDialog from './dialogs/AddResourceDialog';

interface Course {
  id: string;
  name: string;
  code: string;
  hasPracticals: boolean;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'lecture' | 'section';
}

interface Resource {
  id: string;
  lectureId: string;
  title: string;
  type: 'file' | 'audio' | 'video';
  originalLink: string;
  embedLink?: string;
  downloadLink?: string;
  viewLink?: string;
  isYouTube: boolean;
  createdAt: string;
}

export default function ResourcesManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectures, setLectures] = useState<ContentItem[]>([]);
  const [sections, setSections] = useState<ContentItem[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedContentType, setSelectedContentType] = useState<'lecture' | 'section'>('lecture');
  const [selectedContentId, setSelectedContentId] = useState<string>('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { database } = useFirebase();
  const { toast } = useToast();

  const { data: coursesData } = useFirebaseData('courses', {});
  const { data: lecturesData } = useFirebaseData('lectures', {});
  const { data: sectionsData } = useFirebaseData('sections', {});
  const { data: resourcesData } = useFirebaseData('resources', {});

  useEffect(() => {
    if (coursesData) {
      const coursesList = Object.entries(coursesData).map(([id, data]: [string, any]) => ({
        id,
        ...data,
      }));
      setCourses(coursesList);
    }
  }, [coursesData]);

  useEffect(() => {
    if (lecturesData && selectedCourseId) {
      const courseLectures = Object.entries(lecturesData)
        .filter(([_, lecture]: [string, any]) => lecture.courseId === selectedCourseId)
        .map(([id, lecture]: [string, any]) => ({
          id,
          title: lecture.title,
          type: 'lecture' as const,
        }));
      setLectures(courseLectures);
    } else {
      setLectures([]);
    }
  }, [lecturesData, selectedCourseId]);

  useEffect(() => {
    if (sectionsData && selectedCourseId) {
      const courseSections = Object.entries(sectionsData)
        .filter(([_, section]: [string, any]) => section.courseId === selectedCourseId)
        .map(([id, section]: [string, any]) => ({
          id,
          title: section.title,
          type: 'section' as const,
        }));
      setSections(courseSections);
    } else {
      setSections([]);
    }
  }, [sectionsData, selectedCourseId]);

  useEffect(() => {
    if (resourcesData && selectedContentId) {
      const contentResources = Object.entries(resourcesData)
        .filter(([_, resource]: [string, any]) => resource.lectureId === selectedContentId)
        .map(([id, resource]: [string, any]) => {
          const links = convertLinks(resource.originalLink);
          return {
            id,
            ...resource,
            ...links,
          };
        });
      setResources(contentResources);
    } else {
      setResources([]);
    }
  }, [resourcesData, selectedContentId]);

  const handleAddResource = async (resourceData: any) => {
    if (!database || !selectedContentId) return;

    try {
      const links = convertLinks(resourceData.originalLink);
      const resourcesRef = ref(database, 'resources');
      
      await push(resourcesRef, {
        ...resourceData,
        lectureId: selectedContentId,
        ...links,
        createdAt: new Date().toISOString(),
      });
      
      toast({
        title: "Success",
        description: "Resource added successfully",
      });
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!database || !confirm('Are you sure you want to delete this resource?')) return;

    try {
      const resourceRef = ref(database, `resources/${resourceId}`);
      await remove(resourceRef);
      
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
    }
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const contentItems = selectedContentType === 'lecture' ? lectures : sections;
  const selectedContentItem = contentItems.find(item => item.id === selectedContentId);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'file': return FileText;
      case 'audio': return Volume2;
      case 'video': return Video;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#153864] mb-2">Resources Management</h2>
          <p className="text-gray-600">Manage educational resources</p>
        </div>
        
        {selectedContentId && (
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="bg-[#1E94D4] hover:bg-[#153864] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        )}
      </div>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Course</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCourseId} onValueChange={(value) => {
            setSelectedCourseId(value);
            setSelectedContentId('');
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Content Type Selection */}
      {selectedCourseId && (
        <Card>
          <CardHeader>
            <CardTitle>Select Content Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Select value={selectedContentType} onValueChange={(value: 'lecture' | 'section') => {
                setSelectedContentType(value);
                setSelectedContentId('');
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">Lectures</SelectItem>
                  {selectedCourse?.hasPracticals && (
                    <SelectItem value="section">Sections</SelectItem>
                  )}
                </SelectContent>
              </Select>
              
              <Select value={selectedContentId} onValueChange={setSelectedContentId}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select a ${selectedContentType}`} />
                </SelectTrigger>
                <SelectContent>
                  {contentItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources Table */}
      {selectedContentId && (
        <Card>
          <CardHeader>
            <CardTitle>
              Resources for {selectedContentItem?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resources.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No resources available</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => {
                    const Icon = getResourceIcon(resource.type);
                    return (
                      <TableRow key={resource.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <Badge variant="secondary">{resource.type}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{resource.title}</TableCell>
                        <TableCell>
                          <Badge variant={resource.isYouTube ? "default" : "outline"}>
                            {resource.isYouTube ? "YouTube" : "Google Drive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteResource(resource.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <AddResourceDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddResource}
      />
    </div>
  );
}
