import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';

export default function AdminHeader() {
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useAdmin();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#153864] hover:bg-[#1E94D4]/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <h1 className="text-2xl font-bold text-[#153864]">Admin Dashboard</h1>
        </div>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-[#153864] hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
