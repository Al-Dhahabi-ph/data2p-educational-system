import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useFirebase } from '../../contexts/FirebaseContext';
import { ref, push, update, remove } from 'firebase/database';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import AddSectionDialog from './dialogs/AddSectionDialog';
import EditSectionDialog from './dialogs/EditSectionDialog';

interface Course {
  id: string;
  name: string;
  code: string;
  hasPracticals: boolean;
}

interface Section {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
}

export default function SectionsManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const { database } = useFirebase();
  const { toast } = useToast();

  const { data: coursesData } = useFirebaseData('courses', {});
  const { data: sectionsData } = useFirebaseData('sections', {});

  useEffect(() => {
    if (coursesData) {
      const coursesList = Object.entries(coursesData)
        .filter(([_, data]: [string, any]) => data.hasPracticals)
        .map(([id, data]: [string, any]) => ({
          id,
          ...data,
        }));
      setCourses(coursesList);
    }
  }, [coursesData]);

  useEffect(() => {
    if (sectionsData && selectedCourseId) {
      const courseSections = Object.entries(sectionsData)
        .filter(([_, section]: [string, any]) => section.courseId === selectedCourseId)
        .map(([id, section]: [string, any]) => ({
          id,
          ...section,
        }))
        .sort((a, b) => b.order - a.order);
      
      setSections(courseSections);
    } else {
      setSections([]);
    }
  }, [sectionsData, selectedCourseId]);

  const handleAddSection = async (sectionData: any) => {
    if (!database || !selectedCourseId) return;

    try {
      const sectionsRef = ref(database, 'sections');
      await push(sectionsRef, {
        ...sectionData,
        courseId: selectedCourseId,
        order: sections.length + 1,
        createdAt: new Date().toISOString(),
      });
      
      toast({
        title: "Success",
        description: "Section added successfully",
      });
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding section:', error);
      toast({
        title: "Error",
        description: "Failed to add section",
        variant: "destructive",
      });
    }
  };

  const handleEditSection = async (sectionData: any) => {
    if (!database || !selectedSection) return;

    try {
      const sectionRef = ref(database, `sections/${selectedSection.id}`);
      await update(sectionRef, {
        ...sectionData,
        updatedAt: new Date().toISOString(),
      });
      
      toast({
        title: "Success",
        description: "Section updated successfully",
      });
      setEditDialogOpen(false);
      setSelectedSection(null);
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: "Error",
        description: "Failed to update section",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!database || !confirm('Are you sure you want to delete this section?')) return;

    try {
      const sectionRef = ref(database, `sections/${sectionId}`);
      await remove(sectionRef);
      
      toast({
        title: "Success",
        description: "Section deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting section:', error);
      toast({
        title: "Error",
        description: "Failed to delete section",
        variant: "destructive",
      });
    }
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#153864] mb-2">Sections Management</h2>
          <p className="text-gray-600">Manage practical sections for courses</p>
        </div>
        
        {selectedCourseId && (
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="bg-[#1E94D4] hover:bg-[#153864] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Course (with Practicals)</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses with practicals available</p>
          ) : (
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a course with practicals" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedCourseId && (
        <Card>
          <CardHeader>
            <CardTitle>
              Sections for {selectedCourse?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sections.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sections available for this course</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.map((section) => (
                    <TableRow key={section.id}>
                      <TableCell className="font-medium">{section.title}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {section.description || 'No description'}
                      </TableCell>
                      <TableCell>{section.order}</TableCell>
                      <TableCell>
                        {new Date(section.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedSection(section);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSection(section.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <AddSectionDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddSection}
      />

      <EditSectionDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        section={selectedSection}
        onSubmit={handleEditSection}
      />
    </div>
  );
}
