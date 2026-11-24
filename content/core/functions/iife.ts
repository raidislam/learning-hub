import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "IIFE (Immediately Invoked Function Expression) এর syntax ও কেন parentheses লাগে — তা ব্যাখ্যা করতে পারবেন।",
    "IIFE কেন তৈরি হয়েছিল (`let`/`const` ও ES module এর আগের দুনিয়া) এবং module pattern কীভাবে private state বানায় — তা বুঝবেন।",
    "আধুনিক বিকল্প (block scope, ES module, private class field) চিনে কোথায় IIFE এখনো কাজের তা বলতে পারবেন।",
    "Async IIFE, one-time initialization ও loop closure এর legacy fix চিনবেন।",
    "Semicolon-before-IIFE (ASI) ঝুঁকি এবং named IIFE এর সুবিধা প্রয়োগ করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "IIFE কী?" },
    {
      type: "p",
      text: "IIFE এর পুরো নাম **Immediately Invoked Function Expression** — এমন একটি function expression যেটি তৈরি হওয়ার **সাথে সাথেই** ডাকা (invoke) হয়ে যায়। নামও দেওয়া হয় না প্রায়ই, কারণ পরে আর ডাকার দরকার নেই। এর উদ্দেশ্য: কিছু কোড একটি **নিজস্ব function scope** এর ভেতরে একবার চালানো, যাতে ভেতরের variable বাইরে ‘ছড়িয়ে’ না পড়ে।",
    },
    {
      type: "code",
      caption: "মৌলিক রূপ — function টি ( ) এ মুড়ে তারপর ( ) দিয়ে ডাকা হয়েছে",
      code: `(function () {
  const secret = "শুধু ভেতরে দেখা যায়";
  console.log(secret);
})();`,
    },
    { type: "h3", text: "কেন parentheses দরকার?" },
    {
      type: "p",
      text: "JavaScript এ `function` শব্দ দিয়ে statement শুরু হলে parser সেটিকে **function declaration** ধরে, আর declaration এ নাম বাধ্যতামূলক এবং declaration কে সরাসরি `()` দিয়ে ডাকা যায় না — `function () {}()` লিখলে `SyntaxError`। বাইরের `( )` parser কে বলে ‘এখানে একটি **expression** আশা করো’, তাই function টি **expression** হয়ে যায় (Function Expression lesson এ declaration ও expression এর পার্থক্য দেখেছি)। এরপর শেষের `()` সেই expression এর ফল (function) কে ডাকে।",
    },
    { type: "h3", text: "Syntax এর রকমফের" },
    {
      type: "compare",
      headers: ["রূপ", "উদাহরণ", "মন্তব্য"],
      rows: [
        ["Classic (call বাইরে)", "`(function () { ... })();`", "সবচেয়ে প্রচলিত পুরোনো রূপ"],
        ["Call ভেতরে", "`(function () { ... }());`", "Douglas Crockford এর পছন্দের রূপ; একই কাজ"],
        ["Arrow IIFE", "`(() => { ... })();`", "আধুনিক কোডে সাধারণ; নিজস্ব `this` নেই"],
        ["`void` সহ", "`void function () { ... }();`", "`void` function টিকে expression বানায়; ফল `undefined` ফেরত"],
        ["Async IIFE", "`(async () => { await ...; })();`", "`await` ব্যবহারের জন্য আজও সাধারণ"],
        ["Named IIFE", "`(function init() { ... })();`", "Stack trace এ নাম দেখায়; নামটি শুধু function এর ভেতরে দেখা যায়"],
      ],
    },
    {
      type: "p",
      text: "অন্য unary operator (`!function(){}()`, `+function(){}()`) দিয়েও একই কৌশল চলে, কিন্তু পাঠযোগ্যতার জন্য `( )` বা `void` ই ভালো।",
    },
    { type: "h3", text: "কেন IIFE এসেছিল? (ইতিহাস)" },
    {
      type: "p",
      text: "ES2015 এর আগে JavaScript এ দুটি জিনিস ছিল না: **block scope** (`var` শুধু function scope মানত — Variables lesson দেখুন) এবং **module system**। Browser এ সব `<script>` একই global scope শেয়ার করত। দুটি ফাইলে একই নামের `var counter` থাকলে একটি আরেকটিকে নীরবে ওভাররাইট করত (**global namespace pollution**)। তখন কোডের একটি অংশকে বিচ্ছিন্ন রাখার একমাত্র উপায় ছিল একটি function বানানো, কারণ function ই একমাত্র scope তৈরি করত — আর সেটি একবারই চালাতে হলে IIFE।",
    },
    {
      type: "ul",
      items: [
        "**Global pollution এড়ানো** — library এর সব helper ভেতরে, শুধু প্রয়োজনীয়টি বাইরে।",
        "**Private state (module pattern)** — closure এ থাকা variable বাইরে থেকে সরাসরি পাওয়া যায় না।",
        "**Loop এর closure bug এর fix** — `var` ও `setTimeout` এর পুরোনো সমস্যায় প্রতিটি iteration এ নতুন scope।",
        "**একবারের initialization** — setup কোড চালিয়ে ফল শুধু রেখে দেওয়া, temporary variable ফেলে দেওয়া।",
      ],
    },
    { type: "h3", text: "Module pattern: IIFE + closure" },
    {
      type: "p",
      text: "IIFE যখন একটি **object (public API)** ফেরত দেয় এবং সেই object এর method গুলো IIFE এর ভেতরের variable কে closure হিসেবে ধরে রাখে — তখন সেটিকে **module pattern** বলে। ভেতরের variable (private state) বাইরে থেকে পড়া/লেখা যায় না; শুধু ফেরত দেওয়া method এর মাধ্যমে নিয়ন্ত্রিতভাবে বদলানো যায়। এটি Closures lesson এর ধারণারই একটি প্রয়োগ।",
    },
    {
      type: "code",
      caption: "Module pattern — `count` private, শুধু `increment`/`value` public",
      code: `const counter = (function () {
  let count = 0;                 // private
  return {
    increment() { return ++count; },
    value() { return count; },
  };
})();

counter.increment();
console.log(counter.value()); // 1
console.log(counter.count);   // undefined — বাইরে থেকে দেখা যায় না`,
    },
    { type: "h3", text: "আধুনিক বিকল্প: প্রায় সব কাজ এখন IIFE ছাড়া সম্ভব" },
    {
      type: "compare",
      headers: ["পুরোনো কাজ", "IIFE দিয়ে", "আধুনিক সমাধান"],
      rows: [
        ["Temporary variable লুকানো", "`(function(){ var t = ...; })()`", "শুধু block `{ let t = ...; }` — `let`/`const` block scoped"],
        ["Global এ দূষণ এড়ানো", "ফাইল জুড়ে একটি IIFE", "**ES Module** — প্রতিটি module এর top-level scope নিজস্ব"],
        ["Private state", "Module pattern (closure)", "Class এর **private field** `#count` (ES2022), বা module-level variable"],
        ["Loop এ প্রতিটি iteration এর মান ধরা", "IIFE তে `i` পাঠানো", "`for (let i ...)` — প্রতি iteration এ নতুন binding"],
        ["Dependency inject / UMD wrapper", "`(function (root, factory) { ... })(...)`", "Bundler (Vite, webpack, esbuild) ও ES module"],
      ],
    },
    {
      type: "p",
      text: "UMD (Universal Module Definition) এর মতো wrapper ঐতিহাসিকভাবে IIFE ব্যবহার করত যাতে একই ফাইল browser global, AMD ও CommonJS — সব পরিবেশে চলে। আজকের bundler আউটপুটেও আপনি IIFE দেখতে পাবেন (build করা ফাইল একটি `(function(){...})()` এ মোড়ানো থাকে), কিন্তু সেটি tool এর কাজ; নিজের source কোডে এটি লেখার দরকার সাধারণভাবে নেই।",
    },
    { type: "h3", text: "IIFE এখনো কোথায় কাজের?" },
    {
      type: "ul",
      items: [
        "**Async IIFE** — `await` শুধু `async` function এর ভেতরে (বা module এর top-level এ) চলে। যেখানে top-level await নেই (classic script, পুরোনো tooling, কিছু REPL/CommonJS পরিবেশ), সেখানে `(async () => { ... })();` প্রচলিত। (ES module এ top-level await সরাসরি ব্যবহার করা যায়।)",
        "**একবারের initialization যার ফল const এ রাখা যায়** — `const config = (() => { ... return value; })();` — জটিল if/else বা try/catch কে expression এ রূপান্তর।",
        "**Legacy কোড পড়া/maintain** — পুরোনো jQuery plugin, বিভিন্ন snippet ও build output চিনতে।",
        "**Inline scope** যেখানে block `{}` যথেষ্ট নয় কারণ ফল (return value) দরকার।",
      ],
    },
    {
      type: "code",
      caption: "Async IIFE (error handling সহ) — শুধু ধারণা দেখানোর জন্য, পরের section এর runnable উদাহরণ দেখুন",
      code: `(async () => {
  try {
    const data = await loadSomething();
    console.log(data);
  } catch (err) {
    console.log("failed:", err.name);
  }
})();`,
    },
    { type: "h3", text: "Named IIFE ও debugging" },
    {
      type: "p",
      text: "IIFE এ নাম দিলে (`(function init() {...})()`) error এর stack trace এ ‘anonymous’ এর বদলে `init` দেখায় — debug সহজ হয়। সেই নামটি শুধু function এর **ভেতরে** দেখা যায়, বাইরের scope এ নয় (named function expression এর নিয়ম); তাই এটি global এ নতুন নাম যোগ করে না। Arrow function এ নাম সরাসরি দেওয়া যায় না — তখন function expression ব্যবহার করুন, অথবা সাধারণভাবে engine variable এর নাম থেকে অনুমান করে (inference)। নির্ভর করতে চাইলে স্পষ্টভাবে named function লিখুন।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "ASI ফাঁদ: আগের লাইনে semicolon না থাকলে IIFE ভেঙে যায়",
      text: "JavaScript এ semicolon বাদ দিলে automatic semicolon insertion (ASI) কাজ করে, কিন্তু একটি লাইন `(` দিয়ে শুরু হলে parser প্রায়ই সেটিকে **আগের লাইনের ধারাবাহিকতা** ধরে — অর্থাৎ আগের expression এর ফলকে function হিসেবে ‘call’ করার চেষ্টা। `const a = 1` এর ঠিক পরে `(function(){})()` লিখলে `1(function(){})()` হয়ে `TypeError: ... is not a function` আসে। সমাধান: আগের statement এ সবসময় `;` দিন, অথবা IIFE এর আগে `;` বসান (`;(() => {...})()`) — যা semicolon-বিহীন code style এ সাধারণ। ফাইল concatenate করা পুরোনো build এ এই bug খুব হতো।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Global namespace ও নিরাপত্তা",
      text: "Global scope এ নাম ছড়ালে তৃতীয়-পক্ষ script, browser extension বা অন্য library এর নামের সাথে সংঘর্ষ (collision) হতে পারে — এমনকি ইচ্ছাকৃতভাবে কেউ আপনার global function ওভাররাইট করে আচরণ বদলাতে পারে। IIFE (বা আধুনিকভাবে ES module) সেই ঝুঁকি কমায়। তবে মনে রাখবেন, closure এর ‘private’ আসলে language এর encapsulation, নিরাপত্তা সীমানা নয় — browser এ চলা কোডের ভেতর থেকে কোনো secret (API key) লুকানো যায় না; DevTools দিয়ে সবই দেখা যায়।",
    },
    {
      type: "callout",
      tone: "info",
      title: "সাধারণ ভুল ধারণা",
      text: "(১) ‘IIFE মানে function টি অবশ্যই anonymous’ — না, নাম দেওয়া যায়, এবং দেওয়াই ভালো। (২) ‘IIFE মানে async বা আলাদা thread’ — না, এটি সাধারণ synchronous call; `async` IIFE এর `await` এর আগের অংশ synchronous চলে। (৩) ‘IIFE ছাড়া modern JS চলে না’ — উল্টো, আজ বেশিরভাগ কাজে এর দরকার নেই। (৪) ‘IIFE এর ভেতরের variable সবসময় পরে মুছে যায়’ — closure যদি তাকে ধরে রাখে (যেমন module pattern), সে বেঁচে থাকে; মুছে যাওয়া নির্ভর করে কেউ reference ধরে আছে কি না। (৫) Arrow IIFE এ `this` নিজের নয় — বাইরের scope এর `this` (Arrow Functions lesson দেখুন)।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "একটি রেস্তোরাঁর **রান্নাঘরে** নতুন একটি রেসিপি পরীক্ষা করা হচ্ছে — কিন্তু মূল রান্নাঘরের (global scope) কাউন্টার ছড়িয়ে নোংরা করতে চান না। তাই আপনি একটি **ছোট ট্রে-সহ অস্থায়ী কিচেনেট** (function scope) বসালেন, তাতে সব কাজ সেরে ফেললেন, এবং শেষে শুধু **তৈরি ডিশটি** (return value) পরিবেশনের জন্য বাইরে পাঠালেন।",
    },
    {
      type: "ul",
      items: [
        "**অস্থায়ী কিচেনেট** = IIFE এর function scope। ভেতরের সব পাত্র, মশলা (variable) শুধু সেখানেই।",
        "**‘বসানো আর সাথে সাথে রান্না শুরু’** = immediately invoked। আলাদা করে ‘এখন চালু করো’ বলতে হয় না।",
        "**মূল রান্নাঘর নোংরা না হওয়া** = global namespace pollution এড়ানো।",
        "**ডিশটি বাইরে পাঠানো** = return value (যেমন module pattern এর public API object)।",
        "**কিচেনেটের গোপন রেসিপি-খাতা যা শেফ ছাড়া কেউ দেখে না** = closure এ ধরা private state — ডিশ (public method) এর মাধ্যমে ব্যবহার করা যায়, কিন্তু খাতা সরাসরি ছোঁয়া যায় না।",
        "**আজকের দিনে** আলাদা **স্থায়ী স্টেশন (ES module)** আর **ক্ষণস্থায়ী কাজের জায়গা (block `{}`)** থাকায় অস্থায়ী কিচেনেট বসানোর প্রয়োজন কমে গেছে।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "IIFE চলার ধাপ: scope তৈরি, কাজ, এবং scope শেষ",
      nodes: [
        { id: "global", label: "Global scope" },
        { id: "iife", label: "IIFE scope", sub: "নতুন function scope" },
        { id: "out", label: "বাইরের জগৎ" },
      ],
      steps: [
        {
          active: ["global"],
          items: {
            global: ["(function () {", "  const secret = 42;", "  return secret + 1;", "})();"],
            iife: ["(এখনো তৈরি হয়নি)"],
          },
          note: "Parser প্রথমে বাইরের `( )` দেখে function টিকে **expression** হিসেবে নেয়। এই মুহূর্তে function object তৈরি হয়েছে, কিন্তু এখনো চালানো হয়নি।",
        },
        {
          active: ["global", "iife"],
          items: {
            global: ["শেষের () — call শুরু"],
            iife: ["নতুন call frame ও scope তৈরি", "secret = (TDZ — এখনো initialize হয়নি)"],
          },
          note: "শেষের `()` function টিকে ডাকে। Engine একটি নতুন **execution context** ও **function scope** বানায়। ভেতরের `secret` শুধু এই scope এ।",
        },
        {
          active: ["iife"],
          items: {
            iife: ["secret = 42", "return secret + 1 → 43"],
          },
          note: "ভেতরের কোড চলছে। `secret` এখানেই আছে; Global scope এ এই নামে কিছু যোগ হয়নি।",
        },
        {
          active: ["iife", "out"],
          items: {
            iife: ["frame বেরিয়ে যাচ্ছে"],
            out: ["ফল: 43"],
          },
          note: "Function `return` করল, ফল `43` বাইরে এল। কেউ closure দিয়ে scope ধরে না রাখলে এই scope ও `secret` আর অ্যাক্সেসযোগ্য থাকে না — memory পরে garbage collect হতে পারে।",
          output: "43",
        },
        {
          active: ["global"],
          items: {
            global: ["typeof secret → \"undefined\"", "Global এ কোনো দূষণ নেই ✔"],
          },
          note: "বাইরে থেকে `secret` অনুপলব্ধ — এটিই IIFE এর মূল সুবিধা।",
        },
      ],
      caption: "IIFE = একবারের জন্য তৈরি function scope, যা কাজ শেষে সংকুচিত হয়।",
    },
    {
      kind: "flow-steps",
      title: "Module pattern: private state ও public API",
      nodes: [
        { id: "iife", label: "IIFE scope", sub: "private" },
        { id: "api", label: "Public API object", sub: "ফেরত দেওয়া হয়" },
        { id: "caller", label: "বাইরের কোড" },
      ],
      steps: [
        {
          active: ["iife"],
          items: {
            iife: ["let count = 0   (private)", "increment() {...}", "value() {...}"],
          },
          note: "IIFE চলল: `count` তৈরি হলো। এটি শুধু এই function এর scope এ।",
        },
        {
          active: ["iife", "api"],
          items: {
            iife: ["count = 0 (closure এ ধরা থাকবে)"],
            api: ["{ increment, value }", "দুটি method ই `count` কে closure হিসেবে ধরে আছে"],
          },
          note: "IIFE একটি object ফেরত দেয়। IIFE শেষ হলেও `count` মরে না, কারণ ফেরত দেওয়া function গুলো তাকে reference করে — **closure**।",
        },
        {
          active: ["caller", "api"],
          items: {
            caller: ["counter.increment()", "counter.increment()"],
            api: ["increment → ++count"],
            iife: ["count = 2"],
          },
          note: "বাইরের কোড শুধু public method ডাকতে পারে। `increment` ভেতরের `count` বদলায়।",
        },
        {
          active: ["caller"],
          items: {
            caller: ["counter.count → undefined", "counter.value() → 2"],
          },
          note: "বাইরে থেকে `counter.count` সরাসরি পড়া যায় না (property নেই); শুধু `value()` দিয়ে পড়া যায়। এই নিয়ন্ত্রণই encapsulation।",
          output: "2",
        },
      ],
      caption: "আধুনিক সমতুল্য: class এর `#private` field বা ES module এর module-level variable।",
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "বিভিন্ন IIFE রূপ",
      description: "চারটি রূপের প্রতিটি চালিয়ে দেখুন — সব একই ধারণা, শুধু syntax আলাদা। `void` সহ রূপে ফল কী হয় লক্ষ্য করুন।",
      code: `(function () {
  console.log("classic");
})();

(function () {
  console.log("call ভেতরে");
}());

(() => {
  console.log("arrow IIFE");
})();

const r = void function () {
  console.log("void IIFE");
}();
console.log("void এর ফল:", r);

// ফল ফেরত দেওয়া IIFE
const sum = ((a, b) => a + b)(2, 3);
console.log(sum);`,
    },
    {
      level: "intermediate",
      title: "Module pattern: private state সহ counter ও scope পরীক্ষা",
      description: "দুটি আলাদা counter প্রতিটির নিজস্ব `count` ধরে রাখে। বাইরে থেকে `count` পড়া যায় না। Factory function ও IIFE এর পার্থক্য: IIFE একবারই চলে (singleton), factory বারবার।",
      code: `// IIFE → singleton module
const appCounter = (function () {
  let count = 0;
  return {
    increment() { count += 1; return count; },
    reset() { count = 0; },
    value() { return count; },
  };
})();

appCounter.increment();
appCounter.increment();
console.log("value:", appCounter.value());
console.log("count সরাসরি:", appCounter.count);

// Factory function → প্রতি call এ নতুন state
function createCounter() {
  let count = 0;
  return { increment: () => ++count };
}
const a = createCounter();
const b = createCounter();
a.increment();
a.increment();
console.log("a:", a.increment(), "b:", b.increment());

// global এ কিছু ছড়ায়নি
console.log(typeof count);`,
    },
    {
      level: "real-world",
      title: "Async IIFE ও const এ জটিল initialization",
      description: "Production এ দুটি সাধারণ ব্যবহার: (১) script এ `await` চালাতে async IIFE (এবং error handling), (২) try/catch যুক্ত জটিল logic থেকে একটি `const` মান বের করা। Network call এর বদলে Promise দিয়ে সিমুলেশন।",
      code: `// ছদ্ম API call
const fetchUser = (id) =>
  new Promise((resolve, reject) =>
    setTimeout(() => (id > 0 ? resolve({ id, name: "Rina" }) : reject(new Error("invalid id"))), 10)
  );

// (২) const এ জটিল initialization — try/catch কে expression এ রূপান্তর
const settings = (() => {
  const raw = '{"theme":"dark","page":2}';
  try {
    return JSON.parse(raw);
  } catch {
    return { theme: "light", page: 1 }; // fallback
  }
})();
console.log("settings:", settings);

// (১) async IIFE — await এর জন্য, নিজস্ব error handling সহ
(async () => {
  try {
    const user = await fetchUser(7);
    console.log("user:", user);
    await fetchUser(-1);
  } catch (err) {
    console.log("caught:", err.message);
  } finally {
    console.log("done");
  }
})();

console.log("sync অংশ আগে শেষ");`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
(() => {
  const msg = "IIFE থেকে হ্যালো";
  console.log(msg);
})();
`,
    },
    {
      label: "Loop closure: var + IIFE বনাম let",
      code: `// পুরোনো fix: IIFE তে i এর বর্তমান মান পাঠানো
const legacy = [];
for (var i = 0; i < 3; i++) {
  (function (j) {
    legacy.push(() => j);
  })(i);
}

// আধুনিক fix
const modern = [];
for (let k = 0; k < 3; k++) {
  modern.push(() => k);
}

// কোনো fix ছাড়া var
const broken = [];
for (var m = 0; m < 3; m++) {
  broken.push(() => m);
}

console.log("IIFE:", legacy.map((f) => f()));
console.log("let :", modern.map((f) => f()));
console.log("var :", broken.map((f) => f()));`,
    },
    {
      label: "Named IIFE: নামটি বাইরে দেখা যায় না",
      code: `const result = (function init(n) {
  console.log("ভেতরে name:", init.name);
  return n * 2;
})(21);

console.log(result);
console.log(typeof init); // নামটি শুধু ভেতরে`,
    },
    {
      label: "Block scope বনাম IIFE",
      code: `// পুরোনো ধরন: temp variable লুকাতে IIFE
(function () {
  var temp = "legacy";
  console.log(temp);
})();

// আধুনিক: শুধু block
{
  const temp = "modern";
  console.log(temp);
}

console.log(typeof temp);`,
    },
    {
      label: "Private field বনাম module pattern",
      code: `// আধুনিক বিকল্প: class এর #private
class Counter {
  #count = 0;
  increment() { return ++this.#count; }
  get value() { return this.#count; }
}

const c = new Counter();
c.increment();
c.increment();
console.log(c.value);
console.log(c.count);   // undefined — #count আলাদা, property নয়

// module pattern এর সমতুল্য
const m = (() => {
  let count = 0;
  return { increment: () => ++count, value: () => count };
})();
m.increment();
console.log(m.value());`,
    },
    {
      label: "ASI ঝুঁকি (catch করে দেখানো)",
      code: `// semicolon ছাড়া এক লাইন + আরেক লাইনে ( দিয়ে শুরু
// এটি eval দিয়ে চালিয়ে error ধরা হলো, যাতে পুরো ফাইল না ভাঙে
try {
  eval("const a = 1\\n(function () { console.log('IIFE') })()");
} catch (e) {
  console.log(e.name);
}

// ঠিক সংস্করণ: আগের লাইনে ;
eval("const b = 1;\\n(function () { console.log('IIFE চলেছে') })()");`,
    },
  ],

  debugging: [
    {
      title: "SyntaxError: function declaration কে সরাসরি call",
      bad: `try {
  eval("function () { console.log('hi'); }();");
} catch (err) {
  console.log(err.name);
}`,
      why: "`function` দিয়ে statement শুরু হলে parser এটিকে **declaration** ধরে, যেখানে নাম বাধ্যতামূলক এবং এরপর সরাসরি `()` বসানো যায় না — `SyntaxError`। (এখানে `eval` ব্যবহার করা হয়েছে শুধু error টি নিরাপদে ধরে দেখানোর জন্য; বাস্তব কোডে SyntaxError সম্পূর্ণ ফাইল চলতে দেয় না।) function টিকে `( )` বা `void` দিয়ে expression বানাতে হবে।",
      fix: `(function () {
  console.log("hi");
})();

void function () {
  console.log("void দিয়েও হয়");
}();`,
    },
    {
      title: "আগের লাইনে semicolon নেই: TypeError",
      bad: `try {
  eval("const total = 10\\n(function () { console.log('init') })()");
} catch (err) {
  console.log(err.name);
}`,
      why: "`10` এর ঠিক পরের লাইনে `(` থাকায় parser ASI বসায় না; এটি পড়ে `10(function(){...})()` — সংখ্যা `10` কে function হিসেবে call করা হয়, তাই `TypeError`। সমাধান: statement এর শেষে `;` দিন (বা IIFE এর আগে `;`)। Linter/Prettier এ semicolon নিয়ম রাখলে এই ঝুঁকি থাকে না।",
      fix: `const total = 10;
(function () {
  console.log("init", total);
})();`,
    },
    {
      title: "Loop এ var + callback: সব একই মান",
      bad: `const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns.map((f) => f()));`,
      why: "`var i` পুরো function/global scope এ একটিই binding। Callback গুলো পরে চলে, তখন `i === 3`। পুরোনো কোডের fix ছিল IIFE দিয়ে প্রতি iteration এ নতুন scope; আধুনিক fix হলো `let`।",
      fix: `const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns.map((f) => f()));`,
    },
    {
      title: "Module pattern এ ফেরত দিতে ভোলা",
      bad: `const store = (function () {
  let items = [];
  const add = (x) => items.push(x);
  // return নেই!
})();

try {
  store.add(1);
} catch (err) {
  console.log(err.name);
}`,
      why: "IIFE এর ফল একটি variable এ রাখা হয়েছে, কিন্তু function কিছুই `return` করেনি, তাই `store === undefined`। `undefined.add` পড়লে `TypeError`। Module pattern এ public API object টি ফেরত দিতেই হবে।",
      fix: `const store = (function () {
  const items = [];
  return {
    add: (x) => items.push(x),
    size: () => items.length,
  };
})();

store.add(1);
console.log(store.size());`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "প্রথম IIFE",
      prompt: "একটি arrow IIFE লিখুন যা `\"Hello from IIFE\"` print করে।",
      starter: `// TODO: arrow IIFE লিখুন
`,
      expected: "Hello from IIFE",
      hints: ["Arrow function টি `( )` এ মুড়ে শেষে `()` দিন: `(() => { ... })();`"],
      solution: `(() => {
  console.log("Hello from IIFE");
})();`,
      explanation: "বাইরের `( )` function টিকে expression বানায়, শেষের `()` সেটিকে ডাকে।",
    },
    {
      level: "beginner",
      title: "IIFE এর ফল const এ রাখা",
      prompt: "একটি IIFE দিয়ে `2` ও `3` এর গুণফল বের করে `product` নামের `const` এ রাখুন এবং print করুন।",
      starter: `// TODO: const product = ...
console.log(product);`,
      expected: "6",
      hints: ["IIFE এর `return` মান বাইরে একটি variable এ বসানো যায়।", "`const product = ((a, b) => a * b)(2, 3);`"],
      solution: `const product = ((a, b) => a * b)(2, 3);
console.log(product);`,
      explanation: "IIFE একটি expression, তাই তার ফল সরাসরি variable এ বসানো যায়।",
    },
    {
      level: "beginner",
      title: "Scope লুকানো প্রমাণ",
      prompt: "IIFE এর ভেতরে `secret` নামের একটি `const` তৈরি করে সেটি print করুন। এরপর IIFE এর বাইরে `typeof secret` print করে প্রমাণ করুন যে এটি দেখা যায় না।",
      starter: `// TODO`,
      expected: "hidden\nundefined",
      hints: ["ভেতরে `console.log(secret)` এ `\"hidden\"` print করুন।", "বাইরে `console.log(typeof secret)`।"],
      solution: `(() => {
  const secret = "hidden";
  console.log(secret);
})();
console.log(typeof secret);`,
      explanation: "`secret` IIFE এর function scope এ সীমাবদ্ধ, তাই বাইরে `typeof secret` হলো `\"undefined\"`।",
    },
    {
      level: "intermediate",
      title: "Module pattern: bank account",
      prompt: "একটি IIFE দিয়ে `account` বানান যার private `balance` আছে এবং `deposit(n)` ও `getBalance()` public method আছে। `deposit(50)` ও `deposit(25)` এর পর balance print করুন। বাইরে থেকে `account.balance` যেন `undefined` হয়।",
      starter: `// TODO: const account = (function () { ... })();

account.deposit(50);
account.deposit(25);
console.log(account.getBalance());
console.log(account.balance);`,
      expected: "75\nundefined",
      hints: ["IIFE এর ভেতরে `let balance = 0;` রাখুন।", "একটি object ফেরত দিন যার method গুলো `balance` কে ব্যবহার করে।"],
      solution: `const account = (function () {
  let balance = 0;
  return {
    deposit(n) { balance += n; },
    getBalance() { return balance; },
  };
})();

account.deposit(50);
account.deposit(25);
console.log(account.getBalance());
console.log(account.balance);`,
      explanation: "`balance` closure এ ধরা — বাইরে থেকে সরাসরি পড়া/লেখা যায় না, শুধু public method এর মাধ্যমে।",
    },
    {
      level: "intermediate",
      title: "var loop এ IIFE fix",
      prompt: "নিচের কোড `[ 3, 3, 3 ]` print করে। `var` রেখেই (let ব্যবহার না করে) IIFE দিয়ে ঠিক করুন যেন `[ 0, 1, 2 ]` print হয়।",
      starter: `const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns.map((f) => f()));`,
      expected: "[ 0, 1, 2 ]",
      hints: ["প্রতি iteration এ IIFE তে `i` কে argument হিসেবে পাঠান।", "Callback টি IIFE এর parameter কে ধরুক।"],
      solution: `const fns = [];
for (var i = 0; i < 3; i++) {
  (function (j) {
    fns.push(() => j);
  })(i);
}
console.log(fns.map((f) => f()));`,
      explanation: "IIFE প্রতিবার নতুন scope তৈরি করে; parameter `j` সেই iteration এর `i` এর মান copy করে রাখে। আধুনিক কোডে `let` ই যথেষ্ট।",
    },
    {
      level: "challenge",
      title: "Real-world: একবারের config loader ও async init",
      prompt:
        "একটি app bootstrap script লিখুন। (১) একটি IIFE দিয়ে `appConfig` const তৈরি করুন: `rawJson` parse করুন, parse ব্যর্থ হলে `{ apiBase: \"/api\", retries: 1 }` ফেরত দিন। (২) একটি async IIFE এ `loadUser()` (Promise ফেরত দেয়) await করে `\"user: Rina\"` print করুন; `loadUser` reject করলে `\"init failed: <message>\"` print করুন। (৩) সবার শেষে একটি synchronous লাইনে `\"config: <apiBase> x<retries>\"` print হবে — এটি async অংশের **আগেই** print হতে হবে। Output ক্রম অবশ্যই মিলতে হবে।",
      starter: `const rawJson = "{ invalid json";
const loadUser = () => Promise.resolve({ name: "Rina" });

// TODO (১): const appConfig = IIFE ...

// TODO (২): async IIFE ...

// (৩) এই লাইনটি sync, তাই async অংশের আগে চলবে
console.log("config: " + appConfig.apiBase + " x" + appConfig.retries);`,
      expected: "config: /api x1\nuser: Rina",
      hints: [
        "`const appConfig = (() => { try { return JSON.parse(rawJson); } catch { return {...}; } })();`",
        "Async IIFE এর ভেতরে try/catch দিয়ে `await loadUser()` ঘিরে রাখুন।",
        "Async function এর `await` এর পরের অংশ microtask এ চলে, তাই sync `console.log` আগে ছাপা হয়।",
      ],
      solution: `const rawJson = "{ invalid json";
const loadUser = () => Promise.resolve({ name: "Rina" });

const appConfig = (() => {
  try {
    return JSON.parse(rawJson);
  } catch {
    return { apiBase: "/api", retries: 1 };
  }
})();

(async () => {
  try {
    const user = await loadUser();
    console.log("user: " + user.name);
  } catch (err) {
    console.log("init failed: " + err.message);
  }
})();

console.log("config: " + appConfig.apiBase + " x" + appConfig.retries);`,
      explanation: "প্রথম IIFE একটি জটিল try/catch কে `const` এর মানে রূপান্তর করেছে। Async IIFE `await` পর্যন্ত synchronous চলে, তারপর বিরতি দেয়; ফলে নিচের synchronous `console.log` আগে ছাপা হয় এবং `user: Rina` পরে। সবকিছুর error async IIFE এর ভেতরেই handle হয় — নইলে unhandled rejection হতো।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`function () { console.log(1); }();` লিখলে কী ঘটে?",
        options: [
          "`1` print হয়",
          "SyntaxError, কারণ এটি function declaration হিসেবে পার্স হয়",
          "TypeError",
          "কিছুই হয় না",
        ],
        answer: 1,
        explanation:
          "`function` দিয়ে statement শুরু হলে parser declaration ধরে, যেখানে নাম বাধ্যতামূলক এবং সরাসরি `()` বসানো যায় না — তাই SyntaxError। `1` print হতো যদি function টি `( )` দিয়ে expression বানানো হতো। TypeError বা নীরব ব্যর্থতা এখানে ঘটে না, কারণ কোড চলার আগেই parse এ ধরা পড়ে।",
      },
      {
        question: "IIFE এর সবচেয়ে মূল ঐতিহাসিক উদ্দেশ্য কী ছিল?",
        options: [
          "কোড দ্রুত করা",
          "Asynchronous কাজ চালানো",
          "নিজস্ব scope তৈরি করে global namespace pollution এড়ানো",
          "Function কে hoist করা",
        ],
        answer: 2,
        explanation:
          "ES2015 এর আগে function ই একমাত্র scope ছিল এবং module system ছিল না, তাই IIFE দিয়ে কোড বিচ্ছিন্ন রাখা হতো। এতে কোড দ্রুত হয় না, নিজে async কিছু করে না (async IIFE এর `async` আলাদা), আর hoisting এর সাথেও এর সম্পর্ক এটি নয়।",
      },
      {
        question: "নিচের কোনটি আধুনিক JavaScript এ **একটি module এর top-level variable কে অন্য ফাইল থেকে আড়াল করার** সবচেয়ে স্বাভাবিক উপায়?",
        options: [
          "প্রতিটি ফাইলকে IIFE তে মোড়ানো",
          "ES Module ব্যবহার করা (প্রতিটি ফাইলের scope নিজস্ব)",
          "সব variable `var` দিয়ে লেখা",
          "Global object এ property হিসেবে রাখা",
        ],
        answer: 1,
        explanation:
          "ES module এ top-level variable module-local; `export` না করলে বাইরে যায় না। IIFE এ মোড়ানো পুরোনো উপায়, `var` global এ ছড়ায় (classic script এ), আর global object এ রাখা ঠিক উল্টো — দূষণ বাড়ায়।",
      },
      {
        question: "`const n = 5\\n(function () { console.log('x') })()` (আগের লাইনে `;` নেই) চালালে সম্ভবত কী হবে?",
        options: [
          "`x` print হবে, সব ঠিক",
          "`TypeError` — কারণ `5(...)` কে function call হিসেবে পার্স করা হয়",
          "SyntaxError ছাড়া কিছুই না",
          "`n` এর মান `undefined` হবে",
        ],
        answer: 1,
        explanation:
          "পরের লাইন `(` দিয়ে শুরু হলে ASI সেখানে semicolon বসায় না, ফলে `5(function(){...})()` পার্স হয় এবং `5` কে call করতে গিয়ে TypeError। `x` print হয় শুধু যদি `;` থাকে। এটি syntax-valid, তাই SyntaxError নয়; আর `n` এ কখনো মান বসার আগেই error হয়।",
      },
      {
        question: "`(async () => { await something(); })();` কে async IIFE বলা হয়। এর আজকের সবচেয়ে সাধারণ ব্যবহার কোনটি?",
        options: [
          "Function কে আলাদা thread এ চালানো",
          "যেখানে top-level `await` পাওয়া যায় না সেখানে `await` ব্যবহার করা",
          "`let` কে `var` এ বদলানো",
          "Stack overflow এড়ানো",
        ],
        answer: 1,
        explanation:
          "`await` কে `async` function এর ভেতরে চালাতে একটি wrapper লাগে; async IIFE সেই wrapper। এটি আলাদা thread চালায় না (JavaScript এখানেও একই থ্রেডে চলে), `let`/`var` এর সাথে সম্পর্ক নেই, আর stack overflow এর সাথেও কোনো সম্পর্ক নেই।",
      },
    ],
    coding: [
      {
        title: "Singleton ID generator",
        prompt: "একটি IIFE দিয়ে `nextId` বানান — প্রতিবার ডাকলে `1, 2, 3` ফেরত দেয়। Counter টি private থাকবে। `console.log` এ তিনবার ডাকুন।",
        starter: `// TODO: const nextId = ...

console.log(nextId());
console.log(nextId());
console.log(nextId());`,
        expected: "1\n2\n3",
        solution: `const nextId = (() => {
  let id = 0;
  return () => ++id;
})();

console.log(nextId());
console.log(nextId());
console.log(nextId());`,
      },
      {
        title: "Private state সহ Stack",
        prompt: "IIFE দিয়ে `stack` module বানান: `push(x)`, `pop()`, `size()`। Private array `items` বাইরে থেকে `undefined` হবে। `push(1)`, `push(2)` এর পর `pop()` এর ফল (`2`), তারপর `size()` (`1`), এবং `stack.items` প্রিন্ট করুন।",
        starter: `// TODO: const stack = ...

stack.push(1);
stack.push(2);
console.log(stack.pop());
console.log(stack.size());
console.log(stack.items);`,
        expected: "2\n1\nundefined",
        solution: `const stack = (function () {
  const items = [];
  return {
    push(x) { items.push(x); },
    pop() { return items.pop(); },
    size() { return items.length; },
  };
})();

stack.push(1);
stack.push(2);
console.log(stack.pop());
console.log(stack.size());
console.log(stack.items);`,
      },
    ],
  },

  interview: [
    {
      q: "IIFE কী এবং কেন function টিকে parentheses এ মুড়তে হয়?",
      a: "IIFE হলো এমন function expression যেটি তৈরির সাথে সাথেই ডাকা হয়: `(function () { ... })();`। Parentheses লাগে কারণ `function` দিয়ে কোনো statement শুরু হলে parser সেটিকে function **declaration** ধরে, যেখানে নাম বাধ্যতামূলক এবং সরাসরি `()` বসালে SyntaxError।\n\nবাইরের `( )` parser কে বলে এখানে একটি **expression** আশা করা হচ্ছে, ফলে function টি expression হয় এবং শেষের `()` দিয়ে ডাকা যায়। একই ফল পাওয়া যায় `void function(){}()`, `!function(){}()` বা arrow IIFE `(() => {})()` দিয়ে।",
    },
    {
      q: "IIFE কেন এত জনপ্রিয় ছিল, এবং আজ তার জায়গায় কী ব্যবহার করা হয়?",
      a: "ES2015 এর আগে JavaScript এ block scope ও module system ছিল না — `var` শুধু function scope মানত এবং সব script একই global scope শেয়ার করত। তাই কোড বিচ্ছিন্ন রাখা, private state বানানো (module pattern) এবং global namespace দূষণ এড়ানোর একমাত্র উপায় ছিল function দিয়ে scope বানিয়ে সঙ্গে সঙ্গে চালানো।\n\nআজ: temporary variable এর জন্য `{ let ... }` block; module isolation এর জন্য **ES Modules**; private state এর জন্য class এর `#private` field বা module-level variable; loop closure এর জন্য `let`; আর build/bundle এর কাজ bundler করে। ফলে নিজের কোডে IIFE প্রায় দরকার হয় না, তবে legacy কোড পড়া ও কিছু ছোট ব্যবহারে (async IIFE) এখনো কাজের।",
    },
    {
      q: "Module pattern কীভাবে কাজ করে? Private state কোথায় থাকে?",
      a: "Module pattern এ একটি IIFE ভেতরে কিছু variable ও function তৈরি করে এবং শেষে একটি **object (public API)** ফেরত দেয়। ফেরত দেওয়া method গুলো IIFE এর ভেতরের variable কে **closure** হিসেবে ধরে রাখে। IIFE শেষ হয়ে গেলেও সেই variable গুলো garbage collect হয় না, কারণ method গুলো তাদের reference করে।\n\nPrivate state আসলে IIFE এর function scope এ থাকে — বাইরের কোড তার নাম জানে না বা ধরতে পারে না, শুধু public method দিয়ে বদলাতে পারে। একটি IIFE একবারই চলে বলে এটি singleton; প্রতিবার আলাদা state চাইলে factory function ব্যবহার করুন। আধুনিক সমতুল্য: class এর `#field`।",
    },
    {
      q: "Semicolon ছাড়া কোডে IIFE এর আগে কী ঝুঁকি থাকে এবং কীভাবে এড়াবেন?",
      a: "JavaScript এর automatic semicolon insertion (ASI) নিয়ম অনুযায়ী পরের লাইন `(`, `[` বা `` ` `` দিয়ে শুরু হলে parser সাধারণত আগের লাইনের সাথে জুড়ে ফেলে। ফলে `const a = 1` এর পরের লাইনে `(function(){})()` লিখলে সেটি `1(function(){})()` হয়ে যায় এবং TypeError আসে (সংখ্যাকে call করা হচ্ছে); বা আগের লাইন function হলে সেটি অপ্রত্যাশিতভাবে ডাকা হয়।\n\nসমাধান: সবসময় statement এর শেষে `;` দিন (Prettier/ESLint নিয়মে বাধ্য করুন), অথবা semicolon-বিহীন style এ IIFE এর আগে `;` বসান: `;(() => { ... })()`। ফাইল concatenation করা পুরোনো build এ এই bug অতি পরিচিত ছিল।",
    },
    {
      q: "Async IIFE কেন লাগে এবং এতে error handling কীভাবে করবেন?",
      a: "`await` কেবল `async` function এর ভেতরে (বা ES module এর top-level এ) ব্যবহার করা যায়। যে পরিবেশে top-level await নেই — classic script, কিছু পুরোনো tooling ও CommonJS — সেখানে `(async () => { ... })();` দিয়ে একটি async function তৈরি করে সাথে সাথে চালানো হয়।\n\nসতর্কতা: IIFE এর ফল একটি Promise। ভেতরে error ধরা না হলে সেটি **unhandled rejection** হয়ে যায় (Node এ সাধারণভাবে process crash এ পরিণত হতে পারে)। তাই ভেতরে `try/catch` রাখুন, অথবা শেষে `.catch(handler)` যোগ করুন: `(async () => {...})().catch(console.error)`। আরও মনে রাখবেন — `await` এর আগের অংশ synchronous চলে, আর IIFE কোনো আলাদা thread তৈরি করে না।",
    },
    {
      q: "Named IIFE এর সুবিধা কী? নামটি কি global scope এ দেখা যায়?",
      a: "`(function init() { ... })()` এ নাম দিলে error এর stack trace ও debugger এ ‘anonymous function’ এর বদলে `init` দেখায়, ফলে কোথায় সমস্যা হয়েছে বোঝা সহজ হয়। এছাড়া function নিজের ভেতর থেকে নিজেকে নাম ধরে ডাকতে পারে (recursion)।\n\nএই নামটি শুধু function এর **ভেতরের scope** এ দেখা যায় (named function expression এর নিয়ম) — বাইরে `typeof init` হলো `\"undefined\"`, তাই global এ নতুন নাম যোগ হয় না। Arrow function এ সরাসরি নাম দেওয়া যায় না; সেক্ষেত্রে function expression ব্যবহার করুন যদি নামযুক্ত trace চান।",
    },
  ],

  summary: {
    takeaways: [
      "IIFE = তৈরির সাথে সাথে ডাকা function expression; বাইরের `( )` (বা `void`) function কে declaration নয়, expression বানায়।",
      "ঐতিহাসিক উদ্দেশ্য: block scope ও module এর অভাবে scope তৈরি, global pollution এড়ানো, private state (module pattern)।",
      "আধুনিক বিকল্প: block `{}` + `let/const`, ES Module, class `#private` field, `for (let ...)`।",
      "আজও কাজের: async IIFE, `const` এর জন্য জটিল একবারের initialization, legacy কোড পড়া।",
      "Semicolon-বিহীন কোডে `(` দিয়ে শুরু হওয়া IIFE এর আগে `;` রাখুন — নইলে ASI ফাঁদ।",
      "Named IIFE stack trace এ সুবিধা দেয়; নামটি বাইরের scope এ দেখা যায় না।",
    ],
    syntax: `(function () { /* ... */ })();     // classic
(function () { /* ... */ }());     // call ভেতরে
(() => { /* ... */ })();           // arrow
void function () { /* ... */ }();  // void
(async () => { await x; })();      // async
(function init() { /* ... */ })(); // named

const api = (function () {         // module pattern
  let privateState = 0;
  return { inc: () => ++privateState };
})();`,
    whenToUse: [
      "Async IIFE — যেখানে top-level `await` নেই।",
      "`const` এ জটিল (try/catch বা if-else যুক্ত) একবারের initialization।",
      "Legacy কোড বা bundler আউটপুট বোঝা/maintain করা।",
      "নতুন কোডে scope/private state এর জন্য ES module, block `{}` বা `#private` পছন্দ করুন।",
    ],
    next: [
      "Closures — module pattern এর ভিত্তি",
      "Lexical Scope ও Scope Chain — IIFE কোন scope এ চলে",
      "`this` keyword — arrow IIFE ও regular IIFE এ `this` এর পার্থক্য",
    ],
  },

  compatibility:
    "IIFE ভাষার শুরু থেকেই কাজ করে — সব browser ও Node.js এ একই আচরণ। Arrow IIFE ও async IIFE ES2015/ES2017 এর অংশ (সব আধুনিক runtime এ সমর্থিত)। ES module ও Node.js module এ top-level scope module-local, তাই classic script এর মতো global pollution সেখানে কম; top-level `await` শুধু ES module এ (আধুনিক browser ও Node.js এ) চলে। Class এর `#private` field ES2022 এর অংশ। এই Playground browser-like Web Worker এ চলে।",
};
