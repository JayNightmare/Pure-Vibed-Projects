import React from 'react';
import { useSessions } from '../../context/SessionContext';
import { SessionCard } from './SessionCard';

export function SessionList() {
  const { sessions, deleteSession } = useSessions();

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 opacity-30">
        <p className="font-mono text-sm">NO DATA IN MEMORY BANK</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 mt-8 pb-12">
      <h3 className="text-xs font-mono text-gray-500 tracking-widest uppercase mb-4 border-b border-gray-800 pb-2">
        Vibe Reel // Memory Bank
      </h3>
      <div className="space-y-3">
        {sessions.map(session => (
          <SessionCard 
            key={session.id} 
            session={session} 
            onDelete={deleteSession} 
          />
        ))}
      </div>
    </div>
  );
}
