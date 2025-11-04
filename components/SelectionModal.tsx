
import React from 'react';

interface SelectionModalProps {
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ title, options, selectedValue, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-200 animate-fade-in" onClick={onClose}>
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.2s forwards ease-out;
          }
        `}</style>
      <div className="bg-gray-800 rounded-lg p-4 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 px-3">{title}</h2>
        <ul>
          {options.map(option => (
            <li key={option}>
              <button onClick={() => onSelect(option)} className="w-full text-left p-3 hover:bg-gray-700 rounded-md flex items-center transition-colors">
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${selectedValue === option ? 'border-cyan-500' : 'border-gray-500'}`}>
                  {selectedValue === option && <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full"></div>}
                </div>
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectionModal;
