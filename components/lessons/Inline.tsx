import { Fragment } from "react";

/** Renders tiny inline markup: **bold** and `code`. Safe: builds React nodes, never raw HTML. */
export function Inline({ text }: { text: string }) {
  // bold may contain code spans: **a `b` c**
  const parts = text.split(/(\*\*(?:[^*`]|`[^`]*`)+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}><Inline text={p.slice(2, -2)} /></strong>;
        if (p.startsWith("`") && p.endsWith("`")) return <code key={i} className="inline-code">{p.slice(1, -1)}</code>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
