import React from 'react';
import { X, Clock, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface SidebarItem {
  id: string;
  title: string;
  type: 'lecture' | 'section';
  courseName: string;
  createdAt: Date;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: SidebarItem[];
}

export default function Sidebar({ isOpen, onClose, items }: SidebarProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:static lg:inset-auto">
      <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={onClose} />
      
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 lg:relative lg:w-full lg:shadow-none">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-[#153864]">Latest Updates</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 space-y-3 max-h-[calc(100vh-80px)] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent updates</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  navigate(`/lecture/${item.id}`);
                  onClose();
                }}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-[#153864] text-sm line-clamp-2">
                    {item.title}
                  </h3>
                  <Badge 
                    variant={item.type === 'lecture' ? 'default' : 'secondary'}
                    className={`ml-2 text-xs ${
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
                
                <p className="text-xs text-gray-600 mb-2">{item.courseName}</p>
                
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{item.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
