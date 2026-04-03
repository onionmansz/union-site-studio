import { useState, useEffect } from "react";

const WEDDING_DATE = new Date('2026-04-25T16:00:00');

export function useWeddingDate() {
  const [hasWeddingPassed, setHasWeddingPassed] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('postWedding') === 'true') return true;
    if (params.get('postWedding') === 'false') return false;
    return new Date() >= WEDDING_DATE;
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const override = params.get('postWedding');
    if (override !== null) return;

    const checkDate = () => {
      setHasWeddingPassed(new Date() >= WEDDING_DATE);
    };

    const timer = setInterval(checkDate, 1000);
    return () => clearInterval(timer);
  }, []);

  return { hasWeddingPassed, weddingDate: WEDDING_DATE };
}
