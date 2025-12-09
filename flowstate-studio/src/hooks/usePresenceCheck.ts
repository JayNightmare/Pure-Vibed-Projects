import { useState, useEffect, useCallback } from 'react';

const MIN_INTERVAL = 15 */*  60 * */ 1000; // 15 mins
const MAX_INTERVAL = 20 * /* 60 * */ 1000; // 20 mins
const WARNING_DURATION = 60 * 1000; // 60 seconds to respond

export function usePresenceCheck(isRunning: boolean, pauseSession: () => void) {
  const [isCheckActive, setIsCheckActive] = useState(false);
  const [nextCheckTime, setNextCheckTime] = useState<number | null>(null);
  const [intensity, setIntensity] = useState(0); // 0: Normal, 1: Warning, 2: Critical

  // Schedule next check
  const scheduleNextCheck = useCallback(() => {
    const randomDelay = Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1) + MIN_INTERVAL);
    setNextCheckTime(Date.now() + randomDelay);
    setIsCheckActive(false);
    setIntensity(0);
  }, []);

  // Start/Stop scheduling based on running state
  useEffect(() => {
    if (isRunning && !nextCheckTime && !isCheckActive) {
      scheduleNextCheck();
    } else if (!isRunning && !isCheckActive) {
      setNextCheckTime(null);
    }
  }, [isRunning, nextCheckTime, isCheckActive, scheduleNextCheck]);

  // Check loop
  useEffect(() => {
    if (!isRunning || !nextCheckTime || isCheckActive) return;

    const interval = setInterval(() => {
      if (Date.now() >= nextCheckTime) {
        setIsCheckActive(true);
        setNextCheckTime(null); // Clear timer
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, nextCheckTime, isCheckActive]);

  // Intensity and Timeout loop
  useEffect(() => {
    if (!isCheckActive) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (elapsed > WARNING_DURATION) {
        // Timeout reached
        pauseSession();
        setIsCheckActive(false);
        setIntensity(0);
        setNextCheckTime(null); // Will be rescheduled when resumed
      } else if (elapsed > 50000) { // Last 10 seconds
        setIntensity(2);
      } else if (elapsed > 30000) { // After 30 seconds
        setIntensity(1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isCheckActive, pauseSession]);

  const confirmPresence = () => {
    scheduleNextCheck();
  };

  return { isCheckActive, intensity, confirmPresence };
}
