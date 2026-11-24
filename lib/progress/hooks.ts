"use client";

import { useMemo } from "react";
import { flatTopics } from "@/lib/curriculum";
import type { TrackDef } from "@/types/curriculum";
import { topicStatus, useProgress } from "./store";

export interface Summary {
  total: number; // topics in curriculum
  written: number; // topics that have a real lesson
  complete: number;
  inProgress: number;
}

/** Progress over a track (or everything). `complete` only counts lessons that exist. */
export function useSummary(track?: TrackDef): Summary {
  const state = useProgress();
  return useMemo(() => {
    const all = flatTopics(track);
    const written = all.filter((t) => t.available);
    let complete = 0;
    let inProgress = 0;
    for (const t of written) {
      const st = topicStatus(state, t.key);
      if (st === "complete") complete++;
      else if (st === "in-progress") inProgress++;
    }
    return { total: all.length, written: written.length, complete, inProgress };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.visited, state.skills, state.quiz, track]);
}

export function useStatus(key: string) {
  const state = useProgress();
  return topicStatus(state, key);
}

/** Next recommended lesson: the first written lesson (curriculum order) that isn't complete yet. */
export function useNextTopic(track?: TrackDef) {
  const state = useProgress();
  return useMemo(
    () => flatTopics(track).find((t) => t.available && topicStatus(state, t.key) !== "complete"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.visited, state.skills, state.quiz, track],
  );
}
