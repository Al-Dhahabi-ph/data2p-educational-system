import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, GraduationCap, Folder, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '../../contexts/AdminContext';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Subjects Management', href: '/admin/subjects', icon: BookOpen },
  { name: 'Lectures/Sections', href: '/admin/lectures', icon: GraduationCap },
  { name: 'Resources', href: '/admin/resources', icon: Folder },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const { sidebarOpen, setSidebarOpen } = useAdmin();

  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/movie-and-series-b78d0.appspot.com/o/files%2FIMG_20250915_023025.png?alt=media&token=fa4e5540-463f-41c3-85c0-2831bd8258c6";

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <img src={logoUrl} alt="Data2P Logo" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-[#153864]">Data2P</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#1E94D4] text-white'
                    : 'text-[#153864] hover:bg-[#1E94D4]/10'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}
