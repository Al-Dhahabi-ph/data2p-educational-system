import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import CourseCard from '../components/CourseCard';
import TodaySchedule from '../components/TodaySchedule';
import { useFirebaseData } from '../hooks/useFirebaseData';

interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  hasPracticals: boolean;
  lectureCount: number;
  sectionCount: number;
}

interface SidebarItem {
  id: string;
  title: string;
  type: 'lecture' | 'section';
  courseName: string;
  createdAt: Date;
}

interface ScheduleItem {
  id: string;
  title: string;
  courseName: string;
  courseCode: string;
  type: 'lecture' | 'section';
  time?: string;
}

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([]);

  const { data: coursesData, loading: coursesLoading } = useFirebaseData('courses', {});
  const { data: lecturesData } = useFirebaseData('lectures', {});
  const { data: sectionsData } = useFirebaseData('sections', {});

  useEffect(() => {
    if (coursesData) {
      const coursesList = Object.entries(coursesData).map(([id, data]: [string, any]) => ({
        id,
        ...data,
        lectureCount: 0,
        sectionCount: 0,
      }));
      setCourses(coursesList);
    }
  }, [coursesData]);

  useEffect(() => {
    // Combine lectures and sections for sidebar
    const allItems: SidebarItem[] = [];
    
    if (lecturesData) {
      Object.entries(lecturesData).forEach(([id, lecture]: [string, any]) => {
        const course = courses.find(c => c.id === lecture.courseId);
        if (course) {
          allItems.push({
            id,
            title: lecture.title,
            type: 'lecture',
            courseName: course.name,
            createdAt: new Date(lecture.createdAt),
          });
        }
      });
    }
    
    if (sectionsData) {
      Object.entries(sectionsData).forEach(([id, section]: [string, any]) => {
        const course = courses.find(c => c.id === section.courseId);
        if (course) {
          allItems.push({
            id,
            title: section.title,
            type: 'section',
            courseName: course.name,
            createdAt: new Date(section.createdAt),
          });
        }
      });
    }
    
    // Sort by creation date (newest first)
    allItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setSidebarItems(allItems.slice(0, 10)); // Limit to 10 most recent
    
    // For demo purposes, show some items in today's schedule
    setTodaySchedule(allItems.slice(0, 3).map(item => ({
      id: item.id,
      title: item.title,
      courseName: item.courseName,
      courseCode: courses.find(c => c.name === item.courseName)?.code || '',
      type: item.type,
      time: '10:00 AM', // Mock time
    })));
  }, [lecturesData, sectionsData, courses]);

  if (coursesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#1E94D4]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        items={sidebarItems}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <TodaySchedule todaySchedule={todaySchedule} />
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#153864] mb-2">All Courses</h2>
          <p className="text-gray-600">Browse all available pharmacy courses</p>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses available</p>
            <p className="text-gray-400 text-sm mt-2">Courses will appear here once added by admin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
