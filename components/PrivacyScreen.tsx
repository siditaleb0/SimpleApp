
import React, { useState } from 'react';
import type { User, PrivacySettings } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { BlockIcon } from './icons/BlockIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import SelectionModal from './SelectionModal';

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

interface PrivacySettingItemProps {
  label: string;
  value: string;
  onClick: () => void;
}

const PrivacySettingItem: React.FC<PrivacySettingItemProps> = ({ label, value, onClick }) => (
    <button onClick={onClick} className="flex items-center w-full p-4 hover:bg-gray-700 transition-colors border-b border-gray-700">
        <div className="flex-1">
            <p className="font-medium text-left">{label}</p>
            <p className="text-sm text-gray-400 text-left">{value}</p>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
    </button>
);

type ModalState = {
    type: 'lastSeen' | 'profilePhoto' | null;
    title: string;
    options: string[];
};

interface PrivacyScreenProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onBack: () => void;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ user, onUpdateUser, onBack }) => {
    const [modalState, setModalState] = useState<ModalState>({ type: null, title: '', options: [] });

    const LAST_SEEN_OPTIONS: PrivacySettings['lastSeen'][] = ['Tout le monde', 'Mes contacts', 'Personne'];
    const PROFILE_PHOTO_OPTIONS: PrivacySettings['profilePhoto'][] = ['Tout le monde', 'Mes contacts', 'Personne'];
    
    const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
        const updatedUser = {
            ...user,
            privacySettings: {
                ...user.privacySettings,
                [key]: value,
            }
        };
        onUpdateUser(updatedUser);
    };

    const handleModalSelect = (value: string) => {
        if (modalState.type === 'lastSeen') {
            handlePrivacyChange('lastSeen', value);
        } else if (modalState.type === 'profilePhoto') {
            handlePrivacyChange('profilePhoto', value);
        }
        setModalState({ type: null, title: '', options: [] });
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white animate-slide-in">
             <style>{`
              @keyframes slide-in {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
              .animate-slide-in {
                animation: slide-in 0.2s forwards ease-out;
              }
            `}</style>
            <header className="flex items-center p-3 bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
                <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-gray-700">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Confidentialité</h1>
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="p-4 pt-6 text-sm text-gray-400">
                    Gérez qui peut voir vos informations personnelles.
                </div>

                <div className="bg-gray-800 rounded-lg mx-4">
                    <PrivacySettingItem 
                        label="Dernière visite"
                        value={user.privacySettings.lastSeen}
                        onClick={() => setModalState({ type: 'lastSeen', title: 'Qui peut voir ma dernière visite', options: LAST_SEEN_OPTIONS })}
                    />
                    <PrivacySettingItem 
                        label="Photo de profil"
                        value={user.privacySettings.profilePhoto}
                        onClick={() => setModalState({ type: 'profilePhoto', title: 'Qui peut voir ma photo de profil', options: PROFILE_PHOTO_OPTIONS })}
                    />
                     <div className="flex items-center justify-between p-4">
                        <div className="flex-1 pr-4">
                            <p className="font-medium">Confirmations de lecture</p>
                            <p className="text-sm text-gray-400">Si désactivé, vous ne verrez pas non plus celles des autres.</p>
                        </div>
                        <ToggleSwitch enabled={user.privacySettings.readReceipts} onChange={(val) => handlePrivacyChange('readReceipts', val)} />
                    </div>
                </div>
                
                <div className="p-4 mt-4 text-sm text-gray-400">
                    Gérez les contacts que vous avez bloqués.
                </div>

                <div className="bg-gray-800 rounded-lg mx-4">
                     <button className="flex items-center w-full p-4 hover:bg-gray-700 transition-colors">
                        <BlockIcon className="w-6 h-6 text-cyan-400" />
                        <div className="flex-1 ml-4">
                             <p className="font-medium text-left">Contacts bloqués</p>
                             <p className="text-sm text-gray-400 text-left">Aucun</p>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                     </button>
                </div>
            </div>

            {modalState.type && (
                <SelectionModal
                    title={modalState.title}
                    options={modalState.options}
                    selectedValue={modalState.type === 'lastSeen' ? user.privacySettings.lastSeen : user.privacySettings.profilePhoto}
                    onSelect={handleModalSelect}
                    onClose={() => setModalState({ type: null, title: '', options: [] })}
                />
            )}
        </div>
    );
};

export default PrivacyScreen;
