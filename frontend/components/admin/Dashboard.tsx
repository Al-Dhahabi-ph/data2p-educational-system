import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, Users, Clock } from 'lucide-react';
import { useFirebaseData } from '../../hooks/useFirebaseData';

export default function Dashboard() {
  const [stats, setStats] = useState({
    subjects: 0,
    lectures: 0,
    sections: 0,
    recentItem: null as any,
  });

  const { data: coursesData } = useFirebaseData('courses', {});
  const { data: lecturesData } = useFirebaseData('lectures', {});
  const { data: sectionsData } = useFirebaseData('sections', {});

  useEffect(() => {
    const subjectCount = coursesData ? Object.keys(coursesData).length : 0;
    const lectureCount = lecturesData ? Object.keys(lecturesData).length : 0;
    const sectionCount = sectionsData ? Object.keys(sectionsData).length : 0;

    // Find most recent item
    let recentItem = null;
    let mostRecentDate = new Date(0);

    if (lecturesData) {
      Object.entries(lecturesData).forEach(([id, lecture]: [string, any]) => {
        const date = new Date(lecture.createdAt);
        if (date > mostRecentDate) {
          mostRecentDate = date;
          recentItem = { ...lecture, id, type: 'lecture' };
        }
      });
    }

    if (sectionsData) {
      Object.entries(sectionsData).forEach(([id, section]: [string, any]) => {
        const date = new Date(section.createdAt);
        if (date > mostRecentDate) {
          mostRecentDate = date;
          recentItem = { ...section, id, type: 'section' };
        }
      });
    }

    setStats({
      subjects: subjectCount,
      lectures: lectureCount,
      sections: sectionCount,
      recentItem,
    });
  }, [coursesData, lecturesData, sectionsData]);

  const statCards = [
    {
      title: 'Total Subjects',
      value: stats.subjects,
      icon: BookOpen,
      color: 'bg-[#1E94D4]',
    },
    {
      title: 'Total Lectures',
      value: stats.lectures,
      icon: GraduationCap,
      color: 'bg-[#153864]',
    },
    {
      title: 'Total Sections',
      value: stats.sections,
      icon: Users,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#153864] mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to the Data2P admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-l-4 border-l-[#1E94D4]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#153864]">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentItem ? (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {stats.recentItem.type === 'lecture' ? (
                  <GraduationCap className="h-5 w-5 text-[#1E94D4]" />
                ) : (
                  <Users className="h-5 w-5 text-[#153864]" />
                )}
                <div>
                  <p className="font-medium text-[#153864]">
                    Latest {stats.recentItem.type}: {stats.recentItem.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    Added: {new Date(stats.recentItem.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
