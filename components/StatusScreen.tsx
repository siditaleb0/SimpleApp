import React, { useRef } from 'react';
import type { Contact, User } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { PencilIcon } from './icons/PencilIcon';

interface StatusScreenProps {
  user: User;
  contacts: Contact[];
  onAddStatus: (imageUrl: string) => void;
  onSelectStatus: (contact: Contact) => void;
}

const StatusListItem: React.FC<{
  avatarUrl: string;
  name: string;
  timestamp: string;
  viewed?: boolean;
  onClick: () => void;
}> = ({ avatarUrl, name, timestamp, viewed, onClick }) => {
  const ringClass = viewed ? 'border-gray-600' : 'border-cyan-500';

  return (
    <li onClick={onClick} className="flex items-center p-3 hover:bg-gray-800 cursor-pointer transition-colors duration-200">
      <div className={`relative p-0.5 rounded-full border-2 ${ringClass}`}>
        <img
          src={avatarUrl}
          alt={name}
          className="w-14 h-14 rounded-full object-cover"
        />
      </div>
      <div className="ml-4">
        <h3 className="font-semibold text-lg text-gray-100">{name}</h3>
        <p className="text-gray-400 text-sm">{timestamp}</p>
      </div>
    </li>
  );
};


const StatusScreen: React.FC<StatusScreenProps> = ({ user, contacts, onAddStatus, onSelectStatus }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const contactsWithStatus = contacts.filter(c => c.statusUpdates && c.statusUpdates.length > 0);
  const recentUpdates = contactsWithStatus.filter(c => c.statusUpdates?.some(s => !s.viewed));
  const viewedUpdates = contactsWithStatus.filter(c => c.statusUpdates?.every(s => s.viewed));
  
  const handleMyStatusClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onAddStatus(imageUrl);
    }
  };
  
  return (
    <div className="flex flex-col h-full relative">
       <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        accept="image/*"
        className="hidden" 
        aria-hidden="true"
     />
      <header className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <h1 className="text-2xl font-bold">Statut</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto">
        {/* My Status */}
        <ul>
            <li onClick={handleMyStatusClick} className="flex items-center p-3 hover:bg-gray-800 cursor-pointer transition-colors duration-200 border-b border-gray-800">
                <div className="relative">
                    <img
                    src={user.statusUpdates && user.statusUpdates.length > 0 ? user.statusUpdates[user.statusUpdates.length-1].imageUrl : user.avatarUrl}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                        <span className="text-white font-bold text-lg leading-none">+</span>
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="font-semibold text-lg text-gray-100">Mon statut</h3>
                    <p className="text-gray-400 text-sm">Appuyez pour ajouter une mise à jour</p>
                </div>
            </li>
        </ul>

        {/* Recent Updates */}
        {recentUpdates.length > 0 && (
          <div>
            <h2 className="px-4 py-2 text-sm font-semibold text-gray-400 bg-gray-900">Mises à jour récentes</h2>
            <ul>
              {recentUpdates.map(contact => (
                <StatusListItem
                  key={contact.id}
                  avatarUrl={contact.statusUpdates?.[contact.statusUpdates.length - 1].imageUrl || contact.avatarUrl}
                  name={contact.name}
                  timestamp={contact.statusUpdates?.[contact.statusUpdates.length - 1].timestamp || ''}
                  viewed={false}
                  onClick={() => onSelectStatus(contact)}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Viewed Updates */}
        {viewedUpdates.length > 0 && (
          <div>
            <h2 className="px-4 py-2 text-sm font-semibold text-gray-400 bg-gray-900">Mises à jour vues</h2>
            <ul>
              {viewedUpdates.map(contact => (
                <StatusListItem
                  key={contact.id}
                  avatarUrl={contact.statusUpdates?.[contact.statusUpdates.length - 1].imageUrl || contact.avatarUrl}
                  name={contact.name}
                  timestamp={contact.statusUpdates?.[contact.statusUpdates.length - 1].timestamp || ''}
                  viewed={true}
                  onClick={() => onSelectStatus(contact)}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* FABs */}
      <div className="absolute bottom-20 right-4 space-y-3">
         <button className="bg-gray-700 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg hover:bg-gray-600 transition-colors" aria-label="Créer un statut texte">
            <PencilIcon className="w-6 h-6" />
         </button>
         <button onClick={handleMyStatusClick} className="bg-cyan-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg hover:bg-cyan-600 transition-colors" aria-label="Créer un statut photo/vidéo">
            <CameraIcon className="w-7 h-7" />
         </button>
      </div>

    </div>
  );
};

export default StatusScreen;