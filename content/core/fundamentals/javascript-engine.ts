import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "JavaScript engine আসলে কী এবং source code থেকে চলমান প্রোগ্রাম পর্যন্ত পথটি (parse → AST → bytecode → JIT) ব্যাখ্যা করতে পারবেন।",
    "**Call stack** ও **heap** এর ভূমিকা বুঝে stack overflow ও reference সংক্রান্ত আচরণ ব্যাখ্যা করতে পারবেন।",
    "Engine কী করে আর কী করে না — `setTimeout`, DOM, `fetch` যে engine এর অংশ নয় (runtime এর অংশ) তা পরিষ্কারভাবে আলাদা করতে পারবেন।",
    "SyntaxError (parse সময়) ও runtime error এর পার্থক্য বুঝে error দেখে সমস্যার ধাপ চিনতে পারবেন।",
    "Browser ও Node.js কীভাবে একই ধরনের engine এর ওপর আলাদা runtime বানায় তা বলতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "JavaScript engine আসলে কী?" },
    {
      type: "p",
      text: "আপনি যে `.js` ফাইল লেখেন তা শুধুই **টেক্সট**। কম্পিউটারের CPU টেক্সট বোঝে না — সে বোঝে machine instruction। এই দুইয়ের মাঝখানে যে প্রোগ্রামটি দাঁড়িয়ে আছে সেটিই **JavaScript engine**। সে আপনার source code পড়ে, বোঝে (parse করে), চালানোর উপযোগী রূপে বদলায়, চালায়, এবং চলাকালীন memory ও কোড অপ্টিমাইজেশন সামলায়। Chrome ও Node.js এর V8, Firefox এর SpiderMonkey, Safari এর JavaScriptCore — সবই JavaScript engine।",
    },
    {
      type: "p",
      text: "কেন এটি জানা দরকার? ৫ বছর frontend এ কাজ করলে আপনি জানেন JavaScript চলে — কিন্তু **কেন** `var` এর hoisting ঘটে, **কেন** `SyntaxError` এ একটি লাইনও চলে না, **কেন** অসীম recursion এ `RangeError` আসে, বা **কেন** `setTimeout(fn, 0)` ও সাথে সাথে চলে না — এসব প্রশ্নের উত্তর engine এর কাজের ধারা বুঝলে মুখস্থ না করেই বের করা যায়। Performance ও debugging এ এই মানসিক মডেলটিই সবচেয়ে বেশি কাজে লাগে।",
    },
    { type: "h3", text: "Source code থেকে execution: ধাপগুলো" },
    {
      type: "p",
      text: "ঠিক কতগুলো ধাপ ও কী নাম — তা engine ভেদে আলাদা, তবে **সাধারণভাবে** আধুনিক engine এই ধারা অনুসরণ করে:",
    },
    {
      type: "ol",
      items: [
        "**Parsing** — প্রথমে **tokenizer** (lexer) টেক্সটকে ছোট ছোট token এ ভাঙে (`const`, `x`, `=`, `5`, `;`)। তারপর **parser** ভাষার ব্যাকরণ মিলিয়ে token থেকে একটি গাছ বানায় — **AST (Abstract Syntax Tree)**। ব্যাকরণ ভুল হলে এখানেই `SyntaxError` — তখন প্রোগ্রামের একটি লাইনও চলে না।",
        "**Bytecode generation** — AST থেকে একটি মাঝামাঝি, compact নির্দেশমালা (bytecode) তৈরি হয়। এটি সরাসরি machine code নয়, কিন্তু source এর চেয়ে চালানো অনেক সহজ। একটি **interpreter** এই bytecode ধাপে ধাপে চালায়। এতে চালু হতে দেরি হয় না।",
        "**Profiling** — চলার সময় engine লক্ষ্য রাখে কোন function বা loop বারবার চলছে (**hot code**) এবং কোন ধরনের মান (number, string, object এর গঠন) আসছে।",
        "**JIT (Just-In-Time) compilation** — hot code টি engine চলার সময়ই optimized **machine code** এ বদলে নেয়, প্রাপ্ত তথ্যের ভিত্তিতে ধরে নেয় (assumption) যে ভবিষ্যতেও একই ধরনের মান আসবে। assumption ভেঙে গেলে engine optimized code ফেলে দিয়ে আবার ধীর কিন্তু নিরাপদ পথে ফিরে যায় (**deoptimization**)।",
      ],
    },
    {
      type: "compare",
      headers: ["পদ্ধতি", "কীভাবে চলে", "সুবিধা", "অসুবিধা"],
      rows: [
        ["Pure interpreter", "লাইন/নির্দেশ ধরে ধরে ব্যাখ্যা করে চালায়", "দ্রুত শুরু, কম memory", "বারবার চলা কোডে ধীর"],
        ["Ahead-of-time compile (যেমন C)", "চালানোর আগেই পুরো machine code বানায়", "চলার সময় খুব দ্রুত", "build ধাপ লাগে; JavaScript এর dynamic স্বভাবের সাথে কঠিন"],
        ["JIT (আধুনিক JS engine)", "প্রথমে interpret, hot অংশ চলার সময় compile", "দ্রুত শুরু + hot code এ উচ্চ গতি", "জটিল; assumption ভাঙলে deoptimization খরচ"],
      ],
    },
    { type: "h3", text: "Call stack ও Heap: engine এর দুই ধরনের memory" },
    {
      type: "p",
      text: "চলার সময় engine মূলত দুই জায়গায় তথ্য রাখে। **Call stack** হলো একটি LIFO (Last In, First Out) গঠন, যেখানে প্রতিটি function call এর জন্য একটি **frame** জমা হয় — frame এ থাকে সেই call এর local variable ও ‘ফিরে কোথায় যেতে হবে’ তথ্য। function শেষ হলে frame টি **pop** হয়। **Heap** হলো একটি বড়, কম গোছানো এলাকা যেখানে object, array, function (closure সহ) এর মতো গতিশীল আকারের মান থাকে; variable সেখানে শুধু **reference** ধরে রাখে।",
    },
    {
      type: "ul",
      items: [
        "Call stack এর আকার **সীমিত**। কোনো base case ছাড়া recursion করলে frame জমতেই থাকে, সীমা ছাড়ালে `RangeError: Maximum call stack size exceeded` (stack overflow)।",
        "Heap এর মান কেউ ধরে না থাকলে (**unreachable**) engine এর **garbage collector** নিজেই তা মুছে memory ফেরত নেয় — আপনাকে `free` করতে হয় না।",
        "JavaScript এ **একটি thread এ একটি call stack** — তাই একই সময়ে একটি মাত্র function ‘সক্রিয়’। একটি ভারী কাজ stack আটকে রাখলে UI জমে যায়।",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "ভুল ধারণা: ‘setTimeout, DOM, fetch — এগুলো JavaScript এর অংশ’",
      text: "ECMAScript ভাষার spec এ `setTimeout`, `document`, `fetch`, `localStorage` নেই। এগুলো **host environment** (runtime) জোগান দেয় — browser এর **Web APIs** অথবা Node.js এর নিজস্ব API (`fs`, `http`, `process`)। Engine শুধু ভাষা চালায়: variable, function, object, Promise এর মতো core বিষয়। একই V8 engine Chrome এ `document` পায়, Node.js এ পায় না — কারণ runtime আলাদা। Timer শেষ হলে callback টি event loop মারফত stack এ ঢোকে; সেই সমন্বয়টা runtime এর কাজ।",
    },
    {
      type: "compare",
      headers: ["বিষয়", "Engine (যেমন V8)", "Runtime (Browser / Node.js)"],
      rows: [
        ["কাজ", "JavaScript কোড parse, compile, execute; memory ও GC", "Engine কে ঘিরে থাকা পরিবেশ: I/O, timer, event loop, API"],
        ["উদাহরণ API", "`Array`, `Promise`, `Map`, `JSON`, `Math`", "Browser: `document`, `fetch`, `setTimeout`, `localStorage`; Node.js: `fs`, `process`, `require`"],
        ["Call stack ও heap", "ম্যানেজ করে", "Callback কে stack এ ফেরত পাঠায় (event loop)"],
        ["বদলানো যায়?", "Chrome/Node এ V8, Firefox এ SpiderMonkey ইত্যাদি", "Browser ভেদে Web API আলাদা; Node.js এর API আলাদা"],
      ],
    },
    {
      type: "code",
      caption: "শুধু ধারণা দেখানোর জন্য — Browser এ চালালে কাজ করে, Node.js এ `document` নেই (এখানে execute হবে না)।",
      code: `// Browser runtime: document engine এর নয়, browser এর API
const title = document.querySelector("h1");
title.textContent = "Hello";

// Node.js runtime: process ও require Node এর API, engine এর নয়
const fs = require("node:fs");
console.log(process.version);`,
    },
    {
      type: "callout",
      tone: "danger",
      title: "নিরাপত্তা নোট: engine যা দেয় তা-ই চালায়",
      text: "`eval(str)` ও `new Function(str)` একটি string কে সরাসরি engine এ parse ও execute করায়। string এ ব্যবহারকারীর ইনপুট (URL parameter, form, API response) মিশে গেলে আক্রমণকারী নিজের কোড চালাতে পারে (code injection)। Engine কোডটির উৎস যাচাই করে না — সে শুধু ব্যাকরণ ঠিক থাকলেই চালায়। তাই user-supplied string কখনো `eval` এ দেবেন না; JSON দরকার হলে `JSON.parse` ব্যবহার করুন।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Error দেখে ধাপ চিনুন",
      text: "`SyntaxError` মানে সমস্যা **parse** ধাপে — প্রোগ্রামের কিছুই চলেনি। `ReferenceError`/`TypeError` মানে প্রোগ্রাম চলছিল, কোনো একটি নির্দিষ্ট লাইনে সমস্যা হয়েছে। `RangeError: Maximum call stack size exceeded` মানে call stack ভরে গেছে। এই তিন ধরনের পার্থক্য জানলে debugging এর শুরুটাই ঠিক জায়গা থেকে হয়।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ধরুন আপনি একটি বিদেশি ভাষায় লেখা **রেসিপি** দিয়ে রান্নাঘরে খাবার বানাচ্ছেন। **Engine** হলো সেই দক্ষ **বাবুর্চি**, যে রেসিপি বোঝে ও রান্না করে। **Runtime** হলো পুরো **রান্নাঘর** — চুলা, ফ্রিজ, টাইমার, ডেলিভারি জানালা।",
    },
    {
      type: "ul",
      items: [
        "**Parsing**: রান্নার আগে বাবুর্চি পুরো রেসিপি একবার পড়ে বুঝে নেয় — কোন ধাপের পর কোনটি, কোথায় ভুল লেখা। রেসিপিতে অর্থহীন লাইন (যেমন ‘চিনি দিয়ে ভাজুন তারা’) থাকলে সে রান্নাই শুরু করে না — এটিই **SyntaxError**।",
        "**AST ও Bytecode**: রেসিপিটি সে নিজের সংক্ষিপ্ত নোটে (ধাপের গাছ, তারপর সংক্ষেপিত নির্দেশ) লিখে নেয় যাতে দ্রুত অনুসরণ করা যায়।",
        "**Interpreter ও JIT**: নতুন রেসিপি সে ধাপে ধাপে মিলিয়ে করে। কিন্তু যে ধাপ (ডিম ফেটানো) দিনে শত বার লাগে, সেটি সে মুখস্থ করে হাতের অভ্যাসে নিয়ে নেয় — ফলে অনেক দ্রুত হয়। কখনো উপকরণ বদলে গেলে (ডিমের বদলে হাঁসের ডিম) অভ্যাস ফেলে আবার মেপে মেপে করে — **deoptimization**।",
        "**Call stack**: বাবুর্চির সামনের **ট্রে**। একটি কাজের মধ্যে উপ-কাজ এলে নতুন প্লেট ওপরে রাখা হয়; ওপরেরটি শেষ হলে তবেই নিচেরটিতে ফেরা যায়। ট্রে উপচে পড়লে (অসীম উপ-কাজ) — stack overflow।",
        "**Heap**: ফ্রিজ/স্টোর — বড় উপকরণ সেখানে থাকে, বাবুর্চির কাছে শুধু ‘কোন তাকে আছে’ চিরকুট (reference)। যে উপকরণের চিরকুট কারো কাছে নেই, ঝাড়ুদার (**garbage collector**) তা ফেলে দেয়।",
        "**Runtime**: টাইমার, ডেলিভারি জানালা বা কলিং বেল বাবুর্চির কাজ নয় — রান্নাঘর (runtime) সেগুলো দেয়। ‘১০ মিনিট পর স্যুপ নামাও’ — টাইমার রান্নাঘরের, শেষ হলে সে বাবুর্চির ট্রেতে নতুন কাজ রাখে।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "Source code থেকে চলমান কোড: engine pipeline",
      caption: "ধাপের নাম ও সংখ্যা engine ভেদে আলাদা; এখানে **সাধারণ** চিত্র দেখানো হয়েছে।",
      nodes: [
        { id: "src", label: "Source Code", sub: "টেক্সট" },
        { id: "parser", label: "Parser", sub: "token → গাছ" },
        { id: "ast", label: "AST", sub: "কোডের গাছ" },
        { id: "interp", label: "Interpreter", sub: "bytecode চালায়" },
        { id: "jit", label: "JIT Compiler", sub: "hot code → machine code" },
      ],
      steps: [
        {
          active: ["src"],
          items: { src: ["const total = 2 + 3;", "console.log(total);"] },
          note: "Engine এর কাছে প্রথমে শুধুই একটি **টেক্সট**। এখনো কোনো মানে বোঝা হয়নি।",
        },
        {
          active: ["parser"],
          items: { parser: ["tokens: const | total | = | 2 | + | 3 | ;", "ব্যাকরণ ঠিক আছে কি?"] },
          note: "**Parser** টেক্সটকে token এ ভাঙে এবং ব্যাকরণ যাচাই করে। এখানে ভুল পেলে `SyntaxError` — কোনো লাইনই চলবে না।",
        },
        {
          active: ["ast"],
          items: { ast: ["VariableDeclaration(total)", "  └ BinaryExpression(+)", "      ├ 2", "      └ 3"] },
          note: "ফল হলো **AST** — কোডের গঠনের গাছ। পরের সব ধাপ এই গাছ থেকেই কাজ করে।",
        },
        {
          active: ["interp"],
          items: { interp: ["bytecode: load 2, add 3, store total", "দ্রুত শুরু, ধাপে ধাপে চলে"] },
          note: "AST থেকে **bytecode** তৈরি হয় এবং **interpreter** তা চালাতে শুরু করে। কোড সাথে সাথে চালু হয়ে যায়।",
          output: "5",
        },
        {
          active: ["interp", "jit"],
          items: { interp: ["profiling: calc() 10,000 বার চলেছে", "সবসময় number এসেছে"], jit: ["hot function → optimized machine code"] },
          note: "কোনো function বারবার চললে engine বুঝে এটি **hot**। চলার সময় পাওয়া তথ্য (যেমন সবসময় number) ধরে নিয়ে সেটিকে **optimized machine code** এ বদলায়।",
        },
        {
          active: ["jit"],
          items: { jit: ["assumption ভাঙল: এবার string এল", "→ deoptimize, interpreter এ ফেরত"] },
          note: "হঠাৎ আলাদা ধরনের মান এলে optimized code ভুল হতে পারত, তাই engine তা বাদ দিয়ে নিরাপদ পথে ফিরে যায় (**deoptimization**)। আচরণ কখনো ভুল হয় না — শুধু গতি বদলায়।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Call stack ও Heap: function call কীভাবে চলে",
      caption: "`main()` → `greet()` → `format()` — প্রতিটি call এ নতুন frame, শেষে pop।",
      nodes: [
        { id: "stack", label: "Call Stack", sub: "frame এর স্তূপ (LIFO)" },
        { id: "heap", label: "Heap", sub: "object / array / closure" },
      ],
      steps: [
        {
          active: ["stack"],
          items: { stack: ["main()"], heap: [] },
          note: "প্রোগ্রাম শুরু হলে সবচেয়ে নিচে `main` (global code) এর frame।",
        },
        {
          active: ["stack", "heap"],
          items: { stack: ["main()  user → #1"], heap: ["#1 { name: 'Rina' }"] },
          note: "`const user = { name: 'Rina' }` — object টি **heap** এ তৈরি হয়; stack এ থাকে শুধু তার reference (`#1`)।",
        },
        {
          active: ["stack"],
          items: { stack: ["greet(user)", "main()"], heap: ["#1 { name: 'Rina' }"] },
          note: "`greet(user)` ডাকলে নতুন frame ওপরে বসে। `user` এর **reference** কপি হয়, object নয় — তাই দুটি নাম একই heap object দেখে।",
        },
        {
          active: ["stack"],
          items: { stack: ["format(name)", "greet(user)", "main()"], heap: ["#1 { name: 'Rina' }"] },
          note: "`greet` এর ভেতর থেকে `format` ডাকা হলো — আবার ওপরে নতুন frame। **এখন সক্রিয় শুধু সবার ওপরের frame**।",
        },
        {
          active: ["stack"],
          items: { stack: ["greet(user)", "main()"], heap: ["#1 { name: 'Rina' }"] },
          note: "`format` শেষ — তার frame **pop** হলো, ফলাফল `greet` এ ফিরল। এরপর `greet` ও শেষ হলে একই ভাবে pop হবে।",
          output: "Hi, Rina",
        },
        {
          active: ["stack", "heap"],
          items: { stack: ["main()"], heap: ["#1 { name: 'Rina' }  ← main এর user ধরে আছে"] },
          note: "শুধু `main` বাকি। `user` এখনো object ধরে আছে বলে heap এ তা বাঁচে। কেউ না ধরলে garbage collector একসময় তা মুছত।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Engine বনাম Runtime: setTimeout এর callback কীভাবে ফেরে",
      caption: "Timer ও queue **runtime** এর অংশ; callback চালায় **engine** এর call stack।",
      nodes: [
        { id: "stack", label: "Call Stack", sub: "engine" },
        { id: "webapi", label: "Timer / Web API", sub: "runtime" },
        { id: "queue", label: "Task Queue", sub: "runtime" },
        { id: "loop", label: "Event Loop", sub: "runtime" },
      ],
      steps: [
        {
          active: ["stack"],
          items: { stack: ["main()  → setTimeout(cb, 0) ডাকা হলো"] },
          note: "`setTimeout` engine এর function নয়; runtime এর API। `main` তাকে ডাকে।",
        },
        {
          active: ["webapi"],
          items: { stack: ["main()"], webapi: ["timer: cb, 0ms"] },
          note: "Runtime timer টি নিজের কাছে রেখে নেয় এবং সাথে সাথে `main` এ ফেরত দেয় — engine অপেক্ষায় আটকে থাকে না।",
        },
        {
          active: ["stack"],
          items: { stack: ["main() — বাকি sync কোড চলছে"], webapi: ["timer: cb, 0ms"] },
          note: "`main` এর বাকি **synchronous** কোড আগে শেষ হতেই হবে — `0ms` মানে ‘এখনই’ নয়, ‘stack ফাঁকা হলে সুযোগ পেলে’।",
          output: "sync শেষ",
        },
        {
          active: ["webapi", "queue"],
          items: { stack: [], queue: ["cb"] },
          note: "Timer শেষ হওয়ায় runtime `cb` কে **task queue** তে রাখে।",
        },
        {
          active: ["loop", "stack"],
          items: { stack: ["cb()"], queue: [] },
          note: "**Event loop** দেখে stack ফাঁকা, তাই queue থেকে `cb` তুলে engine এর call stack এ দেয়। এখন engine তা চালায়।",
          output: "timer callback",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Parse আগে, execution পরে: SyntaxError এ কিছুই চলে না",
      description: "Engine প্রথমে পুরো কোড parse করে। `new Function` string কে parse করে function বানায় কিন্তু চালায় না — এতে parse ধাপ আলাদা করে দেখা যায়। (শুধু শেখার জন্য; বাস্তবে user input এ কখনো নয়।)",
      code: `// ব্যাকরণ ভুল: 1x নামে variable হয় না
const brokenSource = "console.log('A'); let 1x = 2;";

try {
  new Function(brokenSource); // parse হয় -> SyntaxError, 'A' কখনো print হবে না
} catch (e) {
  console.log("parse ধাপে ধরা পড়েছে:", e.name);
}

// সঠিক source: parse সফল, কিন্তু এখনো কিছু চলেনি
const okFn = new Function("console.log('B'); return 1 + 1;");
console.log("parse শেষ, এখনো B print হয়নি");
console.log("ফল:", okFn());`,
    },
    {
      level: "intermediate",
      title: "Call stack: frame জমা হওয়া ও stack overflow",
      description: "একটি function নিজেকে ডাকলে প্রতি call এ নতুন frame জমে। base case থাকলে stack বাড়ে-কমে; না থাকলে সীমা ছাড়িয়ে `RangeError`। এখানে ঠিক কত frame এ ভাঙে তা engine ভেদে আলাদা, তাই আমরা শুধু error এর ধরন দেখছি।",
      code: `const trace = [];

function outer() {
  trace.push("outer শুরু");
  inner();
  trace.push("outer শেষ");
}
function inner() {
  trace.push("inner চলছে");
}
outer();
console.log(trace);

// base case ছাড়া recursion
function forever(n) {
  return forever(n + 1) + 1;
}
try {
  forever(0);
} catch (e) {
  console.log(e instanceof RangeError, e.name);
}

// base case সহ recursion নিরাপদ
function countDown(n) {
  return n === 0 ? "শেষ" : countDown(n - 1);
}
console.log(countDown(100));`,
    },
    {
      level: "real-world",
      title: "Engine বনাম Runtime: কোড চলার আসল ক্রম",
      description: "`setTimeout` runtime এর, Promise ও `queueMicrotask` ভাষা/engine সংশ্লিষ্ট microtask। stack ফাঁকা হওয়ার পর আগে সব microtask, তারপর timer callback চলে — এই ক্রম জানলে async bug ধরা সহজ।",
      code: `console.log("1: sync শুরু");

setTimeout(() => console.log("4: timer callback (runtime থেকে এসেছে)"), 0);

Promise.resolve().then(() => console.log("3a: Promise microtask"));
queueMicrotask(() => console.log("3b: queueMicrotask"));

console.log("2: sync শেষ");

// engine এ কী আছে আর কী নেই?
console.log("Promise:", typeof Promise);
console.log("Array:", typeof Array);
console.log("document:", typeof document);`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
console.log("Hello, Engine!");
`,
    },
    {
      label: "Function declaration আগেই পাওয়া যায় (creation phase)",
      code: `// parse/creation ধাপে function declaration টি আগেই তৈরি হয়ে যায়
console.log(add(2, 3));

function add(a, b) {
  return a + b;
}

// function expression এ তা হয় না: মান বসে execution এ পৌঁছালে
try {
  mul(2, 3);
} catch (e) {
  console.log(e.name + ": " + e.message);
}
var mul = function (a, b) {
  return a * b;
};
console.log(mul(2, 3));`,
    },
    {
      label: "Stack ও heap: primitive কপি বনাম reference",
      code: `// primitive: মানটিই কপি হয়
let a = 10;
let b = a;
b = 20;
console.log("a:", a, "b:", b);

// object: heap এ একটাই, reference কপি হয়
const p = { n: 1 };
const q = p;
q.n = 2;
console.log("p.n:", p.n, "| একই object?", p === q);

// সত্যিকারের আলাদা কপি
const r = structuredClone(p);
r.n = 99;
console.log("p.n:", p.n, "r.n:", r.n, "| একই object?", p === r);`,
    },
    {
      label: "Stack এ ফ্রেমের ক্রম দেখুন (nested calls)",
      code: `let depth = 0;
function show(msg) {
  console.log("  ".repeat(depth) + msg);
}

function c() { depth++; show("c চলছে"); depth--; }
function b() { depth++; show("b শুরু"); c(); show("b শেষ"); depth--; }
function a() { depth++; show("a শুরু"); b(); show("a শেষ"); depth--; }

a();`,
    },
  ],

  debugging: [
    {
      title: "TypeError: mul is not a function (function expression আগে ডাকা)",
      bad: `console.log(mul(2, 3));

var mul = function (a, b) {
  return a * b;
};`,
      why: "Creation phase এ `var mul` তৈরি হয় ঠিকই, কিন্তু মান থাকে `undefined`; function টি বসে execution এ ওই লাইনে পৌঁছালে। তাই আগে ডাকলে `undefined(...)` — অর্থাৎ ‘mul is not a function’। শুধু **function declaration** পুরোপুরি আগেই তৈরি হয়।",
      fix: `const mul = function (a, b) {
  return a * b;
};
console.log(mul(2, 3));`,
    },
    {
      title: "RangeError: Maximum call stack size exceeded",
      bad: `function sum(n) {
  return n + sum(n - 1); // থামার শর্ত নেই
}
console.log(sum(5));`,
      why: "`sum(0)` এর পর `sum(-1)`, `sum(-2)` … চলতেই থাকে। প্রতিটি call এ stack এ নতুন frame জমে এবং কোনোটিই return করে না। stack সীমিত, তাই সীমা ছাড়ালে engine `RangeError` ছোড়ে।",
      fix: `function sum(n) {
  if (n <= 0) return 0; // base case: এখানে recursion থামে
  return n + sum(n - 1);
}
console.log(sum(5));`,
    },
    {
      title: "async ফল সাথে সাথে পাওয়ার আশা (setTimeout sync নয়)",
      bad: `let result;
setTimeout(() => {
  result = "ডেটা এসেছে";
}, 0);
console.log(result);`,
      why: "`setTimeout` এর callback runtime event loop এর মাধ্যমে stack ফাঁকা হওয়ার পরে চলে। `console.log(result)` তার আগেই চলে, তখন `result` এখনো `undefined`। callback এর ফল ব্যবহার করতে হবে callback এর ভেতরে বা Promise/`await` দিয়ে।",
      fix: `const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  let result;
  await wait(0);
  result = "ডেটা এসেছে";
  console.log(result);
}
main();`,
    },
    {
      title: "SyntaxError: একটি ভুলে পুরো ফাইল অচল",
      bad: `console.log("শুরু");
const = 5;
console.log("শেষ");`,
      why: "Engine আগে পুরো কোড parse করে। `const = 5` এর ব্যাকরণ ভুল, তাই parse ধাপেই `SyntaxError` — ফলে প্রথম লাইনের `console.log(\"শুরু\")` ও চলে না। এটি runtime error এর মতো নয়, যেখানে ভুলের আগের লাইনগুলো চলে।",
      fix: `console.log("শুরু");
const value = 5;
console.log("শেষ", value);`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "SyntaxError ধরুন (parse ধাপ)",
      prompt: "`new Function(code)` ভুল ব্যাকরণ পেলে parse ধাপেই error ছোড়ে। `try/catch` দিয়ে সেই error ধরে শুধু তার `name` print করুন।",
      starter: `const code = "let 1x = 5;";

// TODO: try/catch দিয়ে new Function(code) ডাকুন এবং error এর name print করুন
new Function(code);`,
      expected: "SyntaxError",
      hints: ["`try { ... } catch (e) { ... }` ব্যবহার করুন।", "`e.name` এ error এর ধরন থাকে।"],
      solution: `const code = "let 1x = 5;";
try {
  new Function(code);
} catch (e) {
  console.log(e.name);
}`,
    },
    {
      level: "beginner",
      title: "Reference কপি থেকে আলাদা কপি",
      prompt: "`b` কে `a` এর **আলাদা কপি** বানান যাতে `b.n = 2` করলেও `a.n` অপরিবর্তিত (`1`) থাকে। `a.n` print করুন।",
      starter: `const a = { n: 1 };
const b = a; // TODO: এটি শুধু reference কপি; আলাদা কপি বানান
b.n = 2;
console.log(a.n);`,
      expected: "1",
      hints: ["object একটাই থাকে heap এ; `const b = a` শুধু ঠিকানা কপি করে।", "`structuredClone(a)` ব্যবহার করুন।"],
      solution: `const a = { n: 1 };
const b = structuredClone(a);
b.n = 2;
console.log(a.n);`,
    },
    {
      level: "beginner",
      title: "Microtask কে sync এর পরে চালান",
      prompt: "`start`, `end`, `microtask`, `timeout` — এই ক্রমে print করতে হবে। `Promise.resolve().then(...)` দিয়ে `microtask` লাইনটি যোগ করুন; `end` sync এ চলবে।",
      starter: `console.log("start");
setTimeout(() => console.log("timeout"), 0);

// TODO: এখানে Promise দিয়ে "microtask" print করান

// TODO: "end" print করুন (sync)`,
      expected: "start\nend\nmicrotask\ntimeout",
      hints: ["sync কোড আগে চলে, তারপর microtask, তারপর timer।", "`Promise.resolve().then(() => console.log(\"microtask\"))`।"],
      solution: `console.log("start");
setTimeout(() => console.log("timeout"), 0);

Promise.resolve().then(() => console.log("microtask"));

console.log("end");`,
      explanation: "Sync কোড (`start`, `end`) শেষ হলে stack ফাঁকা হয়; তখন engine প্রথমে সব microtask (`.then`) চালায়, তারপর runtime এর timer callback।",
    },
    {
      level: "intermediate",
      title: "Recursive sum",
      prompt: "`sum(n)` function টি লিখুন যা `1` থেকে `n` পর্যন্ত যোগফল recursion দিয়ে বের করে। `sum(100)` print করুন।",
      starter: `function sum(n) {
  // TODO: base case + recursive call
  return 0;
}
console.log(sum(100));`,
      expected: "5050",
      hints: ["base case: `n <= 0` হলে `0` ফেরত দিন।", "নইলে `n + sum(n - 1)`।"],
      solution: `function sum(n) {
  if (n <= 0) return 0;
  return n + sum(n - 1);
}
console.log(sum(100));`,
    },
    {
      level: "intermediate",
      title: "Stack overflow এড়ান",
      prompt: "বড় `n` (১,০০০,০০০) এর জন্য recursion এ call stack ভরে যায়। recursion বাদ দিয়ে loop দিয়ে `sumTo(n)` লিখুন যাতে `sumTo(1000000)` print করে `500000500000`।",
      starter: `function sumTo(n) {
  if (n <= 0) return 0;
  return n + sumTo(n - 1); // এটি বড় n এ RangeError দেয়
}
console.log(sumTo(1000000));`,
      expected: "500000500000",
      hints: ["`let total = 0;` ও `for` loop ব্যবহার করুন।", "loop এ নতুন call frame জমে না।"],
      solution: `function sumTo(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}
console.log(sumTo(1000000));`,
      explanation: "Loop একই frame এ কাজ করে, তাই stack বাড়ে না। Recursion এ প্রতি call এ নতুন frame লাগে; ১০ লক্ষ frame সাধারণ stack সীমার চেয়ে অনেক বেশি।",
    },
    {
      level: "challenge",
      title: "Call stack tracer বানান",
      prompt:
        "`traced(name, fn)` function লিখুন যা `fn` কে এমনভাবে মুড়িয়ে দেয় যে call এর সময় `enter name` এবং শেষে `exit name` print হয়, আর ভেতরের call গুলো ২ space করে ইনডেন্ট হয় (call stack এর গভীরতা অনুযায়ী)। ফল নিচের মতো হবে।",
      starter: `let depth = 0;

function traced(name, fn) {
  // TODO: depth অনুযায়ী ইনডেন্ট করে "enter name", fn() চালান, তারপর "exit name"
  return fn;
}

const b = traced("b", () => {});
const a = traced("a", () => {
  b();
});
const main = traced("main", () => {
  a();
});

main();`,
      expected: "enter main\n  enter a\n    enter b\n    exit b\n  exit a\nexit main",
      hints: [
        "`depth` হলো এই মুহূর্তে stack এ কয়টি traced frame আছে।",
        "`enter` print করে `depth++`, `fn` চালান, `depth--`, তারপর `exit` print করুন।",
        "ইনডেন্ট: `\"  \".repeat(depth)`।",
      ],
      solution: `let depth = 0;

function traced(name, fn) {
  return (...args) => {
    console.log("  ".repeat(depth) + "enter " + name);
    depth++;
    const result = fn(...args);
    depth--;
    console.log("  ".repeat(depth) + "exit " + name);
    return result;
  };
}

const b = traced("b", () => {});
const a = traced("a", () => {
  b();
});
const main = traced("main", () => {
  a();
});

main();`,
      explanation: "`depth` কার্যত call stack এর গভীরতা গুনছে: ঢোকার সময় বাড়ে, বেরোনোর সময় কমে — ঠিক যেমন frame push/pop হয়। `exit` print করার আগে `depth--` করা হয়েছে বলে `exit` ও তার `enter` এর ইনডেন্ট এক।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "নিচের কোনটি JavaScript engine (যেমন V8) নিজে করে **না**, বরং runtime জোগান দেয়?",
        options: [
          "Source code parse করা",
          "Garbage collection",
          "`setTimeout` এর timer চালানো",
          "Bytecode তৈরি করা",
        ],
        answer: 2,
        explanation:
          "`setTimeout` ECMAScript ভাষার অংশ নয়; browser বা Node.js (runtime) এটি দেয়। Parse, garbage collection ও bytecode তৈরি — তিনটিই engine এর নিজস্ব কাজ, তাই বাকি তিন অপশন ভুল।",
      },
      {
        question: "Parsing ধাপে engine source code থেকে কী তৈরি করে?",
        options: [
          "AST (Abstract Syntax Tree)",
          "সরাসরি optimized machine code",
          "DOM tree",
          "Call stack এর frame",
        ],
        answer: 0,
        explanation:
          "Parser token থেকে AST বানায়, তারপর bytecode ও পরে প্রয়োজনে machine code। Machine code প্রথমেই তৈরি হয় না (পরে JIT এ হয়)। DOM tree browser এর HTML parse এর ফল, JavaScript parse এর নয়। Call stack frame তৈরি হয় execution এ।",
      },
      {
        question: "একটি ফাইলের ৫ম লাইনে `SyntaxError` আছে। ১ম লাইনে `console.log(\"hi\")` থাকলে কী হবে?",
        options: [
          "`hi` print হবে, তারপর ৫ম লাইনে error",
          "কিছুই print হবে না, parse ধাপেই SyntaxError",
          "`hi` দুইবার print হবে",
          "error উপেক্ষা করে বাকি কোড চলবে",
        ],
        answer: 1,
        explanation:
          "Engine আগে পুরো ফাইল parse করে; SyntaxError এ execution শুরুই হয় না, তাই `hi` print হয় না। প্রথম অপশন ঘটে runtime error এর বেলায় (যেমন TypeError), SyntaxError এর বেলায় নয়। ‘দুইবার’ ও ‘উপেক্ষা’ — দুটিই ভিত্তিহীন।",
      },
      {
        question: "বেস কেস ছাড়া recursive function এ `RangeError: Maximum call stack size exceeded` কেন আসে?",
        options: [
          "Heap এর memory ভরে যায়",
          "অনেক বড় object তৈরি হয়",
          "Infinite `while` loop চলে",
          "Return না করা nested call এ call stack এর frame জমতে জমতে সীমা ছাড়িয়ে যায়",
        ],
        answer: 3,
        explanation:
          "প্রতিটি call এ নতুন frame stack এ বসে এবং ফেরার আগে বেরোয় না; stack এর আকার সীমিত। Heap ভরা আলাদা সমস্যা (out of memory)। `while` loop একই frame এ চলে, তাই stack বাড়ায় না — সেটি CPU আটকায়, এই error দেয় না।",
      },
      {
        question: "JIT compiler এর মূল উদ্দেশ্য কী?",
        options: [
          "Syntax error ধরা",
          "বারবার চলা (hot) কোডকে চলার সময়ই optimized machine code এ বদলে গতি বাড়ানো",
          "Garbage collection করা",
          "পুরো প্রোগ্রাম চালানোর আগেই একবারে machine code বানিয়ে ফেলা",
        ],
        answer: 1,
        explanation:
          "JIT চলার সময় profile দেখে hot কোড optimize করে। Syntax error ধরে parser, GC নিজস্ব উপাদান। ‘চালানোর আগেই পুরোটা compile’ হলো ahead-of-time compile; JIT এর বৈশিষ্ট্য হলো চলার সময় compile করা।",
      },
    ],
    coding: [
      {
        title: "Recursive string reverse",
        prompt: "recursion ব্যবহার করে `reverse(s)` লিখুন যা string উল্টে দেয়। `reverse(\"engine\")` print করুন (প্রত্যাশিত `enigne`)।",
        starter: `function reverse(s) {
  // TODO
}
console.log(reverse("engine"));`,
        expected: "enigne",
        solution: `function reverse(s) {
  if (s.length <= 1) return s;
  return reverse(s.slice(1)) + s[0];
}
console.log(reverse("engine"));`,
      },
      {
        title: "Sync, microtask, timer এর ক্রম",
        prompt: "timer আগে register করা আছে। বাকি দুটি যোগ করুন যেন output হয় `1 sync`, `2 microtask`, `3 timer` — ঠিক এই ক্রমে (আলাদা লাইনে)।",
        starter: `setTimeout(() => console.log("3 timer"), 0);

// TODO: microtask ও sync লাইন যোগ করুন`,
        expected: "1 sync\n2 microtask\n3 timer",
        solution: `setTimeout(() => console.log("3 timer"), 0);

Promise.resolve().then(() => console.log("2 microtask"));

console.log("1 sync");`,
      },
    ],
  },

  interview: [
    {
      q: "JavaScript engine কী? Source code থেকে execution পর্যন্ত সাধারণভাবে কী কী ধাপ ঘটে?",
      a: "Engine হলো সেই প্রোগ্রাম যা JavaScript কোড পড়ে ও চালায় (V8, SpiderMonkey, JavaScriptCore)।\n\n**সাধারণ ধারা:** tokenize ও **parse** করে **AST** তৈরি → AST থেকে **bytecode** তৈরি ও **interpreter** দিয়ে চালু → চলার সময় **profiling** করে hot code চিহ্নিত → hot code কে **JIT** দিয়ে optimized machine code এ রূপান্তর → assumption ভাঙলে **deoptimization**। পাশাপাশি engine call stack, heap ও garbage collection ম্যানেজ করে। বিস্তারিত ধাপ ও নাম engine ভেদে আলাদা হতে পারে — সেটিও উল্লেখ করা ভালো।",
    },
    {
      q: "Engine ও runtime এর পার্থক্য কী? `setTimeout` কার অংশ?",
      a: "**Engine** ECMAScript ভাষা চালায়: variable, function, object, Promise, `Map`, `JSON` ইত্যাদি। **Runtime** (browser বা Node.js) engine কে ঘিরে থাকে এবং বাইরের জগতের সাথে সংযোগ দেয়: timer, DOM, `fetch`, file system, event loop।\n\n`setTimeout` ECMAScript spec এ নেই; এটি runtime API। Timer শেষে runtime callback টি task queue তে রাখে, **event loop** stack ফাঁকা দেখলে তা engine এর call stack এ ঢোকায়। প্রমাণ: একই V8 Chrome এ `document` পায়, Node.js এ পায় না।",
    },
    {
      q: "SyntaxError ও ReferenceError এর মধ্যে engine এর কোন ধাপে পার্থক্য? কেন একটিতে কিছুই চলে না?",
      a: "**SyntaxError** ধরা পড়ে **parse** ধাপে — ব্যাকরণ ভুল হলে AST তৈরি করাই যায় না। তাই execution শুরুই হয় না এবং আগের লাইনগুলোর `console.log` ও চলে না।\n\n**ReferenceError** (যেমন অজানা নাম ব্যবহার, বা TDZ তে থাকা `let` পড়া) ঘটে **execution** এর সময়, নির্দিষ্ট লাইনে পৌঁছালে। তার আগের লাইনগুলো ইতিমধ্যে চলে গেছে। এই পার্থক্য বুঝলে stack trace ও লগ দেখে সমস্যা কোন ধাপের তা আন্দাজ করা সহজ হয়।",
    },
    {
      q: "Call stack ও heap এর পার্থক্য কী? Stack overflow কেন হয়?",
      a: "**Call stack** হলো function call এর frame এর LIFO স্তূপ: প্রতি call এ frame push (local variable সহ), return এ pop। আকার সীমিত। **Heap** হলো object, array, closure এর মতো গতিশীল মানের জায়গা; variable সেখানে reference ধরে রাখে এবং unreachable হলে garbage collector মুছে ফেলে।\n\n**Stack overflow:** base case ছাড়া বা অতি গভীর recursion এ frame জমতে জমতে সীমা ছাড়ায়, ফলে `RangeError: Maximum call stack size exceeded`। সমাধান: base case নিশ্চিত করা, loop এ রূপান্তর, বা গভীরতা কমানো। সীমাটি ঠিক কত — তা engine ও পরিবেশ ভেদে আলাদা।",
    },
    {
      q: "JIT compilation কী এবং engine কেন শুধু interpreter বা শুধু compiler ব্যবহার করে না?",
      a: "JIT মানে চলার সময় compile করা। **শুধু interpreter** হলে শুরু দ্রুত কিন্তু hot loop ধীর। **শুধু আগাম compile** হলে চালু হতে দেরি, আর JavaScript এ ভেরিয়েবলের type চলার সময়েই জানা যায় বলে ভালো optimization কঠিন।\n\nতাই engine প্রথমে bytecode interpret করে দ্রুত চালু করে, পাশাপাশি profile সংগ্রহ করে (কোন function hot, কী ধরনের মান আসে)। hot code কে সেই তথ্যের ওপর ভর করে optimized machine code এ বদলায়। assumption ভাঙলে (যেমন number এর জায়গায় string) **deoptimize** করে নিরাপদ পথে ফেরে — তাই আচরণ সঠিক থাকে, শুধু গতি বদলায়।",
    },
    {
      q: "কেন `eval` ও `new Function` এ user input দেওয়া বিপজ্জনক?",
      a: "এগুলো একটি string কে সরাসরি engine এ parse ও execute করায়। Engine কোডটির উৎস বা ইচ্ছা যাচাই করে না — ব্যাকরণ ঠিক থাকলেই চালায়। ইনপুটে আক্রমণকারীর লেখা কোড মিশে গেলে সেটি আপনার origin এর অনুমতি নিয়ে চলে (cookie, token, DOM, ব্যবহারকারীর কাজ) — একে **code injection** বা XSS এর একটি রূপ বলা যায়।\n\nনিরাপদ বিকল্প: ডেটার জন্য `JSON.parse`, ডাইনামিক আচরণের জন্য আগে থেকে লেখা function এর map (`handlers[name]`), আর প্রয়োজনে কড়া Content Security Policy যা `eval` নিষিদ্ধ করে।",
    },
  ],

  summary: {
    takeaways: [
      "Engine হলো JavaScript কোড parse, compile ও execute করার প্রোগ্রাম (V8, SpiderMonkey, JavaScriptCore)।",
      "সাধারণ ধারা: source → parse → AST → bytecode (interpreter) → hot code এ JIT → দরকারে deoptimization।",
      "SyntaxError parse ধাপে ধরা পড়ে (কিছুই চলে না); অন্য error execution এর সময়।",
      "Call stack সীমিত ও LIFO; heap এ object থাকে ও garbage collector পরিষ্কার করে।",
      "`setTimeout`, DOM, `fetch`, `fs` engine এর নয়, **runtime** এর। Callback event loop হয়ে stack এ ফেরে।",
      "Engine যা পায় তা-ই চালায় — তাই user input কখনো `eval` এ দেবেন না।",
    ],
    syntax: `// Engine যা বোঝে (ECMAScript): ভাষার core
const data = [1, 2, 3].map((n) => n * 2);
const p = Promise.resolve(data);

// Runtime যা জোগায়: environment ভেদে আলাদা
setTimeout(() => {}, 0);   // browser ও Node.js উভয়েই আছে, কিন্তু runtime এর
// document, fetch (browser) / fs, process (Node.js)

// parse ধাপ আলাদা দেখতে (শুধু শেখার জন্য)
try { new Function("let 1x;"); } catch (e) { console.log(e.name); }`,
    whenToUse: [
      "Async ক্রম (sync → microtask → timer) নিয়ে ধোঁয়াশা হলে: engine বনাম runtime আলাদা করে ভাবুন।",
      "Stack overflow দেখলে: base case, recursion এর গভীরতা, বা loop এ রূপান্তর পরীক্ষা করুন।",
      "SyntaxError এ কোনো আউটপুট না এলে: parse সমস্যা খুঁজুন, logic নয়।",
      "Performance নিয়ে কাজ করার আগে: hot code, type-stable কোড, GC চাপের ধারণা মাথায় রাখুন (পরের lesson: V8 Engine)।",
    ],
    next: [
      "V8 Engine — Ignition, TurboFan, hidden class ও GC এর সাধারণ ধারণা",
      "Data Types — primitive ও object, `typeof` এর অদ্ভুত আচরণ",
      "Event Loop, Call Stack ও Task Queue (Async module, গভীর আলোচনা)",
    ],
  },

  compatibility:
    "Engine এর ধারণা (parse → bytecode → JIT, call stack, heap) browser ও Node.js উভয় ক্ষেত্রে একই ধরনের, কারণ Chrome ও Node.js উভয়েই V8 ব্যবহার করে (Firefox এ SpiderMonkey, Safari তে JavaScriptCore — গঠন আলাদা হলেও সাধারণ ধারণা মেলে)। তবে `setTimeout`, `document`, `fetch`, `require`, `process` runtime এর API বলে পরিবেশ ভেদে আলাদা — যেমন `document` শুধু browser এ, `process`/`require` শুধু Node.js এ। এই lesson এর executable কোড কেবল engine ও সাধারণ runtime ফিচার (`setTimeout`, `Promise`, `structuredClone`) ব্যবহার করে, তাই Playground এর Web Worker এ চলে। `new Function` কিছু কড়া Content Security Policy তে বন্ধ থাকতে পারে।",
};
