import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScheduleItem {
  id: string;
  title: string;
  courseName: string;
  courseCode: string;
  type: 'lecture' | 'section';
  time?: string;
}

interface TodayScheduleProps {
  todaySchedule: ScheduleItem[];
}

export default function TodaySchedule({ todaySchedule }: TodayScheduleProps) {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="mb-8 border-l-4 border-l-[#1E94D4] bg-gradient-to-r from-[#1E94D4]/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-[#153864]">
          <Calendar className="h-5 w-5" />
          <span>Today's Schedule</span>
        </CardTitle>
        <p className="text-sm text-[#1E94D4] font-medium">{today}</p>
      </CardHeader>
      
      <CardContent>
        {todaySchedule.length === 0 ? (
          <p className="text-gray-500 italic">No classes scheduled for today</p>
        ) : (
          <div className="space-y-3">
            {todaySchedule.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/lecture/${item.id}`)}
                className="p-3 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-[#153864] mb-1">{item.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{item.courseName}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.courseCode}
                      </Badge>
                    </div>
                    {item.time && (
                      <p className="text-xs text-[#1E94D4] mt-1">{item.time}</p>
                    )}
                  </div>
                  
                  <Badge 
                    variant={item.type === 'lecture' ? 'default' : 'secondary'}
                    className={`${
                      item.type === 'lecture' 
                        ? 'bg-[#1E94D4] hover:bg-[#1E94D4]/80' 
                        : 'bg-[#153864] hover:bg-[#153864]/80'
                    }`}
                  >
                    {item.type === 'lecture' ? (
                      <BookOpen className="h-3 w-3 mr-1" />
                    ) : (
                      <Users className="h-3 w-3 mr-1" />
                    )}
                    {item.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
