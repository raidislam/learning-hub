# JS Learning Hub

**An interactive, Bangla-language JavaScript course you can read, run, and be tested on — from first variable to full-stack.**

> বাংলায় লেখা interactive JavaScript শেখার প্ল্যাটফর্ম। Theory পড়ুন, কোড লিখে চালান, visualizer এ দেখুন, তারপর নিজেকে যাচাই করুন। Technical term গুলো English এই থাকে।

This is **not** a documentation site or a blog. Every lesson is a page you can type into: edit the code, press **Run**, see real output, step through diagrams of what the engine is doing, solve exercises, and take a quiz. A topic only counts as *complete* when you can explain it, write it, debug it, and use it — opening the page is never enough.

---

## What it covers

Four learning tracks, 13 modules, **236 planned topics**:

| Track | Modules | Topics | Status |
|---|---|---|---|
| **Core JavaScript** | 01 Fundamentals · 02 Functions · 03 Objects & Arrays · 04 Advanced | 80 | Modules 01–02 **written** (32 lessons) |
| **Frontend JavaScript** | 05 Browser & DOM · 06 Browser APIs · 07 Real-world Frontend | 52 | Planned |
| **Backend JavaScript** | 08 Node.js · 09 Express.js · 10 Databases & Production | 61 | Planned |
| **DSA** | 11 Complexity · 12 Data Structures · 13 Algorithms (with visualizers) | 43 | Planned |

Plus a catalogue of **16 projects** (7 frontend, 6 backend, 3 full-stack) — guides are planned.

**Honest status:** only topics with a full lesson get a page. Everything else is shown as **Planned** in the module list. There are no empty "coming soon" pages.

### Written so far

- **Module 01 — Fundamentals (16):** What is JavaScript · Runtime · How it works in the browser · Engine · V8 · `var`/`let`/`const` · Data types · Primitive vs reference · Type conversion · Type coercion · Operators · `==` vs `===` · Truthy/falsy · Conditionals · Loops · Error handling
- **Module 02 — Functions (16):** Declarations · Expressions · Arrow functions · Parameters & arguments · Default parameters · Return · Callbacks · Higher-order functions · Pure functions · Closures · Lexical scope · Scope chain · Recursion · IIFE · `this` · `call`/`apply`/`bind`

---

## How it helps you learn

Built for a working frontend developer who wants *stronger fundamentals* and a path to full-stack — not a beginner "what is a variable" tutorial.

- **Understand the *why*, not just the syntax.** Each lesson explains what a thing is, why it exists, how it works internally, when to use it, and how it differs from look-alike concepts.
- **See it happen.** Step-through visualizers (play / pause / next / previous / reset / speed) show variables in memory, call stacks, scope-chain lookups, and `this` resolution.
- **Run real code, safely.** A live editor with Run, Reset, Clear, and sample selector. Output is compared against *expected output* for exercises.
- **Learn from mistakes.** Every lesson has a Debugging section: broken code you can run, why it fails, and the fix.
- **Prove you know it.** Exercises with hints and revealable solutions, then an assessment with explained wrong answers.
- **Real-world framing.** Examples and challenges are written like production frontend/backend code, with React and Node.js connections where relevant.

### Every lesson has the same 10 sections

1. **Concept** — what, why, when, how it works inside  
2. **Real-world analogy**  
3. **Visual explanation** — step-through diagrams  
4. **Code examples** — beginner, intermediate, real-world (all runnable)  
5. **Interactive playground** — with sample selector  
6. **Debugging** — common mistakes, why they fail, fixes  
7. **Practice** — 3 beginner + 2 intermediate + 1 real-world challenge  
8. **Assessment** — 5 MCQs + 2 coding questions  
9. **Interview questions** — with detailed answers  
10. **Summary** — takeaways, key syntax, when to use it, what to learn next  

### What "complete" means

A topic is complete only when **all** of these are true:

- ☑ I can **explain** it  
- ☑ I can **write** it from memory  
- ☑ I can **debug** it  
- ☑ I can **use** it in a practical task  
- ☑ I **passed the MCQ quiz** (≥ 80%)

Opening a page only marks it *in progress*.

### Suggested 2-hour daily session

