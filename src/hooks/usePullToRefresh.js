import { useEffect, useRef } from 'react';

export const usePullToRefresh = (onRefresh, enabled = true) => {
  const startY = useRef(0);
  const pulling = useRef(false);

  useEffect(() => {
    if (!enabled) return undefined;

    const onTouchStart = (event) => {
      if (window.scrollY === 0) {
        startY.current = event.touches[0].clientY;
        pulling.current = true;
      }
    };

    const onTouchEnd = async (event) => {
      if (!pulling.current) return;
      const delta = event.changedTouches[0].clientY - startY.current;
      pulling.current = false;
      if (delta > 80) await onRefresh();
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [enabled, onRefresh]);
};
