import React from 'react';
import type { Contact } from '../types';
import { UserAddIcon } from './icons/UserAddIcon';

interface ContactsListScreenProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onAddContact: () => void;
}

const ContactsListScreen: React.FC<ContactsListScreenProps> = ({ contacts, onSelectContact, onAddContact }) => {
  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <button onClick={onAddContact} className="p-2 rounded-full hover:bg-gray-700">
          <UserAddIcon className="w-6 h-6" />
        </button>
      </header>
      <ul className="flex-1 overflow-y-auto">
        {contacts.sort((a, b) => a.name.localeCompare(b.name)).map((contact) => {
          const isOnline = contact.status === 'En ligne' || contact.status === 'Écrit...';
          return (
            <li
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className="flex items-center p-3 hover:bg-gray-800 cursor-pointer transition-colors duration-200 border-b border-gray-800"
            >
              <img src={contact.avatarUrl} alt={contact.name} className="w-14 h-14 rounded-full mr-4 object-cover" />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-lg text-gray-100">{contact.name}</h3>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}
                    title={isOnline ? 'En ligne' : 'Hors ligne'}
                  ></span>
                </div>
                <p className="text-gray-400 text-sm">{contact.status}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ContactsListScreen;