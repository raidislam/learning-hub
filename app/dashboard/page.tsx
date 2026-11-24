import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Brain, Code2, ClipboardCheck, RotateCcw } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/Badge";
import { NextUp } from "@/components/progress/NextUp";
import { TrackProgress } from "@/components/progress/TrackProgress";
import { flatTopics, TRACKS } from "@/lib/curriculum";

export const metadata: Metadata = { title: "Dashboard" };

const SESSION = [
  { min: 30, title: "Concept", desc: "Lesson এর Concept, Analogy ও Visual অংশ মন দিয়ে পড়ুন", icon: Brain, tone: "text-primary" },
  { min: 45, title: "Coding & experiment", desc: "Examples ও Playground এ কোড বদলে বদলে চালান", icon: Code2, tone: "text-success" },
  { min: 30, title: "Practical task", desc: "Practice exercise ও real-world challenge solve করুন", icon: ClipboardCheck, tone: "text-warn" },
  { min: 15, title: "Revision & assessment", desc: "MCQ দিন, ভুল উত্তরের ব্যাখ্যা পড়ুন, notes লিখুন", icon: RotateCcw, tone: "text-danger" },
];

export default function DashboardPage() {
  const all = flatTopics();
  const written = all.filter((t) => t.available).length;

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">স্বাগতম 👋</h1>
        <p className="mt-2 max-w-2xl text-muted-fg">
          এটি একটি interactive JavaScript শেখার বই — পড়ুন, কোড লিখে চালান, visualizer এ দেখুন, তারপর নিজেকে যাচাই করুন। একটি topic তখনই complete হয় যখন আপনি সেটি{" "}
          <strong className="text-foreground">explain, write, debug এবং practical কাজে ব্যবহার</strong> করতে পারেন এবং assessment pass করেন।
        </p>
      </section>

      <NextUp />

      <section aria-labelledby="tracks">
        <h2 id="tracks" className="mb-4 text-lg font-semibold">
          Learning tracks
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {TRACKS.map((t) => {
            const topics = flatTopics(t);
            return (
              <Link key={t.id} href={`/${t.slug}`} className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/60">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold">{t.title}</h3>
                  <ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-primary" />
                </div>
                <p className="line-clamp-3 text-sm text-muted-fg">{t.summary}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <DifficultyBadge level={t.difficulty} />
                  <span>{t.modules.length} modules</span>
                  <span>· {topics.length} topics</span>
                </div>
                <TrackProgress track={t} />
              </Link>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted">
          Curriculum তে মোট {all.length} টি topic নির্ধারিত; এখন পর্যন্ত {written} টির পূর্ণ lesson লেখা হয়েছে। বাকিগুলো module page এ “Planned” হিসেবে দেখানো আছে — কোনো ফাঁকা lesson নেই।
        </p>
      </section>

      <section aria-labelledby="daily">
        <h2 id="daily" className="mb-1 text-lg font-semibold">
          দৈনিক ২ ঘণ্টার session
        </h2>
        <p className="mb-4 text-sm text-muted-fg">তাড়াহুড়ো নয় — প্রতিদিন একটি বা দুটি topic, নিয়মিতভাবে।</p>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SESSION.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <s.icon className={`h-5 w-5 ${s.tone}`} />
                <span className="font-mono text-xs text-muted">
                  {i + 1} · {s.min} min
                </span>
              </div>
              <p className="font-medium">{s.title}</p>
              <p className="mt-1 text-sm text-muted-fg">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
