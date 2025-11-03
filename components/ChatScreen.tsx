
import React, { useState, useEffect, useRef } from 'react';
import type { Contact, Message, CallType } from '../types';
import { MessageType } from '../types';
import { mockMessages } from '../constants';
import MessageBubble from './MessageBubble';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { VideoIcon } from './icons/VideoIcon';
import { MoreVertIcon } from './icons/MoreVertIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { SendIcon } from './icons/SendIcon';

interface ChatScreenProps {
  contact: Contact;
  onBack: () => void;
  onStartCall: (contact: Contact, type: CallType) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ contact, onBack, onStartCall }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages[contact.id] || []);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: messages.length + 1,
      senderId: 0, // 0 represents the current user
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: MessageType.TEXT,
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleReaction = (messageId: number, emoji: string) => {
    setMessages(currentMessages => {
      return currentMessages.map(msg => {
        if (msg.id === messageId) {
          const newReactions = [...(msg.reactions || [])];
          let reaction = newReactions.find(r => r.emoji === emoji);

          if (reaction) {
            const userIndex = reaction.users.indexOf(0); // 0 is current user
            if (userIndex > -1) {
              // User already reacted, so remove reaction
              reaction.users.splice(userIndex, 1);
              if (reaction.users.length === 0) {
                // No one else has this reaction, remove it entirely
                return { ...msg, reactions: newReactions.filter(r => r.emoji !== emoji) };
              }
            } else {
              // User hasn't reacted with this emoji yet, add them
              reaction.users.push(0);
            }
          } else {
            // New reaction for this message
            reaction = { emoji, users: [0] };
            newReactions.push(reaction);
          }
          
          return { ...msg, reactions: newReactions };
        }
        return msg;
      });
    });
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const message: Message = {
        id: messages.length + 1,
        senderId: 0,
        text: '',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: MessageType.FILE,
        fileInfo: {
          name: file.name,
          size: formatFileSize(file.size),
        },
      };
      setMessages(prev => [...prev, message]);
      
      if(e.target) {
        e.target.value = '';
      }
    }
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
          <button onClick={() => onStartCall(contact, 'video')} className="p-2 rounded-full hover:bg-gray-700">
            <VideoIcon className="w-6 h-6" />
          </button>
          <button onClick={() => onStartCall(contact, 'audio')} className="p-2 rounded-full hover:bg-gray-700">
            <PhoneIcon className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-700">
            <MoreVertIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
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
          <button type="submit" className="bg-cyan-500 rounded-full p-3 text-white hover:bg-cyan-600 transition-colors">
            {newMessage ? <SendIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatScreen;
