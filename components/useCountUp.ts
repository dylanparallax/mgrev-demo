'use client';
import { useEffect, useRef, useState } from 'react';

// Animates a number from what's on screen to the new target.
export function useCountUp(target: number, ms = 1100) {
  const [value, setValue] = useState(target);
  const shown = useRef(target);

  useEffect(() => {
    const a = shown.current;
    if (a === target) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const v = a + (target - a) * (1 - Math.pow(1 - t, 3));
      shown.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return value;
}
