"use client";

import Link from "next/link";
import { useMemo } from "react";
import { flatTopics } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress/store";
import { StatusBadge } from "./StatusBadge";

export function BookmarksList() {
  const hydrated = useProgress((s) => s.hydrated);
  const bookmarks = useProgress((s) => s.bookmarks);
  const notes = useProgress((s) => s.notes);
  const all = useMemo(() => flatTopics(), []);

  if (!hydrated) return <div className="h-24 animate-pulse rounded-xl border border-border bg-card" />;

  const marked = all.filter((t) => bookmarks.includes(t.key));
  const noted = all.filter((t) => notes[t.key]?.trim());

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 font-semibold">Bookmarked lessons ({marked.length})</h2>
        {marked.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-fg">কোনো bookmark নেই। Lesson page এর উপরে “Bookmark” চাপুন।</p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {marked.map((t) => (
              <li key={t.key}>
                <Link href={`/${t.key}`} className="flex items-center gap-3 px-4 py-3 hover:bg-card-2">
                  <span className="flex-1">
                    <span className="block font-medium">{t.topic.title}</span>
                    <span className="block text-xs text-muted">{t.track.shortTitle} · {t.module.title}</span>
                  </span>
                  <StatusBadge topicKey={t.key} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="mb-3 font-semibold">Notes ({noted.length})</h2>
        {noted.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-fg">কোনো note নেই। Lesson এর Summary অংশে note লিখতে পারবেন।</p>
        ) : (
          <ul className="space-y-3">
            {noted.map((t) => (
              <li key={t.key} className="rounded-xl border border-border bg-card p-4">
                <Link href={`/${t.key}`} className="font-medium hover:text-primary">
                  {t.topic.title}
                </Link>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-fg">{notes[t.key]}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
