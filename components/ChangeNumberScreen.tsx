import React, { useState, useRef } from 'react';
import type { User, Country } from '../types';
import { countries } from '../countries';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface ChangeNumberScreenProps {
  user: User;
  onBack: () => void;
  onSave: (newPhone: string) => void;
}

const ChangeNumberScreen: React.FC<ChangeNumberScreenProps> = ({ user, onBack, onSave }) => {
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries.find(c => c.code === 'MR') ?? countries[0]);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const countryPickerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(event.target as Node)) {
        setIsCountryPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      const fullPhone = `${selectedCountry.dialCode} ${phone.trim()}`;
      onSave(fullPhone);
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
        <h1 className="text-xl font-bold">Changer de numéro</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-gray-800 rounded-lg p-4 mb-6 text-center">
            <p className="text-gray-400 mb-2">Votre numéro actuel est :</p>
            <p className="text-xl font-semibold">{user.phone}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
                <label htmlFor="new-phone" className="block text-sm font-medium text-gray-400 mb-2">
                    Nouveau numéro de téléphone
                </label>
                <div className="flex w-full items-center space-x-2">
                    <div className="relative" ref={countryPickerRef}>
                    <button
                        type="button"
                        onClick={() => setIsCountryPickerOpen(p => !p)}
                        className="flex items-center justify-center bg-gray-700 text-white rounded-lg p-3 h-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                    id="new-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nouveau numéro"
                    className="w-full bg-gray-700 text-white rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                    />
                </div>
           </div>

          <button
            type="submit"
            disabled={!phone.trim()}
            className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Enregistrer le nouveau numéro
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeNumberScreen;