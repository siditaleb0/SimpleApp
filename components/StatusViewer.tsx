import React, { useState, useEffect, useRef } from 'react';
import type { Contact } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface StatusViewerProps {
  contact: Contact;
  onClose: () => void;
  onStatusViewed: (contactId: number, statusId: number) => void;
}

const StatusViewer: React.FC<StatusViewerProps> = ({ contact, onClose, onStatusViewed }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const statusUpdates = contact.statusUpdates || [];
  const [animationKey, setAnimationKey] = useState(0);

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      handleNext();
    }, 5000); // 5 second timer
  };

  useEffect(() => {
    if (statusUpdates.length > 0) {
      const currentStatus = statusUpdates[currentIndex];
      if (!currentStatus.viewed) {
        onStatusViewed(contact.id, currentStatus.id);
      }
      setAnimationKey(prev => prev + 1); // Reset animation on change
      startTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, contact.id]);

  const handleNext = () => {
    setCurrentIndex(prev => {
      if (prev < statusUpdates.length - 1) {
        return prev + 1;
      } else {
        onClose();
        return prev;
      }
    });
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); 
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const tapPosition = (clientX - left) / width;
    
    if (tapPosition > 0.3) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  if (statusUpdates.length === 0) {
    onClose();
    return null;
  }

  const currentStatus = statusUpdates[currentIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col animate-fade-in-viewer" onClick={onClose}>
      <style>{`
        @keyframes fade-in-viewer { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-viewer { animation: fade-in-viewer 0.2s forwards; }
        @keyframes progress-bar-fill { from { width: 0%; } to { width: 100%; } }
        .progress-bar-animate { animation: progress-bar-fill 5s linear forwards; }
      `}</style>
      
      <div className="flex-1 flex flex-col relative" onClick={e => e.stopPropagation()}>
        <div className="absolute top-3 left-2 right-2 flex space-x-1 z-20">
          {statusUpdates.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className={`h-full bg-white ${index === currentIndex ? 'progress-bar-animate' : ''}`}
                key={index === currentIndex ? animationKey : index}
                style={{ width: index < currentIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        <header className="absolute top-6 left-2 right-2 flex items-center p-2 z-20 bg-gradient-to-b from-black/50 to-transparent">
          <img src={contact.avatarUrl} alt={contact.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
          <div className="flex-1">
            <p className="font-semibold text-white">{contact.name}</p>
            <p className="text-sm text-gray-300">{currentStatus.timestamp}</p>
          </div>
          <button onClick={onClose} className="p-2 text-white">
            <CloseIcon className="w-7 h-7" />
          </button>
        </header>
        
        <div className="flex-1 flex items-center justify-center relative pt-20 pb-4">
          <img src={currentStatus.imageUrl} alt={`Status from ${contact.name}`} className="max-h-full max-w-full object-contain" />
        </div>

        <div className="absolute inset-0" onClick={handleTap}></div>
      </div>
    </div>
  );
};
export default StatusViewer;