import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useFirebaseData } from '../hooks/useFirebaseData';

interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  hasPracticals: boolean;
  theoryProfessors: string[];
  practicalProfessors: string[];
}

interface Lecture {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  order: number;
}

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [sections, setSections] = useState<Lecture[]>([]);

  const { data: coursesData } = useFirebaseData('courses', {});
  const { data: lecturesData } = useFirebaseData('lectures', {});
  const { data: sectionsData } = useFirebaseData('sections', {});

  useEffect(() => {
    if (coursesData && courseId) {
      const courseData = coursesData[courseId];
      if (courseData) {
        setCourse({
          id: courseId,
          ...courseData,
        });
      }
    }
  }, [coursesData, courseId]);

  useEffect(() => {
    if (lecturesData && courseId) {
      const courseLectures = Object.entries(lecturesData)
        .filter(([_, lecture]: [string, any]) => lecture.courseId === courseId)
        .map(([id, lecture]: [string, any]) => ({
          id,
          title: lecture.title,
          description: lecture.description,
          createdAt: new Date(lecture.createdAt),
          order: lecture.order || 0,
        }))
        .sort((a, b) => b.order - a.order);
      
      setLectures(courseLectures);
    }
  }, [lecturesData, courseId]);

  useEffect(() => {
    if (sectionsData && courseId) {
      const courseSections = Object.entries(sectionsData)
        .filter(([_, section]: [string, any]) => section.courseId === courseId)
        .map(([id, section]: [string, any]) => ({
          id,
          title: section.title,
          description: section.description,
          createdAt: new Date(section.createdAt),
          order: section.order || 0,
        }))
        .sort((a, b) => b.order - a.order);
      
      setSections(courseSections);
    }
  }, [sectionsData, courseId]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#1E94D4]">Loading course...</div>
      </div>
    );
  }

  const LectureList = ({ items, type }: { items: Lecture[]; type: 'lecture' | 'section' }) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No {type}s available for this course
        </p>
      ) : (
        items.map((item) => (
          <Card 
            key={item.id}
            className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-[#1E94D4]"
            onClick={() => navigate(`/lecture/${item.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#153864] mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Added: {item.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <Badge 
                  variant={type === 'lecture' ? 'default' : 'secondary'}
                  className={`ml-4 ${
                    type === 'lecture' 
                      ? 'bg-[#1E94D4] hover:bg-[#1E94D4]/80' 
                      : 'bg-[#153864] hover:bg-[#153864]/80'
                  }`}
                >
                  {type === 'lecture' ? (
                    <BookOpen className="h-3 w-3 mr-1" />
                  ) : (
                    <Users className="h-3 w-3 mr-1" />
                  )}
                  {type}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <Header showAdminButton={false} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-[#153864] hover:bg-[#1E94D4]/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        {/* Course Info Card */}
        <Card className="mb-8 border-l-4 border-l-[#1E94D4]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#153864] mb-2">
              {course.name}
            </CardTitle>
            <Badge variant="secondary" className="w-fit bg-[#1E94D4]/10 text-[#1E94D4]">
              {course.code}
            </Badge>
          </CardHeader>
          
          <CardContent>
            {course.description && (
              <p className="text-gray-600 mb-6">{course.description}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.theoryProfessors && course.theoryProfessors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#153864] mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Theory Professors
                  </h4>
                  <ul className="space-y-1">
                    {course.theoryProfessors.map((prof, index) => (
                      <li key={index} className="text-gray-600">• {prof}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {course.hasPracticals && course.practicalProfessors && course.practicalProfessors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#153864] mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Practical Professors
                  </h4>
                  <ul className="space-y-1">
                    {course.practicalProfessors.map((prof, index) => (
                      <li key={index} className="text-gray-600">• {prof}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="lectures" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="lectures" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Lectures</span>
            </TabsTrigger>
            {course.hasPracticals && (
              <TabsTrigger value="sections" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Sections</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="lectures">
            <LectureList items={lectures} type="lecture" />
          </TabsContent>
          
          {course.hasPracticals && (
            <TabsContent value="sections">
              <LectureList items={sections} type="section" />
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
