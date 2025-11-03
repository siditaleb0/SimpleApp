import React, { useState, useEffect } from 'react';
import type { Contact, CallType, CallStatus } from '../types';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { PhoneIcon } from './icons/PhoneIcon';

const SpeakerIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
);

const VideoOffIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.55-.18L19.73 21 21 19.73 3.27 2z"/>
    </svg>
);

interface CallScreenProps {
  contact: Contact;
  callType: CallType;
  onEndCall: () => void;
}

const ControlButton: React.FC<{
  onClick: () => void;
  label: string;
  isActive?: boolean;
  children: React.ReactNode;
}> = ({ onClick, label, isActive = false, children }) => (
  <div className="flex flex-col items-center space-y-2 w-24">
    <button 
      onClick={onClick} 
      className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors duration-200 ${
        isActive ? 'bg-gray-200 text-gray-900' : 'bg-white/20 hover:bg-white/30'
      }`}
      aria-label={label}
    >
      {children}
    </button>
    <span className="text-sm font-medium text-gray-200">{label}</span>
  </div>
);

const CallScreen: React.FC<CallScreenProps> = ({ contact, callType, onEndCall }) => {
  const [callStatus, setCallStatus] = useState<CallStatus>('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(callType === 'audio');
  
  useEffect(() => {
    if (callStatus === 'ringing') {
      const connectTimer = setTimeout(() => {
        setCallStatus('connected');
      }, 2500); // Simulate ringing for 2.5 seconds
      return () => clearTimeout(connectTimer);
    } 
    
    if (callStatus === 'connected') {
      const durationTimer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(durationTimer);
    }
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const renderStatus = () => {
    if (callStatus === 'ringing') {
      return <p className="text-lg text-gray-300 mt-2 animate-pulse">Appel en cours...</p>;
    }
    return <p className="text-lg text-gray-300 mt-2 font-mono tracking-wider">{formatDuration(callDuration)}</p>;
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-gray-800 text-white items-center justify-between">
      {callType === 'video' && !isCameraOff ? (
        <div className="absolute inset-0 bg-black">
          <img src={contact.avatarUrl} alt="Contact Video" className="object-cover w-full h-full opacity-30 blur-md scale-110"/>
           {/* Placeholder for user's camera feed */}
          <div className="absolute bottom-48 right-4 w-24 h-36 bg-gray-700 rounded-lg border-2 border-gray-500 flex items-center justify-center text-gray-400">
            <p className="text-xs text-center">Votre vidéo</p>
          </div>
        </div>
      ) : (
         <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800"/>
      )}
     
      <div className="relative z-10 flex flex-col items-center text-center pt-20 px-4">
        <div className={`relative w-32 h-32 rounded-full mb-4 border-4 ${callStatus === 'ringing' ? 'border-cyan-500/50' : 'border-white/50'} object-cover shadow-lg`}>
            <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full rounded-full object-cover" />
             {callStatus === 'ringing' && <div className="absolute inset-0 rounded-full border-4 border-cyan-400 animate-ping"></div>}
        </div>
        
        <h2 className="text-4xl font-bold">{contact.name}</h2>
        {renderStatus()}
      </div>

      <div className="relative z-10 w-full flex flex-col items-center pb-12 pt-8 space-y-10 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex justify-center items-start space-x-4">
          <ControlButton onClick={() => setIsSpeakerOn(!isSpeakerOn)} label="Haut-parleur" isActive={isSpeakerOn}>
            <SpeakerIcon className="w-7 h-7" />
          </ControlButton>
          
          {callType === 'video' && (
             <ControlButton onClick={() => setIsCameraOff(!isCameraOff)} label="Caméra" isActive={isCameraOff}>
                <VideoOffIcon className="w-7 h-7" />
             </ControlButton>
          )}
          
          <ControlButton onClick={() => setIsMuted(!isMuted)} label="Muet" isActive={isMuted}>
            <MicrophoneIcon className="w-7 h-7" />
          </ControlButton>
        </div>
        
        <button onClick={onEndCall} className="flex items-center justify-center w-20 h-20 bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-lg">
          <PhoneIcon className="w-9 h-9 transform rotate-135" />
        </button>
      </div>
    </div>
  );
};

export default CallScreen;