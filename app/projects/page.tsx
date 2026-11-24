import type { Metadata } from "next";
import { Pill } from "@/components/ui/Badge";
import { PROJECTS } from "@/content/projects";

export const metadata: Metadata = { title: "Projects" };

const GROUPS = [
  { kind: "frontend", title: "Frontend Projects" },
  { kind: "backend", title: "Backend Projects" },
  { kind: "fullstack", title: "Full-Stack Projects" },
] as const;

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="mt-2 max-w-2xl text-muted-fg">
          Project-based শেখার তালিকা। প্রতিটি project এর পূর্ণ guide (requirements, architecture, folder structure, step-by-step, API/DB design, testing, deployment) Phase 6 এ যুক্ত হবে — তার আগে
          প্রয়োজনীয় module শেষ করা উচিত।
        </p>
      </header>
      {GROUPS.map((g) => (
        <section key={g.kind}>
          <h2 className="mb-3 font-semibold">{g.title}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PROJECTS.filter((p) => p.kind === g.kind).map((p) => (
              <li key={p.slug} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium">{p.title}</h3>
                  <span className="rounded-full border border-border px-2 text-[11px] text-muted">Planned</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.skills.map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
