"use client";

import Link from "next/link";
import { useMemo } from "react";
import { flatTopics } from "@/lib/curriculum";
import { quizPassed, useProgress } from "@/lib/progress/store";

export function AssessmentsList() {
  const state = useProgress();
  const lessons = useMemo(() => flatTopics().filter((t) => t.available), []);
  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-card">
      {lessons.map((t) => {
        const q = state.quiz[t.key];
        const coding = q ? Object.values(q.coding).filter(Boolean).length : 0;
        return (
          <li key={t.key}>
            <Link href={`/${t.key}#assessment`} className="flex items-center gap-3 px-4 py-3 hover:bg-card-2">
              <span className="flex-1">
                <span className="block font-medium">{t.topic.title}</span>
                <span className="block text-xs text-muted">{t.track.shortTitle} · {t.module.title}</span>
              </span>
              <span className="text-sm text-muted-fg">
                {state.hydrated && q && q.total > 0 ? (
                  <>
                    <span className={quizPassed(state, t.key) ? "text-success" : "text-warn"}>
                      MCQ {q.score}/{q.total}
                    </span>{" "}
                    · Coding {coding}/2
                  </>
                ) : (
                  "এখনো দেওয়া হয়নি"
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
