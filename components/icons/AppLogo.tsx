// FIX: Implemented AppLogo component to resolve import error in ChatsListScreen.tsx.
import React from 'react';

export const AppLogo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <svg
        className="w-8 h-8 text-cyan-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <h1 className="text-2xl font-bold text-white">SimpleApp</h1>
    </div>
  );
};
