import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Function **statement (declaration)** ও function **expression** এর মূল পার্থক্য — parser কীভাবে ঠিক করে কোনটি কী — তা ব্যাখ্যা করতে পারবেন।",
    "Anonymous ও **named function expression** এর পার্থক্য, এবং named expression এর নাম কেন শুধু function এর ভেতরেই দেখা যায় — তা বুঝবেন।",
    "Function expression কেন declaration এর মতো hoist হয় না, এবং `var`/`let`/`const` ভেদে কী error আসে — তা ভবিষ্যদ্বাণী করতে পারবেন।",
    "Function কে array, object ও return value হিসেবে ব্যবহার করে handler table, strategy ও factory বানাতে পারবেন।",
    "Declaration বনাম expression বনাম arrow — কোথায় কোনটি বেছে নেবেন তার সিদ্ধান্ত নিতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Statement বনাম Expression: মূল ধারণা" },
    {
      type: "p",
      text: "JavaScript এ কোডের টুকরো দুই ধরনের: **statement** (যা কিছু একটা করে, মান ফেরত দেয় না — `if`, `for`, `function f() {}`) এবং **expression** (যা একটি **মান** তৈরি করে — `1 + 2`, `x`, `foo()`)। Expression আপনি variable এ রাখতে, argument হিসেবে পাঠাতে, `return` করতে পারেন; statement পারেন না।",
    },
    {
      type: "p",
      text: "Function Declaration lesson এ আমরা `function add() {}` দেখেছি, যা একটি **statement**। কিন্তু `function` keyword যদি এমন জায়গায় আসে যেখানে একটি **মান** আশা করা হচ্ছে (যেমন `=` এর ডানে, argument এর জায়গায়, বা `(` এর ভেতরে), তবে সেটি **function expression** — একটি function object তৈরির expression। Parser ঠিক করে **statement এর শুরুতে `function` থাকলে declaration, অন্য সব জায়গায় expression**।",
    },
    {
      type: "code",
      code: `// declaration (statement) — statement এর শুরুতেই function
function add(a, b) { return a + b; }

// expression — মান বসানোর জায়গায়
const sub = function (a, b) { return a - b; };       // anonymous
const mul = function multiply(a, b) { return a * b; }; // named
[1, 2, 3].map(function (n) { return n * 2; });       // argument হিসেবে`,
      caption: "তিন ধরনের লেখার ধাঁচ। এটি runnable নয়, শুধু syntax দেখানোর জন্য।",
    },
    { type: "h3", text: "Function value কে variable এ রাখা" },
    {
      type: "p",
      text: "`const sub = function (a, b) {...}` এ ডানদিকের অংশটি একটি function object তৈরি করে এবং `=` সেটিকে `sub` binding এ রাখে। এখানে **function টি নিজে নামহীন (anonymous)**, নামটি `sub` variable এর। তবে আধুনিক engine সাধারণত এই ক্ষেত্রে function এর `name` property তে `\"sub\"` বসিয়ে দেয় (spec এ একে **function name inference** বলা হয়) — তাই `sub.name === \"sub\"`। এই inference প্রধানত সরাসরি `const x = function(){}`, `{ key: function(){} }` ও default value এর মতো ক্ষেত্রে ঘটে; `obj.prop = function(){}` এর মতো member assignment এ সাধারণত হয় না।",
    },
    { type: "h3", text: "Named function expression (NFE)" },
    {
      type: "p",
      text: "Expression এর ভেতরেও function কে নাম দেওয়া যায়: `const f = function fact(n) {...}`। এখানে দুটি আলাদা নাম আছে: `f` হলো **বাইরের variable** (যেখানে function টি রাখা হয়েছে) আর `fact` হলো function এর **নিজের নাম**। এই `fact` নামটি **শুধু function এর ভেতরেই** দেখা যায় — spec অনুযায়ী function এর চারপাশে একটি ছোট্ট আলাদা scope তৈরি হয়, যেখানে শুধু এই একটি binding থাকে। বাইরের scope এ `fact` নেই।",
    },
    {
      type: "ul",
      items: [
        "**Recursion এ নির্ভরযোগ্যতা:** ভেতর থেকে `fact(n - 1)` লিখলে সেটি সবসময় এই function কেই বোঝায়, বাইরের `f` পরে reassign বা `null` করলেও।",
        "**Debugging:** Stack trace ও DevTools এ নামটি দেখা যায় (modern engine `const f = function(){}` এও নাম অনুমান করে, কিন্তু inline callback এ `arr.map(function parseRow(r) {...})` এ স্পষ্ট নাম দিলে পড়তে সুবিধা)।",
        "**নাম সাধারণত অপরিবর্তনীয়:** Strict mode এ ভেতর থেকে `fact = something` লিখলে `TypeError` (sloppy mode এ নীরবে উপেক্ষিত) — তাই নামটি ঘটনাক্রমে বদলানোর ভয় কম।",
        "**বাইরে অদৃশ্য:** নামটি বাইরের scope কে দূষিত করে না — যেমন declaration করে।",
      ],
    },
    { type: "h3", text: "Hoisting নেই: কেন এবং কী error আসে" },
    {
      type: "p",
      text: "Declaration এ function object তৈরি হয় scope এ ঢোকার সময় (creation phase)। কিন্তু expression এ function object তৈরি হয় **execution phase এ, যখন সেই লাইনটি চলে**। তাই যে variable টি function ধরে রাখবে তার hoisting নিয়মই এখানে প্রযোজ্য — Variables lesson এ যা দেখেছি।",
    },
    {
      type: "compare",
      headers: ["লেখার ধরন", "Declaration লাইনের আগে call করলে", "কারণ"],
      rows: [
        ["`function f() {}`", "কাজ করে", "নাম ও function object creation phase এ তৈরি"],
        ["`var f = function () {}`", "**TypeError** (f is not a function)", "`f` hoisted কিন্তু মান `undefined`"],
        ["`let f = function () {}`", "**ReferenceError**", "`f` TDZ তে"],
        ["`const f = function () {}` / `() => {}`", "**ReferenceError**", "`f` TDZ তে"],
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "ভুল ধারণা: ‘function expression এর body আগে থেকে জানা থাকে’",
      text: "না। Expression এর function object টি তৈরিই হয় ওই লাইন চলার সময়। তাই `var f = function(){}` এর `f` hoisted হলেও এটি ‘খালি’ (`undefined`)। এটি declaration এর full hoisting এর সম্পূর্ণ বিপরীত — Function Declaration lesson এর তুলনা-টেবিলটি আবার মনে করুন।",
    },
    { type: "h3", text: "Declaration বনাম Expression: কখন কোনটি?" },
    {
      type: "compare",
      headers: ["বিষয়", "Declaration", "Expression (`const f = function`)", "Arrow (`const f = () => {}`)"],
      rows: [
        ["Hoisting", "পুরো (নাম + body)", "নেই (variable এর নিয়ম)", "নেই (variable এর নিয়ম)"],
        ["Reassign প্রতিরোধ", "পারে না (সাধারণ binding)", "`const` দিয়ে সম্ভব", "`const` দিয়ে সম্ভব"],
        ["Condition এ তৈরি", "block এ ঝামেলা", "সহজ", "সহজ"],
        ["নিজস্ব `this`/`arguments`", "আছে", "আছে", "**নেই** (lexical)"],
        ["`new` দিয়ে constructor", "হতে পারে", "হতে পারে", "**পারে না**"],
        ["সাধারণ পছন্দ", "top-level named function, component", "মান-সদৃশ ব্যবহার, NFE, যেখানে অর্ডার জরুরি", "inline callback, সংক্ষিপ্ত helper"],
      ],
    },
    { type: "h3", text: "Function কে মান হিসেবে ব্যবহার" },
    {
      type: "p",
      text: "Expression রূপে function লেখার আসল সুবিধা হলো এটি **যেকোনো মানের জায়গায়** বসানো যায়: array তে (pipeline), object এ (handler table / strategy map), argument হিসেবে (callback), অন্য function থেকে return (factory, closure)। Redux এর reducer map, Express এর route handler, React এর event handler table — সব জায়গায় এই ধাঁচ দেখা যায়।",
    },
    {
      type: "code",
      code: `// শর্ত অনুযায়ী function নির্বাচন (conditional definition)
const format = isCompact
  ? function (n) { return String(n); }
  : function (n) { return n.toFixed(2); };

// Factory: function ফেরত দেয়
function minLength(min) {
  return function (value) { return value.length >= min; };
}`,
      caption: "দুটি সাধারণ ধাঁচ। `isCompact` কল্পিত; এটি runnable নয়।",
    },
    {
      type: "p",
      text: "**Conditional definition** এ লক্ষ্য রাখুন: `if (cond) { function f(){} }` এর মতো block-এর ভেতরে declaration বিপজ্জনক (Function Declaration lesson দেখুন), কিন্তু `const f = cond ? function(){} : function(){}` বা `if/else` এ `let`/`const` এ expression assign করা সম্পূর্ণ পরিষ্কার ও নিরাপদ।",
    },
    { type: "h3", text: "Immediate invocation এর পূর্বাভাস" },
    {
      type: "p",
      text: "যেহেতু statement এর শুরুতে `function` থাকলে parser সেটিকে declaration ধরে, তাই `function () {}()` লিখলে **SyntaxError** (declaration এ নাম লাগে, আর `()` ও অসম্পূর্ণ)। পুরো function কে `( ... )` দিয়ে ঘিরলে সেটি expression হয়ে যায়, তখন সাথে সাথে call করা যায়: `(function () { ... })();`। একে **IIFE (Immediately Invoked Function Expression)** বলে — বিস্তারিত পরের **IIFE lesson** এ। এখানে শুধু মনে রাখুন: parentheses এর কাজ declaration কে expression বানানো।",
    },
    { type: "h3", text: "Object এ method shorthand" },
    {
      type: "p",
      text: "Object literal এ `{ greet: function () {...} }` এর বদলে আধুনিক কোডে লেখা হয় `{ greet() {...} }` — একে **method shorthand** বলে। এটি কেবল সংক্ষিপ্ত লেখা নয়: shorthand method সাধারণ function expression থেকে একটু আলাদা — এটি constructor (`new` এর যোগ্য) হয় না, তার `prototype` property থাকে না, এবং ভেতরে `super` ব্যবহার করা যায়। `name` property হয় key (`\"greet\"`)। Method এর ভেতরে `this` কী হবে তা নির্ভর করে call-site এর ওপর — যা **this keyword** lesson এ আসবে।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Browser ও Node.js",
      text: "Function expression এর আচরণ browser ও Node.js এ একই। Named function expression এর নাম বাইরের scope এ যাওয়া — পুরোনো কিছু engine (বিশেষত অনেক পুরোনো IE) এ একটি পরিচিত bug ছিল; আজকের সব আধুনিক runtime এ spec অনুযায়ী নাম শুধু ভেতরে দেখা যায়। পুরোনো IIFE-কেন্দ্রিক কোড পড়তে গেলে এটি জানা কাজে আসে।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "Function Declaration lesson এ রেসিপি বইয়ের উদাহরণ ছিল। এবার ভাবুন **রান্নাঘরে হাতে হাতে লিখে দেওয়া চিরকুট (sticky note)**।",
    },
    {
      type: "ul",
      items: [
        "**Function expression = একটি চিরকুট যা তখনই লেখা হয় যখন শেফ সেই ধাপে পৌঁছায়।** রেসিপি বইয়ের মতো আগে থেকে সাজানো নয়। শেফ যতক্ষণ সেই লাইনে (লিখতে বসার ধাপে) পৌঁছায়নি, চিরকুটের অস্তিত্ব নেই।",
        "**`var f = ...`** হলো ডেস্কে নাম লেখা একটি **খালি ট্রে** আগে থেকে রাখা (hoisted, `undefined`)। চিরকুট আসার আগে ট্রেতে হাত দিলে কিছু নেই (TypeError)।",
        "**`const f = ...`** হলো ট্রে **সিল করা** — চিরকুট ঢোকানোর আগে খোলা নিষেধ (TDZ, ReferenceError)।",
        "**Named function expression** হলো চিরকুটের ভেতরে লেখা একটি **‘আমি নিজে’ নাম** — যেমন ‘এই ধাপ আবার করতে হলে এই চিরকুটের ২ নম্বর অংশে ফিরে যাও’। এই ‘আমি নিজে’ নামটি শুধু চিরকুটের ভেতরের কেউ বোঝে; অন্য কেউ রান্নাঘরে দাঁড়িয়ে সেই নামে ডাকতে পারে না। বাইরের ট্রের নাম বদলে গেলেও (ট্রে খালি করে ফেললেও) চিরকুটের ‘আমি নিজে’ নামটি ঠিক থাকে।",
        "**IIFE এর পূর্বাভাস:** চিরকুট লিখে সাথে সাথে পড়ে ফেলা — ট্রেতে রাখারই দরকার নেই।",
      ],
    },
  ],

  visuals: [
    {
      kind: "memory-steps",
      title: "Function expression: variable এর hoisting নিয়মেই চলে",
      code: "console.log(typeof a);\nvar a = function () {};\nconsole.log(typeof a);\nconst b = function () {};",
      steps: [
        {
          line: -1,
          memory: [
            { name: "a", value: "undefined", kind: "var", state: "hoisted" },
            { name: "b", value: "", kind: "const", state: "tdz" },
          ],
          note: "Creation phase: `a` (var) তৈরি হয়ে `undefined`। `b` (const) নথিভুক্ত কিন্তু TDZ তে। **কোনো function object এখনো তৈরি হয়নি** — expression গুলো চলেনি।",
        },
        {
          line: 0,
          memory: [
            { name: "a", value: "undefined", kind: "var", state: "hoisted" },
            { name: "b", value: "", kind: "const", state: "tdz" },
          ],
          output: "undefined",
          note: "`a` এখনো `undefined`। এই মুহূর্তে `a()` ডাকলে TypeError হতো।",
        },
        {
          line: 1,
          memory: [
            { name: "a", value: "ƒ (a)", kind: "var", state: "live" },
            { name: "b", value: "", kind: "const", state: "tdz" },
          ],
          note: "এই লাইন চলতেই ডানদিকের expression একটি function object তৈরি করল এবং `a` তে বসাল। (নাম `\"a\"` অনুমান করা হয়।)",
        },
        {
          line: 2,
          memory: [
            { name: "a", value: "ƒ (a)", kind: "var", state: "live" },
            { name: "b", value: "", kind: "const", state: "tdz" },
          ],
          output: "function",
          note: "এখন `a` একটি function। `b` এখনো TDZ তে — এ পর্যন্ত `b` ব্যবহার করলে ReferenceError।",
        },
        {
          line: 3,
          memory: [
            { name: "a", value: "ƒ (a)", kind: "var", state: "live" },
            { name: "b", value: "ƒ (b)", kind: "const", state: "live" },
          ],
          note: "`const b = ...` চলার পর `b` TDZ ছেড়ে ব্যবহারযোগ্য।",
        },
      ],
      caption: "Expression এ ‘function তৈরি’ ও ‘নামে বাঁধা’ দুটোই execution phase এ ঘটে।",
    },
    {
      kind: "flow-steps",
      title: "Named function expression: নামটি কোন scope এ থাকে?",
      caption: "কোড: `const f = function fact(n) { return n <= 1 ? 1 : n * fact(n - 1); };`",
      nodes: [
        { id: "call", label: "Call scope", sub: "প্রতি call এর নিজস্ব" },
        { id: "own", label: "NFE scope", sub: "শুধু function এর নাম" },
        { id: "outer", label: "বাইরের scope", sub: "module / enclosing" },
      ],
      steps: [
        {
          active: ["outer"],
          items: { call: [], own: [], outer: ["f → ƒ fact"] },
          note: "বাইরের scope এ শুধু `f` আছে। `fact` নামটি এখানে **নেই**। তাই বাইরে `fact(3)` লিখলে ReferenceError।",
        },
        {
          active: ["call", "own"],
          items: { call: ["n = 3"], own: ["fact → ƒ fact (নিজেই)"], outer: ["f → ƒ fact"] },
          note: "`f(3)` call হলো। Function এর ভেতরে `fact` খোঁজা হচ্ছে: প্রথমে call scope (`n` আছে, `fact` নেই), তারপর NFE scope — **এখানে `fact` পাওয়া গেল**।",
        },
        {
          active: ["call", "own"],
          items: { call: ["n = 2 (নতুন call)"], own: ["fact → ƒ fact (একই function)"], outer: ["f → ƒ fact"] },
          note: "`fact(n - 1)` নতুন call তৈরি করে — প্রতি call এ নতুন call scope, কিন্তু NFE scope একই। বাইরের `f` কেউ বদলালেও এই recursion অক্ষত থাকে।",
        },
        {
          active: ["outer"],
          items: { call: [], own: [], outer: ["f → ƒ fact", "typeof fact → \"undefined\""] },
          note: "বাইরে এসে `typeof fact` লিখলে scope chain এ নামটি পাওয়া যায় না — তাই `\"undefined\"` (error নয়, কারণ `typeof` undeclared নামে নিরাপদ)।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Function expression, name inference ও array তে function",
      description: "Function কে variable ও array তে রাখুন, নাম অনুমান কীভাবে হয় দেখুন, এবং loop এ সব function চালান।",
      code: `const square = function (n) {
  return n * n;
};

const cube = function (n) {
  return n * n * n;
};

console.log(square(4), cube(2));
console.log(square.name, typeof square);

// Function গুলোকে array তে রেখে একে একে চালানো
const operations = [square, cube];
for (const op of operations) {
  console.log(op.name, "(3) =", op(3));
}`,
    },
    {
      level: "intermediate",
      title: "Named function expression: ভেতরের নাম বনাম বাইরের নাম",
      description: "`fact` নামটি শুধু function এর ভেতরে আছে। বাইরের variable বদলে দিলেও recursion কেন ভাঙে না তা দেখুন।",
      code: `let factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};

console.log(factorial(5));
console.log("বাইরে typeof fact:", typeof fact);
console.log("name:", factorial.name);

// বাইরের variable বদলে ফেলা হলো — ভেতরের নাম নিরাপদ
const saved = factorial;
factorial = null;
console.log(saved(4));

// Strict mode: ভেতর থেকে নামটি বদলানো যায় না
const probe = function inner() {
  try {
    inner = 1;
  } catch (e) {
    console.log("inner এ assign:", e.name);
  }
};
probe();`,
    },
    {
      level: "real-world",
      title: "Form validator factory ও strategy map",
      description: "Frontend form validation এর ধাঁচ: rule গুলো function expression, `minLength` একটি factory (function ফেরত দেয়), আর `createValidator` সব rule একত্র করে একটি নতুন function বানায়।",
      code: `const required = function (value) {
  return value.trim() === "" ? "Required" : null;
};

const minLength = function (min) {
  return function (value) {
    return value.length < min ? "Min " + min + " chars" : null;
  };
};

const createValidator = function (rules) {
  return function validate(values) {
    const errors = {};
    for (const field of Object.keys(rules)) {
      for (const rule of rules[field]) {
        const message = rule(values[field]);
        if (message !== null) {
          errors[field] = message; // প্রথম error টিই রাখি
          break;
        }
      }
    }
    return errors;
  };
};

const validate = createValidator({
  name: [required],
  password: [required, minLength(8)],
});

console.log(validate({ name: "Rina", password: "secret123" }));
console.log(validate({ name: " ", password: "abc" }));`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের function expression লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
const greet = function (name) {
  return "Hello, " + name;
};

console.log(greet("JavaScript"));
`,
    },
    {
      label: "Name inference: কোথায় নাম পাওয়া যায়",
      code: `const a = function () {};
const b = function named() {};
const obj = {
  c: function () {},
  d() {},
  e: () => {},
};

let holder;
holder = function () {};

const bag = {};
bag.f = function () {}; // member assignment

console.log("a:", JSON.stringify(a.name));
console.log("b:", JSON.stringify(b.name));
console.log("c:", JSON.stringify(obj.c.name));
console.log("d:", JSON.stringify(obj.d.name));
console.log("e:", JSON.stringify(obj.e.name));
console.log("holder:", JSON.stringify(holder.name));
console.log("bag.f:", JSON.stringify(bag.f.name));
`,
    },
    {
      label: "Hoisting: var বনাম const expression",
      code: `console.log(typeof viaVar);
try {
  viaVar();
} catch (e) {
  console.log("viaVar():", e.name);
}
var viaVar = function () {};

try {
  viaConst();
} catch (e) {
  console.log("viaConst():", e.name);
}
const viaConst = function () {};
console.log(typeof viaConst);
`,
    },
    {
      label: "Conditional definition ও Strategy map",
      code: `const compact = true;

const format = compact
  ? function (n) { return String(Math.round(n)); }
  : function (n) { return n.toFixed(2); };

console.log(format(3.14159));

const strategies = {
  flat: function (price) { return price - 50; },
  percent: function (price) { return price * 0.9; },
};

for (const key of Object.keys(strategies)) {
  console.log(key, strategies[key](500));
}
`,
    },
  ],

  debugging: [
    {
      title: "ReferenceError: Cannot access 'handler' before initialization",
      bad: `button.click = handler;
const button = {};

const handler = function () {
  console.log("clicked");
};`,
      why: "`const` দিয়ে বানানো function expression এর variable declaration লাইনের আগে TDZ তে থাকে, তাই আগে ব্যবহার করলে ReferenceError। (এখানে `button` ও TDZ তে — একই কারণ।) Declaration হলে hoisting এর কারণে এটি কাজ করত; expression হলে ক্রম ঠিক রাখতে হবে: আগে তৈরি, পরে ব্যবহার।",
      fix: `const button = {};

const handler = function () {
  console.log("clicked");
};

button.click = handler;
button.click();`,
    },
    {
      title: "SyntaxError: function statement requires a name",
      bad: `function () {
  console.log("ran");
}();`,
      why: "Statement এর শুরুতে `function` থাকলে parser এটিকে **declaration** ধরে, আর declaration এ নাম লাগে — তাই SyntaxError। `(` দিয়ে ঘিরলে বা `=` এর ডানে রাখলে এটি expression হয়ে যায়। (এই ধাঁচই IIFE — পরের lesson এ বিস্তারিত।)",
      fix: `(function () {
  console.log("ran");
})();`,
    },
    {
      title: "বাইরের variable বদলে recursion ভেঙে গেল",
      bad: `let countdown = function (n) {
  if (n === 0) return "done";
  return countdown(n - 1);
};

const backup = countdown;
countdown = null;
console.log(backup(3));`,
      why: "Anonymous function এর ভেতরে `countdown` বলতে বাইরের **variable** টিকে বোঝায়, function নিজেকে নয়। বাইরের variable `null` হয়ে গেলে ভেতরের recursive call `null(...)` হয়ে TypeError দেয়। Named function expression এ ভেতরের নাম নিজের function ই বোঝায়, বাইরের variable এর ওপর নির্ভর করে না।",
      fix: `let countdown = function step(n) {
  if (n === 0) return "done";
  return step(n - 1);
};

const backup = countdown;
countdown = null;
console.log(backup(3));`,
    },
    {
      title: "ReferenceError: inner is not defined (NFE এর নাম বাইরে)",
      bad: `const run = function inner() {
  return "ফলাফল";
};

console.log(inner());`,
      why: "Named function expression এর নাম (`inner`) শুধু function এর **ভেতরের** scope এ থাকে। বাইরে function কে ডাকতে হলে যে variable এ রাখা হয়েছে সেটি (`run`) ব্যবহার করতে হয়। Declaration এর নাম বাইরের scope এ binding তৈরি করে, কিন্তু expression এর নাম করে না — এই পার্থক্যই এখানে ভুল ঘটাল।",
      fix: `const run = function inner() {
  return "ফলাফল";
};

console.log(run());`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "Function expression লিখুন",
      prompt: "`cube` নামে একটি `const` variable এ function expression বানান যা `n` এর ঘন (`n * n * n`) return করে। `console.log(cube(3))` এ `27` print হবে।",
      starter: `// TODO: const cube = function ...

console.log(cube(3));`,
      expected: "27",
      hints: ["`const cube = function (n) { ... };` — শেষে `;` দিন।", "`return n * n * n;`"],
      solution: `const cube = function (n) {
  return n * n * n;
};

console.log(cube(3));`,
    },
    {
      level: "beginner",
      title: "ReferenceError ঠিক করুন: ক্রম বদলান",
      prompt: "নিচের কোড `ReferenceError` দেয়। function expression টি যেমন আছে তেমনই রেখে শুধু লাইনের **ক্রম** বদলে `Hi, Rina` print করান।",
      starter: `console.log(hello("Rina"));

const hello = function (name) {
  return "Hi, " + name;
};`,
      expected: "Hi, Rina",
      hints: ["`const` expression এর variable declaration এর আগে TDZ তে থাকে।", "`console.log` লাইনটি নিচে নিন।"],
      solution: `const hello = function (name) {
  return "Hi, " + name;
};

console.log(hello("Rina"));`,
      explanation: "Expression hoisted নয়, তাই ব্যবহারের আগে তার লাইন চলতে হবে। Declaration হলে ক্রম বদলানোর দরকার হতো না।",
    },
    {
      level: "beginner",
      title: "অনুমান করা ও স্পষ্ট নাম",
      prompt: "নিচে দুটি function আছে। এক লাইনের `console.log` দিয়ে `add` ও `mul` এর `name` property একসাথে print করুন — output হবে `add multiply` (দ্বিতীয়টির নাম ভেতরের নাম থেকে আসে)।",
      starter: `const add = function (a, b) {
  return a + b;
};

const mul = function multiply(a, b) {
  return a * b;
};

// TODO`,
      expected: "add multiply",
      hints: ["`add.name` ও `mul.name`।", "Named expression এ `name` হয় ভেতরের নাম, বাইরের variable এর নয়।"],
      solution: `const add = function (a, b) {
  return a + b;
};

const mul = function multiply(a, b) {
  return a * b;
};

console.log(add.name, mul.name);`,
    },
    {
      level: "intermediate",
      title: "Function এর array দিয়ে pipeline",
      prompt: "`steps` array তে তিনটি function expression রাখুন: (১) `trim`, (২) uppercase, (৩) শেষে `\"!\"` যোগ। তারপর `\"  hello \"` কে পরপর সব step এর মধ্য দিয়ে চালিয়ে `HELLO!` print করুন।",
      starter: `const steps = [
  // TODO: তিনটি function expression
];

const result = steps.reduce(function (value, fn) {
  return fn(value);
}, "  hello ");

console.log(result);`,
      expected: "HELLO!",
      hints: ["প্রতিটি step একটি string নিয়ে নতুন string ফেরত দেবে।", "`function (s) { return s.trim(); }`, `function (s) { return s.toUpperCase(); }` ..."],
      solution: `const steps = [
  function (s) { return s.trim(); },
  function (s) { return s.toUpperCase(); },
  function (s) { return s + "!"; },
];

const result = steps.reduce(function (value, fn) {
  return fn(value);
}, "  hello ");

console.log(result);`,
      explanation: "Function মান বলেই array তে রাখা যায়, এবং `reduce` প্রতিবার একটি করে function চালায়। এটিই middleware/pipeline এর মূল ধারণা।",
    },
    {
      level: "intermediate",
      title: "Named expression দিয়ে নিরাপদ recursion",
      prompt: "`sumTo` কে function expression এ লিখুন যা `1 + 2 + ... + n` recursion দিয়ে বের করে। ভেতরের নাম `sum` দিন। তারপর `sumTo` কে `null` করেও `other(4)` থেকে `10` print হতে হবে।",
      starter: `let sumTo = function sum(n) {
  // TODO: recursion, ভেতরের নাম sum ব্যবহার করুন
};

const other = sumTo;
sumTo = null;
console.log(other(4));`,
      expected: "10",
      hints: ["Base case: `n <= 0` হলে `0`।", "`return n + sum(n - 1);` — বাইরের `sumTo` নয়, ভেতরের `sum`।"],
      solution: `let sumTo = function sum(n) {
  if (n <= 0) return 0;
  return n + sum(n - 1);
};

const other = sumTo;
sumTo = null;
console.log(other(4));`,
      explanation: "ভেতরের `sum` নামটি function নিজেকেই বোঝায়, তাই বাইরের variable `null` হলেও recursion অক্ষত থাকে।",
    },
    {
      level: "challenge",
      title: "Real-world: Form validator factory",
      prompt:
        "তিনটি অংশ সম্পূর্ণ করুন। `required(value)`: `value.trim()` ফাঁকা হলে `\"Required\"`, নইলে `null`। `minLength(min)`: একটি function ফেরত দেয়, যা `value.length < min` হলে `\"Min \" + min + \" chars\"`, নইলে `null` দেয়। `createValidator(rules)`: এমন `validate(values)` ফেরত দেয় যা প্রতিটি field এর rule গুলো ক্রমে চালিয়ে **প্রথম error** টি `errors[field]` এ রাখে এবং `errors` object ফেরত দেয়।",
      starter: `const required = function (value) {
  // TODO
};

const minLength = function (min) {
  // TODO: function ফেরত দিন
};

const containsAt = function (value) {
  return value.includes("@") ? null : "Must contain @";
};

const createValidator = function (rules) {
  // TODO: validate(values) function ফেরত দিন
};

const validate = createValidator({
  email: [required, containsAt],
  password: [required, minLength(8)],
});

console.log(validate({ email: "rina.example.com", password: "123" }));
console.log(validate({ email: "a@b.c", password: "12345678" }));
console.log(validate({ email: "", password: "" }));`,
      expected: "{ email: 'Must contain @', password: 'Min 8 chars' }\n{}\n{ email: 'Required', password: 'Required' }",
      hints: ["`rules` এর প্রতিটি field এর জন্য `for (const field of Object.keys(rules))` লুপ।", "ভেতরে প্রতিটি rule চালান: `const message = rule(values[field]);` — `null` না হলে `errors[field] = message; break;`।", "`minLength` এ একটি function ফেরত দিতে হবে (closure এ `min` ধরে রাখে)।"],
      solution: `const required = function (value) {
  return value.trim() === "" ? "Required" : null;
};

const minLength = function (min) {
  return function (value) {
    return value.length < min ? "Min " + min + " chars" : null;
  };
};

const containsAt = function (value) {
  return value.includes("@") ? null : "Must contain @";
};

const createValidator = function (rules) {
  return function validate(values) {
    const errors = {};
    for (const field of Object.keys(rules)) {
      for (const rule of rules[field]) {
        const message = rule(values[field]);
        if (message !== null) {
          errors[field] = message;
          break;
        }
      }
    }
    return errors;
  };
};

const validate = createValidator({
  email: [required, containsAt],
  password: [required, minLength(8)],
});

console.log(validate({ email: "rina.example.com", password: "123" }));
console.log(validate({ email: "a@b.c", password: "12345678" }));
console.log(validate({ email: "", password: "" }));`,
      explanation: "Rule গুলো ছোট ছোট function মান; `minLength` একটি factory যা configure করা function ফেরত দেয়; `createValidator` rule গুলো একত্র করে নতুন function বানায়। ফর্ম লাইব্রেরি (Zod/Yup/React Hook Form validators) এর ভেতরের ধারণার সরল রূপ।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`const f = function g() {}; console.log(typeof g);` কী print করবে?",
        options: ["\"function\"", "\"undefined\"", "ReferenceError", "\"object\""],
        answer: 1,
        explanation:
          "Named function expression এর নাম `g` শুধু function এর ভেতরের scope এ থাকে; বাইরে `g` declared নয়। `typeof` undeclared নামে error না দিয়ে `\"undefined\"` দেয়। `\"function\"` হতো যদি `f` লেখা হতো বা `g` declaration হতো। ReferenceError আসত `g` সরাসরি পড়লে (`console.log(g)`), `typeof g` এ নয়।",
      },
      {
        question: "`console.log(typeof h); const h = function () {};` এর ফল কী?",
        options: ["\"undefined\"", "\"function\"", "TypeError", "ReferenceError"],
        answer: 3,
        explanation:
          "`const h` TDZ তে থাকে, আর TDZ তে থাকা নামে `typeof` ও ReferenceError ছোড়ে (শুধু সম্পূর্ণ undeclared নামে `typeof` নিরাপদ)। `\"undefined\"` হতো `var h` হলে। `\"function\"` হতো declaration হলে। TypeError আসত `var h; h()` এর মতো `undefined` কে call করলে।",
      },
      {
        question: "`const sum = function (a, b) { return a + b; }; console.log(sum.name);` সাধারণভাবে কী দেখায়?",
        options: ["\"sum\"", "\"\" (খালি string)", "\"anonymous\"", "undefined"],
        answer: 0,
        explanation:
          "ES2015 এর function name inference অনুযায়ী `const x = <anonymous function>` এ function এর `name` হয় `\"x\"`। খালি string হতো যদি inference না ঘটত (যেমন কিছু member assignment)। `\"anonymous\"` আসে `new Function(...)` দিয়ে বানালে। `name` সবসময় string, তাই `undefined` নয়।",
      },
      {
        question: "কোন বর্ণনাটি সঠিক?",
        options: [
          "Function expression ও declaration দুটিই পুরোপুরি hoisted",
          "Statement এর শুরুতে `function` থাকলে সেটি expression ধরা হয়",
          "`(function () {})` তে parentheses থাকায় এটি expression, declaration নয়",
          "Expression এ function এর নাম দেওয়া যায় না",
        ],
        answer: 2,
        explanation:
          "Parentheses এর ভেতরে মান আশা করা হয়, তাই `function` সেখানে expression। প্রথম অপশন ভুল — শুধু declaration full hoisted। দ্বিতীয়টি উল্টো — statement এর শুরুতে `function` থাকলে declaration ধরা হয়। চতুর্থটি ভুল — named function expression আছে।",
      },
      {
        question: "Anonymous function expression এর বদলে named function expression ব্যবহারের সবচেয়ে বাস্তব সুবিধা কোনটি?",
        options: [
          "এটি বাইরের scope এও ওই নামে একটি variable তৈরি করে",
          "ভেতর থেকে নিজেকে নিরাপদে ডাকা যায় এবং stack trace এ স্পষ্ট নাম পাওয়া যায়",
          "এটি hoisted হয়ে declaration এর মতো আগে ব্যবহারযোগ্য হয়",
          "এটি arrow function এর মতো lexical `this` পায়",
        ],
        answer: 1,
        explanation:
          "NFE এর নাম ভেতরের scope এ থাকায় recursion নিরাপদ এবং debugging এ নাম পরিষ্কার। প্রথম অপশন ভুল — নাম বাইরে যায় না। তৃতীয়টি ভুল — expression hoisted নয়, নাম দেওয়া সেটি বদলায় না। চতুর্থটি ভুল — `this` এর আচরণ regular function এর মতোই, arrow এর মতো নয়।",
      },
    ],
    coding: [
      {
        title: "Operation table",
        prompt: "`operations` object এ `add`, `sub`, `mul` নামে তিনটি function expression রাখুন। `calculate(op, a, b)` লিখুন, যা `op` থাকলে ফল, নইলে `null` ফেরত দেয় (`Object.hasOwn` ব্যবহার করুন)। `calculate(\"add\", 3, 4)`, `calculate(\"mul\", 3, 4)`, `calculate(\"pow\", 3, 4)` — তিনটি আলাদা লাইনে `7`, `12`, `null` print করুন।",
        starter: `const operations = {
  // TODO: add, sub, mul
};

function calculate(op, a, b) {
  // TODO
}

console.log(calculate("add", 3, 4));
console.log(calculate("mul", 3, 4));
console.log(calculate("pow", 3, 4));`,
        expected: "7\n12\nnull",
        solution: `const operations = {
  add: function (a, b) { return a + b; },
  sub: function (a, b) { return a - b; },
  mul: function (a, b) { return a * b; },
};

function calculate(op, a, b) {
  if (!Object.hasOwn(operations, op)) {
    return null;
  }
  return operations[op](a, b);
}

console.log(calculate("add", 3, 4));
console.log(calculate("mul", 3, 4));
console.log(calculate("pow", 3, 4));`,
      },
      {
        title: "Named expression দিয়ে factorial",
        prompt: "`const factorial = function fact(n) {...}` এ recursion ব্যবহার করে factorial লিখুন। `factorial(5)` এর ফল `120` এবং বাইরে `typeof fact` এর ফল `undefined` — দুটি আলাদা লাইনে print করুন।",
        starter: `const factorial = function fact(n) {
  // TODO
};

console.log(factorial(5));
console.log(typeof fact);`,
        expected: "120\nundefined",
        solution: `const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};

console.log(factorial(5));
console.log(typeof fact);`,
      },
    ],
  },

  interview: [
    {
      q: "Function declaration ও function expression এর মধ্যে পার্থক্য কী?",
      a: "মূল পার্থক্য তিনটি: **syntax/parsing**, **hoisting**, এবং **নাম**।\n\nParser: statement এর শুরুতে `function` থাকলে declaration; অন্য যেকোনো মান-বসানোর জায়গায় (`=` এর ডান, argument, `(` এর ভেতরে) expression। Hoisting: declaration এ নাম ও function object দুটোই creation phase এ তৈরি হয়, তাই আগে call করা যায়; expression এ function তৈরি হয় ওই লাইন চলার সময়, আর যে variable এ রাখা হয় তার নিয়ম (`var` → `undefined`, `let`/`const` → TDZ) প্রযোজ্য।\n\nনাম: declaration এর নাম বাইরের scope এ binding তৈরি করে; named expression এর নাম শুধু ভেতরের scope এ থাকে। বাস্তবে: top-level named function এ declaration, মান-সদৃশ বা শর্তসাপেক্ষ ব্যবহারে expression/arrow।",
    },
    {
      q: "Named function expression কী এবং কেন ব্যবহার করবেন?",
      a: "`const f = function fact(n) { ... fact(n - 1) ... }` — এখানে `fact` হলো function এর নিজের নাম, যা spec অনুযায়ী function এর চারপাশের একটি আলাদা ছোট scope এ থাকে। এই নাম বাইরের scope এ দেখা যায় না।\n\nসুবিধা: (১) recursion নির্ভরযোগ্য — বাইরের variable `f` reassign বা `null` হলেও ভেতরের `fact` একই function কে বোঝায়; (২) stack trace ও DevTools এ স্পষ্ট নাম (আধুনিক engine anonymous expression এ নাম অনুমান করলেও inline callback এ স্পষ্ট নাম পড়তে সাহায্য করে); (৩) strict mode এ নামটি ভেতর থেকে reassign করা যায় না (TypeError), তাই ঘটনাক্রমে বদলানোর ঝুঁকি নেই। বিনিময়ে লেখা সামান্য বাড়ে।",
    },
    {
      q: "কেন `var f = function(){}` কে declaration এর আগে call করলে TypeError আসে, আর `const f = ...` এ ReferenceError?",
      a: "দুটি ক্ষেত্রেই function object তৈরি হয় execution phase এ, যখন assignment লাইন চলে। কিন্তু variable এর নিজস্ব hoisting আচরণ আলাদা।\n\n`var f` creation phase এ `undefined` দিয়ে initialize হয়, তাই `f()` মানে `undefined()` — ‘f is not a function’ TypeError। `const f` (বা `let`) creation phase এ নথিভুক্ত হয় কিন্তু uninitialized — Temporal Dead Zone এ থাকে, access করলেই ReferenceError (‘Cannot access before initialization’)। Variables lesson এর hoisting ও TDZ ধারণার সরাসরি প্রয়োগ। এই কারণেই modern কোডে `const` + expression পছন্দনীয়: ভুল ক্রম সাথে সাথে স্পষ্ট error দেয়, `undefined` নিয়ে নীরবে এগোয় না।",
    },
    {
      q: "Parentheses ছাড়া `function () {}()` কেন SyntaxError, আর `(function () {})()` কেন কাজ করে?",
      a: "Parser statement এর শুরুতে `function` দেখলে সেটিকে **declaration** হিসেবে parse করতে চায়। Declaration এ নাম বাধ্যতামূলক (একমাত্র ব্যতিক্রম `export default function () {}`), আর শেষে `()` ও অসম্পূর্ণ — তাই SyntaxError।\n\n`( ... )` এর ভেতরে parser একটি **expression** আশা করে, তাই `function () {}` সেখানে function expression হিসেবে parse হয়। তার পরে `()` যোগ করলে সেই expression এর ফল (function object) সাথে সাথে call হয়। একে IIFE বলে। বিকল্প হিসেবে `!function(){}()` বা `void function(){}()` ও পুরোনো কোডে দেখা যায়, যাতে `!`/`void` এর পরে expression আশা করা হয়। আজকের কোডে ES Module/block scope থাকায় IIFE এর প্রয়োজন অনেক কমেছে — IIFE lesson এ বিস্তারিত।",
    },
    {
      q: "Object এ `greet: function () {}` আর `greet() {}` (method shorthand) এর পার্থক্য কী?",
      a: "দুটিই object এ `greet` নামে function রাখে এবং `obj.greet()` ডাকা যায়, কিন্তু shorthand method একটু ভিন্ন: এটি constructor হয় না (`new obj.greet()` TypeError), তার কোনো `prototype` property থাকে না, এবং ভেতরে `super` ব্যবহার করা যায় (যা class ও object inheritance এ কাজে লাগে)। সাধারণ function expression `new` এর যোগ্য এবং `prototype` থাকে।\n\nআধুনিক কোডে object method এ shorthand প্রায় সবসময় পছন্দনীয় — সংক্ষিপ্ত এবং ‘এটি method, constructor নয়’ বার্তা পরিষ্কার। দুটিতেই `this` নির্ধারিত হয় call-site দিয়ে — `obj.greet()` এ `this` হয় `obj`; আর arrow function property (`greet: () => {}`) এ আলাদা আচরণ, যা Arrow Functions ও this keyword lesson এ আছে।",
    },
  ],

  summary: {
    takeaways: [
      "`function` keyword statement এর শুরুতে থাকলে declaration, মান বসানোর জায়গায় থাকলে expression।",
      "Function expression execution phase এ তৈরি হয় — hoisted নয়; `var` → `undefined`/TypeError, `let`/`const` → TDZ/ReferenceError।",
      "Named function expression এর নাম শুধু ভেতরে দেখা যায় — নিরাপদ recursion ও ভালো debugging।",
      "Function মান বলে array, object, argument ও return value হিসেবে ব্যবহার করা যায় (pipeline, handler table, factory)।",
      "শর্তসাপেক্ষ function এর জন্য block এর declaration নয়, `const f = cond ? a : b` বা expression ব্যবহার করুন।",
      "`(function(){})()` এর parentheses declaration কে expression বানায় — IIFE এর ভিত্তি; object এ আধুনিক ধাঁচ হলো method shorthand।",
    ],
    syntax: `const anon = function (a, b) { return a + b; };       // anonymous
const named = function fact(n) { return n <= 1 ? 1 : n * fact(n - 1); };

const handlers = {
  save: function (data) {},   // property হিসেবে
  load(data) {},              // method shorthand
};

(function () { /* IIFE — আলাদা lesson */ })();`,
    whenToUse: [
      "Function কে মান হিসেবে বানাতে বা শর্ত অনুযায়ী বেছে নিতে (`const f = cond ? a : b`)।",
      "Recursion বা স্পষ্ট stack trace চাইলে named function expression।",
      "Object এর method এ shorthand (`method() {}`)।",
      "Top-level named utility তে declaration, inline callback এ arrow — expression মাঝামাঝি পরিস্থিতিতে।",
    ],
    next: ["Arrow Functions — সংক্ষিপ্ত syntax, lexical `this` ও কখন ব্যবহার করবেন না", "IIFE — immediately invoked function expression ও module এর আগের যুগ", "Closures — factory function (`minLength`) এ `min` কীভাবে বেঁচে থাকে", "this keyword — method এ `this` কীভাবে নির্ধারিত হয়"],
  },

  compatibility:
    "Function expression ও named function expression ECMAScript এর শুরু থেকেই আছে; method shorthand ES2015+। সব আধুনিক browser ও Node.js এ আচরণ একই। Function name inference (ES2015) কিছু পুরোনো engine এ নেই — তাই এমন পুরোনো পরিবেশ লক্ষ্য করলে `fn.name` এর ওপর নির্ভর না করাই ভালো। এই Playground browser-like Web Worker এ strict mode এ চলে।",
};
