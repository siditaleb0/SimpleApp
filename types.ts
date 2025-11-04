export interface Reaction {
  emoji: string;
  users: number[]; // Array of user IDs, 0 for current user
}

export interface PrivacySettings {
  readReceipts: boolean;
  lastSeen: 'Tout le monde' | 'Mes contacts' | 'Personne';
  profilePhoto: 'Tout le monde' | 'Mes contacts' | 'Personne';
}

export interface User {
  name: string;
  avatarUrl: string;
  status: string;
  privacySettings: PrivacySettings;
  notificationSettings: {
    enabled: boolean;
  };
  appearanceSettings: {
    darkMode: boolean;
  };
  statusUpdates?: StatusUpdate[];
}

export interface StatusUpdate {
  id: number;
  timestamp: string;
  imageUrl: string;
  viewed?: boolean;
}

export interface Contact {
  id: number;
  name:string;
  avatarUrl: string;
  status: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  statusUpdates?: StatusUpdate[];
  isArchived?: boolean;
  isBlocked?: boolean;
}

export enum MessageType {
  TEXT = 'text',
  VOICE = 'voice',
  FILE = 'file',
  SYSTEM = 'system',
}

export interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  type: MessageType;
  fileInfo?: {
    name: string;
    size: string;
  };
  voiceDuration?: string;
  audioData?: string;
  reactions?: Reaction[];
}

export type CallType = 'audio' | 'video';

export type CallStatus = 'ringing' | 'connected' | 'ended';

export interface Call {
  id: number;
  contactId: number;
  type: CallType;
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
}

export type Screen = 'chats' | 'status' | 'calls' | 'contacts' | 'settings';