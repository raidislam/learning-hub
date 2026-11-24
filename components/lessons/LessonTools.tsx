"use client";

import { Bookmark, BookmarkCheck, Check, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { PASS_RATIO, SKILLS, quizPassed, skillCount, topicStatus, useProgress } from "@/lib/progress/store";
import { cn } from "@/lib/utilities/cn";

/** Records that the page was opened. This is "in progress", NEVER "complete". */
export function VisitTracker({ topicKey }: { topicKey: string }) {
  const hydrated = useProgress((s) => s.hydrated);
  const mark = useProgress((s) => s.markVisited);
  useEffect(() => {
    if (hydrated) mark(topicKey);
  }, [hydrated, mark, topicKey]);
  return null;
}

export function BookmarkButton({ topicKey }: { topicKey: string }) {
  const on = useProgress((s) => s.bookmarks.includes(topicKey));
  const toggle = useProgress((s) => s.toggleBookmark);
  return (
    <Button onClick={() => toggle(topicKey)} aria-pressed={on} aria-label={on ? "Bookmark সরান" : "Bookmark করুন"}>
      {on ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
      {on ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}

export function CompletionChecklist({ topicKey, compact }: { topicKey: string; compact?: boolean }) {
  const state = useProgress();
  const hydrated = state.hydrated;
  const toggle = state.toggleSkill;
  const status = topicStatus(state, topicKey);
  const n = skillCount(state, topicKey);
  const passed = quizPassed(state, topicKey);

  return (
    <div className={cn("rounded-xl border border-border bg-card", compact ? "p-3" : "p-5")}>
      <p className="mb-2 text-sm font-semibold">Completion checklist</p>
      <ul className="space-y-2">
        {SKILLS.map((s) => {
          const on = hydrated && !!state.skills[topicKey]?.[s.id];
          return (
            <li key={s.id}>
              <label className="flex cursor-pointer items-start gap-2 text-sm">
                <input type="checkbox" checked={on} onChange={() => toggle(topicKey, s.id)} className="mt-1 h-4 w-4 accent-[var(--primary)]" />
                <span>
                  {s.label}
                  {!compact && <span className="block text-xs text-muted">{s.hint}</span>}
                </span>
              </label>
            </li>
          );
        })}
        <li className="flex items-start gap-2 text-sm">
          <span className={cn("mt-1 flex h-4 w-4 items-center justify-center rounded border", passed ? "border-success bg-success text-primary-fg" : "border-border")}>
            {passed && <Check className="h-3 w-3" />}
          </span>
          <span>
            Assessment এ MCQ pass ({Math.round(PASS_RATIO * 100)}%+)
            <span className="block text-xs text-muted">Assessment section এ quiz দিলে স্বয়ংক্রিয়ভাবে টিক হবে</span>
          </span>
        </li>
      </ul>
      <p className={cn("mt-3 text-xs font-medium", status === "complete" ? "text-success" : "text-muted")} data-testid="topic-status">
        {hydrated ? (status === "complete" ? "🎉 Topic complete!" : `${n}/4 self-check · ${passed ? "quiz passed" : "quiz বাকি"}`) : "…"}
      </p>
      {!compact && (
        <button onClick={() => useProgress.getState().resetTopic(topicKey)} className="mt-2 inline-flex items-center gap-1 text-xs text-muted hover:text-foreground">
          <RotateCcw className="h-3 w-3" /> এই topic এর progress reset
        </button>
      )}
    </div>
  );
}

export function NotesPanel({ topicKey }: { topicKey: string }) {
  const note = useProgress((s) => s.notes[topicKey] ?? "");
  const setNote = useProgress((s) => s.setNote);
  const hydrated = useProgress((s) => s.hydrated);
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <label htmlFor="notes" className="mb-2 block text-sm font-semibold">
        আমার notes
      </label>
      <textarea
        id="notes"
        value={hydrated ? note : ""}
        onChange={(e) => setNote(topicKey, e.target.value)}
        placeholder="নিজের ভাষায় লিখুন — কী বুঝলেন, কোথায় আটকালেন… (এই browser এ সংরক্ষিত হয়)"
        rows={5}
        className="w-full resize-y rounded-lg border border-border bg-code p-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
