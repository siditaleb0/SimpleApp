import React, { useState, useRef } from 'react';
import { PencilIcon } from './icons/PencilIcon';
import { AppLogo } from './icons/AppLogo';

interface OnboardingScreenProps {
  onProfileCreate: (name: string, avatarUrl: string) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onProfileCreate }) => {
  const [name, setName] = useState('');
  // Default avatar
  const defaultAvatar = 'https://picsum.photos/id/1005/200/200';
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
    if (name.trim()) {
      onProfileCreate(name.trim(), avatarUrl);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
            <AppLogo />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Créez votre profil</h2>
        <p className="text-gray-400 mb-8">Entrez votre nom et ajoutez une photo de profil.</p>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-6">
            <button type="button" onClick={handleAvatarClick} className="relative group">
              <img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-gray-600 group-hover:opacity-70 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <PencilIcon className="w-10 h-10 text-white" />
              </div>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez votre nom"
              className="w-full bg-gray-800 text-white text-center rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Commencer
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingScreen;
