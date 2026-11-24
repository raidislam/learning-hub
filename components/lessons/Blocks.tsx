import { AlertTriangle, Info, Lightbulb, ShieldAlert } from "lucide-react";
import type { Block } from "@/types/lesson";
import { cn } from "@/lib/utilities/cn";
import { CodeBlock } from "./CodeBlock";
import { Inline } from "./Inline";

const TONE = {
  info: { icon: Info, cls: "border-primary/40 bg-primary/10", label: "মনে রাখুন" },
  tip: { icon: Lightbulb, cls: "border-success/40 bg-success/10", label: "Tip" },
  warn: { icon: AlertTriangle, cls: "border-warn/40 bg-warn/10", label: "সতর্কতা" },
  danger: { icon: ShieldAlert, cls: "border-danger/40 bg-danger/10", label: "Security / ঝুঁকি" },
} as const;

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-bn">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i}>
                <Inline text={b.text} />
              </p>
            );
          case "h3":
            return (
              <h3 key={i} className="mb-2 mt-6 text-base font-semibold">
                <Inline text={b.text} />
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="mb-4 list-disc space-y-1.5 pl-6 marker:text-muted">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Inline text={it} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="mb-4 list-decimal space-y-1.5 pl-6 marker:text-muted">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Inline text={it} />
                  </li>
                ))}
              </ol>
            );
          case "code":
            return <CodeBlock key={i} code={b.code} caption={b.caption} />;
          case "callout": {
            const t = TONE[b.tone];
            return (
              <aside key={i} className={cn("my-4 flex gap-3 rounded-xl border p-4", t.cls)}>
                <t.icon className="mt-1 h-4 w-4 shrink-0" />
                <div className="text-sm">
                  <p className="mb-1 font-semibold">{b.title ? <Inline text={b.title} /> : t.label}</p>
                  <p className="m-0">
                    <Inline text={b.text} />
                  </p>
                </div>
              </aside>
            );
          }
          case "compare":
            return (
              <div key={i} className="my-4 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="bg-card-2 text-xs uppercase tracking-wide text-muted-fg">
                    <tr>
                      {b.headers.map((h, j) => (
                        <th key={j} className="px-4 py-2 font-semibold">
                          <Inline text={h} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {b.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((c, ci) => (
                          <td key={ci} className={cn("px-4 py-2 align-top", ci === 0 && "font-medium")}>
                            <Inline text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
