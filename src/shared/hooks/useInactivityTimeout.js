import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook that tracks user inactivity and triggers a callback after a specified timeout.
 * Resets the timer on user interaction (touch, mouse, keyboard, scroll).
 * Only active when `isActive` is true.
 *
 * @param {Object} options
 * @param {number} options.timeoutMs - Inactivity timeout in milliseconds
 * @param {Function} options.onTimeout - Called when inactivity timeout is reached
 * @param {boolean} options.isActive - Whether the timeout should be running
 * @param {string[]} options.events - Optional custom events to listen for (defaults to common interaction events)
 */
export const useInactivityTimeout = ({
  timeoutMs = 60000,
  onTimeout,
  isActive = true,
  events = ['mousedown', 'touchstart', 'keydown', 'scroll'],
}) => {
  const timeoutRef = useRef(null);
  const onTimeoutRef = useRef(onTimeout);

  // Keep callback ref up to date
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const clearInactivityTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const resetInactivityTimeout = useCallback(() => {
    clearInactivityTimeout();
    if (isActive && onTimeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        onTimeoutRef.current();
      }, timeoutMs);
    }
  }, [isActive, timeoutMs, clearInactivityTimeout]);

  useEffect(() => {
    if (!isActive) {
      clearInactivityTimeout();
      return;
    }

    const handleActivity = () => {
      resetInactivityTimeout();
    };

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Start initial timer
    resetInactivityTimeout();

    return () => {
      clearInactivityTimeout();
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isActive, events, resetInactivityTimeout, clearInactivityTimeout]);

  return { resetInactivityTimeout, clearInactivityTimeout };
};

export default useInactivityTimeout;
