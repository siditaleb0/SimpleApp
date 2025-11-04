import type { Contact, Message, Call, User } from './types';
import { MessageType } from './types';

export const mockContacts: Contact[] = [
  {
    id: 1,
    name: 'Alice Dubois',
    phone: '+33 6 12 34 56 78',
    avatarUrl: 'https://picsum.photos/id/1011/200/200',
    status: 'En ligne',
    lastMessage: 'Ok, à tout à l\'heure !',
    lastMessageTime: '15:32',
    unreadCount: 2,
    statusUpdates: [
      { id: 1, imageUrl: 'https://picsum.photos/id/11/1080/1920', timestamp: 'Il y a 5 minutes' },
      { id: 2, imageUrl: 'https://picsum.photos/id/12/1080/1920', timestamp: 'Il y a 20 minutes' }
    ],
    isArchived: false,
    isBlocked: false,
  },
  {
    id: 2,
    name: 'Benjamin Lemoine',
    phone: '+33 6 87 65 43 21',
    avatarUrl: 'https://picsum.photos/id/1012/200/200',
    status: 'Dernière visite hier à 20:15',
    lastMessage: 'Photo: Un magnifique coucher de soleil',
    lastMessageTime: 'Hier',
    statusUpdates: [
      { id: 1, imageUrl: 'https://picsum.photos/id/21/1080/1920', timestamp: 'Il y a 2 heures', viewed: true }
    ],
    isArchived: false,
    isBlocked: false,
  },
  {
    id: 3,
    name: 'Chloé Martin',
    phone: '+33 7 00 11 22 33',
    avatarUrl: 'https://picsum.photos/id/1027/200/200',
    status: 'Écrit...',
    lastMessage: 'Oui, c\'est une excellente idée.',
    lastMessageTime: '15:29',
    isArchived: false,
    isBlocked: false,
  },
  {
    id: 4,
    name: 'David Garcia',
    phone: '+33 6 99 88 77 66',
    avatarUrl: 'https://picsum.photos/id/1005/200/200',
    status: 'En ligne',
    lastMessage: 'Message vocal (0:45)',
    lastMessageTime: '14:55',
    isArchived: false,
    isBlocked: false,
  },
    {
    id: 5,
    name: 'Émilie Petit',
    phone: '+33 7 55 44 33 22',
    avatarUrl: 'https://picsum.photos/id/1013/200/200',
    status: 'Dernière visite il y a 2h',
    lastMessage: 'Document: Rapport_Final.pdf',
    lastMessageTime: '13:10',
    statusUpdates: [
      { id: 1, imageUrl: 'https://picsum.photos/id/51/1080/1920', timestamp: 'Il y a 47 minutes' }
    ],
    isArchived: false,
    isBlocked: false,
  },
   {
    id: 6,
    name: 'Maman',
    phone: '+33 6 01 02 03 04',
    avatarUrl: 'https://picsum.photos/id/1016/200/200',
    status: 'En ligne',
    lastMessage: 'Appelle-moi quand tu peux ❤️',
    lastMessageTime: '11:45',
    unreadCount: 1,
    statusUpdates: [
      { id: 1, imageUrl: 'https://picsum.photos/id/61/1080/1920', timestamp: 'Il y a 6 heures', viewed: true }
    ],
    isArchived: true,
    isBlocked: false,
  },
  {
    id: 7,
    name: 'Ahmed Fall',
    phone: '+222 45 25 12 34',
    avatarUrl: 'https://picsum.photos/id/1025/200/200',
    status: 'En voyage',
    lastMessage: 'Salam! Ça va?',
    lastMessageTime: '10:05',
    isArchived: false,
    isBlocked: false,
  },
];

export const mockMessages: { [key: number]: Message[] } = {
  1: [
    { id: 1, senderId: 1, text: 'Salut ! Comment ça va ?', timestamp: '15:28', type: MessageType.TEXT },
    { id: 2, senderId: 0, text: 'Hey ! Ça va bien et toi ?', timestamp: '15:29', type: MessageType.TEXT, reactions: [{ emoji: '❤️', users: [1] }] },
    { id: 3, senderId: 1, text: 'Super ! Tu es dispo pour un café demain ?', timestamp: '15:30', type: MessageType.TEXT },
    { id: 4, senderId: 0, text: 'Oui, avec plaisir ! Vers quelle heure ?', timestamp: '15:31', type: MessageType.TEXT },
    { id: 5, senderId: 1, text: '10h ça te va ? Au café du coin.', timestamp: '15:31', type: MessageType.TEXT, reactions: [{ emoji: '👍', users: [0, 2] }, {emoji: '🎉', users: [1]}] },
    { id: 6, senderId: 0, text: 'Parfait !', timestamp: '15:32', type: MessageType.TEXT },
    { id: 7, senderId: 1, text: 'Ok, à tout à l\'heure !', timestamp: '15:32', type: MessageType.TEXT },
  ],
  4: [
    { id: 1, senderId: 0, text: 'Peux-tu m\'envoyer le rapport ?', timestamp: '14:50', type: MessageType.TEXT },
    { id: 2, senderId: 4, text: 'Oui, bien sûr.', timestamp: '14:51', type: MessageType.TEXT },
     { id: 3, senderId: 4, type: MessageType.FILE, text: '', timestamp: '14:52', fileInfo: { name: 'Analyse_Q2.docx', size: '1.2 MB' } },
    { id: 4, senderId: 0, text: 'Merci ! Je vais y jeter un oeil.', timestamp: '14:53', type: MessageType.TEXT },
    { id: 5, senderId: 4, type: MessageType.VOICE, text: '', timestamp: '14:55', voiceDuration: '0:45' },
  ],
  7: [
    { id: 1, senderId: 7, text: 'Salam! Ça va?', timestamp: '10:05', type: MessageType.TEXT },
    { id: 2, senderId: 0, text: 'Wa alaikum salam! Ça va bien, alhamdulillah. Et toi?', timestamp: '10:06', type: MessageType.TEXT },
  ]
};

export const mockCalls: Call[] = [
    { id: 1, contactId: 2, type: 'video', direction: 'outgoing', timestamp: 'Aujourd\'hui, 11:45' },
    { id: 2, contactId: 3, type: 'audio', direction: 'incoming', timestamp: 'Hier, 18:30' },
    { id: 3, contactId: 4, type: 'audio', direction: 'missed', timestamp: 'Hier, 14:12' },
    { id: 4, contactId: 1, type: 'video', direction: 'outgoing', timestamp: '25/07/2024' },
];