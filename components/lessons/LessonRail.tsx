"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utilities/cn";
import { CompletionChecklist } from "./LessonTools";

export interface TocItem {
  id: string;
  title: string;
}
export interface RailLink {
  href: string;
  label: string;
  sub?: string;
}

export function LessonRail({
  topicKey,
  toc,
  prerequisites,
  next,
}: {
  topicKey: string;
  toc: TocItem[];
  prerequisites: RailLink[];
  next?: RailLink;
}) {
  const [active, setActive] = useState(toc[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [toc]);

  return (
    <aside className="hidden w-64 shrink-0 xl:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-5 overflow-y-auto pb-6 pr-1">
        <nav aria-label="Table of contents">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">এই page এ</p>
          <ul className="space-y-0.5 border-l border-border">
            {toc.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className={cn("-ml-px block border-l py-1 pl-3 text-sm transition-colors", active === t.id ? "border-primary font-medium text-primary" : "border-transparent text-muted-fg hover:text-foreground")}
                >
                  {t.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <CompletionChecklist topicKey={topicKey} compact />
        {prerequisites.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Prerequisites</p>
            <ul className="space-y-1 text-sm">
              {prerequisites.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="text-muted-fg hover:text-primary">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {next && (
          <Link href={next.href} className="group block rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/60">
            <p className="text-xs text-muted">Next topic</p>
            <p className="flex items-center justify-between gap-2 text-sm font-medium">
              {next.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </p>
            {next.sub && <p className="text-xs text-muted">{next.sub}</p>}
          </Link>
        )}
      </div>
    </aside>
  );
}
