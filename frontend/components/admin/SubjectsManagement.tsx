import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useFirebase } from '../../contexts/FirebaseContext';
import { ref, push, update, remove } from 'firebase/database';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import AddCourseDialog from './dialogs/AddCourseDialog';
import EditCourseDialog from './dialogs/EditCourseDialog';

interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  hasPracticals: boolean;
  theoryProfessors: string[];
  practicalProfessors: string[];
  lectureCount: number;
  sectionCount: number;
}

export default function SubjectsManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { database } = useFirebase();
  const { toast } = useToast();

  const { data: coursesData } = useFirebaseData('courses', {});
  const { data: lecturesData } = useFirebaseData('lectures', {});
  const { data: sectionsData } = useFirebaseData('sections', {});

  useEffect(() => {
    if (coursesData) {
      const coursesList = Object.entries(coursesData).map(([id, data]: [string, any]) => {
        // Count lectures and sections for this course
        const lectureCount = lecturesData ? 
          Object.values(lecturesData).filter((lecture: any) => lecture.courseId === id).length : 0;
        const sectionCount = sectionsData ? 
          Object.values(sectionsData).filter((section: any) => section.courseId === id).length : 0;

        return {
          id,
          ...data,
          lectureCount,
          sectionCount,
        };
      });
      setCourses(coursesList);
    }
  }, [coursesData, lecturesData, sectionsData]);

  const handleAddCourse = async (courseData: any) => {
    if (!database) return;

    try {
      const coursesRef = ref(database, 'courses');
      await push(coursesRef, {
        ...courseData,
        createdAt: new Date().toISOString(),
      });
      
      toast({
        title: "Success",
        description: "Course added successfully",
      });
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding course:', error);
      toast({
        title: "Error",
        description: "Failed to add course",
        variant: "destructive",
      });
    }
  };

  const handleEditCourse = async (courseData: any) => {
    if (!database || !selectedCourse) return;

    try {
      const courseRef = ref(database, `courses/${selectedCourse.id}`);
      await update(courseRef, {
        ...courseData,
        updatedAt: new Date().toISOString(),
      });
      
      toast({
        title: "Success",
        description: "Course updated successfully",
      });
      setEditDialogOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!database || !confirm('Are you sure you want to delete this course?')) return;

    try {
      const courseRef = ref(database, `courses/${courseId}`);
      await remove(courseRef);
      
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#153864] mb-2">Subjects Management</h2>
          <p className="text-gray-600">Manage all pharmacy courses</p>
        </div>
        <Button 
          onClick={() => setAddDialogOpen(true)}
          className="bg-[#1E94D4] hover:bg-[#153864] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No courses available</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Lectures</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Has Practicals</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{course.code}</Badge>
                    </TableCell>
                    <TableCell>{course.lectureCount}</TableCell>
                    <TableCell>{course.sectionCount}</TableCell>
                    <TableCell>
                      <Badge variant={course.hasPracticals ? "default" : "secondary"}>
                        {course.hasPracticals ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCourse(course);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCourse(course.id)}
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

      <AddCourseDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddCourse}
      />

      <EditCourseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        course={selectedCourse}
        onSubmit={handleEditCourse}
      />
    </div>
  );
}
