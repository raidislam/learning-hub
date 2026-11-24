"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useNextTopic } from "@/lib/progress/hooks";
import { useProgress } from "@/lib/progress/store";
import type { TrackDef } from "@/types/curriculum";

export function NextUp({ track }: { track?: TrackDef }) {
  const hydrated = useProgress((s) => s.hydrated);
  const next = useNextTopic(track);
  if (!hydrated) return <div className="h-24 animate-pulse rounded-xl border border-border bg-card" />;
  if (!next)
    return (
      <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-fg">
        এই অংশের সব লেখা lesson সম্পূর্ণ করেছেন। নতুন lesson যুক্ত হলে এখানে দেখা যাবে।
      </div>
    );
  return (
    <Link href={`/${next.key}`} className="group flex items-center gap-4 rounded-xl border border-primary/40 bg-accent p-5 transition-colors hover:border-primary">
      <Sparkles className="h-5 w-5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Next recommended</p>
        <p className="truncate text-lg font-semibold">{next.topic.title}</p>
        <p className="truncate text-sm text-muted-fg">
          {next.track.shortTitle} · Module {String(next.module.number).padStart(2, "0")} · {next.module.title}
        </p>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
