import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { DifficultyBadge, Pill } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/progress/StatusBadge";
import { findModuleById, flatTopics, getModule, TRACKS } from "@/lib/curriculum";

export function generateStaticParams() {
  return TRACKS.flatMap((t) => t.modules.map((m) => ({ track: t.slug, module: m.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[track]/[module]">): Promise<Metadata> {
  const { track, module } = await params;
  const found = getModule(track, module);
  return { title: found ? `${found.module.title}` : "Not found" };
}

async function ModulePageContent({ params }: Pick<PageProps<"/[track]/[module]">, "params">) {
  const { track: ts, module: ms } = await params;
  const found = getModule(ts, ms);
  if (!found) notFound();
  const { track, module } = found;
  const topics = flatTopics(track).filter((t) => t.module.id === module.id);
  const prereq = module.prerequisites.map((id) => findModuleById(id)).filter((x) => !!x);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted">
        <Link href={`/${track.slug}`} className="hover:text-foreground">
          {track.title}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Module {String(module.number).padStart(2, "0")}</span>
      </nav>

      <header>
        <h1 className="text-3xl font-bold tracking-tight">{module.title}</h1>
        <p className="mt-3 text-muted-fg">{module.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <DifficultyBadge level={module.difficulty} />
          <Pill>{topics.length} topics</Pill>
          {prereq.length === 0 ? (
            <Pill>Prerequisite নেই</Pill>
          ) : (
            prereq.map((p) => (
              <Link key={p.module.id} href={`/${p.track.slug}/${p.module.slug}`}>
                <Pill className="hover:text-foreground">আগে: Module {String(p.module.number).padStart(2, "0")} · {p.module.title}</Pill>
              </Link>
            ))
          )}
        </div>
      </header>

      <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {topics.map((t, i) => (
          <li key={t.key}>
            {t.available ? (
              <Link href={`/${t.key}`} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-card-2">
                <span className="w-6 text-right font-mono text-xs text-muted">{i + 1}</span>
                <span className="flex-1 font-medium">{t.topic.title}</span>
                <StatusBadge topicKey={t.key} />
                <ChevronRight className="h-4 w-4 text-muted" />
              </Link>
            ) : (
              <div className="flex items-center gap-4 px-4 py-3 opacity-60" aria-disabled="true">
                <span className="w-6 text-right font-mono text-xs text-muted">{i + 1}</span>
                <span className="flex-1">{t.topic.title}</span>
                <span className="rounded-full border border-border px-2 text-[11px] text-muted">Planned</span>
              </div>
            )}
          </li>
        ))}
      </ol>
      <p className="text-xs text-muted">“Planned” topic এর পূর্ণ lesson এখনো লেখা হয়নি; অসম্পূর্ণ বা ফাঁকা page তৈরি করা হয়নি।</p>
    </div>
  );
}

export default function ModulePage({ params }: PageProps<"/[track]/[module]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-64 max-w-3xl animate-pulse rounded-xl border border-border bg-card" />}>
      <ModulePageContent params={params} />
    </Suspense>
  );
}
