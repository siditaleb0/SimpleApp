import React from 'react';
import type { User } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PhoneSwitchIcon } from './icons/PhoneSwitchIcon';
import { InfoIcon } from './icons/InfoIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface AccountScreenProps {
  user: User;
  onBack: () => void;
  onChangeNumber: () => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ user, onBack, onChangeNumber }) => {
    
    const handleRequestInfo = () => {
        const report = `
Rapport d'informations du compte SimpleApp
-----------------------------------------
Exporté le: ${new Date().toLocaleString('fr-FR')}

Profil
-------
Nom: ${user.name}
Numéro de téléphone: ${user.phone}
Statut: ${user.status}

Paramètres
----------
Confirmations de lecture: ${user.privacySettings.readReceipts ? 'Activé' : 'Désactivé'}
Dernière visite visible par: ${user.privacySettings.lastSeen}
Photo de profil visible par: ${user.privacySettings.profilePhoto}
Notifications: ${user.notificationSettings.enabled ? 'Activé' : 'Désactivé'}
Mode sombre: ${user.appearanceSettings.darkMode ? 'Activé' : 'Désactivé'}
    `.trim();

        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `simpleapp_info_compte.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const accountItems = [
        { id: 'change-number', icon: <PhoneSwitchIcon className="w-6 h-6 text-cyan-400" />, label: 'Changer de numéro', description: 'Migrez votre compte vers un nouveau numéro.', action: onChangeNumber },
        { id: 'request-info', icon: <InfoIcon className="w-6 h-6 text-cyan-400" />, label: 'Demander les informations du compte', description: 'Obtenez un rapport de vos informations.', action: handleRequestInfo },
    ];

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
                <h1 className="text-xl font-bold">Compte</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h3 className="text-gray-400 text-sm font-semibold mb-1">Votre numéro de téléphone</h3>
                    <p className="text-white text-lg">{user.phone}</p>
                </div>
                <div className="bg-gray-800 rounded-lg">
                    <ul>
                        {accountItems.map((item, index) => {
                            const commonClasses = `flex items-center w-full p-4 text-left transition-colors ${index < accountItems.length - 1 ? 'border-b border-gray-700' : ''}`;
                            const hoverClass = 'hover:bg-gray-700';

                            return (
                                <li key={item.id}>
                                    <button 
                                        onClick={item.action}
                                        className={`${commonClasses} ${hoverClass}`}
                                    >
                                        <div className="mr-4">{item.icon}</div>
                                        <div className="flex-1">
                                            <p className='font-medium text-white'>{item.label}</p>
                                            <p className="text-sm text-gray-400">{item.description}</p>
                                        </div>
                                        <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AccountScreen;