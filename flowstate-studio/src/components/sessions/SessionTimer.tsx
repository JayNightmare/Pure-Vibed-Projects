import React from 'react';
import { useSessions } from '../../context/SessionContext';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { GlowButton } from '../ui/GlowButton';

export function SessionTimer() {
  const { currentSessionStart, isRunning, isPaused, accumulatedMs, startSession, stopSession, resumeSession } = useSessions();
  
  const { hours, minutes, seconds } = useSessionTimer({
    startTime: currentSessionStart,
    isRunning,
    accumulatedMs,
  });

  const getStatusText = () => {
    if (isPaused) return 'SYSTEM PAUSED';
    if (isRunning) return 'SYSTEM ACTIVE';
    return 'SYSTEM IDLE';
  };

  const getStatusColor = () => {
    if (isPaused) return 'text-yellow-500 animate-pulse';
    if (isRunning) return 'text-[#FF1744] animate-pulse text-shadow-neon';
    return 'text-[#9CA3AF]';
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 w-full max-w-md mx-auto relative">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 border border-[#FF4B82]/20 rounded-lg bg-[linear-gradient(rgba(255,75,130,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,75,130,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Status Text */}
      <div className="text-center space-y-2 relative z-10">
        <h2 className={`text-xl font-mono tracking-[0.2em] ${getStatusColor()}`}>
          {getStatusText()}
        </h2>
      </div>

      {/* Timer Display */}
      <div className="relative z-10">
        <div className={`text-7xl md:text-8xl font-mono font-bold tracking-tighter tabular-nums transition-all duration-300 ${isRunning || isPaused ? 'text-[#F9F5FF] drop-shadow-[0_0_15px_rgba(255,23,68,0.8)] scale-105' : 'text-[#9CA3AF]'}`}>
          {hours}:{minutes}:{seconds}
        </div>
      </div>

      {/* Controls */}
      <div className="pt-4 relative z-10 flex gap-4">
        {isPaused ? (
          <GlowButton variant="primary" onClick={() => resumeSession()}>
            RESUME
          </GlowButton>
        ) : isRunning ? (
          <GlowButton variant="danger" onClick={() => stopSession()}>
            TERMINATE
          </GlowButton>
        ) : (
          <GlowButton variant="primary" onClick={() => startSession()}>
            INITIATE
          </GlowButton>
        )}
      </div>
    </div>
  );
}
