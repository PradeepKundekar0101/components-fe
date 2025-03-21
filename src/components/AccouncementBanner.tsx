import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
  Smartphone,
  Chrome,
  X
} from 'lucide-react';
import InstallationGuide from './InstallationGuide';

const AnnouncementBanner: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isVerified } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    console.log("isVerified: ", isVerified);
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    const bannerDismissed = localStorage.getItem('bannerDismissed') === 'true';

    if (isVerified) {
      // Show the banner when the user logs in, unless they previously dismissed it
      setShowBanner(!bannerDismissed);
    } else {
      // When the user logs out, reset banner dismissal and show the banner
      localStorage.removeItem('bannerDismissed');
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('resize', checkDeviceType);
    };
  }, [isVerified]); // Add isVerified as dependency to re-run when auth state changes

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('bannerDismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed top-16 left-0 w-full bg-red-50 border-b border-red-100 py-2 px-4 z-40 pt-16 md:pt-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isMobile ? (
              <Smartphone className="h-6 w-6 text-red-500" />
            ) : (
              <Chrome className="h-6 w-6 text-red-500" />
            )}
            <div className="text-sm text-gray-700">
              {isMobile
                ? "Install our PWA for a better mobile experience"
                : "Get our Chrome extension for enhanced browsing"}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="link"
              className="text-red-600 hover:text-red-800"
              onClick={() => setIsModalOpen(true)}
            >
              View More
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
              onClick={handleDismiss}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <InstallationGuide
          initialOpen={true}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default AnnouncementBanner;