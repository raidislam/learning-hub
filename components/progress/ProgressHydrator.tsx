"use client";

import { useEffect } from "react";
import { useProgress } from "@/lib/progress/store";

/** Loads persisted progress from localStorage after mount (avoids hydration mismatch). */
export function ProgressHydrator() {
  useEffect(() => {
    void useProgress.persist.rehydrate();
  }, []);
  return null;
}
