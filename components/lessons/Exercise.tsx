"use client";

import { Playground } from "@/components/editor/Playground";
import { Pill } from "@/components/ui/Badge";
import type { Exercise as Ex } from "@/types/lesson";
import { Inline } from "./Inline";
import { CodeBlock } from "./CodeBlock";

const LEVEL = { beginner: "Beginner", intermediate: "Intermediate", challenge: "Real-world challenge" } as const;

export function ExerciseCard({ ex, index }: { ex: Ex; index: number }) {
  return (
    <article className="my-5 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Pill>{LEVEL[ex.level]}</Pill>
        <h3 className="font-semibold">
          {index + 1}. <Inline text={ex.title} />
        </h3>
      </div>
      <p className="mb-2 text-sm">
        <Inline text={ex.prompt} />
      </p>
      <Playground initialCode={ex.starter} expected={ex.expected} title="Exercise editor" minHeight={120} />
      <div className="space-y-2">
        {ex.hints.length > 0 && (
          <details className="rounded-lg border border-border bg-card-2 px-4 py-2 text-sm">
            <summary className="font-medium text-warn">💡 Hint দেখুন ({ex.hints.length})</summary>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              {ex.hints.map((h, i) => (
                <li key={i}>
                  <Inline text={h} />
                </li>
              ))}
            </ol>
          </details>
        )}
        <details className="rounded-lg border border-border bg-card-2 px-4 py-2 text-sm">
          <summary className="font-medium text-primary">✅ Solution দেখুন (আগে নিজে চেষ্টা করুন)</summary>
          <CodeBlock code={ex.solution} />
          {ex.explanation && (
            <p className="pb-2">
              <Inline text={ex.explanation} />
            </p>
          )}
        </details>
      </div>
    </article>
  );
}
