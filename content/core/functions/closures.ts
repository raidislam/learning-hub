import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Closure কী — ‘function + তার জন্মস্থানের lexical environment’ — এবং কেন outer function ফিরে গেলেও variable বেঁচে থাকে (reachability) তা explain করতে পারবেন।",
    "Closure দিয়ে private state, counter, function factory, module pattern, `once`, `memoize` ও partial application লিখতে পারবেন।",
    "Closure যে **variable** ধরে, **মান** নয় — তা প্রমাণসহ বুঝবেন এবং loop closure bug (`var` বনাম `let`) ও stale closure bug চিনে ঠিক করতে পারবেন।",
    "Event handler ও React hooks এর stale closure সমস্যা plain JavaScript সিমুলেশন দিয়ে বুঝবেন।",
    "Closure ও `#private` class field এর তুলনা করে সঠিক জায়গায় সঠিকটি বেছে নিতে পারবেন।",
    "Closure এর memory ঝুঁকি (বড় object ধরে রাখা, listener leak) চিনে কীভাবে এড়াতে হয় তা জানবেন।",
  ],

  concept: [
    { type: "h3", text: "Closure কী?" },
    {
      type: "p",
      text: "**Closure** হলো একটি function এবং সেই **lexical environment** এর সংযুক্ত জুটি, যেখানে function টি তৈরি হয়েছিল। Lexical Scope ও Scope Chain lesson এ দেখেছি: প্রতিটি function তৈরির সময় তার outer environment এর reference সাথে রাখে। Closure হলো সেই ধারণারই সবচেয়ে দৃশ্যমান পরিণতি — **function তার জন্মস্থানের variable গুলো ‘মনে রাখে’, জন্মস্থান ছেড়ে চলে গেলেও।**",
    },
    {
      type: "p",
      text: "প্রযুক্তিগত দিক থেকে JavaScript এর **প্রতিটি function ই closure** (সে তার outer environment এর reference ধরে আছে)। কিন্তু কথায় আমরা ‘closure’ বলি তখনই, যখন এই ধরে-রাখা ব্যাপারটি **গুরুত্বপূর্ণ** — অর্থাৎ ভেতরের function তার outer function এর শেষ হওয়ার **পরেও** outer এর variable ব্যবহার করে।",
    },
    {
      type: "code",
      code: `function makeCounter() {
  let count = 0;               // makeCounter এর local variable

  return function increment() {
    count += 1;                // free variable: বাইরের count ব্যবহার
    return count;
  };
}

const counter = makeCounter(); // makeCounter এখানেই শেষ (return করেছে)
console.log(counter());        // 1
console.log(counter());        // 2 — count এখনো বেঁচে আছে!
console.log(typeof count);     // undefined: বাইরে থেকে count এ সরাসরি পৌঁছানো যায় না`,
      caption: "`makeCounter()` ফিরে গেছে, তবু `increment` এর ভেতর দিয়ে `count` বেঁচে আছে এবং শুধু সেখান দিয়েই পৌঁছানো যায়।",
    },
    { type: "h3", text: "ভেতরে কীভাবে কাজ করে: কেন variable বেঁচে থাকে?" },
    {
      type: "p",
      text: "‘Function শেষ হলে তার local variable মুছে যায়’ — এই সরল ধারণাটি সম্পূর্ণ সঠিক নয়। প্রকৃত নিয়ম: JavaScript এর memory management **reachability** এর ওপর চলে। যতক্ষণ কোনো live reference দিয়ে একটি object/environment এ পৌঁছানো **সম্ভব**, ততক্ষণ সেটি মুছে ফেলা যাবে না। কোথাও থেকে পৌঁছানো না গেলে garbage collector সেটিকে সাধারণভাবে মুছে ফেলার যোগ্য মনে করে (Garbage Collection lesson এ বিস্তারিত)।",
    },
    {
      type: "ol",
      items: [
        "`makeCounter()` call হলে একটি নতুন environment তৈরি হয়: `{ count: 0 }`, এবং `increment` function তৈরি হয় — যার [[Environment]] (outer reference) এই environment এর দিকে।",
        "`makeCounter` `increment` কে return করে। Call stack থেকে `makeCounter` এর frame সরে যায়।",
        "কিন্তু `counter` variable (global) → `increment` function → তার outer reference → `{ count }` environment। এই শৃঙ্খল ধরে environment এ পৌঁছানো যায় — **reachable**। তাই সেটি বেঁচে থাকে।",
        "`counter()` call হলে নতুন call environment তৈরি হয় যার outer ওই বেঁচে থাকা environment; `count` খোঁজা হলে chain ধরে পাওয়া যায় এবং **সেই একই binding** বদলায়।",
        "`counter` (এবং অন্য সব reference) অদৃশ্য হলে environment ও unreachable হয়, তখন memory ফেরত পাওয়ার যোগ্য।",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Call stack বনাম heap",
      text: "Call stack এর frame function শেষ হলে সরে যায়। কিন্তু closure এ ধরা environment সাধারণভাবে **heap** এ থাকে (engine implementation এর বিবরণ — এটি spec এ নির্দিষ্ট নয়), তাই stack খালি হলেও সেটি বেঁচে থাকে। এই কারণেই ‘variable stack এ থাকে’ ধরনের সরল মডেল closure ব্যাখ্যা করতে পারে না। (আধুনিক engine সাধারণত কেবল সেই variable গুলোই এভাবে ধরে রাখে যেগুলো সত্যিই কোনো inner function ব্যবহার করে।)",
    },
    { type: "h3", text: "Closure variable ধরে, মান নয়" },
    {
      type: "p",
      text: "Closure বাইরের variable এর **মান copy করে না**; সে ওই **binding** এর live reference ধরে রাখে। ফলে binding এর মান বদলালে closure নতুন মান দেখে — এবং closure ভেতর থেকে মান বদলালে বাইরের কোডও তা দেখে। একাধিক closure একই environment ভাগ করলে তারা একই binding নিয়ে কাজ করে।",
    },
    {
      type: "code",
      code: `function demo() {
  let msg = "old";
  const show = () => msg;     // মান নয়, msg binding ধরছে
  const change = (v) => { msg = v; };

  msg = "new";                // closure তৈরির পরে বদলালাম
  console.log(show());        // "new"

  change("newer");
  console.log(msg);           // "newer" — closure বাইরের variable বদলাতে পারে
}
demo();`,
      caption: "প্রমাণ: closure তৈরির পরেও variable বদলালে closure নতুন মান পায়।",
    },
    { type: "h3", text: "Closure এর প্রধান ব্যবহার" },
    {
      type: "ul",
      items: [
        "**State ধরে রাখা ও private data (encapsulation):** `count`, `cache`, `balance` — বাইরে থেকে সরাসরি পরিবর্তন করা যায় না; কেবল দেওয়া function দিয়ে।",
        "**Function factory:** `makeAdder(5)`, `createLogger(\"auth\")` — configuration সহ নতুন function তৈরি।",
        "**Partial application / currying:** কিছু argument আগে ‘বসিয়ে’ রাখা function।",
        "**Memoization ও caching:** `memoize(fn)` এর ভেতরে `cache` লুকানো।",
        "**`once`, `debounce`, `throttle`:** flag/timer ID closure এ রাখা।",
        "**Event handler ও callback:** handler তৈরির সময়ের context ধরে রাখে (যেমন কোন item এর button)।",
        "**Module pattern:** পুরোনো কিন্তু শেখার মতো — IIFE + closure দিয়ে private/public আলাদা করা (আধুনিক ES Module এ module scope ই এই কাজ করে)।",
      ],
    },
    { type: "h3", text: "Closure বনাম `#private` class field" },
    {
      type: "p",
      text: "ES2022 থেকে class এ `#count` এর মতো **private field** আছে — এটিও data hiding দেয়। দুটির পার্থক্য: closure এ privacy আসে *scope* থেকে (কোনো কিছু ‘দেখতে পাওয়া’র অধিকার না থাকলে পৌঁছানোই যায় না), private field এ আসে *language এর access rule* থেকে (class body এর বাইরে `#x` লেখা SyntaxError)। Private field এ `instanceof`, inheritance ও tooling সহজ, প্রতি instance এ method ভাগ হয় (prototype এ), যেখানে closure-factory এ প্রতি call এ নতুন function তৈরি হয়। আবার factory তে `this` নিয়ে ঝামেলা নেই এবং হালকা functional ধাঁচ।",
    },
    {
      type: "compare",
      headers: ["বৈশিষ্ট্য", "Closure (factory)", "`#private` class field"],
      rows: [
        ["Privacy এর উৎস", "Scope (variable টি দেখাই যায় না)", "Language rule (`#x` class এর বাইরে অবৈধ)"],
        ["প্রতি instance এ method", "সাধারণত প্রতি call এ নতুন function তৈরি", "Prototype এ ভাগ হয়"],
        ["`this` সমস্যা", "নেই (আসলে `this` লাগেই না)", "আছে (method আলাদা করলে `this` হারায়)"],
        ["`instanceof` / inheritance", "সহজ নয়", "স্বাভাবিক"],
        ["উপযোগী", "ছোট utility, hook-সদৃশ কোড, private helper", "বহু instance, domain model, inheritance"],
      ],
    },
    {
      type: "code",
      code: `// ১) Closure দিয়ে
function createCounter() {
  let count = 0;
  return { inc: () => ++count, get: () => count };
}

// ২) #private field দিয়ে (ES2022)
class Counter {
  #count = 0;
  inc() { return ++this.#count; }
  get() { return this.#count; }
}

const a = createCounter();
const b = new Counter();
a.inc(); b.inc(); b.inc();
console.log(a.get(), b.get());
console.log(a.count, b.count);   // দুটিতেই সরাসরি পৌঁছানো যায় না: undefined undefined`,
      caption: "দুটিই state লুকায় — ভিন্ন কৌশলে।",
    },
    { type: "h3", text: "Loop closure bug: `var` বনাম `let`" },
    {
      type: "p",
      text: "Variables lesson এ প্রথম দেখেছি। `for (var i ...)` এ পুরো function এ **একটি** `i`, তাই loop এ তৈরি সব closure একই `i` ধরে — loop শেষে সবাই শেষ মান (যেমন `3`) দেখে। `for (let i ...)` এ প্রতিটি iteration এর জন্য নতুন binding তৈরি হয়, তাই প্রতিটি closure নিজের `i` ধরে। এখানে ‘closure মান নয়, binding ধরে’ নিয়মটিই কাজ করছে: `var` এ binding একটি, `let` এ প্রতি iteration এ একটি। (পুরোনো কোডে সমাধান ছিল IIFE দিয়ে প্রতি iteration এ নতুন function scope বানানো — আজ `let` ই যথেষ্ট।)",
    },
    { type: "h3", text: "Stale closure: React hooks এর বাস্তব সমস্যা" },
    {
      type: "p",
      text: "React এ component function প্রতিটি render এ আবার call হয়; তাই প্রতি render এর নিজস্ব environment তৈরি হয় — সেই render এর `count` এর মান সহ (`const [count] = useState(0)` প্রতি render এ নতুন `const`)। ওই render এ তৈরি handler/effect/timer callback সেই render এর `count` ধরে রাখে — পরের render এ `count` বদলালেও সে **পুরোনোটিই** দেখে। একে **stale closure** বলে। এটি React এর বিশেষ bug নয়, closure এর স্বাভাবিক আচরণ। নিচে plain JS এ সিমুলেশন (React কোড নয়, কেবল ধারণা):",
    },
    {
      type: "code",
      code: `let state = 0;                        // React এর বাইরে রাখা "state store"

function render() {
  const count = state;                // এই render এর snapshot (const [count] এর মতো)
  return {
    logLater: () => console.log("count:", count),
    incrementStale: () => { state = count + 1; },        // পুরোনো count ধরে
    incrementFresh: () => { state = state + 1; },        // সবসময় বর্তমান মান (updater এর মতো)
  };
}

const r1 = render();
r1.incrementStale();
r1.incrementStale();                  // দুবার ডাকলাম, কিন্তু count=0 ধরা, তাই state=1
console.log("stale ফল:", state);      // 1

state = 0;
const r2 = render();
r2.incrementFresh();
r2.incrementFresh();
console.log("fresh ফল:", state);      // 2

const r3 = render();                  // নতুন render
r1.logLater();                        // পুরোনো render এর count
r3.logLater();                        // নতুন render এর count`,
      caption: "এই কোড plain JS — React না। ‘প্রতি render = একটি করে environment’ ভাবলেই stale closure এর ধরন বোঝা যায়। React এ সমাধান: functional updater (`setCount(c => c + 1)`), সঠিক dependency array, বা `useRef`।",
    },
    {
      type: "p",
      text: "Timer এর ক্ষেত্রেও একই: `setTimeout`/`setInterval` এর callback তৈরির মুহূর্তের variable (যদি সেটি `const` snapshot হয়) ধরে রাখে। Variable নিজেই যদি `let` হয় ও পরে বদলায়, callback **নতুন মান** দেখবে (binding ধরে বলে); কিন্তু যদি callback এর ভেতর থেকে আলাদা snapshot (প্যারামিটার, `const x = state`) নেওয়া হয়ে থাকে, তা পুরোনো থেকে যায়। কোনটি আপনি চাইছেন তা সচেতনভাবে ঠিক করুন।",
    },
    { type: "h3", text: "Memory ঝুঁকি" },
    {
      type: "p",
      text: "Closure বেঁচে থাকলে তার ধরা environment ও বাঁচে — তাই **দীর্ঘস্থায়ী** callback (যেমন যে event listener কখনো সরানো হয় না, global registry এ রাখা function, অনেকক্ষণ চলা interval) যদি বড় object ধরে রাখে, তবে সেই memory মুক্ত হয় না। এটি সবসময় ‘leak’ নয়; অনেক সময় প্রত্যাশিত আচরণ — কিন্তু অনিচ্ছাকৃত হলে সমস্যা। আধুনিক engine সাধারণত শুধু ব্যবহৃত variable ধরে রাখার চেষ্টা করে, তবে একই scope এর একাধিক closure এ context ভাগ হওয়া ইত্যাদি কারণে কিছু engine এ প্রত্যাশার চেয়ে বেশি কিছু বেঁচে থাকতে পারে — সঠিক আচরণ engine ও সংস্করণ নির্ভর, তাই DevTools এর Memory profiler দিয়ে মেপে দেখুন।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "Memory বাঁচানোর অভ্যাস",
      text: "**(১)** যে listener/interval/subscription আর দরকার নেই তা সরান (`removeEventListener`, `clearInterval`, unsubscribe)। React এ `useEffect` এর cleanup function এ এটিই করা হয়। **(২)** Closure এ পুরো বড় object না ধরে শুধু প্রয়োজনীয় অংশ (`const id = user.id`) নিয়ে ব্যবহার করুন। **(৩)** দীর্ঘজীবী cache এর আকার সীমিত রাখুন (unbounded `memoize` একটি সাধারণ leak)। **(৪)** দরকার শেষ হলে reference `null` করে দিন।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "সাধারণ ভুল ধারণা",
      text: "**(১)** ‘Closure মানে মান copy’ — না, variable (binding) ধরা। **(২)** ‘Closure মানে শুধু নেস্টেড function’ — কেবল function এর ভেতরে function নয়, যেকোনো function ই তার outer environment ধরে; তবে বাইরে বেরিয়ে গেলে প্রভাবটি দেখা যায়। **(৩)** ‘Closure সবসময় memory leak করে’ — না; unreachable হলে মুক্ত হয়। **(৪)** ‘Closure জিনিসটি React এর’ — না, ভাষার মূল বৈশিষ্ট্য। **(৫)** ‘প্রতিটি closure এর নিজস্ব আলাদা copy’ — একই environment ভাগ করলে একাধিক closure একই binding ব্যবহার করে।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Browser বনাম Node.js",
      text: "Closure এর আচরণ ECMAScript এর অংশ, তাই browser, Node.js ও Web Worker এ একই। পার্থক্য কেবল চারপাশে: browser এ DOM event listener এর closure DOM node ধরে রাখতে পারে (leak এর কারণ হতে পারে); Node.js এ server এর long-lived callback (request handler, global cache) এ সতর্ক থাকতে হয়। Profiling এর টুল ভিন্ন (Chrome DevTools Memory, `node --inspect`)।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "কল্পনা করুন একজন দোকানদার ছোট একটি **স্মার্ট বক্স** (function) বানিয়ে আপনাকে দিলেন। বক্স বানানোর সময় তিনি নিজের দোকানের একটি **নোটবুক** (environment) বক্সের ভেতরে ঢুকিয়ে সিল করে দিলেন। দোকানদার পরে দোকান বন্ধ করে চলে গেলেন (outer function শেষ)।",
    },
    {
      type: "ul",
      items: [
        "**স্মার্ট বক্স = ভেতরের function।** আপনি যেখানে খুশি নিয়ে যেতে পারেন (return করা, callback এ পাঠানো)।",
        "**বক্সের ভেতরের নোটবুক = closure এর ধরা environment।** বক্স খুললেই আপনি নোটবুক দেখতে ও তাতে লিখতে পারেন, যদিও দোকানদার আর নেই।",
        "**নোটবুকের লেখা বদলালে পরের বার বক্স খুললে নতুন লেখা পাবেন = closure binding ধরে, মান নয়।** ফটোকপি (copy) দেওয়া হয়নি; আসল নোটবুকটিই বক্সে আছে।",
        "**একই দোকানদারের বানানো দুটি বক্স একই নোটবুক ভাগ করলে একটিতে লেখা অন্যটিতেও দেখা যাবে = একই environment এর একাধিক closure।** আর দুইজন আলাদা দোকানদার বা দুবার বানানো বক্সের নোটবুক আলাদা (প্রতি `makeCounter()` call এ নতুন)।",
        "**নোটবুকটি অন্য কেউ সরাসরি পড়তে পারে না = private state।** শুধু বক্সের মাধ্যমেই।",
        "**বক্স যতদিন আপনার কাছে আছে, নোটবুকও আছে; বক্স ফেলে দিলে (reference হারালে) নোটবুকও আবর্জনা সংগ্রাহক নিয়ে যেতে পারে = reachability।** আর যদি বক্সে মস্ত বড় একটি ফাইল-ক্যাবিনেটও ঢোকানো থাকে এবং বক্স বহুদিন ফেলা না হয়, তবে বিশাল জায়গা আটকে থাকে = memory ঝুঁকি।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "Outer function ফিরে গেলেও environment বেঁচে থাকে",
      caption: "কোড: `function makeCounter(){ let count=0; return () => ++count; }  const counter = makeCounter(); counter(); counter();`",
      nodes: [
        { id: "stack", label: "Call Stack", sub: "চলমান call" },
        { id: "env", label: "makeCounter environment", sub: "heap এ (সাধারণভাবে)" },
        { id: "fn", label: "counter (function)", sub: "closure" },
        { id: "global", label: "Global", sub: "counter variable" },
      ],
      steps: [
        {
          active: ["stack", "env"],
          items: {
            stack: ["makeCounter()", "(global code)"],
            env: ["count = 0"],
            fn: ["(এখনো তৈরি হয়নি)"],
            global: ["counter = ?"],
          },
          note: "`makeCounter()` call হলো। stack এ তার frame উঠল এবং environment এ `count = 0` তৈরি হলো।",
        },
        {
          active: ["env", "fn"],
          items: {
            stack: ["makeCounter()", "(global code)"],
            env: ["count = 0"],
            fn: ["() => ++count", "outer → makeCounter environment"],
            global: ["counter = ?"],
          },
          note: "ভেতরের arrow function তৈরি হলো। তৈরির মুহূর্তেই সে নিজের **outer reference** হিসেবে `makeCounter` এর environment কে ধরল — এই সংযোগটিই closure।",
        },
        {
          active: ["global", "fn", "env"],
          items: {
            stack: ["(global code)"],
            env: ["count = 0", "⇐ fn এর reference দিয়ে reachable"],
            fn: ["() => ++count", "outer → makeCounter environment"],
            global: ["counter → fn"],
          },
          note: "`makeCounter` **return করল** — stack থেকে তার frame সরে গেল। কিন্তু `counter` → function → outer reference → environment, এই শৃঙ্খলে environment এখনো **reachable**, তাই সরানো হয়নি। `count` বেঁচে আছে!",
        },
        {
          active: ["stack", "fn", "env"],
          items: {
            stack: ["counter()", "(global code)"],
            env: ["count = 1  (বদলাল)"],
            fn: ["() => ++count"],
            global: ["counter → fn"],
          },
          note: "`counter()` call। নতুন call environment এর outer = বেঁচে থাকা `makeCounter` environment; `count` খুঁজে পেয়ে **সেই একই binding** `1` করল।",
          output: "1",
        },
        {
          active: ["stack", "fn", "env"],
          items: {
            stack: ["counter()", "(global code)"],
            env: ["count = 2  (আবার বদলাল)"],
            fn: ["() => ++count"],
            global: ["counter → fn"],
          },
          note: "আবার call — একই environment, `count = 2`। প্রতিটি call এর নিজস্ব local environment তৈরি ও শেষ হলেও closure এর ধরা environment টিই স্থায়ী state রাখে। `counter` এর কোনো reference না থাকলে (যেমন `counter = null`) environment unreachable হয়ে মুছে ফেলার যোগ্য হতো।",
          output: "2",
        },
      ],
    },
    {
      kind: "memory-steps",
      title: "Closure মান নয়, variable (binding) ধরে",
      caption: "`show` তৈরির পরে `msg` বদলালেও `show()` নতুন মান দেখায়।",
      code: 'let msg = "old";\nconst show = () => msg;\nmsg = "new";\nconsole.log(show());',
      steps: [
        {
          line: 0,
          memory: [
            { name: "msg", value: '"old"', kind: "let", state: "live" },
            { name: "show", value: "", kind: "const", state: "tdz" },
          ],
          note: "`msg` তৈরি, মান `\"old\"`। `show` এখনো initialize হয়নি।",
        },
        {
          line: 1,
          memory: [
            { name: "msg", value: '"old"', kind: "let", state: "live" },
            { name: "show", value: "→ fn (msg ধরে আছে)", kind: "const", state: "live" },
          ],
          note: "`show` তৈরি হলো। সে `msg` এর মান `\"old\"` copy করেনি — সে `msg` **binding** এর reference ধরেছে (outer environment এর মাধ্যমে)।",
        },
        {
          line: 2,
          memory: [
            { name: "msg", value: '"new"', kind: "let", state: "live" },
            { name: "show", value: "→ fn (msg ধরে আছে)", kind: "const", state: "live" },
          ],
          note: "`msg` এর মান বদলে `\"new\"` হলো। binding একই, শুধু তার ভেতরের মান বদলেছে।",
        },
        {
          line: 3,
          memory: [
            { name: "msg", value: '"new"', kind: "let", state: "live" },
            { name: "show", value: "→ fn (msg ধরে আছে)", kind: "const", state: "live" },
          ],
          output: "new",
          note: "`show()` call হলে `msg` খুঁজে binding এর **বর্তমান** মান `\"new\"` পায়। copy হলে `\"old\"` আসত — আসেনি।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Loop closure: var এ একটি `i`, let এ প্রতি iteration এ একটি",
      caption: "কোড: `for (var i=0;i<3;i++) fns.push(() => i)` বনাম `for (let i=0;i<3;i++) fns.push(() => i)`। পরে সব fn call করা হলো।",
      nodes: [
        { id: "binding", label: "i binding(s)", sub: "variable গুলো" },
        { id: "f0", label: "fn 0", sub: "প্রথম closure" },
        { id: "f1", label: "fn 1", sub: "দ্বিতীয় closure" },
        { id: "f2", label: "fn 2", sub: "তৃতীয় closure" },
      ],
      steps: [
        {
          active: ["binding"],
          items: {
            binding: ["var i  (একটিই, পুরো function এ)"],
            f0: ["→ ওই i"],
            f1: ["→ ওই i"],
            f2: ["→ ওই i"],
          },
          note: "**`var` এ:** loop চলার সময় তিনটি function তৈরি হলো, কিন্তু তিনটিই **একই `i` binding** ধরে আছে।",
        },
        {
          active: ["binding", "f0", "f1", "f2"],
          items: {
            binding: ["var i = 3  (loop শেষে)"],
            f0: ["→ i  = 3"],
            f1: ["→ i  = 3"],
            f2: ["→ i  = 3"],
          },
          note: "Loop শেষ হওয়ার সময় `i` এর মান `3`। এখন যেকোনো fn call করলে একই binding পড়ে — তিনটিই `3` দেয়।",
          output: "[ 3, 3, 3 ]",
        },
        {
          active: ["binding"],
          items: {
            binding: ["let i#0 = 0", "let i#1 = 1", "let i#2 = 2"],
            f0: ["→ i#0"],
            f1: ["→ i#1"],
            f2: ["→ i#2"],
          },
          note: "**`let` এ:** প্রতিটি iteration এর জন্য নতুন `i` binding তৈরি হয় (spec এ per-iteration binding), তাই প্রতিটি closure আলাদা binding ধরে।",
        },
        {
          active: ["f0", "f1", "f2"],
          items: {
            binding: ["i#0 = 0", "i#1 = 1", "i#2 = 2"],
            f0: ["→ i#0 = 0"],
            f1: ["→ i#1 = 1"],
            f2: ["→ i#2 = 2"],
          },
          note: "এখন fn গুলো call করলে প্রতিটি নিজের iteration এর মান দেয়। একই closure নিয়ম, শুধু binding এর সংখ্যা আলাদা।",
          output: "[ 0, 1, 2 ]",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "প্রথম closure: counter ও স্বতন্ত্র state",
      description: "প্রতিটি `makeCounter()` call নিজস্ব `count` সহ নতুন closure তৈরি করে। বাইরে থেকে `count` এ পৌঁছানো যায় না।",
      code: `function makeCounter() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}

const c1 = makeCounter();
const c2 = makeCounter();

console.log(c1(), c1(), c1());
console.log(c2());
console.log(typeof count);`,
    },
    {
      level: "intermediate",
      title: "Variable বনাম মান, loop bug এবং once",
      description: "চারটি মৌলিক closure আচরণ: (১) binding ধরা, (২) `var` loop bug, (৩) `let` সমাধান, (৪) `once` দিয়ে flag ধরে রাখা।",
      code: `// ১) closure variable ধরে
function demo() {
  let msg = "old";
  const show = () => msg;
  msg = "new";
  return show();
}
console.log("১.", demo());

// ২) var: সবাই একই i
const withVar = [];
for (var i = 0; i < 3; i++) {
  withVar.push(() => i);
}
console.log("২.", withVar.map((f) => f()));

// ৩) let: প্রতি iteration এ নতুন binding
const withLet = [];
for (let j = 0; j < 3; j++) {
  withLet.push(() => j);
}
console.log("৩.", withLet.map((f) => f()));

// ৪) once: called ও result closure এ লুকানো
function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}
const init = once(() => {
  console.log("init running");
  return 42;
});
console.log("৪.", init(), init());`,
    },
    {
      level: "real-world",
      title: "Mini store: private state, subscribe ও unsubscribe",
      description: "Redux/Zustand এর মূল ধারণা: `state` ও `listeners` closure এ লুকানো; বাইরে থেকে কেবল `getState`, `dispatch`, `subscribe` দিয়ে কাজ। Unsubscribe function ও একটি closure।",
      code: `function createStore(reducer, initialState) {
  let state = initialState;          // private
  const listeners = new Set();       // private

  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action);
      for (const listener of listeners) listener(state);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);   // unsubscribe: listener ধরে আছে
    },
  };
}

function cartReducer(state, action) {
  switch (action.type) {
    case "add":
      return { ...state, items: [...state.items, action.item] };
    case "clear":
      return { ...state, items: [] };
    default:
      return state;
  }
}

const store = createStore(cartReducer, { items: [] });
const unsubscribe = store.subscribe((s) => console.log("items:", s.items.length));

store.dispatch({ type: "add", item: "Pen" });
store.dispatch({ type: "add", item: "Book" });
unsubscribe();                                    // আর notify হবে না
store.dispatch({ type: "clear" });

console.log(store.getState());
console.log(store.state);                         // undefined: state সরাসরি পাওয়া যায় না`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
function makeGreeter(greeting) {
  return (name) => greeting + ", " + name + "!";
}
console.log(makeGreeter("Hello")("Rina"));
`,
    },
    {
      label: "Closure বনাম #private field",
      code: `function createAccount(balance) {
  return {
    deposit(n) { balance += n; return balance; },
    getBalance: () => balance,
  };
}

class Account {
  #balance;
  constructor(balance) { this.#balance = balance; }
  deposit(n) { this.#balance += n; return this.#balance; }
  getBalance() { return this.#balance; }
}

const a = createAccount(100);
const b = new Account(100);
console.log(a.deposit(50), b.deposit(50));
console.log(a.balance, b.balance);

// #private class এর বাইরে লেখা SyntaxError, তাই এখানে শুধু মন্তব্যে:
// console.log(b.#balance);   // SyntaxError

const getBalance = b.getBalance;
try {
  console.log(getBalance());   // method আলাদা করলে this হারায়
} catch (e) {
  console.log(e.name);
}
console.log(a.getBalance.call(null));  // closure এ this লাগে না`,
    },
    {
      label: "memoize ও partial application",
      code: `function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("cache hit:", key);
      return cache.get(key);
    }
    const value = fn(...args);
    cache.set(key, value);
    return value;
  };
}

const slowAdd = (a, b) => a + b;
const fastAdd = memoize(slowAdd);
console.log(fastAdd(1, 2));
console.log(fastAdd(1, 2));

function partial(fn, ...preset) {
  return (...rest) => fn(...preset, ...rest);
}
const greet = (greeting, name) => greeting + ", " + name;
const sayHello = partial(greet, "Hello");
console.log(sayHello("Rina"));`,
    },
    {
      label: "Stale closure ও timer",
      code: `let count = 0;

function schedule() {
  const snapshot = count;                   // মান এখনই copy হলো
  setTimeout(() => {
    console.log("snapshot:", snapshot, "| live:", count);
  }, 0);
}

schedule();
count = 5;                                  // timer চলার আগেই বদলালাম`,
    },
    {
      label: "React এর useState (সরলীকৃত সিমুলেশন)",
      code: `// ভান করছি: React এর মতো প্রতি render এ আবার component function call হয়
let stored = 0;                            // "state"

function Component() {
  const count = stored;                    // এই render এর snapshot
  const setCount = (next) => { stored = typeof next === "function" ? next(stored) : next; };

  return {
    count,
    badIncrement: () => setCount(count + 1),
    goodIncrement: () => setCount((c) => c + 1),
  };
}

const first = Component();
first.badIncrement();
first.badIncrement();
console.log("bad দুবার:", stored);

stored = 0;
const second = Component();
second.goodIncrement();
second.goodIncrement();
console.log("good দুবার:", stored);`,
    },
  ],

  debugging: [
    {
      title: "Loop এ সব callback একই মান দেখে (var + timer)",
      bad: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("item", i), 0);
}`,
      why: "`var i` পুরো scope এ একটিই binding, তিনটি callback ই সেটি ধরে আছে। Callback গুলো loop শেষে চলে, তখন `i === 3` — তাই তিনবারই `3`। Closure মান নয়, binding ধরে। `let` প্রতি iteration এ নতুন binding বানায়। (পুরোনো সমাধান: IIFE।)",
      fix: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log("item", i), 0);
}`,
    },
    {
      title: "Stale closure: পরপর দুবার increment, ফল ১",
      bad: `let state = 0;

function render() {
  const count = state;
  return {
    increment: () => { state = count + 1; },
  };
}

const view = render();
view.increment();
view.increment();
console.log(state);`,
      why: "`increment` ওই render এর `count` (যা `0`) ধরে আছে। তাই দুবার ডাকলেও `state = 0 + 1` — দুবারই `1`। React এ `setCount(count + 1)` দুবার ডাকলে ঠিক এমনই হয়। সমাধান: ‘বর্তমান মানের ওপর ভিত্তি করে’ আপডেট (functional updater) — পুরোনো snapshot এর ওপর নয়।",
      fix: `let state = 0;
const setState = (next) => {
  state = typeof next === "function" ? next(state) : next;
};

function render() {
  return {
    increment: () => setState((prev) => prev + 1),   // সবসময় বর্তমান মান
  };
}

const view = render();
view.increment();
view.increment();
console.log(state);`,
    },
    {
      title: "Factory এর state ভাগ হয়ে যাচ্ছে (state বাইরে রাখা হয়েছে)",
      bad: `let count = 0;                 // factory এর বাইরে — সবাই ভাগ করছে

function makeCounter() {
  return () => ++count;
}

const a = makeCounter();
const b = makeCounter();

a();
a();
console.log(b());              // আশা: 1`,
      why: "প্রত্যেক counter এর নিজস্ব state চাইলে `count` কে **factory function এর ভেতরে** declare করতে হবে, যাতে প্রতি call এ নতুন environment তৈরি হয়। বাইরে রাখলে সব closure একই global binding ধরে, তাই `b()` পায় `3`।",
      fix: `function makeCounter() {
  let count = 0;               // প্রতি call এ নতুন
  return () => ++count;
}

const a = makeCounter();
const b = makeCounter();

a();
a();
console.log(b());`,
    },
    {
      title: "memoize এ ভুল cache key: শুধু প্রথম argument দিয়ে",
      bad: `function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = args[0];
    if (cache.has(key)) return cache.get(key);
    const value = fn(...args);
    cache.set(key, value);
    return value;
  };
}

const add = memoize((a, b) => a + b);
console.log(add(1, 2));
console.log(add(1, 3));`,
      why: "Cache closure এ ঠিকই লুকানো, কিন্তু key হিসেবে কেবল প্রথম argument ধরায় `add(1, 3)` কে `add(1, 2)` এর ফল (`3`) ফেরত দেয় — ভুল (`4` হওয়ার কথা)। Key এ সব argument থাকতে হবে। (দ্রষ্টব্য: `JSON.stringify` কেবল সাধারণ মানের জন্য ভালো; function, `undefined`, circular object এ সীমাবদ্ধতা আছে।)",
      fix: `function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const value = fn(...args);
    cache.set(key, value);
    return value;
  };
}

const add = memoize((a, b) => a + b);
console.log(add(1, 2));
console.log(add(1, 3));`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "Counter এর state ধরে রাখুন",
      prompt: "`makeCounter` প্রতিবার `1` ফেরত দেয় কারণ `count` function এর ভেতরেই নতুন করে তৈরি হচ্ছে। `count` সরিয়ে এমন জায়গায় আনুন যেন output হয় `1`, `2`, `3`।",
      starter: `function makeCounter() {
  return function () {
    let count = 0;
    count += 1;
    return count;
  };
}

const next = makeCounter();
console.log(next());
console.log(next());
console.log(next());`,
      expected: "1\n2\n3",
      hints: ["`count` কে ভেতরের function এর বাইরে, কিন্তু `makeCounter` এর ভেতরে declare করুন।", "এতে প্রতি call এ নতুন নয়, `makeCounter` এর একটিই environment এ `count` থাকবে।"],
      solution: `function makeCounter() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}

const next = makeCounter();
console.log(next());
console.log(next());
console.log(next());`,
      explanation: "ভেতরের function `count` কে free variable হিসেবে ধরে আছে (closure)। `count` এখন `makeCounter` এর environment এ, যা প্রতিটি `next()` call এ বেঁচে থাকে এবং আপডেট হয়।",
    },
    {
      level: "beginner",
      title: "Loop closure bug ঠিক করুন",
      prompt: "নিচের কোড `[ 30, 30, 30 ]` print করে। শুধু loop এর declaration বদলে `[ 0, 10, 20 ]` print করান।",
      starter: `const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i * 10);
}
console.log(fns.map((f) => f()));`,
      expected: "[ 0, 10, 20 ]",
      hints: ["কোন keyword প্রতি iteration এ নতুন binding তৈরি করে?"],
      solution: `const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(() => i * 10);
}
console.log(fns.map((f) => f()));`,
      explanation: "`let` প্রতি iteration এ আলাদা `i` binding তৈরি করে এবং প্রতিটি closure নিজেরটি ধরে। `var` এ একটিই binding, তাই সবাই শেষ মান `3` দেখত।",
    },
    {
      level: "beginner",
      title: "Private balance",
      prompt: "`createAccount(balance)` লিখুন, যা `deposit(n)` ও `getBalance()` সহ object ফেরত দেবে। `balance` বাইরে থেকে সরাসরি পাওয়া যাবে না। `deposit(50)` এর পর balance print করুন (`150`) এবং `typeof account.balance` print করুন (`undefined`)।",
      starter: `function createAccount(balance) {
  // TODO: deposit ও getBalance ফেরত দিন
  return {};
}

const account = createAccount(100);
account.deposit(50);
console.log(account.getBalance());
console.log(typeof account.balance);`,
      expected: "150\nundefined",
      hints: ["`balance` parameter ই তো একটি local variable — closure এ সরাসরি বদলানো যায়।", "`deposit(n) { balance += n; }` ও `getBalance() { return balance; }`।"],
      solution: `function createAccount(balance) {
  return {
    deposit(n) {
      balance += n;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createAccount(100);
account.deposit(50);
console.log(account.getBalance());
console.log(typeof account.balance);`,
      explanation: "`balance` কোনো property নয়; এটি `createAccount` এর scope এর variable, যাকে দুটি method closure হিসেবে ধরে আছে। তাই `account.balance` নেই, কিন্তু method দিয়ে পড়া ও বদলানো যায়।",
    },
    {
      level: "intermediate",
      title: "once বানান",
      prompt: "`once(fn)` লিখুন যা `fn` কে শুধু প্রথমবার চালায় এবং পরের সব call এ প্রথমবারের ফলই ফেরত দেয়। প্রত্যাশিত output: `setup`, `1`, `1`।",
      starter: `function once(fn) {
  // TODO
  return fn;
}

const init = once(() => {
  console.log("setup");
  return 1;
});

console.log(init());
console.log(init());`,
      expected: "setup\n1\n1",
      hints: ["`called` ও `result` নামে দুটি variable `once` এর ভেতরে রাখুন।", "ভেতরের function এ `if (!called) { called = true; result = fn(...args); }`।"],
      solution: `function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

const init = once(() => {
  console.log("setup");
  return 1;
});

console.log(init());
console.log(init());`,
      explanation: "`called` ও `result` closure এ লুকানো state। প্রথম call এ `fn` চলে ও ফল রাখা হয়; পরে `called` true হওয়ায় সরাসরি আগের ফল ফেরত যায়।",
    },
    {
      level: "intermediate",
      title: "Partial application",
      prompt: "`partial(fn, ...preset)` লিখুন, যা কিছু argument আগে বসিয়ে নতুন function ফেরত দেয়। `partial(greet, \"Hello\")(\"Rina\")` print করবে `Hello, Rina` এবং `partial(add3, 1, 2)(3)` print করবে `6`।",
      starter: `const greet = (greeting, name) => greeting + ", " + name;
const add3 = (a, b, c) => a + b + c;

function partial(fn, ...preset) {
  // TODO
}

console.log(partial(greet, "Hello")("Rina"));
console.log(partial(add3, 1, 2)(3));`,
      expected: "Hello, Rina\n6",
      hints: ["ভেতরের function এ `...rest` নিন।", "`fn(...preset, ...rest)`।"],
      solution: `const greet = (greeting, name) => greeting + ", " + name;
const add3 = (a, b, c) => a + b + c;

function partial(fn, ...preset) {
  return (...rest) => fn(...preset, ...rest);
}

console.log(partial(greet, "Hello")("Rina"));
console.log(partial(add3, 1, 2)(3));`,
      explanation: "ফেরত আসা function `fn` ও `preset` কে closure হিসেবে ধরে রাখে, এবং পরে আসা `rest` এর সাথে জুড়ে `fn` কে call করে।",
    },
    {
      level: "challenge",
      title: "Real-world: stats সহ memoize",
      prompt:
        "`memoize(fn)` লিখুন: একই argument এ `fn` এর ফল cache থেকে দেবে। ফেরত-আসা function এ `stats()` method থাকবে, যা `{ hits, misses }` ফেরত দেয়। Cache key বানাতে সব argument ব্যবহার করুন (`JSON.stringify(args)`)। Cache ও counter বাইরে থেকে পাওয়া যাবে না।",
      starter: `let computeCount = 0;
const square = (n) => {
  computeCount += 1;
  return n * n;
};

function memoize(fn) {
  // TODO
  return fn;
}

const fast = memoize(square);
console.log(fast(4));
console.log(fast(4));
console.log(fast(5));
console.log(fast.stats());
console.log(computeCount);`,
      expected: "16\n16\n25\n{ hits: 1, misses: 2 }\n2",
      hints: ["`cache = new Map()`, `hits`, `misses` — তিনটি variable `memoize` এর ভেতরে।", "ভেতরের function কে একটি নাম দিন বা const এ রাখুন, তারপর `wrapper.stats = () => ({ hits, misses })`।", "Function ও object এ property বসানো যায়।"],
      solution: `let computeCount = 0;
const square = (n) => {
  computeCount += 1;
  return n * n;
};

function memoize(fn) {
  const cache = new Map();
  let hits = 0;
  let misses = 0;

  const wrapper = (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      hits += 1;
      return cache.get(key);
    }
    misses += 1;
    const value = fn(...args);
    cache.set(key, value);
    return value;
  };

  wrapper.stats = () => ({ hits, misses });
  return wrapper;
}

const fast = memoize(square);
console.log(fast(4));
console.log(fast(4));
console.log(fast(5));
console.log(fast.stats());
console.log(computeCount);`,
      explanation: "`cache`, `hits`, `misses` `memoize` এর environment এ থাকে এবং `wrapper` ও `wrapper.stats` দুটি closure একই environment ভাগ করে — তাই stats সঠিক সংখ্যা দেখায়। বাইরে থেকে cache ধরা যায় না (private state)। বাস্তবে cache এর আকার সীমিত রাখুন (যেমন LRU), নইলে এটি memory ধরে রাখে।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "Closure এর সবচেয়ে সঠিক সংজ্ঞা কোনটি?",
        options: [
          "একটি function যা অন্য function এর ভেতরে লেখা",
          "একটি function যা শুধু একবার call করা যায়",
          "একটি function এর return করা মান",
          "একটি function এবং সে যে lexical environment এ তৈরি হয়েছে তার সংযুক্তি",
        ],
        answer: 3,
        explanation: "Closure = function + তার জন্মস্থানের lexical environment। ‘ভেতরে লেখা function’ কেবল সাধারণ উদাহরণ, সংজ্ঞা নয় (প্রতিটি function ই outer environment ধরে)। একবার call বা return এর মানের সাথে এর সম্পর্ক নেই।",
      },
      {
        question: "`function f() { let x = 1; const g = () => x; x = 2; return g(); }` — `f()` কী ফেরত দেয়?",
        options: ["`2`", "`1`", "`undefined`", "ReferenceError"],
        answer: 0,
        explanation: "Closure variable (`x` binding) ধরে, মান copy করে না; `g()` call এর সময় `x` এর বর্তমান মান `2`। `1` আসত যদি মান তৈরির সময় copy হতো। `x` declared ও initialized, তাই `undefined` বা ReferenceError নয়।",
      },
      {
        question: "`makeCounter()` ফিরে গেলেও তার `count` variable কেন বেঁচে থাকে?",
        options: [
          "কারণ `count` স্বয়ংক্রিয়ভাবে global হয়ে যায়",
          "কারণ engine function এর মান function এর ভেতরে copy করে রাখে",
          "কারণ ফেরত-আসা function এর outer reference দিয়ে ওই environment এখনো reachable",
          "কারণ JavaScript কখনো কোনো variable মুছে না",
        ],
        answer: 2,
        explanation: "Memory মুক্তি reachability ভিত্তিক: ফেরত function ধরে আছে বলে তার outer environment (যাতে `count`) এ পৌঁছানো যায়, তাই সেটি বাদ পড়ে না। `count` global হয় না। Copy-র ধারণা ভুল (binding ধরা হয়)। আর unreachable হলে engine variable মুক্ত করে — ‘কখনো মুছে না’ ভুল।",
      },
      {
        question: "React এর event handler এ stale closure এর মূল কারণ কী?",
        options: [
          "React এর বিশেষ bug যা শুধু hooks এ হয়",
          "Handler তৈরি হওয়া render এর environment এর (পুরোনো) state/props ধরে থাকে",
          "`const` দিয়ে state declare করলে তা সবসময় অপরিবর্তনীয় থাকে বলে",
          "Browser এর event loop handler কে দেরিতে চালায় বলে",
        ],
        answer: 1,
        explanation: "প্রতি render এ নতুন environment (নিজস্ব `count` সহ) তৈরি হয়, এবং সেই render এ তৈরি handler সেটিই ধরে — পরের render এ state বদলালেও সে পুরোনোটি দেখে। এটি closure এর স্বাভাবিক আচরণ, hooks এর bug নয়। `const` একটি কারণ নয় (প্রতি render এ নতুন `const`), আর event loop এর সময় মূল কারণ নয়।",
      },
      {
        question: "নিচের কোনটি closure এর কারণে memory আটকে থাকার সম্ভাব্য ঝুঁকি?",
        options: [
          "সংক্ষিপ্ত `forEach` callback যা সাথে সাথে শেষ হয়",
          "একটি function যা কেবল নিজের parameter ব্যবহার করে",
          "কখনো না-সরানো event listener যা একটি বড় object ধরে আছে",
          "`const` দিয়ে declare করা ছোট সংখ্যা",
        ],
        answer: 2,
        explanation: "দীর্ঘস্থায়ী callback (listener, interval, global registry) যতদিন reachable, তার ধরা বড় object ততদিন বাঁচে। সংক্ষিপ্ত `forEach` callback শেষ হলে unreachable হয়। শুধু parameter ব্যবহারে বাইরের কিছু ধরার দরকার নেই। ছোট `const` সংখ্যা নগণ্য। (সঠিক আচরণ engine নির্ভর — profiler দিয়ে মাপুন।)",
      },
    ],
    coding: [
      {
        title: "createLimiter",
        prompt: "`createLimiter(max)` লিখুন: ফেরত-আসা function প্রথম `max` বার `true`, তারপর `false` দেবে। `max = 2` ধরে তিনবার call করলে `true`, `true`, `false` print হবে।",
        starter: `function createLimiter(max) {
  // TODO
}

const allow = createLimiter(2);
console.log(allow());
console.log(allow());
console.log(allow());`,
        expected: "true\ntrue\nfalse",
        solution: `function createLimiter(max) {
  let used = 0;
  return () => {
    if (used < max) {
      used += 1;
      return true;
    }
    return false;
  };
}

const allow = createLimiter(2);
console.log(allow());
console.log(allow());
console.log(allow());`,
      },
      {
        title: "Independent formatter",
        prompt: "`makeFormatter(prefix)` লিখুন, যা `(msg) => \"[\" + prefix + \"] \" + msg` ধরনের function ফেরত দেয়। `err(\"disk full\")` print করবে `[ERROR] disk full` এবং `info(\"started\")` print করবে `[INFO] started`।",
        starter: `function makeFormatter(prefix) {
  // TODO
}

const err = makeFormatter("ERROR");
const info = makeFormatter("INFO");

console.log(err("disk full"));
console.log(info("started"));`,
        expected: "[ERROR] disk full\n[INFO] started",
        solution: `function makeFormatter(prefix) {
  return (msg) => "[" + prefix + "] " + msg;
}

const err = makeFormatter("ERROR");
const info = makeFormatter("INFO");

console.log(err("disk full"));
console.log(info("started"));`,
      },
    ],
  },

  interview: [
    {
      q: "Closure কী? একটি উদাহরণ দিয়ে বোঝান।",
      a: "Closure হলো একটি function এবং সে যে lexical environment এ তৈরি হয়েছিল তার সংযুক্ত জুটি। ফলে function তার outer scope এর variable গুলো ব্যবহার করতে পারে, এমনকি outer function শেষ হয়ে গেলেও।\n\nউদাহরণ: `function makeCounter() { let count = 0; return () => ++count; }`। `const c = makeCounter()` এর পর `makeCounter` শেষ, কিন্তু `c()` বারবার call করলে `1, 2, 3…` পাওয়া যায় — কারণ `c` এর outer reference দিয়ে `count` সম্বলিত environment এখনো reachable। প্রতিটি `makeCounter()` call নতুন environment ও স্বতন্ত্র state বানায়।\n\nউল্লেখ করুন: এটি lexical scope এরই ফল, আলাদা কোনো সিনট্যাক্স নয়।",
    },
    {
      q: "Outer function শেষ হয়ে গেলে তার variable memory থেকে মুছে যায় না কেন?",
      a: "কারণ JavaScript এ memory মুক্তি **reachability** ভিত্তিক। কোনো live reference থেকে (global, call stack, অন্য object, বা closure এর outer reference) একটি environment এ পৌঁছানো গেলে সেটি মুছে ফেলার যোগ্য নয়।\n\nOuter function ফিরে গেলে তার stack frame চলে যায়, কিন্তু ভেতরের function যদি return হয়ে বা callback/listener হিসেবে বাইরে থেকে গিয়ে থাকে, সে outer reference এর মাধ্যমে environment কে ধরে রাখে। ওই function ও আর reachable না থাকলে environment ও garbage collector এর মুছে ফেলার যোগ্য হয় (Garbage Collection lesson এ বিস্তারিত)। বাস্তবায়নে এ ধরনের environment সাধারণত heap এ থাকে এবং engine শুধু ব্যবহৃত variable গুলো ধরার চেষ্টা করে — এগুলো engine-নির্ভর বিবরণ, spec এর নিয়ম নয়।",
    },
    {
      q: "Loop এ `var` দিয়ে closure বানালে সব একই মান পায় কেন? `let` কীভাবে ঠিক করে?",
      a: "`var i` পুরো function scope এ একটিই binding। Loop এ তৈরি তিনটি closure ই সেই একই `i` ধরে। Callback গুলো (যেমন `setTimeout` এ) চলে loop শেষে, তখন `i` এর মান `3`, তাই সবাই `3` দেখে। কারণ closure variable ধরে, মান copy করে না।\n\n`for (let i ...)` এ spec অনুযায়ী প্রতিটি iteration এর জন্য নতুন `i` binding তৈরি হয় (আগের iteration এর মান দিয়ে শুরু করে), তাই প্রতিটি closure আলাদা binding ধরে। পুরোনো কোডে এই সমস্যার সমাধান ছিল IIFE দিয়ে প্রতি iteration এ নতুন function scope বানানো; আধুনিক কোডে `let` বা `Array.prototype.forEach`/`for...of` এর `const` যথেষ্ট।",
    },
    {
      q: "Closure দিয়ে private state এবং `#private` class field এর মধ্যে কোনটি কখন ব্যবহার করবেন?",
      a: "দুটিই data hiding দেয়, কিন্তু ভিন্নভাবে। Closure এ privacy আসে scope থেকে — variable টি বাইরে থেকে ‘দেখাই’ যায় না। `#field` এ privacy আসে language rule থেকে — class body এর বাইরে `#x` ব্যবহার SyntaxError।\n\nঅনেক instance, inheritance, `instanceof`, ও tooling সুবিধা চাইলে class + `#private` ভালো; method prototype এ ভাগ হয় বলে memory ও কম লাগে। ছোট utility, hook-সদৃশ factory, ও functional ধাঁচে (যেখানে `this` এড়াতে চাই) closure সুবিধাজনক। Factory তে প্রতি call এ নতুন function তৈরি হয় — হাজার হাজার instance এ এর খরচ বিবেচ্য হতে পারে (মেপে দেখুন)। নির্দিষ্ট নিয়ম নেই; দলের convention ও প্রয়োজন অনুযায়ী বাছুন।",
    },
    {
      q: "Stale closure কী? React এ এটি কীভাবে ঘটে এবং কীভাবে এড়ান?",
      a: "Stale closure হলো এমন callback যা অতীতের কোনো মুহূর্তের মান ধরে রেখেছে এবং পরে সেই মান পুরোনো হয়ে গেলেও সে সেটিই ব্যবহার করে। React এ component প্রতি render এ আবার call হয়, ফলে প্রতি render এর নিজস্ব `count`, `props` সহ নতুন environment তৈরি হয়। সেই render এ তৈরি `setInterval`/`setTimeout` callback বা event handler পুরোনো render এর `count` ধরে থাকে।\n\nএড়ানোর উপায়: (১) functional updater (`setCount(c => c + 1)`), যা বর্তমান state নিয়ে কাজ করে; (২) `useEffect`/`useCallback` এর **সঠিক dependency array**, যাতে মান বদলালে নতুন closure তৈরি হয়; (৩) বদলানো মান `useRef` এ রেখে `ref.current` পড়া (ref এর object একই, শুধু `current` বদলায়); (৪) effect এ cleanup দিয়ে পুরোনো timer সরানো। মূল কথা: এটি plain JavaScript closure এরই আচরণ, React এর বিশেষ জাদু নয়।",
    },
    {
      q: "Closure কি memory leak ঘটাতে পারে? কীভাবে প্রতিরোধ করবেন?",
      a: "Closure নিজে leak নয়, কিন্তু সে যা ধরে আছে তা reachable রাখে। দীর্ঘস্থায়ী callback (কখনো না সরানো event listener, চলতেই থাকা `setInterval`, global registry/cache এ রাখা function, unbounded memoize cache) যদি বড় object, DOM node বা বড় array ধরে রাখে, তবে সেই memory মুক্ত হয় না — একে ‘leak’ বলা হয়।\n\nপ্রতিরোধ: (১) দরকার না থাকলে listener/timer/subscription সরান (`removeEventListener`, `clearInterval`, unsubscribe; React এ effect cleanup); (২) পুরো বড় object ধরার বদলে প্রয়োজনীয় অংশ (`const id = user.id`) ধরুন; (৩) cache এ সীমা রাখুন (LRU, `WeakMap`/`WeakRef` যেখানে উপযুক্ত); (৪) সন্দেহ হলে Chrome DevTools এর Memory → Heap snapshot নিয়ে retained size ও retainers দেখুন। আধুনিক engine কিছু ক্ষেত্রে অব্যবহৃত variable ছেড়ে দেয়, কিন্তু সব ক্ষেত্রে নয় (engine-নির্ভর), তাই অনুমান না করে মাপুন।",
    },
  ],

  summary: {
    takeaways: [
      "Closure = function + তার জন্মস্থানের lexical environment; JavaScript এর প্রতিটি function ই সেটি ধরে, প্রভাব দেখা যায় যখন function তার জন্মস্থানের বাইরে ব্যবহৃত হয়।",
      "Outer function ফিরলেও variable বেঁচে থাকে — কারণ ভেতরের function এর outer reference দিয়ে environment এখনো **reachable**; reachable না থাকলে তবেই GC এর যোগ্য।",
      "Closure **variable (binding)** ধরে, মান copy করে না — বদলালে নতুন মান দেখে, এবং ভেতর থেকে বদলালে বাইরেও প্রভাব পড়ে।",
      "প্রতিটি factory call এ নতুন environment তৈরি হয়, তাই counter/store/memoize এর state স্বতন্ত্র ও private।",
      "`var` loop এ একটিই binding (সবাই একই মান), `let` এ প্রতি iteration এ নতুন binding।",
      "Stale closure (React hooks, timers) ঘটে পুরোনো render/মুহূর্তের মান ধরে থাকায় — functional updater, সঠিক dependencies বা ref দিয়ে সমাধান।",
      "দীর্ঘস্থায়ী closure (listener, interval, cache) বড় object ধরে রাখলে memory আটকায় — cleanup ও সীমা রাখুন।",
    ],
    syntax: `function createThing(config) {
  let state = 0;                      // private, closure এ লুকানো

  return {
    next: () => ++state,
    reset() { state = 0; },
  };
}

const once = (fn) => {
  let called = false, result;
  return (...args) => (called ? result : ((called = true), (result = fn(...args))));
};

const partial = (fn, ...preset) => (...rest) => fn(...preset, ...rest);`,
    whenToUse: [
      "State লুকিয়ে রাখতে ও encapsulation এ (counter, store, cache, rate limiter) — বিশেষত ছোট utility ও hook-সদৃশ factory তে।",
      "Configuration সহ specialized function বানাতে — factory, partial application, `once`, `memoize`, `debounce`/`throttle`।",
      "Event handler/callback এ তৈরির সময়ের context (যেমন কোন item) ধরে রাখতে — তবে stale মান ও cleanup এর কথা মাথায় রেখে।",
      "অনেক instance + inheritance দরকার হলে বিকল্প হিসেবে class + `#private` ভাবুন।",
    ],
    next: ["Garbage Collection (Advanced) — reachability ও closure memory", "Hoisting ও Lexical Environment (Advanced) — আনুষ্ঠানিক মডেল", "Higher-Order Functions — closure এর সবচেয়ে সাধারণ প্রয়োগ", "IIFE — closure ভিত্তিক পুরোনো module pattern"],
  },

  compatibility:
    "Closure ECMAScript এর মূল অংশ — সব browser, Node.js ও Web Worker এ একই আচরণ। `#private` class field ES2022 (Node 12+ এ আংশিক সমর্থন শুরু, আধুনিক সংস্করণে পূর্ণ; সব আধুনিক browser এ আছে)। `let` এর per-iteration binding ES2015 থেকে। Memory আচরণ (কী কী ধরে রাখা হয়) engine ও সংস্করণ নির্ভর; V8, SpiderMonkey, JavaScriptCore এ ভিন্ন হতে পারে — তাই DevTools এর Memory profiler দিয়ে মেপে নিন। এই Playground browser-like Web Worker এ চলে।",
};
