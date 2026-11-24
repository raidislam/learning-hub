"use client";

import { ProgressBar } from "@/components/progress/ProgressBar";
import { useSummary } from "@/lib/progress/hooks";
import { useProgress } from "@/lib/progress/store";
import type { TrackDef } from "@/types/curriculum";

export function TrackProgress({ track }: { track?: TrackDef }) {
  const hydrated = useProgress((s) => s.hydrated);
  const s = useSummary(track);
  const complete = hydrated ? s.complete : 0;
  const inProgress = hydrated ? s.inProgress : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs text-muted-fg">
        <span>
          <strong className="text-foreground">{complete}</strong> / {s.written} lesson complete
          {inProgress > 0 && <span className="text-warn"> · {inProgress} in progress</span>}
        </span>
        <span>{s.total} topic planned</span>
      </div>
      <ProgressBar value={complete} max={Math.max(s.written, 1)} label="Progress" />
    </div>
  );
}
