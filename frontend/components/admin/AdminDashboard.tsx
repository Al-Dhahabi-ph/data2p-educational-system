import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import Dashboard from './Dashboard';
import SubjectsManagement from './SubjectsManagement';
import LecturesManagement from './LecturesManagement';
import SectionsManagement from './SectionsManagement';
import ResourcesManagement from './ResourcesManagement';
import Settings from './Settings';
import { useAdmin } from '../../contexts/AdminContext';

export default function AdminDashboard() {
  const { sidebarOpen } = useAdmin();

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex">
      <AdminSidebar />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <AdminHeader />
        
        <main className="p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects" element={<SubjectsManagement />} />
            <Route path="/lectures" element={<LecturesManagement />} />
            <Route path="/sections" element={<SectionsManagement />} />
            <Route path="/resources" element={<ResourcesManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
