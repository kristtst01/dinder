import { useState, useEffect } from 'react';

export function useCookMode() {
  const [cookMode, setCookMode] = useState(false);

  useEffect(() => {
    let wakeLock: any = null;
    const isTouchDevice =
      typeof window !== 'undefined' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window);

    const requestWakeLock = async () => {
      try {
        if (isTouchDevice && 'wakeLock' in navigator && cookMode) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
          console.log('Wake Lock activated');
        }
      } catch (err) {
        console.error('Wake Lock error:', err);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLock) {
        try {
          await wakeLock.release();
          wakeLock = null;
          console.log('Wake Lock released');
        } catch (err) {
          console.error('Wake Lock release error:', err);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && cookMode) {
        requestWakeLock();
      } else if (document.visibilityState === 'hidden') {
        // release if page is hidden to be polite
        releaseWakeLock();
      }
    };

    if (cookMode) {
      requestWakeLock();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
      releaseWakeLock();
    }

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [cookMode]);

  const toggleCookMode = () => {
    setCookMode(!cookMode);
  };

  return { cookMode, toggleCookMode };
}
