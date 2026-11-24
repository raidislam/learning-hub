import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Scope মানে কী এবং global, function, block ও module scope কোনটি কখন তৈরি হয় — তা explain করতে পারবেন।",
    "**Lexical (static) scope** ও dynamic scope এর পার্থক্য বুঝবেন এবং JavaScript কেন lexical — তা runnable কোড দিয়ে প্রমাণ করতে পারবেন।",
    "Shadowing, name collision ও accidental global leakage চিনে এড়াতে পারবেন।",
    "`var` এর function scope বনাম `let`/`const` এর block scope কোডে প্রয়োগ করতে পারবেন।",
    "Lexical scope কীভাবে closure এর ভিত্তি তৈরি করে — তা conceptually বুঝবেন (environment record + outer reference)।",
    "‘Minimal scope’ নীতি মেনে পরিষ্কার ও নিরাপদ কোড লিখতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Scope আসলে কী?" },
    {
      type: "p",
      text: "**Scope** হলো কোডের সেই এলাকা, যেখানে একটি নাম (variable, function, parameter, class) **দেখা যায় ও ব্যবহার করা যায়**। একই নাম এক জায়গায় পাওয়া যায়, অন্য জায়গায় যায় না — এই নিয়মই scope। Scope না থাকলে প্রতিটি নাম পুরো প্রোগ্রামের সবার জন্য খোলা থাকত; হাজার লাইনের কোডে `i`, `total`, `data` নামগুলো একে অপরকে ভেঙে দিত।",
    },
    {
      type: "p",
      text: "Scope তিনটি কাজ করে: **(১) নামকে আড়াল করে** (encapsulation) — ভেতরের helper বাইরে থেকে দেখা যায় না; **(২) নাম-সংঘর্ষ কমায়** — দুটি function এ একই নামের `temp` থাকলেও সমস্যা নেই; **(৩) memory-র জীবনকাল নিয়ন্ত্রণ করে** — scope শেষ হলে (এবং কেউ ধরে না রাখলে) তার variable গুলো আর দরকার হয় না।",
    },
    { type: "h3", text: "JavaScript এর চার ধরনের scope" },
    {
      type: "compare",
      headers: ["Scope", "কখন তৈরি হয়", "কী কী এখানে থাকে", "মন্তব্য"],
      rows: [
        ["**Global scope**", "Script এর সবচেয়ে বাইরের স্তর", "top-level `let`/`const`/`function`, এবং `globalThis` এর property", "Browser এর classic script এ top-level `var` ও function declaration `window` এর property হয়; `let`/`const` হয় না"],
        ["**Function scope**", "প্রতিটি function call এ", "parameter, `var`, `let`, `const`, ভেতরের function declaration", "`var` কেবল এই স্তরের সীমানা মানে"],
        ["**Block scope**", "`{ }` — `if`, `for`, `while`, `try/catch`, আলাদা `{ }`", "ওই block এর `let`, `const`, `class`", "`var` block মানে না"],
        ["**Module scope**", "ES Module ফাইল (`type=\"module\"`) বা Node.js ফাইল", "ফাইলের top-level সব declaration", "Global এ লিক করে না; `export` না করলে বাইরে অদৃশ্য"],
      ],
    },
    {
      type: "p",
      text: "Module scope নিয়ে একটু বিস্তারিত: ES Module এ top-level `const helper = ...` কেবল সেই ফাইলের ভেতরেই থাকে, অন্য ফাইল `import` না করা পর্যন্ত দেখতে পায় না। Node.js এর CommonJS এও প্রতিটি ফাইল সাধারণভাবে একটি function এর ভেতরে মোড়ানো অবস্থায় চলে, তাই ফাইলের top-level `var`ও global হয় না। এ কারণেই আধুনিক bundler-ভিত্তিক project এ (React/Next.js) আমরা global নিয়ে প্রায় ভাবিই না — প্রতিটি ফাইলই নিজস্ব scope।",
    },
    {
      type: "code",
      caption: "চারটি scope এক কোডে। এই কোড Web Worker sandbox এও চলে (এখানে code টি function body এর ভেতরে চলে, তাই top-level এ লেখা নামগুলো আসলে ওই body এর scope)।",
      code: `const appName = "Learning Hub";      // outer (global/module) scope

function render(user) {              // user: function scope
  const prefix = "Hi";               // function scope

  if (user) {
    const label = prefix + " " + user; // block scope: শুধু এই { } এর ভেতর
    console.log(label, "|", appName);
  }

  // console.log(label);             // ReferenceError — block এর বাইরে label নেই
}

render("Rina");`,
    },
    { type: "h3", text: "Lexical scope: scope ঠিক হয় কোড ‘লেখা’র জায়গা দেখে" },
    {
      type: "p",
      text: "**Lexical** শব্দটি এসেছে *lexing/text* থেকে — অর্থাৎ **source code এ কোথায় লেখা হয়েছে**। JavaScript এ একটি function কোন variable গুলো দেখতে পাবে, তা ঠিক হয় function টি **কোথায় লেখা (define) হয়েছে** তার ওপর — কোথা থেকে **call** করা হচ্ছে তার ওপর নয়। এজন্য একে **static scope**ও বলা হয়: কোড না চালিয়েই শুধু ফাইল পড়ে বলে দেওয়া যায় কোন নাম কোথা থেকে আসবে (এ কারণেই ESLint, TypeScript ও bundler এর tree-shaking কাজ করতে পারে)।",
    },
    {
      type: "p",
      text: "**Dynamic scope** এর উল্টো নিয়ম: function কোন variable দেখবে তা ঠিক হতো **call stack এ কে তাকে ডেকেছে** তা দেখে। কিছু পুরোনো ভাষা বা shell script এ (যেমন Bash এর function এ local variable) এমন আচরণ দেখা যায়। JavaScript এ এটি **নেই**। নিচের উদাহরণই প্রমাণ — `caller` এর local `who` এ `showWho` এর অধিকার নেই, যদিও `caller` ই তাকে ডাকছে।",
    },
    {
      type: "code",
      code: `const who = "global";

function showWho() {
  return who;                 // showWho লেখা হয়েছে global এ -> global এর who
}

function caller() {
  const who = "caller";       // এই who শুধু caller এর scope এ
  return showWho();           // caller ডাকছে, কিন্তু scope ঠিক হবে লেখার জায়গা দেখে
}

console.log(caller());        // "global" — dynamic scope হলে "caller" আসত`,
      caption: "Lexical scope এর প্রমাণ: call করার জায়গা নয়, define করার জায়গাই scope ঠিক করে।",
    },
    { type: "h3", text: "ভেতরে কীভাবে কাজ করে? (conceptual model)" },
    {
      type: "p",
      text: "Engine প্রতিটি scope এর জন্য একটি **environment** তৈরি করে। এটিকে সহজভাবে দুই অংশের জিনিস ভাবুন: **(১) environment record** — এই scope এর নিজস্ব নাম → মান এর তালিকা; **(২) outer environment এর reference** — এই scope যে scope এর ভেতরে লেখা হয়েছে, তার দিকে একটি সংযোগ (spec এ এর নাম `[[OuterEnv]]`, পুরোনো সংস্করণে `[[Outer]]`)। Lexical Environment এর আনুষ্ঠানিক আলোচনা Advanced module এ আসবে; এখানে মূল ধারণাটুকু যথেষ্ট।",
    },
    {
      type: "ul",
      items: [
        "Function **তৈরি হওয়ার** মুহূর্তে সে মনে রাখে ‘আমাকে কোন environment এর ভেতরে তৈরি করা হয়েছে’ — এটাই তার outer reference। এটি পরে আর বদলায় না।",
        "Function **call** হলে একটি নতুন environment তৈরি হয় (parameter ও local variable নিয়ে), যার outer reference ওই মনে-রাখা environment এর দিকে।",
        "কোনো নাম খুঁজতে গেলে আগে নিজের record, না পেলে outer, তারপর তার outer… এভাবে global পর্যন্ত (এই পুরো প্রক্রিয়াই **Scope Chain**, পরের lesson এ বিস্তারিত)।",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Lexical scope ও closure এর সম্পর্ক",
      text: "Function তার outer environment এর reference নিজের সাথে বহন করে — তাই `outer()` ফিরে গেলেও ভেতরের function তার variable গুলো দেখতে পায়। এই ‘function + তার জন্মস্থানের environment’ জুটিই **closure**। অর্থাৎ closure কোনো আলাদা জাদু নয়; lexical scope এর সরাসরি পরিণতি। পরের দুটি lesson (Scope Chain, Closures) এই একই মডেলের ওপর দাঁড়িয়ে।",
    },
    { type: "h3", text: "Shadowing ও name collision" },
    {
      type: "p",
      text: "ভেতরের scope এ বাইরের scope এর একই নামের variable declare করলে ভেতরেরটি বাইরেরটিকে **আড়াল (shadow)** করে। ভেতরে ওই নাম বললে ভেতরেরটিই পাওয়া যায়; বাইরেরটি অক্ষত থাকে ও scope থেকে বেরোলে আবার দেখা যায়। Shadowing ভাষার বৈধ বৈশিষ্ট্য, কিন্তু অসাবধানে করলে bug হয় — যেমন accumulator এ `let total = 0` আবার লিখে ফেললে বাইরের `total` আর বদলায় না। (ESLint এর `no-shadow` rule এ ধরা যায়।)",
    },
    {
      type: "p",
      text: "একটি সূক্ষ্ম নিয়ম: একই scope এ `let`/`const` দিয়ে একই নাম দুবার declare করা **SyntaxError**। কিন্তু ভিন্ন scope এ একই নাম বৈধ — সেটিই shadowing। আর function এর parameter ও function body এর `var` একই নাম হলে সেগুলো একই binding হয়ে যায় — পুরোনো কোডে এই কারণে অনেক বিভ্রান্তি হতো।",
    },
    { type: "h3", text: "`var` এর function scope বনাম `let`/`const` এর block scope" },
    {
      type: "p",
      text: "Variables lesson এ দেখেছি `var` `if`/`for` এর `{ }` কে পাত্তা দেয় না, কিন্তু function এর সীমানা মানে। তাই `if` এর ভেতরে `var` লিখলেও তা পুরো function এ দেখা যায় — প্রায়ই এটি অনিচ্ছাকৃত। `let` ও `const` block এ আটকে থাকে। Lexical scope এর দৃষ্টিতে: `let`/`const` binding টি তৈরি হয় ‘নিকটতম `{ }` এর environment এ’, আর `var` binding টি তৈরি হয় ‘নিকটতম function এর environment এ’।",
    },
    {
      type: "compare",
      headers: ["", "`var`", "`let` / `const`"],
      rows: [
        ["`if (true) { X x = 1 }` এর পরে x পড়া যায়?", "হ্যাঁ (function জুড়ে)", "না (ReferenceError)"],
        ["Loop এ closure ধরলে", "সবাই একই `i` দেখে", "প্রতি iteration এ নতুন binding"],
        ["Redeclare একই scope এ", "বৈধ (নীরবে)", "SyntaxError"],
        ["নতুন কোডে ব্যবহার", "এড়িয়ে চলুন", "ডিফল্ট (`const`, দরকারে `let`)"],
      ],
    },
    { type: "h3", text: "Global leakage ও `globalThis`" },
    {
      type: "p",
      text: "পুরোনো **sloppy mode** এ কোনো declared নেই এমন নামে assign করলে (`total = 5;`, `let`/`const`/`var` ছাড়া) engine নীরবে সেটিকে global object এর property বানিয়ে দিত — একে বলে **accidental global**। বানান ভুল (`cuont = 1`) এভাবেই লুকিয়ে থাকত। **Strict mode** এ (`\"use strict\"`, ES Module, class body — এগুলো স্বয়ংক্রিয়ভাবে strict) একই কাজে `ReferenceError` আসে। এই Playground এর sandbox strict mode এ চলে, তাই নিচের উদাহরণে error দেখতে পাবেন; sloppy mode এর আচরণ এখানে চালিয়ে দেখানো যাবে না।",
    },
    {
      type: "p",
      text: "`globalThis` (ES2020) হলো সব environment এ global object পাওয়ার প্রমিত উপায়: browser এ `window`/`self`, Node.js এ `global`, Worker এ `self` — সবকিছুর জন্য একই নাম। আগে environment ভেদে আলাদা নাম লিখতে হতো। Global এ কিছু রাখতে চাইলে অন্তত `globalThis.config = ...` লিখে স্পষ্টভাবে রাখুন, অবচেতনে নয়।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "Global দূষণ বিপজ্জনক কেন?",
      text: "Global এ রাখা নাম সবার জন্য খোলা — তৃতীয়-পক্ষের script, browser extension ও আপনার অন্য module একে অপরের নাম ওভাররাইট করতে পারে। এতে hard-to-trace bug তৈরি হয়, test আলাদা করা কঠিন হয়, আর (security এর দিক থেকে) ক্ষতিকর স্ক্রিপ্ট বা prototype-pollution এর মতো আক্রমণে বিদ্যমান global এর ওপর ভরসা করা কোড ঝুঁকিতে পড়ে। সমাধান: সবসময় `const`/`let` দিয়ে declare করুন, ES Module ব্যবহার করুন, আর strict mode রাখুন।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "সাধারণ ভুল ধারণা",
      text: "**(১)** ‘Function যেখান থেকে call হয় সেখানকার variable দেখতে পায়’ — না, সে দেখে যেখানে লেখা হয়েছে সেখানকার। **(২)** ‘`let`/`const` hoist হয় না’ — হয়, তবে TDZ তে থাকে (Variables lesson)। **(৩)** ‘Block `{ }` সবসময় নতুন scope’ — `let`/`const`/`class` এর জন্য হ্যাঁ, `var` এর জন্য না। **(৪)** ‘Scope runtime এ call stack দিয়ে ঠিক হয়’ — না; scope লেখার সময়ই ঠিক (stack শুধু *কোন call* এর environment তা বলে)। **(৫)** ‘Global variable দ্রুত বলে ভালো’ — পার্থক্য নগণ্য, কিন্তু ঝুঁকি বড়।",
    },
    { type: "h3", text: "Best practice: minimal scope" },
    {
      type: "ol",
      items: [
        "Variable টি যতটা সম্ভব **ছোট ও ভেতরের scope এ** declare করুন — যেখানে প্রথম লাগে সেখানে। (`for (const x of list)` এর `x` শুধু loop এর ভেতরে।)",
        "ডিফল্ট `const`; পরিবর্তন লাগলে `let`; নতুন কোডে `var` নয়।",
        "Shadowing দরকার না হলে এড়ান — ভিন্ন, অর্থবহ নাম দিন।",
        "Helper function যদি শুধু একটি function ই ব্যবহার করে, তাকে সেই function এর ভেতরেই রাখুন (lexical scope এর সুবিধা) — তবে বারবার ব্যবহার হলে module-level এ আনুন।",
        "ফাইল স্তরে সবকিছু `export` না করে কেবল যা দরকার তাই করুন — module scope ই আপনার private namespace।",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Browser বনাম Node.js",
      text: "Browser এর classic `<script>` এ top-level `var` ও function declaration global object (`window`) এর property হয়। ES Module (`type=\"module\"`) ও Node.js এ top-level declaration module-local — global object এ যায় না। এছাড়া `globalThis` সর্বত্র একই কাজ করে। Scope এর মূল নিয়ম (lexical, block/function) সব জায়গায় একই।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "কল্পনা করুন একটি বহুতল ভবন, যেখানে প্রতিটি ফ্ল্যাটের নিজস্ব **নোটিশ বোর্ড** আছে এবং ভবনের **নকশা** আগেই আঁকা — কে কোন ফ্ল্যাটের ভেতরে বানানো হয়েছে তা নকশায় স্থির।",
    },
    {
      type: "ul",
      items: [
        "**ভবনের লবি / গেটের নোটিশ বোর্ড = global scope।** সবাই এটি দেখতে পায়, কিন্তু সবাই এতে লিখতে পারে বলে এলোমেলো হওয়ার ঝুঁকি বেশি।",
        "**একটি ফ্ল্যাটের নিজস্ব বোর্ড = function scope।** ফ্ল্যাটের ভেতরে যা লেখা, বাইরের প্রতিবেশী দেখে না। প্রতিবার ফ্ল্যাটে নতুন ভাড়াটিয়া (function call) এলে নতুন বোর্ড টাঙানো হয়।",
        "**ফ্ল্যাটের ভেতরের একটি ঘরের ছোট চার্ট = block scope।** শুধু ওই ঘরের ভেতর দৃশ্যমান।",
        "**নকশা (আগে থেকে আঁকা) = lexical scope।** ফ্ল্যাট ৩০১ এর ভেতরের স্টোর-রুম যেহেতু ৩০১ এর অংশ হিসেবে বানানো, সে ৩০১ এর বোর্ড দেখতে পায় — ভবনের অন্য প্রান্ত থেকে কেউ তাকে ‘ডাকলেও’ সে সেই ডাকার ফ্ল্যাটের বোর্ড দেখতে পায় না। দেখার অধিকার ঠিক হয় **কোথায় বানানো** তা দিয়ে, **কে ডাকল** তা দিয়ে নয়।",
        "**একই নামের নোটিশ (shadowing):** ফ্ল্যাট ৩০১ এর বোর্ডে ‘বিদ্যুৎ বিল: ৫০০’ লেখা থাকলে, লবির ‘বিদ্যুৎ বিল: ১০০০’ এই ফ্ল্যাটের ভেতরে আড়াল হয়ে যায়; লবির বোর্ড অবশ্য বদলায় না।",
        "**লবির বোর্ডে অন্যের লেখা ফেলে যাওয়া = accidental global।** কেউ ‘নিজের ফ্ল্যাটের বোর্ডে’ লিখতে গিয়ে ভুলে লবির বোর্ডে লিখে ফেললে সবার সমস্যা। Strict mode হলো নিরাপত্তারক্ষী, যে ঘোষণা ছাড়া লবিতে লিখতে দেয় না (ReferenceError)।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "Nested scope: কোথা থেকে কোন নাম দেখা যায়",
      caption: "Scope গুলো একটির ভেতর আরেকটি লেখা — ভেতরের scope বাইরেরগুলো দেখতে পায়, বাইরের scope ভেতরেরগুলো দেখতে পায় না।",
      nodes: [
        { id: "global", label: "Global / Module scope", sub: "সবচেয়ে বাইরের" },
        { id: "outer", label: "outer() scope", sub: "function" },
        { id: "inner", label: "inner() scope", sub: "ভেতরের function" },
        { id: "block", label: "if { } block", sub: "block scope" },
      ],
      steps: [
        {
          active: ["global"],
          items: {
            global: ["appName = 'Hub'"],
            outer: ["(এখনো call হয়নি)"],
            inner: [],
            block: [],
          },
          note: "Global scope এ `appName` আছে। বাকি scope গুলো লেখা আছে কিন্তু call না হওয়া পর্যন্ত তাদের environment তৈরি হয়নি (function scope প্রতিটি call এ তৈরি হয়)।",
        },
        {
          active: ["outer"],
          items: {
            global: ["appName = 'Hub'"],
            outer: ["userName = 'Rina'", "inner (function)"],
            inner: [],
            block: [],
          },
          note: "`outer()` call হলো — তার নিজস্ব scope এ `userName` ও ভেতরের function `inner` তৈরি হলো। `outer` এখান থেকে `appName` ও (global এর) সবকিছু দেখতে পায় — কারণ সে global এর ভেতরে লেখা।",
        },
        {
          active: ["inner"],
          items: {
            global: ["appName = 'Hub'"],
            outer: ["userName = 'Rina'", "inner (function)"],
            inner: ["count = 1"],
            block: [],
          },
          note: "`inner()` call হলো। সে নিজের `count`, `outer` এর `userName` ও global এর `appName` — তিনটিই দেখতে পায়। কিন্তু `outer` বা global থেকে `count` দেখা যায় না: ভেতরের নাম বাইরে অদৃশ্য।",
        },
        {
          active: ["block"],
          items: {
            global: ["appName = 'Hub'"],
            outer: ["userName = 'Rina'", "inner (function)"],
            inner: ["count = 1"],
            block: ["msg = 'ok' (let)"],
          },
          note: "`inner` এর ভেতরের `if { const msg }` block এ `msg` কেবল ওই `{ }` এ আছে। block শেষ হলে `msg` অদৃশ্য — `inner` এর বাকি অংশ বা বাইরে থেকে `msg` পড়লে ReferenceError।",
          output: "msg শুধু block এ দেখা যায়",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Lexical বনাম Dynamic: showWho() কোন who দেখে?",
      caption: "JavaScript এ নাম খোঁজা হয় লেখার (define) জায়গার ধারা ধরে — call stack ধরে নয়।",
      nodes: [
        { id: "stack", label: "Call Stack", sub: "কে কাকে ডেকেছে" },
        { id: "show", label: "showWho scope", sub: "লেখা হয়েছে Global এ" },
        { id: "caller", label: "caller scope", sub: "লেখা হয়েছে Global এ" },
        { id: "global", label: "Global scope", sub: "who = 'global'" },
      ],
      steps: [
        {
          active: ["global"],
          items: {
            stack: [],
            show: ["(কোনো variable নেই)"],
            caller: ["who = 'caller'"],
            global: ["who = 'global'"],
          },
          note: "কোডে দুটি `who` আছে: `global` এ `'global'` আর `caller` function এর ভেতরে `'caller'`। `showWho` ও `caller` দুটিই **Global এ লেখা** (পাশাপাশি, একটির ভেতরে আরেকটি নয়)।",
        },
        {
          active: ["stack", "caller"],
          items: {
            stack: ["caller()"],
            show: ["(কোনো variable নেই)"],
            caller: ["who = 'caller'"],
            global: ["who = 'global'"],
          },
          note: "`caller()` call হলো, stack এ উঠল এবং তার নিজস্ব `who = 'caller'` তৈরি হলো।",
        },
        {
          active: ["stack", "show"],
          items: {
            stack: ["showWho()", "caller()"],
            show: ["who ? (নেই)"],
            caller: ["who = 'caller'"],
            global: ["who = 'global'"],
          },
          note: "`caller` এর ভেতর থেকে `showWho()` call হলো — stack এ `showWho` এখন `caller` এর ঠিক ওপরে। কিন্তু stack এ কে নিচে আছে তা এখানে অপ্রাসঙ্গিক। `showWho` এ `who` নেই, তাই outer এ খোঁজা হবে।",
        },
        {
          active: ["show", "global"],
          items: {
            stack: ["showWho()", "caller()"],
            show: ["who ? (নেই) → outer"],
            caller: ["who = 'caller' (এখানে যাওয়া হয় না)"],
            global: ["who = 'global' ✔ পাওয়া গেছে"],
          },
          note: "`showWho` এর outer reference চলে **Global** এ (কারণ সেখানেই সে লেখা)। তাই `'global'` পাওয়া যায়। Dynamic scope হলে stack ধরে `caller` এ গিয়ে `'caller'` পাওয়া যেত — JavaScript সেটি করে না।",
          output: "global",
        },
      ],
    },
    {
      kind: "memory-steps",
      title: "Shadowing: একই নাম, দুটি আলাদা binding",
      caption: "ভেতরের `x` বাইরের `x` কে আড়াল করে, মুছে ফেলে না।",
      code: 'const x = "global";\nfunction f() {\n  const x = "local";\n  console.log(x);\n}\nf();\nconsole.log(x);',
      steps: [
        {
          line: 0,
          memory: [{ name: "x (global)", value: '"global"', kind: "const", state: "live" }],
          note: "Global scope এ `x` তৈরি হলো, মান `\"global\"`।",
        },
        {
          line: 2,
          memory: [
            { name: "x (global)", value: '"global"', kind: "const", state: "live" },
            { name: "x (f এর ভেতরে)", value: '"local"', kind: "const", state: "live" },
          ],
          note: "`f()` call হওয়ার পর তার নিজস্ব environment এ আরেকটি `x` তৈরি হলো। দুটি **আলাদা binding**, একই নামে — ভেতরেরটি বাইরেরটিকে shadow করছে।",
        },
        {
          line: 3,
          memory: [
            { name: "x (global)", value: '"global"', kind: "const", state: "live" },
            { name: "x (f এর ভেতরে)", value: '"local"', kind: "const", state: "live" },
          ],
          output: "local",
          note: "`f` এর ভেতরে `x` খুঁজলে আগে নিজের environment এ পাওয়া যায় — তাই `local`।",
        },
        {
          line: 6,
          memory: [{ name: "x (global)", value: '"global"', kind: "const", state: "live" }],
          output: "global",
          note: "`f` শেষ — তার environment সরে গেছে (বা আর দরকার নেই)। বাইরের `x` অক্ষত ছিল, তাই `global`।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Global, function ও block scope এর দৃশ্যমানতা",
      description: "কোন নাম কোথা থেকে দেখা যায় — `typeof` দিয়ে নিরাপদে পরীক্ষা করুন (undeclared নামে `typeof` error দেয় না)।",
      code: `const siteName = "Learning Hub";

function greet() {
  const user = "Rina";

  if (true) {
    const greeting = "Hello";
    console.log(greeting, user, siteName); // ভেতর থেকে বাইরের সবই দেখা যায়
  }

  console.log("block এর বাইরে greeting:", typeof greeting);
}

greet();
console.log("function এর বাইরে user:", typeof user);`,
    },
    {
      level: "intermediate",
      title: "Lexical scope বনাম Dynamic scope — প্রমাণ",
      description: "একই function বিভিন্ন জায়গা থেকে call করুন। ফল নির্ভর করে function কোথায় লেখা — কোথা থেকে call হচ্ছে তার ওপর নয়।",
      code: `const who = "global";

function showWho() {
  return who;
}

function caller() {
  const who = "caller";
  return showWho();          // caller থেকে call হচ্ছে, তবু global এর who
}

function callerWithOwnCopy() {
  const who = "own copy";
  function showHere() {
    return who;              // এই function লেখা হয়েছে callerWithOwnCopy এর ভেতরে
  }
  return showHere();
}

console.log("১.", caller());
console.log("২.", callerWithOwnCopy());
console.log("৩.", showWho());`,
    },
    {
      level: "real-world",
      title: "Minimal scope: logger factory ও private helper",
      description: "Production-ধরনের কোডে helper function ও temporary variable গুলো ভেতরের scope এ লুকিয়ে রাখা হয়, শুধু দরকারি API বাইরে যায়। নামের সংঘর্ষ ও global দূষণ এড়ায়।",
      code: `const LEVELS = ["info", "warn", "error"];

function createLogger(namespace) {
  // private: বাইরে থেকে দেখা যাবে না
  function format(level, message) {
    return "[" + namespace + "] " + level.toUpperCase() + ": " + message;
  }

  const api = {};
  for (const level of LEVELS) {
    // level এর scope শুধু এই loop body
    api[level] = (message) => console.log(format(level, message));
  }
  return api;
}

const authLog = createLogger("auth");
const dbLog = createLogger("db");

authLog.info("user signed in");
dbLog.error("connection lost");

console.log(typeof format, typeof namespace);  // দুটিই undefined: বাইরে থেকে অদৃশ্য`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
const message = "Hello, scope!";
console.log(message);
`,
    },
    {
      label: "Shadowing: বাইরের মান অক্ষত থাকে",
      code: `let level = "outer";

function test() {
  let level = "function";
  {
    let level = "block";
    console.log("১.", level);
  }
  console.log("২.", level);
}

test();
console.log("৩.", level);`,
    },
    {
      label: "var এর function scope বনাম let এর block scope",
      code: `function demo() {
  if (true) {
    var a = "var";
    let b = "let";
  }
  console.log("a:", a);
  console.log("b:", typeof b);
}
demo();

for (var i = 0; i < 2; i++) {}
for (let j = 0; j < 2; j++) {}
console.log("i:", i, "| j:", typeof j);`,
    },
    {
      label: "Accidental global: strict mode এ ReferenceError",
      code: `// এই sandbox strict mode এ চলে। Sloppy mode এ (পুরোনো script) এটি নীরবে global বানিয়ে ফেলত।
function addTotals() {
  try {
    totall = 5;          // let/const/var ছাড়া: বানান ভুল বা ভুলে যাওয়া declaration
  } catch (e) {
    console.log(e.name);
  }
}
addTotals();

// স্পষ্টভাবে global এ রাখতে হলে globalThis ব্যবহার করুন
globalThis.appConfig = { debug: true };
console.log(appConfig);
console.log(typeof globalThis);

// function এর ভেতরের var global এ যায় না
function f() { var hidden = 1; }
f();
console.log(typeof globalThis.hidden);`,
    },
    {
      label: "Lexical scope: লেখার জায়গা বনাম call এর জায়গা",
      code: `const mode = "global";

function readMode() {
  return mode;
}

function run() {
  const mode = "run এর local";
  console.log("run এর ভেতর থেকে call:", readMode());

  function readLocal() {
    return mode;
  }
  console.log("run এর ভেতরে লেখা function:", readLocal());
}

run();`,
    },
  ],

  debugging: [
    {
      title: "ReferenceError: msg is not defined (block এর বাইরে ব্যবহার)",
      bad: `if (true) {
  const msg = "hi";
}
console.log(msg);`,
      why: "`const msg` কেবল তার নিকটতম `{ }` block এর scope এ তৈরি হয়। Block শেষ হলে নামটি scope এ নেই, তাই বাইরে `msg` খুঁজতে গিয়ে global পর্যন্ত গিয়েও পায় না — ReferenceError। এটি ব্যবহারের **আগে** যেখানে দরকার সেই স্তরে declare করতে হবে।",
      fix: `let msg;                 // যে scope এ ব্যবহার হবে সেখানে declare
if (true) {
  msg = "hi";
}
console.log(msg);`,
    },
    {
      title: "Dynamic scope আশা করা: caller এর variable দেখা যাচ্ছে না",
      bad: `function printUser() {
  console.log("User:", currentUser);
}

function login() {
  const currentUser = "Rina";
  printUser();
}

login();`,
      why: "`printUser` লেখা হয়েছে global এ, `login` এর ভেতরে নয়। Lexical scope এ তাই সে `login` এর local `currentUser` দেখতে পায় না — যদিও `login`ই তাকে ডাকছে। (JavaScript এ dynamic scope নেই।) সমাধান: দরকারি মান **argument** হিসেবে পাঠানো — স্পষ্ট ও পরীক্ষাযোগ্য।",
      fix: `function printUser(currentUser) {
  console.log("User:", currentUser);
}

function login() {
  const currentUser = "Rina";
  printUser(currentUser);
}

login();`,
    },
    {
      title: "Accidental global: declare করতে ভুলে যাওয়া",
      bad: `function sum(numbers) {
  total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
}

console.log(sum([1, 2, 3]));`,
      why: "`total` কে `let`/`const` ছাড়া assign করা হয়েছে। Sloppy mode এ এটি নীরবে global variable হয়ে যেত — অন্য কোডের `total` নষ্ট হওয়ার ঝুঁকি নিয়ে। Strict mode (এই sandbox, ES Module, class) এ সাথে সাথে ReferenceError, যা আসলে ভালো: bug দ্রুত ধরা পড়ে।",
      fix: `function sum(numbers) {
  let total = 0;           // function এর নিজস্ব scope
  for (const n of numbers) {
    total += n;
  }
  return total;
}

console.log(sum([1, 2, 3]));`,
    },
    {
      title: "অনিচ্ছাকৃত shadowing: বাইরের total কখনো বদলায় না",
      bad: `let total = 0;

[1, 2, 3].forEach((n) => {
  let total = 0;     // বাইরের total কে আড়াল করছে
  total += n;
});

console.log(total);`,
      why: "Callback এর ভেতরের `let total` একটি **নতুন binding**, যা বাইরের `total` কে shadow করে। প্রতিটি call এ ভেতরের `total` বদলাচ্ছে, বাইরেরটি ছোঁয়াই হচ্ছে না — তাই `0`। কারণ `let` দিয়ে আবার declare করলেই নতুন variable হয়। সমাধান: ভেতরের declaration মুছে বাইরেরটিতেই assign করুন (অথবা `reduce` ব্যবহার করুন)।",
      fix: `let total = 0;

[1, 2, 3].forEach((n) => {
  total += n;        // বাইরের total কেই বদলাচ্ছে
});

console.log(total);`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "Lexical scope ঠিক করুন",
      prompt: "`checkout` এর ভেতরে local `rate = 0.5` আছে, কিন্তু `tax` function টি global এ লেখা বলে সে global `rate` (`0.1`) দেখে — `10` print হয়। `tax` কে এমনভাবে সরান যেন সে `checkout` এর `rate` দেখতে পায় এবং `50` print হয়।",
      starter: `const rate = 0.1;

function tax(amount) {
  return amount * rate;
}

function checkout() {
  const rate = 0.5;
  return tax(100);
}

console.log(checkout());`,
      expected: "50",
      hints: ["Lexical scope এ function কোথায় লেখা — সেটিই ঠিক করে সে কোন variable দেখবে।", "`tax` কে `checkout` এর ভেতরে নিয়ে যান।"],
      solution: `const rate = 0.1;

function checkout() {
  const rate = 0.5;
  function tax(amount) {
    return amount * rate;
  }
  return tax(100);
}

console.log(checkout());`,
      explanation: "`tax` এখন `checkout` এর ভেতরে লেখা, তাই তার outer environment হলো `checkout` এর environment — যেখানে `rate = 0.5` আছে। Shadowing এর কারণে global `0.1` এ যাওয়া হয় না।",
    },
    {
      level: "beginner",
      title: "Block এর বাইরে মান পাওয়া",
      prompt: "নিচের কোড `ReferenceError` ছোড়ে। কোনো কিছু মুছে না ফেলে শুধু declaration এর জায়গা বদলে `A` print করান।",
      starter: `if (true) {
  let label = "A";
}
console.log(label);`,
      expected: "A",
      hints: ["`label` কোন scope এ দরকার? যেখানে ব্যবহার হবে সেখানে declare করুন।", "`let` declaration বাইরে নিন, ভেতরে শুধু assign করুন।"],
      solution: `let label;
if (true) {
  label = "A";
}
console.log(label);`,
      explanation: "`let label` এখন বাইরের scope এ, তাই `if` block এর ভেতর ও বাইরে উভয় জায়গা থেকে দেখা যায়।",
    },
    {
      level: "beginner",
      title: "Shadowing ব্যবহার করে ভেতর-বাইরের পার্থক্য দেখান",
      prompt: "`f` এর ভেতরে `x` নামে একটি নতুন `const` declare করুন (মান `\"inner\"`), যেন `f()` print করে `inner` আর শেষের `console.log(x)` print করে `outer`।",
      starter: `const x = "outer";

function f() {
  // TODO: ভেতরের x declare করুন
  console.log(x);
}

f();
console.log(x);`,
      expected: "inner\nouter",
      hints: ["একই নামের `const x` ভেতরে লিখলে বাইরেরটি আড়াল হয়।"],
      solution: `const x = "outer";

function f() {
  const x = "inner";
  console.log(x);
}

f();
console.log(x);`,
      explanation: "ভেতরের `x` আলাদা binding; বাইরের `x` একই থাকে, তাই দ্বিতীয় লাইনে `outer`।",
    },
    {
      level: "intermediate",
      title: "Accidental global সরান",
      prompt: "`countWords` strict mode এ `ReferenceError` ছোড়ে কারণ `counts` declare করা হয়নি। সঠিকভাবে declare করে `{ a: 2, b: 1 }` print করান।",
      starter: `function countWords(words) {
  counts = {};
  for (const w of words) {
    counts[w] = (counts[w] || 0) + 1;
  }
  return counts;
}

console.log(countWords(["a", "b", "a"]));`,
      expected: "{ a: 2, b: 1 }",
      hints: ["`counts` কখনো reassign হয় না — কোন keyword উপযুক্ত?", "`const counts = {}` লিখলেও `counts[w] = ...` বৈধ, কারণ এটি mutation।"],
      solution: `function countWords(words) {
  const counts = {};
  for (const w of words) {
    counts[w] = (counts[w] || 0) + 1;
  }
  return counts;
}

console.log(countWords(["a", "b", "a"]));`,
      explanation: "`const counts` function এর নিজস্ব scope এ থাকে, global এ লিক করে না। `const` এ property বদলানো mutation, তাই বৈধ।",
    },
    {
      level: "intermediate",
      title: "Helper কে সঠিক scope এ বসান",
      prompt: "`encode` helper টি global এ লেখা, কিন্তু সে `base` parameter ব্যবহার করে — যা `buildUrl` এর local। এখন `ReferenceError` আসে। কোড পুনর্গঠন করে `https://api.example.com/users?id=5` print করান।",
      starter: `function encode(path, id) {
  return base + path + "?id=" + id;
}

function buildUrl(base, path, id) {
  return encode(path, id);
}

console.log(buildUrl("https://api.example.com", "/users", 5));`,
      expected: "https://api.example.com/users?id=5",
      hints: ["`encode` কে এমন scope এ নিন, যেখানে `base` দৃশ্যমান।", "অথবা `base` কে argument হিসেবে পাঠান — কোনটি পরিষ্কার?"],
      solution: `function buildUrl(base, path, id) {
  function encode() {
    return base + path + "?id=" + id;
  }
  return encode();
}

console.log(buildUrl("https://api.example.com", "/users", 5));`,
      explanation: "`encode` এখন `buildUrl` এর ভেতরে লেখা, তাই lexical scope এর কারণে `base`, `path`, `id` সবই দেখতে পায়। (বিকল্প: `base` কে parameter করা, যা helper আলাদা module এ রাখলে ভালো।)",
    },
    {
      level: "challenge",
      title: "Real-world: invoice formatter (minimal scope)",
      prompt:
        "`formatInvoice(items, currency)` লিখুন। এর ভেতরে private helper `money(n)` থাকবে যা `currency` (lexical scope থেকে) ব্যবহার করে `BDT 30.00` ফরম্যাট দেবে। প্রতিটি item এর জন্য `Pen x3 = BDT 30.00` লাইন এবং শেষে `Total = BDT 150.00` print করুন। কোনো global/অতিরিক্ত variable রাখা যাবে না; `total` কেবল function এর ভেতরে থাকবে।",
      starter: `function formatInvoice(items, currency) {
  // TODO: private helper money(n) এবং total
}

const items = [
  { name: "Pen", price: 10, qty: 3 },
  { name: "Book", price: 120, qty: 1 },
];

formatInvoice(items, "BDT");`,
      expected: "Pen x3 = BDT 30.00\nBook x1 = BDT 120.00\nTotal = BDT 150.00",
      hints: ["`money` কে `formatInvoice` এর ভেতরে লিখুন, তাহলে `currency` কে argument হিসেবে পাঠাতে হবে না।", "`total` কে `let` করুন; item এর `lineTotal` কে loop এর ভেতরে `const` করুন।", "`n.toFixed(2)` দুই দশমিক পর্যন্ত string দেয়।"],
      solution: `function formatInvoice(items, currency) {
  function money(n) {
    return currency + " " + n.toFixed(2);
  }

  let total = 0;
  for (const item of items) {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    console.log(item.name + " x" + item.qty + " = " + money(lineTotal));
  }
  console.log("Total = " + money(total));
}

const items = [
  { name: "Pen", price: 10, qty: 3 },
  { name: "Book", price: 120, qty: 1 },
];

formatInvoice(items, "BDT");`,
      explanation: "`money` লেখা হয়েছে `formatInvoice` এর ভেতরে — lexical scope এ তাই সে `currency` পায়। `lineTotal` শুধু loop body তে থাকে (minimal scope), `total` কেবল function এ। বাইরে কিছু লিক করে না এবং helper টিও বাইরে থেকে অদৃশ্য।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "JavaScript এ একটি function কোন variable গুলো দেখতে পাবে — তা কীসের ওপর নির্ভর করে?",
        options: [
          "Function টি কোথা থেকে call করা হচ্ছে (call stack এ কে ডেকেছে)",
          "Function টি source code এ কোথায় লেখা (define) হয়েছে",
          "Function টি কতবার call হয়েছে",
          "Function এ কয়টি parameter আছে",
        ],
        answer: 1,
        explanation: "JavaScript **lexical (static) scope** মানে — scope ঠিক হয় লেখার জায়গা দেখে। প্রথম অপশনটি dynamic scope এর বর্ণনা, যা JavaScript এ নেই। Call এর সংখ্যা ও parameter এর সংখ্যা scope এর নিয়ম নির্ধারণ করে না।",
      },
      {
        question: "নিচের কোড কী print করে?\n`const a = 'G'; function f() { const a = 'L'; return g(); } function g() { return a; } console.log(f());`",
        options: ["`L`", "`undefined`", "ReferenceError", "`G`"],
        answer: 3,
        explanation: "`g` লেখা হয়েছে global এ, তাই সে global `a` (`'G'`) দেখে। `f` তাকে call করলেও `f` এর local `a` `g` এর outer environment এ নেই। `'L'` আসত dynamic scope হলে; `undefined`/ReferenceError আসত যদি `a` কোথাও পাওয়া না যেত — কিন্তু global এ আছে।",
      },
      {
        question: "`function t() { if (true) { var a = 1; let b = 2; } return typeof a + ' ' + typeof b; }` — `t()` কী ফেরত দেয়?",
        options: ["`number undefined`", "`number number`", "`undefined undefined`", "ReferenceError"],
        answer: 0,
        explanation: "`var a` function scope, তাই `if` এর বাইরে ও `typeof a` হয় `number`। `let b` block scope, তাই বাইরে নাম নেই — কিন্তু `typeof` undeclared নামে error দেয় না, `\"undefined\"` ফেরত দেয়। তাই ReferenceError আসে না, আর বাকি দুই অপশন `a` বা `b` কে ভুলভাবে ধরেছে।",
      },
      {
        question: "Strict mode এ `function f() { counter = 1; } f();` চালালে কী হয়?",
        options: [
          "`counter` নীরবে global variable হয়ে যায়",
          "`counter` function এর local variable হয়ে যায়",
          "ReferenceError ছোড়ে",
          "SyntaxError, কোড চলেই না",
        ],
        answer: 2,
        explanation: "Strict mode এ declare না করা নামে assign করলে `ReferenceError` (runtime এ, `f()` call হওয়ার সময়)। প্রথম অপশনটি sloppy mode এর আচরণ। কোডটি সিনট্যাক্স-বৈধ, তাই SyntaxError নয়। Local variable হওয়ার জন্য `let`/`const`/`var` লাগে।",
      },
      {
        question: "Shadowing সম্পর্কে কোনটি সঠিক?",
        options: [
          "ভেতরের একই নামের `let` বাইরের variable কে মুছে ফেলে",
          "ভেতরের একই নামের `let` একটি নতুন binding তৈরি করে, বাইরেরটি অক্ষত থাকে",
          "Shadowing এ SyntaxError হয়",
          "Shadowing শুধু `var` এ সম্ভব",
        ],
        answer: 1,
        explanation: "ভেতরের declaration একটি আলাদা binding; বাইরেরটি scope থেকে বেরোলে আগের মানেই ফিরে আসে। মুছে ফেলার ধারণাটি ভুল। SyntaxError হয় কেবল **একই scope এ** `let`/`const` redeclare করলে। Shadowing `let`, `const`, `var`, parameter — সবেই সম্ভব।",
      },
    ],
    coding: [
      {
        title: "Nested scope এর দৃশ্যমানতা",
        prompt: "`outer()` এর ভেতরে `const a = \"A\"` এবং ভেতরের function `inner()` এ `const b = \"B\"` declare করুন। `inner()` এর ভেতর থেকে `a + b` print করুন (`AB`)। তারপর `outer()` এর বাইরে `typeof a` print করুন (`undefined`)।",
        starter: `function outer() {
  // TODO
}

outer();
console.log(typeof a);`,
        expected: "AB\nundefined",
        solution: `function outer() {
  const a = "A";
  function inner() {
    const b = "B";
    console.log(a + b);
  }
  inner();
}

outer();
console.log(typeof a);`,
      },
      {
        title: "Global বনাম local function",
        prompt: "`show` global `level` ফেরত দেয়। `wrapper()` এর ভেতরে local `level = \"local\"` আছে। `wrapper()` প্রথমে global `show()` call করে `global` print করবে, তারপর নিজের ভেতরে লেখা `showLocal()` call করে `local` print করবে। `showLocal` কে `wrapper` এর ভেতরে লিখুন।",
        starter: `const level = "global";

function show() {
  return level;
}

function wrapper() {
  const level = "local";
  // TODO: show() print করুন, তারপর wrapper এর ভেতরে showLocal লিখে call করুন
}

wrapper();`,
        expected: "global\nlocal",
        solution: `const level = "global";

function show() {
  return level;
}

function wrapper() {
  const level = "local";
  console.log(show());

  function showLocal() {
    return level;
  }
  console.log(showLocal());
}

wrapper();`,
      },
    ],
  },

  interview: [
    {
      q: "Scope কী? JavaScript এ কয় ধরনের scope আছে?",
      a: "Scope হলো কোডের সেই অংশ যেখানে একটি নাম (variable/function/class) দৃশ্যমান ও ব্যবহারযোগ্য। এটি নামকে আড়াল করে, নামের সংঘর্ষ কমায় এবং variable এর জীবনকাল সীমিত করে।\n\nপ্রধান ধরন: **global scope** (সবচেয়ে বাইরের), **function scope** (প্রতিটি call এ), **block scope** (`let`/`const`/`class` এর জন্য `{ }`), এবং **module scope** (ES Module/Node ফাইলের top-level)। `var` শুধু function/global scope মানে; `let`/`const` block scope। Catch block এর parameter ও নিজস্ব block scope এ থাকে।\n\nভালো উত্তরে মূল বিষয় যোগ করুন: JavaScript এর scope **lexical**, অর্থাৎ লেখার জায়গা দেখে নির্ধারিত।",
    },
    {
      q: "Lexical scope ও dynamic scope এর পার্থক্য কী? JavaScript কোনটি?",
      a: "**Lexical scope** এ কোনো function কোন variable দেখবে তা ঠিক হয় কোডে সে **কোথায় লেখা হয়েছে** তা দেখে — কোড না চালিয়েই নির্ণয় করা যায়। **Dynamic scope** এ ঠিক হয় runtime এ call stack এ কে তাকে ডেকেছে তা দেখে। JavaScript lexical।\n\nপ্রমাণ: global `const x = 'G'` আর `function g() { return x }` থাকলে, অন্য একটি function এ local `const x = 'L'` লিখে সেখান থেকে `g()` call করলেও `'G'` ফেরত আসে — caller এর local `x` ছোঁয়া হয় না।\n\nএর সুবিধা: কোড পড়ে বোঝা যায়, linter/TypeScript/bundler static analysis করতে পারে, এবং closure সম্ভব হয়। (`this` আলাদা বিষয়: সেটি call-site অনুযায়ী ঠিক হয়, কিন্তু arrow function এ সেটিও lexical।)",
    },
    {
      q: "Shadowing কী? এটি কখন সমস্যা করে?",
      a: "ভেতরের scope এ বাইরের scope এর একই নামে variable declare করলে ভেতরেরটি বাইরেরটিকে **shadow** করে — ভেতরে ওই নাম বললে ভেতরেরটিই পাওয়া যায়, বাইরেরটি অক্ষত থাকে।\n\nসমস্যা হয় অনিচ্ছাকৃত হলে: যেমন callback এ `let total = 0` লিখে বাইরের accumulator `total` আপডেট করার চেষ্টা করলে বাইরেরটি কখনো বদলায় না। আরেকটি সমস্যা — parameter এর নামে ভেতরে নতুন variable দিলে মূল parameter এ আর পৌঁছানো যায় না। ESLint এর `no-shadow` rule এ এগুলো ধরা পড়ে। ইচ্ছাকৃত shadowing (যেমন `const user = ...` ভেতরের নির্দিষ্ট block এ) বৈধ, কিন্তু সাধারণত আলাদা নাম পড়তে সহজ।",
    },
    {
      q: "`var` কি block scoped? Loop এ `var` ও `let` এর পার্থক্য কী?",
      a: "না, `var` block scoped নয় — সে `if`, `for`, `{ }` এর সীমানা উপেক্ষা করে শুধু function (বা global/module) স্তরে আটকায়। তাই `if` এর ভেতরে `var x` লিখলেও function জুড়ে `x` দেখা যায়।\n\nLoop এ `for (var i ...)` তে পুরো function এ **একটি মাত্র** `i` থাকে; `setTimeout` এর callback গুলো loop শেষে চলে বলে সবাই শেষ মান দেখে। `for (let i ...)` তে spec অনুযায়ী প্রতিটি iteration এ নতুন binding তৈরি হয়, তাই প্রতিটি callback নিজের `i` পায়। এটি Closures lesson এও আবার দেখব। পুরোনো কোডে এটি ঠিক করতে IIFE ব্যবহার হতো।",
    },
    {
      q: "Accidental global variable কী এবং কীভাবে এড়ান?",
      a: "Sloppy mode এ `x = 5` (কোনো `let`/`const`/`var` ছাড়া) লিখলে engine নীরবে global object এ `x` property বানিয়ে দেয় — একেই accidental global বলে। বানান ভুল ধরা পড়ে না, আর অন্য কোডের সাথে নামের সংঘর্ষ ঘটতে পারে।\n\nএড়ানোর উপায়: (১) সর্বদা `const`/`let` দিয়ে declare করুন; (২) strict mode ব্যবহার করুন — `\"use strict\"`, ES Module, class body স্বয়ংক্রিয়ভাবে strict, আর সেখানে এই কাজ `ReferenceError` ছোড়ে; (৩) ESLint (`no-undef`, `no-implicit-globals`) চালান; (৪) সত্যিই global দরকার হলে `globalThis.name = ...` লিখে স্পষ্ট করুন। আধুনিক bundler ও module সিস্টেম প্রতিটি ফাইলকে আলাদা scope দেয়, যা প্রায় সব সমস্যা দূর করে।",
    },
    {
      q: "Lexical scope কীভাবে closure এর ভিত্তি?",
      a: "প্রতিটি function তৈরি হওয়ার সময় আপাত-ভাবে মনে রাখে সে কোন environment এ তৈরি হয়েছে (outer environment reference)। Function call হলে নতুন environment এর outer সেটিই হয়। ফলে ভেতরের function কে বাইরে পাঠিয়ে দিলেও (return করে বা callback এ দিয়ে) সে তার জন্মস্থানের variable গুলো দেখতে পায়।\n\nএই ‘function + তার lexical environment’ জুটিকেই closure বলে। কাজেই closure এর জন্য আলাদা কোনো বিশেষ সিনট্যাক্স নেই; এটি lexical scope এর স্বাভাবিক ফল। যদি scope dynamic হতো, function এর জন্মস্থান কোনো ভূমিকা রাখত না এবং closure ধারণাই অর্থহীন হতো। (Environment এর আনুষ্ঠানিক সংজ্ঞা Advanced module এ।)",
    },
  ],

  summary: {
    takeaways: [
      "Scope = কোথায় একটি নাম দৃশ্যমান। চার ধরন: global, function, block, module।",
      "JavaScript এর scope **lexical (static)** — function কোথায় লেখা হয়েছে সেটিই ঠিক করে সে কী দেখবে; কোথা থেকে call হচ্ছে তা নয়।",
      "ভেতরের scope বাইরেরগুলো দেখতে পায়, বাইরের scope ভেতরেরগুলো নয়। একই নামে declare করলে shadowing হয় — বাইরেরটি অক্ষত থাকে।",
      "`var` function scope; `let`/`const` block scope। Declaration সবসময় ছোট ও ভেতরের scope এ রাখুন (minimal scope)।",
      "Declare না করে assign করা strict mode এ ReferenceError; sloppy mode এ accidental global। `globalThis` হলো global object এর প্রমিত নাম।",
      "Function তার outer environment এর reference বহন করে — এটাই closure এর ভিত্তি।",
    ],
    syntax: `const outerValue = 1;               // outer scope

function fn(param) {                // param: function scope
  const local = 2;                  // function scope
  if (param) {
    const inBlock = 3;              // block scope
    return outerValue + local + inBlock;
  }
  // inBlock এখানে নেই
}

globalThis.config = {};             // স্পষ্টভাবে global এ রাখা (দরকার হলে)`,
    whenToUse: [
      "প্রতিটি variable যতটা সম্ভব ভেতরের ও ছোট scope এ declare করুন — `const`/`let` দিয়ে।",
      "Helper function শুধু একটি function ব্যবহার করলে তার ভেতরেই রাখুন; ফাইল-স্তরের private নাম module scope এ রেখে শুধু দরকারিটুকু export করুন।",
      "Function কে কোনো মান দরকার হলে caller এর variable আশা না করে parameter/argument দিয়ে পাঠান।",
    ],
    next: ["Scope Chain — নাম খোঁজার ধাপে ধাপে পথ", "Closures — outer environment ধরে রাখা function", "Hoisting ও Temporal Dead Zone (Advanced module)"],
  },

  compatibility:
    "Block scope (`let`/`const`) ES2015 থেকে এবং `globalThis` ES2020 থেকে সব আধুনিক browser ও Node.js (12+) এ কাজ করে। Lexical scope এর নিয়ম সর্বত্র একই। পার্থক্য কেবল top-level declaration এ: browser এর classic script এ `var` ও function declaration global object এর property হয়, ES Module ও Node.js এ হয় না। এই Playground এর sandbox strict mode এ চলে, তাই sloppy mode এর accidental global আচরণ এখানে দেখানো যায় না — সেখানে ReferenceError আসে।",
};
