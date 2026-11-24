"use client";

import { Check, Eraser, Play, RotateCcw, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { runCode, stdoutOf, outputsMatch, type RunResult } from "@/lib/execution/runner";
import { cn } from "@/lib/utilities/cn";
import { CodeEditor } from "./CodeEditor";

interface Props {
  initialCode: string;
  samples?: { label: string; code: string }[];
  /** If set, actual output is compared to this and a pass/fail verdict is shown. */
  expected?: string;
  onResult?: (passed: boolean) => void;
  minHeight?: number;
  title?: string;
}

export function Playground({ initialCode, samples, expected, onResult, minHeight = 180, title }: Props) {
  const [code, setCode] = useState(initialCode);
  const [base, setBase] = useState(initialCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [verdict, setVerdict] = useState<boolean | null>(null);

  const run = async () => {
    if (running) return;
    setRunning(true);
    const r = await runCode(code);
    setResult(r);
    setRunning(false);
    if (expected !== undefined) {
      const ok = !r.error && outputsMatch(expected, stdoutOf(r));
      setVerdict(ok);
      onResult?.(ok);
    }
  };

  const reset = () => {
    setCode(base);
    setResult(null);
    setVerdict(null);
  };
  const clear = () => {
    setResult(null);
    setVerdict(null);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card-2 px-3 py-2">
        <span className="mr-auto text-xs font-medium text-muted-fg">{title ?? "Playground"}</span>
        {samples && samples.length > 1 && (
          <select
            aria-label="Sample code বাছাই করুন"
            className="h-8 rounded-lg border border-border bg-card px-2 text-xs"
            defaultValue=""
            onChange={(e) => {
              const s = samples[Number(e.target.value)];
              if (s) {
                setCode(s.code);
                setBase(s.code);
                clear();
              }
            }}
          >
            <option value="" disabled>
              Sample বাছাই করুন…
            </option>
            {samples.map((s, i) => (
              <option key={s.label} value={i}>
                {s.label}
              </option>
            ))}
          </select>
        )}
        <Button size="sm" variant="ghost" onClick={clear} aria-label="Output পরিষ্কার করুন">
          <Eraser className="h-3.5 w-3.5" /> Clear
        </Button>
        <Button size="sm" variant="ghost" onClick={reset} aria-label="Code reset করুন">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
        <Button size="sm" variant="primary" onClick={run} disabled={running} aria-label="Code চালান">
          {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />} Run
        </Button>
      </div>

      <CodeEditor value={code} onChange={setCode} onRun={run} minHeight={minHeight} />

      <div className="border-t border-border" aria-live="polite">
        <div className="flex items-center justify-between px-3 py-1.5 text-xs text-muted">
          <span>Output {result && <span>· {result.durationMs}ms</span>}</span>
          <span className="hidden sm:inline">Ctrl/⌘ + Enter = Run</span>
        </div>
        <div className="min-h-12 space-y-0.5 px-3 pb-3 font-mono text-[13px]" data-testid="output">
          {!result && <p className="text-muted">Run চাপুন — output এখানে দেখা যাবে।</p>}
          {result?.logs.length === 0 && !result.error && <p className="text-muted">(কোনো output নেই)</p>}
          {result?.logs.map((l, i) => (
            <pre
              key={i}
              className={cn("whitespace-pre-wrap break-words", l.level === "warn" && "text-warn", l.level === "error" && "text-danger")}
            >
              {l.level === "warn" ? "⚠ " : l.level === "error" ? "✖ " : ""}
              {l.text}
            </pre>
          ))}
        </div>
        {result?.error && (
          <div role="alert" className="border-t border-danger/40 bg-danger/10 px-3 py-2 font-mono text-[13px] text-danger" data-testid="error">
            <p className="font-semibold">
              {result.error.name}
              {result.timedOut ? "" : ":"} {result.error.message}
            </p>
          </div>
        )}
        {expected !== undefined && (
          <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
            <div className="bg-card p-3">
              <p className="mb-1 text-xs font-semibold text-muted">Expected output</p>
              <pre className="whitespace-pre-wrap font-mono text-[13px] text-muted-fg">{expected}</pre>
            </div>
            <div className="bg-card p-3">
              <p className="mb-1 text-xs font-semibold text-muted">Actual output</p>
              <pre className="whitespace-pre-wrap font-mono text-[13px] text-muted-fg">{result ? stdoutOf(result) || "(empty)" : "—"}</pre>
            </div>
          </div>
        )}
        {verdict !== null && (
          <div
            className={cn("flex items-center gap-2 border-t px-3 py-2 text-sm font-medium", verdict ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger")}
            data-testid="verdict"
          >
            {verdict ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            {verdict ? "সঠিক! Output মিলেছে।" : "Output মেলেনি — Expected আর Actual তুলনা করে আবার চেষ্টা করুন।"}
          </div>
        )}
      </div>
    </div>
  );
}
