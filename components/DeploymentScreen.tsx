import React, { useState } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

const DEPLOYMENT_STEPS = [
    { text: "Initialisation du déploiement...", delay: 500 },
    { text: "Lecture de la configuration du projet...", delay: 800 },
    { text: "Installation des dépendances...", delay: 1500 },
    { text: "Création du build de production...", delay: 2000 },
    { text: "Optimisation des ressources (images, scripts)...", delay: 1200 },
    { text: "Envoi des fichiers vers le serveur...", delay: 1800 },
    { text: "Vérification du déploiement...", delay: 1000 },
    { text: "Déploiement terminé avec succès !", delay: 500 },
];

const DeploymentScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployUrl, setDeployUrl] = useState<string | null>(null);

    const handleDeploy = () => {
        setIsDeploying(true);
        setLogs([]);
        setDeployUrl(null);

        let cumulativeDelay = 0;
        DEPLOYMENT_STEPS.forEach(step => {
            cumulativeDelay += step.delay;
            setTimeout(() => {
                setLogs(prevLogs => [...prevLogs, step.text]);
            }, cumulativeDelay);
        });
        
        setTimeout(() => {
            setIsDeploying(false);
            // Generate a random-like URL
            const randomString = Math.random().toString(36).substring(2, 8);
            setDeployUrl(`https://simpleapp-${randomString}.netlify.app`);
        }, cumulativeDelay + 500);
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
                <h1 className="text-xl font-bold">Déployer l'application</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="bg-gray-800 rounded-lg p-4">
                    <h2 className="text-xl font-bold mb-2">Mise en ligne gratuite</h2>
                    <p className="text-gray-400">
                        Cette simulation montre comment votre application peut être déployée sur un service d'hébergement statique gratuit (comme Netlify ou Vercel). Une fois déployée, elle sera accessible via une URL publique.
                    </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                    <button 
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className="w-full p-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        {isDeploying ? 'Déploiement en cours...' : 'Lancer le déploiement'}
                    </button>
                </div>
                
                {(isDeploying || logs.length > 0) && (
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Journal de bord :</h3>
                        <div className="bg-black rounded-md p-3 max-h-60 overflow-y-auto font-mono text-sm text-gray-300">
                            {logs.map((log, index) => (
                                <p key={index} className="whitespace-pre-wrap">{`> ${log}`}</p>
                            ))}
                        </div>
                    </div>
                )}
                
                {deployUrl && (
                    <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 text-center">
                        <h3 className="text-lg font-bold text-green-300 mb-2">Déploiement réussi !</h3>
                        <p className="text-gray-300 mb-3">Votre application est maintenant en ligne sur :</p>
                        <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 font-mono break-all hover:underline">
                            {deployUrl}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeploymentScreen;