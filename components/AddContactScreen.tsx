import React, { useState, useRef } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PencilIcon } from './icons/PencilIcon';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface AddContactScreenProps {
  onSave: (name: string, phone: string, avatarUrl: string) => void;
  onBack: () => void;
}

const AddContactScreen: React.FC<AddContactScreenProps> = ({ onSave, onBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const defaultAvatar = 'https://picsum.photos/seed/default/200/200';
  const [avatarUrl, setAvatarUrl] = useState<string>(defaultAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      onSave(name.trim(), phone.trim(), avatarUrl);
    }
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
        <h1 className="text-xl font-bold">Nouveau contact</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4">
        <div className="flex flex-col items-center pt-8 pb-8">
          <button type="button" onClick={handleAvatarClick} className="relative group">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-600 group-hover:opacity-70 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <PencilIcon className="w-10 h-10 text-white" />
            </div>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        <div className="space-y-6">
            <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-400 mb-2">
                    Nom du contact
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Entrez le nom"
                    className="w-full bg-gray-800 text-white rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                    />
                </div>
            </div>
             <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-400 mb-2">
                    Numéro de téléphone
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Entrez le numéro"
                    className="w-full bg-gray-800 text-white rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                    />
                </div>
            </div>
        </div>
        
        <div className="mt-auto">
             <button
                type="submit"
                disabled={!name.trim() || !phone.trim()}
                className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
                Enregistrer le contact
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddContactScreen;