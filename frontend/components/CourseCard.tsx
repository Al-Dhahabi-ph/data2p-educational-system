import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  hasPracticals: boolean;
  lectureCount: number;
  sectionCount: number;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-[#1E94D4]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#153864] mb-1">
              {course.name}
            </CardTitle>
            <Badge variant="secondary" className="bg-[#1E94D4]/10 text-[#1E94D4]">
              {course.code}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {course.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {course.description}
          </p>
        )}
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lectureCount} Lectures</span>
          </div>
          
          {course.hasPracticals && (
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.sectionCount} Sections</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => navigate(`/course/${course.id}`)}
          className="w-full bg-[#1E94D4] hover:bg-[#153864] text-white"
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}
