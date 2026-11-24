"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { Playground } from "@/components/editor/Playground";
import { Inline } from "@/components/lessons/Inline";
import { Button } from "@/components/ui/Button";
import { PASS_RATIO, useProgress } from "@/lib/progress/store";
import { cn } from "@/lib/utilities/cn";
import type { CodingQuestion, Mcq } from "@/types/lesson";

const NO_CODING: Record<number, boolean> = {};

export function Quiz({ topicKey, mcqs, coding }: { topicKey: string; mcqs: Mcq[]; coding: CodingQuestion[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => mcqs.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const saveMcq = useProgress((s) => s.saveMcq);
  const saveCoding = useProgress((s) => s.saveCoding);
  const best = useProgress((s) => s.quiz[topicKey]);
  const codingPassed = useProgress((s) => s.quiz[topicKey]?.coding ?? NO_CODING);

  const score = mcqs.filter((q, i) => picked[i] === q.answer).length;
  const allAnswered = picked.every((p) => p !== null);

  const submit = () => {
    setSubmitted(true);
    saveMcq(topicKey, score, mcqs.length);
  };
  const retry = () => {
    setPicked(mcqs.map(() => null));
    setSubmitted(false);
  };

  return (
    <div>
      <h3 className="mb-3 font-semibold">MCQ ({mcqs.length} টি)</h3>
      <ol className="space-y-5">
        {mcqs.map((q, qi) => {
          const chosen = picked[qi];
          return (
            <li key={qi} className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 font-medium">
                {qi + 1}. <Inline text={q.question} />
              </p>
              <div role="radiogroup" aria-label={`প্রশ্ন ${qi + 1}`} className="space-y-2">
                {q.options.map((o, oi) => {
                  const isChosen = chosen === oi;
                  const isAnswer = q.answer === oi;
                  return (
                    <button
                      key={oi}
                      role="radio"
                      aria-checked={isChosen}
                      disabled={submitted}
                      onClick={() => setPicked((p) => p.map((v, i) => (i === qi ? oi : v)))}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                        !submitted && (isChosen ? "border-primary bg-accent" : "border-border hover:bg-card-2"),
                        submitted && isAnswer && "border-success bg-success/10",
                        submitted && isChosen && !isAnswer && "border-danger bg-danger/10",
                        submitted && !isChosen && !isAnswer && "border-border opacity-70",
                      )}
                    >
                      <span className="mt-0.5 font-mono text-xs text-muted">{String.fromCharCode(65 + oi)}</span>
                      <span className="flex-1">
                        <Inline text={o} />
                      </span>
                      {submitted && isAnswer && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />}
                      {submitted && isChosen && !isAnswer && <XCircle className="h-4 w-4 shrink-0 text-danger" />}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className={cn("mt-3 rounded-lg px-3 py-2 text-sm", chosen === q.answer ? "bg-success/10" : "bg-danger/10")}>
                  <strong>{chosen === q.answer ? "সঠিক। " : "ভুল। "}</strong>
                  <Inline text={q.explanation} />
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <Button variant="primary" onClick={submit} disabled={!allAnswered}>
            Submit করুন
          </Button>
        ) : (
          <>
            <p className="text-lg font-semibold" data-testid="score">
              Score: {score} / {mcqs.length}
            </p>
            <span className={cn("text-sm", score / mcqs.length >= PASS_RATIO ? "text-success" : "text-warn")}>
              {score / mcqs.length >= PASS_RATIO ? "Pass! ✔" : `Pass করতে কমপক্ষে ${Math.ceil(mcqs.length * PASS_RATIO)} টি সঠিক দরকার — ব্যাখ্যাগুলো পড়ে আবার চেষ্টা করুন।`}
            </span>
            <Button onClick={retry}>আবার চেষ্টা করুন</Button>
          </>
        )}
        {!allAnswered && !submitted && <span className="text-xs text-muted">সব প্রশ্নের উত্তর দিলে Submit করা যাবে</span>}
        {best && best.total > 0 && <span className="ml-auto text-xs text-muted">Best: {best.score}/{best.total}</span>}
      </div>

      <h3 className="mb-1 mt-10 font-semibold">Coding questions ({coding.length} টি)</h3>
      <p className="mb-3 text-sm text-muted-fg">কোড চালান — আপনার output, expected output এর সাথে মিললে প্রশ্নটি pass হিসেবে সংরক্ষিত হবে।</p>
      {coding.map((c, i) => (
        <article key={i} className="mb-5 rounded-xl border border-border bg-card p-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h4 className="font-medium">
              {i + 1}. <Inline text={c.title} />
            </h4>
            {codingPassed[i] && <span className="text-xs text-success">✔ Passed</span>}
          </div>
          <p className="text-sm">
            <Inline text={c.prompt} />
          </p>
          <Playground initialCode={c.starter} expected={c.expected} title="Coding question" minHeight={120} onResult={(ok) => saveCoding(topicKey, i, ok)} />
          <details className="rounded-lg border border-border bg-card-2 px-4 py-2 text-sm">
            <summary className="font-medium text-primary">Solution দেখুন</summary>
            <pre className="mt-2 overflow-x-auto font-mono text-[13px]">{c.solution}</pre>
          </details>
        </article>
      ))}
    </div>
  );
}
