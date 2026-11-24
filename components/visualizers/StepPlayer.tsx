"use client";

import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const SPEEDS = [0.5, 1, 2, 4];

/**
 * Generic step-through controller (Play / Pause / Next / Previous / Reset / Speed).
 * Reused by every visualizer (lesson visuals now, DSA visualizers later).
 */
export function StepPlayer({ total, children }: { total: number; children: (step: number) => React.ReactNode }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const last = total - 1;

  const running = playing && step < last; // auto-stops at the final step

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setStep((s) => Math.min(s + 1, last)), 1600 / speed);
    return () => clearTimeout(t);
  }, [running, step, speed, last]);

  return (
    <div>
      {children(step)}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="primary" onClick={() => (step >= last ? (setStep(0), setPlaying(true)) : setPlaying(!running))} aria-label={running ? "Pause" : "Play"}>
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? "Pause" : "Play"}
        </Button>
        <Button size="sm" onClick={() => { setPlaying(false); setStep((s) => Math.max(s - 1, 0)); }} disabled={step === 0} aria-label="Previous step">
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </Button>
        <Button size="sm" onClick={() => { setPlaying(false); setStep((s) => Math.min(s + 1, last)); }} disabled={step >= last} aria-label="Next step">
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { setPlaying(false); setStep(0); }} aria-label="Reset">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
        <label className="ml-auto flex items-center gap-2 text-xs text-muted-fg">
          Speed
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="h-8 rounded-lg border border-border bg-card px-2 text-xs">
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </label>
        <span className="w-full text-xs text-muted sm:w-auto" aria-live="polite">
          Step {step + 1} / {total}
        </span>
      </div>
    </div>
  );
}
