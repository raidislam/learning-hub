import { cn } from "@/lib/utilities/cn";
import type { Difficulty } from "@/types/curriculum";

const tone: Record<Difficulty, string> = {
  beginner: "text-success border-success/40 bg-success/10",
  intermediate: "text-warn border-warn/40 bg-warn/10",
  advanced: "text-danger border-danger/40 bg-danger/10",
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  const bars = level === "beginner" ? 1 : level === "intermediate" ? 2 : 3;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium capitalize", tone[level])}>
      <span aria-hidden className="flex items-end gap-0.5">
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn("w-1 rounded-sm bg-current", i <= bars ? "opacity-100" : "opacity-25")} style={{ height: 4 + i * 2 }} />
        ))}
      </span>
      {level}
    </span>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border border-border bg-card-2 px-2 py-0.5 text-xs text-muted-fg", className)}>{children}</span>;
}
