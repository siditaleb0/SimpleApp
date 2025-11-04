import React, { useState, useEffect } from 'react';
import type { Contact, Call, CallType, Screen, User, StatusUpdate } from './types';
import * as backend from './backend';
import BottomNavBar from './components/BottomNavBar';
import ChatsListScreen from './components/ChatsListScreen';
import CallsListScreen from './components/CallsListScreen';
import ContactsListScreen from './components/ContactsListScreen';
import SettingsScreen from './components/SettingsScreen';
import ChatScreen from './components/ChatScreen';
import CallScreen from './components/CallScreen';
import StatusScreen from './components/StatusScreen';
import ArchivedChatsScreen from './components/ArchivedChatsScreen';
import ContactProfileScreen from './components/ContactProfileScreen';
import StatusViewer from './components/StatusViewer';
import OnboardingScreen from './components/OnboardingScreen';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('chats');
  const [selectedChat, setSelectedChat] = useState<Contact | null>(null);
  const [activeCall, setActiveCall] = useState<{ contact: Contact; type: CallType } | null>(null);
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null);
  const [profileContact, setProfileContact] = useState<Contact | null>(null);
  const [viewingStatusContact, setViewingStatusContact] = useState<Contact | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const existingUser = backend.getUser();
    if (existingUser) {
        // Data migration for new settings
        if (typeof existingUser.notificationSettings === 'undefined') {
          existingUser.notificationSettings = { enabled: true };
        }
        if (typeof existingUser.appearanceSettings === 'undefined') {
          existingUser.appearanceSettings = { darkMode: true };
        }
        setUser(existingUser);
        setContacts(backend.getContacts());
        setCalls(backend.getCalls());
    }
    setIsLoading(false);
  }, []);

  const handleCreateProfile = (name: string, avatarUrl: string) => {
    const newUser = backend.setupNewUser(name, avatarUrl);
    setUser(newUser);
    setContacts(backend.getContacts());
    setCalls(backend.getCalls());
  };

  const handleUpdateUser = (updatedUser: User) => {
    const savedUser = backend.updateUser(updatedUser);
    setUser(savedUser);
  };
  
  const handleLogout = () => {
    if(window.confirm("Êtes-vous sûr de vouloir vous déconnecter ? Ceci effacera toutes les données de l'application sur cet appareil.")){
      backend.deleteAccount();
      setUser(null);
      setContacts([]);
      setCalls([]);
      setActiveScreen('chats');
      setSelectedChat(null);
      setActiveCall(null);
      setActiveSubScreen(null);
      setProfileContact(null);
      setViewingStatusContact(null);
    }
  }

  const handleRestoreData = (jsonString: string) => {
    if (backend.importAllData(jsonString)) {
      // Reload state from backend to reflect restored data
      const restoredUser = backend.getUser();
      if (restoredUser) {
        setUser(restoredUser);
        setContacts(backend.getContacts());
        setCalls(backend.getCalls());
        setActiveSubScreen(null); // Close the settings subscreen
        setActiveScreen('chats'); // Go to a main screen
        alert("Données restaurées avec succès !");
      } else {
        // This case might happen if the backup is invalid and the user data is cleared.
        // It's safer to just log out.
        handleLogout();
        alert("Erreur lors de la lecture du profil utilisateur depuis la sauvegarde.");
      }
    } else {
      alert("Échec de la restauration des données. Le fichier est peut-être corrompu ou invalide.");
    }
  };


  const handleStartCall = (contact: Contact, type: CallType) => {
    if (contact.isBlocked) {
        alert("Vous ne pouvez pas appeler un contact bloqué.");
        return;
    }
    const newCall: Omit<Call, 'id'> = {
      contactId: contact.id,
      type: type,
      direction: 'outgoing',
      timestamp: new Date().toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    const updatedCalls = backend.addCall(newCall);
    setCalls(updatedCalls);
    setActiveCall({ contact, type });
    setSelectedChat(null); 
  };
  
  const handleAddUserStatus = (imageUrl: string) => {
    const newStatus: Omit<StatusUpdate, 'id'> = {
      imageUrl,
      timestamp: "À l'instant",
    };
    const updatedUser = backend.addUserStatusUpdate(newStatus);
    setUser(updatedUser);
  };

  const handleViewStatus = (contactId: number, statusId: number) => {
    const updatedContacts = backend.markStatusAsViewed(contactId, statusId);
    setContacts(updatedContacts);
  };

  const handleSelectStatusContact = (contact: Contact) => {
    setViewingStatusContact(contact);
  };

  const handleArchiveContact = (contactId: number, archiveState: boolean) => {
    const updatedContacts = backend.archiveContact(contactId, archiveState);
    setContacts(updatedContacts);
    setSelectedChat(null);
    setActiveSubScreen(null);
  };

  const handleBlockContact = (contactId: number, blockState: boolean) => {
    const updatedContacts = backend.blockContact(contactId, blockState);
    setContacts(updatedContacts);
    if (selectedChat?.id === contactId) {
        const updatedSelectedChat = updatedContacts.find(c => c.id === contactId);
        if(updatedSelectedChat) setSelectedChat(updatedSelectedChat);
    }
  };

  const handleClearChat = (contactId: number) => {
    backend.clearChat(contactId);
    setContacts(backend.getContacts());
    if (selectedChat?.id === contactId) {
        const currentContact = contacts.find(c => c.id === contactId);
        if(currentContact) setSelectedChat({...currentContact, lastMessage: '', lastMessageTime: ''});
    }
  };


  if (isLoading) {
    return <div className="h-screen w-screen bg-gray-900 flex items-center justify-center text-white">Chargement...</div>;
  }
  
  if (!user) {
    return <OnboardingScreen onProfileCreate={handleCreateProfile} />;
  }


  const renderContent = () => {
    if (viewingStatusContact) {
        return <StatusViewer 
            contact={viewingStatusContact}
            onClose={() => setViewingStatusContact(null)}
            onStatusViewed={handleViewStatus}
        />
    }

    if (activeCall) {
      return (
        <CallScreen 
          contact={activeCall.contact} 
          callType={activeCall.type} 
          onEndCall={() => setActiveCall(null)} 
        />
      );
    }
    
    if (activeSubScreen === 'archived') {
        return <ArchivedChatsScreen 
            contacts={contacts.filter(c => c.isArchived)} 
            onSelectChat={(contact) => {
                setSelectedChat(contact);
                setActiveSubScreen(null);
            }}
            onBack={() => setActiveSubScreen(null)}
        />;
    }

    if (activeSubScreen === 'contactProfile' && profileContact) {
        return <ContactProfileScreen 
            contact={profileContact} 
            onBack={() => setActiveSubScreen(null)}
        />;
    }


    if (selectedChat) {
      return (
        <ChatScreen
          key={selectedChat.id}
          contact={selectedChat}
          onBack={() => {
            setContacts(backend.getContacts());
            setSelectedChat(null);
          }}
          onStartCall={handleStartCall}
          onArchive={handleArchiveContact}
          onBlock={handleBlockContact}
          onClearChat={handleClearChat}
          onViewProfile={(contact) => {
              setProfileContact(contact);
              setActiveSubScreen('contactProfile');
          }}
        />
      );
    }

    switch (activeScreen) {
      case 'chats':
        return <ChatsListScreen 
                    contacts={contacts} 
                    onSelectChat={setSelectedChat} 
                    onViewArchived={() => setActiveSubScreen('archived')}
                    setActiveScreen={setActiveScreen}
                />;
      case 'status':
        return <StatusScreen user={user} contacts={contacts} onAddStatus={handleAddUserStatus} onSelectStatus={handleSelectStatusContact} />;
      case 'calls':
        return <CallsListScreen calls={calls} contacts={contacts} onStartCall={handleStartCall} />;
      case 'contacts':
        return <ContactsListScreen contacts={contacts} onSelectContact={setSelectedChat} />;
      case 'settings':
        return <SettingsScreen user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} onRestore={handleRestoreData} />;
      default:
        return <ChatsListScreen 
                    contacts={contacts} 
                    onSelectChat={setSelectedChat} 
                    onViewArchived={() => setActiveSubScreen('archived')}
                    setActiveScreen={setActiveScreen}
                />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col font-sans antialiased overflow-hidden">
      <main className="flex-1 flex flex-col overflow-y-auto">
        {renderContent()}
      </main>
      {!selectedChat && !activeCall && !activeSubScreen && !viewingStatusContact && (
        <BottomNavBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      )}
    </div>
  );
};

export default App;