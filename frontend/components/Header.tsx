import React from 'react';
import { Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
  showAdminButton?: boolean;
  title?: string;
}

export default function Header({ onMenuClick, showAdminButton = true, title }: HeaderProps) {
  const navigate = useNavigate();

  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/movie-and-series-b78d0.appspot.com/o/files%2FIMG_20250915_023025.png?alt=media&token=fa4e5540-463f-41c3-85c0-2831bd8258c6";

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-[#153864] hover:bg-[#1E94D4]/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex items-center space-x-3">
          <img 
            src={logoUrl} 
            alt="Data2P Logo" 
            className="h-10 w-10 object-contain"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#153864]">
              {title || 'Data2P'}
            </h1>
            {!title && (
              <p className="text-sm text-[#1E94D4]">Educational Management System</p>
            )}
          </div>
        </div>

        {showAdminButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin')}
            className="text-[#153864] hover:bg-[#1E94D4]/10"
          >
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
