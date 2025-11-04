import React, { useState, useEffect, useRef } from 'react';
import type { Contact, Message, CallType, User } from '../types';
import { MessageType } from '../types';
import * as backend from '../backend';
import MessageBubble from './MessageBubble';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { VideoIcon } from './icons/VideoIcon';
import { MoreVertIcon } from './icons/MoreVertIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { SendIcon } from './icons/SendIcon';
import { ExportIcon } from './icons/ExportIcon';
import { TrashIcon } from './icons/TrashIcon';
import { StopIcon } from './icons/StopIcon';
import { ArchiveIcon } from './icons/ArchiveIcon';
import { UnarchiveIcon } from './icons/UnarchiveIcon';
import { UserIcon } from './icons/UserIcon';
import { BlockIcon } from './icons/BlockIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';


interface ChatScreenProps {
  contact: Contact;
  user: User;
  onBack: () => void;
  onStartCall: (contact: Contact, type: CallType) => Promise<void>;
  onArchive: (contactId: number, archiveState: boolean) => Promise<void>;
  onBlock: (contactId: number, blockState: boolean) => Promise<void>;
  onClearChat: (contactId: number) => Promise<void>;
  onViewProfile: (contact: Contact) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ contact, user, onBack, onStartCall, onArchive, onBlock, onClearChat, onViewProfile }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    setMessages(backend.getMessages(contact.id));
  }, [contact.id]);


  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

   useEffect(() => {
    if (isRecording) {
        timerIntervalRef.current = window.setInterval(() => {
            setRecordingTime(prevTime => prevTime + 1);
        }, 1000);
    } else {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        setRecordingTime(0);
    }
    return () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
    };
}, [isRecording]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isSending) return;

    setIsSending(true);

    const message: Message = {
      id: Date.now(),
      senderId: 0, // 0 represents the current user
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: MessageType.TEXT,
    };
    
    setNewMessage('');
    const updatedMessages = await backend.saveMessage(contact.id, message);
    setMessages(updatedMessages);
    setIsSending(false);
  };

  const handleReaction = async (messageId: number, emoji: string) => {
    const updatedMessages = await backend.updateMessageReactions(contact.id, messageId, emoji);
    setMessages(updatedMessages);
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const message: Message = {
        id: Date.now(),
        senderId: 0,
        text: '',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: MessageType.FILE,
        fileInfo: {
          name: file.name,
          size: formatFileSize(file.size),
        },
      };
      const updatedMessages = await backend.saveMessage(contact.id, message);
      setMessages(updatedMessages);
      
      if(e.target) {
        e.target.value = '';
      }
    }
  };

  const handleExportChat = () => {
    const chatHistory = messages.map(msg => {
      const senderName = msg.senderId === 0 ? 'Moi' : contact.name;
      let messageText = msg.text;
      if (msg.type === MessageType.FILE && msg.fileInfo) {
          messageText = `Fichier: ${msg.fileInfo.name} (${msg.fileInfo.size})`;
      } else if (msg.type === MessageType.VOICE && msg.voiceDuration) {
          messageText = `Message vocal (${msg.voiceDuration})`;
      } else if (msg.type === MessageType.SYSTEM) {
          return `--- ${messageText} ---`;
      }
      return `[${msg.timestamp}] ${senderName}: ${messageText}`;
    }).join('\n');

    const header = `Discussion avec ${contact.name}\nExporté le ${new Date().toLocaleString('fr-FR')}\n\n`;
    const fileContent = header + chatHistory;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Discussion_avec_${contact.name.replace(/\s/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsMenuOpen(false);
  };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleStartRecording = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("La fonctionnalité d'enregistrement audio n'est pas supportée par votre navigateur.");
                return;
            }

            const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });

            if (permissionStatus.state === 'denied') {
                alert("L'accès au microphone est bloqué. Veuillez l'autoriser dans les paramètres de votre navigateur pour ce site afin d'enregistrer des messages vocaux.");
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioData = await blobToBase64(audioBlob);
                
                const message: Message = {
                    id: Date.now(),
                    senderId: 0,
                    text: '',
                    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    type: MessageType.VOICE,
                    voiceDuration: formatTime(recordingTime),
                    audioData: audioData,
                };
                const updatedMessages = await backend.saveMessage(contact.id, message);
                setMessages(updatedMessages);

                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            
            let errorMessage = "Une erreur inattendue est survenue lors de l'accès au microphone.";
            if (err instanceof Error) {
                switch (err.name) {
                    case 'NotAllowedError':
                        errorMessage = "Vous avez refusé l'accès au microphone. L'autorisation est nécessaire pour enregistrer des messages vocaux.";
                        break;
                    case 'NotFoundError':
                        errorMessage = "Aucun microphone n'a été trouvé sur votre appareil.";
                        break;
                    case 'NotReadableError':
                         errorMessage = "Impossible d'accéder au microphone en raison d'un problème matériel.";
                         break;
                    default:
                        errorMessage = `Une erreur est survenue: ${err.message}`;
                }
            }
            alert(errorMessage);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
    };

    const handleCancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            // Stop without saving
            mediaRecorderRef.current.onstop = () => {
                 mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

  const handleArchive = async () => {
    await onArchive(contact.id, !contact.isArchived);
    setIsMenuOpen(false);
  }

  const handleClearChat = async () => {
    setIsMenuOpen(false);
    if (window.confirm(`Voulez-vous vraiment effacer tous les messages de cette discussion ?`)) {
      await onClearChat(contact.id);
      setMessages([]);
    }
  }

  const handleBlock = async () => {
    setIsMenuOpen(false);
    if (window.confirm(`Voulez-vous vraiment bloquer ${contact.name} ? Les contacts bloqués ne pourront plus vous appeler ou vous envoyer de messages.`)) {
      await onBlock(contact.id, true);
    }
  }
  
  const handleUnblock = async () => {
    await onBlock(contact.id, false);
    setIsMenuOpen(false);
  }

  const backgroundStyle = {
    backgroundImage: user.appearanceSettings?.chatBackground 
      ? `linear-gradient(rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.9)), url("${user.appearanceSettings.chatBackground}")`
      : `none`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <header className="flex items-center p-3 bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-gray-700">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <img src={contact.avatarUrl} alt={contact.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{contact.name}</h2>
          <p className="text-sm text-gray-400">{contact.status}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => onStartCall(contact, 'video')} className="p-2 rounded-full hover:bg-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed" disabled={contact.isBlocked}>
            <VideoIcon className="w-6 h-6" />
          </button>
          <button onClick={() => onStartCall(contact, 'audio')} className="p-2 rounded-full hover:bg-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed" disabled={contact.isBlocked}>
            <PhoneIcon className="w-6 h-6" />
          </button>
          <div className="relative">
            <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-700">
              <MoreVertIcon className="w-6 h-6" />
            </button>
            {isMenuOpen && (
              <div ref={menuRef} className="absolute top-12 right-0 w-56 bg-gray-700 rounded-md shadow-lg z-20 py-1">
                <ul>
                  <li><button onClick={() => { onViewProfile(contact); setIsMenuOpen(false); }} className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600"><UserIcon className="w-5 h-5 mr-3" />Voir le profil</button></li>
                  <li><button onClick={handleArchive} className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600">{contact.isArchived ? <><UnarchiveIcon className="w-5 h-5 mr-3" />Désarchiver</> : <><ArchiveIcon className="w-5 h-5 mr-3" />Archiver</>}</button></li>
                  <li><button onClick={handleClearChat} className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600"><TrashIcon className="w-5 h-5 mr-3" />Effacer les messages</button></li>
                  <li><button onClick={handleExportChat} className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600"><ExportIcon className="w-5 h-5 mr-3" />Exporter la discussion</button></li>
                  <div className="h-px bg-gray-600 my-1"></div>
                  {contact.isBlocked ? (
                    <li><button onClick={handleUnblock} className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600"><BlockIcon className="w-5 h-5 mr-3" />Débloquer</button></li>
                  ) : (
                    <li><button onClick={handleBlock} className="flex items-center w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-600"><BlockIcon className="w-5 h-5 mr-3" />Bloquer</button></li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2"
        style={backgroundStyle}
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isSender={msg.senderId === 0}
            onReact={(emoji) => handleReaction(msg.id, emoji)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <footer className="p-3 bg-gray-800 border-t border-gray-700 sticky bottom-0">
        {contact.isBlocked ? (
          <div className="flex flex-col items-center justify-center text-center py-2">
            <p className="text-gray-400">Vous avez bloqué ce contact.</p>
            <button onClick={handleUnblock} className="text-cyan-400 font-semibold mt-1 hover:underline">Appuyez pour débloquer</button>
          </div>
        ) : isRecording ? (
             <div className="flex items-center space-x-3 w-full">
                <button type="button" onClick={handleCancelRecording} className="p-3 text-red-500 hover:text-red-400">
                    <TrashIcon className="w-6 h-6" />
                </button>
                <div className="flex-1 flex items-center bg-gray-700 rounded-full px-4 py-3 text-red-400">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-3"></div>
                    <span className="font-mono">{formatTime(recordingTime)}</span>
                </div>
                <button type="button" onClick={handleStopRecording} className="bg-cyan-500 rounded-full p-3 text-white hover:bg-cyan-600 transition-colors">
                    <StopIcon className="w-6 h-6" />
                </button>
            </div>
        ) : (
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <div className="flex-1 flex items-center bg-gray-700 rounded-full px-4">
                <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message..."
                className="flex-1 bg-transparent py-3 focus:outline-none text-white"
                />
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect}
                    className="hidden" 
                    aria-hidden="true"
                />
                <button type="button" onClick={handleAttachmentClick} className="p-2 text-gray-400 hover:text-white" aria-label="Attach file">
                    <PaperclipIcon className="w-6 h-6" />
                </button>
            </div>
            <button 
                type={newMessage.trim() ? 'submit' : 'button'}
                onClick={!newMessage.trim() ? handleStartRecording : undefined}
                className="bg-cyan-500 rounded-full p-3 text-white hover:bg-cyan-600 transition-colors flex items-center justify-center w-12 h-12 disabled:bg-gray-600"
                disabled={isSending}
            >
                {isSending 
                    ? <SpinnerIcon className="w-6 h-6"/> 
                    : (newMessage.trim() ? <SendIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />)
                }
            </button>
            </form>
        )}
      </footer>
    </div>
  );
};

export default ChatScreen;