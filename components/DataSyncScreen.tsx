import React, { useRef } from 'react';
import * as backend from '../backend';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { GoogleDriveIcon } from './icons/GoogleDriveIcon';

interface DataSyncScreenProps {
  onBack: () => void;
  onRestore: (jsonData: string) => void;
}

const DataSyncScreen: React.FC<DataSyncScreenProps> = ({ onBack, onRestore }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBackup = () => {
        const jsonData = backend.exportAllData();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `simpleapp_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    if (window.confirm("Restaurer cette sauvegarde remplacera toutes les données actuelles. Continuer ?")) {
                        onRestore(text);
                    }
                }
            };
            reader.readAsText(file);
        }
        // Reset file input
        if(event.target) event.target.value = '';
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
                <h1 className="text-xl font-bold">Données et Synchro</h1>
            </header>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <GoogleDriveIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Sauvegarde et Restauration</h2>
                    <p className="text-gray-400 mb-6">
                       Sauvegardez vos données dans un fichier, que vous pouvez stocker sur Google Drive ou ailleurs, et restaurez-les plus tard.
                    </p>
                    <div className="space-y-4">
                        <button onClick={handleBackup} className="w-full p-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-colors">
                            Sauvegarder (Simulé)
                        </button>
                        <button onClick={handleRestoreClick} className="w-full p-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors">
                            Restaurer une sauvegarde
                        </button>
                    </div>
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        className="hidden" 
                        accept=".json"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </div>
    );
};

export default DataSyncScreen;