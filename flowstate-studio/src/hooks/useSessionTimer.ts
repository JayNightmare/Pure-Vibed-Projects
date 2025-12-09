import { useState, useEffect } from 'react';

interface UseSessionTimerOptions {
  startTime: Date | null;
  isRunning: boolean;
  accumulatedMs?: number;
  tickMs?: number;
}

interface UseSessionTimerResult {
  elapsedMs: number;
  hours: string;
  minutes: string;
  seconds: string;
}

export function useSessionTimer({ startTime, isRunning, accumulatedMs = 0, tickMs = 1000 }: UseSessionTimerOptions): UseSessionTimerResult {
  const [elapsedMs, setElapsedMs] = useState(accumulatedMs);

  useEffect(() => {
    // If not running, just show accumulated time
    if (!isRunning || !startTime) {
      setElapsedMs(accumulatedMs);
      return;
    }

    // Update immediately to avoid initial lag
    const updateTimer = () => {
      const currentSegment = Date.now() - startTime.getTime();
      setElapsedMs(accumulatedMs + currentSegment);
    };

    updateTimer();

    const intervalId = setInterval(updateTimer, tickMs);

    return () => clearInterval(intervalId);
  }, [isRunning, startTime, accumulatedMs, tickMs]);

  const seconds = Math.floor((elapsedMs / 1000) % 60);
  const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
  const hours = Math.floor((elapsedMs / (1000 * 60 * 60)));

  const pad = (num: number) => num.toString().padStart(2, '0');

  return {
    elapsedMs,
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
}
