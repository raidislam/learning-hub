"use client";

import { CheckCircle2, CircleDashed, Clock3 } from "lucide-react";
import { useStatus } from "@/lib/progress/hooks";
import { useProgress } from "@/lib/progress/store";

export function StatusBadge({ topicKey }: { topicKey: string }) {
  const hydrated = useProgress((s) => s.hydrated);
  const status = useStatus(topicKey);
  const s = hydrated ? status : "not-started";
  if (s === "complete")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-success">
        <CheckCircle2 className="h-3.5 w-3.5" /> Complete
      </span>
    );
  if (s === "in-progress")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-warn">
        <Clock3 className="h-3.5 w-3.5" /> In progress
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      <CircleDashed className="h-3.5 w-3.5" /> Not started
    </span>
  );
}
