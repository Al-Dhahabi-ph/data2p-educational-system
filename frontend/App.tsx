import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from './contexts/FirebaseContext';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import LectureContentPage from './pages/LectureContentPage';
import DataDisplayPage from './pages/DataDisplayPage';
import AdminPage from './pages/AdminPage';
import './styles/globals.css';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <FirebaseProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/lecture/:lectureId" element={<LectureContentPage />} />
            <Route path="/data/:resourceId" element={<DataDisplayPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
          </Routes>
          <Toaster />
        </Router>
      </FirebaseProvider>
    </div>
  );
}
