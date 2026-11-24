import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "V8 কী, কোথায় কোথায় ব্যবহার হয় এবং অন্য engine (SpiderMonkey, JavaScriptCore) থেকে এর অবস্থান কী — তা বলতে পারবেন।",
    "V8 এর সাধারণ pipeline — parser, Ignition interpreter, optimizing compiler (TurboFan) ও deoptimization — ব্যাখ্যা করতে পারবেন।",
    "**Hidden class (shape)** ও **inline caching** এর ধারণা বুঝে ‘কেন consistent object shape ভালো’ তা যুক্তি দিয়ে বলতে পারবেন।",
    "V8 এর garbage collection এর (generational, Orinoco) সাধারণ ধারণা ও memory leak এর কারণ ব্যাখ্যা করতে পারবেন।",
    "Engine design থেকে আসা বাস্তব performance পরামর্শ (type-stable কোড, packed array, ছোট-দীর্ঘস্থায়ী cache) নিজের কোডে প্রয়োগ করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "V8 কী এবং কেন এটি গুরুত্বপূর্ণ?" },
    {
      type: "p",
      text: "**V8** হলো Google এর তৈরি open-source **JavaScript (ও WebAssembly) engine**, যা C++ এ লেখা। আপনি প্রতিদিন যে টুলগুলো ব্যবহার করেন — **Google Chrome**, **Microsoft Edge** (Chromium ভিত্তিক), **Node.js**, **Deno**, **Electron** — এগুলোর সবই V8 এর ওপর দাঁড়িয়ে। অর্থাৎ ৫ বছর frontend/Node এ কাজ করলে আপনার কোড অধিকাংশ সময় V8 এ-ই চলেছে। তাই V8 এর স্বভাব জানলে নিজের কোডের performance ও আচরণ সম্পর্কে আন্দাজ নয়, যুক্তি করা যায়।",
    },
    {
      type: "p",
      text: "মনে রাখবেন, V8 **শুধু engine**। আগের lesson এ দেখেছি `setTimeout`, DOM বা `fetch` engine এর অংশ নয়; Chrome এ সেগুলো Blink/Web API দেয়, Node.js এ দেয় libuv ও Node এর নিজস্ব API। V8 যা করে: ECMAScript কোড parse, compile, execute এবং memory (heap, GC) পরিচালনা।",
    },
    {
      type: "compare",
      headers: ["Engine", "সাধারণত যেখানে পাবেন", "মন্তব্য"],
      rows: [
        ["V8", "Chrome, Edge, Node.js, Deno, Electron", "সর্বাধিক ব্যবহৃত; Google এর open-source প্রকল্প"],
        ["SpiderMonkey", "Firefox", "Mozilla; সবচেয়ে পুরোনো JS engine এর উত্তরসূরি"],
        ["JavaScriptCore (JSC)", "Safari, WebKit ভিত্তিক পরিবেশ", "Apple; Bun সাধারণভাবে এটি ব্যবহার করে"],
      ],
    },
    {
      type: "p",
      text: "তিনটি engine ই ECMAScript spec মেনে চলে, তাই ভাষার আচরণ (সঠিক কোডের ফল) একই। আলাদা হয় ভেতরের কৌশল ও গতির বৈশিষ্ট্য। নিচের আলোচনা V8 কেন্দ্রিক, তবে মূল ধারণাগুলো (profile, JIT, shape, generational GC) সব আধুনিক engine এই কোনো না কোনো রূপে আছে।",
    },
    { type: "h3", text: "V8 এর pipeline: সাধারণ চিত্র" },
    {
      type: "ul",
      items: [
        "**Parser** — source কে AST এ রূপান্তর করে। বড় প্রোগ্রামে সবকিছু আগে পুরো বিশ্লেষণ করলে শুরু ধীর হয়, তাই engine সাধারণভাবে কিছু function এর পূর্ণ বিশ্লেষণ পরে (প্রথমবার ডাকার সময়) করে — এই কৌশলকে **lazy parsing** বলা হয়।",
        "**Ignition** — V8 এর **bytecode interpreter**। AST থেকে compact bytecode বানায় ও চালায়। এতে memory কম লাগে ও কোড দ্রুত চালু হয়।",
        "**Optimizing compiler (TurboFan)** — যে কোড বারবার চলে (hot) এবং যার আচরণ স্থিতিশীল, তার ওপর ভর করে optimized machine code বানায়। সময়ের সাথে V8 এ মধ্যবর্তী স্তরের আরও compiler যুক্ত হয়েছে; সঠিক সংখ্যা ও নাম সংস্করণ ভেদে বদলায়, তাই মূল ধারণাটি মনে রাখাই যথেষ্ট: **সস্তা ও দ্রুত শুরু → পরে ব্যয়বহুল কিন্তু দ্রুততর কোড**।",
        "**Deoptimization** — optimized code যে assumption এর ওপর বানানো, তা ভাঙলে (যেমন সবসময় number আসার কথা, এল string) V8 সেই code বাদ দিয়ে নিরাপদ পথে ফিরে যায়। ফলাফল ভুল হয় না, শুধু গতি কমে।",
      ],
    },
    { type: "h3", text: "Hidden class (shape) ও inline caching" },
    {
      type: "p",
      text: "JavaScript এ object এর property চলার সময় যোগ-বিয়োগ করা যায়, তাই `obj.x` খুঁজতে প্রতিবার নাম ধরে খোঁজা ধীর হতো। V8 (এবং অন্য engine) তাই object এর গঠনের একটি অভ্যন্তরীণ বর্ণনা রাখে, যাকে সাধারণভাবে **hidden class** বা **shape** বলা হয় (V8 এর ভেতরে এর নাম ভিন্ন হতে পারে)। একই property একই ক্রমে যোগ করে বানানো object গুলো সাধারণভাবে **একই shape** ভাগ করে।",
    },
    {
      type: "p",
      text: "এর ওপর ভিত্তি করে **inline caching (IC)** কাজ করে: কোনো জায়গায় `point.x` পড়ার সময় V8 মনে রাখে ‘এই shape এর object এ `x` এর অবস্থান এই জায়গায়’। পরেরবার একই shape পেলে খোঁজা ছাড়াই সরাসরি পড়ে নেয়। সবসময় একই shape এলে সেটি দ্রুত (monomorphic), কয়েকটি shape এলে কিছু ধীর, আর অনেক রকম shape এলে সবচেয়ে ধীর অবস্থায় যেতে পারে। একই কোডের আচরণ (ফল) সব ক্ষেত্রে সঠিক থাকে — বদলায় শুধু গতি।",
    },
    {
      type: "compare",
      headers: ["অভ্যাস", "Engine এর দৃষ্টিতে", "ফল (সাধারণভাবে)"],
      rows: [
        ["সবসময় একই ক্রমে property দিয়ে object বানানো (factory/class)", "একই shape, IC স্থিতিশীল", "দ্রুত ও অনুমানযোগ্য"],
        ["ভিন্ন ক্রমে property যোগ, শর্তসাপেক্ষে কিছু property", "একাধিক shape", "IC polymorphic হয়, optimization কম"],
        ["`delete obj.key` বা অনেক dynamic key", "object ‘ডিকশনারি’ আচরণে যেতে পারে", "property access তুলনামূলক ধীর"],
        ["একটি field এ কখনো number কখনো string", "type assumption ভাঙে", "deoptimization এর ঝুঁকি"],
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "ভুল ধারণা: ‘Micro-optimization সবসময় করতে হবে’",
      text: "ওপরের অভ্যাসগুলো আপনার প্রতিটি লাইন বদলানোর নির্দেশ নয়। বেশিরভাগ অ্যাপে bottleneck হলো network, DOM বা অ্যালগরিদম, engine এর IC নয়। Consistent shape ও type-stable কোড এমনিতেই ভালো কোডিং (পড়তে সহজ, TypeScript এর সাথে মেলে) — তাই এগুলো **ডিফল্ট অভ্যাস** হিসেবে রাখুন, কিন্তু optimization এর আগে সবসময় profiler (Chrome DevTools Performance / Node `--cpu-prof`) দিয়ে মাপুন। Engine এর ভেতরের heuristic সংস্করণে বদলায়, তাই ‘অমুক ট্রিক এত দ্রুত’ ধরনের দাবি সময়ের সাথে বাসি হয়।",
    },
    { type: "h3", text: "Memory ও Garbage Collection (Orinoco)" },
    {
      type: "p",
      text: "V8 এর garbage collector এর প্রকল্পের নাম **Orinoco**। সাধারণভাবে এটি **generational**: নতুন তৈরি object গুলো ‘young generation’ এ যায়, যেখানে ঘন ঘন ও দ্রুত সংগ্রহ চলে — কারণ বেশিরভাগ object অল্প সময়েই অপ্রয়োজনীয় হয়। যেগুলো টিকে যায় সেগুলো ‘old generation’ এ সরে যায়, যেখানে সংগ্রহ কম ঘটে কিন্তু বেশি কাজের। V8 কাজটি যতটা সম্ভব **parallel** ও **concurrent** (main thread আটকে না রেখে) করে pause কমানোর চেষ্টা করে।",
    },
    {
      type: "p",
      text: "মূল নিয়মটি সহজ: GC ঠিক করে কোন object **reachable** (global, stack এর variable বা অন্য reachable object থেকে ধরা যায়)। unreachable object এর memory ফেরত নেওয়া হয়। তাই **memory leak** মানে ‘GC এর ভুল’ নয় — মানে আপনি নিজেই অজান্তে reference ধরে রেখেছেন: ক্রমবর্ধমান global cache/Map, মুছে না ফেলা event listener, বা বন্ধ হয়ে যাওয়া component এর ধরে রাখা closure।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Browser ও Node.js এ V8 ব্যবহারের পার্থক্য",
      text: "Chrome ও Node.js এ V8 এর **সংস্করণ আলাদা** হতে পারে (প্রতিটি Chrome ও Node release এ ভিন্ন V8 বান্ডেল থাকে), তাই নতুন ভাষা-ফিচার একটিতে আগে আসতে পারে। Node.js এ V8 এর সংস্করণ `process.versions.v8` থেকে জানা যায়, আর `node --max-old-space-size=...` এর মতো flag দিয়ে heap এর সীমা বদলানো যায়। Browser এ এমন flag নেই, memory সীমা ট্যাব/ডিভাইস ভেদে আলাদা। একই কোড দুই জায়গায় একই **ফল** দেবে, কিন্তু গতি ও memory সীমা আলাদা হতে পারে।",
    },
    {
      type: "code",
      caption: "শুধু Node.js এ চলে (`process` Node এর API) — এখানে execute হবে না।",
      code: `// Node.js: কোন V8 সংস্করণ বান্ডল করা আছে
console.log(process.versions.v8);

// heap সীমা বাড়িয়ে চালানো (terminal এ):
// node --max-old-space-size=4096 app.js`,
    },
    {
      type: "callout",
      tone: "danger",
      title: "নিরাপত্তা নোট: ‘V8 আছে মানে sandbox আছে’ — এমন ভাবা ভুল",
      text: "V8 কোড চালায়, কিন্তু আপনার অ্যাপের নিরাপত্তা ঠিক করে না। Node.js এ V8 এর ওপর ফাইল ও network এর পূর্ণ অ্যাক্সেস থাকে — তাই `eval`/`new Function`/`vm` এ অবিশ্বস্ত কোড চালানো বিপজ্জনক (Node এর `vm` মডিউল সত্যিকারের নিরাপত্তা সীমা নয়)। এছাড়া engine ও browser এ মাঝেমধ্যে নিরাপত্তা দুর্বলতা পাওয়া যায়; তাই Node.js ও browser আপডেট রাখা জরুরি। এবং Spectre ধরনের timing আক্রমণ থেকে বাঁচতে browser আলাদা site isolation ও কিছু API সীমিত রাখে — এটি engine এর বাইরের স্তরের সুরক্ষা।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "কল্পনা করুন একটি **বড় ডেলিভারি কোম্পানির রুট-প্ল্যানার ও কুরিয়ার টিম**। প্রতিদিন হাজারো প্যাকেজ আসে (আপনার কোড)।",
    },
    {
      type: "ul",
      items: [
        "**Ignition (interpreter)** হলো নতুন কুরিয়ার, যে প্রতিটি ঠিকানা ম্যাপ দেখে দেখে সাবধানে পৌঁছায়। কাজ শুরু করতে সময় লাগে না, কিন্তু ধীর।",
        "**Profiling** হলো ম্যানেজারের খাতা: ‘এই এলাকায় আজ ৫০০ বার গেছি’ — কোন রুট ব্যস্ত তা লেখা থাকে।",
        "**TurboFan (optimizing compiler)** হলো ব্যস্ত রুটের জন্য বানানো **এক্সপ্রেস শর্টকাট রুট**: ‘এই এলাকার সব প্যাকেজ ছোট বাক্সে আসে’ ধরে নিয়ে দ্রুত ভ্যান। বানাতে খরচ আছে, তাই শুধু ব্যস্ত রুটেই বানানো হয়।",
        "**Deoptimization**: হঠাৎ একটি ভারী ফ্রিজ এলে শর্টকাট ভ্যানে ধরে না — কোম্পানি শর্টকাট বাতিল করে সাবধানী রুটে ফেরে। ডেলিভারি ঠিকই হয়, শুধু ধীরে।",
        "**Hidden class / inline cache**: সব প্যাকেজ যদি একই ফর্ম্যাটে লেবেল করা হয় (নাম, ঠিকানা, ফোন — এই ক্রমে), কুরিয়ার ঠিকানা কোথায় লেখা আছে তা মুখস্থ জানে, খুঁজতে হয় না। একেকটির লেবেল একেক ক্রমে হলে প্রতিবার খুঁজে নিতে হয় — তাই consistent লেবেলই দ্রুত।",
        "**Garbage collector** হলো গুদামের ঝাড়ুদার। নতুন আসা প্যাকেজ (young generation) ঘন ঘন যাচাই হয় — বেশিরভাগই দ্রুত ডেলিভার হয়ে সরে যায়। পুরোনো তাকের (old generation) প্যাকেজ কম যাচাই হয়। কেউ যে প্যাকেজের ট্র্যাকিং নম্বর ধরে রেখেছে (reachable), সেটি ঝাড়ুদার ফেলে না — তাই নম্বর জমিয়ে রাখলে গুদাম ভরেই যাবে (memory leak)।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "V8 এর সাধারণ pipeline: ধীরে শুরু, দ্রুততর পরিণতি",
      caption: "ধাপের নাম V8 এ আছে; ভেতরের মধ্যবর্তী স্তর সংস্করণ ভেদে বদলায়, তাই সরল চিত্র।",
      nodes: [
        { id: "parser", label: "Parser", sub: "source → AST" },
        { id: "ignition", label: "Ignition", sub: "bytecode interpreter" },
        { id: "profile", label: "Profiling", sub: "hot code ও type তথ্য" },
        { id: "turbofan", label: "TurboFan", sub: "optimizing compiler" },
        { id: "deopt", label: "Deoptimize", sub: "assumption ভাঙলে" },
      ],
      steps: [
        {
          active: ["parser"],
          items: { parser: ["function area(r) { return 3.14 * r * r; }", "→ AST"] },
          note: "Source টি parse হয়ে AST হয়। V8 শুরুতে অনেক function সম্পূর্ণ বিশ্লেষণ পিছিয়ে দেয় (lazy parsing), যাতে চালু হতে দেরি না হয়।",
        },
        {
          active: ["ignition"],
          items: { ignition: ["AST → bytecode", "area(2) চলছে → 12.56"] },
          note: "**Ignition** bytecode বানিয়ে চালায়। প্রথম কয়েকবার ডাকে function টি এভাবেই চলে — ধীর কিন্তু সাথে সাথে প্রস্তুত।",
          output: "12.56",
        },
        {
          active: ["ignition", "profile"],
          items: { profile: ["area() ১০,০০০+ বার ডাকা", "সবসময় r = number"] },
          note: "চলার সময় engine লক্ষ্য রাখে — `area` hot, আর আর্গুমেন্ট সবসময় number।",
        },
        {
          active: ["profile", "turbofan"],
          items: { turbofan: ["assumption: r সবসময় number", "→ optimized machine code"] },
          note: "এই তথ্যের ভিত্তিতে **TurboFan** একটি দ্রুত machine code সংস্করণ বানায়, যা number ধরেই লেখা (type check ও dynamic খোঁজা কম)।",
        },
        {
          active: ["turbofan"],
          items: { turbofan: ["area(3) → optimized path", "দ্রুত চলছে"] },
          note: "পরের call গুলো optimized code এ চলে। যতক্ষণ number আসছে, এটিই দ্রুত পথ।",
          output: "28.26",
        },
        {
          active: ["turbofan", "deopt"],
          items: { deopt: ["area(\"x\") — string এল!", "optimized code বাতিল → Ignition এ ফিরে"] },
          note: "হঠাৎ `area(\"x\")`: assumption ভাঙল। V8 **deoptimize** করে — ফল তবুও সঠিক (`NaN`), শুধু গতি সাময়িকভাবে কমে। পরে আবার hot হলে নতুন তথ্য নিয়ে re-optimize হতে পারে।",
          output: "NaN",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Hidden class (shape): কেন একই ক্রম গুরুত্বপূর্ণ",
      caption: "নিয়ম ধারণা-স্তরে সরল করা; V8 এর ভেতরের বাস্তবায়নের নাম/বিবরণ ভিন্ন হতে পারে।",
      nodes: [
        { id: "empty", label: "Shape A", sub: "{ } (খালি)" },
        { id: "x", label: "Shape B", sub: "{ x }" },
        { id: "xy", label: "Shape C", sub: "{ x, y }" },
        { id: "yx", label: "Shape D", sub: "{ y, x }" },
      ],
      steps: [
        {
          active: ["empty"],
          items: { empty: ["const p1 = {}", "const p2 = {}"] },
          note: "খালি object এর একটি শুরুর shape। দুটি object এখনো একই shape ভাগ করছে।",
        },
        {
          active: ["empty", "x"],
          items: { x: ["p1.x = 1", "p2.x = 1"] },
          note: "দুটিতেই প্রথমে `x` যোগ — দুটিই A থেকে B তে যায়। shape গুলো এভাবে ‘ট্রানজিশন’ এর মাধ্যমে জোড়া থাকে।",
        },
        {
          active: ["x", "xy"],
          items: { xy: ["p1.y = 2 → Shape C", "p2.y = 2 → Shape C"] },
          note: "দুটিতেই এরপর `y` — দুটিই `{ x, y }` shape এ পৌঁছায়। এখন `p.x` পড়ার inline cache এই shape এর জন্য একটি মাত্র ঠিকানা মনে রাখে — দ্রুত।",
        },
        {
          active: ["empty", "yx"],
          items: { yx: ["const p3 = {}; p3.y = 2; p3.x = 1", "→ Shape D { y, x }"] },
          note: "`p3` এ property যোগ করা হলো **উল্টো ক্রমে** (`y` আগে)। একই দুটি key, কিন্তু ভিন্ন পথ — তাই **ভিন্ন shape**।",
        },
        {
          active: ["xy", "yx"],
          items: { xy: ["p1, p2"], yx: ["p3"] },
          note: "এখন `p.x` এর একটি call site এ কখনো C আকৃতির, কখনো D আকৃতির object আসছে। IC কে দুই (বা বেশি) shape মনে রাখতে হয় (polymorphic) — সাধারণভাবে এটি monomorphic এর চেয়ে ধীর।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Generational GC: young থেকে old",
      caption: "সাধারণ ধারণা — V8 এ অতিরিক্ত কৌশল (parallel, concurrent, incremental) জড়িত।",
      nodes: [
        { id: "young", label: "Young generation", sub: "নতুন object, ঘন ঘন GC" },
        { id: "old", label: "Old generation", sub: "দীর্ঘস্থায়ী object, কম GC" },
        { id: "roots", label: "Roots", sub: "global, stack variable" },
      ],
      steps: [
        {
          active: ["young"],
          items: { young: ["tmp1 {…}", "tmp2 {…}", "cache {…}", "user {…}"] },
          note: "নতুন তৈরি সব object প্রথমে young generation এ। এদের বেশিরভাগই অল্প সময়ের (loop এর ভেতরের temp object)।",
        },
        {
          active: ["roots", "young"],
          items: { roots: ["cache → #3", "user → #4"], young: ["tmp1 (কেউ ধরে না)", "tmp2 (কেউ ধরে না)", "cache ✓", "user ✓"] },
          note: "GC প্রথমে roots থেকে শুরু করে **reachable** object খুঁজে চিহ্নিত করে। `cache` ও `user` reachable; `tmp1`, `tmp2` কেউ ধরে নেই।",
        },
        {
          active: ["young"],
          items: { young: ["cache ✓", "user ✓"] },
          note: "Unreachable `tmp1`, `tmp2` এর জায়গা ফেরত পাওয়া গেল। young generation এর এই ছোট সংগ্রহ সাধারণত দ্রুত — কারণ বেশিরভাগ object ই মরে গেছে।",
        },
        {
          active: ["young", "old"],
          items: { young: [], old: ["cache ✓", "user ✓"] },
          note: "যে object কয়েকবার GC তে টিকে যায়, সেগুলো old generation এ সরানো হয়।",
        },
        {
          active: ["old", "roots"],
          items: { roots: ["cache → #3 (সীমাহীন বাড়ছে!)"], old: ["cache { 1,000,000 entry }", "user ✓"] },
          note: "`cache` কে global এ ধরে রাখলে আর এতে entry জমতে থাকলে সবই reachable — GC কিছু ফেলতে পারে না। এটিই বাস্তব **memory leak** এর সাধারণ রূপ: GC ঠিকই চলছে, কিন্তু আপনি reference ছাড়ছেন না।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Hot function: একই কাজ বারবার (engine optimize করে)",
      description: "`square` function টি লাখবার ডাকা হয় — V8 এর চোখে এটি hot। এই lesson এ আমরা গতি মাপছি না (সেটি অনির্ভরযোগ্য); শুধু দেখছি ফল সবসময় সঠিক, optimization বা deoptimization যা-ই ঘটুক। এমনকি অপ্রত্যাশিত type এলেও আচরণ একই থাকে।",
      code: `function square(n) {
  return n * n;
}

let total = 0;
for (let i = 1; i <= 100000; i++) {
  total += square(i % 10);   // সবসময় number: স্থিতিশীল
}
console.log("total:", total);

// হঠাৎ ভিন্ন type: engine deoptimize করতে পারে, তবু ফল সঠিক
console.log(square(4));
console.log(square("3"));      // "3" * "3" = 9 (coercion)
console.log(square("abc"));    // NaN`,
    },
    {
      level: "intermediate",
      title: "Shape fingerprint: ক্রম বদলালে shape বদলায়",
      description: "V8 এর ভেতরের shape সরাসরি দেখা যায় না, কিন্তু একটি পর্যবেক্ষণযোগ্য কাছাকাছি সূচক আছে: property **insertion order**। `shapeOf` helper সেই ক্রম ও type এর fingerprint বানায়। (এটি V8 এর shape নয়; ধারণার একটি মডেল।)",
      code: `function shapeOf(obj) {
  return Object.keys(obj).map((k) => k + ":" + typeof obj[k]).join(",");
}

const a = { x: 1, y: 2 };
const b = { x: 10, y: 20 };
const c = {};
c.y = 2;
c.x = 1;

console.log("a:", shapeOf(a));
console.log("b:", shapeOf(b));
console.log("c:", shapeOf(c));
console.log("a আর b একই গঠন?", shapeOf(a) === shapeOf(b));
console.log("a আর c একই গঠন?", shapeOf(a) === shapeOf(c));

// class/factory সবসময় একই ক্রম দেয়
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
console.log("Point:", shapeOf(new Point(1, 2)) === shapeOf(new Point(9, 8)));`,
    },
    {
      level: "real-world",
      title: "API response normalize: type-stable, একই shape",
      description: "বাস্তবে API এর ডেটায় field কখনো থাকে না, কখনো string এর বদলে number আসে। একটি `normalizeUser` factory সবসময় একই ক্রমে একই type এর field দেয় — ফলে নিচের সব কোড (এবং engine) স্থিতিশীল ধারণা নিয়ে কাজ করতে পারে।",
      code: `const rawUsers = [
  { id: "1", name: "Rina", age: "25" },
  { id: 2, name: "Karim" },                 // age নেই
  { age: 31, id: 3, name: "Mim", extra: 1 } // ক্রম আলাদা, বাড়তি field
];

function normalizeUser(raw) {
  return {
    id: Number(raw.id),
    name: String(raw.name),
    age: raw.age === undefined ? null : Number(raw.age),
  };
}

const users = rawUsers.map(normalizeUser);
console.log(users);

const shapes = new Set(users.map((u) => Object.keys(u).join(",")));
console.log("distinct key order:", shapes.size);

const adults = users.filter((u) => u.age !== null && u.age >= 18);
console.log(adults.map((u) => u.name));`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
console.log("Hello, V8!");
`,
    },
    {
      label: "Property order: integer-like key আগে আসে",
      code: `const obj = {};
obj.b = "b";
obj[2] = "two";
obj.a = "a";
obj[1] = "one";

// spec অনুযায়ী integer-like key গুলো আগে (ছোট থেকে বড়), তারপর string key insertion ক্রমে
console.log(Object.keys(obj));

// Map insertion order হুবহু ধরে রাখে, key যেকোনো type
const map = new Map();
map.set("b", 1);
map.set(2, 2);
map.set("a", 3);
map.set(1, 4);
console.log([...map.keys()]);`,
    },
    {
      label: "Packed বনাম holey array (ধারণা)",
      code: `const packed = [1, 2, 3];
const holey = [1, , 3];            // মাঝে ফাঁক
const sparse = new Array(3);       // সব ফাঁক

console.log("packed has 1?", 1 in packed);
console.log("holey has 1?", 1 in holey);
console.log("sparse has 0?", 0 in sparse);

// map ফাঁক এড়িয়ে যায়
console.log(JSON.stringify(sparse.map(() => "x")));
console.log(JSON.stringify(Array.from({ length: 3 }, () => "x")));

// V8 এর কাছে packed array সাধারণভাবে বেশি optimize-যোগ্য; holey এর জন্য অতিরিক্ত যাচাই লাগে`,
    },
    {
      label: "Type পরিবর্তনের পরিণতি (coercion)",
      code: `function add(a, b) {
  return a + b;
}

console.log(add(1, 2));        // number + number
console.log(add("1", "2"));    // string + string
console.log(add(1, "2"));      // number + string => string
console.log(add(null, 5));
console.log(add(undefined, 5));

// একই function এ বিভিন্ন type এলে engine এর জন্য তা পলিমরফিক হয়,
// আর আচরণও পাঠকের জন্য অস্পষ্ট হয়। স্পষ্টভাবে রূপান্তর করুন:
function addNumbers(a, b) {
  return Number(a) + Number(b);
}
console.log(addNumbers("1", "2"));`,
    },
  ],

  debugging: [
    {
      title: "একই ডেটা, ভিন্ন shape: ক্রম নিয়ন্ত্রণ নেই",
      bad: `function shapeOf(o) {
  return Object.keys(o).join(",");
}

function makeUser(name, age, isAdmin) {
  const user = {};
  if (isAdmin) user.role = "admin";   // শর্তসাপেক্ষে আগে যোগ
  user.name = name;
  user.age = age;
  return user;
}

const u1 = makeUser("Rina", 25, false);
const u2 = makeUser("Karim", 30, true);
console.log(shapeOf(u1) === shapeOf(u2));`,
      why: "শর্তসাপেক্ষে property যোগ হলে ও ক্রম বদলালে একই function থেকে ভিন্ন গঠনের object তৈরি হয়। Engine এ এগুলো ভিন্ন shape — একই call site এ polymorphic হয়ে যায়। এখানে দেখাচ্ছি তাদের key ক্রম মেলেনি (`false`)।",
      fix: `function shapeOf(o) {
  return Object.keys(o).join(",");
}

function makeUser(name, age, isAdmin) {
  return {
    name,
    age,
    role: isAdmin ? "admin" : null,   // সবসময় আছে, মান শুধু আলাদা
  };
}

const u1 = makeUser("Rina", 25, false);
const u2 = makeUser("Karim", 30, true);
console.log(shapeOf(u1) === shapeOf(u2));`,
    },
    {
      title: "new Array(n).map: ফাঁকা (holey) array",
      bad: `const arr = new Array(3);
const doubled = arr.map(() => 1);
console.log(JSON.stringify(doubled));`,
      why: "`new Array(3)` তিনটি **ফাঁক** (empty slot) সহ array বানায়, আসল মান নয়। `map` ফাঁক এড়িয়ে যায়, তাই callback কখনো চলেই না এবং ফলাফল ফাঁকাই থাকে (JSON এ `null`)। Holey array engine এর কাছেও packed এর চেয়ে কম অনুকূল। `Array.from({ length })` বা `fill` দিয়ে সত্যিকারের মান ভরুন।",
      fix: `const arr = Array.from({ length: 3 }, () => 1);
console.log(JSON.stringify(arr));`,
    },
    {
      title: "Object কে ordered map ভাবা: numeric key উল্টে যায়",
      bad: `const order = {};
order[30] = "পরে এসেছে";
order[10] = "আগে এসেছে";
order.note = "string key";
console.log(Object.keys(order));`,
      why: "Spec অনুযায়ী integer-like key গুলো object এ সংখ্যার ক্রমে সাজানো হয়ে আগে আসে, insertion ক্রমে নয়। তাই insertion ক্রমের ওপর নির্ভর করতে চাইলে `Map` ব্যবহার করুন — তার ক্রম নির্দিষ্ট ও key যেকোনো type এর।",
      fix: `const order = new Map();
order.set(30, "পরে এসেছে");
order.set(10, "আগে এসেছে");
order.set("note", "string key");
console.log([...order.keys()]);`,
    },
    {
      title: "বাড়তেই থাকা cache: GC এর কিছু করার নেই",
      bad: `const cache = new Map();
function remember(key, value) {
  cache.set(key, value);   // কখনো মোছা হয় না
}

for (let i = 0; i < 1000; i++) {
  remember("k" + i, { id: i });
}
console.log("cache size:", cache.size);`,
      why: "`cache` global থেকে reachable, আর তার ভেতরের প্রতিটি object ও reachable। তাই Garbage collector কিছুই মুছতে পারে না, cache সীমাহীন বাড়ে — এটি ক্লাসিক memory leak। সমাধান: আকার সীমিত রাখা (পুরোনো entry সরানো), বা key যদি object হয় তবে `WeakMap` ব্যবহার করা।",
      fix: `const MAX = 100;
const cache = new Map();
function remember(key, value) {
  if (cache.size >= MAX) {
    const oldest = cache.keys().next().value; // Map insertion ক্রমে সবচেয়ে পুরোনো
    cache.delete(oldest);
  }
  cache.set(key, value);
}

for (let i = 0; i < 1000; i++) {
  remember("k" + i, { id: i });
}
console.log("cache size:", cache.size);`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "Factory এ property এর ক্রম ঠিক করুন",
      prompt: "`createPoint(x, y)` এর key গুলো এখন `y`, `x` ক্রমে আসছে। ক্রম ঠিক করুন যাতে সবসময় `x` আগে, `y` পরে হয়। `Object.keys(createPoint(1, 2))` print করুন।",
      starter: `function createPoint(x, y) {
  return { y, x };   // TODO: ক্রম ঠিক করুন
}
console.log(Object.keys(createPoint(1, 2)));`,
      expected: "[ 'x', 'y' ]",
      hints: ["Object literal এ লেখার ক্রমই insertion ক্রম।"],
      solution: `function createPoint(x, y) {
  return { x, y };
}
console.log(Object.keys(createPoint(1, 2)));`,
    },
    {
      level: "beginner",
      title: "Holey নয়, packed array বানান",
      prompt: "ফাঁক ছাড়া `[ 0, 0, 0 ]` array বানান (`Array.from` ব্যবহার করুন) এবং print করুন।",
      starter: `const arr = new Array(3);   // TODO: এটি ফাঁকা slot বানায়
console.log(arr);`,
      expected: "[ 0, 0, 0 ]",
      hints: ["`Array.from({ length: 3 }, () => 0)`।", "`new Array(3).fill(0)` ও কাজ করে, তবে প্রথমে `Array.from` চেষ্টা করুন।"],
      solution: `const arr = Array.from({ length: 3 }, () => 0);
console.log(arr);`,
    },
    {
      level: "beginner",
      title: "দুটি object কে একই shape এ আনুন",
      prompt: "`b` এ key গুলো উল্টো ক্রমে আছে। `b` কে এমনভাবে লিখুন যাতে `a` ও `b` এর key ক্রম একই হয় (`x`, `y`) এবং `true` print হয়।",
      starter: `const a = { x: 1, y: 2 };
const b = { y: 20, x: 10 };   // TODO: ক্রম ঠিক করুন

const sameOrder = Object.keys(a).join() === Object.keys(b).join();
console.log(sameOrder);`,
      expected: "true",
      hints: ["`b` কে `{ x: 10, y: 20 }` লিখুন।"],
      solution: `const a = { x: 1, y: 2 };
const b = { x: 10, y: 20 };

const sameOrder = Object.keys(a).join() === Object.keys(b).join();
console.log(sameOrder);`,
    },
    {
      level: "intermediate",
      title: "Type-stable sum",
      prompt: "`sum(values)` এ মিশ্র type (`1`, `\"2\"`, `3`) আসে, ফলে string জোড়া লেগে যায়। প্রতিটি মানকে `Number` এ রূপান্তর করে যোগ করুন। `sum([1, \"2\", 3])` print করুন।",
      starter: `function sum(values) {
  let total = 0;
  for (const v of values) {
    total = total + v;   // TODO: type স্থিতিশীল রাখুন
  }
  return total;
}
console.log(sum([1, "2", 3]));`,
      expected: "6",
      hints: ["`Number(v)` ব্যবহার করুন।"],
      solution: `function sum(values) {
  let total = 0;
  for (const v of values) {
    total = total + Number(v);
  }
  return total;
}
console.log(sum([1, "2", 3]));`,
    },
    {
      level: "intermediate",
      title: "সীমিত আকারের cache",
      prompt: "`set(key, value)` এমনভাবে লিখুন যাতে cache এ সর্বোচ্চ `LIMIT` টি entry থাকে; সীমা পেরোলে **সবচেয়ে পুরোনোটি** মুছুন। `a`, `b`, `c` যোগ করার পর keys print করুন (`LIMIT = 2`)।",
      starter: `const LIMIT = 2;
const cache = new Map();

function set(key, value) {
  // TODO: সীমা ছাড়ালে সবচেয়ে পুরোনো key মুছুন
  cache.set(key, value);
}

set("a", 1);
set("b", 2);
set("c", 3);
console.log([...cache.keys()]);`,
      expected: "[ 'b', 'c' ]",
      hints: ["`cache.keys().next().value` হলো সবচেয়ে পুরোনো key।", "নতুন যোগ করার **আগে** `cache.size >= LIMIT` যাচাই করুন।"],
      solution: `const LIMIT = 2;
const cache = new Map();

function set(key, value) {
  if (cache.size >= LIMIT) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
  cache.set(key, value);
}

set("a", 1);
set("b", 2);
set("c", 3);
console.log([...cache.keys()]);`,
      explanation: "Map insertion ক্রম মনে রাখে, তাই `keys().next()` সবচেয়ে পুরোনোটি দেয়। সীমা বেঁধে রাখলে আপনার cache আর GC এর কাছে সীমাহীন বোঝা হয় না।",
    },
    {
      level: "challenge",
      title: "Object গুলোকে shape অনুযায়ী গুনুন",
      prompt:
        "`shapeOf(obj)` লিখুন যা `key:type` গুলো key এর ক্রমে কমা দিয়ে জুড়ে একটি string দেয় (যেমন `id:number,name:string`)। তারপর `list` এর প্রতিটি object এর shape গুনে (`Map` দিয়ে, প্রথম দেখার ক্রমে) প্রতিটি shape এর সংখ্যা এবং সবশেষে `distinct shapes: N` print করুন। `typeof null` এর ফল `object` — এটি যেমন আছে তেমনই রাখুন।",
      starter: `const list = [
  { id: 1, name: "a" },
  { id: 2, name: "b" },
  { name: "c", id: 3 },
  { id: 4, name: null },
];

function shapeOf(obj) {
  // TODO
  return "";
}

// TODO: প্রতিটি shape গুনুন ও print করুন`,
      expected: "id:number,name:string -> 2\nname:string,id:number -> 1\nid:number,name:object -> 1\ndistinct shapes: 3",
      hints: [
        "`Object.keys(obj).map((k) => k + \":\" + typeof obj[k]).join(\",\")`।",
        "`counts.set(s, (counts.get(s) ?? 0) + 1)` দিয়ে গোনা যায়।",
        "`for (const [shape, n] of counts)` loop এ `console.log(shape, \"->\", n)`।",
      ],
      solution: `const list = [
  { id: 1, name: "a" },
  { id: 2, name: "b" },
  { name: "c", id: 3 },
  { id: 4, name: null },
];

function shapeOf(obj) {
  return Object.keys(obj)
    .map((k) => k + ":" + typeof obj[k])
    .join(",");
}

const counts = new Map();
for (const item of list) {
  const s = shapeOf(item);
  counts.set(s, (counts.get(s) ?? 0) + 1);
}

for (const [shape, n] of counts) {
  console.log(shape, "->", n);
}
console.log("distinct shapes:", counts.size);`,
      explanation: "চারটি object এ তিনটি আলাদা গঠন: ক্রম আলাদা (`name` আগে) এবং field এর type আলাদা (`null` এর `typeof` হলো `object`)। Engine এ ঠিক এরকম বৈচিত্র্যই inline cache কে polymorphic করে দেয় — তাই API ডেটা normalize করা একটি ভালো অভ্যাস।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "নিচের কোন পরিবেশটি সাধারণভাবে V8 ব্যবহার **করে না**?",
        options: ["Node.js", "Google Chrome", "Safari (সাধারণভাবে JavaScriptCore)", "Deno"],
        answer: 2,
        explanation: "Safari WebKit এর JavaScriptCore ব্যবহার করে। Node.js, Chrome ও Deno তিনটিই V8 ভিত্তিক, তাই এগুলো সঠিক উত্তর নয়।",
      },
      {
        question: "V8 এ **Ignition** কী?",
        options: ["Optimizing compiler", "Bytecode interpreter", "Garbage collector", "Parser"],
        answer: 1,
        explanation: "Ignition হলো bytecode interpreter। Optimizing compiler এর নাম TurboFan, GC এর প্রকল্পের নাম Orinoco, আর parsing আলাদা parser ধাপ — তাই বাকিগুলো ভুল।",
      },
      {
        question: "**Deoptimization** কখন ঘটে?",
        options: [
          "Memory ভরে গেলে",
          "Function মুছে ফেললে",
          "ফাইল save করলে",
          "Optimized code যে assumption (যেমন সবসময় number) ধরে বানানো, তা ভেঙে গেলে",
        ],
        answer: 3,
        explanation: "Optimized code নির্দিষ্ট ধারণার ওপর বানানো; ধারণা ভাঙলে engine তা বাদ দিয়ে নিরাপদ পথে ফিরে যায়। Memory ভরা GC/out-of-memory এর বিষয়, function মোছা বা ফাইল save এর সাথে এর কোনো সম্পর্ক নেই।",
      },
      {
        question: "একই ক্রমে property যোগ করে বানানো object গুলো সাধারণভাবে কী সুবিধা দেয়?",
        options: [
          "একই hidden class (shape) ভাগ করে, ফলে inline cache স্থিতিশীল ও property access দ্রুত হয়",
          "Object গুলো স্বয়ংক্রিয়ভাবে immutable হয়ে যায়",
          "Key গুলো alphabetically সাজানো হয়",
          "ফাইলের আকার ছোট হয়",
        ],
        answer: 0,
        explanation: "Shape ভাগ করলে IC সহজে একটি অবস্থান মনে রাখতে পারে। Immutable হওয়া বা alphabetical সাজানোর সাথে এর কোনো সম্পর্ক নেই; ফাইলের আকারেও প্রভাব ফেলে না।",
      },
      {
        question: "V8 এর garbage collector কোন object এর memory ফিরিয়ে নেয়?",
        options: [
          "যেটি এক মিনিটের পুরোনো",
          "যেটি `null` ভেরিয়েবলে আছে সবসময়",
          "যেটি root (global, stack variable ইত্যাদি) থেকে আর reachable নয়",
          "যেটি এক MB এর বড়",
        ],
        answer: 2,
        explanation: "GC reachability ভিত্তিক। বয়স বা আকারে নয়। `null` বসালে সেই একটি reference ছুটে যায়, কিন্তু অন্য কোথাও ধরা থাকলে object টি বেঁচেই থাকে — তাই ‘সবসময়’ ভুল।",
      },
    ],
    coding: [
      {
        title: "সবসময় একই key ক্রম",
        prompt: "`createUser(name, age)` এমনভাবে লিখুন যাতে key ক্রম সবসময় `name`, `age` হয়। `Object.keys(createUser(\"Rina\", 25)).join(\",\")` print করুন (প্রত্যাশিত `name,age`)।",
        starter: `function createUser(name, age) {
  return { age, name };
}
console.log(Object.keys(createUser("Rina", 25)).join(","));`,
        expected: "name,age",
        solution: `function createUser(name, age) {
  return { name, age };
}
console.log(Object.keys(createUser("Rina", 25)).join(","));`,
      },
      {
        title: "স্বাধীন সারি সহ 2x2 matrix",
        prompt: "`createMatrix(rows, cols)` লিখুন যা `0` দিয়ে ভরা matrix দেয়, যেখানে প্রতিটি সারি **আলাদা array** (শেয়ার করা নয়)। তারপর `m[0][0] = 1` করে `JSON.stringify(m)` print করুন (প্রত্যাশিত `[[1,0],[0,0]]`)।",
        starter: `function createMatrix(rows, cols) {
  // TODO: প্রতিটি সারি আলাদা array হতে হবে
  return [];
}

const m = createMatrix(2, 2);
m[0][0] = 1;
console.log(JSON.stringify(m));`,
        expected: "[[1,0],[0,0]]",
        solution: `function createMatrix(rows, cols) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
}

const m = createMatrix(2, 2);
m[0][0] = 1;
console.log(JSON.stringify(m));`,
      },
    ],
  },

  interview: [
    {
      q: "V8 কী এবং কোথায় কোথায় ব্যবহার হয়? অন্য কোন engine আছে?",
      a: "V8 হলো Google এর open-source JavaScript ও WebAssembly engine, C++ এ লেখা। এটি Chrome, Microsoft Edge (Chromium), Node.js, Deno ও Electron এ ব্যবহার হয়।\n\nঅন্য প্রধান engine: **SpiderMonkey** (Firefox) ও **JavaScriptCore** (Safari; Bun ও সাধারণভাবে এটি ব্যবহার করে)। সবাই ECMAScript spec মেনে চলে, তাই সঠিক কোডের ফল একই; পার্থক্য ভেতরের কৌশল ও গতির বৈশিষ্ট্যে। V8 শুধু engine — DOM, `setTimeout`, `fs` এগুলো runtime (Blink/Node) এর অংশ।",
    },
    {
      q: "V8 কীভাবে কোড দ্রুত চালায়? Ignition ও TurboFan এর ভূমিকা কী?",
      a: "সাধারণভাবে V8 দুই স্তরের কৌশল ব্যবহার করে। প্রথমে **Ignition** bytecode বানিয়ে interpret করে — এতে চালু হতে দেরি হয় না এবং memory কম লাগে। চলার সময় engine **profile** তথ্য জমায়: কোন function hot, কোন type এর মান আসছে।\n\nযে কোড hot ও স্থিতিশীল, সেটিকে **TurboFan** (optimizing compiler) নির্দিষ্ট assumption (যেমন সবসময় number) ধরে optimized machine code এ বদলায়। assumption ভাঙলে **deoptimize** হয়ে নিরাপদ পথে ফেরে। সময়ের সাথে V8 এ মধ্যবর্তী compiler ও যুক্ত হয়েছে — সঠিক সংখ্যা সংস্করণ ভেদে বদলায়।",
    },
    {
      q: "Hidden class (shape) ও inline caching কী? এগুলো থেকে ডেভেলপার হিসেবে কী শিক্ষা পাই?",
      a: "Engine প্রতিটি object এর গঠন (কোন property কোন ক্রমে ও কোথায়) একটি অভ্যন্তরীণ বর্ণনায় রাখে — **hidden class/shape**। একই ক্রমে property যোগ করা object গুলো সাধারণত একই shape ভাগ করে। **Inline cache** কোনো `obj.x` এর call site এ ‘এই shape এর জন্য `x` এখানে’ মনে রাখে, ফলে নাম ধরে খোঁজা লাগে না।\n\nশিক্ষা: object সবসময় একই ক্রমে একই field সহ বানান (class বা factory দিয়ে); field কে শর্তসাপেক্ষে যোগ না করে `null` মান দিয়ে সবসময় রাখুন; একই field এ type বদলাবেন না; `delete` এড়ান। তবে এগুলো micro-optimization এর চেয়ে বেশি ‘ভালো স্টাইল’ — profiler ছাড়া বাড়াবাড়ি করবেন না, কারণ engine heuristic সংস্করণে বদলায়।",
    },
    {
      q: "V8 এ garbage collection সাধারণভাবে কীভাবে কাজ করে? Memory leak তাহলে কেন হয়?",
      a: "V8 এর GC (Orinoco প্রকল্প) সাধারণভাবে **generational**: নতুন object young generation এ, যেখানে ঘন ঘন দ্রুত সংগ্রহ চলে (বেশিরভাগ object অল্পায়ু); টিকে যাওয়া object old generation এ সরে, যেখানে সংগ্রহ কম কিন্তু বড়। pause কমাতে কাজের অনেকটা parallel ও concurrent করা হয়।\n\nGC নির্ধারণ করে **reachability**: root (global, stack) থেকে যে object ধরা যায় সেটি বেঁচে থাকে। Memory leak মানে GC ব্যর্থ নয়, বরং আপনার কোড অপ্রয়োজনীয় object এর reference ধরে রেখেছে — সীমাহীন cache/Map, remove না করা event listener, বন্ধ হয়ে যাওয়া component এর closure, জমতে থাকা timer। সমাধান: cache সীমিত রাখা, listener/timer পরিষ্কার করা, key object হলে `WeakMap`/`WeakSet` ভাবা।",
    },
    {
      q: "‘ভুল type এলে V8 কোড ভুল ফল দেয়’ — কথাটি কি সঠিক? Deoptimization কী?",
      a: "না, সঠিক নয়। Optimized code বানানো হয় একটি assumption এর ওপর (যেমন এই function এ সবসময় number আসে)। কোডের ভেতরে সেই assumption যাচাই করার check বসানো থাকে। যদি ভিন্ন type এসে সেই check ব্যর্থ হয়, V8 optimized code এর ওপর আস্থা না রেখে **deoptimize** করে: execution টি নিরাপদ interpreter পথে ফিরে আসে এবং সঠিক ফলই দেয়।\n\nতাই ভাষার আচরণ কখনো বদলায় না — বদলায় শুধু গতি। এ কারণেই ‘function এ type স্থিতিশীল রাখুন’ একটি **performance** পরামর্শ, **correctness** এর নয়। বারবার deopt চক্র (optimize → deopt → optimize) হলে hot path এ ক্ষতি হয়; সেটি profiler এ ধরা পড়ে।",
    },
    {
      q: "Browser এর V8 ও Node.js এর V8 এ কী পার্থক্য? একই কোড দুই জায়গায় একই চলবে কি?",
      a: "ভাষার স্তরে (ECMAScript) একই — ফল একই হবে, তবে প্রতিটি Chrome ও Node release এ V8 এর সংস্করণ আলাদা হতে পারে, ফলে নতুন ভাষা-ফিচার একটিতে আগে আসতে পারে।\n\nপার্থক্য runtime এ: Browser এ `document`, `fetch`, `localStorage` থাকে; Node.js এ `fs`, `process`, `require` থাকে। memory ও tuning ও আলাদা: Node এ `--max-old-space-size` এর মতো flag দিয়ে heap সীমা বদলানো যায় ও `process.versions.v8` দিয়ে সংস্করণ জানা যায়; browser এ সীমা ট্যাব/ডিভাইস নির্ভর। তাই পোর্টেবল কোডের জন্য ভাষার মান API ও `globalThis` ব্যবহার করুন এবং environment-নির্ভর অংশ আলাদা রাখুন।",
    },
  ],

  summary: {
    takeaways: [
      "V8 হলো Google এর engine — Chrome, Edge, Node.js, Deno, Electron এ; Firefox এ SpiderMonkey, Safari তে JavaScriptCore।",
      "সাধারণ ধারা: Parser → Ignition (bytecode) → profiling → TurboFan (optimized) → দরকারে deoptimization।",
      "Hidden class (shape) ও inline cache এর কারণে consistent object shape ও type-stable কোড সাধারণভাবে দ্রুত।",
      "Deoptimization শুধু গতি কমায়, আচরণ ভুল করে না — তাই performance পরামর্শ ≠ correctness নিয়ম।",
      "GC reachability ভিত্তিক ও generational (Orinoco); memory leak আসে আপনার ধরে রাখা reference থেকে।",
      "Micro-optimization এর আগে profiler দিয়ে মাপুন; engine এর কৌশল সংস্করণে বদলায়।",
    ],
    syntax: `// consistent shape: factory/class এ একই ক্রম
function createPoint(x, y) {
  return { x, y };
}

// type-stable: স্পষ্ট রূপান্তর
const n = Number(input);

// ফাঁক ছাড়া array
const zeros = Array.from({ length: 3 }, () => 0);

// সীমিত cache / বা object key হলে WeakMap
const cache = new Map();
const meta = new WeakMap();`,
    whenToUse: [
      "API ডেটা নিয়ে কাজের সময় একটি normalize function দিয়ে সবসময় একই shape ও type নিশ্চিত করুন।",
      "Hot loop এ আচরণ অস্থির লাগলে Chrome DevTools Performance বা Node `--cpu-prof` দিয়ে মাপুন, তারপর বদলান।",
      "ক্রমবর্ধমান cache এ আকার সীমা রাখুন; object key হলে `WeakMap` ভাবুন।",
      "Insertion ক্রম গুরুত্বপূর্ণ হলে `Map` ব্যবহার করুন, plain object নয়।",
    ],
    next: [
      "Data Types — primitive ও object, `typeof` এর অদ্ভুত আচরণ",
      "Primitive vs Reference Types — heap ও stack এর দৃষ্টিতে",
      "Memory Management ও Closures (Advanced module)",
    ],
  },

  compatibility:
    "V8 Chrome, Edge, Node.js, Deno ও Electron এ আছে; Firefox এ SpiderMonkey ও Safari তে JavaScriptCore, তাই এই lesson এর engine-নির্দিষ্ট নামগুলো (Ignition, TurboFan, Orinoco) V8 এর। ভাষার আচরণ সব engine এ একই। `process.versions.v8` ও `--max-old-space-size` শুধু Node.js এ (concept এর ভেতরে non-executed কোড হিসেবে দেখানো); এই lesson এর সব executable কোড pure JavaScript এবং browser ও Node.js এ একই ফল দেয়, তাই Web Worker Playground এ চলে। V8 এর ভেতরের কৌশল (মধ্যবর্তী compiler, heuristic) সংস্করণ ভেদে বদলায়।",
};
