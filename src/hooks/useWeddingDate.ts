import { useState, useEffect } from "react";

const WEDDING_DATE = new Date('2026-04-25T16:00:00');

export function useWeddingDate() {
  const [hasWeddingPassed, setHasWeddingPassed] = useState(() => {
    return new Date() >= WEDDING_DATE;
  });

  useEffect(() => {
    const checkDate = () => {
      setHasWeddingPassed(new Date() >= WEDDING_DATE);
    };

    const timer = setInterval(checkDate, 1000);
    return () => clearInterval(timer);
  }, []);

  return { hasWeddingPassed, weddingDate: WEDDING_DATE };
}
