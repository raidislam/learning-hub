import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "`function name() {}` declaration এর syntax এবং engine কীভাবে নাম ও body সহ **পুরো function** আগেই তৈরি করে রাখে (full hoisting) — তা ব্যাখ্যা করতে পারবেন।",
    "`var` / `let` / `const` এর hoisting এর সাথে function declaration এর hoisting এর পার্থক্য ধরতে পারবেন।",
    "Function যে একটি **object** (`name`, `length` আছে) এবং **first-class value** — এটি বুঝে কোডে কাজে লাগাতে পারবেন।",
    "প্রতিটি function call এ **call stack** এ একটি করে frame তৈরি ও ধ্বংস হওয়ার প্রক্রিয়া চোখের সামনে কল্পনা করতে পারবেন।",
    "`return` না থাকলে কী ফেরত আসে, এবং `return` এর পরে নতুন লাইনে লিখলে কী ভুল হয় — তা চিনতে পারবেন।",
    "কখন function declaration বেছে নেবেন আর কখন নয় — সেই সিদ্ধান্ত নিতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Function declaration কী?" },
    {
      type: "p",
      text: "Function হলো একটি **নামযুক্ত, পুনর্ব্যবহারযোগ্য কোডের টুকরো**, যাকে আপনি পরে যতবার খুশি `name()` লিখে চালাতে (call করতে) পারেন। JavaScript এ function তৈরির একাধিক উপায় আছে — declaration, expression, arrow function, method shorthand ইত্যাদি। এই lesson এ আমরা সবচেয়ে মৌলিক রূপটি দেখব, যাকে বলে **function declaration** (বা function statement)।",
    },
    {
      type: "code",
      code: `function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5`,
      caption: "Function declaration: `function` keyword + নাম + parameter list + body। এটি runnable নয়, শুধু syntax দেখানোর জন্য।",
    },
    {
      type: "p",
      text: "এখানে `add` একটি **নাম** (identifier), `(a, b)` হলো **parameter list**, আর `{ ... }` হলো **function body**। Declaration একটি **statement** — তাই এটি কোনো expression এর অংশ হতে পারে না (যেমন `1 + function f() {}` লিখলে সেটি আর declaration থাকে না, expression হয়ে যায় — সেটি পরের lesson এর বিষয়)। Parameter ও argument এর গভীর আলোচনা (default value, rest, destructuring) আলাদা lesson এ আছে; এখানে শুধু মৌলিকটুকু ব্যবহার করব।",
    },
    { type: "h3", text: "Declaration আসলে কী তৈরি করে?" },
    {
      type: "p",
      text: "`function add() {}` লিখলে দুটি কাজ হয়: (১) একটি **function object** তৈরি হয় (যার ভেতরে body এর কোড ও আশেপাশের scope এর reference থাকে), এবং (২) বর্তমান scope এ `add` নামের একটি **binding** তৈরি হয় যা ওই object টিকে ধরে রাখে। অর্থাৎ নাম হলো শুধু একটি variable-এর মতো binding, আর function নিজে হলো মান (value)।",
    },
    { type: "h3", text: "Full hoisting: নাম এবং body দুটোই আগে থেকে তৈরি" },
    {
      type: "p",
      text: "Variables lesson এ আমরা দেখেছি — `var` hoist হয়ে `undefined` পায়, আর `let`/`const` hoist হয়ে TDZ তে থাকে। Function declaration এর ক্ষেত্রে ব্যাপারটি **আরও এগিয়ে**। Scope এ ঢোকার creation phase এ engine শুধু নামটি নথিভুক্ত করে না, **function object টিও তৈরি করে নামের সাথে bind করে দেয়**। ফলে declaration লাইনের **আগের লাইন থেকেই** আপনি function টি call করতে পারবেন।",
    },
    {
      type: "compare",
      headers: ["Declaration", "Scope এ ঢোকার সময় কী হয়", "Declaration লাইনের আগে ব্যবহার"],
      rows: [
        ["`function f() {}`", "নাম + function object দুটোই তৈরি ও initialized", "**কাজ করে** — call করা যায়"],
        ["`var f = function () {}`", "শুধু নাম তৈরি, মান `undefined`", "`f()` → **TypeError** (undefined কে call)"],
        ["`let f = function () {}`", "নাম আছে কিন্তু **TDZ** তে", "`f()` → **ReferenceError**"],
        ["`const f = () => {}`", "নাম আছে কিন্তু **TDZ** তে", "`f()` → **ReferenceError**"],
      ],
    },
    {
      type: "p",
      text: "এই বৈশিষ্ট্যের একটি বাস্তব সুবিধা আছে: ফাইলের শুরুতে **মূল ঘটনাপ্রবাহ (high-level logic)** লিখে নিচে helper function গুলো রাখা যায়। পাঠক আগে ‘কী হচ্ছে’ পড়ে, পরে প্রয়োজনে ‘কীভাবে হচ্ছে’ দেখে। অনেক Node.js script ও utility ফাইলে এই ধাঁচ দেখা যায়।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Hoisting মানে কোড ‘উপরে সরে যাওয়া’ নয়",
      text: "‘Hoisting’ একটি বোঝার সুবিধার্থে ব্যবহৃত শব্দ — কোড আসলে কোথাও সরে না। স্পেক অনুযায়ী scope এ ঢোকার সময় engine ওই scope এর সব declaration খুঁজে binding তৈরি করে (function declaration এর ক্ষেত্রে সাথে সাথে function object ও বসিয়ে দেয়)। তারপর কোড লাইন ধরে চলে। তাই ‘উপরে সরে যায়’ কথাটি মোটামুটি ফল বোঝায়, কিন্তু প্রক্রিয়াটি নয়।",
    },
    { type: "h3", text: "Function একটি object এবং first-class value" },
    {
      type: "p",
      text: "JavaScript এ function একটি বিশেষ ধরনের **object**, যাকে call করা যায়। তাই এটি অন্য যেকোনো মানের মতো আচরণ করে — এটিকেই বলে **first-class function**। আপনি function কে variable এ রাখতে, array/object এ রাখতে, argument হিসেবে পাঠাতে এবং অন্য function থেকে `return` করতে পারেন। React এ `onClick={handleClick}` লিখলে আপনি function টিকে **call না করে মান হিসেবে পাঠাচ্ছেন** — এই ধারণার ওপরই দাঁড়িয়ে।",
    },
    {
      type: "ul",
      items: [
        "`fn.name` — function এর নাম (declaration এ লেখা নামটি)। `console.log` ও stack trace এ এটি দেখা যায়।",
        "`fn.length` — **কয়টি parameter** declare করা আছে (default value বা rest parameter শুরু হওয়ার আগ পর্যন্ত গোনা হয়)।",
        "`typeof fn` — `\"function\"` (এটি `typeof` এর একটি বিশেষ ফল; আসলে function ও object)।",
        "Function এর ওপর সাধারণ object এর মতো property বসানো যায় (যেমন `fn.calls = 0`) — তবে বাস্তবে এটি কদাচিৎ ভালো design।",
      ],
    },
    {
      type: "p",
      text: "খেয়াল করুন: `greet` এবং `greet()` সম্পূর্ণ আলাদা। `greet` মানে **function টি নিজেই** (মান), আর `greet()` মানে **function টি চালিয়ে তার return value নেওয়া**। এই দুটি গুলিয়ে ফেলা নতুনদের সবচেয়ে সাধারণ ভুলগুলোর একটি (নিচে Debugging এ আছে)।",
    },
    { type: "h3", text: "Return value: `return` না থাকলে `undefined`" },
    {
      type: "p",
      text: "প্রতিটি function call একটি মান ফেরত দেয়। `return expr;` থাকলে সেই মান, না থাকলে (বা শুধু `return;` লিখলে) **`undefined`**। তাই `function log() { console.log(1); }` এর call এর ফলও `undefined`। আরেকটি সূক্ষ্ম ফাঁদ: `return` এর পর **নতুন লাইনে** মান লিখলে JavaScript এর automatic semicolon insertion (ASI) `return;` ধরে নেয় — ফল `undefined`। তাই return এর মান সবসময় `return` এর **একই লাইনে** শুরু করুন (বড় object হলে `return {` একই লাইনে খুলুন)।",
    },
    { type: "h3", text: "প্রতিটি call এর জন্য একটি call stack frame" },
    {
      type: "p",
      text: "Function call করলে engine **call stack** এ একটি নতুন **frame (execution context)** push করে। এই frame এ থাকে ওই call এর নিজস্ব parameter ও local variable (প্রতিটি call এর নিজস্ব Environment Record)। Function শেষ হলে (return বা throw) frame pop হয়ে যায়। Stack **LIFO** — শেষে ঢোকা frame আগে বের হয়। তাই একই function এর দুটি call এর local variable কখনো মিশে যায় না, এবং recursion সম্ভব হয়। Stack এর আকার সীমিত — অসীম recursion এ engine `RangeError` ছোড়ে (বার্তার ভাষা engine ভেদে আলাদা, তাই সেটির ওপর নির্ভর করবেন না)। Recursion আলাদা lesson এ।",
    },
    { type: "h3", text: "Block এর ভেতরে function declaration (সতর্কতা)" },
    {
      type: "p",
      text: "`if` বা `{ }` block এর ভেতরে function declaration লেখা যায়, কিন্তু আচরণ ঝামেলার। **Strict mode ও ES Module এ** এমন function সাধারণভাবে **block scoped** — `let` এর মতো, block এর বাইরে দেখা যায় না, এবং block এর শুরুতে hoist হয়। কিন্তু পুরোনো web এর সাথে সামঞ্জস্যের জন্য spec এর একটি পরিশিষ্ট (Annex B) **sloppy mode এ** browser এ বাড়তি আচরণ রাখে — block এর বাইরের function-scope এ একটি `var`-সদৃশ binding ও তৈরি হয়, যা declaration লাইন চলার পর মান পায়। এর ফলে একই কোড strict ও sloppy mode এ ভিন্ন ফল দিতে পারে। সহজ নিয়ম: **block এর ভেতরে declaration লিখবেন না** — দরকার হলে `const fn = () => {}` বা `const fn = function () {}` ব্যবহার করুন।",
    },
    { type: "h3", text: "Function বনাম Method" },
    {
      type: "p",
      text: "যে function কোনো **object এর property** হিসেবে রাখা এবং `obj.fn()` ভঙ্গিতে call করা হয়, তাকে সাধারণত **method** বলে। Method আলাদা ধরনের কোনো জিনিস নয় — এটি একই function, শুধু কোথায় রাখা ও কীভাবে call করা হচ্ছে সেটি ভিন্ন। এই call-site ভিন্নতাই ঠিক করে function এর ভেতরে `this` কী হবে — সেটি **this keyword** lesson এ বিস্তারিত আছে; এখানে শুধু মনে রাখুন, `this` নির্ভর করে **কীভাবে call করা হলো** তার ওপর, কোথায় লেখা হয়েছে তার ওপর নয় (arrow function ছাড়া)।",
    },
    { type: "h3", text: "Named বনাম anonymous, এবং `arguments` এর কথা" },
    {
      type: "p",
      text: "Function declaration এ নাম **বাধ্যতামূলক** (একমাত্র ব্যতিক্রম `export default function () {}`)। নাম থাকায় stack trace ও debugger এ পরিষ্কার পরিচয় পাওয়া যায়। Anonymous function (নামহীন) পাওয়া যায় expression রূপে (পরের lesson)। আর regular (non-arrow) function এর ভেতরে `arguments` নামে একটি array-সদৃশ object থাকে যাতে call এর সব argument থাকে। এটি legacy মনোভাবের API — আধুনিক কোডে **rest parameter** (`...args`) পছন্দনীয়। Parameters and Arguments lesson এ এটি বিস্তারিত আসবে, এখানে শুধু জানা থাকলেই যথেষ্ট।",
    },
    { type: "h3", text: "কখন declaration বেছে নেবেন?" },
    {
      type: "ul",
      items: [
        "ফাইল/module এর **top-level এ নামযুক্ত utility বা business logic function** — `function calculateTotal(items) {}`।",
        "React component: `function ProfileCard(props) {}` — নামযুক্ত declaration পড়তে সহজ এবং DevTools এ নাম পরিষ্কার দেখায়।",
        "যখন মূল কোড আগে রেখে helper নিচে রাখতে চান (hoisting এর সুবিধা)।",
        "**ব্যবহার করবেন না:** inline callback (`arr.map(...)`) এ — সেখানে arrow function অনেক সংক্ষিপ্ত; block এর ভেতরে; যেখানে হঠাৎ hoisting এর কারণে বিভ্রান্তি হতে পারে।",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "সাধারণ ভুল ধারণা",
      text: "(১) ‘সব function ই hoist হয়ে পুরোপুরি ব্যবহারযোগ্য হয়’ — ভুল। শুধু **declaration** এ এটি সত্য; `var f = function(){}` তে শুধু `f` নামটি hoist হয়, মান নয়। (২) ‘`let`/`const` এর মতো function ও TDZ তে থাকে’ — ভুল, declaration সরাসরি initialized। (৩) ‘function টি নাম দিয়ে call করলে তার ভেতরের variable গুলো পরের call এ মনে থাকে’ — ভুল, প্রতিটি call এ নতুন frame ও নতুন local binding। (৪) ‘`return` না লিখলে function কিছু ফেরত দেয় না’ — আসলে `undefined` ফেরত দেয়।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Browser ও Node.js",
      text: "Function declaration এর মূল আচরণ browser ও Node.js এ একই। Classic `<script>` এর top-level এ লেখা function declaration global object (`window`) এর property হয়ে যায়; ES Module ও Node.js এ (CommonJS ও ESM) top-level declaration module-local থাকে, global এ যায় না। ES Module সবসময় strict mode এ চলে, তাই block-level declaration এর আচরণ সেখানে নির্ধারিত (block scoped)।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "একটি রেস্টুরেন্টের **রেসিপি বই** কল্পনা করুন। বইয়ের প্রতিটি রেসিপি = একটি **function declaration**।",
    },
    {
      type: "ul",
      items: [
        "**রেসিপির নাম ও তালিকা (নাম/binding)** — রান্নাঘরে ঢোকার আগেই (scope এ ঢোকার creation phase এ) পুরো বই ডেস্কে সাজানো থাকে। তাই শেফ দিনের প্রথম অর্ডার থেকেই যেকোনো রেসিপি খুলে দেখতে পারে — রেসিপি লেখা বইয়ের কোন পাতায় আছে সেটি বিষয় না। এটিই **full hoisting**: নাম ও body দুটোই আগে থেকে প্রস্তুত।",
        "**অর্ডার আসা = function call।** একটি অর্ডার এলে শেফ একটি **নতুন ট্রে (call stack frame)** নেয়, সেখানে উপকরণ (parameter) ও টুকরো কাজ (local variable) রাখে। অর্ডার শেষ হলে ট্রে ধুয়ে সরিয়ে ফেলা হয় — পরের অর্ডারে নতুন ট্রে। একই রেসিপির দুটি অর্ডারের উপকরণ কখনো মিশে যায় না।",
        "**রেসিপি বনাম রান্না করা খাবার:** `greet` হলো **রেসিপি কার্ড** (মান হিসেবে হাতে নেওয়া, কাউকে দেওয়া যায়), `greet()` হলো **সেই রেসিপি অনুযায়ী রান্না করে খাবার বের করা** (return value)।",
        "**return না থাকা** — কখনো শেফ রান্না করে কিন্তু প্লেটে কিছু তুলে দেয় না (শুধু রান্নাঘরে কাজ হয়েছে, যেমন `console.log`)। তখন টেবিলে আসে শূন্য প্লেট — `undefined`।",
        "**`var f = function(){}` (পরের lesson)** হলো এমন রেসিপি যা বইয়ে নেই, শুধু বইয়ের সূচিতে নাম লেখা আছে আর পাতাটি **ফাঁকা** — অর্ডার আগে এলে শেফ ফাঁকা পাতা দেখে (`undefined` call, TypeError)।",
      ],
    },
  ],

  visuals: [
    {
      kind: "memory-steps",
      title: "Function declaration এর full hoisting বনাম var expression",
      code: 'console.log(sayHi());\nfunction sayHi() { return "hi"; }\nconsole.log(typeof hello);\nvar hello = function () {};',
      steps: [
        {
          line: -1,
          memory: [
            { name: "sayHi", value: "ƒ sayHi() { ... }", kind: "value", state: "live" },
            { name: "hello", value: "undefined", kind: "var", state: "hoisted" },
          ],
          note: "Creation phase: কোড চলার আগে engine পুরো scope স্ক্যান করে। `sayHi` declaration হওয়ায় নাম **এবং** function object দুটোই তৈরি — সরাসরি ব্যবহারযোগ্য। `hello` একটি `var`, তাই শুধু নাম তৈরি, মান `undefined`।",
        },
        {
          line: 0,
          memory: [
            { name: "sayHi", value: "ƒ sayHi() { ... }", kind: "value", state: "live" },
            { name: "hello", value: "undefined", kind: "var", state: "hoisted" },
          ],
          output: "hi",
          note: "`sayHi()` declaration লাইনের **আগেই** call করা হলো এবং সফল হলো — কারণ function object আগেই বসানো ছিল।",
        },
        {
          line: 2,
          memory: [
            { name: "sayHi", value: "ƒ sayHi() { ... }", kind: "value", state: "live" },
            { name: "hello", value: "undefined", kind: "var", state: "hoisted" },
          ],
          output: "undefined",
          note: "`hello` এর নাম আছে কিন্তু মান এখনো `undefined`। এখন `hello()` ডাকলে `undefined` কে call করার চেষ্টা হতো — TypeError।",
        },
        {
          line: 3,
          memory: [
            { name: "sayHi", value: "ƒ sayHi() { ... }", kind: "value", state: "live" },
            { name: "hello", value: "ƒ (anonymous)", kind: "var", state: "live" },
          ],
          note: "এই লাইনে পৌঁছানোর পর **assignment** হয়ে `hello` তে function বসে। Expression এর ক্ষেত্রে function তৈরি হয় execution phase এ, creation phase এ নয়।",
        },
      ],
      caption: "Declaration: নাম + মান আগে থেকেই। `var` expression: শুধু নাম আগে, মান পরে।",
    },
    {
      kind: "flow-steps",
      title: "Call stack: প্রতিটি call এ একটি করে frame",
      caption: "কোড: `function a() { return b() + 1; }` ও `function b() { return 41; }`, তারপর `console.log(a());`",
      nodes: [
        { id: "code", label: "Source", sub: "চলমান লাইন" },
        { id: "stack", label: "Call Stack", sub: "উপরেরটি সক্রিয়" },
        { id: "value", label: "Return value", sub: "ফেরত আসা মান" },
      ],
      steps: [
        {
          active: ["stack"],
          items: { code: ["console.log(a());"], stack: ["Global (main)"], value: [] },
          note: "প্রোগ্রাম শুরু। Stack এ শুধু global frame। `console.log(a())` তে প্রথমে argument `a()` এর মান বের করতে হবে।",
        },
        {
          active: ["code", "stack"],
          items: { code: ["a()  →  call"], stack: ["a()  ← সক্রিয়", "Global"], value: [] },
          note: "`a()` call হলো — একটি নতুন frame push হলো। `a` এর নিজস্ব parameter/local binding এই frame এ থাকবে।",
        },
        {
          active: ["code", "stack"],
          items: { code: ["b()  →  call"], stack: ["b()  ← সক্রিয়", "a()  (অপেক্ষায়)", "Global"], value: [] },
          note: "`a` এর ভেতরে `b()` call হলো। `a` থেমে অপেক্ষা করছে — `b` এর frame stack এর মাথায়। Stack LIFO: শেষে ঢোকা আগে বের হবে।",
        },
        {
          active: ["stack", "value"],
          items: { code: ["return 41;"], stack: ["a()  ← আবার সক্রিয়", "Global"], value: ["41 (b থেকে)"] },
          note: "`b` শেষ হলো, `41` ফেরত দিল এবং তার frame **pop** হয়ে গেল। এখন `a` আবার চলছে এবং `41 + 1` গণনা করবে।",
        },
        {
          active: ["stack", "value"],
          items: { code: ["return 42;"], stack: ["Global"], value: ["42 (a থেকে)"] },
          note: "`a` ও শেষ — frame pop হলো, `42` ফেরত এল। Stack এ আবার শুধু global।",
        },
        {
          active: ["code", "value"],
          items: { code: ["console.log(42)"], stack: ["Global"], value: ["42"] },
          output: "42",
          note: "এখন `console.log(42)` চলে। প্রতিটি call এর frame এর জীবনকাল ছিল ঠিক ওই call এর সময়টুকু।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "প্রথম function: declare, call ও function object",
      description: "Function declare করে call করুন। তারপর দেখুন function এর `name`, `length` এবং `return` না থাকলে কী ফেরত আসে।",
      code: `function greet(name) {
  return "Hello, " + name + "!";
}

function logOnly(message) {
  console.log("log:", message); // return নেই
}

console.log(greet("Rina"));
console.log(typeof greet, greet.name, greet.length);

const result = logOnly("কাজ হচ্ছে");
console.log("logOnly এর return value:", result);`,
    },
    {
      level: "intermediate",
      title: "Hoisting: declaration বনাম var expression বনাম let",
      description: "একই ফাইলে তিন ধরনের function তৈরির উপায়। কোনটি declaration লাইনের আগে কাজ করে, কোনটি কেন করে না — সব error এখানে catch করে দেখানো হয়েছে।",
      code: `// declaration: আগে call করলেও কাজ করে
console.log("add:", add(2, 3));

// var expression: নাম আছে, মান undefined
console.log("typeof sub:", typeof sub);
try {
  sub(5, 2);
} catch (e) {
  console.log("sub():", e.name);
}

// let/const expression: TDZ
try {
  mul(2, 3);
} catch (e) {
  console.log("mul():", e.name);
}

function add(a, b) {
  return a + b;
}
var sub = function (a, b) {
  return a - b;
};
const mul = function (a, b) {
  return a * b;
};`,
    },
    {
      level: "real-world",
      title: "Command table: function কে মান হিসেবে ব্যবহার",
      description: "Redux/reducer বা CLI tool এর মতো ধাঁচ — action name থেকে handler function বের করে চালানো হচ্ছে। Handler গুলো declaration, নিচে লেখা (hoisting), আর object এ রাখা হয়েছে মান হিসেবে। Unknown command ও নিরাপদে সামলানো হয়েছে।",
      code: `// মূল logic উপরে, helper নিচে — hoisting এর কারণে বৈধ
const handlers = {
  add: addItem,
  remove: removeItem,
  clear: clearCart,
};

function run(state, action) {
  const handler = Object.hasOwn(handlers, action.type) ? handlers[action.type] : null;
  if (handler === null) {
    console.log("অজানা action:", action.type);
    return state;
  }
  return handler(state, action.payload);
}

function addItem(state, item) {
  return [...state, item];
}

function removeItem(state, name) {
  return state.filter((item) => item !== name);
}

function clearCart() {
  return [];
}

let cart = [];
cart = run(cart, { type: "add", payload: "Pen" });
cart = run(cart, { type: "add", payload: "Book" });
cart = run(cart, { type: "remove", payload: "Pen" });
console.log(cart);
cart = run(cart, { type: "refund" });
cart = run(cart, { type: "clear" });
console.log(cart);`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের function লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
function square(n) {
  return n * n;
}

console.log(square(7));
`,
    },
    {
      label: "Function object: name, length, property",
      code: `function area(width, height) {
  return width * height;
}

console.log(area.name, area.length, typeof area);

// Function ও object — property বসানো যায় (শুধু বোঝার জন্য)
area.unit = "cm2";
console.log(area.unit);

// মান হিসেবে অন্য variable এ রাখা: একই function object
const alias = area;
console.log(alias === area, alias(3, 4));

// call না করে শুধু নাম লিখলে function টিই পাই
console.log(area);
`,
    },
    {
      label: "Block এর ভেতরে declaration (strict mode)",
      code: `// এই Playground strict mode এ চলে — তাই block এর function block-scoped।
// (পুরোনো sloppy script এ browser এ ফল ভিন্ন হতে পারে — Annex B)
{
  function inner() {
    return "block এর ভেতরে";
  }
  console.log(inner());
}
console.log(typeof inner);
`,
    },
    {
      label: "Call stack: কার আগে কে শেষ হয়",
      code: `function first() {
  console.log("first শুরু");
  second();
  console.log("first শেষ");
}

function second() {
  console.log("  second শুরু");
  third();
  console.log("  second শেষ");
}

function third() {
  console.log("    third (সবচেয়ে ভেতরে)");
}

first();
`,
    },
  ],

  debugging: [
    {
      title: "TypeError: total is not a function (var expression আগে call)",
      bad: `console.log(total(2, 3));

var total = function (a, b) {
  return a + b;
};`,
      why: "`var total` hoist হয়ে `undefined` পায়, কিন্তু function টি বসে assignment লাইনে পৌঁছালে। তার আগে `total(2, 3)` মানে `undefined(2, 3)` — তাই TypeError। Function declaration এ নাম ও body দুটোই আগে থেকে প্রস্তুত থাকে।",
      fix: `function total(a, b) {
  return a + b;
}

console.log(total(2, 3));`,
    },
    {
      title: "`return` এর পর নতুন লাইন — নীরবে undefined",
      bad: `function getUser() {
  return
  {
    name: "Rina"
  };
}

console.log(getUser());`,
      why: "`return` এর পরে line break থাকলে automatic semicolon insertion (ASI) `return;` বসিয়ে দেয়। নিচের `{ name: \"Rina\" }` তখন আর object থাকে না, একটি unreachable block হয়। কোনো error আসে না, শুধু `undefined` ফেরত আসে — তাই ধরা কঠিন। `return` এর মান একই লাইনে শুরু করুন।",
      fix: `function getUser() {
  return {
    name: "Rina"
  };
}

console.log(getUser());`,
    },
    {
      title: "Function call না করে শুধু নাম ব্যবহার",
      bad: `function isLoggedIn() {
  return false;
}

if (isLoggedIn) {
  console.log("Dashboard দেখান");
} else {
  console.log("Login page দেখান");
}`,
      why: "`isLoggedIn` মানে function object টি, যা সবসময় truthy। তাই condition সবসময় সত্য, আর function টি আদৌ চলেনি। চালিয়ে `return` এর মান পেতে `isLoggedIn()` লিখতে হয়। (React এ `onClick={handleClick()}` লিখলে render এর সময়ই function চলে যায় — একই পরিবারের ভুল।)",
      fix: `function isLoggedIn() {
  return false;
}

if (isLoggedIn()) {
  console.log("Dashboard দেখান");
} else {
  console.log("Login page দেখান");
}`,
    },
    {
      title: "একই নামে দুটি declaration — পরেরটি জেতে",
      bad: `function notify() {
  console.log("Email পাঠানো হলো");
}

function notify() {
  console.log("SMS পাঠানো হলো");
}

notify(); // প্রথমটি চলবে বলে আশা ছিল`,
      why: "একই scope এ একই নামে দুটি function declaration দিলে error হয় না (strict mode এ top-level এও না); creation phase এ পরেরটি আগেরটিকে বদলে দেয়। বড় ফাইলে নাম ঘটনাক্রমে মিলে গেলে এভাবে একটি function নীরবে হারিয়ে যায়। প্রতিটি function এর নাম স্পষ্ট ও আলাদা রাখুন; ESLint এর `no-redeclare` নিয়ম এটি ধরতে সাহায্য করে।",
      fix: `function notifyByEmail() {
  console.log("Email পাঠানো হলো");
}

function notifyBySms() {
  console.log("SMS পাঠানো হলো");
}

notifyByEmail();
notifyBySms();`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "প্রথম function লিখুন",
      prompt: "`double(n)` function টি এমনভাবে লিখুন যেন এটি `n` এর দ্বিগুণ **return** করে। তারপর `console.log(double(4))` চালালে `8` print হবে।",
      starter: `function double(n) {
  // TODO
}

console.log(double(4));`,
      expected: "8",
      hints: ["`console.log` না, `return` ব্যবহার করুন।", "`return n * 2;`"],
      solution: `function double(n) {
  return n * 2;
}

console.log(double(4));`,
      explanation: "`return` না থাকলে function `undefined` ফেরত দেয় — starter এ তাই `undefined` print হচ্ছিল।",
    },
    {
      level: "beginner",
      title: "TypeError ঠিক করুন: hoisting",
      prompt: "নিচের কোড TypeError দেয়। কোডের **ক্রম না বদলে**, শুধু function তৈরির ধরন বদলে `HI!` print করান।",
      starter: `console.log(shout("hi"));

var shout = function (text) {
  return text.toUpperCase() + "!";
};`,
      expected: "HI!",
      hints: ["কোন ধরনের function আগে call করা যায়?", "`var shout = function` কে `function shout` declaration এ বদলান; শেষের `;` লাগবে না।"],
      solution: `console.log(shout("hi"));

function shout(text) {
  return text.toUpperCase() + "!";
}`,
      explanation: "Declaration এর নাম ও body creation phase এই তৈরি হয় বলে call আগে লিখলেও কাজ করে।",
    },
    {
      level: "beginner",
      title: "Function এর name ও length",
      prompt: "`area` function টি নিচে দেওয়া আছে। এক লাইনের `console.log` দিয়ে এর **name** ও **parameter সংখ্যা** একসাথে print করুন, যাতে output হয় `area 3`।",
      starter: `function area(width, height, depth) {
  return width * height * depth;
}

// TODO: এখানে এক লাইনে print করুন`,
      expected: "area 3",
      hints: ["`area.name` ও `area.length` ব্যবহার করুন।", "`console.log` এ দুটি argument দিলে মাঝে স্পেস বসে।"],
      solution: `function area(width, height, depth) {
  return width * height * depth;
}

console.log(area.name, area.length);`,
    },
    {
      level: "intermediate",
      title: "Function কে argument হিসেবে পাঠান",
      prompt: "`applyTwice(fn, value)` লিখুন, যা `fn` কে `value` এর ওপর **দুইবার** প্রয়োগ করে ফল ফেরত দেয়। `increment` এ `5` দিলে `7`, `double` এ `5` দিলে `20` হবে।",
      starter: `function increment(n) {
  return n + 1;
}

function double(n) {
  return n * 2;
}

function applyTwice(fn, value) {
  // TODO
}

console.log(applyTwice(increment, 5));
console.log(applyTwice(double, 5));`,
      expected: "7\n20",
      hints: ["`fn` একটি সাধারণ মান — `fn(value)` লিখে চালাতে পারেন।", "প্রথম ফলটিকে আবার `fn` এ দিন: `fn(fn(value))`।"],
      solution: `function increment(n) {
  return n + 1;
}

function double(n) {
  return n * 2;
}

function applyTwice(fn, value) {
  return fn(fn(value));
}

console.log(applyTwice(increment, 5));
console.log(applyTwice(double, 5));`,
      explanation: "Function first-class value, তাই এটি parameter হিসেবে আসতে পারে। এটিই callback ও higher-order function এর ভিত্তি।",
    },
    {
      level: "intermediate",
      title: "Early return দিয়ে guard",
      prompt: "`safeDivide(a, b)` লিখুন: `b` শূন্য হলে `null` ফেরত দেবে, নইলে ভাগফল। `5 / 2` এর জন্য `2.5` এবং `5 / 0` এর জন্য `null` print হবে।",
      starter: `function safeDivide(a, b) {
  // TODO
}

console.log(safeDivide(5, 2));
console.log(safeDivide(5, 0));`,
      expected: "2.5\nnull",
      hints: ["আগে শর্ত চেক করে `return null;` করুন।", "`return` চললে function ওখানেই শেষ — বাকি কোড চলে না।"],
      solution: `function safeDivide(a, b) {
  if (b === 0) {
    return null;
  }
  return a / b;
}

console.log(safeDivide(5, 2));
console.log(safeDivide(5, 0));`,
      explanation: "Guard clause (early return) নেস্টেড `if/else` কমায় এবং ‘সমস্যার ক্ষেত্র আগে সামলাও’ ধাঁচ তৈরি করে।",
    },
    {
      level: "challenge",
      title: "Real-world: Order summary (helper নিচে, মূল logic উপরে)",
      prompt:
        "`printSummary` এর কোড দেওয়া আছে এবং এটি তিনটি helper declaration ব্যবহার করে যা নিচে stub হিসেবে খালি। `calcSubtotal(items)` (সব `price * qty` এর যোগফল), `calcTax(subtotal, rate)` (`subtotal * rate`) এবং `formatMoney(n)` (`\"BDT \"` + দুই দশমিকে `n`) সম্পূর্ণ করুন।",
      starter: `const cart = [
  { name: "Pen", price: 10, qty: 3 },
  { name: "Book", price: 120, qty: 1 },
];

printSummary(cart, 0.1);

function printSummary(items, taxRate) {
  const subtotal = calcSubtotal(items);
  const tax = calcTax(subtotal, taxRate);
  console.log("Subtotal:", formatMoney(subtotal));
  console.log("Tax:", formatMoney(tax));
  console.log("Total:", formatMoney(subtotal + tax));
}

function calcSubtotal(items) {
  // TODO
}

function calcTax(subtotal, rate) {
  // TODO
}

function formatMoney(n) {
  // TODO
}`,
      expected: "Subtotal: BDT 150.00\nTax: BDT 15.00\nTotal: BDT 165.00",
      hints: ["`items.reduce((sum, item) => sum + item.price * item.qty, 0)` বা একটি `for...of` loop।", "`formatMoney` এ `\"BDT \" + n.toFixed(2)`।", "`printSummary` কে ফাইলের উপরে call করা বৈধ — কারণ declaration hoisted।"],
      solution: `const cart = [
  { name: "Pen", price: 10, qty: 3 },
  { name: "Book", price: 120, qty: 1 },
];

printSummary(cart, 0.1);

function printSummary(items, taxRate) {
  const subtotal = calcSubtotal(items);
  const tax = calcTax(subtotal, taxRate);
  console.log("Subtotal:", formatMoney(subtotal));
  console.log("Tax:", formatMoney(tax));
  console.log("Total:", formatMoney(subtotal + tax));
}

function calcSubtotal(items) {
  let sum = 0;
  for (const item of items) {
    sum += item.price * item.qty;
  }
  return sum;
}

function calcTax(subtotal, rate) {
  return subtotal * rate;
}

function formatMoney(n) {
  return "BDT " + n.toFixed(2);
}`,
      explanation: "প্রতিটি helper একটি কাজ করে ও মান ফেরত দেয়, ফলে `printSummary` পড়লেই পুরো গল্প বোঝা যায়। Declaration hoisted বলে মূল logic উপরে ও helper নিচে রাখা সম্ভব হয়েছে।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "নিচের কোডের output কী? `console.log(typeof f); function f() {}`",
        options: ["\"undefined\"", "ReferenceError", "\"function\"", "\"object\""],
        answer: 2,
        explanation:
          "Function declaration এর নাম ও function object দুটোই creation phase এ তৈরি হয়, তাই `f` আগে থেকেই function। `\"undefined\"` হতো `var f = function(){}` হলে। ReferenceError আসত `let`/`const` এর TDZ তে। `typeof` কোনো function এর জন্য `\"object\"` নয়, বিশেষ ফল `\"function\"` দেয়।",
      },
      {
        question: "`console.log(typeof g); var g = function () {};` এর ফল কী?",
        options: ["\"undefined\"", "\"function\"", "ReferenceError", "TypeError"],
        answer: 0,
        explanation:
          "`var g` hoist হয়ে `undefined` পায়; function বসে assignment লাইনে। তাই `typeof g` এই মুহূর্তে `\"undefined\"`। `\"function\"` হতো declaration হলে। ReferenceError হতো `let`/`const` হলে (TDZ)। TypeError আসত `g()` call করলে, শুধু `typeof` করলে নয়।",
      },
      {
        question: "`function f(a, b) {}` এর জন্য `f.length` কত?",
        options: ["0", "2", "1", "`undefined`"],
        answer: 1,
        explanation:
          "`length` হলো declare করা parameter এর সংখ্যা (default value বা rest parameter থেকে আগের গুলো পর্যন্ত)। এখানে `a` ও `b` দুটি, তাই `2`। `0` হতো parameter না থাকলে; `1` ভুল গণনা; `length` সবসময় একটি number, `undefined` নয়।",
      },
      {
        question: "`function f() {} const r = f();` এর পর `r` এর মান কী?",
        options: ["`null`", "`f` নিজেই", "`0`", "`undefined`"],
        answer: 3,
        explanation:
          "`return` না থাকলে function call এর ফল `undefined`। `null` কখনো স্বয়ংক্রিয়ভাবে আসে না। `f` নিজেই পেতে হলে call না করে (`const r = f`) লিখতে হতো। `0` এর কোনো ভিত্তি নেই।",
      },
      {
        question: "Strict mode বা ES Module এ `{ function h() {} }` এর পর block এর বাইরে `typeof h` কী দেয়?",
        options: ["\"function\" — declaration সবসময় বাইরে দেখা যায়", "\"undefined\" — function টি block scoped", "ReferenceError", "\"object\""],
        answer: 1,
        explanation:
          "Strict mode ও ES Module এ block এর ভেতরের function declaration block-scoped, তাই বাইরে নামটি নেই এবং `typeof` undeclared নামে `\"undefined\"` দেয় (error ছোড়ে না)। প্রথম অপশনটি sloppy mode এর browser এর (Annex B) আচরণ — তাই ‘সবসময়’ কথাটি ভুল। ReferenceError আসত শুধু `h` কে সরাসরি পড়লে, `typeof` এ নয়।",
      },
    ],
    coding: [
      {
        title: "clamp function",
        prompt: "`clamp(n, min, max)` লিখুন, যা `n` কে `min` ও `max` এর মধ্যে সীমাবদ্ধ করে। `clamp(15, 0, 10)`, `clamp(-3, 0, 10)`, `clamp(5, 0, 10)` — তিনটি আলাদা লাইনে `10`, `0`, `5` print করুন।",
        starter: `function clamp(n, min, max) {
  // TODO
}

console.log(clamp(15, 0, 10));
console.log(clamp(-3, 0, 10));
console.log(clamp(5, 0, 10));`,
        expected: "10\n0\n5",
        solution: `function clamp(n, min, max) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

console.log(clamp(15, 0, 10));
console.log(clamp(-3, 0, 10));
console.log(clamp(5, 0, 10));`,
      },
      {
        title: "describe(fn)",
        prompt: "`describe(fn)` লিখুন, যা একটি string ফেরত দেয়: `<name> takes <length> params`। `add(a, b)` এর জন্য print হবে `add takes 2 params`।",
        starter: `function add(a, b) {
  return a + b;
}

function describe(fn) {
  // TODO
}

console.log(describe(add));`,
        expected: "add takes 2 params",
        solution: `function add(a, b) {
  return a + b;
}

function describe(fn) {
  return fn.name + " takes " + fn.length + " params";
}

console.log(describe(add));`,
      },
    ],
  },

  interview: [
    {
      q: "Function declaration hoisting কীভাবে কাজ করে এবং `var`/`let` এর hoisting থেকে কীভাবে আলাদা?",
      a: "Scope এ ঢোকার সময় engine একটি creation phase চালায়। Function declaration এর ক্ষেত্রে এই phase এ শুধু নামই নথিভুক্ত হয় না, **function object টিও তৈরি হয়ে নামের সাথে initialize হয়ে যায়**। তাই declaration লাইনের আগে call করলেও কাজ করে।\n\n`var x` এ নাম তৈরি হয়ে `undefined` দিয়ে initialize হয়; মান বসে assignment লাইনে। `let`/`const` এ নাম তৈরি হয় কিন্তু uninitialized — TDZ তে থাকে, access করলে ReferenceError। সুতরাং ক্রম: declaration সবচেয়ে প্রস্তুত, `var` আংশিক, `let`/`const` অনুপলব্ধ।\n\nআরও যোগ করুন: ‘hoisting’ মানে কোড সরে যাওয়া নয়, এটি creation phase এর ফল বোঝানোর একটি শব্দ।",
    },
    {
      q: "‘Functions are first-class citizens’ বলতে কী বোঝায়? একটি বাস্তব উদাহরণ দিন।",
      a: "First-class মানে function কে অন্য যেকোনো মান (number, string, object) এর মতো ব্যবহার করা যায়: variable এ রাখা, array/object এ রাখা, argument হিসেবে পাঠানো, অন্য function থেকে return করা। কারণ JavaScript এ function আসলে একটি callable object।\n\nবাস্তব উদাহরণ: `arr.map(fn)`, `addEventListener(\"click\", handler)`, React এ `onClick={handleClick}` — প্রতিটিতে আপনি function টিকে call না করে **মান হিসেবে** পাঠাচ্ছেন এবং অন্য কেউ (map, browser, React) পরে সেটি call করছে। Higher-order function, callback, closure ও functional পদ্ধতি সবই এই বৈশিষ্ট্যের ওপর দাঁড়িয়ে।",
    },
    {
      q: "Function call এর সময় call stack এ কী ঘটে? Recursion এ stack overflow কেন হয়?",
      a: "প্রতিটি call এ engine stack এ একটি নতুন **frame (execution context)** push করে, যাতে ওই call এর parameter, local binding ও return এর জায়গা থাকে। Function শেষ হলে বা exception ছুড়লে frame pop হয়। Stack LIFO বলে ভেতরের call আগে শেষ হয় এবং একই function এর একাধিক call এর local variable আলাদা থাকে।\n\nStack এর আকার সীমিত (engine ও environment ভেদে আলাদা)। Recursion এ base case না থাকলে frame জমতেই থাকে এবং সীমা পেরোলে engine `RangeError` ছোড়ে — এটিই stack overflow। ঠিক সীমা বা বার্তা engine নির্ভর, তাই কোডে এর ওপর নির্ভর করা উচিত নয়; সমাধান হলো সঠিক base case বা iteration।",
    },
    {
      q: "Function declaration কি block এর ভেতরে লেখা উচিত? কী সমস্যা হতে পারে?",
      a: "না, সাধারণভাবে এড়িয়ে চলাই ভালো। Strict mode ও ES Module এ এমন declaration block-scoped, যা `let` এর মতো ব্যবহারযোগ্য। কিন্তু web এর পুরোনো কোডের সাথে মিল রাখতে spec এর Annex B **sloppy mode এ** browser এর জন্য বাড়তি আচরণ বর্ণনা করে — block এর বাইরের function scope এও একটি `var`-সদৃশ binding তৈরি হয়, যা declaration চলার পর মান পায়। ফলে strict ও sloppy mode এ একই কোড আলাদা ফল দিতে পারে।\n\nতাই নিরাপদ পথ: block এর ভেতরে `const fn = () => {}` বা `const fn = function () {}` ব্যবহার করুন, আর ESLint এর `no-inner-declarations` ধরনের নিয়ম চালান।",
    },
    {
      q: "Function declaration কখন ব্যবহার করবেন, আর কখন arrow function বা expression?",
      a: "Module এর top-level এ নামযুক্ত, পুনর্ব্যবহারযোগ্য function (utility, business logic, React component) এর জন্য declaration ভালো: নাম পরিষ্কার, stack trace এ ধরা পড়ে, এবং hoisting এর কারণে ‘মূল logic উপরে, helper নিচে’ ধাঁচ সম্ভব।\n\nInline callback (`map`, `filter`, event handler, `setTimeout`) এ সাধারণত arrow function সংক্ষিপ্ত ও পছন্দনীয়। Function কে মান হিসেবে condition অনুযায়ী বেছে নিতে বা reassign না করা `const` binding চাইলে function expression/arrow ভালো। Object method এ method shorthand ব্যবহার হয়। এটি কোনো কঠোর নিয়ম নয়, বরং team এর convention ও readability এর প্রশ্ন; কিন্তু `this` লাগলে arrow ও declaration এর পার্থক্য মাথায় রাখতেই হবে।",
    },
    {
      q: "Function এ `return` না থাকলে কী হয়? `return` এর পর নতুন লাইন লিখলে কী সমস্যা?",
      a: "`return` না থাকলে (বা `return;` থাকলে) call এর ফল `undefined`। এটি সরাসরি error নয়, তাই ভুলে return বাদ পড়লে বাকি কোড চুপচাপ `undefined` নিয়ে চলতে থাকে ও পরে অন্য কোথাও ভাঙে — debugging কঠিন হয়।\n\n`return` এর পর line break দিলে automatic semicolon insertion (ASI) নিয়ম অনুযায়ী `return;` ধরে নেওয়া হয়, আর পরের লাইনের মান অকার্যকর হয়ে যায়। উদাহরণ: `return\\n{ a: 1 }` object নয়, `undefined` ফেরত দেয়। তাই `return {` একই লাইনে লিখুন। Linter ও Prettier এই ধরনের ভুল ধরতে সাহায্য করে।",
    },
  ],

  summary: {
    takeaways: [
      "Function declaration এর নাম **ও** function object দুটোই scope এ ঢোকার creation phase এ তৈরি হয় (full hoisting) — তাই আগে call করা যায়।",
      "`var f = function(){}` তে শুধু নাম hoist (`undefined`), `let`/`const` এ TDZ — declaration এর মতো আগে ব্যবহারযোগ্য নয়।",
      "Function একটি first-class object: `name`, `length` আছে, মান হিসেবে পাঠানো ও রাখা যায়। `f` ≠ `f()`।",
      "`return` না থাকলে `undefined`; `return` এর পর নতুন লাইন লিখলে ASI এর কারণে `undefined`।",
      "প্রতিটি call এ call stack এ নতুন frame তৈরি হয় ও শেষে ধ্বংস হয় (LIFO) — তাই local variable call-নির্ভর আলাদা।",
      "Block এর ভেতরে declaration এড়িয়ে চলুন: strict/module এ block-scoped, sloppy browser এ Annex B আচরণ ভিন্ন।",
    ],
    syntax: `function name(param1, param2) {
  // body
  return value; // না দিলে undefined
}

name(1, 2);        // call
const ref = name;  // function টি মান হিসেবে (call হয়নি)
name.name;         // "name"
name.length;       // 2`,
    whenToUse: [
      "Module এর top-level এ নামযুক্ত utility/business logic function।",
      "React component (`function Card() {}`) যেখানে DevTools এ পরিষ্কার নাম দরকার।",
      "মূল logic উপরে ও helper নিচে সাজাতে চাইলে (hoisting এর সুবিধা)।",
      "Inline callback এ নয় — সেখানে arrow function; block এর ভেতরেও নয়।",
    ],
    next: ["Function Expression — মান হিসেবে function তৈরি, named expression ও hoisting এর পার্থক্য", "Arrow Functions — সংক্ষিপ্ত syntax ও lexical `this`", "Parameters and Arguments — default, rest ও `arguments`", "Closures ও Scope Chain — function এর ভেতরে scope কীভাবে কাজ করে"],
  },

  compatibility:
    "Function declaration ECMAScript এর শুরু থেকেই আছে — সব browser ও Node.js এ একই কাজ করে। পার্থক্য শুধু (১) classic `<script>` এর top-level declaration `window` এর property হয় কিন্তু ES Module ও Node.js এ হয় না, এবং (২) block এর ভেতরের declaration এর আচরণ sloppy mode এ (Annex B, browser সামঞ্জস্য) ও strict/module mode এ ভিন্ন। এই Playground strict mode এ চলে।",
};
