import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { convertLinks } from '../utils/linkConverter';

interface Resource {
  id: string;
  title: string;
  type: 'file' | 'audio' | 'video';
  originalLink: string;
}

export default function DataDisplayPage() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [convertedLinks, setConvertedLinks] = useState<any>(null);

  const { data: resourcesData } = useFirebaseData('resources', {});

  useEffect(() => {
    if (resourcesData && resourceId) {
      const resourceData = resourcesData[resourceId];
      if (resourceData) {
        const res = {
          id: resourceId,
          ...resourceData,
        };
        setResource(res);
        
        const links = convertLinks(res.originalLink);
        setConvertedLinks(links);
      }
    }
  }, [resourcesData, resourceId]);

  if (!resource || !convertedLinks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#1E94D4]">Loading resource...</div>
      </div>
    );
  }

  const handleDownload = () => {
    if (convertedLinks.downloadLink) {
      window.open(convertedLinks.downloadLink, '_blank');
    }
  };

  const handleOpenInNewTab = () => {
    window.open(convertedLinks.viewLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <Header showAdminButton={false} title={resource.title} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-[#153864] hover:bg-[#1E94D4]/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Content Display */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="aspect-video w-full">
            <iframe
              src={convertedLinks.embedLink}
              className="w-full h-full rounded-t-lg"
              allowFullScreen
              title={resource.title}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 justify-center">
          {!convertedLinks.isYouTube && (
            <Button
              onClick={handleDownload}
              className="bg-[#1E94D4] hover:bg-[#153864] text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
          
          <Button
            onClick={handleOpenInNewTab}
            variant="outline"
            className="border-[#1E94D4] text-[#1E94D4] hover:bg-[#1E94D4] hover:text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
