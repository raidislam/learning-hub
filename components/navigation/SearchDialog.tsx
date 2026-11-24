"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { flatTopics } from "@/lib/curriculum";
import { cn } from "@/lib/utilities/cn";

export function SearchDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted hover:text-foreground"
        aria-label="Topic খুঁজুন"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search topics…</span>
        <kbd className="hidden rounded border border-border px-1.5 text-[11px] sm:inline">Ctrl K</kbd>
      </button>
      {open && <SearchPanel onClose={() => setOpen(false)} />}
    </>
  );
}

/** Mounted only while open, so its query/selection state resets every time. */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const all = useMemo(() => flatTopics(), []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return all.filter((t) => t.available).slice(0, 8);
    return all
      .filter((t) => `${t.topic.title} ${t.module.title} ${t.track.title}`.toLowerCase().includes(term))
      .sort((a, b) => Number(b.available) - Number(a.available))
      .slice(0, 12);
  }, [q, all]);

  const go = (i: number) => {
    const r = results[i];
    if (!r) return;
    onClose();
    router.push(r.available ? `/${r.key}` : `/${r.track.slug}/${r.module.slug}`);
  };

  return (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search className="h-4 w-4 text-muted" />
              <input
                autoFocus
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (e.key === "Enter") go(active);
                }}
                placeholder="যেমন: closure, event loop, Binary Search…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">কিছু পাওয়া যায়নি</li>}
              {results.map((r, i) => (
                <li key={r.key}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(i)}
                    className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm", i === active && "bg-accent")}
                  >
                    <span className="flex-1">
                      <span className="block">{r.topic.title}</span>
                      <span className="block text-xs text-muted">
                        {r.track.shortTitle} · {r.module.title}
                      </span>
                    </span>
                    <span className={cn("rounded-full border px-2 text-[11px]", r.available ? "border-success/40 text-success" : "border-border text-muted")}>
                      {r.available ? "Lesson" : "Planned"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
  );
}
