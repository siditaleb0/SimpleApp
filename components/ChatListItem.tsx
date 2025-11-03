
import React from 'react';
import type { Contact } from '../types';

interface ChatListItemProps {
  contact: Contact;
  onSelect: (contact: Contact) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ contact, onSelect }) => {
  return (
    <li
      onClick={() => onSelect(contact)}
      className="flex items-center p-3 hover:bg-gray-800 cursor-pointer transition-colors duration-200 border-b border-gray-800"
    >
      <img
        src={contact.avatarUrl}
        alt={contact.name}
        className="w-14 h-14 rounded-full mr-4 object-cover"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-100">{contact.name}</h3>
          <p className={`text-xs ${contact.unreadCount ? 'text-cyan-400' : 'text-gray-400'}`}>{contact.lastMessageTime}</p>
        </div>
        <div className="flex justify-between items-start mt-1">
            <p className="text-gray-400 text-sm truncate pr-4">{contact.lastMessage}</p>
            {contact.unreadCount && contact.unreadCount > 0 && (
                <span className="bg-cyan-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {contact.unreadCount}
                </span>
            )}
        </div>
      </div>
    </li>
  );
};

export default ChatListItem;
