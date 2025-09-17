import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useFirebase } from '../../contexts/FirebaseContext';
import { ref, push, update, remove } from 'firebase/database';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import AddLectureDialog from './dialogs/AddLectureDialog';
import EditLectureDialog from './dialogs/EditLectureDialog';
import AddSectionDialog from './dialogs/AddSectionDialog';
import EditSectionDialog from './dialogs/EditSectionDialog';

interface Course {
  id: string;
  name: string;
  code: string;
  hasPracticals: boolean;
}

interface Lecture {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
}

export default function LecturesManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [sections, setSections] = useState<Lecture[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [addLectureDialogOpen, setAddLectureDialogOpen] = useState(false);
  const [editLectureDialogOpen, setEditLectureDialogOpen] = useState(false);
  const [addSectionDialogOpen, setAddSectionDialogOpen] = useState(false);
  const [editSectionDialogOpen, setEditSectionDialogOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [selectedSection, setSelectedSection] = useState<Lecture | null>(null);
  const { database } = useFirebase();
  const { toast } = useToast();

  const { data: coursesData } = useFirebaseData('courses', {});
  const { data: lecturesData } = useFirebaseData('lectures', {});
  const { data: sectionsData } = useFirebaseData('sections', {});

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
          ...lecture,
        }))
        .sort((a, b) => b.order - a.order);
      
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
          ...section,
        }))
        .sort((a, b) => b.order - a.order);
      
      setSections(courseSections);
    } else {
      setSections([]);
    }
  }, [sectionsData, selectedCourseId]);

  const handleAddLecture = async (lectureData: any) => {
    if (!database || !selectedCourseId) return;

    try {
      const lecturesRef = ref(database, 'lectures');
      await push(lecturesRef, {
        ...lectureData,
        courseId: selectedCourseId,
        order: lectures.length + 1,
        createdAt: new Date().toISOString(),
      });
      
      toast({
        title: "Success",
        description: "Lecture added successfully",
      });
      setAddLectureDialogOpen(false);
    } catch (error) {
      console.error('Error adding lecture:', error);
      toast({
        title: "Error",
        description: "Failed to add lecture",
        variant: "destructive",
      });
    }
  };

  const handleEditLecture = async (lectureData: any) => {
    if (!database || !selectedLecture) return;

    try {
      const lectureRef = ref(database, `lectures/${selectedLecture.id}`);
      await update(lectureRef, {
        ...lectureData,
        updatedAt: new Date().toISOString(),
      });
      
      toast({
        title: "Success",
        description: "Lecture updated successfully",
      });
      setEditLectureDialogOpen(false);
      setSelectedLecture(null);
    } catch (error) {
      console.error('Error updating lecture:', error);
      toast({
        title: "Error",
        description: "Failed to update lecture",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLecture = async (lectureId: string) => {
    if (!database || !confirm('Are you sure you want to delete this lecture?')) return;

    try {
      const lectureRef = ref(database, `lectures/${lectureId}`);
      await remove(lectureRef);
      
      toast({
        title: "Success",
        description: "Lecture deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting lecture:', error);
      toast({
        title: "Error",
        description: "Failed to delete lecture",
        variant: "destructive",
      });
    }
  };

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
      setAddSectionDialogOpen(false);
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
      setEditSectionDialogOpen(false);
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

  const LectureTable = ({ items, type, onEdit, onDelete }: { 
    items: Lecture[]; 
    type: 'lecture' | 'section';
    onEdit: (item: Lecture) => void;
    onDelete: (id: string) => void;
  }) => (
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
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell className="max-w-xs truncate">
              {item.description || 'No description'}
            </TableCell>
            <TableCell>{item.order}</TableCell>
            <TableCell>
              {new Date(item.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(item.id)}
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
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#153864] mb-2">Lectures & Sections Management</h2>
          <p className="text-gray-600">Manage lectures and practical sections for courses</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Course</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
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

      {selectedCourseId && (
        <Card>
          <CardHeader>
            <CardTitle>
              Content for {selectedCourse?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="lectures" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lectures">Lectures</TabsTrigger>
                {selectedCourse?.hasPracticals && (
                  <TabsTrigger value="sections">Sections</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="lectures" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Lectures</h3>
                  <Button 
                    onClick={() => setAddLectureDialogOpen(true)}
                    className="bg-[#1E94D4] hover:bg-[#153864] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lecture
                  </Button>
                </div>
                
                {lectures.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No lectures available for this course</p>
                ) : (
                  <LectureTable 
                    items={lectures}
                    type="lecture"
                    onEdit={(lecture) => {
                      setSelectedLecture(lecture);
                      setEditLectureDialogOpen(true);
                    }}
                    onDelete={handleDeleteLecture}
                  />
                )}
              </TabsContent>
              
              {selectedCourse?.hasPracticals && (
                <TabsContent value="sections" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Practical Sections</h3>
                    <Button 
                      onClick={() => setAddSectionDialogOpen(true)}
                      className="bg-[#1E94D4] hover:bg-[#153864] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                  
                  {sections.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No sections available for this course</p>
                  ) : (
                    <LectureTable 
                      items={sections}
                      type="section"
                      onEdit={(section) => {
                        setSelectedSection(section);
                        setEditSectionDialogOpen(true);
                      }}
                      onDelete={handleDeleteSection}
                    />
                  )}
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}

      <AddLectureDialog
        open={addLectureDialogOpen}
        onOpenChange={setAddLectureDialogOpen}
        onSubmit={handleAddLecture}
      />

      <EditLectureDialog
        open={editLectureDialogOpen}
        onOpenChange={setEditLectureDialogOpen}
        lecture={selectedLecture}
        onSubmit={handleEditLecture}
      />

      <AddSectionDialog
        open={addSectionDialogOpen}
        onOpenChange={setAddSectionDialogOpen}
        onSubmit={handleAddSection}
      />

      <EditSectionDialog
        open={editSectionDialogOpen}
        onOpenChange={setEditSectionDialogOpen}
        section={selectedSection}
        onSubmit={handleEditSection}
      />
    </div>
  );
}
