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
import AddLectureDialog from './dialogs/AddLectureDialog';
import EditLectureDialog from './dialogs/EditLectureDialog';

interface Course {
  id: string;
  name: string;
  code: string;
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
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const { database } = useFirebase();
  const { toast } = useToast();

  const { data: coursesData } = useFirebaseData('courses', {});
  const { data: lecturesData } = useFirebaseData('lectures', {});

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
      setAddDialogOpen(false);
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
      setEditDialogOpen(false);
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

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#153864] mb-2">Lectures Management</h2>
          <p className="text-gray-600">Manage lectures for courses</p>
        </div>
        
        {selectedCourseId && (
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="bg-[#1E94D4] hover:bg-[#153864] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lecture
          </Button>
        )}
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
              Lectures for {selectedCourse?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lectures.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No lectures available for this course</p>
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
                  {lectures.map((lecture) => (
                    <TableRow key={lecture.id}>
                      <TableCell className="font-medium">{lecture.title}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {lecture.description || 'No description'}
                      </TableCell>
                      <TableCell>{lecture.order}</TableCell>
                      <TableCell>
                        {new Date(lecture.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedLecture(lecture);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLecture(lecture.id)}
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

      <AddLectureDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddLecture}
      />

      <EditLectureDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        lecture={selectedLecture}
        onSubmit={handleEditLecture}
      />
    </div>
  );
}
