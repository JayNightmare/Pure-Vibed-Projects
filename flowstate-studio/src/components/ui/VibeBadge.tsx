import React from 'react';
import { Mood } from '../../types/session';

const MOOD_CONFIG: Record<Mood, { label: string; classes: string }> = {
  FOCUSED: { label: '🔥 FOCUSED', classes: 'bg-[#FF4B82]/20 text-[#FF4B82] border-[#FF4B82]/50 shadow-[0_0_10px_rgba(255,75,130,0.3)]' },
  CHILL: { label: '🧘 CHILL', classes: 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/50 shadow-[0_0_10px_rgba(56,189,248,0.3)]' },
  BURNT: { label: '💀 BURNT', classes: 'bg-[#9CA3AF]/20 text-[#9CA3AF] border-[#9CA3AF]/50 shadow-[0_0_10px_rgba(156,163,175,0.3)]' },
  HYPED: { label: '⚡ HYPED', classes: 'bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]' },
};

export function VibeBadge({ mood }: { mood: Mood }) {
  const config = MOOD_CONFIG[mood];
  return (
    <span className={`px-2 py-1 rounded text-xs font-mono border ${config.classes}`}>
      {config.label}
    </span>
  );
}
