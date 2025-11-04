
import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface DeveloperScreenProps {
  onBack: () => void;
}

const DataSection: React.FC<{ title: string, data: any }> = ({ title, data }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    return (
        <div className="bg-gray-800 rounded-lg mb-4">
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full flex justify-between items-center p-4 hover:bg-gray-700 transition-colors rounded-t-lg">
                <h2 className="text-lg font-semibold">{title}</h2>
                <span className="transform transition-transform duration-200" style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </span>
            </button>
            {!isCollapsed && (
                <div className="p-4 border-t border-gray-700">
                    <pre className="text-xs whitespace-pre-wrap break-all bg-gray-900 p-3 rounded-md max-h-96 overflow-y-auto">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

const DeveloperScreen: React.FC<DeveloperScreenProps> = ({ onBack }) => {
    const [appData, setAppData] = useState<Record<string, any>>({});

    useEffect(() => {
        const data: Record<string, any> = {};
        const keys = [
            'simpleapp_user',
            'simpleapp_contacts',
            'simpleapp_messages',
            'simpleapp_calls',
        ];
        keys.forEach(key => {
            const item = localStorage.getItem(key);
            data[key] = item ? JSON.parse(item) : null;
        });
        setAppData(data);
    }, []);

    const handleExport = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(appData, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `simpleapp_database_export_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
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
                <h1 className="text-xl font-bold">Données de l'application</h1>
            </header>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="p-4 mb-4 text-sm text-gray-400 bg-gray-800 rounded-lg">
                    Ceci est une vue de la "base de données" locale de l'application stockée dans votre navigateur.
                </div>
                {Object.entries(appData).map(([key, data]) => (
                    <DataSection key={key} title={key} data={data} />
                ))}
                 <button onClick={handleExport} className="w-full mt-4 p-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-colors">
                    Exporter toutes les données
                </button>
            </div>
        </div>
    );
};

export default DeveloperScreen;
