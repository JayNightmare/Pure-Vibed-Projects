import React, { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen w-full bg-[#05010A] text-[#F9F5FF] overflow-hidden relative font-mono">
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 scanline opacity-20" />
      
      {/* CRT Flicker Overlay */}
      <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.02]">
        <div className="absolute inset-0 bg-white crt-flicker" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
      
      {/* Main Content Wrapper */}
      <main className="relative z-10 h-screen flex flex-col p-4 md:p-8 max-w-4xl mx-auto overflow-y-auto scrollbar-hide">
        {children}
      </main>
    </div>
  );
}
