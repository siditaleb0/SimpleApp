import React, { useState, useRef } from 'react';
import { PencilIcon } from './icons/PencilIcon';
import { AppLogo } from './icons/AppLogo';
import { countries } from '../countries';
import type { Country } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface OnboardingScreenProps {
  onProfileSubmit: (name: string, phone: string, avatarUrl: string) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onProfileSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const defaultAvatar = 'https://picsum.photos/id/1005/200/200';
  const [avatarUrl, setAvatarUrl] = useState<string>(defaultAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries.find(c => c.code === 'MR') ?? countries[0]);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const countryPickerRef = useRef<HTMLDivElement>(null);


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
      const fullPhone = `${selectedCountry.dialCode} ${phone.trim()}`;
      onProfileSubmit(name.trim(), fullPhone, avatarUrl);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(event.target as Node)) {
        setIsCountryPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
            <AppLogo />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Créez votre profil</h2>
        <p className="text-gray-400 mb-8">Entrez votre nom, votre numéro et ajoutez une photo.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <button type="button" onClick={handleAvatarClick} className="relative group">
              <img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-gray-600 group-hover:opacity-70 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <PencilIcon className="w-10 h-10 text-white" />
              </div>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez votre nom"
              className="w-full bg-gray-800 text-white text-center rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="flex w-full items-center space-x-2">
            <div className="relative" ref={countryPickerRef}>
              <button
                type="button"
                onClick={() => setIsCountryPickerOpen(p => !p)}
                className="flex items-center justify-center bg-gray-800 text-white rounded-lg p-3 h-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <span>{selectedCountry.dialCode}</span>
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              </button>
              {isCountryPickerOpen && (
                <div className="absolute bottom-full mb-2 w-72 max-h-60 overflow-y-auto bg-gray-700 rounded-lg shadow-lg z-10">
                  <ul>
                    {countries.map(country => (
                      <li key={country.code}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsCountryPickerOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-600 text-sm"
                        >
                          {country.name} ({country.dialCode})
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Numéro de téléphone"
              className="w-full bg-gray-800 text-white rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !phone.trim()}
            className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingScreen;