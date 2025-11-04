import { mockContacts, mockMessages, mockCalls } from './constants';
import type { User, Contact, Message, Call, StatusUpdate } from './types';

const USER_KEY = 'simpleapp_user';
const CONTACTS_KEY = 'simpleapp_contacts';
const MESSAGES_KEY = 'simpleapp_messages';
const CALLS_KEY = 'simpleapp_calls';

const NETWORK_DELAY = 300; // ms
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


// --- User ---
export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  const user = JSON.parse(userStr);
  
  // Data migration for existing users
  let modified = false;
  if (typeof user.notificationSettings === 'undefined') {
    user.notificationSettings = { enabled: true };
    modified = true;
  }
  if (typeof user.appearanceSettings === 'undefined') {
    user.appearanceSettings = { darkMode: true };
    modified = true;
  }
  if (typeof user.phone === 'undefined') {
    user.phone = 'Numéro inconnu';
    modified = true;
  }
  
  if (modified) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  
  return user;
};

export const updateUser = async (updatedUser: User): Promise<User> => {
  await delay(NETWORK_DELAY);
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  return updatedUser;
};

export const updateUserServerId = async (serverId: string): Promise<User> => {
  await delay(NETWORK_DELAY * 2);
  const user = getUser();
  if (!user) throw new Error("User not found");
  const updatedUser = { ...user, serverId };
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  return updatedUser;
};

export const setupNewUser = (name: string, phone: string, avatarUrl: string): User => {
  const newUser: User = {
    name: name,
    phone: phone,
    avatarUrl: avatarUrl,
    status: 'Disponible',
    privacySettings: {
      readReceipts: true,
      lastSeen: 'Mes contacts',
      profilePhoto: 'Tout le monde',
    },
    notificationSettings: {
      enabled: true,
    },
    appearanceSettings: {
      darkMode: true,
    },
    statusUpdates: []
  };
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(mockContacts));
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(mockMessages));
  localStorage.setItem(CALLS_KEY, JSON.stringify(mockCalls));
  return newUser;
};

// --- Contacts ---
export const getContacts = (): Contact[] => {
    const contactsStr = localStorage.getItem(CONTACTS_KEY);
    if (!contactsStr) return [];
    
    const contacts = JSON.parse(contactsStr);

    let modified = false;
    const migratedContacts = contacts.map((c: Contact) => {
        if(typeof c.phone === 'undefined') {
            modified = true;
            return {...c, phone: 'Numéro inconnu'};
        }
        return c;
    });

    if (modified) {
        saveContacts(migratedContacts);
    }
    
    return migratedContacts;
};

const saveContacts = (contacts: Contact[]): void => {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

export const addContact = async (name: string, phone: string, avatarUrl: string): Promise<Contact[]> => {
    await delay(NETWORK_DELAY);
    const contacts = getContacts();
    const newContact: Contact = {
        id: Date.now(),
        name,
        phone,
        avatarUrl,
        status: 'Hors ligne',
        isArchived: false,
        isBlocked: false,
    };
    const updatedContacts = [...contacts, newContact];
    saveContacts(updatedContacts);
    return updatedContacts;
};


export const archiveContact = async (contactId: number, archiveState: boolean): Promise<Contact[]> => {
    await delay(NETWORK_DELAY);
    const contacts = getContacts();
    const contactIndex = contacts.findIndex(c => c.id === contactId);
    if (contactIndex > -1) {
        contacts[contactIndex].isArchived = archiveState;
        saveContacts(contacts);
    }
    return contacts;
}

export const blockContact = async (contactId: number, blockState: boolean): Promise<Contact[]> => {
    await delay(NETWORK_DELAY);
    const contacts = getContacts();
    const contactIndex = contacts.findIndex(c => c.id === contactId);
    if (contactIndex > -1) {
        contacts[contactIndex].isBlocked = blockState;
        saveContacts(contacts);
    }
    return contacts;
}


// --- Messages ---
export const getMessages = (contactId: number): Message[] => {
    const allMessagesStr = localStorage.getItem(MESSAGES_KEY);
    const allMessages: { [key: number]: Message[] } = allMessagesStr ? JSON.parse(allMessagesStr) : {};
    return allMessages[contactId] || [];
};

export const saveMessage = async (contactId: number, message: Message): Promise<Message[]> => {
    await delay(NETWORK_DELAY);
    const allMessagesStr = localStorage.getItem(MESSAGES_KEY);
    const allMessages: { [key: number]: Message[] } = allMessagesStr ? JSON.parse(allMessagesStr) : {};
    
    if (!allMessages[contactId]) {
        allMessages[contactId] = [];
    }
    allMessages[contactId].push(message);

    // Also update last message for the contact
    const contacts = getContacts();
    const contactIndex = contacts.findIndex(c => c.id === contactId);
    if (contactIndex > -1) {
        let lastMessageText = message.text;
        if (message.type === 'file' && message.fileInfo) {
            lastMessageText = `Fichier: ${message.fileInfo.name}`;
        } else if (message.type === 'voice' && message.voiceDuration) {
            lastMessageText = `Message vocal (${message.voiceDuration})`;
        }
        contacts[contactIndex].lastMessage = lastMessageText;
        contacts[contactIndex].lastMessageTime = message.timestamp;
        
        // Unarchive if contact sends a message
        if (contacts[contactIndex].isArchived && message.senderId !== 0) {
            contacts[contactIndex].isArchived = false;
        }

        saveContacts(contacts);
    }

    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
    return allMessages[contactId];
};

export const clearChat = async (contactId: number): Promise<void> => {
    await delay(NETWORK_DELAY);
    const allMessagesStr = localStorage.getItem(MESSAGES_KEY);
    const allMessages: { [key: number]: Message[] } = allMessagesStr ? JSON.parse(allMessagesStr) : {};
    
    if (allMessages[contactId]) {
        allMessages[contactId] = [];
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
    }
    
    const contacts = getContacts();
    const contactIndex = contacts.findIndex(c => c.id === contactId);
    if (contactIndex > -1) {
        contacts[contactIndex].lastMessage = '';
        contacts[contactIndex].lastMessageTime = '';
        contacts[contactIndex].unreadCount = 0;
        saveContacts(contacts);
    }
};

export const updateMessageReactions = async (contactId: number, messageId: number, emoji: string): Promise<Message[]> => {
    await delay(NETWORK_DELAY / 2);
    const allMessagesStr = localStorage.getItem(MESSAGES_KEY);
    const allMessages: { [key: number]: Message[] } = allMessagesStr ? JSON.parse(allMessagesStr) : {};
    
    const chatMessages = allMessages[contactId] || [];
    const messageIndex = chatMessages.findIndex(m => m.id === messageId);

    if (messageIndex > -1) {
        const msg = chatMessages[messageIndex];
        let newReactions = [...(msg.reactions || [])];
        let reaction = newReactions.find(r => r.emoji === emoji);

        if (reaction) {
          const userIndex = reaction.users.indexOf(0); // 0 is current user
          if (userIndex > -1) {
            reaction.users.splice(userIndex, 1);
          } else {
            reaction.users.push(0);
          }
        } else {
          reaction = { emoji, users: [0] };
          newReactions.push(reaction);
        }
        
        msg.reactions = newReactions.filter(r => r.users.length > 0);
        
        chatMessages[messageIndex] = msg;
        allMessages[contactId] = chatMessages;
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
    }

    return allMessages[contactId] || [];
};


// --- Calls ---
export const getCalls = (): Call[] => {
    const calls = localStorage.getItem(CALLS_KEY);
    return calls ? JSON.parse(calls) : [];
};

export const addCall = async (call: Omit<Call, 'id'>): Promise<Call[]> => {
    await delay(NETWORK_DELAY);
    const calls = getCalls();
    const newCall: Call = { ...call, id: Date.now() };
    const updatedCalls = [newCall, ...calls];
    localStorage.setItem(CALLS_KEY, JSON.stringify(updatedCalls));
    return updatedCalls;
};

// --- Status ---
export const addUserStatusUpdate = async (update: Omit<StatusUpdate, 'id'>): Promise<User> => {
    await delay(NETWORK_DELAY);
    const user = getUser();
    if (!user) throw new Error("User not found");
    const newStatus: StatusUpdate = { ...update, id: Date.now() };
    if (!user.statusUpdates) {
        user.statusUpdates = [];
    }
    user.statusUpdates.push(newStatus);
    await updateUser(user);
    return user;
};

export const markStatusAsViewed = async (contactId: number, statusId: number): Promise<Contact[]> => {
    await delay(NETWORK_DELAY / 2);
    const contacts = getContacts();
    const contactIndex = contacts.findIndex(c => c.id === contactId);
    if (contactIndex > -1 && contacts[contactIndex].statusUpdates) {
        const statusIndex = contacts[contactIndex].statusUpdates!.findIndex(s => s.id === statusId);
        if (statusIndex > -1) {
            contacts[contactIndex].statusUpdates![statusIndex].viewed = true;
        }
    }
    saveContacts(contacts);
    return contacts;
};


// --- Account ---
export const deleteAccount = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(CONTACTS_KEY);
    localStorage.removeItem(MESSAGES_KEY);
    localStorage.removeItem(CALLS_KEY);
};

// --- Data Sync ---
export const exportAllData = (): string => {
    const allMessagesStr = localStorage.getItem(MESSAGES_KEY);
    const allMessages = allMessagesStr ? JSON.parse(allMessagesStr) : {};
    
    const data = {
        user: getUser(),
        contacts: getContacts(),
        messages: allMessages,
        calls: getCalls(),
    };
    return JSON.stringify(data, null, 2);
};

export const importAllData = (jsonString: string): boolean => {
    try {
        const data = JSON.parse(jsonString);
        if (data.user && data.contacts && data.messages && data.calls) {
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            localStorage.setItem(CONTACTS_KEY, JSON.stringify(data.contacts));
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(data.messages));
            localStorage.setItem(CALLS_KEY, JSON.stringify(data.calls));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Failed to import data:", error);
        return false;
    }
};