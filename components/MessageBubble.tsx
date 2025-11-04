import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import { MessageType } from '../types';
import { DocumentIcon } from './icons/DocumentIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { SmileyIcon } from './icons/SmileyIcon';

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
  onReact: (emoji: string) => void;
}

const linkify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part && part.match(urlRegex)) {
      const href = part.startsWith('www.') ? `https://${part}` : part;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-300 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const VoiceMessagePlayer: React.FC<{ message: Message; isSender: boolean }> = ({ message, isSender }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressIntervalRef = useRef<number | null>(null);

    const base64ToBlob = (base64: string, mimeType: string): Blob => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    };

    useEffect(() => {
        if (message.audioData) {
            // Assuming the audio is webm, as recorded by MediaRecorder
            const blob = base64ToBlob(message.audioData, 'audio/webm');
            const url = URL.createObjectURL(blob);
            audioRef.current = new Audio(url);

            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                setProgress(0);
                if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            });
        }
        return () => {
            if (audioRef.current) {
                URL.revokeObjectURL(audioRef.current.src);
            }
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [message.audioData]);

    const handlePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
            progressIntervalRef.current = window.setInterval(() => {
                if (audioRef.current && audioRef.current.duration > 0) {
                    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
                }
            }, 100);
        }
    };
    
    const PlayIcon: React.FC<{className: string}> = ({className}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
    const PauseIcon: React.FC<{className: string}> = ({className}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;

    const progressBgColor = isSender ? 'bg-white/30' : 'bg-gray-500';
    const progressIndicatorColor = isSender ? 'bg-white' : 'bg-cyan-400';

    return (
        <div className="flex items-center">
            <button onClick={handlePlayPause} className="mr-3 p-1 rounded-full text-white">
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
            <div className={`w-32 h-1 ${progressBgColor} rounded-full relative`}>
              <div className={`absolute top-0 left-0 h-full ${progressIndicatorColor} rounded-full`} style={{ width: `${progress}%` }}/>
            </div>
            <span className="ml-3 w-12 text-right text-xs opacity-70">{message.voiceDuration}</span>
        </div>
    );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSender, onReact }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  const bubbleClasses = isSender
    ? 'bg-cyan-600 text-white'
    : 'bg-gray-700 text-gray-200';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerRef]);


  const renderContent = () => {
    switch (message.type) {
      case MessageType.VOICE:
        return message.audioData ? <VoiceMessagePlayer message={message} isSender={isSender} /> : (
            <div className="flex items-center">
                <MicrophoneIcon className="w-5 h-5 mr-3" />
                <div className="w-32 h-1 bg-gray-400 rounded-full mr-3"></div>
                <span>{message.voiceDuration}</span>
            </div>
        );
      case MessageType.FILE:
        return (
          <div className="flex items-center bg-black bg-opacity-20 p-2 rounded-lg">
            <DocumentIcon className="w-8 h-8 mr-3 text-cyan-300" />
            <div>
              <p className="font-semibold">{message.fileInfo?.name}</p>
              <p className="text-xs">{message.fileInfo?.size}</p>
            </div>
          </div>
        );
      case MessageType.SYSTEM:
         return <p className="text-center text-xs text-gray-400 py-2">{message.text}</p>
      default: // TEXT
        return <p className="break-words whitespace-pre-wrap">{linkify(message.text)}</p>;
    }
  };
  
   if (message.type === MessageType.SYSTEM) {
    return (
      <div className="w-full text-center my-2">
        <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">{message.text}</span>
      </div>
    );
  }

  const handleEmojiSelect = (emoji: string) => {
    onReact(emoji);
    setShowEmojiPicker(false);
  };

  const reactionButton = (
    <button
      onClick={(e) => { e.stopPropagation(); setShowEmojiPicker(p => !p); }}
      className={`absolute -top-4 p-1 bg-gray-600 rounded-full text-gray-300 hover:bg-gray-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 ${isSender ? 'left-0' : 'right-0'}`}
      aria-label="React to message"
    >
      <SmileyIcon className="w-5 h-5" />
    </button>
  );

  const emojiPicker = showEmojiPicker && (
    <div
      ref={pickerRef}
      className={`absolute z-20 flex items-center bg-gray-700 rounded-full p-1 shadow-lg ${isSender ? 'left-0 -top-12' : 'right-0 -top-12'}`}
    >
      {EMOJIS.map(emoji => (
        <button
          key={emoji}
          onClick={() => handleEmojiSelect(emoji)}
          className="p-1.5 text-xl rounded-full hover:bg-gray-600 transition-transform transform hover:scale-125"
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );

  return (
    <div className={`flex flex-col w-full group ${isSender ? 'items-end' : 'items-start'}`}>
      <div className="relative max-w-xs md:max-w-md">
        {reactionButton}
        {emojiPicker}
        <div
          className={`flex flex-col rounded-2xl p-3 my-1 ${bubbleClasses} ${
            isSender ? 'rounded-br-lg' : 'rounded-bl-lg'
          }`}
        >
          {renderContent()}
          <p className="text-xs text-right mt-1 opacity-70">{message.timestamp}</p>
        </div>
      </div>
      {message.reactions && message.reactions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-0.5 px-2">
          {message.reactions.map(reaction => {
            if(reaction.users.length === 0) return null;
            const userReacted = reaction.users.includes(0);
            return (
              <button
                key={reaction.emoji}
                onClick={() => onReact(reaction.emoji)}
                className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded-full transition-colors ${
                  userReacted ? 'bg-cyan-500 bg-opacity-80 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span>{reaction.emoji}</span>
                <span className="font-semibold">{reaction.users.length}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;