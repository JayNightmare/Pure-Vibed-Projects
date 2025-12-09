import React, { useState, useEffect } from 'react';
import { GlowButton } from '../ui/GlowButton';

interface PresenceOverlayProps {
  intensity: number;
  onConfirm: () => void;
}

export function PresenceOverlay({ intensity, onConfirm }: PresenceOverlayProps) {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });

  useEffect(() => {
    // Random position between 20% and 80% to ensure it's clickable and not off-screen
    const top = 20 + Math.random() * 60;
    const left = 20 + Math.random() * 60;
    setPosition({ top: `${top}%`, left: `${left}%` });
  }, []);

  // Dynamic styles based on intensity
  const overlayClasses = `
    fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-all duration-1000
    ${intensity === 0 ? 'bg-black/80 backdrop-blur-sm' : ''}
    ${intensity === 1 ? 'bg-red-900/30 backdrop-blur-md animate-pulse' : ''}
    ${intensity === 2 ? 'bg-red-900/60 backdrop-blur-lg' : ''}
  `;

  const containerClasses = `
    absolute inset-0 pointer-events-none
    ${intensity === 2 ? 'animate-[shake_0.5s_ease-in-out_infinite]' : ''}
  `;

  return (
    <div className={overlayClasses}>
      {/* Background Warning Text (Stage 3) */}
      {intensity === 2 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <h1 className="text-[20vh] md:text-[30vh] font-black text-[#FF1744]/20 whitespace-nowrap animate-pulse leading-none tracking-tighter transform -rotate-12">
            CRITICAL FAILURE
          </h1>
        </div>
      )}

      {/* Stage 2 Warning */}
      {intensity === 1 && (
        <div className="absolute top-10 w-full text-center pointer-events-none">
          <h2 className="text-4xl font-mono font-bold text-[#FF1744] animate-bounce tracking-widest">
            SYSTEM UNSTABLE
          </h2>
        </div>
      )}

      {/* Shake Container */}
      <div className={containerClasses}>
        {/* CRT Noise/Glitch effects could go here */}
      </div>

      {/* The Button */}
      <div 
        className="absolute transition-all duration-300"
        style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
      >
        <GlowButton 
          variant={intensity === 2 ? 'danger' : 'primary'} 
          onClick={onConfirm}
          size="lg"
        >
          {intensity === 2 ? 'EMERGENCY RESET' : 'I\'M HERE'}
        </GlowButton>
      </div>

      {/* Screen Shake Animation Keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-5px, 5px) rotate(-1deg); }
          50% { transform: translate(5px, -5px) rotate(1deg); }
          75% { transform: translate(-5px, -5px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
}
