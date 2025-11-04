import React, { useState } from 'react';
import { AppLogo } from './icons/AppLogo';

interface PhoneValidationScreenProps {
  onValidationComplete: () => void;
}

const PhoneValidationScreen: React.FC<PhoneValidationScreenProps> = ({ onValidationComplete }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const VALIDATION_CODE = '123456';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === VALIDATION_CODE) {
      onValidationComplete();
    } else {
      setError('Code de validation incorrect.');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits and limit length
    if (/^\d*$/.test(value) && value.length <= 6) {
      setCode(value);
      setError('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
            <AppLogo />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Vérifiez votre numéro</h2>
        <p className="text-gray-400 mb-6">
          Nous avons envoyé un code de validation. Pour cette démo, le code est :
        </p>
        <p className="text-2xl font-mono tracking-widest bg-gray-800 text-cyan-400 py-3 rounded-lg mb-8">
            {VALIDATION_CODE}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={handleCodeChange}
              placeholder="Entrez le code à 6 chiffres"
              className="w-full bg-gray-800 text-white text-center rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
              maxLength={6}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={code.length !== 6}
            className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Valider
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhoneValidationScreen;
