import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Variable lookup কীভাবে innermost scope থেকে বাইরের দিকে হেঁটে ফল পায় (বা ReferenceError ছোড়ে) — ধাপে ধাপে বলতে পারবেন।",
    "Function call এ নতুন environment তৈরি হয় এবং তার outer reference যায় function **যেখানে define হয়েছে** সেখানে — call এর জায়গায় নয় — তা runnable কোড দিয়ে প্রমাণ করতে পারবেন।",
    "Free variable, shadowing ও `typeof` undeclared নামের আচরণ scope chain এর ভাষায় ব্যাখ্যা করতে পারবেন।",
    "Closure কীভাবে scope chain এর একটি অংশকে বাঁচিয়ে রাখে — তা বুঝবেন।",
    "Scope chain এর ধারণা কাজে লাগিয়ে একটি ছোট lookup resolver নিজে লিখতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Scope Chain কী?" },
    {
      type: "p",
      text: "Lexical Scope lesson এ দেখেছি: প্রতিটি scope এর একটি environment থাকে (নাম → মানের record) এবং সে যে scope এর ভেতরে লেখা, তার দিকে একটি **outer reference** থাকে। এই outer reference গুলো জুড়ে যে শৃঙ্খল তৈরি হয় — **inner → outer → … → global** — সেটিই **Scope Chain**। কোনো নাম ব্যবহার করলে JavaScript এই chain ধরে হেঁটে নামটি খোঁজে।",
    },
    {
      type: "p",
      text: "Scope chain কোনো আলাদা data structure যা আপনি দেখতে পারেন তা নয় — এটি একটি **ধারণা** (এবং spec এ environment গুলোর `[[OuterEnv]]` সংযোগের ফল)। Engine বাস্তবে কীভাবে এটি সাজায় তা implementation এর ব্যাপার; কিন্তু আচরণ সর্বদা এই মডেলের সাথে মেলে।",
    },
    { type: "h3", text: "Lookup এর নিয়ম (identifier resolution)" },
    {
      type: "ol",
      items: [
        "**নিজের (innermost) scope এ** খুঁজুন — `let`/`const`/`var`/parameter/function সব এই record এ থাকে।",
        "না পেলে **outer reference** ধরে এক ধাপ বাইরের scope এ যান এবং সেখানে খুঁজুন।",
        "এভাবে পুনরাবৃত্তি করে **global scope** পর্যন্ত যান। (Global এ `let`/`const` এর record ছাড়াও global object এর property — যেমন `console`, `Math`, `globalThis` — সাধারণভাবে এখানেই মেলে।)",
        "যেখানেই প্রথমবার নামটি পাওয়া যায়, **সেখানেই থেমে** সেই binding ব্যবহার করুন — আর বাইরে যাওয়া হয় না।",
        "Global এও না পেলে **`ReferenceError: x is not defined`**।",
      ],
    },
    {
      type: "code",
      code: `const level = "global";

function outer() {
  const city = "Dhaka";

  function inner() {
    const name = "Rina";
    console.log(name, city, level);
    // name  -> inner এ পাওয়া গেল (১ ধাপ)
    // city  -> inner এ নেই, outer এ পাওয়া গেল (২ ধাপ)
    // level -> inner, outer এ নেই, global এ পাওয়া গেল (৩ ধাপ)
  }

  inner();
}

outer();`,
      caption: "তিনটি নাম, তিন গভীরতা — প্রতিটি যেখানে প্রথম পাওয়া যায় সেখানেই থামে।",
    },
    { type: "h3", text: "Free variable: যার declaration নিজের scope এ নেই" },
    {
      type: "p",
      text: "যে নাম কোনো function/block এর ভেতরে ব্যবহার হয়েছে কিন্তু **সেই scope এ declare হয়নি** (parameter বা local নয়), তাকে সেই function এর **free variable** বলে। উপরের `inner` এ `city` ও `level` free variable। Free variable ই scope chain কে অর্থবহ করে — এর মান আসে বাইরের কোথাও থেকে। এবং এখানেই closure এর সম্পর্ক: closure মূলত ‘function + তার free variable গুলো কোথা থেকে আসে তার সংযোগ’।",
    },
    { type: "h3", text: "প্রতিটি call এ নতুন environment — কিন্তু outer reference আগের জায়গায়" },
    {
      type: "p",
      text: "Function **call** হলে engine সেই call এর জন্য একটি নতুন environment তৈরি করে (parameter ও local নিয়ে)। এই environment এর **outer reference** কোথায় যায়? উত্তর: function টি **যেখানে define (তৈরি) হয়েছিল** সেই environment এ — call করার জায়গার environment এ নয়। এ কারণে একই function দশবার call হলে দশটি আলাদা local environment হয়, কিন্তু সবার outer একই (যদি function একবারই তৈরি হয়)। আবার একই কোড থেকে function দুবার *তৈরি* হলে (যেমন factory এর প্রতিটি call এ), দুটি ভিন্ন outer environment।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Chain ঠিক হয় define এর সময়, call এর সময় নয়",
      text: "Call stack ‘কে কাকে ডেকেছে’ বলে; scope chain বলে ‘কোড কোথায় লেখা’। দুটি সম্পূর্ণ আলাদা জিনিস। একটি function যে chain নিয়ে জন্মায়, তা সারাজীবন একই থাকে — তাকে যেখানেই call করুন না কেন। নিচের runnable উদাহরণে এটি প্রমাণ করা হয়েছে।",
    },
    {
      type: "code",
      code: `const label = "G";

function makeReader() {
  const label = "A";
  return function read() {
    return label;           // read এর outer = makeReader এর environment
  };
}

function other() {
  const label = "B";
  const read = makeReader();
  return read();            // other থেকে call হচ্ছে, কিন্তু chain এ other নেই
}

console.log(other());       // "A" — "B" নয়, "G" ও নয়`,
      caption: "`read` এর chain: read call env → makeReader env → global। `other` এর env এই chain এ কোথাও নেই।",
    },
    { type: "h3", text: "Shadowing chain এ কীভাবে কাজ করে" },
    {
      type: "p",
      text: "Lookup প্রথম match এই থামে — তাই ভেতরের scope এ একই নামের variable থাকলে chain এর বাইরের একই নাম কখনো খোঁজাই হয় না; সেটি shadowed। একটি সূক্ষ্ম ফাঁদ: ভেতরে `const size = size * 2` লিখলে ডান পাশের `size` ও ভেতরের নতুন `size` কেই বোঝায় (যা তখনো TDZ তে) — বাইরের `size` নয়। ফলে `ReferenceError: Cannot access 'size' before initialization`। Variables lesson এর TDZ ও scope chain এখানে মিলেছে।",
    },
    { type: "h3", text: "Lookup এর খরচ (performance)" },
    {
      type: "p",
      text: "Naive মডেলে যত গভীরে নাম, তত বেশি ধাপ — তাই ‘global variable ধীর’ ধরনের কথা প্রচলিত। বাস্তবে আধুনিক engine (যেমন V8) কোড compile এর সময় প্রায়ই নাম কোন scope এ থাকবে তা আগেই নির্ণয় করে রাখে (lexical scope static বলেই এটি সম্ভব) এবং runtime এ সরাসরি slot এ পৌঁছায় — তাই সাধারণ কোডে chain এর গভীরতা নিয়ে micro-optimisation এর প্রয়োজন নেই। তবে `eval`, পুরোনো `with` statement ইত্যাদি static বিশ্লেষণ ভেঙে দেয় এবং optimisation কমাতে পারে — এজন্য এগুলো এড়ানো হয় (`with` strict mode এ নিষিদ্ধ)। Engine-ভিত্তিক সূক্ষ্ম বিবরণের ওপর নির্ভর না করে ‘পড়তে সহজ, ছোট scope’ নীতি মানাই ভালো।",
    },
    { type: "h3", text: "`typeof` এবং undeclared নাম" },
    {
      type: "p",
      text: "সাধারণ নাম পড়ার সময় chain এ না পেলে ReferenceError। কিন্তু `typeof undeclaredName` একটি বিশেষ নিয়ম: নামটি chain এ না পেলে error না দিয়ে `\"undefined\"` ফেরত দেয়। এ কারণে ‘এই global আছে কি না’ পরীক্ষায় `typeof maybeGlobal !== \"undefined\"` ঐতিহ্যগতভাবে ব্যবহৃত হতো। ব্যতিক্রম: TDZ এ থাকা `let`/`const` নামে `typeof` ও ReferenceError ছোড়ে — কারণ নামটি *declared*, শুধু initialize হয়নি। আধুনিক কোডে feature check এর জন্য সাধারণত `globalThis.name` বা `\"name\" in globalThis` পছন্দনীয়।",
    },
    { type: "h3", text: "Closure scope chain এর আয়ু বাড়ায়" },
    {
      type: "p",
      text: "সাধারণত function শেষ হলে তার environment আর কেউ ব্যবহার করে না, তাই তা memory থেকে সরে যাওয়ার যোগ্য। কিন্তু ভেতরের কোনো function যদি বাইরে চলে যায় (return, callback, event handler), তাহলে তার outer reference এর মাধ্যমে ওই environment এখনো **reachable** — তাই বাঁচে। অর্থাৎ **scope chain এর একটি অংশ function এর সাথে বেঁচে থাকে**। এটিই Closures lesson এর বিষয়।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "সাধারণ ভুল ধারণা",
      text: "**(১)** ‘Scope chain call stack এর মতোই’ — না; stack runtime এর call সম্পর্ক, chain কোডের কাঠামো। **(২)** ‘Function যেখান থেকে call হয় সেই scope পরেই খোঁজা হয়’ — না। **(৩)** ‘Outer variable এর মান function তৈরির সময় copy হয়’ — না; chain **binding** ধরে, মান নয়: outer variable পরে বদলালে function নতুন মান দেখে। **(৪)** ‘সব block ই chain এ আলাদা ধাপ’ — `let`/`const`/`class` থাকলে block এর environment হয়; আসল engine পরিষ্কার-ভাবে খালি block কে বাদ দিতে পারে, কিন্তু আচরণ একই। **(৫)** ‘Global এ খুঁজে না পেলে `undefined`’ — না, ReferenceError।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Debug করার কৌশল",
      text: "Browser DevTools এর Sources panel এ breakpoint এ থামলে ডান পাশের **Scope** সেকশনে Local → Closure → Script/Module → Global — ঠিক scope chain এর ক্রমে দেখায়। কোনো নামের মান কেন ভুল তা এখানে দেখলে কোন স্তর থেকে আসছে তা বোঝা যায়। Node.js এ `node --inspect` ও Chrome DevTools দিয়ে একই। (সঠিক লেবেল DevTools এর সংস্করণ ভেদে কিছুটা আলাদা হতে পারে।)",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ধরুন আপনি একটি বড় কোম্পানির নতুন কর্মী এবং একটি নির্দিষ্ট ফর্ম (ধরুন ‘ল্যাপটপের সিরিয়াল নম্বর’) খুঁজছেন। কোম্পানির নিয়ম: **আগে নিজের ডেস্কের ড্রয়ারে** দেখুন; না পেলে **নিজের টিমের শেয়ার্ড ফাইলে**; না পেলে **বিভাগের অফিসে**; সবশেষে **হেড অফিসের আর্কাইভে**। কোথাও না পেলে ‘ফাইল নেই’ বলে রিপোর্ট করতে হবে।",
    },
    {
      type: "ul",
      items: [
        "**নিজের ডেস্কের ড্রয়ার = local scope** (innermost, সবার আগে খোঁজা)।",
        "**টিমের শেয়ার্ড ফাইল = outer function এর scope**। আপনি ওই টিমের ভেতরে ‘লেখা (নিযুক্ত)’ হয়েছেন বলেই এটি আপনার অ্যাক্সেস চেইনে আছে।",
        "**হেড অফিসের আর্কাইভ = global scope** (সবচেয়ে বাইরে, সবার জন্য)।",
        "**কোম্পানির পদানুক্রম (কে কার অধীনে) = scope chain।** এটি নিযুক্তির সময়ই ঠিক হয়েছে — আপনি যে বিভাগেই ‘সাময়িকভাবে’ কাজ করতে যান (call), আপনার ফাইল-খোঁজার ক্রম আপনার নিজের পদানুক্রম (define) অনুযায়ী, সাময়িক বিভাগ অনুযায়ী নয়।",
        "**যেখানে প্রথম পাওয়া যায় সেখানেই থামা = shadowing।** ড্রয়ারে নিজের একটি কপি থাকলে হেড অফিসের আর্কাইভের কপি দেখারই দরকার নেই।",
        "**কোথাও না পেলে রিপোর্ট = ReferenceError।**",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "Lookup হাঁটা: সফল অনুসন্ধান",
      caption: "কোড: inner() এর ভেতরে `console.log(name, city, level)`। নোডগুলো scope chain এর ক্রমে — Local → Outer function → Global।",
      nodes: [
        { id: "local", label: "inner() — Local", sub: "innermost" },
        { id: "outer", label: "outer() scope", sub: "outer reference ১" },
        { id: "global", label: "Global scope", sub: "outer reference ২" },
      ],
      steps: [
        {
          active: [],
          items: {
            local: ["name = 'Rina'"],
            outer: ["city = 'Dhaka'", "inner (function)"],
            global: ["level = 'global'", "outer (function)"],
          },
          note: "`inner()` call এর মুহূর্তে তিনটি environment এর chain: **Local → Outer → Global**। প্রতিটির নিজস্ব record এ কী কী আছে তা বক্সে দেখানো হলো। এবার `console.log(name, city, level)` এর তিনটি নাম খোঁজা হবে।",
        },
        {
          active: ["local"],
          items: {
            local: ["name = 'Rina'  ✔ পাওয়া গেছে"],
            outer: ["city = 'Dhaka'", "inner (function)"],
            global: ["level = 'global'", "outer (function)"],
          },
          note: "**`name` খোঁজা:** Local এই পাওয়া গেল। প্রথম ধাপেই থেমে গেল — বাইরে যাওয়ার দরকার নেই।",
          output: "name → 'Rina' (১ ধাপ)",
        },
        {
          active: ["local", "outer"],
          items: {
            local: ["city ? ✘ নেই"],
            outer: ["city = 'Dhaka'  ✔ পাওয়া গেছে", "inner (function)"],
            global: ["level = 'global'", "outer (function)"],
          },
          note: "**`city` খোঁজা:** Local এ নেই (✘)। Outer reference ধরে `outer()` এর scope এ গেল — সেখানে পাওয়া গেল। `city` হলো `inner` এর **free variable**।",
          output: "city → 'Dhaka' (২ ধাপ)",
        },
        {
          active: ["local", "outer", "global"],
          items: {
            local: ["level ? ✘ নেই"],
            outer: ["level ? ✘ নেই"],
            global: ["level = 'global'  ✔ পাওয়া গেছে", "outer (function)"],
          },
          note: "**`level` খোঁজা:** Local ✘ → Outer ✘ → Global ✔। পুরো chain হেঁটে শেষ প্রান্তে পাওয়া গেল। আধুনিক engine সাধারণত এই পথ compile এর সময়ই জেনে রাখে (হেজ: সবসময় নয়, বিশেষত `eval`/`with` থাকলে)।",
          output: "level → 'global' (৩ ধাপ)",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Lookup হাঁটা: ব্যর্থ অনুসন্ধান (ReferenceError)",
      caption: "কোড: inner() এর ভেতরে `console.log(missing)` — কোথাও declare করা নেই।",
      nodes: [
        { id: "local", label: "inner() — Local", sub: "১ম ধাপ" },
        { id: "outer", label: "outer() scope", sub: "২য় ধাপ" },
        { id: "global", label: "Global scope", sub: "৩য় ধাপ" },
        { id: "error", label: "ফলাফল", sub: "chain শেষ" },
      ],
      steps: [
        {
          active: ["local"],
          items: {
            local: ["name = 'Rina'", "missing ? ✘ নেই"],
            outer: ["city = 'Dhaka'"],
            global: ["level = 'global'"],
            error: [],
          },
          note: "`missing` খোঁজা শুরু। প্রথমে Local — সেখানে শুধু `name`; `missing` নেই।",
        },
        {
          active: ["local", "outer"],
          items: {
            local: ["missing ? ✘"],
            outer: ["city = 'Dhaka'", "missing ? ✘ নেই"],
            global: ["level = 'global'"],
            error: [],
          },
          note: "Outer reference ধরে `outer()` এ — এখানেও `missing` নেই।",
        },
        {
          active: ["local", "outer", "global"],
          items: {
            local: ["missing ? ✘"],
            outer: ["missing ? ✘"],
            global: ["level = 'global'", "missing ? ✘ নেই"],
            error: [],
          },
          note: "Global এ গেল — এখানেও নেই। Global এর আর কোনো outer নেই; chain এর শেষ।",
        },
        {
          active: ["error"],
          items: {
            local: ["missing ? ✘"],
            outer: ["missing ? ✘"],
            global: ["missing ? ✘"],
            error: ["ReferenceError", "missing is not defined"],
          },
          note: "পুরো chain এ না পেলে engine `ReferenceError` ছোড়ে — `undefined` ফেরত দেয় না। (শুধু `typeof missing` এই error ছোড়ে না; সেটি `\"undefined\"` দেয়।) Error এর বার্তার সঠিক শব্দ engine ভেদে একটু আলাদা হতে পারে।",
          output: "ReferenceError",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Chain ঠিক হয় define এর জায়গায়, call এর জায়গায় নয়",
      caption: "`other()` ভেতর থেকে `read()` call হলেও read এর outer reference `makeReader` এর environment — `other` এর নয়।",
      nodes: [
        { id: "readEnv", label: "read() call env", sub: "যা call হচ্ছে" },
        { id: "makeEnv", label: "makeReader env", sub: "read এর জন্মস্থান" },
        { id: "otherEnv", label: "other() env", sub: "call করেছে" },
        { id: "global", label: "Global", sub: "সবার শেষে" },
      ],
      steps: [
        {
          active: ["makeEnv"],
          items: {
            readEnv: [],
            makeEnv: ["label = 'A'", "read ← তৈরি হলো"],
            otherEnv: ["label = 'B'"],
            global: ["label = 'G'"],
          },
          note: "`other()` এর ভেতরে `makeReader()` call হলো। এর environment এ `label = 'A'` এবং ভেতরের `read` function তৈরি হলো। `read` মনে রাখল: আমার জন্মস্থান **makeReader এর environment**।",
        },
        {
          active: ["readEnv", "otherEnv"],
          items: {
            readEnv: ["(নতুন, খালি record)"],
            makeEnv: ["label = 'A'"],
            otherEnv: ["label = 'B'", "→ read() call করছে"],
            global: ["label = 'G'"],
          },
          note: "এবার `other` থেকে `read()` call হলো — `read` এর জন্য নতুন call environment তৈরি। call stack এ `other` নিচে আছে, কিন্তু scope chain এর জন্য সেটি অপ্রাসঙ্গিক।",
        },
        {
          active: ["readEnv", "makeEnv"],
          items: {
            readEnv: ["label ? ✘ নেই → outer"],
            makeEnv: ["label = 'A'  ✔"],
            otherEnv: ["label = 'B'  (এখানে যাওয়া হয় না)"],
            global: ["label = 'G'  (এখানেও না)"],
          },
          note: "`read` এ `label` নেই → outer reference ধরে **makeReader এর environment** এ গেল → `'A'` পাওয়া গেল। `other` এর `'B'` ও global এর `'G'` কেউ দেখাই হলো না।",
          output: "A",
        },
        {
          active: ["readEnv", "makeEnv", "global"],
          items: {
            readEnv: ["read() call env"],
            makeEnv: ["makeReader env"],
            otherEnv: ["(chain এ নেই)"],
            global: ["Global"],
          },
          note: "সারসংক্ষেপ: `read` এর স্থায়ী chain = **read call env → makeReader env → Global**। `other` এই chain এর অংশই নয়। এটাই lexical scope এর মূল বক্তব্য।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "তিন স্তরের lookup",
      description: "প্রতিটি নাম chain এর ভিন্ন স্তর থেকে আসছে। শেষে `typeof` দিয়ে দেখুন chain এ না থাকা নাম error ছাড়াই `\"undefined\"` দেয়।",
      code: `const level = "global";

function outer() {
  const city = "Dhaka";

  function inner() {
    const name = "Rina";
    console.log(name, "|", city, "|", level);
  }

  inner();
}

outer();

console.log(typeof name);
console.log(typeof city);
console.log(typeof level);`,
    },
    {
      level: "intermediate",
      title: "Chain ঠিক হয় define এর সময় (প্রমাণ) ও live binding",
      description: "একই `read` function ভিন্ন জায়গা থেকে call করলেও chain একই। আর chain **binding** ধরে — মান copy করে না, তাই outer variable বদলালে function নতুন মান দেখে।",
      code: `const label = "G";

function makeReader() {
  const label = "A";
  return function read() {
    return label;
  };
}

function other() {
  const label = "B";
  const read = makeReader();
  return read();
}

console.log("call জায়গা অনুযায়ী নয়:", other());

// chain binding ধরে, মান copy করে না
let count = 1;
function showCount() {
  return count;
}
console.log("আগে:", showCount());
count = 2;
console.log("পরে:", showCount());

// প্রতিটি call এ নতুন environment, কিন্তু outer একই
const step = 10;
function addStep(n) {
  const result = n + step;
  return result;
}
console.log(addStep(1), addStep(2));`,
    },
    {
      level: "real-world",
      title: "Scope chain এর নিজস্ব সংস্করণ: layered config resolver",
      description: "Template engine, i18n, theme/config system — সবখানে ‘ভেতরের layer আগে, না পেলে বাইরের layer’ এই pattern ই scope chain এর মতো কাজ করে। নিচে `parent` link ধরে lookup করা একটি ছোট resolver।",
      code: `function createScope(vars, parent = null) {
  return {
    has(name) {
      if (Object.hasOwn(vars, name)) return true;
      return parent ? parent.has(name) : false;
    },
    get(name) {
      if (Object.hasOwn(vars, name)) return vars[name];  // প্রথম match এ থামে
      if (parent) return parent.get(name);               // outer এ যাও
      throw new ReferenceError(name + " is not defined"); // chain শেষ
    },
    child(childVars) {
      return createScope(childVars, this);
    },
  };
}

const globalCfg = createScope({ theme: "light", lang: "bn" });
const pageCfg = globalCfg.child({ title: "Home", lang: "en" });
const widgetCfg = pageCfg.child({ title: "Banner" });

console.log(widgetCfg.get("title"));  // নিজের layer (shadows page এর title)
console.log(widgetCfg.get("lang"));   // page layer
console.log(widgetCfg.get("theme"));  // global layer
console.log(pageCfg.get("title"));    // page এর নিজের অক্ষত
console.log(widgetCfg.has("missing"));

try {
  widgetCfg.get("missing");
} catch (e) {
  console.log(e.name + ": " + e.message);
}`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
const message = "Hello, scope chain!";
console.log(message);
`,
    },
    {
      label: "typeof বনাম সাধারণ ব্যবহার: undeclared নাম",
      code: `console.log(typeof notDeclaredAnywhere);   // "undefined" — error নয়

try {
  console.log(notDeclaredAnywhere);        // chain এ নেই
} catch (e) {
  console.log(e.name);
}

// TDZ তে থাকা নামে typeof ও error দেয়
try {
  console.log(typeof tdzName);
} catch (e) {
  console.log("typeof ও:", e.name);
}
let tdzName = 1;`,
    },
    {
      label: "Shadowing chain এর কোথায় থামায়",
      code: `const v = "global";

function a() {
  const v = "a";
  function b() {
    const v = "b";
    function c() {
      return v;          // c এর chain: c -> b -> a -> global
    }
    return c();
  }
  function d() {
    return v;            // d এর chain: d -> a -> global
  }
  return [b(), d()];
}

console.log(a());        // [ 'b', 'a' ]
console.log(v);          // 'global' অক্ষত`,
    },
    {
      label: "প্রতি call এ নতুন environment",
      code: `function makeCounter(start) {
  let count = start;                // প্রতি makeCounter call এ নতুন count
  return () => ++count;
}

const a = makeCounter(0);
const b = makeCounter(100);

console.log(a(), a(), a());
console.log(b(), b());
console.log(a());                   // a এর chain আলাদা, b প্রভাবিত করেনি`,
    },
    {
      label: "Recursion: প্রতি call এর নিজস্ব environment",
      code: `function countdown(n) {
  const label = "n=" + n;           // প্রতিটি call এ আলাদা label
  if (n === 0) {
    console.log("শেষ");
    return label;
  }
  const inner = countdown(n - 1);
  console.log(label, "| ফেরত:", inner);
  return label;
}

countdown(2);`,
    },
  ],

  debugging: [
    {
      title: "ReferenceError: অন্য function এর local variable ব্যবহার",
      bad: `function setup() {
  const secret = 42;
}

function run() {
  console.log(secret);
}

setup();
run();`,
      why: "`secret` `setup` এর scope এ আছে। `run` এর chain হলো run → global; `setup` সেই chain এ নেই (দুটি function পাশাপাশি লেখা, একটির ভেতরে আরেকটি নয়)। Chain এ না পেলে ReferenceError। সমাধান: মান `return` করা ও argument হিসেবে পাঠানো, অথবা সত্যিই shared হলে উপযুক্ত outer scope এ declare করা।",
      fix: `function setup() {
  return 42;
}

function run(secret) {
  console.log(secret);
}

run(setup());`,
    },
    {
      title: "Callback caller এর variable দেখছে না",
      bad: `function handler() {
  console.log(items.length);
}

function load(callback) {
  const items = [1, 2, 3];
  callback();
}

load(handler);`,
      why: "`handler` লেখা হয়েছে global এ, তাই তার chain: handler → global। `load` এর ভেতরে `items` থাকলেও `load` তাকে call করছে মাত্র — chain এ ঢোকায়নি। (React এর event handler/effect এও একই নিয়ম: handler component এর ভেতরে লেখা হলেই component এর state দেখে।) সমাধান: callback এ argument পাঠান, অথবা callback ‘ব্যবহারের জায়গায়’ লিখুন।",
      fix: `function handler(items) {
  console.log(items.length);
}

function load(callback) {
  const items = [1, 2, 3];
  callback(items);
}

load(handler);`,
    },
    {
      title: "Shadowing এ `const x = x ...` — বাইরের মান খুঁজে পায় না",
      bad: `const timeout = 30;

function request() {
  const timeout = timeout || 10;
  return timeout;
}

console.log(request());`,
      why: "`request` এর ভেতরে `const timeout` declare করায় `timeout` নামটি এই scope এ আছে (TDZ তে)। ডান পাশের `timeout` খুঁজতে গিয়ে chain এর প্রথম ধাপেই (ভেতরের) পাওয়া যায় — যা তখনো initialize হয়নি — তাই বাইরের `30` পর্যন্ত পৌঁছানোই হয় না; ফল ReferenceError (TDZ)। সমাধান: ভেতরের variable এর নাম আলাদা করুন।",
      fix: `const timeout = 30;

function request() {
  const effectiveTimeout = timeout || 10;
  return effectiveTimeout;
}

console.log(request());`,
    },
    {
      title: "`typeof` ও TDZ — declare হওয়ার আগে ব্যবহার",
      bad: `function check() {
  console.log(typeof config);
  const config = { debug: true };
  return config;
}

console.log(check());`,
      why: "‘`typeof` কখনো error দেয় না’ ধারণাটি অসম্পূর্ণ। `config` নামটি `check` এর scope এ declared (TDZ তে), তাই chain এ নামটি **পাওয়া যায়** কিন্তু initialize হয়নি — এ অবস্থায় `typeof` ও ReferenceError ছোড়ে। কেবল **একেবারে undeclared** নামেই `typeof` নিরাপদ।",
      fix: `function check() {
  const config = { debug: true };
  console.log(typeof config);
  return config;
}

console.log(check());`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "তিন স্তরের নাম এক লাইনে",
      prompt: "`inner` এর ভেতরে `console.log(a, b, c)` লিখে `1 2 3` print করুন। `a` global এ, `b` `outer` এ ও `c` `inner` এ আছে।",
      starter: `const a = 1;

function outer() {
  const b = 2;

  function inner() {
    const c = 3;
    // TODO: এখানে a, b, c print করুন
  }

  inner();
}

outer();`,
      expected: "1 2 3",
      hints: ["`inner` এর chain: inner → outer → global, তাই তিনটি নামই পাওয়া যাবে।", "`console.log(a, b, c)` ব্যবহার করুন।"],
      solution: `const a = 1;

function outer() {
  const b = 2;

  function inner() {
    const c = 3;
    console.log(a, b, c);
  }

  inner();
}

outer();`,
      explanation: "`a` global থেকে (৩ ধাপ), `b` `outer` থেকে (২ ধাপ), `c` local থেকে (১ ধাপ) পাওয়া যায়।",
    },
    {
      level: "beginner",
      title: "Shadowing এর TDZ error ঠিক করুন",
      prompt: "`size * 2` এ বাইরের `size` (10) ব্যবহার করতে চাইছেন, কিন্তু ReferenceError আসে। ভেতরের variable এর নাম বদলে `20` print করান।",
      starter: `const size = 10;

function double() {
  const size = size * 2;
  return size;
}

console.log(double());`,
      expected: "20",
      hints: ["ভেতরে `const size` থাকলে ডান পাশের `size` ও ভেতরেরটিকেই বোঝায়।", "ভেতরের নাম `doubled` করুন।"],
      solution: `const size = 10;

function double() {
  const doubled = size * 2;
  return doubled;
}

console.log(double());`,
      explanation: "ভেতরের নাম আলাদা হওয়ায় `size` খুঁজতে গিয়ে chain `double` ছাড়িয়ে global এ পৌঁছায় এবং `10` পায়।",
    },
    {
      level: "beginner",
      title: "undeclared নামের দুই রকম আচরণ",
      prompt: "`ghost` কোথাও declare করা নেই। প্রথমে `typeof ghost` print করুন, তারপর `try/catch` দিয়ে `ghost` সরাসরি পড়ে error এর নাম (`e.name`) print করুন।",
      starter: `// TODO: ১) typeof ghost print করুন
// TODO: ২) try/catch দিয়ে ghost পড়ে e.name print করুন
`,
      expected: "undefined\nReferenceError",
      hints: ["`console.log(typeof ghost)` error দেয় না।", "`try { console.log(ghost); } catch (e) { console.log(e.name); }`"],
      solution: `console.log(typeof ghost);

try {
  console.log(ghost);
} catch (e) {
  console.log(e.name);
}`,
      explanation: "`typeof` undeclared নামে বিশেষ ছাড় পায় (`\"undefined\"`), কিন্তু সাধারণ পড়ায় chain এ না পেলে ReferenceError।",
    },
    {
      level: "intermediate",
      title: "প্রতি call এ নতুন environment: makeAdder",
      prompt: "`makeAdder(n)` এমন function ফেরত দিক যা একটি সংখ্যা নিয়ে `n` যোগ করে। `add2(10)` ও `add5(10)` দুটি আলাদা মান দেবে — `12` ও `15`।",
      starter: `function makeAdder(n) {
  // TODO: একটি function ফেরত দিন
}

const add2 = makeAdder(2);
const add5 = makeAdder(5);

console.log(add2(10));
console.log(add5(10));`,
      expected: "12\n15",
      hints: ["ভেতরের function `n` কে free variable হিসেবে পাবে।", "`return (x) => x + n;`"],
      solution: `function makeAdder(n) {
  return (x) => x + n;
}

const add2 = makeAdder(2);
const add5 = makeAdder(5);

console.log(add2(10));
console.log(add5(10));`,
      explanation: "প্রতিটি `makeAdder` call এ নতুন environment (`n` সহ) তৈরি হয়, এবং ফেরত আসা function এর outer reference সেটিই। তাই `add2` এর chain এ `n = 2`, `add5` এর chain এ `n = 5`।",
    },
    {
      level: "intermediate",
      title: "নিজে lookup লিখুন",
      prompt: "`scope` অবজেক্টের গঠন `{ vars: {...}, parent: scope বা null }`। `lookup(scope, name)` লিখুন যা innermost থেকে বাইরে খুঁজে প্রথম match এর মান ফেরত দেবে; কোথাও না পেলে string `\"not found\"` ফেরত দেবে।",
      starter: `const globalScope = { vars: { x: 1, y: 2 }, parent: null };
const fnScope = { vars: { y: 20, z: 30 }, parent: globalScope };

function lookup(scope, name) {
  // TODO
}

console.log(lookup(fnScope, "z"));
console.log(lookup(fnScope, "y"));
console.log(lookup(fnScope, "x"));
console.log(lookup(fnScope, "w"));`,
      expected: "30\n20\n1\nnot found",
      hints: ["একটি loop এ `current = scope` থেকে `current.parent` ধরে এগোন।", "`Object.hasOwn(current.vars, name)` দিয়ে পরীক্ষা করুন; `null` এ এসে থামুন।"],
      solution: `const globalScope = { vars: { x: 1, y: 2 }, parent: null };
const fnScope = { vars: { y: 20, z: 30 }, parent: globalScope };

function lookup(scope, name) {
  let current = scope;
  while (current !== null) {
    if (Object.hasOwn(current.vars, name)) {
      return current.vars[name];
    }
    current = current.parent;
  }
  return "not found";
}

console.log(lookup(fnScope, "z"));
console.log(lookup(fnScope, "y"));
console.log(lookup(fnScope, "x"));
console.log(lookup(fnScope, "w"));`,
      explanation: "`y` প্রথমে `fnScope` এ পাওয়া যায় (`20`) — global এর `2` shadowed। `x` fnScope এ নেই, parent এ গিয়ে `1`। `w` chain এর শেষে `null` এ পৌঁছে ‘not found’।",
    },
    {
      level: "challenge",
      title: "Real-world: layered config scope",
      prompt:
        "App এর config layer (global → page → widget) এর জন্য `createScope(vars, parent)` লিখুন। এটি `get(name)`, `has(name)` ও `child(vars)` দেবে। `get` innermost layer থেকে খুঁজবে; কোথাও না পেলে `ReferenceError` ছুড়বে (বার্তা `<name> is not defined`)। `has` কখনো error ছুড়বে না। নিচের ব্যবহার থেকে প্রত্যাশিত output মিলাতে হবে।",
      starter: `function createScope(vars, parent = null) {
  // TODO: get, has, child ফেরত দিন
  return {};
}

const root = createScope({ theme: "light", lang: "bn" });
const page = root.child({ title: "Home", lang: "en" });
const widget = page.child({ title: "Banner" });

console.log(widget.get("title"));
console.log(widget.get("lang"));
console.log(widget.get("theme"));
console.log(page.get("title"));
console.log(widget.has("missing"));

try {
  widget.get("missing");
} catch (e) {
  console.log(e.name + ": " + e.message);
}`,
      expected: "Banner\nen\nlight\nHome\nfalse\nReferenceError: missing is not defined",
      hints: ["`Object.hasOwn(vars, name)` নিজের layer পরীক্ষা করে।", "না পেলে `parent` থাকলে `parent.get(name)` — না থাকলে `throw new ReferenceError(...)`।", "`child(childVars)` হলো `createScope(childVars, this)`।"],
      solution: `function createScope(vars, parent = null) {
  return {
    has(name) {
      if (Object.hasOwn(vars, name)) return true;
      return parent ? parent.has(name) : false;
    },
    get(name) {
      if (Object.hasOwn(vars, name)) return vars[name];
      if (parent) return parent.get(name);
      throw new ReferenceError(name + " is not defined");
    },
    child(childVars) {
      return createScope(childVars, this);
    },
  };
}

const root = createScope({ theme: "light", lang: "bn" });
const page = root.child({ title: "Home", lang: "en" });
const widget = page.child({ title: "Banner" });

console.log(widget.get("title"));
console.log(widget.get("lang"));
console.log(widget.get("theme"));
console.log(page.get("title"));
console.log(widget.has("missing"));

try {
  widget.get("missing");
} catch (e) {
  console.log(e.name + ": " + e.message);
}`,
      explanation: "Engine যা করে, এটি তারই ছোট সংস্করণ: নিজের layer এ খোঁজা, না পেলে parent এ যাওয়া (পুনরাবৃত্তি), chain এর শেষেও না পেলে ReferenceError। `widget` এর `title` তার নিজের layer এ প্রথম মেলে — তাই page এর `Home` shadowed। `page.get(\"title\")` অক্ষত থাকে, কারণ shadowing কেবল ভেতরের layer থেকে দেখলেই কার্যকর। `has` সঙ্গত কারণে exception ছোড়ে না — পরীক্ষা ও ব্যবহার আলাদা।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "JavaScript কোনো variable খুঁজতে কোন ক্রমে scope গুলো পরীক্ষা করে?",
        options: [
          "Global থেকে শুরু করে ভেতরের দিকে",
          "যে scope এ সবচেয়ে বেশি variable আছে সেখান থেকে",
          "Innermost scope থেকে বাইরের দিকে, প্রথম match এ থেমে; কোথাও না পেলে ReferenceError",
          "Call stack এ যে function নিচে আছে তার scope থেকে",
        ],
        answer: 2,
        explanation: "Lookup হয় innermost → outer → global, প্রথম পাওয়া নামেই থামে। Global থেকে শুরু করলে shadowing কাজই করত না। Variable এর সংখ্যা কোনো ভূমিকা রাখে না। Call stack ধরে খোঁজা dynamic scope — JavaScript এ নয়।",
      },
      {
        question: "একটি function call এর জন্য তৈরি নতুন environment এর outer reference কোথায় যায়?",
        options: [
          "Function টি যেখানে define হয়েছিল সেই environment এ",
          "যে function তাকে call করেছে তার environment এ",
          "সবসময় global environment এ",
          "কোথাও না — প্রতিটি call স্বাধীন",
        ],
        answer: 0,
        explanation: "Outer reference ঠিক হয় function এর **define এর জায়গা** দেখে (lexical)। Caller এর environment হতো dynamic scope এ। সবসময় global শুধু তখনই ঠিক, যখন function global এ define করা। ‘স্বাধীন’ হলে free variable ব্যবহারই সম্ভব হতো না।",
      },
      {
        question: "নিচের কোড কী print করে?\n`const v = 'G'; function a() { const v = 'A'; function b() { return v; } return b; } function c() { const v = 'C'; return a()(); } console.log(c());`",
        options: ["`G`", "`C`", "`undefined`", "`A`"],
        answer: 3,
        explanation: "`b` লেখা হয়েছে `a` এর ভেতরে, তাই তার chain: b → a → global; প্রথম `v` পাওয়া যায় `a` এ (`'A'`)। `c` তাকে call করলেও `c` এর `'C'` chain এ নেই। `'G'` আসত যদি `a` এ `v` না থাকত।",
      },
      {
        question: "`typeof neverDeclared` (কোথাও declare করা নেই) কী ফেরত দেয়?",
        options: [
          "ReferenceError ছোড়ে",
          "`\"undefined\"` ফেরত দেয়, error ছোড়ে না",
          "`null`",
          "SyntaxError",
        ],
        answer: 1,
        explanation: "`typeof` অ-declared নামের জন্য বিশেষ নিয়ম: chain এ না পেলেও error নয়, `\"undefined\"` স্ট্রিং। সাধারণ পড়ায় (`console.log(neverDeclared)`) ReferenceError হতো। `null` কখনোই নয়। কোডটি syntactically বৈধ, তাই SyntaxError নয়।",
      },
      {
        question: "`let n = 1; function f() { return n; } n = 2; console.log(f());` কী print করে?",
        options: ["`1`", "`undefined`", "`2`", "ReferenceError"],
        answer: 2,
        explanation: "Scope chain **binding** ধরে, মান copy করে না। `f` call হওয়ার সময় chain এর `n` binding এর বর্তমান মান `2`। `1` আসত যদি মান function তৈরির সময় copy হতো (হয় না)। `n` declared ও initialized, তাই `undefined` বা ReferenceError নয়।",
      },
    ],
    coding: [
      {
        title: "তিন স্তরের chain",
        prompt: "`level1` এ `const x = \"L1\"`, তার ভেতরের `level2` এ `const y = \"L2\"` এবং তার ভেতরের `level3` এ `const z = \"L3\"` রাখুন। `level3` এর ভেতরে `x + y + z` print করুন (`L1L2L3`)। তারপর বাইরে থেকে `typeof y` print করুন (`undefined`)।",
        starter: `function level1() {
  // TODO
}

level1();
console.log(typeof y);`,
        expected: "L1L2L3\nundefined",
        solution: `function level1() {
  const x = "L1";
  function level2() {
    const y = "L2";
    function level3() {
      const z = "L3";
      console.log(x + y + z);
    }
    level3();
  }
  level2();
}

level1();
console.log(typeof y);`,
      },
      {
        title: "প্রতি call এ নতুন counter",
        prompt: "`createIdGenerator(prefix)` লিখুন, যা একটি function ফেরত দেয়; প্রতিবার সেটি call করলে `prefix-1`, `prefix-2`, … দেয়। দুটি আলাদা generator স্বতন্ত্রভাবে গণনা করবে।",
        starter: `function createIdGenerator(prefix) {
  // TODO
}

const a = createIdGenerator("a");
const b = createIdGenerator("b");

console.log(a());
console.log(a());
console.log(b());`,
        expected: "a-1\na-2\nb-1",
        solution: `function createIdGenerator(prefix) {
  let n = 0;
  return () => {
    n += 1;
    return prefix + "-" + n;
  };
}

const a = createIdGenerator("a");
const b = createIdGenerator("b");

console.log(a());
console.log(a());
console.log(b());`,
      },
    ],
  },

  interview: [
    {
      q: "Scope Chain কী এবং variable lookup কীভাবে কাজ করে?",
      a: "Scope chain হলো environment গুলোর সেই সংযুক্ত ধারা, যেখানে প্রতিটি environment এর একটি outer reference থাকে তার ঠিক বাইরের (lexically) scope এর দিকে — inner → outer → … → global।\n\nকোনো identifier ব্যবহার হলে engine আগে নিজের scope এর record এ খোঁজে; না পেলে outer reference ধরে বাইরে যায়; প্রথম যেখানে মেলে সেই binding ব্যবহার করে এবং থেমে যায়। global এও না পেলে `ReferenceError`। ব্যতিক্রম: `typeof undeclared` error ছাড়াই `\"undefined\"` দেয়।\n\nCall stack থেকে এটি আলাদা: stack বলে ‘কে কাকে call করেছে’, chain বলে ‘কোড কোথায় লেখা’।",
    },
    {
      q: "Function এর scope chain ঠিক হয় define এর সময় না call এর সময়? কীভাবে প্রমাণ করবেন?",
      a: "Define এর সময়। Function তৈরি হওয়ার সময় সে যে environment এর ভেতরে তৈরি হয় তার reference সাথে রাখে (spec এ `[[Environment]]` ধরনের একটি অভ্যন্তরীণ slot, যা call এ নতুন environment এর outer হয়)। পরে তাকে যেখানেই call করা হোক, এই সংযোগ বদলায় না।\n\nপ্রমাণ: global এ `const label = 'G'` রাখুন। `makeReader()` এর ভেতরে `const label = 'A'` রেখে একটি function ফেরত দিন। অন্য function `other()` এ `const label = 'B'` রেখে ফেরত-আসা function কে call করুন — ফল `'A'`; `'B'` ও নয়, `'G'` ও নয়। কারণ ফেরত-আসা function এর chain: নিজের call env → makeReader এর env → global।",
    },
    {
      q: "Free variable কী? Closure এর সাথে এর সম্পর্ক কী?",
      a: "যে নাম কোনো function এর ভেতরে ব্যবহার হয় কিন্তু সেই function এর নিজস্ব scope এ (parameter বা local হিসেবে) declare করা নেই, সেটি ওই function এর free variable; তার মান আসে scope chain এর বাইরের কোনো স্তর থেকে।\n\nClosure বলতে বোঝায় function এবং তার free variable গুলোর উৎস-environment এর সংযোগ একসাথে। Function ফেরত দিলেও বা callback হিসেবে পাঠালেও সংযোগ থাকে বলে free variable এর মান পাওয়া যায়, এবং ওই environment memory তে বেঁচে থাকে (যতক্ষণ reachable)। তাই ‘function এর free variable আছে এবং সে নিজের জন্মস্থানের বাইরে ব্যবহৃত’ — এটিই closure এর বাস্তব রূপ।",
    },
    {
      q: "Scope chain lookup কি performance এর সমস্যা তৈরি করে?",
      a: "Conceptual মডেলে গভীর chain মানে বেশি ধাপ, কিন্তু আধুনিক engine সাধারণ কোডে এই খরচ প্রায় নগণ্য রাখে — কারণ scope lexical বলে কোন নাম কোন scope এ আছে তা compile এর সময়ই বেশিরভাগ ক্ষেত্রে জানা যায় এবং runtime এ সরাসরি জায়গায় পৌঁছানো যায়। এটি implementation ব্যাপার; আমরা সঠিক কৌশলের ওপর নির্ভর করি না।\n\nযে বিষয়গুলো optimisation ব্যাহত করতে পারে: `eval` ও (sloppy mode এর) `with`, যা static বিশ্লেষণ ভাঙে। বাস্তবে hot loop এ বারবার বাইরের নাম ব্যবহার নিয়ে মাথা ঘামানোর আগে profiling করুন; পাঠযোগ্যতার জন্য ছোট scope ও অর্থবহ নামই আসল নীতি।",
    },
    {
      q: "Shadowing কীভাবে scope chain এর সাথে সম্পর্কিত? `const x = x + 1` কেন ReferenceError দেয়?",
      a: "Lookup প্রথম match এ থামে বলে ভেতরের একই নামের variable chain এ আগে পড়ে, ফলে বাইরেরটি ‘shadow’ হয়ে যায় — মুছে যায় না, শুধু ওই scope থেকে অগম্য।\n\n`const x = x + 1` কে ভেতরের scope এ রাখলে `x` নামটি ওই scope এ declared (creation phase এই), কিন্তু declaration এর শেষ না হওয়া পর্যন্ত TDZ তে। ডান পাশের `x` এর lookup নিজের scope এই `x` পেয়ে যায় (যা এখনো initialize হয়নি) — তাই বাইরের `x` এ পৌঁছায়ই না, এবং `ReferenceError: Cannot access 'x' before initialization` আসে। সমাধান: ভেতরের নাম আলাদা করা।",
    },
    {
      q: "React এর হুকস বা event handler এর context এ scope chain কীভাবে প্রাসঙ্গিক?",
      a: "Component function প্রতিটি render এ আবার call হয়, ফলে প্রতিটি render এর নিজস্ব environment তৈরি হয় — সেই render এর props, state ও local variable নিয়ে। সেই render এর ভেতরে লেখা handler, effect callback বা `useCallback` এর function এর scope chain এ ওই **নির্দিষ্ট render এর environment** থাকে।\n\nএ কারণে handler সেই render এর মান ‘দেখে’ — পরের renders এর নয়। এটিই stale closure সমস্যার মূল (যেমন `setInterval` এ পুরোনো `count`)। এটি React এর বৈশিষ্ট্য নয়, plain JavaScript এর lexical scope ও closure এর সরাসরি ফল; Closures lesson এ plain JS দিয়ে সিমুলেট করে দেখা হবে।",
    },
  ],

  summary: {
    takeaways: [
      "Scope chain = environment গুলোর outer reference এর ধারা: inner → outer → … → global।",
      "Lookup innermost থেকে শুরু হয়ে বাইরের দিকে যায়, প্রথম match এ থামে; chain এ না পেলে `ReferenceError`।",
      "Function call এ নতুন environment তৈরি হয়; তার outer reference যায় function **define** হওয়ার environment এ — call এর জায়গায় নয়। Chain define এর সময় ঠিক, call stack এর সাথে সম্পর্কহীন।",
      "Shadowing = chain এ আগে-পাওয়া নাম পরের একই নামকে আড়াল করে; `const x = x + 1` TDZ error তার একটি পরিণতি।",
      "Chain **binding** ধরে, মান copy করে না — outer variable বদলালে function নতুন মান দেখে।",
      "`typeof` শুধু সম্পূর্ণ undeclared নামে নিরাপদ (`\"undefined\"`); TDZ নামে নয়।",
      "Closure scope chain এর একটি অংশকে function এর সাথে বাঁচিয়ে রাখে।",
    ],
    syntax: `// inner() এর ভেতরে কোনো নাম x এর lookup ক্রম:
//   inner's own scope  ->  outer()'s scope  ->  global scope  ->  ReferenceError

const g = "global";
function outer() {
  const o = "outer";
  function inner() {
    const i = "inner";
    return [i, o, g];      // তিন স্তর থেকে তিন নাম
  }
  return inner();
}`,
    whenToUse: [
      "কোনো variable এর মান ‘কেন এটি’ বুঝতে বা ReferenceError debug করতে — DevTools এর Scope panel এ chain ক্রমে দেখুন।",
      "Helper/callback কে বাইরের মান দিতে হলে তাকে সঠিক scope এ লিখুন অথবা argument হিসেবে পাঠান — caller এর variable আশা করবেন না।",
      "Layered config, template context, theme বা i18n এর মতো ‘ভেতরের আগে, না পেলে বাইরের’ সমস্যায় scope chain pattern নিজে ব্যবহার করা যায়।",
    ],
    next: ["Closures — chain এর আয়ু বাড়ানো function", "Hoisting ও Temporal Dead Zone (Advanced module)", "`this` Keyword — scope এর মতো দেখতে কিন্তু আলাদা নিয়মে চলা বিষয়"],
  },

  compatibility:
    "Scope chain ও lexical scope এর নিয়ম ECMAScript এর অংশ — সব browser, Node.js ও Web Worker এ একই। `Object.hasOwn` (ES2022) আধুনিক সংস্করণে (Node 16.9+ ও সাম্প্রতিক browser) আছে। Global object এর নাম পরিবেশ ভেদে আলাদা (`window`, `self`, `global`); `globalThis` সব জায়গায় কাজ করে। DevTools এর Scope panel এর লেবেল browser ও সংস্করণ ভেদে সামান্য আলাদা হতে পারে।",
};
