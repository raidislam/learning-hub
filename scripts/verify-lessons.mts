/**
 * Verifies lesson content: structure + executes every snippet through the REAL sandbox worker code
 * (lib/execution/sandboxScripts.ts workerMain) inside a Node vm, so output formatting matches the browser.
 *
 *   node scripts/verify-lessons.mts                    # all lessons
 *   node scripts/verify-lessons.mts content/core/fundamentals/loops.ts ...
 *
 * Rules enforced:
 *  - exercise/coding `solution` must be a COMPLETE program (include any context from `starter`) and print exactly `expected`
 *  - `examples`, `playground` samples and `debugging[].fix` must not throw an uncaught error
 *  - `debugging[].bad` should misbehave (throw, or differ from fix output)
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { pathToFileURL } from "node:url";
import { workerMain } from "../lib/execution/sandboxScripts.ts";

interface Result { out: string; err: string | null; timedOut: boolean }

function runInWorker(code: string, ms = 4000): Promise<Result> {
  return new Promise((resolve) => {
    const msgs: any[] = [];
    const ctx: any = vm.createContext({
      setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, structuredClone,
      URL, URLSearchParams, TextEncoder, TextDecoder, console: {},
    });
    vm.runInContext("globalThis.self = globalThis;", ctx);
    ctx.postMessage = (m: any) => {
      msgs.push(m);
      if (m.t === "done") finish(false);
    };
    ctx.addEventListener = () => {};
    let done = false;
    const finish = (timedOut: boolean) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      const out = msgs.filter((m) => m.t === "log" && m.level === "log").map((m) => m.text).join("\n");
      const e = msgs.find((m) => m.t === "error");
      resolve({ out, err: e ? `${e.name}: ${e.message}` : timedOut ? "TIMEOUT" : null, timedOut });
    };
    const timer = setTimeout(() => finish(true), ms);
    vm.runInContext(`(${workerMain.toString()})()`, ctx);
    ctx.onmessage({ data: { code } });
  });
}

const norm = (s: string) => s.replace(/\r\n/g, "\n").split("\n").map((l) => l.trimEnd()).join("\n").trim();

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith(".ts") ? [path.join(dir, d.name)] : []));
}

const args = process.argv.slice(2);
const files = args.length ? args : walk("content").filter((f) => !/curriculum|lessons\.ts|projects/.test(f));
let failures = 0;
const fail = (f: string, msg: string) => { failures++; console.log(`  ✖ ${msg}`); };

for (const file of files) {
  console.log(`\n${file}`);
  const { lesson: L } = await import(pathToFileURL(path.resolve(file)).href);
  if (!L) { fail(file, "no `lesson` export"); continue; }

  // ---- registered?
  const slug = path.basename(file, ".ts");
  if (!fs.readFileSync("content/lessons.ts", "utf8").includes(`/${slug}"`)) fail(file, "lesson file is not registered in content/lessons.ts");

  // ---- structure
  if (!(L.objectives?.length >= 3)) fail(file, "need >=3 objectives");
  if (!(L.concept?.length >= 5)) fail(file, "concept too shallow (<5 blocks)");
  if (!(L.analogy?.length >= 1)) fail(file, "analogy missing");
  if (!(L.visuals?.length >= 1)) fail(file, "need >=1 visual");
  for (const v of L.visuals ?? []) {
    if (v.kind === "memory-steps") {
      const n = v.code.split("\n").length;
      v.steps.forEach((s: any, i: number) => { if (s.line < -1 || s.line >= n) fail(file, `visual "${v.title}" step ${i}: line ${s.line} out of range`); });
    } else if (v.kind === "flow-steps") {
      const ids = new Set(v.nodes.map((n: any) => n.id));
      v.steps.forEach((s: any, i: number) => {
        for (const a of s.active) if (!ids.has(a)) fail(file, `visual "${v.title}" step ${i}: unknown node ${a}`);
        for (const k of Object.keys(s.items ?? {})) if (!ids.has(k)) fail(file, `visual "${v.title}" step ${i}: items for unknown node ${k}`);
      });
    } else fail(file, `unknown visual kind ${v.kind}`);
    if (v.steps.length < 3) fail(file, `visual "${v.title}" needs >=3 steps`);
  }
  const lv = (L.examples ?? []).map((e: any) => e.level).join(",");
  if (lv !== "beginner,intermediate,real-world") fail(file, `examples must be beginner,intermediate,real-world (got ${lv})`);
  if (!(L.playground?.length >= 2)) fail(file, "need >=2 playground samples");
  if (!(L.debugging?.length >= 3)) fail(file, "need >=3 debugging cases");
  const pl = (L.practice ?? []).map((p: any) => p.level).join(",");
  if (pl !== "beginner,beginner,beginner,intermediate,intermediate,challenge") fail(file, `practice must be 3 beginner, 2 intermediate, 1 challenge in order (got ${pl})`);
  if (L.assessment?.mcqs?.length !== 5) fail(file, "need exactly 5 MCQs");
  L.assessment?.mcqs?.forEach((q: any, i: number) => {
    if (q.options.length < 3 || q.answer < 0 || q.answer >= q.options.length) fail(file, `mcq ${i}: bad answer index`);
    if (!q.explanation || q.explanation.length < 40) fail(file, `mcq ${i}: explanation too short`);
  });
  const answers = L.assessment?.mcqs?.map((q: any) => q.answer) ?? [];
  if (new Set(answers).size < 2) fail(file, `all MCQ answers are the same index (${answers}) — vary them`);
  if (L.assessment?.coding?.length !== 2) fail(file, "need exactly 2 coding questions");
  if (!(L.interview?.length >= 5)) fail(file, "need >=5 interview Qs");
  for (const q of L.interview ?? []) if (q.a.length < 150) fail(file, `interview answer too short: ${q.q}`);
  const S = L.summary;
  if (!(S?.takeaways?.length >= 4 && S.syntax && S.whenToUse?.length >= 2 && S.next?.length >= 2)) fail(file, "summary incomplete");
  if (!L.compatibility) fail(file, "compatibility note missing (browser vs Node)");

  // ---- execution
  const check = async (label: string, code: string, expected?: string) => {
    const r = await runInWorker(code);
    if (expected !== undefined) {
      if (r.err || norm(r.out) !== norm(expected)) fail(file, `${label}: expected ${JSON.stringify(expected)} got ${JSON.stringify(r.out)}${r.err ? " ERR " + r.err : ""}`);
      else console.log(`  ✔ ${label}`);
    } else if (r.err) fail(file, `${label}: threw ${r.err}`);
    else console.log(`  ✔ ${label} -> ${JSON.stringify(r.out).slice(0, 90)}`);
    return r;
  };
  for (const [i, p] of (L.practice ?? []).entries()) await check(`practice ${i + 1} solution`, p.solution, p.expected);
  for (const [i, c] of (L.assessment?.coding ?? []).entries()) await check(`coding ${i + 1} solution`, c.solution, c.expected);
  for (const [i, e] of (L.examples ?? []).entries()) await check(`example ${i + 1}`, e.code);
  for (const [i, s] of (L.playground ?? []).entries()) await check(`playground "${s.label}"`, s.code);
  for (const [i, d] of (L.debugging ?? []).entries()) {
    const fix = await check(`debug ${i + 1} fix`, d.fix);
    const bad = await runInWorker(d.bad);
    if (!bad.err && norm(bad.out) === norm(fix.out)) fail(file, `debug ${i + 1}: bad code behaves identically to fix`);
    else console.log(`  ✔ debug ${i + 1} bad -> ${bad.err ?? JSON.stringify(bad.out).slice(0, 60)}`);
  }
  for (const [i, p] of (L.practice ?? []).entries()) {
    const r = await runInWorker(p.starter);
    if (!r.err && norm(r.out) === norm(p.expected)) fail(file, `practice ${i + 1}: starter already passes — exercise is trivial`);
  }
}

console.log(failures ? `\n✖ ${failures} problem(s)` : "\n✔ all lessons verified");
process.exit(failures ? 1 : 0);
