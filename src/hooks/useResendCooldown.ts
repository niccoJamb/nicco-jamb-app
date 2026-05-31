import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useResendCooldown
 *
 * Provides a countdown-based cooldown so users can't spam the
 * "Resend verification email" button (which would hammer the database's
 * email rate limit). Call `start()` after a successful send.
 *
 * @param seconds  Length of the cooldown in seconds (default 60).
 * @param storageKey  Optional localStorage key so the cooldown survives
 *                    component remounts / page reloads (e.g. closing and
 *                    reopening the sign-in modal).
 */
export function useResendCooldown(seconds = 60, storageKey?: string) {
  const getInitialRemaining = useCallback(() => {
    if (!storageKey) return 0;
    try {
      const until = Number(localStorage.getItem(storageKey) || 0);
      if (!until) return 0;
      const remaining = Math.ceil((until - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    } catch {
      return 0;
    }
  }, [storageKey]);

  const [remaining, setRemaining] = useState<number>(getInitialRemaining);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    setRemaining(prev => {
      const next = prev - 1;
      if (next <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (storageKey) {
          try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
        }
        return 0;
      }
      return next;
    });
  }, [storageKey]);

  const start = useCallback(() => {
    setRemaining(seconds);
    if (storageKey) {
      try { localStorage.setItem(storageKey, String(Date.now() + seconds * 1000)); } catch { /* ignore */ }
    }
  }, [seconds, storageKey]);

  // Drive the countdown
  useEffect(() => {
    if (remaining > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [remaining, tick]);

  // Re-sync from storage on mount (handles remounts while a cooldown is active)
  useEffect(() => {
    const r = getInitialRemaining();
    if (r > 0) setRemaining(r);
  }, [getInitialRemaining]);

  return { remaining, isCoolingDown: remaining > 0, start };
}
