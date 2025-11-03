
import React from 'react';
import type { Screen } from '../types';
import { ChatIcon } from './icons/ChatIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { ContactsIcon } from './icons/ContactsIcon';

interface BottomNavBarProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeScreen, setActiveScreen }) => {
  return (
    <nav className="bg-gray-800 border-t border-gray-700 flex justify-around">
      <NavItem
        label="Discussions"
        icon={<ChatIcon className="w-6 h-6" />}
        isActive={activeScreen === 'chats'}
        onClick={() => setActiveScreen('chats')}
      />
      <NavItem
        label="Appels"
        icon={<PhoneIcon className="w-6 h-6" />}
        isActive={activeScreen === 'calls'}
        onClick={() => setActiveScreen('calls')}
      />
      <NavItem
        label="Contacts"
        icon={<ContactsIcon className="w-6 h-6" />}
        isActive={activeScreen === 'contacts'}
        onClick={() => setActiveScreen('contacts')}
      />
    </nav>
  );
};

export default BottomNavBar;
