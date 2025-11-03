export interface Reaction {
  emoji: string;
  users: number[]; // Array of user IDs, 0 for current user
}

export interface Contact {
  id: number;
  name: string;
  avatarUrl: string;
  status: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
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

export type Screen = 'chats' | 'calls' | 'contacts';