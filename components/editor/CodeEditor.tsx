"use client";

import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { bracketMatching, indentOnInput, syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { useEffect, useRef, useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}
const getTheme = () => document.documentElement.getAttribute("data-theme") ?? "dark";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
  minHeight?: number;
  ariaLabel?: string;
}

/** CodeMirror 6 editor. Only edits text — it never executes anything. */
export function CodeEditor({ value, onChange, onRun, minHeight = 180, ariaLabel = "JavaScript code editor" }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const cb = useRef({ onChange, onRun });
  useEffect(() => {
    cb.current = { onChange, onRun };
  });
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");

  useEffect(() => {
    if (!host.current) return;
    const v = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          history(),
          indentOnInput(),
          bracketMatching(),
          highlightActiveLine(),
          javascript(),
          theme === "dark" ? oneDark : syntaxHighlighting(defaultHighlightStyle),
          keymap.of([
            { key: "Mod-Enter", run: () => (cb.current.onRun?.(), true) },
            indentWithTab,
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) cb.current.onChange(u.state.doc.toString());
          }),
          EditorView.theme({ "&": { minHeight: `${minHeight}px`, fontSize: "13px" }, ".cm-scroller": { overflow: "auto" } }),
        ],
      }),
    });
    view.current = v;
    return () => v.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // external changes (Reset / sample selector)
  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
    }
  }, [value]);

  return <div ref={host} className="overflow-hidden" />;
}
