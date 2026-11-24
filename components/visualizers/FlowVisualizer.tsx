"use client";

import { ArrowRight, ArrowDown } from "lucide-react";
import { Inline } from "@/components/lessons/Inline";
import { cn } from "@/lib/utilities/cn";
import type { VisualSpec } from "@/types/lesson";
import { StepPlayer } from "./StepPlayer";

type Spec = Extract<VisualSpec, { kind: "flow-steps" }>;

export function FlowVisualizer({ spec }: { spec: Spec }) {
  return (
    <figure className="my-4 rounded-xl border border-border bg-card p-4">
      <figcaption className="mb-3 text-sm font-semibold"><Inline text={spec.title} /></figcaption>
      <StepPlayer total={spec.steps.length}>
        {(i) => {
          const s = spec.steps[i];
          return (
            <div>
              <div className="flex flex-col items-stretch gap-2 md:flex-row md:flex-wrap md:items-stretch">
                {spec.nodes.map((n, ni) => {
                  const on = s.active.includes(n.id);
                  const items = s.items?.[n.id] ?? [];
                  return (
                    <div key={n.id} className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
                      <div
                        className={cn(
                          "min-h-20 min-w-32 rounded-lg border px-3 py-2 transition-colors md:flex-1",
                          on ? "border-primary bg-primary/15 shadow-[0_0_0_1px_var(--primary)]" : "border-border bg-code",
                        )}
                      >
                        <p className="text-sm font-semibold"><Inline text={n.label} /></p>
                        {n.sub && <p className="text-[11px] text-muted"><Inline text={n.sub} /></p>}
                        {items.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {items.map((it, k) => (
                              <li key={k} className="rounded border border-border bg-card px-2 py-0.5 font-mono text-[12px]">
                                <Inline text={it} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {ni < spec.nodes.length - 1 && (
                        <>
                          <ArrowRight aria-hidden className="hidden h-4 w-4 shrink-0 text-muted md:block" />
                          <ArrowDown aria-hidden className="mx-auto h-4 w-4 text-muted md:hidden" />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              {s.output && <p className="mt-3 rounded-lg border border-border bg-code px-3 py-1.5 font-mono text-[13px]">▶ {s.output}</p>}
              <p className="mt-3 rounded-lg bg-accent px-4 py-3 text-sm" aria-live="polite">
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
