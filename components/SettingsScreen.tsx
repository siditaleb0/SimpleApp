import React, { useState, useRef } from 'react';
import type { User } from '../types';
import { UserIcon } from './icons/UserIcon';
import { BellIcon } from './icons/BellIcon';
import { MoonIcon } from './icons/MoonIcon';
import { LockIcon } from './icons/LockIcon';
import { QuestionMarkIcon } from './icons/QuestionMarkIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { PencilIcon } from './icons/PencilIcon';
import { GoogleDriveIcon } from './icons/GoogleDriveIcon';
import { RocketIcon } from './icons/RocketIcon';

interface ProfileEditModalProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ user, onSave, onCancel }) => {
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newAvatarUrl = URL.createObjectURL(file);
      setAvatarUrl(newAvatarUrl);
    }
  };

  const handleSave = () => {
    onSave({
      ...user,
      name,
      avatarUrl,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm mx-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <style>{`
          @keyframes fade-in-scale {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fade-in-scale {
            animation: fade-in-scale 0.2s forwards ease-out;
          }
        `}</style>
        <h2 className="text-xl font-bold mb-4 text-center">Modifier le profil</h2>
        
        <div className="flex flex-col items-center mb-6">
          <button onClick={handleAvatarClick} className="relative group">
            <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-gray-600 group-hover:opacity-70 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <PencilIcon className="w-8 h-8 text-white" />
            </div>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Nom</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onCancel} className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors">Annuler</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 transition-colors">Enregistrer</button>
        </div>
      </div>
    </div>
  );
};


const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${enabled ? 'bg-cyan-500' : 'bg-gray-600'}`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
};


interface SettingsScreenProps {
  user: User;
  onUpdateUser: (user: User) => Promise<void>;
  onLogout: () => void;
  onNavigate: (screen: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onUpdateUser, onLogout, onNavigate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveProfile = async (updatedUser: User) => {
    await onUpdateUser(updatedUser);
    setIsEditModalOpen(false);
  };
  
  const settingsItems = [
    { id: 'account', icon: <UserIcon className="w-6 h-6 text-cyan-400" />, label: 'Compte' },
    { id: 'notifications', icon: <BellIcon className="w-6 h-6 text-cyan-400" />, label: 'Notifications', control: <ToggleSwitch enabled={user.notificationSettings?.enabled ?? true} onChange={async (val) => await onUpdateUser({...user, notificationSettings: { enabled: val }})} /> },
    { id: 'appearance', icon: <MoonIcon className="w-6 h-6 text-cyan-400" />, label: 'Apparence', control: <ToggleSwitch enabled={user.appearanceSettings?.darkMode ?? true} onChange={async (val) => await onUpdateUser({...user, appearanceSettings: { darkMode: val }})} /> },
    { id: 'privacy', icon: <LockIcon className="w-6 h-6 text-cyan-400" />, label: 'Confidentialité' },
    { id: 'help', icon: <QuestionMarkIcon className="w-6 h-6 text-cyan-400" />, label: 'Aide' },
    { id: 'datasync', icon: <GoogleDriveIcon className="w-6 h-6 text-cyan-400" />, label: 'Données et Synchro' },
    { id: 'deploy', icon: <RocketIcon className="w-6 h-6 text-cyan-400" />, label: 'Déployer l\'application' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center">Profil & Réglages</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Profile Section */}
        <section className="relative flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg mb-6">
          <button onClick={() => setIsEditModalOpen(true)} className="absolute top-2 right-2 p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white transition-colors" aria-label="Modifier le profil">
            <PencilIcon className="w-5 h-5" />
          </button>
          <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mb-4 border-4 border-cyan-500 object-cover" />
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-400">{user.status}</p>
        </section>

        {/* Settings List */}
        <section className="bg-gray-800 rounded-lg">
          <ul>
            {settingsItems.map((item, index) => {
                const liClassName = `flex items-center p-4 ${index < settingsItems.length - 1 ? 'border-b border-gray-700' : ''}`;

                if (item.control) {
                  return (
                    <li key={item.id} className={liClassName}>
                      <div className="mr-4">{item.icon}</div>
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.control}
                    </li>
                  );
                }
                
                return (
                  <li key={item.id}>
                    <button 
                        onClick={() => onNavigate(item.id)} 
                        className={`${liClassName} w-full text-left transition-colors hover:bg-gray-700`}
                    >
                      <div className="mr-4">{item.icon}</div>
                      <span className="flex-1 font-medium">{item.label}</span>
                      <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </li>
                );
            })}
          </ul>
        </section>

        {/* Logout Button */}
        <section className="mt-6">
          <button onClick={onLogout} className="flex items-center justify-center w-full p-4 bg-gray-800 rounded-lg hover:bg-red-900/50 transition-colors group">
            <div className="mr-4">
              <LogoutIcon className="w-6 h-6 text-red-500" />
            </div>
            <span className="flex-1 font-medium text-red-500 text-left">Se déconnecter</span>
          </button>
        </section>
      </div>
      
      {isEditModalOpen && <ProfileEditModal user={user} onSave={handleSaveProfile} onCancel={() => setIsEditModalOpen(false)} />}
    </div>
  );
};

export default SettingsScreen;