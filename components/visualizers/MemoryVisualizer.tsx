"use client";

import { Inline } from "@/components/lessons/Inline";
import { cn } from "@/lib/utilities/cn";
import type { MemoryCell, VisualSpec } from "@/types/lesson";
import { StepPlayer } from "./StepPlayer";

type Spec = Extract<VisualSpec, { kind: "memory-steps" }>;

const STATE: Record<MemoryCell["state"], { label: string; cls: string }> = {
  live: { label: "initialized", cls: "border-success/50 bg-success/10" },
  hoisted: { label: "hoisted → undefined", cls: "border-warn/50 bg-warn/10" },
  tdz: { label: "Temporal Dead Zone", cls: "border-danger/50 bg-danger/10 border-dashed" },
  error: { label: "error", cls: "border-danger bg-danger/15" },
};

export function MemoryVisualizer({ spec }: { spec: Spec }) {
  const lines = spec.code.split("\n");
  return (
    <figure className="my-4 rounded-xl border border-border bg-card p-4">
      <figcaption className="mb-3 text-sm font-semibold"><Inline text={spec.title} /></figcaption>
      <StepPlayer total={spec.steps.length}>
        {(i) => {
          const s = spec.steps[i];
          return (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Code</p>
                <pre className="overflow-x-auto rounded-lg border border-border bg-code py-2 font-mono text-[13px] leading-6">
                  {lines.map((l, n) => (
                    <div key={n} className={cn("flex px-3", n === s.line && "bg-primary/15 shadow-[inset_3px_0_0_var(--primary)]")}>
                      <span className="mr-3 w-4 select-none text-right text-muted">{n + 1}</span>
                      <code>{l || " "}</code>
                    </div>
                  ))}
                </pre>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Memory (এই scope এর variable)</p>
                <div className="min-h-24 space-y-2 rounded-lg border border-border bg-code p-3">
                  {s.memory.length === 0 && <p className="text-sm text-muted">এখনো কোনো variable নেই</p>}
                  {s.memory.map((c) => (
                    <div key={c.name} className={cn("flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors", STATE[c.state].cls)}>
                      <span className="rounded bg-card-2 px-1.5 font-mono text-[11px] text-muted-fg">{c.kind}</span>
                      <span className="font-mono text-sm font-semibold">{c.name}</span>
                      <span className="ml-auto whitespace-nowrap font-mono text-sm">{c.state === "tdz" ? "⛔ uninitialized" : c.value}</span>
                      <span className="hidden text-[11px] text-muted xl:inline">{STATE[c.state].label}</span>
                    </div>
                  ))}
                </div>
                {s.output && <p className="mt-2 rounded-lg border border-border bg-code px-3 py-1.5 font-mono text-[13px]">▶ {s.output}</p>}
              </div>
              <p className="rounded-lg bg-accent px-4 py-3 text-sm md:col-span-2" aria-live="polite">
                <strong>Step {i + 1}:</strong> <Inline text={s.note} />
              </p>
            </div>
          );
        }}
      </StepPlayer>
      {spec.caption && <p className="mt-3 text-xs text-muted"><Inline text={spec.caption} /></p>}
    </figure>
  );
}
