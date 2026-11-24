import { Target } from "lucide-react";
import { Playground } from "@/components/editor/Playground";
import { Quiz } from "@/components/assessments/Quiz";
import { Visual } from "@/components/visualizers/Visual";
import { Pill } from "@/components/ui/Badge";
import type { Lesson } from "@/types/lesson";
import { Blocks } from "./Blocks";
import { CodeBlock } from "./CodeBlock";
import { ExerciseCard } from "./Exercise";
import { Inline } from "./Inline";
import { CompletionChecklist, NotesPanel } from "./LessonTools";
import type { TocItem } from "./LessonRail";

export const SECTIONS: TocItem[] = [
  { id: "concept", title: "১. Concept" },
  { id: "analogy", title: "২. Real-World Analogy" },
  { id: "visual", title: "৩. Visual Explanation" },
  { id: "examples", title: "৪. Code Examples" },
  { id: "playground", title: "৫. Interactive Playground" },
  { id: "debugging", title: "৬. Debugging" },
  { id: "practice", title: "৭. Practice" },
  { id: "assessment", title: "৮. Assessment" },
  { id: "interview", title: "৯. Interview Questions" },
  { id: "summary", title: "১০. Summary" },
];

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  const s = SECTIONS.find((x) => x.id === id)!;
  return (
    <section id={id} className="scroll-mt-20 border-t border-border pt-8" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="mb-4 text-xl font-bold tracking-tight">
        {s.title}
      </h2>
      {children}
    </section>
  );
}

const LEVEL = { beginner: "Beginner", intermediate: "Intermediate", "real-world": "Real-world" } as const;

