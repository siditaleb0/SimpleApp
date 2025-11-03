
import React from 'react';
import type { Call, Contact, CallType } from '../types';
import { mockContacts } from '../constants';
import { PhoneIcon } from './icons/PhoneIcon';
import { VideoIcon } from './icons/VideoIcon';

interface CallsListScreenProps {
  calls: Call[];
  onStartCall: (contact: Contact, type: CallType) => void;
}

const CallDirectionIcon: React.FC<{ direction: 'incoming' | 'outgoing' | 'missed' }> = ({ direction }) => {
    const classes = direction === 'missed' ? 'text-red-500' : 'text-gray-400';
    const rotation = direction === 'incoming' ? 'transform -rotate-45' : 'transform rotate-135';
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 mr-2 ${classes}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={`M5 12h14m0 0l-7-7m7 7l-7 7`} className={rotation} />
        </svg>
    );
};


const CallsListScreen: React.FC<CallsListScreenProps> = ({ calls, onStartCall }) => {
  const findContact = (contactId: number): Contact | undefined => mockContacts.find(c => c.id === contactId);

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700 sticky top-0">
        <h1 className="text-2xl font-bold">Appels</h1>
      </header>
      <ul className="flex-1 overflow-y-auto">
        {calls.map((call) => {
          const contact = findContact(call.contactId);
          if (!contact) return null;
          
          return (
            <li key={call.id} className="flex items-center p-3 hover:bg-gray-800 transition-colors duration-200 border-b border-gray-800">
              <img src={contact.avatarUrl} alt={contact.name} className="w-14 h-14 rounded-full mr-4 object-cover" />
              <div className="flex-1">
                <h3 className={`font-semibold text-lg ${call.direction === 'missed' ? 'text-red-500' : 'text-gray-100'}`}>{contact.name}</h3>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <CallDirectionIcon direction={call.direction} />
                  <span>{call.timestamp}</span>
                </div>
              </div>
              <button onClick={() => onStartCall(contact, call.type)} className="p-3 rounded-full text-cyan-400 hover:bg-gray-700">
                {call.type === 'video' ? <VideoIcon className="w-6 h-6" /> : <PhoneIcon className="w-6 h-6" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CallsListScreen;
