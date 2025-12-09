import React, { useState } from 'react';
import { Mood } from '../../types/session';
import { GlowButton } from '../ui/GlowButton';

interface SessionFormProps {
  onSubmit: (data: { activity: string; mood: Mood; soundtrack: string }) => void;
  onCancel: () => void;
}

const MOODS: Mood[] = ['FOCUSED', 'CHILL', 'HYPED', 'BURNT'];

export function SessionForm({ onSubmit, onCancel }: SessionFormProps) {
  const [activity, setActivity] = useState('');
  const [mood, setMood] = useState<Mood>('FOCUSED');
  const [soundtrack, setSoundtrack] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ activity: activity || 'Untitled Session', mood, soundtrack });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#05010A] border border-[#FF1744]/30 rounded-lg p-6 shadow-[0_0_50px_rgba(255,23,68,0.2)] relative overflow-hidden">
        {/* Scanline decoration */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 opacity-20 bg-[length:100%_4px,3px_100%]" />
        
        <h2 className="text-2xl font-bold text-[#F9F5FF] mb-6 font-mono relative z-10">SESSION COMPLETE</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-mono text-[#FF1744] mb-2 uppercase">Activity</label>
            <input
              type="text"
              value={activity}
              onChange={e => setActivity(e.target.value)}
              placeholder="What did you do?"
              className="w-full bg-black/50 border border-gray-700 rounded p-3 text-[#F9F5FF] focus:border-[#FF1744] focus:outline-none focus:ring-1 focus:ring-[#FF1744] transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#FF1744] mb-2 uppercase">Vibe Check</label>
            <div className="grid grid-cols-2 gap-2">
              {MOODS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`p-2 text-sm font-mono border rounded transition-all ${
                    mood === m 
                      ? 'bg-[#FF1744]/20 border-[#FF1744] text-[#FF1744] shadow-[0_0_10px_rgba(255,23,68,0.2)]' 
                      : 'border-gray-800 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#FF1744] mb-2 uppercase">Soundtrack</label>
            <input
              type="text"
              value={soundtrack}
              onChange={e => setSoundtrack(e.target.value)}
              placeholder="Song / Playlist / Noise"
              className="w-full bg-black/50 border border-gray-700 rounded p-3 text-[#F9F5FF] focus:border-[#FF1744] focus:outline-none focus:ring-1 focus:ring-[#FF1744] transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <GlowButton variant="ghost" size="md" onClick={onCancel} type="button">
              DISCARD
            </GlowButton>
            <div className="flex-1">
              <GlowButton variant="primary" size="md" type="submit">
                SAVE TO REEL
              </GlowButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
