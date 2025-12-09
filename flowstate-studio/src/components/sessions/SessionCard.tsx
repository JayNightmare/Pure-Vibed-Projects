import React from 'react';
import { Session } from '../../types/session';
import { VibeBadge } from '../ui/VibeBadge';
import { formatDuration, formatTimeRange } from '../../lib/time';

interface SessionCardProps {
  session: Session;
  onDelete: (id: string) => void;
}

export function SessionCard({ session, onDelete }: SessionCardProps) {
  return (
    <div className="group relative p-4 bg-black/40 border border-white/10 rounded hover:border-[#FF1744]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,23,68,0.1)]">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-[#F9F5FF]/90">{session.activity}</h3>
        <VibeBadge mood={session.mood} />
      </div>
      
      <div className="flex justify-between items-end text-sm font-mono text-gray-400">
        <div className="flex flex-col gap-1">
          <span>{formatTimeRange(session.startedAt, session.endedAt)}</span>
          <span className="text-xs text-gray-500">🎵 {session.soundtrack || 'No Audio'}</span>
        </div>
        <div className="text-[#FF1744]/80 font-bold">
          {formatDuration(session.durationMs)}
        </div>
      </div>

      <button 
        onClick={() => onDelete(session.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[#7C3AED] hover:text-[#8B5CF6] transition-opacity p-1 font-bold text-lg"
        title="Delete Session"
      >
        ×
      </button>
    </div>
  );
}
