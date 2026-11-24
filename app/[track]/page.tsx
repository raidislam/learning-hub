import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flag, Gauge, Link2 } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/Badge";
import { NextUp } from "@/components/progress/NextUp";
import { TrackProgress } from "@/components/progress/TrackProgress";
import { findModuleById, flatTopics, getTrack, TRACKS } from "@/lib/curriculum";

export function generateStaticParams() {
  return TRACKS.map((t) => ({ track: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[track]">): Promise<Metadata> {
  const { track } = await params;
  const t = getTrack(track);
  return { title: t?.title ?? "Not found" };
}

async function TrackPageContent({ params }: Pick<PageProps<"/[track]">, "params">) {
  const { track: slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Track</p>
        <h1 className="text-3xl font-bold tracking-tight">{track.title}</h1>
        <p className="mt-3 max-w-2xl text-muted-fg">{track.summary}</p>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="mb-1 flex items-center gap-1.5 text-xs text-muted">
              <Gauge className="h-3.5 w-3.5" /> Difficulty
            </p>
            <DifficultyBadge level={track.difficulty} />
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="mb-1 flex items-center gap-1.5 text-xs text-muted">
              <Flag className="h-3.5 w-3.5" /> Priority
            </p>
            {track.priority}
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="mb-1 flex items-center gap-1.5 text-xs text-muted">
              <Link2 className="h-3.5 w-3.5" /> Prerequisites
            </p>
            {track.prerequisites}
          </div>
        </div>
      </header>

      <TrackProgress track={track} />
      <NextUp track={track} />

      <section aria-labelledby="modules">
        <h2 id="modules" className="mb-4 text-lg font-semibold">
          Modules
        </h2>
        <ul className="space-y-3">
          {track.modules.map((m) => {
            const topics = flatTopics(track).filter((t) => t.module.id === m.id);
            const written = topics.filter((t) => t.available).length;
            const prereq = m.prerequisites.map((id) => findModuleById(id)?.module).filter(Boolean);
            return (
              <li key={m.id}>
                <Link href={`/${track.slug}/${m.slug}`} className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/60">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted">MODULE {String(m.number).padStart(2, "0")}</span>
                    <DifficultyBadge level={m.difficulty} />
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">{m.title}</h3>
                  <p className="mt-1 text-sm text-muted-fg">{m.summary}</p>
                  <p className="mt-3 text-xs text-muted">
                    {topics.length} topics · {written} lesson লেখা হয়েছে
                    {prereq.length > 0 && <> · আগে: {prereq.map((p) => `Module ${String(p!.number).padStart(2, "0")}`).join(", ")}</>}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default function TrackPage({ params }: PageProps<"/[track]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-64 max-w-3xl animate-pulse rounded-xl border border-border bg-card" />}>
      <TrackPageContent params={params} />
    </Suspense>
  );
}
