
import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PhoneSwitchIcon } from './icons/PhoneSwitchIcon';
import { InfoIcon } from './icons/InfoIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface AccountScreenProps {
  onBack: () => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ onBack }) => {
    const accountItems = [
        { id: 'change-number', icon: <PhoneSwitchIcon className="w-6 h-6 text-cyan-400" />, label: 'Changer de numéro', description: 'Migrez votre compte vers un nouveau numéro.' },
        { id: 'request-info', icon: <InfoIcon className="w-6 h-6 text-cyan-400" />, label: 'Demander les informations du compte', description: 'Obtenez un rapport de vos informations.' },
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
                <div className="bg-gray-800 rounded-lg">
                    <ul>
                        {accountItems.map((item, index) => {
                            const commonClasses = `flex items-center w-full p-4 text-left transition-colors ${index < accountItems.length - 1 ? 'border-b border-gray-700' : ''}`;
                            const hoverClass = 'hover:bg-gray-700';

                            return (
                                <li key={item.id}>
                                    <button 
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