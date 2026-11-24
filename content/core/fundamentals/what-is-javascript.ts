import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "JavaScript আসলে কী, কেন তৈরি হয়েছে এবং **ECMAScript** (ভাষার spec) ও **host environment** (browser / Node.js) এর পার্থক্য বুঝিয়ে বলতে পারবেন।",
    "JavaScript এর মূল বৈশিষ্ট্য — dynamic typing, first-class function, prototype-based object, multi-paradigm — নিজের কোডে চিনতে ও কাজে লাগাতে পারবেন।",
    "কোন জিনিস ভাষার অংশ (`Array`, `Promise`) আর কোনটি host এর দেওয়া (`document`, `fetch`, `setTimeout`) তা আলাদা করতে পারবেন।",
    "Browser JavaScript ও Node.js JavaScript কোথায় একই আর কোথায় আলাদা — তা বলতে পারবেন।",
    "`typeof null`, `\"5\" + 3` এর মতো প্রচলিত ভুল ধারণা ও coercion এর ফাঁদ চিনে নিরাপদ কোড লিখতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "JavaScript আসলে কী?" },
    {
      type: "p",
      text: "JavaScript একটি **high-level, dynamically typed, multi-paradigm programming language**। একে সংক্ষেপে এভাবে ভাঙা যায়: *high-level* মানে memory allocation বা CPU register নিয়ে আপনাকে ভাবতে হয় না, engine সেটা সামলায়; *dynamically typed* মানে type variable এর সাথে নয়, **মানের (value) সাথে** জুড়ে থাকে এবং runtime এ নির্ধারিত হয়; *multi-paradigm* মানে procedural, object-oriented (prototype ভিত্তিক) ও functional — তিন ধরনের স্টাইলেই লেখা যায়।",
    },
    {
      type: "p",
      text: "ভাষাটি ১৯৯৫ সালে Netscape Navigator এর জন্য তৈরি হয়েছিল — উদ্দেশ্য ছিল web page কে ‘জীবন্ত’ করা: form validate করা, button এ click হলে কিছু ঘটানো, page না বদলেই কিছু অংশ আপডেট করা। শুরুর সেই ছোট scripting ভাষা আজ browser ছাড়িয়ে server (Node.js, Deno, Bun), mobile, desktop app, এমনকি IoT পর্যন্ত পৌঁছেছে।",
    },
    {
      type: "callout",
      tone: "info",
      title: "ভুল ধারণা ১: ‘JavaScript হলো Java এর সহজ সংস্করণ’",
      text: "দুটি সম্পূর্ণ আলাদা ভাষা। নামের মিলটি ছিল মূলত তখনকার marketing সিদ্ধান্ত। Java হলো class-ভিত্তিক, statically typed ভাষা যা সাধারণত compile হয়ে JVM এ চলে। JavaScript এর type ও object মডেল আলাদা (prototype-based), আর এর syntax এ C-পরিবারের ছাপ থাকলেও ভেতরের নকশা ভিন্ন।",
    },
    { type: "h3", text: "ভাষা বনাম পরিবেশ: ECMAScript ও Host Environment" },
    {
      type: "p",
      text: "এটি এই lesson এর সবচেয়ে গুরুত্বপূর্ণ ধারণা। আপনি যাকে ‘JavaScript’ বলেন তা আসলে দুটি স্তরের মিশ্রণ:",
    },
    {
      type: "ul",
      items: [
        "**ECMAScript (ECMA-262)** — ভাষার আনুষ্ঠানিক specification। এখানে syntax, `let`/`const`, function, `Array`, `Map`, `Promise`, `Object`, `JSON`, `Math`, `Intl` ইত্যাদি সংজ্ঞায়িত। এটি maintain করে **TC39** কমিটি, এবং প্রতি বছর একটি নতুন সংস্করণ প্রকাশিত হয় (ES2015, ES2016, … ES2023 …)।",
        "**Host environment** — ECMAScript কে যে পরিবেশ চালায়। Browser দেয় `document`, `window`, DOM event, `fetch`, `localStorage`। Node.js দেয় `fs`, `process`, `require`/`import` সিস্টেম, `Buffer`। ECMAScript নিজে এগুলোর কিছুই জানে না।",
        "**JavaScript engine** — spec কে বাস্তবে চালায় এমন প্রোগ্রাম: V8 (Chrome, Node.js, Deno), SpiderMonkey (Firefox), JavaScriptCore (Safari)। Engine কোড parse ও execute করে এবং host কে ‘সংযোগের জায়গা’ দেয়।",
      ],
    },
    {
      type: "compare",
      headers: ["বিষয়", "ভাষার অংশ (ECMAScript)", "Host এর অংশ"],
      rows: [
        ["উদাহরণ", "`Array`, `Map`, `Promise`, `JSON`, `Math`, `Intl`", "`document`, `window`, `fetch`, `localStorage` (browser); `fs`, `process`, `Buffer` (Node.js)"],
        ["কে সংজ্ঞায়িত করে", "TC39 / ECMA-262", "Browser এর ক্ষেত্রে WHATWG/W3C spec; Node.js এর নিজস্ব documentation"],
        ["কোথায় পাবেন", "প্রায় সব JavaScript পরিবেশে একই", "পরিবেশ ভেদে আলাদা"],
        ["`setTimeout`", "Spec এর অংশ নয়", "Browser ও Node.js দুটিই নিজের মতো করে দেয় (আচরণ মোটামুটি মেলে, তবে নিখুঁত একই নয়)"],
      ],
    },
    { type: "h3", text: "Browser JavaScript বনাম Node.js" },
    {
      type: "p",
      text: "ভাষা এক হলেও দুই পরিবেশে ‘হাতের যন্ত্রপাতি’ আলাদা। Browser এ কোড একটি sandbox এ চলে — আপনার file system এ সরাসরি হাত দিতে পারে না, কিন্তু DOM পরিবর্তন করতে পারে। Node.js এ DOM নেই, কিন্তু file, network socket, process সবই নিয়ন্ত্রণ করা যায়।",
    },
    {
      type: "compare",
      headers: ["বৈশিষ্ট্য", "Browser", "Node.js"],
      rows: [
        ["Global object", "`window` (এবং `globalThis`)", "`globalThis` (`global` নামেও পাওয়া যায়)"],
        ["DOM / `document`", "আছে", "নেই"],
        ["File system", "সরাসরি নেই (নিরাপত্তার কারণে)", "`node:fs` module দিয়ে আছে"],
        ["Module system", "ES Modules (`<script type=\"module\">`)", "ES Modules ও CommonJS (`require`) দুটিই"],
        ["Network", "`fetch`, WebSocket, same-origin/CORS নিয়ম প্রযোজ্য", "`fetch` (আধুনিক সংস্করণে), `node:http` ইত্যাদি; CORS প্রযোজ্য নয়"],
        ["এই platform এর Playground", "Web Worker এ চলে — DOM নেই, `window` নেই", "—"],
      ],
    },
    {
      type: "code",
      caption: "শুধু browser এ (এই Playground এ চলবে না — এটি ব্যাখ্যার জন্য)",
      code: `// DOM হলো browser host এর API — ECMAScript এর অংশ নয়
const title = document.querySelector("h1");
title.textContent = "Hello from the browser";`,
    },
    {
      type: "code",
      caption: "শুধু Node.js এ (এই Playground এ চলবে না — এটি ব্যাখ্যার জন্য)",
      code: `// file system হলো Node.js host এর API
import { readFile } from "node:fs/promises";
const text = await readFile("./notes.txt", "utf8");
console.log(text.length);`,
    },
    { type: "h3", text: "JavaScript এর মূল বৈশিষ্ট্য — কেন এগুলো গুরুত্বপূর্ণ" },
    {
      type: "ul",
      items: [
        "**Dynamic typing:** `let x = 1; x = \"one\";` বৈধ। সুবিধা — দ্রুত লেখা ও নমনীয়তা; অসুবিধা — type ভুল runtime এ ধরা পড়ে। এই কারণেই বড় প্রজেক্টে TypeScript ও lint ব্যবহার হয়।",
        "**First-class function:** function হলো সাধারণ মান — variable এ রাখা, argument হিসেবে পাঠানো, return করা যায়। এ কারণেই callback, `map`/`filter`, event handler, middleware সম্ভব।",
        "**Prototype-based object model:** object সরাসরি অন্য object থেকে আচরণ ধার করে (prototype chain)। `class` syntax (ES2015) এই মডেলের ওপরের একটি সুন্দর আবরণ — নতুন কোনো inheritance মডেল নয়।",
        "**Single-threaded execution model:** একটি agent এ JavaScript কোড একসাথে একটি কাজই চালায়। তবু asynchronous কাজ চলে event loop এর কারণে (পরের lesson এ বিস্তারিত)।",
        "**Garbage collected:** আপনি manual ভাবে memory মুক্ত করেন না — engine অব্যবহৃত object সরিয়ে দেয়।",
        "**Just-in-time (JIT) compiled engine:** ‘JavaScript হলো interpreted ভাষা’ কথাটি অতিসরলীকরণ। আধুনিক engine সাধারণত কোড parse করে bytecode বানায়, আর বেশি চলা অংশ optimize করে machine code এ রূপান্তর করে — তবে এটি engine এর implementation বিষয়, ভাষার spec এর শর্ত নয়।",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "ভুল ধারণা ২: ‘JavaScript single-threaded তাই ধীর / কিছু একসাথে করতে পারে না’",
      text: "Single-threaded মানে আপনার JS কোড একসাথে একটি কাজ চালায়। কিন্তু network, timer, disk I/O এর মতো কাজ host এর ভেতরে (প্রায়ই JS thread এর বাইরে) চলে এবং শেষ হলে callback/Promise হিসেবে ফিরে আসে। তাই একটি ধীর server request এর জন্য UI আটকে যায় না — যদি না আপনি নিজেই একটি ভারী synchronous loop চালান।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "ভুল ধারণা ৩: ‘typeof null === \"null\"’",
      text: "`typeof null` এর ফল হলো `\"object\"` — এটি ভাষার পুরোনো একটি পরিচিত ত্রুটি যা backward compatibility এর কারণে ঠিক করা হয়নি। `null` আসলে primitive। তাই object যাচাইয়ের সময় `value !== null && typeof value === \"object\"` লিখতে হয়।",
    },
    { type: "h3", text: "কখন JavaScript বেছে নেবেন?" },
    {
      type: "ul",
      items: [
        "Web UI তৈরি — browser এ native ভাবে চলে এমন একমাত্র সাধারণ ভাষা (WebAssembly ছাড়া)।",
        "একই ভাষায় frontend ও backend (Node.js) — team এর context-switch কমে, validation logic ভাগ করা যায়।",
        "I/O-নির্ভর কাজ — API server, real-time app, tooling, build script।",
        "যেখানে CPU-ভারী গণনা (ভিডিও encode, বড় সংখ্যা crunching) মুখ্য — সেখানে Web Worker/WebAssembly/অন্য ভাষা বিবেচনা করুন।",
      ],
    },
    {
      type: "callout",
      tone: "danger",
      title: "Security note: JavaScript মানে অবিশ্বস্ত কোড চালানোর সুযোগ",
      text: "Browser এ আপনার কোড অন্যের মেশিনে চলে — তাই user input কখনো কোড হিসেবে চালাবেন না। `eval(userInput)` বা `new Function(userInput)` এড়িয়ে চলুন, এবং user এর লেখা text DOM এ `innerHTML` দিয়ে বসালে **XSS** (Cross-Site Scripting) এর ঝুঁকি তৈরি হয় — সেখানে `textContent` ব্যবহার করুন। আর client-side validation শুধু UX এর জন্য; server এ আবার যাচাই করতেই হবে, কারণ browser এর কোড ব্যবহারকারী বদলে ফেলতে পারে।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ধরুন একটি **রান্নার রেসিপি বই** আছে। বইটিতে লেখা আছে রান্নার নিয়ম — কীভাবে কাটতে হয়, মেশাতে হয়, কোন ক্রমে কী করতে হয়। এটি হলো **ECMAScript**: নিয়মের সংকলন, যা কোনো নির্দিষ্ট রান্নাঘরের ওপর নির্ভর করে না।",
    },
    {
      type: "ul",
      items: [
        "**Chef (JavaScript engine):** যিনি রেসিপি পড়ে বাস্তবে রান্না করেন। V8, SpiderMonkey, JavaScriptCore — এরা আলাদা chef, কিন্তু একই রেসিপি অনুসরণ করে। একজন দ্রুত, একজন কম মনোযোগী — কিন্তু ফল একই হওয়ার কথা।",
        "**রান্নাঘর (Host environment):** বাড়ির রান্নাঘরে গ্যাস-চুলা আর ফ্রিজ আছে (browser এর `document`, `fetch`); রেস্টুরেন্টের রান্নাঘরে আছে বড় তন্দুর ও কোল্ড-স্টোরেজ (Node.js এর `fs`, `process`)। রেসিপি বইয়ে ‘তন্দুর চালু করুন’ লেখা নেই — এটি রান্নাঘরের যন্ত্র, রেসিপির অংশ নয়।",
        "**Dynamic typing:** chef একটি বাটিতে যেকোনো উপাদান রাখতে পারেন — বাটির গায়ে ‘শুধু চিনি’ লেখা নেই। কিন্তু ভুল করে লবণ মেশালে সেটি তখনই ধরা পড়ে যখন কেউ খেয়ে দেখে (runtime এ) — রান্নার আগে কেউ আটকায় না।",
        "**First-class function:** রেসিপির একটি ধাপ নিজেই আরেক রেসিপিতে ‘উপাদান’ হিসেবে ব্যবহার করা যায় — যেমন ‘আমার বিশেষ মশলা বানানোর পদ্ধতি’ কে অন্য রান্নার ভেতরে পাঠিয়ে দেওয়া।",
      ],
    },
    {
      type: "p",
      text: "এই কারণেই একই ভাষা শিখে আপনি browser ও server দুটিতেই কাজ করতে পারেন — রেসিপি এক, শুধু রান্নাঘর বদলায়। আর কেন `document.querySelector` Node.js এ কাজ করে না — তা এখন পরিষ্কার: রেসিপিতে সেটি ছিলই না, ওটা শুধু browser-রান্নাঘরের যন্ত্র।",
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "ECMAScript, Engine ও Host environment কীভাবে মিলে কাজ করে",
      nodes: [
        { id: "code", label: "আপনার কোড", sub: "source text" },
        { id: "engine", label: "JS Engine", sub: "V8 / SpiderMonkey / JSC" },
        { id: "lang", label: "ভাষার built-in", sub: "ECMAScript" },
        { id: "host", label: "Host APIs", sub: "browser বা Node.js" },
      ],
      steps: [
        {
          active: ["code"],
          items: { code: ["const nums = [1, 2, 3];", "nums.map(n => n * 2);", "setTimeout(done, 0);", "document.title = 'Hi';"] },
          note: "আপনি এক ফাইলে ভাষার feature (`const`, `map`) এবং host এর feature (`setTimeout`, `document`) দুটিই লিখেছেন। Engine এর কাছে প্রথমে এটি শুধু text।",
        },
        {
          active: ["engine"],
          items: { engine: ["parse করে structure বোঝে", "bytecode বানায়", "চালায় (hot code optimize হতে পারে)"] },
          note: "Engine কোড **parse** করে ভেতরের কাঠামো (AST) বানায়, তারপর execute করে। এই অংশটি ECMAScript spec মেনে চলে। Engine কত বুদ্ধিমান optimization করবে তা implementation এর ব্যাপার।",
        },
        {
          active: ["engine", "lang"],
          items: { lang: ["Array.prototype.map", "Promise, Map, Set", "JSON, Math, Intl"] },
          note: "`nums.map(...)` ভাষার built-in — প্রায় সব পরিবেশে একই আচরণ। এগুলো spec এ সংজ্ঞায়িত, তাই Chrome, Firefox, Node.js — সব জায়গায় একই ফল।",
        },
        {
          active: ["engine", "host"],
          items: { host: ["setTimeout (timer)", "document (শুধু browser)", "fs (শুধু Node.js)"] },
          note: "`setTimeout` ও `document` engine নিজে জানে না — host ‘যুক্ত করে’ দেয়। Node.js এ `document` চালালে `ReferenceError`, কারণ ওই host এ সেই নামটি নেই।",
        },
        {
          active: ["code", "engine", "lang", "host"],
          note: "সারকথা: **ভাষা (ECMAScript) + Engine + Host APIs = আপনার JavaScript পরিবেশ।** কোনো API দেখলে প্রশ্ন করুন — এটি ভাষার, নাকি host এর?",
        },
      ],
      caption: "একই ভাষা, ভিন্ন host — তাই `document` শুধু browser এ, `fs` শুধু Node.js এ।",
    },
    {
      kind: "memory-steps",
      title: "Dynamic typing: type থাকে মানের সাথে, নামের সাথে নয়",
      code: 'let x = 42;\nx = "hello";\nx = { id: 1 };\nx = null;',
      steps: [
        {
          line: 0,
          memory: [{ name: "x", value: "42 (number)", kind: "let", state: "live" }],
          note: "`x` এ এখন একটি number। `typeof x` হলো `\"number\"`।",
        },
        {
          line: 1,
          memory: [{ name: "x", value: '"hello" (string)', kind: "let", state: "live" }],
          note: "একই `x` নামে এবার string। কোনো error নেই — `let` শুধু **নাম** reassign করা আটকায় না, type আটকানোর প্রশ্নই নেই। Type জুড়ে আছে মানের সাথে।",
        },
        {
          line: 2,
          memory: [{ name: "x", value: "→ { id: 1 } (object)", kind: "let", state: "live" }],
          note: "এবার `x` একটি object এর reference ধরে আছে। (object আসলে heap এ থাকে, `x` তার ঠিকানা — পরের lessons এ বিস্তারিত।)",
        },
        {
          line: 3,
          memory: [{ name: "x", value: "null", kind: "let", state: "live" }],
          note: "`null` — ইচ্ছাকৃত ‘কোনো মান নেই’। মজার ব্যাপার: `typeof x` এখন `\"object\"` দেয় (পুরোনো একটি ত্রুটি যা কখনো ঠিক হয়নি)।",
        },
      ],
      caption: "এই নমনীয়তাই JavaScript এর শক্তি ও ঝুঁকি — TypeScript এই ঝুঁকি compile time এ কমায়।",
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Dynamic typing ও typeof এর সাথে পরিচয়",
      description: "বিভিন্ন মানের `typeof` দেখুন। শেষ লাইনের ফল (`null`) নিয়ে অবাক হবেন — কেন, তা Concept এ আছে।",
      code: `const values = [42, "hello", true, undefined, null, { a: 1 }, [1, 2], () => 1, 10n];

for (const v of values) {
  console.log(typeof v);
}

// array ও object আলাদা করতে Array.isArray
console.log(Array.isArray([1, 2]), Array.isArray({}));`,
    },
    {
      level: "intermediate",
      title: "First-class function: function কে মান হিসেবে ব্যবহার",
      description: "Function কে variable এ রাখা, argument হিসেবে পাঠানো এবং return করা — তিনটি কাজই এখানে।",
      code: `// ১) function কে variable এ রাখা
const double = (n) => n * 2;

// ২) function কে argument হিসেবে নেওয়া (higher-order function)
function applyToAll(items, fn) {
  const result = [];
  for (const item of items) result.push(fn(item));
  return result;
}

// ৩) function return করা (closure সহ)
function multiplier(factor) {
  return (n) => n * factor;
}
const triple = multiplier(3);

console.log(applyToAll([1, 2, 3], double));
console.log(applyToAll([1, 2, 3], triple));
console.log(typeof double, typeof multiplier);`,
    },
    {
      level: "real-world",
      title: "JSON থেকে order summary — ভাষার built-in দিয়ে বাস্তব কাজ",
      description: "Server থেকে আসা JSON text parse করে মোট হিসাব বের করা ও `Intl` দিয়ে সংখ্যা সাজানো। এখানে `JSON`, `Array`, `Intl` সবই ECMAScript এর অংশ, তাই browser ও Node.js দুটিতেই একই ফল দেবে।",
      code: `const payload = '[{"name":"Keyboard","price":2500,"qty":2},{"name":"Mouse","price":850,"qty":3},{"name":"Cable","price":120.5,"qty":4}]';

const items = JSON.parse(payload);

const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
const names = items.map((item) => item.name).join(", ");

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

console.log("Items:", names);
console.log("Count:", items.length);
console.log("Total:", fmt.format(total));`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
console.log("Hello, JavaScript!");
`,
    },
    {
      label: "Host কোন নামগুলো দিয়েছে? (typeof পরীক্ষা)",
      code: `// ভাষার built-in সবসময় আছে
console.log("Array:", typeof Array);
console.log("Promise:", typeof Promise);
console.log("JSON:", typeof JSON);

// Host এর জিনিস পরিবেশ ভেদে আলাদা। typeof undeclared নামেও error দেয় না।
console.log("document:", typeof document);
console.log("window:", typeof window);
console.log("process:", typeof process);
console.log("setTimeout:", typeof setTimeout);

// এই পরিবেশ কোন global object ব্যবহার করছে?
console.log("globalThis আছে:", typeof globalThis === "object");`,
    },
    {
      label: "Coercion এর ফাঁদ",
      code: `console.log("5" + 3);        // + এখানে string জোড়া লাগায়
console.log("5" - 3);        // - এখানে number এ রূপান্তর করে
console.log("5" * "2");
console.log(1 + true);
console.log([] + {});
console.log(0 == "");        // loose equality
console.log(0 === "");       // strict equality — এটিই ব্যবহার করুন
console.log(Number("12px"), Number(""), Number("  7 "));`,
    },
    {
      label: "Prototype chain এর এক ঝলক",
      code: `const animal = {
  speak() {
    return this.name + " শব্দ করছে";
  },
};

const dog = Object.create(animal); // dog এর prototype হলো animal
dog.name = "Tuku";

console.log(dog.speak());
console.log(Object.getPrototypeOf(dog) === animal);
console.log(Object.hasOwn(dog, "speak"), "speak" in dog);`,
    },
  ],

  debugging: [
    {
      title: "TypeError: Cannot read properties of null (typeof null এর ফাঁদ)",
      bad: `const user = null;

if (typeof user === "object") {
  // ভেবেছিলাম user আছে!
  console.log(user.name);
}`,
      why: "`typeof null` হলো `\"object\"`, তাই `typeof user === \"object\"` যাচাই `null` এর জন্যও সত্য হয়। তারপর `null.name` পড়তে গেলে TypeError। Object যাচাই করতে হলে `null` আলাদা করে বাদ দিতে হয়।",
      fix: `const user = null;

if (user !== null && typeof user === "object") {
  console.log(user.name);
} else {
  console.log("user নেই");
}

// optional chaining ও নিরাপদ বিকল্প
console.log(user?.name);`,
    },
    {
      title: "ReferenceError: document is not defined (Browser API অন্য পরিবেশে)",
      bad: `// এই কোড Node.js বা Web Worker এ চালালে ভাঙে
document.title = "Hello";
console.log("title set");`,
      why: "`document` ECMAScript এর অংশ নয়, এটি browser এর window context এর DOM API। Node.js বা Web Worker এ ওই নামটি global এ নেই, তাই `ReferenceError`। Universal কোড লিখতে হলে আগে feature detection করুন।",
      fix: `if (typeof document !== "undefined") {
  document.title = "Hello";
} else {
  console.log("DOM নেই — এটি window context এর browser নয়");
}`,
    },
    {
      title: "Form এর দাম যোগে ভুল: string concatenation",
      bad: `// form input থেকে সব মান আসে string হিসেবে
const qty = "2";
const price = 50;

console.log("Total:", qty + price);`,
      why: "`+` অপারেটরের এক পাশে string থাকলে সেটি সংখ্যা যোগ না করে string জোড়া লাগায়: `\"2\" + 50` হয় `\"250\"`। অথচ `\"2\" * 50` হতো `100` — একই ধরনের ভুল ধরা কঠিন, কারণ কোনো error আসে না।",
      fix: `const qty = Number("2"); // স্পষ্টভাবে number এ রূপান্তর
const price = 50;

console.log("Total:", qty * price);

// অবৈধ input কে ধরুন
console.log(Number.isNaN(Number("abc")));`,
    },
    {
      title: "TypeError: x is not a function (dynamic typing এর ফল)",
      bad: `let greet = (name) => "Hello, " + name;
greet = "Hello"; // কেউ ভুল করে string বসিয়েছে

console.log(greet("Rina"));`,
      why: "Dynamic typing এ একই নামে function এর জায়গায় string বসানো বৈধ — engine বাধা দেয় না। ভুলটি ধরা পড়ে শুধু ডাকার মুহূর্তে (runtime এ)। বড় কোডবেসে `const` ব্যবহার, lint ও TypeScript এই ঝুঁকি আগেই কমায়।",
      fix: `const greet = (name) => "Hello, " + name; // const: নাম আর বদলাবে না

console.log(greet("Rina"));
console.log(typeof greet === "function");`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "typeof এর ফল print করুন",
      prompt: "`values` array এর প্রতিটি মানের `typeof` এক লাইনে, space দিয়ে আলাদা করে print করুন।",
      starter: `const values = [42, "hi", null];

// TODO: প্রতিটি মানের typeof এক লাইনে print করুন`,
      expected: "number string object",
      hints: ["`map` দিয়ে প্রতিটি মান থেকে `typeof v` বের করুন।", "`console.log(...array)` spread করলে মানগুলো space দিয়ে আলাদা হয়ে print হয়।"],
      solution: `const values = [42, "hi", null];
console.log(...values.map((v) => typeof v));`,
      explanation: "`null` এর `typeof` হলো `\"object\"` — তাই শেষ শব্দটি `object`। Spread (`...`) array এর উপাদানগুলোকে আলাদা argument বানায়, তাই top-level string গুলো raw ও space দিয়ে print হয়।",
    },
    {
      level: "beginner",
      title: "Dynamic typing কাজে লাগান",
      prompt: "`x` এর শুরুর মান number। এটিকে string `\"five\"` বানিয়ে `typeof x` print করুন (`string`)।",
      starter: `let x = 5;

// TODO: x কে string "five" বানান

console.log(typeof x);`,
      expected: "string",
      hints: ["`let` দিয়ে declare করা তাই reassign করা যায়।", "Dynamic typing এ নতুন মানের type নিজে থেকেই বদলে যায়।"],
      solution: `let x = 5;
x = "five";
console.log(typeof x);`,
    },
    {
      level: "beginner",
      title: "Function কে variable এ রাখুন",
      prompt: "`greet` এ একটি arrow function রাখুন যা `name` নিয়ে `\"Hello, \" + name` return করে। তারপর `greet(\"Rina\")` print করুন।",
      starter: `const greet = null; // TODO: এখানে function বসান

console.log(greet("Rina"));`,
      expected: "Hello, Rina",
      hints: ["`(name) => ...` arrow function syntax।", "Function হলো সাধারণ মান — variable এ রাখা যায়।"],
      solution: `const greet = (name) => "Hello, " + name;
console.log(greet("Rina"));`,
    },
    {
      level: "intermediate",
      title: "Higher-order function: applyTwice",
      prompt: "`applyTwice(fn, value)` লিখুন, যা `fn` কে `value` এর ওপর দুবার প্রয়োগ করে ফল return করে। `applyTwice((n) => n * 2, 5)` হবে `20`।",
      starter: `function applyTwice(fn, value) {
  // TODO
}

console.log(applyTwice((n) => n * 2, 5));`,
      expected: "20",
      hints: ["প্রথমবারের ফলটি দ্বিতীয়বারের input হবে: `fn(fn(value))`।"],
      solution: `function applyTwice(fn, value) {
  return fn(fn(value));
}

console.log(applyTwice((n) => n * 2, 5));`,
      explanation: "`fn` একটি সাধারণ parameter — তাই এটিকে ডাকা যায়। 5 → 10 → 20।",
    },
    {
      level: "intermediate",
      title: "String থেকে number: coercion ঠিক করুন",
      prompt: "Input থেকে আসা `a` একটি string। এটি `b` এর সাথে **সংখ্যা হিসেবে** যোগ করে `8` print করুন (এখন `53` print হয়)।",
      starter: `const a = "5"; // form input এর মতো string
const b = 3;

console.log(a + b);`,
      expected: "8",
      hints: ["`+` এর এক পাশে string থাকলে concatenation হয়।", "আগে `Number(a)` দিয়ে রূপান্তর করুন।"],
      solution: `const a = "5";
const b = 3;

console.log(Number(a) + b);`,
    },
    {
      level: "challenge",
      title: "Mixed data এর type রিপোর্ট",
      prompt: "`values` এ কোন `typeof` কতবার এসেছে তার গণনা একটি object এ বানান এবং print করুন। Key এর ক্রম প্রথম দেখার ক্রম অনুযায়ী হবে। (`null` কেও `typeof` যা দেয় সেই key এ গণনা করুন।)",
      starter: `const values = [1, "a", true, null, {}, 2, "b", undefined];

const report = {};
// TODO: report ভরুন

console.log(report);`,
      expected: "{ number: 2, string: 2, boolean: 1, object: 2, undefined: 1 }",
      hints: ["`for...of` দিয়ে loop করুন, `const t = typeof v;`।", "`report[t] = (report[t] ?? 0) + 1;` — `??` শুধু `undefined`/`null` এ বিকল্প দেয়।", "`null` এর typeof `\"object\"`, তাই `{}` ও `null` মিলে `object: 2`।"],
      solution: `const values = [1, "a", true, null, {}, 2, "b", undefined];

const report = {};
for (const v of values) {
  const t = typeof v;
  report[t] = (report[t] ?? 0) + 1;
}

console.log(report);`,
      explanation: "`report[t] ?? 0` প্রথমবার `undefined` পেলে `0` ধরে নেয়। Object এর property insertion ক্রম মেনে চলে (string key এর ক্ষেত্রে), তাই output এর ক্রম প্রথম দেখার ক্রমেই থাকে। `null` ও `{}` দুটোরই typeof `object`।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "JavaScript ও Java এর সম্পর্ক কোনটি সবচেয়ে সঠিক?",
        options: ["JavaScript হলো Java এর browser সংস্করণ", "দুটিই একই ভাষা, শুধু নাম আলাদা", "দুটি সম্পূর্ণ আলাদা ভাষা, নামের মিলটি ঐতিহাসিক marketing সিদ্ধান্ত", "JavaScript, Java এর ওপর build করা একটি library"],
        answer: 2,
        explanation: "দুটি ভিন্ন ভাষা — type system, object model ও execution মডেল আলাদা। প্রথম অপশন ভুল কারণ JavaScript কোনো Java সংস্করণ নয়। দ্বিতীয় ও চতুর্থ অপশনও ভুল: এটি স্বাধীন ভাষা, library নয়।",
      },
      {
        question: "**ECMAScript** কী?",
        options: ["JavaScript ভাষার standard specification (ECMA-262)", "Chrome এর JavaScript engine", "Node.js এর একটি module", "Browser এর DOM API এর নাম"],
        answer: 0,
        explanation: "ECMAScript হলো ভাষার specification যা TC39 maintain করে। Chrome এর engine এর নাম V8 (দ্বিতীয় অপশন ভুল)। Node.js module ও DOM API হলো host এর অংশ, ভাষার spec নয় (তৃতীয় ও চতুর্থ অপশন ভুল)।",
      },
      {
        question: "`typeof null` এর ফল কী?",
        options: ["`\"null\"`", "`\"undefined\"`", "`\"primitive\"`", "`\"object\"`"],
        answer: 3,
        explanation: "`typeof null` হলো `\"object\"` — ভাষার একটি পুরোনো পরিচিত ত্রুটি যা backward compatibility এর কারণে ঠিক করা হয়নি। `\"null\"` বা `\"undefined\"` নয়, আর `\"primitive\"` কোনো typeof ফলই নয়।",
      },
      {
        question: "নিচের কোনটি ECMAScript এর অংশ **নয়**, বরং browser host এর দেওয়া API?",
        options: ["`Array.prototype.map`", "`document.querySelector`", "`Promise.all`", "`JSON.stringify`"],
        answer: 1,
        explanation: "`document.querySelector` DOM এর অংশ — browser এর window context এর API। `Array.prototype.map`, `Promise.all` ও `JSON.stringify` ECMAScript এ সংজ্ঞায়িত, তাই Node.js সহ সব পরিবেশে পাওয়া যায়।",
      },
      {
        question: "`console.log(\"1\" + 2, \"1\" - 2)` কী print করে?",
        options: ["`12 -1`", "`3 -1`", "`12 NaN`", "`NaN NaN`"],
        answer: 0,
        explanation: "`+` এর এক পাশে string থাকলে concatenation হয় — `\"12\"`। `-` সবসময় number অপারেটর, তাই `\"1\"` কে `1` ধরে `1 - 2 = -1`। তাই `3 -1`, `12 NaN` বা `NaN NaN` ঠিক নয় — string `\"1\"` একটি বৈধ সংখ্যা, তাই NaN আসে না।",
      },
    ],
    coding: [
      {
        title: "মান ও টাইপ এক লাইনে",
        prompt: "`items` এর প্রতিটি মানের জন্য `type: value` ফরম্যাটে আলাদা লাইনে print করুন, যেমন `number: 5`।",
        starter: `const items = [5, "hi", true];

// TODO`,
        expected: "number: 5\nstring: hi\nboolean: true",
        solution: `const items = [5, "hi", true];

for (const v of items) {
  console.log(typeof v + ": " + v);
}`,
      },
      {
        title: "Callback দিয়ে রূপান্তর",
        prompt: "`nums` এর প্রতিটি সংখ্যাকে `triple` callback দিয়ে তিনগুণ করে নতুন array print করুন। মূল array বদলাবে না।",
        starter: `const nums = [1, 2, 3];
const triple = (n) => n * 3;

// TODO: triple ব্যবহার করে নতুন array বানিয়ে print করুন
console.log(nums);`,
        expected: "[ 3, 6, 9 ]",
        solution: `const nums = [1, 2, 3];
const triple = (n) => n * 3;

const result = nums.map(triple);
console.log(result);`,
      },
    ],
  },

  interview: [
    {
      q: "JavaScript কী? এটি কেন তৈরি হয়েছিল এবং আজ কোথায় কোথায় চলে?",
      a: "JavaScript একটি high-level, dynamically typed, multi-paradigm ভাষা যা garbage-collected এবং সাধারণত JIT-সমর্থিত engine এ চলে। ১৯৯৫ সালে Netscape এ তৈরি হয়েছিল browser এ web page কে interactive করার জন্য।\n\nআজ এটি browser এ (UI), server এ (Node.js, Deno, Bun), এবং build tool, desktop app (Electron), mobile (React Native এর মতো framework) ইত্যাদিতে চলে। উত্তরের শেষে জোর দিন: ভাষা এক, কিন্তু প্রতিটি পরিবেশ (host) নিজের API দেয়।",
    },
    {
      q: "ECMAScript, JavaScript engine ও host environment এর পার্থক্য কী?",
      a: "**ECMAScript** হলো ভাষার specification (ECMA-262) যা TC39 তৈরি করে — syntax, built-in object (`Array`, `Promise`, `Map`) সংজ্ঞায়িত করে। **Engine** (V8, SpiderMonkey, JavaScriptCore) হলো spec এর বাস্তব রূপ যা কোড parse ও execute করে। **Host environment** (browser, Node.js) engine কে ঘিরে অতিরিক্ত API দেয় — `document`, `fetch`, `fs`, `process`।\n\nএকটি API ভাষার নাকি host এর তা বোঝার সহজ উপায়: এটি কি সব পরিবেশে আছে? `Array` আছে, `document` নেই — তাই `document` host এর।",
    },
    {
      q: "JavaScript কি interpreted ভাষা? কীভাবে চলে?",
      a: "‘Interpreted’ কথাটি অতিসরল। ভাষার নিজের spec এ ‘interpreted’ বা ‘compiled’ বলে কিছু বাধ্যতামূলক নয় — এটি implementation এর বিষয়। আধুনিক engine সাধারণত source কে parse করে AST ও bytecode বানায়, তারপর interpreter দিয়ে চালায় এবং বেশি ব্যবহৃত (hot) অংশ JIT compiler দিয়ে optimize করা machine code এ রূপান্তর করে। বিস্তারিত পাইপলাইন engine ভেদে আলাদা, তাই সাক্ষাৎকারে নির্দিষ্ট engine এর নাম উল্লেখ করে বলাই নিরাপদ (যেমন ‘V8 এ সাধারণত...’)।",
    },
    {
      q: "JavaScript কি single-threaded? তাহলে asynchronous কাজ কীভাবে হয়?",
      a: "একটি JavaScript agent (যেমন একটি tab এর main thread) এ আপনার কোড একসাথে একটি কাজই চালায়, একটি call stack দিয়ে। কিন্তু timer, network, disk I/O এর মতো কাজ host (browser বা Node.js) নিজে সামলায় — আপনার কোডকে আটকে রাখে না। কাজ শেষ হলে callback বা Promise এর continuation একটি queue তে জমা হয় এবং **event loop** তা stack খালি হলে চালায়।\n\nতাই ভারী synchronous কাজ (বড় loop) UI আটকে দিতে পারে, কিন্তু অপেক্ষার কাজ (fetch) আটকায় না। সত্যিকারের parallelism এর জন্য Web Worker বা Node.js এর worker thread ব্যবহার হয়।",
    },
    {
      q: "Dynamic typing এর সুবিধা ও অসুবিধা কী? বড় প্রজেক্টে কীভাবে সামলান?",
      a: "সুবিধা: কম boilerplate, দ্রুত prototyping, নমনীয় data (যেমন JSON এর সাথে স্বাভাবিক কাজ)। অসুবিধা: type সংক্রান্ত ভুল runtime এ ধরা পড়ে (`undefined is not a function`), implicit coercion এর ফাঁদ (`\"5\" + 3`), refactor এ ঝুঁকি।\n\nবড় প্রজেক্টে সামলানোর উপায়: `===` ও `const` ব্যবহার, ESLint, runtime validation (যেমন API response যাচাই), এবং TypeScript — যা compile time এ type পরীক্ষা করে কিন্তু শেষ পর্যন্ত সাধারণ JavaScript এ রূপান্তরিত হয় (runtime এ type থাকে না)।",
    },
    {
      q: "Browser এ চলা JavaScript ও Node.js এ চলা JavaScript এর মূল পার্থক্যগুলো কী?",
      a: "ভাষার core (ECMAScript) একই। পার্থক্য host API তে: browser এ `window`, `document`, DOM event, `localStorage`, CORS ও same-origin নিয়ম; Node.js এ `process`, `node:fs`, `node:http`, Buffer, এবং CommonJS ও ES Module দুটি module সিস্টেম। Browser কোড একটি sandbox এ চলে, Node.js এ OS এর ওপর বেশি নিয়ন্ত্রণ আছে (তাই নিরাপত্তার দায়ও বেশি)।\n\nইন্টারভিউতে বলুন: ‘`globalThis` দিয়ে পরিবেশ-নিরপেক্ষ ভাবে global object পাওয়া যায়, আর `typeof document !== \"undefined\"` এর মতো feature detection দিয়ে কোড দুই পরিবেশেই নিরাপদ করা যায়।’",
    },
    {
      q: "`typeof null` কেন `\"object\"`? এবং object যাচাই করার সঠিক উপায় কী?",
      a: "এটি ভাষার প্রথম সংস্করণ থেকে চলে আসা একটি পরিচিত ত্রুটি। এটি ঠিক করলে বিদ্যমান অসংখ্য ওয়েবসাইট ভেঙে যেত, তাই backward compatibility র কারণে ঠিক করা হয়নি। `null` আসলে একটি primitive মান।\n\nসঠিক যাচাই: `value !== null && typeof value === \"object\"`। Array আলাদা করতে `Array.isArray(value)`। আর শুধু `null`/`undefined` যাচাইয়ের জন্য `value == null` (একমাত্র গ্রহণযোগ্য loose equality এর ব্যবহার) বা `value ?? fallback` ব্যবহার করা যায়।",
    },
  ],

  summary: {
    takeaways: [
      "JavaScript = high-level, dynamically typed, multi-paradigm, garbage-collected ভাষা; Java এর সাথে সম্পর্ক নেই।",
      "**ECMAScript** হলো ভাষার spec; **engine** তা চালায়; **host** (browser/Node.js) অতিরিক্ত API দেয় — `document`, `fs`, `fetch` ভাষার অংশ নয়।",
      "Type থাকে মানের সাথে (dynamic typing) — তাই `typeof`, `===`, `Number()` এর মতো স্পষ্ট যাচাই ও রূপান্তর জরুরি।",
      "Function হলো first-class মান — callback, higher-order function ও closure এর ভিত্তি।",
      "Single-threaded মানে ধীর নয়: I/O host সামলায়, event loop ফল ফেরত আনে; ভারী synchronous কাজ UI আটকায়।",
      "`typeof null === \"object\"` ও `\"5\" + 3 === \"53\"` — দুটিই পরিচিত ফাঁদ, কোড লেখার সময় সচেতন থাকুন।",
      "অবিশ্বস্ত input কখনো `eval` বা `innerHTML` এ দেবেন না (XSS)।",
    ],
    syntax: `// ভাষার অংশ (সব পরিবেশে)
const nums = [1, 2, 3].map((n) => n * 2);
const data = JSON.parse('{"a":1}');

// পরিবেশ নিরপেক্ষ global
const g = globalThis;

// feature detection (error ছাড়াই)
if (typeof document !== "undefined") {
  // browser window context
}

// নিরাপদ object যাচাই
const isObj = (v) => v !== null && typeof v === "object";`,
    whenToUse: [
      "Web UI ও browser এ interactive behaviour — JavaScript প্রায় অপরিহার্য।",
      "API server, tooling, real-time app এ — Node.js (বা Deno/Bun) দিয়ে একই ভাষায় full-stack।",
      "ভাষার feature (`Array`, `Promise`, `JSON`) আর host API (`document`, `fs`) আলাদা করে ভাবুন — portable কোড লেখার জন্য।",
      "টাইপ-নিরাপত্তা জরুরি হলে TypeScript, আর boundary তে (API/input) runtime validation।",
    ],
    next: [
      "JavaScript Runtime — Engine, Call Stack, Event Loop ও Queue",
      "How JavaScript works in the browser — script load, DOM, rendering ও event",
      "Variables: var, let, const",
      "Data Types ও Type Coercion এর গভীর আলোচনা",
    ],
  },

  compatibility:
    "এই lesson এ আলোচিত ভাষার feature (`const`, arrow function, `Promise`, `JSON`, `Intl`, `Object.hasOwn`, `??`, `?.`) ES2022 এর মধ্যে এবং সব আধুনিক browser ও Node.js এ কাজ করে। `BigInt` (`10n`) ও optional chaining আধুনিক পরিবেশে সমর্থিত। `document`/`window` শুধু browser এর window context এ আছে; `process`/`fs` শুধু Node.js এ। এই platform এর Playground একটি Web Worker এ চলে — তাই সেখানে `document` ও `window` নেই (`typeof` দিয়ে নিজে পরীক্ষা করে দেখুন)।",
};
