import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Volume2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useFirebaseData } from '../hooks/useFirebaseData';

interface Lecture {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  type: 'lecture' | 'section';
}

interface Course {
  id: string;
  name: string;
  code: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'file' | 'audio' | 'video';
  originalLink: string;
}

export default function LectureContentPage() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  const { data: lecturesData } = useFirebaseData('lectures', {});
  const { data: sectionsData } = useFirebaseData('sections', {});
  const { data: coursesData } = useFirebaseData('courses', {});
  const { data: resourcesData } = useFirebaseData('resources', {});

  useEffect(() => {
    if (lectureId) {
      // Try to find in lectures first
      if (lecturesData && lecturesData[lectureId]) {
        setLecture({
          id: lectureId,
          ...lecturesData[lectureId],
          type: 'lecture',
        });
      }
      // Then try sections
      else if (sectionsData && sectionsData[lectureId]) {
        setLecture({
          id: lectureId,
          ...sectionsData[lectureId],
          type: 'section',
        });
      }
    }
  }, [lectureId, lecturesData, sectionsData]);

  useEffect(() => {
    if (lecture && coursesData && lecture.courseId) {
      const courseData = coursesData[lecture.courseId];
      if (courseData) {
        setCourse({
          id: lecture.courseId,
          ...courseData,
        });
      }
    }
  }, [lecture, coursesData]);

  useEffect(() => {
    if (resourcesData && lectureId) {
      const lectureResources = Object.entries(resourcesData)
        .filter(([_, resource]: [string, any]) => resource.lectureId === lectureId)
        .map(([id, resource]: [string, any]) => ({
          id,
          ...resource,
        }));
      setResources(lectureResources);
    }
  }, [resourcesData, lectureId]);

  if (!lecture || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#1E94D4]">Loading content...</div>
      </div>
    );
  }

  const fileResources = resources.filter(r => r.type === 'file');
  const audioResources = resources.filter(r => r.type === 'audio');
  const videoResources = resources.filter(r => r.type === 'video');

  const ResourceList = ({ items, icon: Icon }: { items: Resource[]; icon: any }) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No resources available</p>
      ) : (
        items.map((resource) => (
          <Card 
            key={resource.id}
            className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-[#1E94D4]"
            onClick={() => navigate(`/data/${resource.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-[#1E94D4] flex-shrink-0" />
                <span className="font-medium text-[#153864]">{resource.title}</span>
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
          onClick={() => navigate(`/course/${course.id}`)}
          className="mb-6 text-[#153864] hover:bg-[#1E94D4]/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>

        {/* Lecture Info Card */}
        <Card className="mb-8 border-l-4 border-l-[#1E94D4]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-[#153864] mb-2">
                  {lecture.title}
                </CardTitle>
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="secondary" className="bg-[#1E94D4]/10 text-[#1E94D4]">
                    {course.code}
                  </Badge>
                  <Badge 
                    variant={lecture.type === 'lecture' ? 'default' : 'secondary'}
                    className={`${
                      lecture.type === 'lecture' 
                        ? 'bg-[#1E94D4] hover:bg-[#1E94D4]/80' 
                        : 'bg-[#153864] hover:bg-[#153864]/80'
                    }`}
                  >
                    {lecture.type}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-[#153864]">{course.name}</h3>
              </div>
            </div>
          </CardHeader>
          
          {lecture.description && (
            <CardContent>
              <p className="text-gray-600">{lecture.description}</p>
            </CardContent>
          )}
        </Card>

        {/* Resources Tabs */}
        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="files" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Files ({fileResources.length})</span>
            </TabsTrigger>
            <TabsTrigger value="audios" className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <span>Audios ({audioResources.length})</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Videos ({videoResources.length})</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="files">
            <ResourceList items={fileResources} icon={FileText} />
          </TabsContent>
          
          <TabsContent value="audios">
            <ResourceList items={audioResources} icon={Volume2} />
          </TabsContent>
          
          <TabsContent value="videos">
            <ResourceList items={videoResources} icon={Video} />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
