
import React, { useState } from 'react';
import type { Contact } from '../types';
import ChatListItem from './ChatListItem';
import { MoreVertIcon } from './icons/MoreVertIcon';
import { SearchIcon } from './icons/SearchIcon';
import { AppLogo } from './icons/AppLogo';

interface ChatsListScreenProps {
  contacts: Contact[];
  onSelectChat: (contact: Contact) => void;
}

const ChatsListScreen: React.FC<ChatsListScreenProps> = ({ contacts, onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <AppLogo />
          <button className="p-2 rounded-full hover:bg-gray-700">
            <MoreVertIcon className="w-6 h-6" />
          </button>
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
        {filteredContacts.map((contact) => (
          <ChatListItem key={contact.id} contact={contact} onSelect={onSelectChat} />
        ))}
      </ul>
    </div>
  );
};

export default ChatsListScreen;
