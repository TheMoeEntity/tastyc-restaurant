"use client";

import { useEffect, useState } from "react";

export function useTimeTicker(intervalMs = 60000) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
}
