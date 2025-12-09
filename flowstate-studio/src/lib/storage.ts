import { Session } from '../types/session';

const STORAGE_KEY = 'flowstate_sessions';

export function loadSessions(): Session[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load sessions', e);
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions', e);
  }
}