export function LessonView({ lesson, topicKey }: { lesson: Lesson; topicKey: string }) {
  const ex = lesson.practice;
  return (
    <div className="space-y-10">
      <aside className="rounded-xl border border-primary/30 bg-accent p-5">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Target className="h-4 w-4 text-primary" /> Learning objectives
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm marker:text-primary">
          {lesson.objectives.map((o, i) => (
            <li key={i}>
              <Inline text={o} />
            </li>
          ))}
        </ul>
      </aside>

      <Section id="concept">
        <Blocks blocks={lesson.concept} />
        {lesson.compatibility && (
          <Blocks blocks={[{ type: "callout", tone: "info", title: "Browser vs Node.js compatibility", text: lesson.compatibility }]} />
        )}
      </Section>

      <Section id="analogy">
        <Blocks blocks={lesson.analogy} />
      </Section>

      <Section id="visual">
        {lesson.visuals.map((v, i) => (
          <Visual key={i} spec={v} />
        ))}
      </Section>

      <Section id="examples">
        <p className="mb-3 text-sm text-muted-fg">প্রতিটি example চালানো যায় — কোড বদলে কী হয় দেখুন।</p>
        {lesson.examples.map((e, i) => (
          <article key={i} className="mb-6">
            <div className="mb-1 flex items-center gap-2">
              <Pill>{LEVEL[e.level]}</Pill>
              <h3 className="font-semibold"><Inline text={e.title} /></h3>
            </div>
            <p className="text-sm text-muted-fg">
              <Inline text={e.description} />
            </p>
            <Playground initialCode={e.code} title={`Example · ${LEVEL[e.level]}`} minHeight={100} />
          </article>
        ))}
      </Section>

      <Section id="playground">
        <p className="mb-2 text-sm text-muted-fg">
          নিজের মতো কোড লিখুন বা Sample বাছাই করুন। কোড একটি <strong>sandboxed iframe এর ভেতরের Web Worker</strong> এ চলে, আপনার app বা browser data এর নাগাল পায় না।
        </p>
        <Playground initialCode={lesson.playground[0].code} samples={lesson.playground} minHeight={220} />
        <details className="rounded-lg border border-border bg-card px-4 py-2 text-sm">
          <summary className="font-medium">Execution limitations (জেনে রাখুন)</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-fg">
            <li>কোড Web Worker এ চলে — তাই <code className="inline-code">document</code>, <code className="inline-code">window</code>, DOM নেই (DOM lesson এ আলাদা environment আসবে)।</li>
            <li>Node.js এর <code className="inline-code">require</code>, <code className="inline-code">process</code>, <code className="inline-code">fs</code> নেই — এটি browser-এর মতো environment।</li>
            <li>৫ সেকেন্ডের বেশি চললে (অসীম loop সহ) execution জোর করে বন্ধ হয়।</li>
            <li>Network request শুধু CORS অনুমোদিত https/http URL এ কাজ করে; sandbox এর origin “null”।</li>
            <li>Top-level <code className="inline-code">await</code> ব্যবহার করা যায়। Output {"≤"} ১০০০ লাইন।</li>
            <li>Object print করার format Node.js এর মতো, কিন্তু লম্বা line wrap হয় না।</li>
          </ul>
        </details>
      </Section>

      <Section id="debugging">
        <p className="mb-3 text-sm text-muted-fg">সাধারণ ভুলগুলো চালিয়ে দেখুন, কেন ব্যর্থ হয় বুঝুন, তারপর fix টি দেখুন।</p>
        {lesson.debugging.map((d, i) => (
          <article key={i} className="mb-8">
            <h3 className="mb-2 font-semibold">
              🐞 {i + 1}. <Inline text={d.title} />
            </h3>
            <Playground initialCode={d.bad} title="❌ ভুল কোড" minHeight={80} />
            <div className="rounded-xl border border-warn/40 bg-warn/10 p-4 text-sm">
              <p className="mb-1 font-semibold">কেন ব্যর্থ হয়?</p>
              <p className="m-0">
                <Inline text={d.why} />
              </p>
            </div>
            <p className="mb-0 mt-3 text-sm font-semibold text-success">✅ সঠিক সমাধান</p>
            <CodeBlock code={d.fix} />
          </article>
        ))}
      </Section>

      <Section id="practice">
        <p className="mb-2 text-sm text-muted-fg">৩টি Beginner, ২টি Intermediate এবং ১টি real-world challenge। আগে hint, তারপর solution।</p>
        {ex.map((e, i) => (
          <ExerciseCard key={i} ex={e} index={i} />
        ))}
      </Section>

      <Section id="assessment">
        <Quiz topicKey={topicKey} mcqs={lesson.assessment.mcqs} coding={lesson.assessment.coding} />
      </Section>

      <Section id="interview">
        <div className="space-y-3">
          {lesson.interview.map((q, i) => (
            <details key={i} className="group rounded-xl border border-border bg-card px-4 py-3">
              <summary className="font-medium marker:content-none">
                <span className="mr-2 text-primary">Q{i + 1}.</span>
                <Inline text={q.q} />
              </summary>
              <div className="prose-bn mt-3 border-t border-border pt-3 text-sm">
                {q.a.split("\n\n").map((para, j) => (
                  <p key={j}>
                    <Inline text={para} />
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section id="summary">
        <h3 className="mb-2 font-semibold">Key takeaways</h3>
        <ul className="mb-5 list-disc space-y-1.5 pl-6 marker:text-primary">
          {lesson.summary.takeaways.map((t, i) => (
            <li key={i}>
              <Inline text={t} />
            </li>
          ))}
        </ul>
        <h3 className="mb-1 font-semibold">Important syntax</h3>
        <CodeBlock code={lesson.summary.syntax} />
        <h3 className="mb-2 mt-5 font-semibold">কখন ব্যবহার করবেন</h3>
        <ul className="mb-5 list-disc space-y-1.5 pl-6 marker:text-primary">
          {lesson.summary.whenToUse.map((t, i) => (
            <li key={i}>
              <Inline text={t} />
            </li>
          ))}
        </ul>
        <h3 className="mb-2 font-semibold">এরপর কী শিখবেন</h3>
        <ul className="mb-6 list-disc space-y-1.5 pl-6 marker:text-primary">
          {lesson.summary.next.map((t, i) => (
            <li key={i}>
              <Inline text={t} />
            </li>
          ))}
        </ul>
        <div className="grid gap-4 md:grid-cols-2">
          <CompletionChecklist topicKey={topicKey} />
          <NotesPanel topicKey={topicKey} />
        </div>
      </Section>
    </div>
  );
}
