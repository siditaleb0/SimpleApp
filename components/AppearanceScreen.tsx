import React, { useRef } from 'react';
import type { User } from '../types';
import * as backend from '../backend';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${enabled ? 'bg-cyan-500' : 'bg-gray-600'}`}
    >
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

interface AppearanceScreenProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onBack: () => void;
}

const AppearanceScreen: React.FC<AppearanceScreenProps> = ({ user, onUpdateUser, onBack }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDarkModeChange = (enabled: boolean) => {
        onUpdateUser({
            ...user,
            appearanceSettings: {
                ...user.appearanceSettings,
                darkMode: enabled,
            }
        });
    };

    const handleBackgroundChangeClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    onUpdateUser({
                        ...user,
                        appearanceSettings: {
                            ...user.appearanceSettings,
                            chatBackground: event.target.result as string,
                        }
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleResetBackground = () => {
        onUpdateUser({
            ...user,
            appearanceSettings: {
                ...user.appearanceSettings,
                chatBackground: backend.getDefaultChatBackground(),
            }
        });
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white animate-slide-in">
             <style>{`
              @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
              .animate-slide-in { animation: slide-in 0.2s forwards ease-out; }
            `}</style>
            <header className="flex items-center p-3 bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
                <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-gray-700">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Apparence</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Mode Sombre</p>
                        <ToggleSwitch enabled={user.appearanceSettings.darkMode} onChange={handleDarkModeChange} />
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Fond d'écran de la discussion</h3>
                    <div className="w-full h-32 rounded-md mb-4 bg-cover bg-center" style={{ backgroundImage: `url("${user.appearanceSettings.chatBackground}")` }}></div>
                    <div className="flex space-x-3">
                        <button onClick={handleBackgroundChangeClick} className="flex-1 bg-cyan-600 text-white font-bold py-2 rounded-lg hover:bg-cyan-700 transition-colors">
                            Changer
                        </button>
                        <button onClick={handleResetBackground} className="flex-1 bg-gray-700 text-white font-bold py-2 rounded-lg hover:bg-gray-600 transition-colors">
                            Réinitialiser
                        </button>
                    </div>
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        className="hidden" 
                        accept="image/*"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </div>
    );
};

export default AppearanceScreen;
