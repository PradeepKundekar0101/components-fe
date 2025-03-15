import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Chrome,
  Smartphone,
  Download,
} from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useSelector } from 'react-redux';
import useAuthFlow from '@/store/authFlow';

interface InstallationGuideProps {
  initialOpen?: boolean;
  onClose?: () => void;
}

const InstallationGuide: React.FC<InstallationGuideProps> = ({
  initialOpen = false,
  onClose
}) => {
  const [isModalOpen, setIsModalOpen] = useState(initialOpen);
  const [isMobile, setIsMobile] = useState(false);
  const { isVerified } = useSelector((state: any) => state.auth);
  const { currentModal } = useAuthFlow();

  useEffect(() => {
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);

    // Check if user is logged in (verified) and hasn't seen the modal before
    if (isVerified && currentModal === 'null') {
      const hasSeenInstallGuide = localStorage.getItem('hasSeenInstallGuide') === 'true';

      if (!hasSeenInstallGuide) {
        setIsModalOpen(true);
        localStorage.setItem('hasSeenInstallGuide', 'true');
      }
    }

    return () => {
      window.removeEventListener('resize', checkDeviceType);
    };
  }, [isVerified]);

  const handleClose = () => {
    setIsModalOpen(false);
    onClose && onClose();
  };

  const DesktopExtensionInstructions = () => (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="flex items-center space-x-4 text-red-500">
        <Chrome className="h-8 w-8" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold">Chrome Extension Installation</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-red-50/30 border-l-4 border-red-200 p-4 rounded">
          <ol className="space-y-3 text-gray-700 list-decimal pl-5">
            <li>
              <span className="font-semibold">Install the Extension</span>
              <p className="text-sm text-gray-600">Click the button below to add it directly to Chrome.</p>
            </li>
            <li>
              <span className="font-semibold">Confirm Installation</span>
              <p className="text-sm text-gray-600">Click "Add extension" in the popup.</p>
            </li>
          </ol>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="flex items-center space-x-2 text-red-500 border-red-500 hover:bg-red-50"
            onClick={() => window.open('https://chromewebstore.google.com/detail/our-extension', '_blank')}
          >
            <Download className="h-5 w-5" />
            <span>Add to Chrome</span>
          </Button>
        </div>

      </div>
    </div>
  );

  const MobilePWAInstructions = () => (
    <div className="space-y-6 p-6 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-red-500">
          <Smartphone className="h-8 w-8" strokeWidth={1.5} />
          <h2 className="text-2xl font-bold">Install Our App</h2>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-sm mb-2">
            Access information anywhere, anytime, and on any device
          </h3>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-2xl font-semibold mb-4 text-red-500">For Android</h4>
            <div className="space-y-4">
              <div className="flex flex-col items-start space-x-3">
                <p><span className="text-red-500 font-bold">1.</span> Open <strong>Components 101</strong> on your web browser.</p>
              </div>
              <div className="flex flex-col items-start space-x-3">
                <p><span className="text-red-500 font-bold">2.</span> Tap the <strong>three dots</strong> in the top right corner of the browser window.</p>
                <img src="https://www.usefindr.com/_next/image?url=%2Fstatic%2Fimages%2Fpwa%2Fandroid%2F2.webp&w=1920&q=75" alt="" className="w-auto my-4 h-[50vh] rounded-md shadow-md object-cover" />
              </div>
              <div className="flex flex-col items-start space-x-3">
                <p><span className="text-red-500 font-bold">3.</span> Click on the <strong>Install app</strong> button.</p>
                <img src="https://www.usefindr.com/_next/image?url=%2Fstatic%2Fimages%2Fpwa%2Fandroid%2F3.webp&w=1920&q=75" alt="" className="w-auto my-4 h-[50vh] rounded-md shadow-md object-cover" />
              </div>
              <div className="flex flex-col items-start space-x-3">
                <p><span className="text-red-500 font-bold">4.</span> Click on the <strong>Install</strong> button to complete the installation.</p>
                <img src="https://www.usefindr.com/_next/image?url=%2Fstatic%2Fimages%2Fpwa%2Fandroid%2F4.webp&w=1920&q=75" alt="" className="w-auto my-4 h-[50vh] rounded-md shadow-md object-cover" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-semibold mb-4 text-red-500">For iOS</h4>
            <div className="space-y-4">
              <div className="flex flex-col items-start space-x-3">
                <p><span className="text-red-500 font-bold">1.</span> Open <strong>Components 101</strong> on Safari.</p>
              </div>
              <div className="flex flex-col items-start space-x-3">
                <p><span className="text-red-500 font-bold">2.</span> Click on the <strong>Share</strong> icon.</p>
                <img src="https://www.usefindr.com/_next/image?url=%2Fstatic%2Fimages%2Fpwa%2Fios%2F2.webp&w=1920&q=75" alt="" className="w-auto my-4 h-[50vh] rounded-md shadow-md object-cover" />
              </div>
              <div className="flex flex-col items-start space-x-3">
                <p><span className="text-red-500 font-bold">3.</span> Click on the <strong>Add to Home Screen</strong> button.</p>
                <img src="https://www.usefindr.com/_next/image?url=%2Fstatic%2Fimages%2Fpwa%2Fios%2F3.webp&w=1920&q=75" alt="" className="w-auto my-4 h-[50vh] rounded-md shadow-md object-cover" />
              </div>
              <div className="flex flex-col items-start space-x-3">
                <p><span className="text-red-500 font-bold">4.</span> Enjoy Components 101 on your mobile phone!</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogTitle></DialogTitle>
        {isMobile ? <MobilePWAInstructions /> : <DesktopExtensionInstructions />}
      </DialogContent>
    </Dialog>
  );
};

export default InstallationGuide;