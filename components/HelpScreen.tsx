
import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface HelpScreenProps {
  onBack: () => void;
}

const HelpScreen: React.FC<HelpScreenProps> = ({ onBack }) => {
    const faqItems = [
        {
            question: "Comment puis-je modifier mon nom ou ma photo de profil ?",
            answer: "Allez dans l'onglet 'Réglages', puis appuyez sur l'icône en forme de crayon sur votre carte de profil pour ouvrir la fenêtre d'édition."
        },
        {
            question: "Comment puis-je envoyer un message vocal ?",
            answer: "Dans une discussion, si le champ de texte est vide, appuyez sur l'icône du microphone pour commencer l'enregistrement. Appuyez sur le bouton d'envoi pour l'envoyer."
        },
        {
            question: "Comment bloquer un contact ?",
            answer: "Ouvrez une discussion avec le contact, appuyez sur le menu à trois points en haut à droite, puis sélectionnez 'Bloquer'."
        },
        {
            question: "Où se trouvent mes discussions archivées ?",
            answer: "Sur l'écran principal 'Discussions', une section 'Archivées' apparaîtra en haut de la liste si vous avez au moins une discussion archivée."
        }
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
                <h1 className="text-xl font-bold">Aide</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    {faqItems.map((item, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-4">
                            <h2 className="font-semibold text-lg text-cyan-400 mb-2">{item.question}</h2>
                            <p className="text-gray-300">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HelpScreen;