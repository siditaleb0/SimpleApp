import React, { useState, useRef, useEffect } from 'react';
import type { Contact, Screen } from '../types';
import ChatListItem from './ChatListItem';
import { MoreVertIcon } from './icons/MoreVertIcon';
import { SearchIcon } from './icons/SearchIcon';
import { AppLogo } from './icons/AppLogo';
import { ArchiveIcon } from './icons/ArchiveIcon';

interface ChatsListScreenProps {
  contacts: Contact[];
  onSelectChat: (contact: Contact) => void;
  onViewArchived: () => void;
  setActiveScreen: (screen: Screen) => void;
}

const ChatsListScreen: React.FC<ChatsListScreenProps> = ({ contacts, onSelectChat, onViewArchived, setActiveScreen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const nonArchivedContacts = contacts.filter(contact => 
    !contact.isArchived && contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const archivedCount = contacts.filter(c => c.isArchived).length;

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <AppLogo />
          <div className="relative">
            <button onClick={() => setIsMenuOpen(p => !p)} className="p-2 rounded-full hover:bg-gray-700">
              <MoreVertIcon className="w-6 h-6" />
            </button>
            {isMenuOpen && (
              <div ref={menuRef} className="absolute top-12 right-0 w-56 bg-gray-700 rounded-md shadow-lg z-20 py-1">
                <ul>
                  <li><button className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Nouveau groupe</button></li>
                  <li><button onClick={() => { setActiveScreen('contacts'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Nouvelle discussion</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une discussion..."
            aria-label="Rechercher une discussion"
            className="w-full bg-gray-700 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
          />
        </div>
      </header>
      <ul className="flex-1 overflow-y-auto">
        {archivedCount > 0 && (
          <li onClick={onViewArchived} className="flex items-center p-3 hover:bg-gray-800 cursor-pointer transition-colors duration-200 border-b border-gray-800">
            <div className="w-14 h-14 rounded-full mr-4 bg-gray-700 flex items-center justify-center">
              <ArchiveIcon className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-100">Archivées</h3>
              <p className="text-gray-400 text-sm">{archivedCount} discussion{archivedCount > 1 ? 's' : ''}</p>
            </div>
          </li>
        )}
        {nonArchivedContacts.map((contact) => (
          <ChatListItem key={contact.id} contact={contact} onSelect={onSelectChat} />
        ))}
      </ul>
    </div>
  );
};

export default ChatsListScreen;