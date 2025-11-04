import React from 'react';
import type { Contact } from '../types';
import ChatListItem from './ChatListItem';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface ArchivedChatsScreenProps {
  contacts: Contact[];
  onSelectChat: (contact: Contact) => void;
  onBack: () => void;
}

const ArchivedChatsScreen: React.FC<ArchivedChatsScreenProps> = ({ contacts, onSelectChat, onBack }) => {
  return (
    <div className="flex flex-col h-full animate-slide-in-right">
       <style>{`
          @keyframes slide-in-right {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.2s forwards ease-out;
          }
        `}</style>
      <header className="flex items-center p-3 bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-gray-700">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Discussions archivées</h1>
      </header>
      {contacts.length > 0 ? (
        <ul className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
            <ChatListItem key={contact.id} contact={contact} onSelect={onSelectChat} />
            ))}
        </ul>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <p className="text-gray-400">Vos discussions archivées apparaîtront ici.</p>
        </div>
      )}
    </div>
  );
};

export default ArchivedChatsScreen;