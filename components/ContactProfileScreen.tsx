import React from 'react';
import type { Contact } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface ContactProfileScreenProps {
  contact: Contact;
  onBack: () => void;
}

const ContactProfileScreen: React.FC<ContactProfileScreenProps> = ({ contact, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white animate-slide-in-right">
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
        <h1 className="text-xl font-bold">Profil du contact</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center p-8">
            <img src={contact.avatarUrl} alt={contact.name} className="w-32 h-32 rounded-full mb-4 border-4 border-cyan-500 object-cover" />
            <h2 className="text-3xl font-bold">{contact.name}</h2>
        </div>

        <div className="px-4 space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm font-semibold mb-2">Statut</h3>
                <p className="text-white">{contact.status}</p>
            </div>
             <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm font-semibold mb-2">Téléphone</h3>
                <p className="text-white">{contact.phone}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactProfileScreen;