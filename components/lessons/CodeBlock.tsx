import { highlightTree, classHighlighter } from "@lezer/highlight";
import { parser } from "@lezer/javascript";
import { cn } from "@/lib/utilities/cn";
import { Inline } from "./Inline";

/** Server-rendered, syntax-highlighted code (no client JS). */
export function highlightToNodes(code: string): React.ReactNode[] {
  const tree = parser.parse(code);
  const out: React.ReactNode[] = [];
  let pos = 0;
  let k = 0;
  highlightTree(tree, classHighlighter, (from, to, cls) => {
    if (from > pos) out.push(code.slice(pos, from));
    out.push(
      <span key={k++} className={cls}>
        {code.slice(from, to)}
      </span>,
    );
    pos = to;
  });
  if (pos < code.length) out.push(code.slice(pos));
  return out;
}

export function CodeBlock({ code, caption, className }: { code: string; caption?: string; className?: string }) {
  return (
    <figure className={cn("my-4 overflow-hidden rounded-xl border border-border bg-code", className)}>
      {caption && <figcaption className="border-b border-border px-4 py-1.5 text-xs text-muted"><Inline text={caption} /></figcaption>}
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6" tabIndex={0}>
        <code>{highlightToNodes(code.replace(/\n$/, ""))}</code>
      </pre>
    </figure>
  );
}
