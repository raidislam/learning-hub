import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/Badge";
import { LessonRail } from "@/components/lessons/LessonRail";
import { BookmarkButton, VisitTracker } from "@/components/lessons/LessonTools";
import { LessonView, SECTIONS } from "@/components/lessons/LessonView";
import { StatusBadge } from "@/components/progress/StatusBadge";
import { lessonLoaders } from "@/content/lessons";
import { findModuleById, getTopic, lessonKeys, nextAvailable, topicKey } from "@/lib/curriculum";

export function generateStaticParams() {
  return lessonKeys().map((k) => {
    const [track, module, topic] = k.split("/");
    // Fail the build if a registered lesson has no matching curriculum topic.
    if (!getTopic(track, module, topic)) throw new Error(`Lesson "${k}" is not in the curriculum — check its slug in content/curriculum.ts`);
    return { track, module, topic };
  });
}

export async function generateMetadata({ params }: PageProps<"/[track]/[module]/[topic]">): Promise<Metadata> {
  const { track, module, topic } = await params;
  const found = getTopic(track, module, topic);
  return { title: found?.topic.title ?? "Not found" };
}

async function TopicPageContent({ params }: Pick<PageProps<"/[track]/[module]/[topic]">, "params">) {
  const { track: ts, module: ms, topic: tp } = await params;
  const found = getTopic(ts, ms, tp);
  const key = topicKey(ts, ms, tp);
  const loader = lessonLoaders[key];
  if (!found || !loader) notFound();

  const { lesson } = await loader();
  const { track, module, topic } = found;
  const next = nextAvailable(key);

  const prerequisites = module.prerequisites.flatMap((id) => {
    const p = findModuleById(id);
    return p ? [{ href: `/${p.track.slug}/${p.module.slug}`, label: `Module ${String(p.module.number).padStart(2, "0")} · ${p.module.title}` }] : [];
  });

  return (
    <div className="mx-auto flex max-w-6xl gap-10">
      <VisitTracker topicKey={key} />
      <article className="min-w-0 max-w-3xl flex-1">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted">
          <Link href={`/${track.slug}`} className="hover:text-foreground">
            {track.shortTitle}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/${track.slug}/${module.slug}`} className="hover:text-foreground">
            Module {String(module.number).padStart(2, "0")} · {module.title}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{topic.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <DifficultyBadge level={module.difficulty} />
            <StatusBadge topicKey={key} />
            <span className="flex-1" />
            <BookmarkButton topicKey={key} />
          </div>
        </header>
        <LessonView lesson={lesson} topicKey={key} />
        {next && (
          <Link href={`/${next.key}`} className="mt-10 flex items-center justify-between rounded-xl border border-primary/40 bg-accent p-5 hover:border-primary">
            <span>
              <span className="block text-xs text-muted">Next topic</span>
              <span className="font-semibold">{next.topic.title}</span>
            </span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        )}
      </article>
      <LessonRail
        topicKey={key}
        toc={SECTIONS}
        prerequisites={prerequisites}
        next={next ? { href: `/${next.key}`, label: next.topic.title, sub: next.module.title } : undefined}
      />
    </div>
  );
}

export default function TopicPage({ params }: PageProps<"/[track]/[module]/[topic]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-64 max-w-3xl animate-pulse rounded-xl border border-border bg-card" />}>
      <TopicPageContent params={params} />
    </Suspense>
  );
}
