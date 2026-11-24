import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Callback কী, JavaScript এ function কেন ‘first-class value’ হওয়ায় callback সম্ভব — তা ব্যাখ্যা করতে পারবেন।",
    "**Synchronous** callback (`forEach`, `sort` comparator) আর **asynchronous** callback (`setTimeout`) এর execution order পার্থক্য কোড না চালিয়েই অনুমান করতে পারবেন।",
    "**Inversion of control** এর ঝুঁকি এবং Node.js এর **error-first callback** convention বুঝে নিজে সেই style এ function লিখতে পারবেন।",
    "Callback hell (pyramid of doom) কেন তৈরি হয়, কীভাবে সাময়িকভাবে সামলানো যায় এবং কেন পরে Promise/`async`-`await` এসেছে — তা বলতে পারবেন।",
    "`setTimeout(fn(), 0)` এর মতো সাধারণ bug এবং `this` হারিয়ে যাওয়ার সমস্যা চিনে ঠিক করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Callback আসলে কী?" },
    {
      type: "p",
      text: "**Callback** হলো এমন একটি function যা আপনি অন্য কোনো function এর কাছে **argument হিসেবে পাঠান**, যাতে সেই function ‘পরে কোনো এক সময়’ আপনার function টিকে **ফিরে ডাকে** (call back)। নামটাই ব্যাখ্যা: ‘আমার কাজ যখন হবে/তোমার কাজ শেষ হবে, তখন আমাকে ডেকো।’ আপনি function টি নিজে call করেন না; কখন, কতবার এবং কী argument দিয়ে call হবে তা সিদ্ধান্ত নেয় যাকে আপনি দিয়েছেন সে।",
    },
    {
      type: "p",
      text: "এটা সম্ভব কারণ JavaScript এ function হলো **first-class value** — অর্থাৎ function ও number/string/object এর মতোই একটি মান। একে variable এ রাখা যায়, array তে রাখা যায়, argument হিসেবে পাঠানো যায়, আবার return করাও যায় (Functions module এর আগের lesson গুলোতে function declaration/expression/arrow নিয়ে দেখেছি)। Callback হলো সেই ক্ষমতার সবচেয়ে সরাসরি ব্যবহার।",
    },
    {
      type: "code",
      caption: "সবচেয়ে ছোট callback: `formatter` একটি function, `greet` সেটিকে ডাকে।",
      code: `function greet(name, formatter) {
  return formatter(name);   // callback টি এখানে call হচ্ছে
}

greet("Rina", (n) => "Hello, " + n);   // arrow function টি callback
greet("Rina", (n) => n.toUpperCase()); // একই greet, ভিন্ন আচরণ`,
    },
    {
      type: "h3", text: "কেন callback দরকার হয়?",
    },
    {
      type: "p",
      text: "দুটি আলাদা কারণে: **(১) আচরণ parameterize করা** — `sort` জানে কীভাবে সাজাতে হয়, কিন্তু ‘কোনটি আগে’ তা আপনি callback দিয়ে বলেন। এতে একটি generic function হাজার রকম কাজে লাগে। **(২) কাজ পরে হবে, তাই ‘তখন কী করব’ আগে বলে রাখা** — timer, network response, user click ইত্যাদি এখনই ঘটছে না; JavaScript single thread এ চলে বলে সে অপেক্ষায় block না থেকে আপনার callback টি ‘পরে চালাব’ বলে রেখে দেয়। Frontend এ `onClick={handler}`, `addEventListener('click', handler)`, `useEffect(() => {...})` — সবই এই ধারণারই রূপ।",
    },
    {
      type: "h3", text: "Synchronous বনাম Asynchronous callback",
    },
    {
      type: "compare",
      headers: ["বৈশিষ্ট্য", "Synchronous callback", "Asynchronous callback"],
      rows: [
        ["কখন চলে", "Host function শেষ হওয়ার **আগেই**, call stack এর ভেতরে", "Host function **return করার পরে**, call stack খালি হলে (event loop থেকে)"],
        ["উদাহরণ", "`forEach`, `map`, `filter`, `sort` comparator, `reduce`", "`setTimeout`, `setInterval`, event listener, I/O ও network callback"],
        ["Error handling", "বাইরের `try/catch` ধরতে পারে", "বাইরের `try/catch` **ধরতে পারে না** (stack আলাদা)"],
        ["Order", "কোডে যেভাবে লেখা, সেভাবেই", "বর্তমান synchronous কোড পুরো শেষ হওয়ার পরে"],
        ["সাধারণ ভুল", "Callback এর ভেতরে বাইরের array mutate করা", "মনে করা ‘`setTimeout(…, 0)` মানে এখনই’"],
      ],
    },
    {
      type: "p",
      text: "মনে রাখুন: **callback নিজে sync বা async নয়** — ওটা নির্ভর করে যে function টি callback ডাকছে তার ওপর। `[1,2].forEach(cb)` cb কে সাথে সাথে ডাকে; `setTimeout(cb, 0)` cb কে event loop এ রেখে দেয়। একই আকারের function দুই ভাবেই ব্যবহৃত হতে পারে।",
    },
    {
      type: "code",
      caption: "Order প্রমাণ: sync callback গুলো আগে, `setTimeout` এর callback সবার শেষে (এমনকি delay `0` হলেও)।",
      code: `console.log("A");
setTimeout(() => console.log("timeout callback"), 0);
[1, 2].forEach((n) => console.log("forEach", n));
console.log("D");
// A, forEach 1, forEach 2, D, timeout callback`,
    },
    {
      type: "p",
      text: "কারণটি event loop এর কাজ: `setTimeout` timer টি runtime (browser/Node.js) কে দিয়ে দেয়; timer শেষ হলেও callback টি সরাসরি চলে না — সেটি task queue তে অপেক্ষা করে। **Call stack এ চলমান সব synchronous কোড শেষ না হওয়া পর্যন্ত** event loop queue থেকে কিছু তোলে না। তাই `0` ms delay মানে ‘ন্যূনতম এত পরে এবং stack খালি হলে’ — ‘এখনই’ নয়। (Event loop বিস্তারিত JavaScript Runtime lesson এ আছে।)",
    },
    {
      type: "h3", text: "Callback এ argument পাঠানো ও পাওয়া",
    },
    {
      type: "p",
      text: "Callback এ কী কী argument আসবে তা **host function এর চুক্তি (contract)**। যেমন `array.forEach(cb)` প্রতিবার `cb(element, index, array)` — তিনটি argument দিয়ে ডাকে। আপনি যতটা দরকার ততটা parameter নিতে পারেন। উল্টো দিকে, আপনার নিজের ধার করা মান callback এ পাঠাতে চাইলে wrapper arrow function লিখুন: `setTimeout(() => log(user), 0)`, অথবা `setTimeout(log, 0, user)` (extra argument গুলো callback এ যায় — Node.js ও browser দুটোতেই)।",
    },
    {
      type: "code",
      code: `[10, 20].forEach((value, index, whole) => {
  console.log(index, value, whole.length);
});

function logUser(prefix, user) {
  console.log(prefix, user.name);
}
// দুই ধরনের উপায়: wrapper অথবা setTimeout এর extra argument
setTimeout(() => logUser("wrapper:", { name: "Rina" }), 0);
setTimeout(logUser, 0, "extra arg:", { name: "Mim" });`,
    },
    {
      type: "callout",
      tone: "warn",
      title: "সবচেয়ে সাধারণ bug: function কে ‘pass’ না করে ‘call’ করে ফেলা",
      text: "`setTimeout(sayHi(), 1000)` লিখলে `sayHi` **এখনই** চলে, আর `setTimeout` এ যায় `sayHi()` এর **return value** (সাধারণত `undefined`)। Callback হিসেবে function টির **নাম** পাঠাতে হয় (`sayHi`), বন্ধনী ছাড়া। Argument লাগলে wrapper: `() => sayHi(\"Rina\")`। React এ একই ভুল: `onClick={handle()}` বনাম `onClick={handle}` বা `onClick={() => handle(id)}`।",
    },
    {
      type: "h3", text: "Inversion of Control: callback এর গোপন ঝুঁকি",
    },
    {
      type: "p",
      text: "Callback দেওয়ার মানে আপনি আপনার কোড চালানোর **নিয়ন্ত্রণ অন্যের হাতে দিয়ে দিচ্ছেন** — একে বলে **inversion of control**। Third-party library টি আপনার callback কে: দুইবার ডাকতে পারে, একবারও না ডাকতে পারে, খুব আগে (synchronously) বা খুব দেরিতে ডাকতে পারে, ভুল argument দিয়ে ডাকতে পারে, অথবা error গিলে ফেলতে পারে। Payment বা analytics callback এ এই ঝুঁকি বাস্তব। তাই callback-ভিত্তিক API বানানোর সময় প্রতিটি পথে **ঠিক একবার** callback ডাকাটা (এবং sync/async মিশিয়ে না ফেলা) আপনার দায়িত্ব। Promise এর অন্যতম সুবিধা — settled promise একবারই resolve হয়, ফলে এই ঝুঁকির বড় অংশ চলে যায়।",
    },
    {
      type: "h3", text: "Error-first callback (Node.js convention)",
    },
    {
      type: "p",
      text: "Async কাজে error হলে `throw` করা যায় না (stack ততক্ষণে খালি; বাইরের `try/catch` আর নেই)। তাই Node.js এর পুরোনো API গুলো একটি convention মানে: callback এর **প্রথম parameter সবসময় error** (`null`/`undefined` মানে সফল), বাকিগুলো result। এই কারণেই callback শুরুতেই `if (err) { ...; return; }` দিয়ে শুরু হয় — আর `return` ভুলে গেলে ‘error handle করার পরেও success path চলতে থাকে’ — এটি খুব পরিচিত bug।",
    },
    {
      type: "code",
      caption: "Simulated error-first API (সত্যিকারের I/O ছাড়া): সফল হলে `cb(null, data)`, ব্যর্থ হলে `cb(error)`।",
      code: `function readConfig(name, cb) {
  setTimeout(() => {
    if (name !== "app") {
      cb(new Error("config not found: " + name)); // প্রথম argument = error
      return;                                      // return ভুলবেন না
    }
    cb(null, { theme: "dark" });                   // null error + result
  }, 0);
}

readConfig("app", (err, config) => {
  if (err) { console.log("failed:", err.message); return; }
  console.log("ok:", config);
});`,
    },
    {
      type: "h3", text: "Callback hell (Pyramid of Doom)",
    },
    {
      type: "p",
      text: "একটি async কাজের ফলের ওপর নির্ভর করে পরের async কাজ — এভাবে callback এর ভেতরে callback এর ভেতরে callback লিখলে কোড ডান দিকে ক্রমশ সরে যায় (pyramid)। সমস্যা শুধু দেখতে খারাপ নয়: প্রতিটি স্তরে আলাদা `if (err)`, variable এর scope গুলিয়ে যায়, ‘parallel চালাও’ বা ‘retry করো’ লেখা কঠিন, আর কোড পড়ে execution order বোঝা যায় না।",
    },
    {
      type: "code",
      caption: "পিরামিড: login → profile → posts। প্রতিটি ধাপে error handling আলাদা করে বসাতে হচ্ছে।",
      code: `login("rina", (err, session) => {
  if (err) return handle(err);
  getProfile(session, (err2, profile) => {
    if (err2) return handle(err2);
    getPosts(profile, (err3, posts) => {
      if (err3) return handle(err3);
      render(posts);
    });
  });
});`,
    },
    {
      type: "p",
      text: "Promise ও `async`/`await` (Module 05 এ পুরো বিস্তারিত) এই সমস্যার সমাধান: ধাপগুলো সোজা লাইনে লেখা যায়, একটি জায়গায় error ধরা যায়, আর ‘একবারই settle হবে’ গ্যারান্টি পাওয়া যায়। এই lesson এ আমরা Promise শেখাচ্ছি না — শুধু বুঝে রাখুন কেন callback এর সীমাবদ্ধতা থেকেই সেগুলোর জন্ম। নতুন কোডে async কাজ সাধারণত Promise-ভিত্তিক API দিয়েই করা হয়, তবে callback বুঝতে না পারলে event handler, array method, library hook কিছুই বোঝা যাবে না।",
    },
    {
      type: "h3", text: "`this` হারিয়ে যাওয়া (সংক্ষেপে)",
    },
    {
      type: "p",
      text: "Method কে callback হিসেবে আলাদা করে পাঠালে (`setTimeout(counter.increment, 0)`) সেটি আর `counter.` এর সাথে সংযুক্ত থাকে না — call এর সময় `this` নির্ধারিত হয় **কীভাবে call হলো তা দেখে**, কোথায় লেখা হয়েছে তা দেখে নয়। ফলে `this` হয় `undefined` (strict mode/class এর ভেতরে) বা global object, আর `this.count` ভেঙে যায়। সমাধান: arrow wrapper `() => counter.increment()` অথবা `counter.increment.bind(counter)`। `this` এর পুরো নিয়ম ‘this keyword’ lesson এ বিস্তারিত দেখব।",
    },
    {
      type: "h3", text: "Event handler ও callback (Frontend দৃষ্টিকোণ)",
    },
    {
      type: "p",
      text: "Browser এ প্রতিটি event listener একটি async callback: আপনি ‘click হলে এটা চালাও’ বলে রেখে যান, browser নিজে সময়মতো ডাকে। Handler এ সাধারণত একটি `event` object আসে। নিচের snippet টি browser এ চলে, আমাদের sandbox এ (DOM নেই) চলবে না — তাই এটি শুধু পড়ার জন্য।",
    },
    {
      type: "code",
      caption: "Browser-only snippet — এই sandbox এ চালানো যাবে না (DOM দরকার)।",
      code: `// browser এ
const button = document.querySelector("#save");

function onSave(event) {
  console.log("clicked", event.type);
}

button.addEventListener("click", onSave);    // ঠিক: function টি pass করা হলো
// button.addEventListener("click", onSave()); // ভুল: এখনই call হয়ে যাবে

// প্রয়োজন শেষ হলে একই reference দিয়ে সরাতে হয়
button.removeEventListener("click", onSave);`,
    },
    {
      type: "callout",
      tone: "info",
      title: "Common misconceptions",
      text: "(১) ‘Callback মানেই asynchronous’ — না, `map`/`sort` এর callback synchronous। (২) ‘`setTimeout(fn, 0)` এখনই চলে’ — না, current synchronous কোড শেষ হওয়ার পরে চলে। (৩) ‘Callback এ error হলে বাইরের `try/catch` ধরবে’ — async callback এ ধরে না। (৪) ‘Callback মানে anonymous arrow function’ — যেকোনো function (named, method, built-in) callback হতে পারে। (৫) ‘Callback hell মানে callback খারাপ’ — callback নিজে ঠিক আছে; সমস্যা হলো গভীর nesting।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Callback নিয়ে কাজের নিয়ম",
      text: "Callback কে সবসময় নাম দিন যখন তা এক লাইনের বেশি (`const onSuccess = ...`)। Callback ডাকলে প্রতিটি path এ ঠিক একবার ডাকুন। Sync আর async মিশাবেন না (কখনো সাথে সাথে, কখনো পরে — এতে bug ধরা কঠিন)। Error-first API তে সবার আগে error handle করে `return` করুন।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ধরুন আপনি একটি জনপ্রিয় রেস্টুরেন্টে খাবার অর্ডার করলেন। কাউন্টারের লোকটি আপনাকে একটি **buzzer** দিয়ে বলল, ‘খাবার তৈরি হলে এটি বাজবে।’ আপনি কাউন্টারে দাঁড়িয়ে থাকলেন না — বসে ফোন দেখছেন। খাবার তৈরি হতেই buzzer বাজল, আপনি গিয়ে নিলেন।",
    },
    {
      type: "ul",
      items: [
        "**Buzzer (ও ‘বাজলে কী করব’ নির্দেশনা)** = callback। আপনি কাজটির নির্দেশ আগেই দিয়ে রেখেছেন; এখন চালাচ্ছেন না।",
        "**কাউন্টারের কর্মী/রান্নাঘর** = যে function callback টি নেয় (`setTimeout`, `readConfig`)। কখন বাজবে সেই সিদ্ধান্ত তার — এটাই **inversion of control**।",
        "**আপনার ফোন দেখা** = বাকি synchronous কোড; async callback এর জন্য অপেক্ষা করতে গিয়ে JavaScript থেমে থাকে না।",
        "**Buzzer বাজা = event loop এর callback queue থেকে call stack এ ওঠা**। আপনি যদি তখন অন্য কাজে ব্যস্ত (stack ভর্তি) থাকেন, বাজলেও ধরতে দেরি হবে — ঠিক যেমন `setTimeout(…, 0)` ও stack খালি না হওয়া পর্যন্ত চলে না।",
        "**Error-first callback** = buzzer বাজার সাথে একটি স্লিপ: ‘খাবার তৈরি’ নাকি ‘দুঃখিত, উপকরণ নেই’ — আপনি আগে স্লিপ দেখেন (প্রথম parameter `err`), তারপর খাবার (result)।",
        "**Callback hell** = ‘খাবার এলে পানি অর্ডার করো, পানি এলে ডেজার্ট অর্ডার করো, ডেজার্ট এলে বিল চাও’ — প্রতিটি buzzer এর ভেতরে আরেকটি buzzer। নির্দেশের ধাপ বাড়লে মনে রাখা কঠিন হয়ে যায়।",
        "**`setTimeout(fn(), 0)` ভুল** = buzzer না নিয়ে নিজে রান্নাঘরে ঢুকে খাবার বানিয়ে ফেলা, তারপর রান্নাঘরকে বলা ‘খাবার তৈরি হলে এই (খালি) কাগজ ধরিয়ে দাও।’",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "Async callback এর যাত্রা: stack, timer ও queue",
      caption: "`setTimeout(cb, 0)` এর callback কেন সবার শেষে চলে — তিনটি জায়গার মধ্য দিয়ে একটি callback এর যাত্রা।",
      nodes: [
        { id: "stack", label: "Call Stack", sub: "চলমান কোড" },
        { id: "timer", label: "Timer (Runtime)", sub: "browser/Node.js" },
        { id: "queue", label: "Task Queue", sub: "অপেক্ষমাণ callback" },
        { id: "out", label: "Console", sub: "output" },
      ],
      steps: [
        {
          active: ["stack"],
          items: { stack: ["main()", "console.log(\"A\")"] },
          output: "A",
          note: "প্রথমে `console.log(\"A\")` — synchronous, সাথে সাথে চলে ও সরে যায়।",
        },
        {
          active: ["stack", "timer"],
          items: { stack: ["main()", "setTimeout(cb, 0)"], timer: ["cb — 0ms এর timer"] },
          note: "`setTimeout` কেবল runtime কে বলে ‘এই callback টি পরে চালাও।’ নিজে `cb` চালায় না। এরপর `setTimeout` সাথে সাথে return করে।",
        },
        {
          active: ["stack", "queue"],
          items: { stack: ["main()", "console.log(\"B\")"], queue: ["cb"] },
          output: "B",
          note: "Timer খুব তাড়াতাড়ি শেষ হলো, তাই `cb` queue তে এসে দাঁড়াল — কিন্তু stack এখনো ব্যস্ত (`main()` শেষ হয়নি), তাই `cb` অপেক্ষা করছে। সেই সময়ে `console.log(\"B\")` চলল।",
        },
        {
          active: ["stack"],
          items: { stack: ["cb()"], queue: [] },
          note: "`main()` শেষ, stack খালি। এখন event loop queue থেকে `cb` তুলে stack এ বসাল।",
        },
        {
          active: ["stack", "out"],
          items: { stack: ["cb()"] },
          output: "timeout callback",
          note: "সবশেষে callback চলল। Output এর ক্রম: A, B, timeout callback — যদিও timer এর delay ছিল `0`।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Synchronous callback: `forEach` এর ভেতরে call stack",
      caption: "Sync callback গুলো host function এর ভেতরেই, একই call stack এ, একটির পর একটি চলে।",
      nodes: [
        { id: "stack", label: "Call Stack", sub: "উপরে = সবচেয়ে নতুন frame" },
        { id: "out", label: "Console", sub: "output" },
      ],
      steps: [
        {
          active: ["stack"],
          items: { stack: ["forEach(cb)", "main()"] },
          note: "`[1, 2].forEach(cb)` call হলো। `forEach` এর frame stack এ উঠল; ভেতরে সে প্রতিটি element এর জন্য `cb` কে ডাকবে।",
        },
        {
          active: ["stack", "out"],
          items: { stack: ["cb(1, 0)", "forEach(cb)", "main()"] },
          output: "item 1",
          note: "প্রথম element এর জন্য `cb(1, 0)` — `forEach` এর frame এর **ওপরে** নতুন frame। `cb` শেষ না হওয়া পর্যন্ত `forEach` অপেক্ষা করে।",
        },
        {
          active: ["stack", "out"],
          items: { stack: ["cb(2, 1)", "forEach(cb)", "main()"] },
          output: "item 2",
          note: "আগের `cb` frame সরে গেছে, এখন দ্বিতীয়টির frame। সবই একই call stack এ — তাই এই callback এ `throw` হলে বাইরের `try/catch` সেটি ধরতে পারে।",
        },
        {
          active: ["stack"],
          items: { stack: ["main()"] },
          note: "`forEach` শেষ, return করেছে। এরপর `main()` এর পরের লাইন চলবে। Async callback এর সাথে পার্থক্য: এখানে callback গুলো **`forEach` return করার আগেই** শেষ হয়ে গেছে।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Function pass করা: আচরণ বদলানো ও forEach",
      description: "একই `greet` function কে ভিন্ন callback দিয়ে ভিন্ন কাজ করানো। `forEach` এর callback টিও একই ধারণা।",
      code: `function greet(name, formatter) {
  return formatter(name);
}

console.log(greet("Rina", (n) => "Hello, " + n));
console.log(greet("Rina", (n) => n.toUpperCase()));

const prices = [120, 80, 45];
prices.forEach((price, index) => {
  console.log("item", index, "costs", price);
});

// comparator callback: কোনটি আগে — সেই নিয়ম আপনি দেন
const sorted = [...prices].sort((a, b) => a - b);
console.log(sorted);`,
    },
    {
      level: "intermediate",
      title: "Sync বনাম async callback: execution order",
      description: "Output আগে অনুমান করুন। `setTimeout(…, 0)` এর callback কোথায় বসবে? এবং callback এ error হলে বাইরের `try/catch` ধরতে পারে কি না, তাও দেখুন।",
      code: `console.log("1: start");

setTimeout(() => console.log("5: timeout callback"), 0);

[1, 2].forEach((n) => console.log("2/3: forEach callback", n));

// sync callback এর error বাইরের try/catch ধরে
try {
  [1].forEach(() => { throw new Error("sync boom"); });
} catch (e) {
  console.log("4: caught outside:", e.message);
}

// async callback এর error ধরার জায়গা callback এর ভেতরেই
setTimeout(() => {
  try {
    throw new Error("async boom");
  } catch (e) {
    console.log("6: caught inside callback:", e.message);
  }
}, 0);`,
    },
    {
      level: "real-world",
      title: "Error-first API ও callback pyramid থেকে নামিয়ে আনা",
      description: "Simulated user/order service (সত্যিকারের network ছাড়া)। প্রথমে nested callback, তারপর named function দিয়ে সমান্তরাল (flat) করা। এখানে Promise ব্যবহার করা হয়নি — তা Module 05 এ।",
      code: `function getUser(id, cb) {
  setTimeout(() => {
    if (id <= 0) { cb(new Error("invalid id")); return; }
    cb(null, { id: id, name: "User" + id });
  }, 0);
}

function getOrders(user, cb) {
  setTimeout(() => {
    cb(null, ["order-" + user.id + "-a", "order-" + user.id + "-b"]);
  }, 0);
}

// ১) nested style — ধাপ বাড়লে ডান দিকে সরতে থাকে
function nested(id, done) {
  getUser(id, (err, user) => {
    if (err) { done(err); return; }
    getOrders(user, (err2, orders) => {
      if (err2) { done(err2); return; }
      done(null, { user: user.name, orders: orders });
    });
  });
}

// ২) named function দিয়ে flat: প্রতিটি ধাপের নাম আছে, nesting নেই
function flat(id, done) {
  function onUser(err, user) {
    if (err) { done(err); return; }
    getOrders(user, onOrders.bind(null, user));
  }
  function onOrders(user, err, orders) {
    if (err) { done(err); return; }
    done(null, { user: user.name, orders: orders });
  }
  getUser(id, onUser);
}

nested(1, (err, result) => {
  console.log("nested:", err, result);
  flat(2, (err2, result2) => {
    console.log("flat:", err2, result2);
    flat(0, (err3) => {
      console.log("error path:", err3.message);
    });
  });
});`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
function twice(fn) {
  fn();
  fn();
}
twice(() => console.log("hi"));
`,
    },
    {
      label: "function pass বনাম call: setTimeout এর ভুল",
      code: `function sayHi(name) {
  console.log("hi " + (name ?? "(no name)"));
  return undefined;
}

console.log("---- ভুল: sayHi() এখনই চলে, ফলাফল undefined ----");
const wrong = sayHi();             // এই লাইনেই চলে গেল
console.log("callback হিসেবে যেত:", typeof wrong);

console.log("---- ঠিক ----");
setTimeout(sayHi, 0, "Rina");
setTimeout(() => sayHi("Mim"), 0);
console.log("scheduled");`,
    },
    {
      label: "forEach কী কী argument পায়",
      code: `["a", "b", "c"].forEach(function (value, index, array) {
  console.log(index, value, array.length);
});

// extra parameter নিলে undefined; কম নিলে সমস্যা নেই
["x", "y"].forEach((value) => console.log(value));

// একটি নিজের lightweight forEach
function myForEach(arr, cb) {
  for (let i = 0; i < arr.length; i++) cb(arr[i], i, arr);
}
myForEach([5, 6], (v, i) => console.log("my", i, v));`,
    },
    {
      label: "this হারানো ও ঠিক করা",
      code: `class Counter {
  count = 0;
  increment() {
    this.count += 1;
    return this.count;
  }
}

function runLater(cb) {
  return cb();   // callback টি নিজের object ছাড়াই call হচ্ছে
}

const c = new Counter();
try {
  runLater(c.increment);          // this = undefined (class body strict)
} catch (e) {
  console.log("detached:", e.name);
}

console.log("arrow:", runLater(() => c.increment()));
console.log("bind:", runLater(c.increment.bind(c)));
console.log("count:", c.count);`,
    },
  ],

  debugging: [
    {
      title: "setTimeout এ function pass না করে call করা",
      bad: `function notify() {
  console.log("notified");
}
// ইচ্ছা: 'scheduled' এর পরে notify চলবে
setTimeout(notify(), 0);
console.log("scheduled");`,
      why: "`notify()` বন্ধনীসহ লেখায় function টি **এই মুহূর্তেই** চলে যায় (তাই `notified` আগে ছাপা হয়) এবং `setTimeout` এর কাছে যায় `notify()` এর return value, অর্থাৎ `undefined`। কোনো function schedule হয় না। Callback এর জায়গায় function এর **নাম** (reference) পাঠাতে হয়, অথবা argument লাগলে wrapper arrow function।",
      fix: `function notify() {
  console.log("notified");
}
setTimeout(notify, 0);
console.log("scheduled");`,
    },
    {
      title: "Error handle করেও success path চলে যাচ্ছে (return ভুলে যাওয়া)",
      bad: `function load(ok, cb) {
  setTimeout(() => {
    if (!ok) {
      cb(new Error("load failed"));
      // return নেই!
    }
    cb(null, "data");
  }, 0);
}

load(false, (err, data) => {
  if (err) { console.log("error:", err.message); return; }
  console.log("success:", data);
});`,
      why: "Error path এ `cb(err)` ডাকার পরেও `return` না থাকায় কোড নিচে নেমে `cb(null, \"data\")` ও ডাকে — callback **দুইবার** চলে: একবার error, একবার success। Inversion of control এর কারণে এমন bug ভয়ংকর: UI দুইবার update হয়, অর্ডার দুইবার যায়। নিয়ম: প্রতিটি path এ ঠিক একবার callback ডাকুন এবং ডাকার পরেই `return`।",
      fix: `function load(ok, cb) {
  setTimeout(() => {
    if (!ok) {
      cb(new Error("load failed"));
      return;
    }
    cb(null, "data");
  }, 0);
}

load(false, (err, data) => {
  if (err) { console.log("error:", err.message); return; }
  console.log("success:", data);
});`,
    },
    {
      title: "Method কে callback করলে this হারিয়ে যায়",
      bad: `class Counter {
  count = 0;
  increment() {
    this.count += 1;
    return this.count;
  }
}

function runLater(cb) {
  return cb();
}

const c = new Counter();
try {
  console.log(runLater(c.increment));
} catch (e) {
  console.log("failed:", e.name);
}`,
      why: "`c.increment` লিখে শুধু function টি তুলে নেওয়া হয়েছে, `c` এর সাথে সম্পর্ক ছিন্ন হয়েছে। `runLater` এর ভেতরে `cb()` একটি সাধারণ call, তাই `this` হয় `undefined` (class এর ভেতরের কোড সবসময় strict) এবং `this.count` এ `TypeError` হয়। সমাধান: arrow wrapper `() => c.increment()` অথবা `c.increment.bind(c)`। (React class component এ `this.handleClick = this.handleClick.bind(this)` একই কারণে লাগত।)",
      fix: `class Counter {
  count = 0;
  increment() {
    this.count += 1;
    return this.count;
  }
}

function runLater(cb) {
  return cb();
}

const c = new Counter();
console.log(runLater(() => c.increment()));
console.log(runLater(c.increment.bind(c)));`,
    },
    {
      title: "Async callback এর error বাইরের try/catch ধরে না",
      bad: `try {
  setTimeout(() => {
    throw new Error("inside timer");
  }, 0);
} catch (e) {
  console.log("caught:", e.message);
}
console.log("end of script");`,
      why: "`try/catch` শুধু সেই মুহূর্তে call stack এ থাকা কোডের error ধরে। `setTimeout` শুধু callback নথিভুক্ত করে return করে — `try` ব্লক তখনই শেষ। পরে callback চলার সময় stack আলাদা, সেখানে ওই `try` আর নেই, তাই error uncaught হয়ে যায় (browser এ console error, Node.js এ সাধারণত process crash)। সমাধান: callback এর **ভেতরে** try/catch, অথবা error-first convention।",
      fix: `setTimeout(() => {
  try {
    throw new Error("inside timer");
  } catch (e) {
    console.log("caught:", e.message);
  }
}, 0);
console.log("end of script");`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "নিজের `repeat(n, cb)` লিখুন",
      prompt: "`repeat(n, cb)` function টি লিখুন যা `0` থেকে `n - 1` পর্যন্ত প্রতিটি index দিয়ে `cb(i)` ডাকে। নিচের call এ তিনটি লাইন print হতে হবে।",
      starter: `function repeat(n, cb) {
  // TODO: 0 থেকে n-1 পর্যন্ত cb(i) ডাকুন
}

repeat(3, (i) => console.log("step", i));`,
      expected: "step 0\nstep 1\nstep 2",
      hints: ["একটি সাধারণ `for` loop চালান।", "Loop এর ভেতরে `cb(i)` — অর্থাৎ callback কে ডাকা হচ্ছে, আপনার বানানো function এ নয়।"],
      solution: `function repeat(n, cb) {
  for (let i = 0; i < n; i++) {
    cb(i);
  }
}

repeat(3, (i) => console.log("step", i));`,
      explanation: "Callback এর মূল কথা: host function (এখানে `repeat`) কখন ও কী argument দিয়ে callback ডাকবে — সেটাই তার চুক্তি।",
    },
    {
      level: "beginner",
      title: "setTimeout এর ভুল ঠিক করুন",
      prompt: "নিচের কোডে `Rina` এর greeting `scheduled` এর **আগে** ছাপা হচ্ছে। শুধু `setTimeout` লাইনটি বদলে এমন করুন যেন `scheduled` প্রথমে, তারপর `hi Rina` ছাপা হয়।",
      starter: `function sayHi(name) {
  console.log("hi " + name);
}

setTimeout(sayHi("Rina"), 0);
console.log("scheduled");`,
      expected: "scheduled\nhi Rina",
      hints: ["`sayHi(\"Rina\")` এখনই call করে।", "Argument লাগলে wrapper arrow function: `() => ...`।"],
      solution: `function sayHi(name) {
  console.log("hi " + name);
}

setTimeout(() => sayHi("Rina"), 0);
console.log("scheduled");`,
      explanation: "Callback এর জায়গায় call নয়, function value পাঠাতে হয়। Argument দরকার হলে একটি wrapper function এর ভেতরে call করুন।",
    },
    {
      level: "beginner",
      title: "Comparator callback দিয়ে সংখ্যা সাজান",
      prompt: "`nums` কে সংখ্যা হিসেবে ছোট থেকে বড় সাজান (in-place) এবং print করুন। মনে রাখুন default `sort()` element গুলোকে string ধরে তুলনা করে।",
      starter: `const nums = [10, 9, 100, 1];
nums.sort();
console.log(nums);`,
      expected: "[ 1, 9, 10, 100 ]",
      hints: ["`sort` এ comparator callback দিন যা দুটি সংখ্যা `a`, `b` নেয়।", "ঋণাত্মক সংখ্যা return করলে `a` আগে বসে; `a - b` ছোট থেকে বড় দেয়।"],
      solution: `const nums = [10, 9, 100, 1];
nums.sort((a, b) => a - b);
console.log(nums);`,
      explanation: "Default `sort()` তে `[10, 9, 100, 1]` string order এ হয় `[1, 10, 100, 9]`। Comparator callback দিয়ে ‘কোনটি আগে’ সিদ্ধান্ত আপনি নেন।",
    },
    {
      level: "intermediate",
      title: "Error-first callback লিখুন: `parseJSONCb`",
      prompt: "`parseJSONCb(text, cb)` লিখুন: `JSON.parse` সফল হলে `cb(null, value)`, ব্যর্থ হলে `cb(error)` ডাকবে। ব্যবহার অংশে `ok` ও `failed` ছাপানো আছে। মনে রাখুন callback যেন **ঠিক একবার** ডাকা হয়, এবং `cb` এর নিজের error যেন `catch` এ আটকা না পড়ে।",
      starter: `function parseJSONCb(text, cb) {
  // TODO
}

function report(text) {
  parseJSONCb(text, (err, value) => {
    if (err) { console.log("failed", err.name); return; }
    console.log("ok", value);
  });
}

report('{"a":1}');
report("oops");`,
      expected: "ok { a: 1 }\nfailed SyntaxError",
      hints: ["`try { value = JSON.parse(text) } catch (err) { cb(err); return; }`", "`cb` কে `try` এর বাইরে ডাকুন — না হলে callback এর নিজের throw ও আপনার `catch` এ ঢুকে callback দুইবার চলতে পারে।"],
      solution: `function parseJSONCb(text, cb) {
  let value;
  try {
    value = JSON.parse(text);
  } catch (err) {
    cb(err);
    return;
  }
  cb(null, value);
}

function report(text) {
  parseJSONCb(text, (err, value) => {
    if (err) { console.log("failed", err.name); return; }
    console.log("ok", value);
  });
}

report('{"a":1}');
report("oops");`,
      explanation: "`cb(null, value)` কে `try` ব্লকের ভেতরে রাখলে callback এর নিজের throw `catch` এ গিয়ে আবার `cb(err)` ডাকত — অর্থাৎ ‘double callback’। তাই শুধু যা throw করতে পারে (`JSON.parse`) সেটিকেই `try` এ রাখা হয়েছে।",
    },
    {
      level: "intermediate",
      title: "ছোট Event Emitter: callback নিবন্ধন ও সরানো",
      prompt: "`on(event, handler)` handler নিবন্ধন করবে এবং একটি **unsubscribe function** return করবে; `emit(event, payload)` ওই event এর সব handler কে payload দিয়ে ডাকবে। নিচের usage এ `A got hello` ও `B got hello` ছাপার পরে A কে সরিয়ে দিলে দ্বিতীয় emit এ শুধু B ছাপাবে।",
      starter: `function createEmitter() {
  const handlers = {};
  return {
    on(event, handler) {
      // TODO: handler নিবন্ধন করুন, unsubscribe function return করুন
    },
    emit(event, payload) {
      // TODO
    },
  };
}

const bus = createEmitter();
const offA = bus.on("msg", (p) => console.log("A got", p));
bus.on("msg", (p) => console.log("B got", p));

bus.emit("msg", "hello");
offA();
bus.emit("msg", "again");`,
      expected: "A got hello\nB got hello\nB got again",
      hints: ["`handlers[event] ??= []` দিয়ে array তৈরি করুন।", "Unsubscribe হলো একটি function যা array থেকে handler টি `filter` করে বাদ দেয়।"],
      solution: `function createEmitter() {
  const handlers = {};
  return {
    on(event, handler) {
      handlers[event] ??= [];
      handlers[event].push(handler);
      return () => {
        handlers[event] = handlers[event].filter((h) => h !== handler);
      };
    },
    emit(event, payload) {
      for (const h of handlers[event] ?? []) h(payload);
    },
  };
}

const bus = createEmitter();
const offA = bus.on("msg", (p) => console.log("A got", p));
bus.on("msg", (p) => console.log("B got", p));

bus.emit("msg", "hello");
offA();
bus.emit("msg", "again");`,
      explanation: "এটাই `addEventListener`/`removeEventListener` এবং React এ `useEffect` এর cleanup function এর মূল ধারণা: subscribe করলে unsubscribe এর উপায় ফেরত দাও। Handler গুলো closure হিসেবে `handlers` কে মনে রাখে।",
    },
    {
      level: "challenge",
      title: "`series`: error-first task গুলো পরপর চালান",
      prompt: "`series(tasks, done)` লিখুন। প্রতিটি task একটি function `(cb) => ...` যা পরে `cb(err, value)` ডাকে। Task গুলো **একটির পর একটি** চলবে। সব সফল হলে `done(null, results)` (results = প্রতিটি value এর array)। কোনো task ব্যর্থ হলে **সাথে সাথে** `done(err)` ডাকবে এবং পরের task চালাবে না।",
      starter: `function series(tasks, done) {
  // TODO
}

const ok = (v) => (cb) => setTimeout(() => cb(null, v), 0);
const fail = (msg) => (cb) => setTimeout(() => cb(new Error(msg)), 0);
const never = (cb) => { console.log("should not run"); cb(null, "x"); };

series([ok(1), ok(2), ok(3)], (err, results) => {
  console.log("run 1:", err, results);
  series([ok("a"), fail("boom"), never], (err2, results2) => {
    console.log("run 2:", err2.message, results2);
  });
});`,
      expected: "run 1: null [ 1, 2, 3 ]\nrun 2: boom undefined",
      hints: ["একটি `results` array ও `index` রাখুন; `next()` নামে একটি helper function বানান।", "Task এর callback এ: `err` থাকলে `done(err)` ও `return`; নইলে `results.push(value)` করে `next()`।", "সব task শেষ হলে (`index === tasks.length`) `done(null, results)`।"],
      solution: `function series(tasks, done) {
  const results = [];
  let index = 0;
  function next() {
    if (index === tasks.length) {
      done(null, results);
      return;
    }
    const task = tasks[index++];
    task((err, value) => {
      if (err) {
        done(err);
        return;
      }
      results.push(value);
      next();
    });
  }
  next();
}

const ok = (v) => (cb) => setTimeout(() => cb(null, v), 0);
const fail = (msg) => (cb) => setTimeout(() => cb(new Error(msg)), 0);
const never = (cb) => { console.log("should not run"); cb(null, "x"); };

series([ok(1), ok(2), ok(3)], (err, results) => {
  console.log("run 1:", err, results);
  series([ok("a"), fail("boom"), never], (err2, results2) => {
    console.log("run 2:", err2.message, results2);
  });
});`,
      explanation: "`next` নিজেকে নিজের callback এর ভেতর থেকে ডাকে — এভাবে callback এর পিরামিড ছাড়াই ধারাবাহিক async কাজ চালানো যায় (এই কৌশলই `async` library এর `series` এর মূল)। Promise/`async`-`await` এ একই কাজ একটি `for` loop এ হয় — সেটাই Module 05 এ দেখব।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "নিচের কোডের output ক্রম কী? `console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); console.log(\"C\");`",
        options: ["A, B, C", "B, A, C", "C, A, B", "A, C, B"],
        answer: 3,
        explanation: "সঠিক: **A, C, B**। `setTimeout` এর callback টি event loop এর queue তে যায় এবং current synchronous কোড (`C` সহ) শেষ হওয়ার পরে চলে — delay `0` হলেও। A, B, C ভুল কারণ এতে ধরে নেওয়া হয়েছে `0` মানে এখনই। বাকি দুটি ক্রম কোডের লেখার ক্রমের সাথেই মেলে না।",
      },
      {
        question: "`setTimeout(logMessage(), 1000)` এ কী হয় (`logMessage` কিছু return করে না)?",
        options: [
          "১ সেকেন্ড পরে `logMessage` চলে",
          "`logMessage` এখনই চলে এবং `setTimeout` এ `undefined` যায়",
          "`logMessage` কখনো চলে না, কিন্তু কোনো effect ও নেই",
          "Syntax error হয়",
        ],
        answer: 1,
        explanation: "সঠিক: বন্ধনী থাকায় `logMessage()` তাৎক্ষণিক call হয়, এর return value (`undefined`) `setTimeout` এর callback parameter এ যায়। প্রথম উত্তর ভুল কারণ schedule হয়েছে `undefined`, function নয়। তৃতীয়টি ভুল কারণ function ঠিকই একবার চলেছে। Syntax error হয় না, এটি বৈধ expression।",
      },
      {
        question: "`[1, 2, 3].forEach(cb)` সম্পর্কে কোনটি সত্য?",
        options: [
          "`cb` asynchronous চলে, কারণ এটি callback",
          "`forEach` শেষ হওয়ার পরে `cb` গুলো queue থেকে চলে",
          "`cb` গুলো `forEach` return করার আগেই synchronous ভাবে চলে এবং এর `throw` বাইরের `try/catch` ধরে",
          "`cb` এ শুধু element পাঠানো হয়, index নয়",
        ],
        answer: 2,
        explanation: "সঠিক: Array method এর callback synchronous — একই call stack এ চলে, তাই বাইরের `try/catch` সেটির error ধরে। প্রথম দুটি ধরে নেয় callback মানেই async — ভুল ধারণা। শেষটি ভুল কারণ `forEach` তিনটি argument দেয়: element, index, array।",
      },
      {
        question: "Node.js এর error-first callback convention এ কোনটি সঠিক?",
        options: [
          "Success এ প্রথম argument `null`/`undefined`, error হলে প্রথম argument এ error object",
          "Callback এর শেষ parameter হলো error",
          "Error হলে callback ডাকা হয় না, `throw` করা হয়",
          "Callback দুইবার ডাকা বাঞ্ছনীয়: একবার error, একবার result",
        ],
        answer: 0,
        explanation: "সঠিক: প্রথম parameter error; সফল হলে `null`, ব্যর্থ হলে error object। শেষ parameter বলা ভুল — সেখানে সাধারণত result থাকে। Async কাজে `throw` কাজ করে না কারণ stack আলাদা। দুইবার ডাকা একটি bug।",
      },
      {
        question: "`const handler = counter.increment; setTimeout(handler, 0);` এ `this.count` কেন ভেঙে যেতে পারে?",
        options: [
          "কারণ `setTimeout` এ method পাঠানো নিষিদ্ধ",
          "কারণ `this` নির্ধারিত হয় call এর সময়ে, এবং আলাদা করে ডাকলে `counter` এর সাথে সম্পর্ক থাকে না",
          "কারণ arrow function ছাড়া `this` কখনো কাজ করে না",
          "কারণ `setTimeout` সবসময় `this` কে `counter` এর কপি করে",
        ],
        answer: 1,
        explanation: "সঠিক: `this` নির্ধারিত হয় function **কীভাবে call হলো** তা দেখে। `handler()` এ কোনো ‘object.’ নেই, তাই `this` হারিয়ে যায় (`undefined` বা global)। Method পাঠানো নিষিদ্ধ নয়; arrow ছাড়াও `this` কাজ করে (`bind` বা সরাসরি method call এ); আর `setTimeout` কোনো কপি করে না।",
      },
    ],
    coding: [
      {
        title: "`filterWith(arr, predicate)` লিখুন",
        prompt: "Array এর যে element গুলোর জন্য callback (`predicate(element, index)`) truthy value দেয় শুধু সেগুলো নিয়ে নতুন array return করুন। মূল array বদলাবেন না, built-in `filter` ব্যবহার করবেন না।",
        starter: `function filterWith(arr, predicate) {
  // TODO
}

console.log(filterWith([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0));
console.log(filterWith(["a", "bb", "ccc"], (s, i) => i > 0));`,
        expected: "[ 2, 4, 6 ]\n[ 'bb', 'ccc' ]",
        solution: `function filterWith(arr, predicate) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) {
      result.push(arr[i]);
    }
  }
  return result;
}

console.log(filterWith([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0));
console.log(filterWith(["a", "bb", "ccc"], (s, i) => i > 0));`,
      },
      {
        title: "`retry(task, times, done)`: ব্যর্থ হলে আবার চেষ্টা",
        prompt: "`task` হলো error-first function `(cb) => ...`। `retry` সর্বোচ্চ `times` বার `task` চালাবে; কোনো এক বার সফল হলে `done(null, value)`, সব চেষ্টা ব্যর্থ হলে শেষ error দিয়ে `done(err)`। নিচের `flaky` প্রথম ২ বার ব্যর্থ হয়, তৃতীয় বারে সফল।",
        starter: `function retry(task, times, done) {
  // TODO
}

let calls = 0;
function flaky(cb) {
  calls++;
  setTimeout(() => {
    if (calls < 3) cb(new Error("attempt " + calls + " failed"));
    else cb(null, "ok after " + calls);
  }, 0);
}

retry(flaky, 5, (err, value) => {
  console.log(err, value);
  calls = 0;
  retry(flaky, 2, (err2, value2) => {
    console.log(err2.message, value2);
  });
});`,
        expected: "null ok after 3\nattempt 2 failed undefined",
        solution: `function retry(task, times, done) {
  task((err, value) => {
    if (!err) {
      done(null, value);
      return;
    }
    if (times <= 1) {
      done(err);
      return;
    }
    retry(task, times - 1, done);
  });
}

let calls = 0;
function flaky(cb) {
  calls++;
  setTimeout(() => {
    if (calls < 3) cb(new Error("attempt " + calls + " failed"));
    else cb(null, "ok after " + calls);
  }, 0);
}

retry(flaky, 5, (err, value) => {
  console.log(err, value);
  calls = 0;
  retry(flaky, 2, (err2, value2) => {
    console.log(err2.message, value2);
  });
});`,
      },
    ],
  },

  interview: [
    {
      q: "Callback function কী? Synchronous ও asynchronous callback এর পার্থক্য উদাহরণসহ বলুন।",
      a: "Callback হলো এমন function যা অন্য function এ argument হিসেবে পাঠানো হয় এবং সেই function (বা runtime) পরে সেটিকে call করে। JavaScript এ function first-class value বলেই এটি সম্ভব।\n\nSynchronous callback host function শেষ হওয়ার আগেই একই call stack এ চলে — যেমন `[1,2].forEach(cb)`, `arr.sort(comparator)`। Asynchronous callback host function return করার পরে, call stack খালি হলে event loop এর মাধ্যমে চলে — যেমন `setTimeout(cb, 0)` বা event listener।\n\nবাস্তব পার্থক্য: sync callback এর error বাইরের `try/catch` ধরে, async এর ধরে না; sync callback এর order কোড দেখেই বোঝা যায়, async এর order event loop এর নিয়মে হয়। Callback নিজে sync বা async নয় — নির্ভর করে কে ডাকছে তার ওপর।",
    },
    {
      q: "`setTimeout(fn, 0)` এর callback কি সাথে সাথে চলে? Output order কীভাবে নির্ধারিত হয়?",
      a: "না। `setTimeout` শুধু timer টি runtime (browser/Node.js) এ নিবন্ধন করে এবং সাথে সাথে return করে। Timer শেষ হলে callback টি task queue তে দাঁড়ায়, আর event loop সেটি তখনই call stack এ তোলে যখন stack **সম্পূর্ণ খালি**। অর্থাৎ বর্তমান script এর সব synchronous কোড শেষ হওয়ার পরেই।\n\nতাই `console.log(1); setTimeout(() => console.log(2), 0); console.log(3);` এর output `1, 3, 2`। Delay `0` মানে ‘ন্যূনতম ০ ms’, ‘এখনই’ নয়; বাস্তবে runtime ভেদে একটি ন্যূনতম delay (সাধারণত ~১ ms বা নেস্টেড হলে আরও বেশি) থাকতে পারে। Promise এর microtask আবার timer callback এর আগে চলে — সেটি Module 05 এ দেখব।",
    },
    {
      q: "Inversion of control কী? Callback এর ক্ষেত্রে এটি কেন সমস্যা?",
      a: "Callback দেওয়ার মানে আপনার কোডের কখন, কতবার, কোন argument দিয়ে চলবে — সেই নিয়ন্ত্রণ আপনি অন্য function/library কে দিয়ে দিচ্ছেন। সেই code টি আপনার callback কে দুইবার ডাকতে পারে, একবারও না ডাকতে পারে, খুব আগে বা পরে ডাকতে পারে, অথবা error গিলে ফেলতে পারে। Third-party code (analytics, payment SDK) তে এটি ঝুঁকিপূর্ণ।\n\nপ্রতিরক্ষা: callback API ডিজাইন করলে প্রতিটি path এ ঠিক একবার ডাকুন, sync/async কখনো মেশাবেন না, error-first convention মানুন। Promise এই সমস্যার একটি বড় অংশ কমায়, কারণ promise একবারই settle হয় এবং handler গুলো সবসময় asynchronous ভাবে চলে। তবুও callback বোঝা জরুরি কারণ event handler ও array method এ এটি প্রতিদিনের ব্যাপার।",
    },
    {
      q: "Error-first callback কী? কেন Node.js এ এই convention তৈরি হলো?",
      a: "Async কাজ শুরু করার সময় error ছুড়লে (`throw`) তা ধরার কেউ থাকে না, কারণ callback চলার সময় আসল call stack ইতিমধ্যে ফুরিয়ে গেছে এবং বাইরের `try/catch` আর নেই। তাই Node.js এ ঠিক হলো: callback এর **প্রথম parameter** হবে `err` (সফল হলে `null`/`undefined`), বাকি parameter গুলো result। যেমন `fs.readFile(path, (err, data) => {...})`।\n\nএর সুবিধা: সব API তে একই আকার, তাই tooling ও helper (যেমন `util.promisify`) সহজ। সতর্কতা: `if (err) { handle; return; }` এ `return` ভুলে গেলে success path ও চলে; আর error callback এ এসে পড়লে সেটিকে অবশ্যই handle করতে হয়, না হলে নীরবে হারিয়ে যায়। আজ নতুন API সাধারণত Promise return করে, কিন্তু পুরোনো কোড ও অনেক library এখনো এই convention এ আছে।",
    },
    {
      q: "Callback hell কেন সমস্যা, এবং সমাধান কী কী?",
      a: "Callback hell হলো একটি async ফলের ওপর নির্ভর করে পরের async কাজ — এভাবে callback এর ভেতরে callback বাড়তে বাড়তে কোড ডান দিকে সরে যাওয়া। সমস্যা শুধু দৃষ্টিকটু নয়: প্রতি স্তরে আলাদা error handling লাগে, scope জটিল হয়, parallel/retry/timeout এর মতো লজিক লেখা কঠিন, এবং execution order কোড পড়ে বোঝা যায় না।\n\nছোট পরিসরে সমাধান: callback গুলোকে নাম দিয়ে আলাদা top-level function এ ভাগ করা, early `return`, বা `series`/`parallel` এর মতো helper। কিন্তু মূল সমাধান Promise ও `async`/`await` — ধাপ সোজা লাইনে লেখা যায়, একটি জায়গায় (`catch`/`try-catch`) error ধরা যায়, আর `Promise.all` দিয়ে parallel কাজ সহজ হয়। এটি Module 05 এর বিষয়।",
    },
    {
      q: "Method কে callback হিসেবে পাঠালে `this` হারায় কেন, এবং কীভাবে ঠিক করবেন?",
      a: "JavaScript এ (arrow function ছাড়া) `this` function কোথায় লেখা হয়েছে তা দেখে ঠিক হয় না, ঠিক হয় **call এর সময় কীভাবে call হলো** তা দেখে। `obj.method()` তে `this` হলো `obj`। কিন্তু `const f = obj.method; f()` বা `setTimeout(obj.method, 0)` এ call এ কোনো ‘obj.’ নেই, তাই `this` হয় `undefined` (strict mode/class body) অথবা global object (sloppy mode)।\n\nসমাধান: (১) arrow wrapper — `setTimeout(() => obj.method(), 0)`; (২) `obj.method.bind(obj)`; (৩) class field এ arrow function (`method = () => {...}`), যদিও এতে প্রতি instance এ আলাদা function তৈরি হয়। React class component এর `this.handleClick = this.handleClick.bind(this)` ঠিক এই কারণেই লাগত। এটি `this` lesson এ আরও বিস্তারিত দেখব।",
    },
    {
      q: "`array.forEach` এর callback এ `async` function দিলে কী ঘটে এবং কী করা উচিত?",
      a: "`forEach` callback এর return value উপেক্ষা করে। `async` function সবসময় Promise return করে, কিন্তু `forEach` সেটির জন্য **অপেক্ষা করে না** — সব callback প্রায় একসাথে শুরু হয় এবং `forEach` সাথে সাথে শেষ হয়ে যায়, ফলে ‘সব শেষ হওয়ার পরে’ কিছু করতে চাইলে তা আগেই চলে যায়, আর error ও unhandled থেকে যেতে পারে।\n\nসঠিক উপায় নির্ভর করে উদ্দেশ্যের ওপর: ধারাবাহিকভাবে চালাতে `for...of` loop এর ভেতরে `await`; একসাথে চালাতে `Promise.all(arr.map(async ...))`। এটি async module এ বিস্তারিত আসবে, কিন্তু এখনই মনে রাখুন — `forEach` এর callback এর return value এর কোনো মূল্য নেই এবং সে কখনো অপেক্ষা করে না।",
    },
  ],

  summary: {
    takeaways: [
      "Callback হলো argument হিসেবে পাঠানো function যা host function (বা runtime) পরে ডাকে; JavaScript এ function first-class value বলেই এটি সম্ভব।",
      "Callback sync বা async নয় — নির্ভর করে কে ডাকছে। `forEach`/`sort` এর callback sync (একই call stack, বাইরের `try/catch` ধরে); `setTimeout`/event এর callback async (stack খালি হলে event loop থেকে)।",
      "`setTimeout(fn(), 0)` এর মতো ‘call করে ফেলা’ সবচেয়ে সাধারণ bug — function এর নাম বা wrapper arrow pass করুন।",
      "Inversion of control এর কারণে প্রতিটি path এ **ঠিক একবার** callback ডাকুন; error-first convention এ `if (err) { ...; return; }` মনে রাখুন।",
      "Callback hell (nesting) এর কারণেই Promise ও `async`/`await` এসেছে; নামযুক্ত function ও helper (`series`) দিয়ে সাময়িকভাবে flat করা যায়।",
      "Method কে আলাদা করে callback দিলে `this` হারায় — arrow wrapper বা `bind` ব্যবহার করুন।",
    ],
    syntax: `// callback pass করা (call নয়!)
setTimeout(handler, 1000);
setTimeout(() => handler(arg), 1000);

// error-first convention
function work(input, cb) {
  // ... cb(err)  অথবা  cb(null, result)
}
work(x, (err, result) => {
  if (err) { /* handle */ return; }
  /* use result */
});`,
    whenToUse: [
      "Event handler, array method (`map`/`filter`/`sort`) এবং library hook এর মতো ‘আচরণ parameterize’ করার জায়গায় callback স্বাভাবিক ও যথেষ্ট।",
      "ধারাবাহিক বা জটিল async কাজ (একাধিক ধাপ, parallel, retry) এর ক্ষেত্রে callback এড়িয়ে Promise/`async`-`await` ব্যবহার করুন।",
      "পুরোনো Node.js API বা third-party কোড যেখানে error-first callback আছে সেখানে convention মেনে চলুন।",
    ],
    next: [
      "Higher-Order Functions — যে function callback নেয় বা function return করে, তার পূর্ণ ছবি।",
      "Pure Functions — callback এ side effect ঢোকালে কী সমস্যা হয়।",
      "`this` keyword — callback এ `this` কেন হারায় তার পূর্ণ নিয়ম।",
      "Promises ও async/await (Module 05) — callback এর সীমাবদ্ধতার আধুনিক সমাধান।",
    ],
  },

  compatibility:
    "Callback ধারণা ও array method (`forEach`, `sort` ইত্যাদি) সব browser ও Node.js এ একই। `setTimeout`/`setInterval` দুই জায়গাতেই আছে (ECMAScript নয়, host environment এর API); Node.js এ এটি একটি `Timeout` object return করে, browser এ number। `setTimeout` এর extra argument (`setTimeout(fn, ms, a, b)`) আধুনিক সব runtime এ চলে। Error-first callback হলো Node.js এর convention; browser API (যেমন `addEventListener`) সাধারণত event object নেয়, error-first নয়। `addEventListener`/DOM event শুধু browser এ — Node.js এ নেই (Node এর নিজস্ব `EventEmitter` আছে)।",
};
