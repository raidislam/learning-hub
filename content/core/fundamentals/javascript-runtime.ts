import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "**JavaScript Runtime** বলতে কী বোঝায় — Engine (Memory Heap + Call Stack), Host APIs, Event Loop ও Queue — তা বুঝিয়ে বলতে পারবেন।",
    "Call Stack কীভাবে function call এর সময় frame push/pop করে এবং **stack overflow** কেন হয় তা ব্যাখ্যা করতে পারবেন।",
    "**Task queue (macrotask)** ও **Microtask queue** এর পার্থক্য এবং `setTimeout`, `Promise`, `await` মিশ্রিত কোডের output এর ক্রম নির্ভুল অনুমান করতে পারবেন।",
    "কেন `setTimeout(fn, 0)` ‘এখনই’ চলে না এবং ভারী synchronous কাজ কীভাবে পুরো runtime আটকে দেয় — তা বুঝে প্রতিকার করতে পারবেন।",
    "Browser runtime ও Node.js runtime এর মিল-অমিল (Web APIs বনাম Node APIs, `process.nextTick` ইত্যাদি) আলাদা করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Runtime বলতে আসলে কী বোঝায়?" },
    {
      type: "p",
      text: "আগের lesson এ দেখেছেন, JavaScript ভাষা একা কিছুই করতে পারে না — তাকে একটি **engine** চালাতে হয়, আর engine কে ঘিরে থাকে **host** এর API। এই সব মিলে যে পূর্ণ পরিবেশে আপনার কোড বাস্তবে চলে, তাকেই বলে **JavaScript Runtime**। Browser একটি runtime, Node.js আরেকটি, Deno ও Bun আরও দুটি।",
    },
    {
      type: "p",
      text: "Runtime এর চারটি মূল অংশ বুঝলেই `async`, `Promise`, `setTimeout` সংক্রান্ত সব রহস্য পরিষ্কার হয়ে যায়:",
    },
    {
      type: "ul",
      items: [
        "**Memory Heap** — object, array, function এর মতো (প্রধানত) reference type মান এখানে রাখা হয়। আপনি `{}` বা `[]` বানালে engine heap এ জায়গা নেয়; অব্যবহৃত হলে **garbage collector** পরিষ্কার করে। (Reachability ভিত্তিক — কোনো নাম আর যে object এ পৌঁছাতে পারে না, সেটিই সরানোর যোগ্য।)",
        "**Call Stack** — এখন কোন function চলছে এবং কে কাকে ডেকেছে তার তালিকা। এটি LIFO (Last In, First Out) কাঠামো। Function ডাকলে একটি **frame** push হয়, return করলে pop।",
        "**Host APIs** — engine এর বাইরের সক্ষমতা: timer, network, DOM event, file I/O। `setTimeout`, `fetch`, `addEventListener` ভাষার অংশ নয়, host এর দেওয়া। এই কাজগুলো সাধারণত আপনার JS thread এর বাইরে চলে।",
        "**Event Loop + Queue** — host এর কাজ শেষ হলে তার callback কোথায় অপেক্ষা করবে, আর কখন stack এ ঢুকবে — তা ঠিক করে event loop ও queue।",
      ],
    },
    { type: "h3", text: "Call Stack ভেতরে কীভাবে কাজ করে" },
    {
      type: "p",
      text: "Program শুরুতে engine একটি **global execution context** বানায় এবং stack এর তলায় রাখে। প্রতিটি function call এ নতুন একটি **function execution context** তৈরি হয় — তাতে থাকে local variable, parameter, `this`, ও outer scope এর সংযোগ (scope chain)। যে function এখন stack এর মাথায়, শুধু সেটিই চলতে পারে। সে return করলে frame pop হয় এবং নিয়ন্ত্রণ আগের function এ ফেরে।",
    },
    {
      type: "p",
      text: "Stack এর আকার সীমিত। কোনো function নিজেকে (বা পরস্পরকে) থামার শর্ত ছাড়া ডাকতে থাকলে frame জমতে জমতে সীমা পেরিয়ে যায় — তখন engine সাধারণত `RangeError` ছোড়ে (V8 এ বার্তাটি `Maximum call stack size exceeded`)। সীমাটি কত, তা engine ও পরিবেশ ভেদে আলাদা — তাই নির্দিষ্ট সংখ্যার ওপর নির্ভর করবেন না।",
    },
    { type: "h3", text: "Event Loop: stack খালি হলে পরের কাজ কে আনে?" },
    {
      type: "p",
      text: "JavaScript এর মূল নিয়ম **run-to-completion**: একটি কাজ শুরু হলে সেটি শেষ না হওয়া পর্যন্ত আর কোনো কাজ তাকে মাঝপথে থামাতে পারে না। কাজ শেষে stack খালি হলে **event loop** দেখে — কোথাও কি কোনো অপেক্ষমাণ কাজ আছে? থাকলে একটি তুলে stack এ দেয়। এভাবেই asynchronous আচরণ তৈরি হয়, অথচ আপনার কোড একই সাথে একটিই চলে।",
    },
    {
      type: "p",
      text: "Queue আসলে দু-ধরনের, এবং এদের অগ্রাধিকার আলাদা:",
    },
    {
      type: "compare",
      headers: ["বৈশিষ্ট্য", "Task queue (macrotask)", "Microtask queue"],
      rows: [
        ["কী কী আসে", "`setTimeout`/`setInterval` callback, UI event (click ইত্যাদি), message event", "`Promise` এর `.then/.catch/.finally` callback, `await` এর পরের অংশ, `queueMicrotask`"],
        ["কখন চলে", "প্রতিবার event loop ঘুরলে সাধারণত **একটি** task", "চলমান কাজ শেষে stack খালি হওয়ামাত্র **সবগুলো** (queue খালি হওয়া পর্যন্ত)"],
        ["অগ্রাধিকার", "কম", "বেশি — পরের task এর আগে"],
        ["ঝুঁকি", "ভারী task UI আটকায়", "microtask যদি নতুন microtask বানাতে থাকে, queue কখনো খালি হয় না — পরের task ও rendering না-খেয়ে থাকে (starvation)"],
      ],
    },
    {
      type: "ol",
      items: [
        "একটি task চলে (প্রথমে আপনার পুরো script ই একটি task)। এটি synchronous ভাবে শেষ পর্যন্ত চলে।",
        "Stack খালি হলে **সব microtask** একে একে চলে — microtask যদি আরও microtask জমা দেয়, সেগুলোও একই দফায় চলে।",
        "Browser এ এরপর (সুযোগ থাকলে) rendering হতে পারে।",
        "তারপর event loop পরের task নেয় — ধাপ ১ থেকে আবার।",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "ভুল ধারণা: ‘setTimeout(fn, 0) মানে এক্ষুণি চালাও’",
      text: "না। `0` হলো **ন্যূনতম** অপেক্ষা। কলব্যাক টি আগে **task queue** এ ঢোকে, এবং চলে তখনই যখন (১) বর্তমান synchronous কোড শেষ, (২) সব microtask শেষ, এবং (৩) event loop তার পালা পায়। তাই `setTimeout(..., 0)` এর callback সবসময় সব `Promise.then` এর পরে চলে। এছাড়া browser এ নেস্টেড timer এর ক্ষেত্রে ন্যূনতম delay কিছুটা বাড়তে পারে, তাই ঠিক ক’ms এ চলবে এর নিশ্চয়তা নেই।",
    },
    { type: "h3", text: "async/await ও এই মডেল" },
    {
      type: "p",
      text: "`async function` সাধারণ function এর মতোই চলে — প্রথম `await` পর্যন্ত **synchronously**। `await` এ পৌঁছালে function টি থেমে যায় (stack থেকে বেরিয়ে যায়), এবং বাকি অংশ (continuation) পরে একটি **microtask** হিসেবে চালানো হয় যখন awaited Promise settle করে। এর ফলে `await` এর পরের কোড সবসময় বর্তমান synchronous কোডের পরে চলে — এটিই `async` কোডে output এর ক্রম নিয়ে সবচেয়ে বেশি বিভ্রান্তির কারণ।",
    },
    { type: "h3", text: "Browser runtime বনাম Node.js runtime" },
    {
      type: "compare",
      headers: ["অংশ", "Browser", "Node.js"],
      rows: [
        ["Engine", "V8 / SpiderMonkey / JavaScriptCore (browser ভেদে)", "V8"],
        ["Host APIs", "Web APIs: DOM, `fetch`, timers, `requestAnimationFrame`", "Node APIs: `fs`, `http`, `process`, timers"],
        ["Event loop", "HTML spec এ সংজ্ঞায়িত; rendering এর সাথে যুক্ত", "libuv ভিত্তিক; কয়েকটি phase আছে (timers, I/O ইত্যাদি) — বিস্তারিত Node এর documentation দেখুন"],
        ["বিশেষ scheduling", "`requestAnimationFrame`, `requestIdleCallback` (সব browser এ নয়)", "`process.nextTick`, `setImmediate`"],
        ["Worker", "Web Worker (আলাদা thread ও আলাদা event loop)", "`worker_threads`"],
      ],
    },
    {
      type: "code",
      caption: "শুধু browser এ (এই Playground এ চলবে না — window context দরকার)",
      code: `// rendering এর ঠিক আগে চলে — animation এর জন্য
requestAnimationFrame(() => {
  box.style.transform = "translateX(100px)";
});`,
    },
    {
      type: "code",
      caption: "শুধু Node.js এ (এই Playground এ চলবে না)",
      code: `setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
// nextTick সাধারণত promise microtask এর আগেই চলে।
// main module থেকে timeout ও immediate এর পারস্পরিক ক্রমের নিশ্চয়তা নেই।`,
    },
    {
      type: "callout",
      tone: "danger",
      title: "Security ও availability note",
      text: "Event loop একটি, তাই একটি ভারী synchronous কাজ পুরো runtime আটকে দেয়। Node.js server এ একটি request এ ভয়ংকর regex (**ReDoS**) বা বিশাল synchronous loop চললে সব ব্যবহারকারীর request আটকে যায় — এটি একটি বাস্তব denial-of-service ঝুঁকি। user input এর ওপর ভারী কাজ করবেন না, input এর আকার সীমিত করুন, এবং দরকারে worker এ সরান। আর browser এ `setTimeout(\"code string\", 0)` ধরনের string-callback কখনো ব্যবহার করবেন না — এটি `eval` এর মতো কাজ করে এবং Content Security Policy তে আটকে যায়; সবসময় function পাঠান।",
    },
    { type: "h3", text: "বাস্তব কাজে এই জ্ঞান কখন লাগে" },
    {
      type: "ul",
      items: [
        "Output এর ক্রম নিয়ে bug: ‘কেন data আসার আগেই render হলো?’ — কোন callback কোন queue তে তা জানলে উত্তর মেলে।",
        "UI jank: ৫০ ms এর বেশি synchronous কাজ হলে ব্যবহারকারী আটকে যাওয়া টের পায়। কাজ ছোট টুকরোয় ভাগ করুন বা Web Worker এ সরান।",
        "Test এ async কোড: কখন assertion চালাবেন তা microtask/task ক্রম থেকে নির্ধারিত হয়।",
        "Memory leak: callback বা closure কোনো বড় object ধরে রাখলে garbage collector তা সরাতে পারে না — heap বুঝলে কারণ ধরা সহজ।",
      ],
    },
  ],

  analogy: [
    {
      type: "p",
      text: "একটি **ব্যস্ত রেস্টুরেন্টের রান্নাঘর** কল্পনা করুন, যেখানে **একজন মাত্র head chef** আছেন (এটিই আপনার JavaScript thread)। তিনি একসাথে একটিই অর্ডার রান্না করেন এবং একবার শুরু করলে সেটি শেষ না করে অন্য কাজে যান না (run-to-completion)।",
    },
    {
      type: "ul",
      items: [
        "**Call Stack = chef এর হাতের কাজ।** ‘বিরিয়ানি বানাও’ এর ভেতরে ‘ভাত সেদ্ধ করো’, তার ভেতরে ‘জল ফোটাও’ — ভেতরের কাজ আগে শেষ হয়, তারপর বাইরের কাজ। এটিই stack: শেষে ঢোকা কাজ আগে শেষ।",
        "**Memory Heap = স্টোররুম।** চাল, ডাল, মশলা (object) এখানে রাখা; chef এর কাছে থাকে শুধু ‘কোন তাকে কী’ তার চিরকুট (reference)। যে জিনিস আর কোনো চিরকুটে নেই, স্টোর-কর্মী (garbage collector) সেটি ফেলে দেয়।",
        "**Host APIs = সহকারী ও যন্ত্র।** ‘ভাত সেদ্ধ হতে ২০ মিনিট লাগবে’ — chef সেটি রাইস-কুকারে (timer) বসিয়ে অন্য অর্ডারে চলে যান। কুকার নিজে নিজেই চলে; chef দাঁড়িয়ে থাকেন না। এভাবেই network/timer আপনার JS কে আটকায় না।",
        "**Task queue = সাধারণ অর্ডারের টিকিট রাখার স্পাইক।** কুকার বাজলে (timer শেষ) টিকিট স্পাইকে গিয়ে ঢোকে; chef যখন হাতের কাজ শেষ করেন তখনই পরের টিকিট নেন।",
        "**Microtask queue = ‘জরুরি, এক্ষুণি’ স্লিপ।** chef এর হাতের কাজ শেষ হওয়ামাত্র — পরের সাধারণ টিকিট নেওয়ার **আগেই** — এই জরুরি স্লিপগুলো সব সামলাতে হয়। (আর জরুরি স্লিপ যদি নতুন জরুরি স্লিপ বানাতেই থাকে, সাধারণ টিকিট কখনো ধরাই হয় না — starvation।)",
        "**Event loop = ম্যানেজার,** যে বারবার দেখছে: ‘chef এর হাত খালি? জরুরি স্লিপ আছে? না থাকলে স্পাইকের পরের টিকিট দাও।’",
      ],
    },
    {
      type: "p",
      text: "আর একটি ভারী synchronous loop মানে chef ৪০ মিনিট একটি জটিল পদ নিয়ে আটকে আছেন — রাইস-কুকার বাজছে, কিন্তু কেউ শুনছে না, নতুন অর্ডারও ঢুকছে না। আপনার UI তখন ‘freeze’ হয়ে যায়। সমাধান: কাজ ছোট ছোট ধাপে ভেঙে ধাপের মাঝে chef কে টিকিট দেখার সুযোগ দেওয়া, অথবা আরেকজন chef (Web Worker) ডাকা।",
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "Event Loop: sync → microtask → task (A, D, C, B)",
      nodes: [
        { id: "stack", label: "Call Stack", sub: "এখন যা চলছে" },
        { id: "host", label: "Host APIs", sub: "timer, network" },
        { id: "micro", label: "Microtask Queue", sub: "Promise.then" },
        { id: "task", label: "Task Queue", sub: "timer callback" },
        { id: "loop", label: "Event Loop", sub: "কে পরের কাজ দেয়" },
      ],
      steps: [
        {
          active: ["stack"],
          items: { stack: ["global script"] },
          note: "Script শুরু। কোড হলো: `console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); Promise.resolve().then(() => console.log(\"C\")); console.log(\"D\");` — পুরো script টিই এখন একটি task।",
        },
        {
          active: ["stack"],
          items: { stack: ["console.log(\"A\")", "global script"] },
          output: "A",
          note: "প্রথম লাইন synchronous — সাথে সাথে চলে ও `A` print হয়।",
        },
        {
          active: ["stack", "host"],
          items: { stack: ["setTimeout(...)", "global script"], host: ["timer (0ms) → callback B"] },
          note: "`setTimeout` callback চালায় না, শুধু host কে বলে ‘ন্যূনতম ০ms পরে এটি জানিও’। Timer টি এখন host এর হাতে — stack সাথে সাথে মুক্ত।",
        },
        {
          active: ["stack", "micro"],
          items: { stack: ["Promise.resolve().then(...)", "global script"], host: ["timer (0ms) → callback B"], micro: ["callback C"] },
          note: "`Promise.resolve()` ইতিমধ্যে fulfilled, তাই `.then` এর callback সরাসরি **microtask queue** তে জমা হলো। (Task queue তে নয়!)",
        },
        {
          active: ["stack"],
          items: { stack: ["console.log(\"D\")", "global script"], host: ["timer (0ms) → callback B"], micro: ["callback C"] },
          output: "D",
          note: "পরের synchronous লাইন — `D` print হয়। মনে রাখুন, C ও B কেউই এখনো চলেনি।",
        },
        {
          active: ["loop", "micro", "task"],
          items: { micro: ["callback C"], task: ["callback B"] },
          note: "Script শেষ, stack খালি। Timer ইতিমধ্যে শেষ হয়ে callback B কে **task queue** তে পাঠিয়েছে। এখন event loop এর পালা — নিয়ম: আগে **সব microtask**, তারপর পরের task।",
        },
        {
          active: ["stack", "micro"],
          items: { stack: ["callback C"], task: ["callback B"] },
          output: "C",
          note: "Microtask `C` চলল। Microtask queue এখন খালি।",
        },
        {
          active: ["stack", "task"],
          items: { stack: ["callback B"] },
          output: "B",
          note: "এবার event loop task queue থেকে `B` নিল। চূড়ান্ত ক্রম: **A, D, C, B**। শিক্ষা: sync → microtask → task।",
        },
      ],
      caption: "Timer এর delay ০ হলেও সেটি task, তাই সবসময় Promise এর পরে চলে।",
    },
    {
      kind: "flow-steps",
      title: "Call Stack: function call এ frame push ও pop",
      nodes: [
        { id: "stack", label: "Call Stack", sub: "ওপরেরটিই এখন চলছে" },
        { id: "heap", label: "Memory Heap", sub: "object এখানে" },
        { id: "out", label: "Console", sub: "output" },
      ],
      steps: [
        {
          active: ["stack"],
          items: { stack: ["global"] },
          note: "কোড: `function c() { return 1 }`, `function b() { return c() + 1 }`, `function a() { return b() + 1 }`, তারপর `const user = { name: \"Rina\" }` ও `console.log(a())`। শুরুতে শুধু global context।",
        },
        {
          active: ["stack", "heap"],
          items: { stack: ["global"], heap: ["{ name: 'Rina' }  ← user"] },
          note: "`const user = {...}` — object টি তৈরি হয় **heap** এ; global এর `user` নাম শুধু তার ঠিকানা (reference) ধরে রাখে।",
        },
        {
          active: ["stack"],
          items: { stack: ["a()", "global"], heap: ["{ name: 'Rina' }  ← user"] },
          note: "`a()` ডাকা হলো — নতুন frame stack এর মাথায় push হলো। এখন `a` চলছে।",
        },
        {
          active: ["stack"],
          items: { stack: ["b()", "a()", "global"], heap: ["{ name: 'Rina' }  ← user"] },
          note: "`a` এর ভেতর `b()` ডাকা — `a` অপেক্ষায় থাকে, `b` মাথায় এসে চলে।",
        },
        {
          active: ["stack"],
          items: { stack: ["c()", "b()", "a()", "global"], heap: ["{ name: 'Rina' }  ← user"] },
          note: "`c()` ডাকা — stack এখন সবচেয়ে গভীর (৪ frame)। যদি কোনো function নিজেকে শর্তহীন ভাবে ডাকত, এই তালিকা সীমা ছাড়িয়ে `RangeError` দিত।",
        },
        {
          active: ["stack"],
          items: { stack: ["b()  (c() = 1 পেয়েছে)", "a()", "global"] },
          note: "`c` `1` return করে pop হলো। `b` এখন `1 + 1 = 2` হিসাব করবে। লক্ষ্য করুন — heap এর object টি এখনো `user` দিয়ে reachable, তাই থাকছে।",
        },
        {
          active: ["stack", "out"],
          items: { stack: ["global"], out: ["3"] },
          output: "3",
          note: "`b` → `2`, `a` → `3` return করে একে একে pop হলো, শেষে `console.log(3)`। Stack আবার শুধু global — এখন event loop অপেক্ষমাণ কাজ খুঁজবে।",
        },
      ],
      caption: "Stack = LIFO: শেষে ঢোকা function আগে শেষ হয়।",
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Sync, microtask ও timer এর ক্রম",
      description: "Output এর ক্রম আগে নিজে অনুমান করুন, তারপর চালিয়ে মেলান। মূল নিয়ম: synchronous → microtask (Promise) → task (timer)।",
      code: `console.log("1: script শুরু");

setTimeout(() => console.log("5: setTimeout (task)"), 0);

Promise.resolve().then(() => console.log("3: Promise.then (microtask)"));

queueMicrotask(() => console.log("4: queueMicrotask (microtask)"));

console.log("2: script শেষ");`,
    },
    {
      level: "intermediate",
      title: "Call Stack এর পথ দেখুন",
      description: "Function এর ঢোকা ও বেরোনো log করে stack এর LIFO আচরণ প্রমাণ। `depth` argument দিয়ে বোঝা যায় কতটা গভীরে আছি।",
      code: `function trace(label, depth, next) {
  const pad = "  ".repeat(depth);
  console.log(pad + "→ ঢুকলো " + label);
  if (next) next(depth + 1);
  console.log(pad + "← বেরোলো " + label);
}

function third(depth) { trace("third", depth); }
function second(depth) { trace("second", depth, third); }
function first(depth) { trace("first", depth, second); }

first(0);`,
    },
    {
      level: "real-world",
      title: "ভারী কাজ টুকরো করে event loop কে শ্বাস নিতে দেওয়া",
      description: "বড় array প্রসেস করার সময় একটানা loop চালালে বাকি সব কাজ (UI event, timer) আটকে থাকে। এখানে কাজ chunk এ ভাগ করে প্রতিবার `setTimeout` দিয়ে event loop কে ছেড়ে দেওয়া হচ্ছে — তাই মাঝখানে ‘অন্য task’ চলার সুযোগ পায়।",
      code: `const data = Array.from({ length: 1000 }, (_, i) => i + 1);

// এটি আগে থেকে queue তে আছে — chunk এর মাঝে চলার সুযোগ পাবে
setTimeout(() => console.log("  [অন্য task চলল — UI আটকায়নি]"), 0);

const yieldToEventLoop = () => new Promise((resolve) => setTimeout(resolve, 0));

async function processInChunks(items, size) {
  let sum = 0;
  for (let i = 0; i < items.length; i += size) {
    const chunk = items.slice(i, i + size);
    for (const n of chunk) sum += n; // ভারী কাজের প্রতিনিধি
    console.log("chunk শেষ, এখন পর্যন্ত যোগফল:", sum);
    await yieldToEventLoop();        // loop কে ছেড়ে দিন
  }
  return sum;
}

const total = await processInChunks(data, 400);
console.log("মোট:", total);`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
console.log("Hello, Runtime!");
`,
    },
    {
      label: "await এর পরের কোড কখন চলে?",
      code: `async function demo() {
  console.log("১: async function এর ভেতরে (এখনো synchronous)");
  await null;
  console.log("৩: await এর পরে (microtask এ)");
}

demo();
console.log("২: demo() ফেরত এল — বাইরের কোড চলছে");

setTimeout(() => console.log("৪: timer (task)"), 0);`,
    },
    {
      label: "Microtask এ microtask — starvation এর ছোট নমুনা",
      code: `let count = 0;

function chain() {
  count++;
  if (count < 5) {
    Promise.resolve().then(chain); // microtask আবার microtask বানায়
  }
}

setTimeout(() => console.log("timer চলল, count =", count), 0);
chain();
// নতুন microtask গুলোও timer এর আগে একই দফায় শেষ হয়।
// (এখানে ৫ বার পর থামে; অসীম হলে timer কখনো চলত না!)`,
    },
    {
      label: "Stack overflow দেখুন (নিরাপদে ধরা)",
      code: `let depth = 0;

function recurse() {
  depth++;
  recurse();
}

try {
  recurse();
} catch (e) {
  console.log(e.name);
  console.log("সর্বোচ্চ গভীরতা পাওয়া গেছে:", depth > 1000);
}`,
    },
    {
      label: "নেস্টেড timer ও ক্রম",
      code: `setTimeout(() => {
  console.log("outer timer");
  Promise.resolve().then(() => console.log("  outer এর ভেতরের microtask"));
  setTimeout(() => console.log("inner timer"), 0);
}, 0);

setTimeout(() => console.log("দ্বিতীয় timer"), 0);

// প্রতিটি task এর শেষে microtask গুলো চলে, তারপর পরের task।`,
    },
  ],

  debugging: [
    {
      title: "Async কাজের ফল synchronous ভাবে পড়া (undefined)",
      bad: `let result;

setTimeout(() => {
  result = 42; // পরে বসবে
}, 0);

console.log("ফল:", result); // এখনই পড়ছি`,
      why: "`setTimeout` এর callback একটি task — বর্তমান synchronous কোড শেষ না হওয়া পর্যন্ত সেটি চলে না। `console.log` চলার সময় `result` এ এখনো কিছু বসেনি, তাই `undefined`। Asynchronous কাজের ফল **callback বা `await` এর ভেতরেই** ব্যবহার করতে হয়।",
      fix: `function getResult() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(42), 0);
  });
}

const result = await getResult(); // ফল আসা পর্যন্ত অপেক্ষা
console.log("ফল:", result);`,
    },
    {
      title: "RangeError: Maximum call stack size exceeded",
      bad: `// ১ থেকে n পর্যন্ত যোগ — recursion দিয়ে
function sumTo(n) {
  return n + sumTo(n - 1); // base case নেই!
}

console.log(sumTo(5));`,
      why: "থামার শর্ত (base case) নেই, তাই `sumTo` নিজেকে ডেকেই চলে এবং প্রতিবার stack এ নতুন frame জমে। Stack এর সীমা পেরোলে engine `RangeError` ছোড়ে। বড় input এর জন্য শর্ত থাকলেও গভীর recursion একই সমস্যা দিতে পারে — তখন loop বা iterative পদ্ধতি নিরাপদ।",
      fix: `function sumTo(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) total += i; // stack বাড়ে না
  return total;
}

console.log(sumTo(5));
console.log(sumTo(1000000));`,
    },
    {
      title: "async function এ await ভুলে যাওয়া",
      bad: `async function getUser() {
  return { name: "Rina" };
}

const user = getUser(); // await নেই — এটি Promise
console.log(user.name);`,
      why: "`async function` সবসময় একটি **Promise** ফেরত দেয়। `await` ছাড়া `user` হলো সেই Promise object, যার `name` নামে কোনো property নেই — তাই `undefined`। এমন ভুলে error আসে না, শুধু নীরবে ভুল মান আসে।",
      fix: `async function getUser() {
  return { name: "Rina" };
}

const user = await getUser();
console.log(user.name);`,
    },
    {
      title: "forEach এ async callback — কেউ অপেক্ষা করে না",
      bad: `const ids = [1, 2, 3];

ids.forEach(async (id) => {
  await null; // কোনো async কাজের প্রতিনিধি
  console.log("প্রসেস হলো:", id);
});

console.log("সব শেষ!"); // আসলে শেষ হয়নি`,
      why: "`forEach` callback এর return করা Promise এর দিকে তাকায় না। প্রতিটি async callback `await` এ পৌঁছে থেমে যায়, আর `forEach` সাথে সাথে শেষ হয়ে বাইরের কোড (`সব শেষ!`) চলে। ফলে ক্রম ভেঙে যায় এবং কাজ শেষ হওয়ার আগেই ‘শেষ’ বলা হয়।",
      fix: `const ids = [1, 2, 3];

for (const id of ids) {
  await null;
  console.log("প্রসেস হলো:", id);
}

console.log("সব শেষ!");

// সমান্তরাল চালাতে চাইলে:
// await Promise.all(ids.map(async (id) => { ... }));`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "B কে সবার শেষে পাঠান",
      prompt: "নিচের কোড `A B C` print করে। শুধু `B` এর লাইনটি বদলে এমন করুন যেন output হয় `A`, `C`, `B` (আলাদা লাইনে)।",
      starter: `console.log("A");
console.log("B");
console.log("C");`,
      expected: "A\nC\nB",
      hints: ["`setTimeout` এর callback বর্তমান synchronous কোডের পরে চলে।"],
      solution: `console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");`,
      explanation: "Callback টি task queue তে যায় এবং script শেষ হলে চলে, তাই `C` আগে আসে।",
    },
    {
      level: "beginner",
      title: "Microtask আগে, timer পরে",
      prompt: "`\"micro\"` print করার একটি microtask জমা দিন (`queueMicrotask` বা `Promise.resolve().then`), যাতে output হয় `sync`, `micro`, `macro`।",
      starter: `setTimeout(() => console.log("macro"), 0);

// TODO: এখানে "micro" এর microtask জমা দিন

console.log("sync");`,
      expected: "sync\nmicro\nmacro",
      hints: ["`queueMicrotask(() => ...)` ব্যবহার করুন।", "Microtask সব task এর আগে চলে, কিন্তু synchronous কোডের পরে।"],
      solution: `setTimeout(() => console.log("macro"), 0);

queueMicrotask(() => console.log("micro"));

console.log("sync");`,
    },
    {
      level: "beginner",
      title: "Recursion ও Call Stack",
      prompt: "`countDown(n)` recursion দিয়ে `n` থেকে `1` পর্যন্ত নামুক এবং শেষে `liftoff` print করুক। `countDown(3)` এর output হবে `3`, `2`, `1`, `liftoff` (আলাদা লাইনে)।",
      starter: `function countDown(n) {
  // TODO: base case ও recursive call
}

countDown(3);`,
      expected: "3\n2\n1\nliftoff",
      hints: ["`n === 0` হলে `liftoff` print করে `return`।", "নইলে `n` print করে `countDown(n - 1)` ডাকুন।"],
      solution: `function countDown(n) {
  if (n === 0) {
    console.log("liftoff");
    return;
  }
  console.log(n);
  countDown(n - 1);
}

countDown(3);`,
      explanation: "Base case না থাকলে stack overflow হতো। প্রতিটি call এ stack এ একটি frame জমে, আর `n === 0` এ পৌঁছে একে একে pop হয়।",
    },
    {
      level: "intermediate",
      title: "await দিয়ে ক্রম ঠিক করুন",
      prompt: "এখন output `start`, `end`, `data`। `main` async function বানিয়ে এবং `load()` কে `await` করে output বদলান: `start`, `data`, `end`।",
      starter: `async function load() {
  const data = await Promise.resolve("data");
  console.log(data);
}

console.log("start");
load();
console.log("end");`,
      expected: "start\ndata\nend",
      hints: ["`load()` একটি Promise ফেরত দেয় — তাকে `await` করতে হবে।", "`await` ব্যবহারের জন্য একটি async function (এখানে `main`) এ কোড রাখুন, তারপর `main()` ডাকুন।"],
      solution: `async function load() {
  const data = await Promise.resolve("data");
  console.log(data);
}

async function main() {
  console.log("start");
  await load();
  console.log("end");
}

main();`,
      explanation: "`await load()` চলার সময় `main` থেমে থাকে। `load` শেষ হলে (microtask এ) `main` আবার শুরু হয়ে `end` print করে।",
    },
    {
      level: "intermediate",
      title: "Stack overflow এড়িয়ে যোগফল",
      prompt: "নিচের recursive `sumTo(1000000)` stack overflow ঘটায়। এটি loop দিয়ে নতুন করে লিখুন যেন `500000500000` print হয়।",
      starter: `function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}

console.log(sumTo(1000000));`,
      expected: "500000500000",
      hints: ["`let total = 0` ও `for` loop ব্যবহার করুন।", "Loop এ নতুন stack frame তৈরি হয় না।"],
      solution: `function sumTo(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}

console.log(sumTo(1000000));`,
      explanation: "১০ লাখ গভীর recursion এ stack এর সীমা (সাধারণত কয়েক হাজার থেকে কয়েক লক্ষ frame — engine ভেদে) পেরিয়ে যায়। Loop এ একটি মাত্র frame ব্যবহার হয়। (গাণিতিক সূত্র `n * (n + 1) / 2` আরও দ্রুত।)",
    },
    {
      level: "challenge",
      title: "ছোট Event Loop বানান (MiniLoop)",
      prompt: "`MiniLoop` এর `run()` লিখুন: যতক্ষণ macro task থাকবে — একটি macro task চালান (FIFO), তারপর **সব microtask** শেষ করুন (microtask নতুন microtask জমা দিলে সেগুলোও)। তারপর পরের macro task। Expected output ঠিক জানাবে আপনার loop আসল event loop এর নিয়ম মানছে কি না।",
      starter: `class MiniLoop {
  macros = [];
  micros = [];

  macro(fn) { this.macros.push(fn); }
  micro(fn) { this.micros.push(fn); }

  run() {
    // TODO
  }
}

const loop = new MiniLoop();

loop.macro(() => {
  console.log("task1");
  loop.micro(() => console.log("micro1"));
  loop.macro(() => console.log("task3"));
});
loop.macro(() => console.log("task2"));

loop.run();`,
      expected: "task1\nmicro1\ntask2\ntask3",
      hints: ["বাইরের `while (this.macros.length)` এ `this.macros.shift()()` দিয়ে একটি task চালান।", "ভেতরে আরেকটি `while (this.micros.length)` লুপে সব microtask শেষ করুন।", "`task3` task1 এর ভেতরে জমা হয়েছে — তাই `task2` এর পরে আসে।"],
      solution: `class MiniLoop {
  macros = [];
  micros = [];

  macro(fn) { this.macros.push(fn); }
  micro(fn) { this.micros.push(fn); }

  run() {
    while (this.macros.length > 0) {
      const task = this.macros.shift();
      task();
      while (this.micros.length > 0) {
        const m = this.micros.shift();
        m();
      }
    }
  }
}

const loop = new MiniLoop();

loop.macro(() => {
  console.log("task1");
  loop.micro(() => console.log("micro1"));
  loop.macro(() => console.log("task3"));
});
loop.macro(() => console.log("task2"));

loop.run();`,
      explanation: "এটি event loop এর মূল নিয়মের সরল মডেল: একটি task → সব microtask → পরের task। `task1` এর শেষে `micro1` চলে, `task2` তার আগেই queue তে ছিল তাই আগে; `task3` পরে জমা হয়েছে বলে শেষে। আসল engine এ আরও অনেক জটিলতা (একাধিক queue, rendering) আছে, কিন্তু এই কাঠামো সঠিক।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "নিচের কোডের output এর ক্রম কী? `console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); Promise.resolve().then(() => console.log(\"C\")); console.log(\"D\");`",
        options: ["A B C D", "A D C B", "A D B C", "A C D B"],
        answer: 1,
        explanation: "`A` ও `D` synchronous, তাই আগে। stack খালি হলে microtask (`C`) চলে, তারপর task (`B`)। তাই A D C B। `A D B C` ভুল কারণ timer এর ০ ms হলেও তা task, Promise এর পরে। অন্য অপশনগুলো synchronous কোডকে আগে চালানোর নিয়ম ভাঙে।",
      },
      {
        question: "নিচের কোনটি JavaScript engine এর নিজের অংশ **নয়**, বরং host এর দেওয়া?",
        options: ["Call Stack", "Memory Heap", "Garbage Collector", "`setTimeout` এর timer ব্যবস্থা"],
        answer: 3,
        explanation: "Timer host (browser/Node.js) দেয় — ECMAScript এ `setTimeout` সংজ্ঞায়িত নয়। Call Stack, Memory Heap ও garbage collector engine এর ভেতরের অংশ।",
      },
      {
        question: "শর্তহীন recursion (base case নেই) চালালে সাধারণত কী ঘটে?",
        options: ["একটি `RangeError` (stack সীমা ছাড়ানো) ছোড়া হয়", "SyntaxError আসে", "Engine নিজে loop এ রূপান্তর করে চুপচাপ চালিয়ে যায়", "program অনন্তকাল memory ছাড়া চলতে থাকে, কোনো error ছাড়াই"],
        answer: 0,
        explanation: "প্রতিটি call এ stack এ frame জমে, সীমা পেরোলে engine সাধারণত `RangeError` (V8 এ `Maximum call stack size exceeded`) ছোড়ে। SyntaxError parse এর সময়ের ভুল, runtime এর নয়। Engine recursion কে নিজে loop বানায় — এমন কোনো নিশ্চয়তা ভাষার নেই, আর stack সীমিত তাই ‘অনন্তকাল’ চলে না।",
      },
      {
        question: "`function loop() { Promise.resolve().then(loop); } loop();` চালানোর পর প্রধান প্রভাব কী?",
        options: ["প্রতিবার ঘুরে একটি করে timer চলার সুযোগ মেলে", "Engine একটি সীমা ধরে microtask থামিয়ে দেয়", "Microtask queue কখনো খালি হয় না, তাই timer ও UI এর মতো task চলার সুযোগ পায় না", "Call stack overflow হয়ে RangeError আসে"],
        answer: 2,
        explanation: "Microtask গুলো queue খালি হওয়া পর্যন্ত একটানা চলে; প্রতিটি নতুন microtask বানালে queue কখনো ফাঁকা হয় না এবং event loop পরের task এ যেতে পারে না। Stack overflow হয় না কারণ প্রতিটি callback আলাদা করে stack এ এসে বেরিয়ে যায়। প্রথম ও দ্বিতীয় অপশন এমন আচরণের গ্যারান্টি দেয় না।",
      },
      {
        question: "`setTimeout(fn, 0)` সম্পর্কে কোনটি সঠিক?",
        options: ["`fn` সাথে সাথে synchronous ভাবে চলে", "`fn` ঠিক ০ ms পরে চলার নিশ্চয়তা আছে", "`fn` একটি microtask হিসেবে চলে", "`fn` একটি task, যা বর্তমান কোড ও সব microtask শেষ হওয়ার পরে চলে — ঠিক ০ ms এ নয়"],
        answer: 3,
        explanation: "`0` শুধু ন্যূনতম delay; callback টি task queue তে গিয়ে অপেক্ষা করে। তাই এটি synchronous নয়, microtask নয়, আর সময়ের কোনো নিখুঁত নিশ্চয়তাও নেই (ভারী কাজ থাকলে আরও দেরি হয়)।",
      },
    ],
    coding: [
      {
        title: "সমান্তরাল কাজ ও Promise.all",
        prompt: "`sleep(ms)` ফাংশনটি `setTimeout` দিয়ে এমন একটি Promise ফেরত দিক যা `ms` পরে resolve হয়। তারপর `slow` (৩০ ms) ও `fast` (১০ ms) একসাথে চালান। Output: `fast done`, `slow done`, `all done`।",
        starter: `const sleep = (ms) => {
  // TODO: Promise ফেরত দিন
};

async function task(name, ms) {
  await sleep(ms);
  console.log(name, "done");
}

await Promise.all([task("slow", 30), task("fast", 10)]);
console.log("all done");`,
        expected: "fast done\nslow done\nall done",
        solution: `const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function task(name, ms) {
  await sleep(ms);
  console.log(name, "done");
}

await Promise.all([task("slow", 30), task("fast", 10)]);
console.log("all done");`,
      },
      {
        title: "Stack overflow ধরুন",
        prompt: "`runaway` নামের একটি শর্তহীন recursive function বানান এবং `try/catch` দিয়ে ধরে error এর `name` print করুন (`RangeError`)।",
        starter: `// TODO: runaway function ও try/catch
`,
        expected: "RangeError",
        solution: `function runaway() {
  runaway();
}

try {
  runaway();
} catch (e) {
  console.log(e.name);
}`,
      },
    ],
  },

  interview: [
    {
      q: "JavaScript Runtime কী এবং এর মূল অংশগুলো কী কী?",
      a: "JavaScript Runtime হলো সেই পূর্ণ পরিবেশ যেখানে আপনার কোড চলে — engine ও তাকে ঘিরে থাকা host সুবিধা মিলিয়ে। মূল অংশ: **Memory Heap** (object এর জায়গা, garbage collected), **Call Stack** (এখন কোন function চলছে), **Host APIs** (timer, network, DOM বা fs — ভাষার অংশ নয়), এবং **Event Loop সহ Queue** (task ও microtask) যা অপেক্ষমাণ callback কে stack এ আনে।\n\nউদাহরণ: browser, Node.js, Deno। Engine (V8) একই হতে পারে, কিন্তু host আলাদা বলে runtime আলাদা।",
    },
    {
      q: "Event Loop কীভাবে কাজ করে? Task ও Microtask এর পার্থক্য কী?",
      a: "Event loop বারবার দেখে call stack খালি কি না। খালি হলে আগে **microtask queue** পুরোপুরি খালি করে (Promise callback, `await` এর continuation, `queueMicrotask`), তারপর **task queue** থেকে একটি task (timer, UI event) নেয়। Browser এ এর মাঝে rendering এর সুযোগ আসতে পারে।\n\nপার্থক্যের ফল: `setTimeout(..., 0)` সবসময় `Promise.then` এর পরে চলে। আর microtask যদি অবিরাম নতুন microtask বানায়, তবে task ও rendering কখনো সুযোগ পায় না (starvation) — এটি সাক্ষাৎকারের প্রিয় প্রশ্ন।",
    },
    {
      q: "নিচের কোডের output কী এবং কেন? `console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);`",
      a: "Output: `1, 4, 3, 2`। কারণ ধাপে ধাপে: `1` ও `4` synchronous, তাই script এর মধ্যেই print হয়। `setTimeout` callback task queue তে যায়, আর `Promise.then` callback যায় microtask queue তে। Script (একটি task) শেষ হলে event loop আগে সব microtask চালায় (`3`), তারপর পরের task (`2`)।\n\nসাক্ষাৎকারে ক্রমটি শুধু বললেই চলবে না — কোন callback কোন queue তে গেল সেটিও বলুন, তাহলেই বোঝা যায় আপনি মুখস্থ নয়, মডেল বুঝেছেন।",
    },
    {
      q: "Stack overflow কেন হয় এবং কীভাবে এড়ানো যায়?",
      a: "প্রতিটি function call এ call stack এ একটি frame (local variable, return ঠিকানা, scope সংযোগ) জমে, এবং stack এর আকার সীমিত। থামার শর্ত ছাড়া recursion বা অতি গভীর recursion এ সীমা পেরোলে engine সাধারণত `RangeError` ছোড়ে। সীমাটি engine ও পরিবেশ ভেদে আলাদা।\n\nএড়ানোর উপায়: সঠিক base case, recursion এর বদলে loop বা explicit stack/queue ব্যবহার, বড় কাজ ভেঙে `setTimeout`/`await` দিয়ে ধাপে ধাপে চালানো (তাতে প্রতিবার stack খালি হয়)। ভাষা সব পরিবেশে tail call optimization নিশ্চিত করে — এমন ধরে নেবেন না।",
    },
    {
      q: "JavaScript single-threaded হয়েও একসাথে অনেক কাজ কীভাবে সামলায়? আর UI আটকে যায় কখন?",
      a: "আপনার JS কোড একটি thread এ একটি call stack এ চলে, কিন্তু অপেক্ষার কাজ (timer, network, disk) host এর ভেতরে চলে এবং শেষ হলে callback queue তে এসে event loop এর মাধ্যমে stack এ ঢোকে। তাই অপেক্ষার সময় thread মুক্ত থাকে — এটিই concurrency, parallelism নয়।\n\nUI আটকায় যখন একটি synchronous কাজ (বিশাল loop, ভারী JSON parse, ReDoS regex) দীর্ঘক্ষণ stack দখল করে রাখে — কারণ ততক্ষণ event loop কোনো task, event বা rendering এ যেতে পারে না। সমাধান: কাজ chunk করা, Web Worker/`worker_threads` এ সরানো, বা algorithm উন্নত করা।",
    },
    {
      q: "Browser ও Node.js এর event loop এ কী পার্থক্য আছে?",
      a: "দুটিই একই মূল ধারণা মানে (task + microtask), কিন্তু বাস্তবায়ন আলাদা। Browser এর event loop HTML spec এ সংজ্ঞায়িত এবং rendering এর সাথে যুক্ত (`requestAnimationFrame` rendering এর আগে চলে)। Node.js এর event loop libuv ভিত্তিক, কয়েকটি phase এ বিভক্ত (timers, I/O callback, `setImmediate` এর phase ইত্যাদি), এবং এখানে `process.nextTick` ও `setImmediate` এর মতো Node-নির্দিষ্ট scheduling আছে।\n\nসাবধানী উত্তর: Node এ main module থেকে `setTimeout(0)` বনাম `setImmediate` এর পারস্পরিক ক্রমের নিশ্চয়তা নেই (I/O callback এর ভেতর থেকে হলে `setImmediate` আগে চলে)। বিস্তারিত ক্রম Node এর সংস্করণ ও documentation দেখে নিশ্চিত করুন।",
    },
    {
      q: "`await` এর পরের কোড ঠিক কখন চলে?",
      a: "Async function প্রথম `await` পর্যন্ত synchronously চলে। `await promise` এ এসে function থেমে যায় এবং control caller কে ফেরত যায়। Awaited Promise settle হলে বাকি অংশ (continuation) একটি **microtask** হিসেবে schedule হয়।\n\nতাই `await` এর পরের কোড সবসময় বর্তমান synchronous কোডের পরে এবং পরের task (যেমন timer) এর আগে চলে। এ কারণে `await` কে ‘Promise.then এর সুন্দর রূপ’ বলা হয় — ক্রমের নিয়ম একই।",
    },
  ],

  summary: {
    takeaways: [
      "Runtime = Engine (Memory Heap + Call Stack) + Host APIs + Event Loop ও Queue।",
      "Call Stack LIFO; প্রতিটি call এ frame push, return এ pop; সীমা পেরোলে `RangeError`।",
      "Run-to-completion: একটি কাজ শেষ না হওয়া পর্যন্ত অন্য কাজ ঢোকে না — ভারী synchronous কাজ পুরো runtime আটকায়।",
      "ক্রমের নিয়ম: synchronous → সব microtask (`Promise.then`, `await`, `queueMicrotask`) → একটি task (`setTimeout`, event) → আবার।",
      "`setTimeout(fn, 0)` মানে ‘ন্যূনতম ০ ms, তারপর task queue তে’ — তাৎক্ষণিক নয়।",
      "Microtask এ অবিরাম microtask জমলে task/rendering starvation ঘটে।",
      "Browser ও Node.js এর host API ও event loop বাস্তবায়ন আলাদা; `process.nextTick`, `setImmediate` শুধু Node.js এ।",
    ],
    syntax: `// ক্রম: sync -> microtask -> task
console.log("sync");
queueMicrotask(() => console.log("microtask"));
Promise.resolve().then(() => console.log("promise"));
setTimeout(() => console.log("task"), 0);

// ভারী কাজ ভেঙে event loop কে ছাড়া
const yieldNow = () => new Promise((r) => setTimeout(r, 0));
await yieldNow();`,
    whenToUse: [
      "Async কোডের output ক্রম অনুমান বা debug করতে — কোন callback কোন queue তে তা চিহ্নিত করুন।",
      "দীর্ঘ synchronous কাজ (>৫০ ms) পেলে chunk করুন বা Worker এ সরান।",
      "Recursion গভীর হতে পারলে loop বা explicit stack বেছে নিন।",
      "UI ও server এ responsiveness নিশ্চিত করতে — event loop কখনো আটকে রাখবেন না।",
    ],
    next: [
      "How JavaScript works in the browser — script load, DOM, rendering pipeline",
      "Asynchronous JavaScript — Callbacks, Promises, async/await এর গভীর আলোচনা",
      "Functions, Scope ও Closure",
      "Memory Management ও Garbage Collection",
    ],
  },

  compatibility:
    "`Promise`, `async/await`, `queueMicrotask`, `setTimeout` সব আধুনিক browser ও Node.js এ আছে (`queueMicrotask` ও top-level `await` ES module পরিবেশে আধুনিক সংস্করণে সমর্থিত)। Event loop এর মূল মডেল (task + microtask) দুই পরিবেশেই একই, কিন্তু বিস্তারিত আলাদা: `requestAnimationFrame`/`requestIdleCallback` শুধু browser এ (`requestIdleCallback` সব browser এ নেই); `process.nextTick`, `setImmediate` শুধু Node.js এ। এই Playground একটি Web Worker এ চলে — সেখানে timer ও Promise কাজ করে, কিন্তু DOM ও `requestAnimationFrame` এর মতো window context এর API নেই।",
};
