import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, Mood } from '../types/session';
import { loadSessions, saveSessions } from '../lib/storage';

interface PendingSession {
  startedAt: string;
  endedAt: string;
  durationMs: number;
}

interface SessionContextValue {
  sessions: Session[];
  currentSessionStart: Date | null;
  isRunning: boolean;
  isPaused: boolean;
  elapsedMs: number; // Total elapsed time (accumulated + current segment)
  accumulatedMs: number; // Time from previous segments
  pendingSession: PendingSession | null;
  startSession: (activityHint?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => void;
  saveSession: (metadata: { activity: string; mood: Mood; soundtrack: string }) => void;
  discardSession: () => void;
  deleteSession: (id: string) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionStart, setCurrentSessionStart] = useState<Date | null>(null);
  const [accumulatedMs, setAccumulatedMs] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pendingSession, setPendingSession] = useState<PendingSession | null>(null);

  // Load sessions on mount
  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  // Save sessions whenever they change
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const isRunning = currentSessionStart !== null;

  const startSession = (activityHint?: string) => {
    if (isRunning || isPaused) return;
    setCurrentSessionStart(new Date());
    setAccumulatedMs(0);
    setIsPaused(false);
    setPendingSession(null);
  };

  const pauseSession = () => {
    if (!isRunning || isPaused) return;
    const now = new Date();
    const currentSegment = now.getTime() - (currentSessionStart?.getTime() || now.getTime());
    setAccumulatedMs(prev => prev + currentSegment);
    setCurrentSessionStart(null);
    setIsPaused(true);
  };

  const resumeSession = () => {
    if (!isPaused) return;
    setCurrentSessionStart(new Date());
    setIsPaused(false);
  };

  const stopSession = () => {
    if (!currentSessionStart && !isPaused) return;
    
    const now = new Date();
    let finalElapsed = accumulatedMs;
    
    if (currentSessionStart) {
      finalElapsed += now.getTime() - currentSessionStart.getTime();
    }
    
    setPendingSession({
      startedAt: new Date(now.getTime() - finalElapsed).toISOString(), // Approximate start time
      endedAt: now.toISOString(),
      durationMs: finalElapsed
    });
    
    setCurrentSessionStart(null);
    setAccumulatedMs(0);
    setIsPaused(false);
  };

  const saveSession = (metadata: { activity: string; mood: Mood; soundtrack: string }) => {
    if (!pendingSession) return;

    const newSession: Session = {
      id: crypto.randomUUID(),
      ...pendingSession,
      ...metadata
    };

    setSessions(prev => [newSession, ...prev]);
    setPendingSession(null);
    setAccumulatedMs(0);
  };

  const discardSession = () => {
    setPendingSession(null);
    setAccumulatedMs(0);
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <SessionContext.Provider value={{ 
      sessions, 
      currentSessionStart, 
      isRunning,
      isPaused,
      elapsedMs: accumulatedMs, // For compatibility, though consumers should use hook
      accumulatedMs,
      pendingSession,
      startSession, 
      pauseSession,
      resumeSession,
      stopSession,
      saveSession,
      discardSession,
      deleteSession 
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionProvider');
  }
  return context;
}
