
import React, { useState } from 'react';
import type { Contact, Call, CallType, Screen } from './types';
import { mockContacts, mockCalls } from './constants';
import BottomNavBar from './components/BottomNavBar';
import ChatsListScreen from './components/ChatsListScreen';
import CallsListScreen from './components/CallsListScreen';
import ContactsListScreen from './components/ContactsListScreen';
import ChatScreen from './components/ChatScreen';
import CallScreen from './components/CallScreen';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('chats');
  const [selectedChat, setSelectedChat] = useState<Contact | null>(null);
  const [activeCall, setActiveCall] = useState<{ contact: Contact; type: CallType } | null>(null);

  const handleStartCall = (contact: Contact, type: CallType) => {
    setActiveCall({ contact, type });
    setSelectedChat(null); 
  };

  const renderContent = () => {
    if (activeCall) {
      return (
        <CallScreen 
          contact={activeCall.contact} 
          callType={activeCall.type} 
          onEndCall={() => setActiveCall(null)} 
        />
      );
    }

    if (selectedChat) {
      return (
        <ChatScreen
          contact={selectedChat}
          onBack={() => setSelectedChat(null)}
          onStartCall={handleStartCall}
        />
      );
    }

    switch (activeScreen) {
      case 'chats':
        return <ChatsListScreen contacts={mockContacts} onSelectChat={setSelectedChat} />;
      case 'calls':
        return <CallsListScreen calls={mockCalls} onStartCall={handleStartCall} />;
      case 'contacts':
        return <ContactsListScreen contacts={mockContacts} onSelectContact={setSelectedChat} />;
      default:
        return <ChatsListScreen contacts={mockContacts} onSelectChat={setSelectedChat} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col font-sans antialiased overflow-hidden">
      <main className="flex-1 flex flex-col overflow-y-auto">
        {renderContent()}
      </main>
      {!selectedChat && !activeCall && (
        <BottomNavBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      )}
    </div>
  );
};

export default App;