| Minutes | Activity |
|---|---|
| 30 | Concept, analogy, visuals |
| 45 | Examples and playground experiments |
| 30 | Practice exercises / challenge |
| 15 | Assessment and revision |

---

## Other features

Dashboard with "next recommended lesson" · separate Core / Frontend / Backend / DSA sections with difficulty, prerequisites and progress · searchable topics (`Ctrl/⌘ + K`) · bookmarks and per-lesson notes · dark (default) and light themes · responsive layout with a table of contents and progress panel on desktop. Progress, bookmarks and notes are saved **in your browser's localStorage** (no account, no server; they stay on that browser).

---

## Is running code here safe?

Yes — your code **never runs in the app's own context** and `eval` is not used by the app. Each run happens in a hidden `<iframe sandbox="allow-scripts">` (opaque origin, no access to the page, cookies or storage) that executes the code inside a **Web Worker**. The run is killed after 5 seconds, so an infinite loop can't freeze the tab.

Limitations to know about: there is no DOM or `window` in the sandbox (so it behaves like a browser worker, not a page), no Node.js APIs (`require`, `process`, `fs`), and network access is limited to CORS-enabled URLs. Frontend (DOM) and Node.js execution environments are planned for their tracks.

---

## Quick start

Requires Node.js and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

```bash
pnpm build && pnpm start   # production build
pnpm lint                  # ESLint
pnpm verify:lessons        # check every lesson (see below)
```

---

## Tech stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · Zustand (persisted progress) · CodeMirror 6 (editor) · Lezer (syntax highlighting) · Lucide icons.

> This Next.js version has breaking changes from older releases. If you contribute, read the relevant guide in `node_modules/next/dist/docs/` first (see `AGENTS.md`).

## Project structure

```
app/                     Routes: /dashboard, /[track]/[module]/[topic], /projects, /assessments, /bookmarks
components/
  layout/ navigation/    App shell, sidebar, search, theme
  lessons/ editor/       Lesson renderer, playground, code editor
  visualizers/           Step-through visualizers (memory, flow diagrams)
  assessments/ progress/ Quiz, progress/bookmark UI
content/
  curriculum.ts          All tracks, modules and topics (the full 236-topic plan)
  lessons.ts             Registry of topics that have a written lesson
  core/<module>/<slug>.ts   Lesson content (typed data, no UI code)
lib/execution/           Sandboxed runner (iframe + Web Worker)
lib/progress/            Persisted progress store and completion rules
scripts/verify-lessons.mts   Lesson verifier
types/                   Curriculum and lesson schemas
```

Lesson content is plain typed data, separate from the UI, so adding a lesson never means touching components.

## Adding a lesson

1. Find the topic in `content/curriculum.ts` (its slug is the URL segment).
2. Create `content/<track>/<module>/<slug>.ts` exporting `lesson: Lesson` — copy `content/core/fundamentals/var-let-const.ts` as the quality reference and see `types/lesson.ts` for the schema.
3. Register it in `content/lessons.ts`.
4. Run `pnpm verify:lessons <file>` until it passes.

### The lesson verifier

`pnpm verify:lessons` checks that each lesson has the required structure (3 + 2 + 1 exercises, 5 MCQs with varied answers, 2 coding questions, three example levels, etc.) and **actually executes every code snippet** using the same worker code the browser uses. It confirms exercise solutions print exactly their expected output, examples and fixes don't crash, "broken" debugging code really misbehaves, and no lesson file is left unregistered. This is what keeps the lesson content accurate.

---

## Roadmap

- [x] App shell, dashboard, curriculum navigation, lesson template
- [x] Sandboxed code playground, step visualizers, progress, bookmarks, notes
- [x] Core JS Module 01 – Fundamentals
- [x] Core JS Module 02 – Functions
- [ ] Core JS Module 03 – Objects & Arrays, Module 04 – Advanced
- [ ] Frontend track (adds a DOM sandbox)
- [ ] Backend track (adds a Node-like sandbox)
- [ ] DSA track with algorithm visualizers
- [ ] Projects, assessments overview, learning roadmap page
- [ ] Full QA pass (all routes, mobile/tablet, accessibility)
