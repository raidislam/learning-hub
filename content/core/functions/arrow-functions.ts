import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Arrow function এর সব syntax রূপ (implicit return, একক parameter, object literal ফেরত দেওয়া) সঠিকভাবে লিখতে ও পড়তে পারবেন।",
    "Arrow function যে regular function এর শুধু ‘ছোট রূপ’ নয় — `this`, `arguments`, `super`, `new.target` নিজের নেই, `new` করা যায় না, `prototype` নেই — তা ব্যাখ্যা করতে পারবেন।",
    "**Lexical `this`** ধারণাটি scope chain এর ভাষায় বুঝবেন এবং callback এ `this` হারানোর সমস্যা arrow দিয়ে ঠিক করতে পারবেন।",
    "কোথায় arrow **ব্যবহার করা উচিত নয়** (object method, prototype method, dynamic `this` লাগে এমন handler) তা চিনতে পারবেন।",
    "React-style callback ও দীর্ঘ method chain এ arrow ব্যবহারের readability ও identity সংক্রান্ত বিবেচনা প্রয়োগ করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Arrow function কী এবং কেন এল?" },
    {
      type: "p",
      text: "ES2015 (ES6) এ যোগ হওয়া **arrow function** হলো function expression লেখার একটি সংক্ষিপ্ত রূপ: `(a, b) => a + b`। কিন্তু এর আসল গুরুত্ব সংক্ষিপ্ততায় নয় — গুরুত্ব হলো এর **আচরণে ভিন্নতা**। ES2015 এর আগে callback এর ভেতরে `this` হারিয়ে যাওয়া একটি নিত্যদিনের সমস্যা ছিল (`var self = this;` বা `.bind(this)` দিয়ে সামলাতে হতো)। Arrow function এই সমস্যার সমাধান হিসেবে ডিজাইন হয়েছে: এটি নিজে `this` তৈরি করে না, চারপাশ থেকে ধার নেয়।",
    },
    { type: "h3", text: "Syntax এর রূপগুলো" },
    {
      type: "code",
      code: `// ১) সম্পূর্ণ রূপ: block body, স্পষ্ট return
const add = (a, b) => {
  return a + b;
};

// ২) Implicit return: শুধু একটি expression হলে { } ও return বাদ
const add2 = (a, b) => a + b;

// ৩) একটি মাত্র parameter হলে () ঐচ্ছিক
const double = n => n * 2;

// ৪) Parameter না থাকলে () বাধ্যতামূলক
const now = () => "এখন";

// ৫) Object literal ফেরত দিতে হলে () দিয়ে ঘিরুন
const makeUser = name => ({ name, active: true });

// ৬) Async arrow
const load = async id => id;`,
      caption: "Syntax রূপ। এটি runnable নয়; নিচের Examples ও Playground এ চালিয়ে দেখুন।",
    },
    {
      type: "ul",
      items: [
        "**Implicit return:** `=>` এর পরে `{` না থাকলে ডানের পুরো expression ই return value।",
        "**`{` এ ফাঁদ:** `n => { a: 1 }` লিখলে `{ }` কে function **block** ধরা হয় এবং `a:` একটি label — ফলে function `undefined` ফেরত দেয়। Object ফেরত দিতে `n => ({ a: 1 })`।",
        "**`=>` এর আগে line break চলে না:** parameter list ও `=>` একই লাইনে থাকতে হয় (নইলে SyntaxError)। `=>` এর পরে লাইন ভাঙা যায়।",
        "Arrow সবসময় **expression** — declaration এর মতো hoist হয় না; `const f = () => {}` এ `f` TDZ এর নিয়মে চলে (Function Expression lesson দেখুন)।",
        "Arrow এর নিজের নাম নেই, তবে `const f = () => {}` এ name inference এ `f.name === \"f\"`।",
      ],
    },
    { type: "h3", text: "Regular function থেকে আসল পার্থক্য" },
    {
      type: "compare",
      headers: ["বিষয়", "Regular function (`function`)", "Arrow function"],
      rows: [
        ["নিজস্ব `this`", "আছে (call এর ধরন অনুযায়ী নির্ধারিত)", "**নেই** — চারপাশের scope থেকে নেয় (lexical)"],
        ["নিজস্ব `arguments`", "আছে", "**নেই** — চারপাশের function এরটি দেখে"],
        ["`super` / `new.target`", "নিজের (method হলে `super`)", "**নেই** — চারপাশেরটি ব্যবহার করে"],
        ["`new` দিয়ে constructor", "পারে", "**পারে না** (`TypeError`)"],
        ["`prototype` property", "আছে", "**নেই**"],
        ["Generator (`function*`)", "হতে পারে", "**পারে না**"],
        ["`call` / `apply` / `bind` দিয়ে `this` বদলানো", "বদলায়", "`this` বদলায় না (argument গুলো কাজ করে)"],
        ["Hoisting", "Declaration হলে পুরো", "নেই (expression)"],
      ],
    },
    {
      type: "p",
      text: "‘Arrow এ `arguments` নেই’ বলতে বোঝায় arrow নিজে নতুন `arguments` object বানায় না; ভেতরে `arguments` লিখলে চারপাশের কোনো regular function এর `arguments` ই দেখা যায় (scope chain এর নিয়মে)। আধুনিক কোডে এর বদলে **rest parameter** (`(...args) => ...`) ব্যবহার করুন — এটি সব function এ কাজ করে এবং আসল array দেয়।",
    },
    { type: "h3", text: "Lexical `this` — conceptual ব্যাখ্যা" },
    {
      type: "p",
      text: "Regular function এ `this` একটি বিশেষ binding, যার মান ঠিক হয় **function টি কীভাবে call করা হলো** তার ওপর (`obj.fn()` হলে `obj`, সাধারণ call হলে strict mode এ `undefined`, ইত্যাদি — পুরো নিয়ম **this keyword** lesson এ)। Arrow function এ এমন কোনো নিজস্ব `this` binding তৈরিই হয় না। তাই arrow এর ভেতরে `this` লিখলে engine সেটিকে অন্য সাধারণ variable এর মতোই **scope chain ধরে বাইরে খুঁজতে যায়** এবং কাছের enclosing function (বা top-level) এর `this` পায়। একে বলে **lexical this** — ‘lexical’ কারণ এটি নির্ধারিত হয় কোড **কোথায় লেখা হয়েছে** তার ওপর, কীভাবে call হয়েছে তার ওপর নয়।",
    },
    {
      type: "p",
      text: "ব্যবহারিক ফল: একটি method এর ভেতরে callback দিলে (array method, `setTimeout`, promise `.then`), সেই callback arrow হলে `this` বলতে method এর `this` ই বোঝায় — হারায় না। আর regular function callback হলে `this` নির্ভর করে callback কে কে call করছে তার ওপর (array method সাধারণত `this` হিসেবে `undefined` দেয়, যদি আলাদা `thisArg` না দেওয়া হয়; `setTimeout` এর ক্ষেত্রে strict mode এ `undefined`, আর non-strict এ environment ভেদে global object বা অন্য কিছু)। নিচের Examples এ ঠিক এটিই চালিয়ে দেখানো হয়েছে।",
    },
    {
      type: "callout",
      tone: "info",
      title: "‘Arrow এর `this` bind করা’ — এটি ঠিক বর্ণনা নয়",
      text: "অনেকে বলেন ‘arrow `this` কে bind করে রাখে’। আরও নির্ভুল কথা: arrow এর কোনো `this` ই নেই; `this` একটি সাধারণ identifier এর মতো scope chain এ বাইরের দিকে খোঁজা হয়। ফলে `arrow.call(obj)` বা `arrow.bind(obj)` দিয়ে `this` বদলানো যায় না — এই কারণেই এটি নির্ভরযোগ্য, আবার এই কারণেই dynamic `this` দরকার হলে অনুপযুক্ত।",
    },
    { type: "h3", text: "কখন arrow ব্যবহার **করবেন না**" },
    {
      type: "ol",
      items: [
        "**Object এর method:** `{ name: \"Rina\", greet: () => this.name }` — এখানে arrow এর `this` object টি নয়, বরং object literal যেখানে লেখা হয়েছে সেই scope এর `this` (module/script এর top-level এ সাধারণত `undefined` বা global object — environment ভেদে ভিন্ন)। Method shorthand (`greet() {...}`) ব্যবহার করুন।",
        "**Prototype/class এর পদ্ধতি:** `Person.prototype.say = () => ...` এ `this` instance হবে না। Class এর method ও shorthand এ লিখুন। (Class field হিসেবে `handle = () => {...}` একটি আলাদা ধাঁচ: field initializer এর ভেতরের `this` হলো নতুন instance, তাই প্রতি instance এ আলাদা function তৈরি হয় ও instance এ বাঁধা থাকে — পুরোনো React class component এ প্রচলিত ছিল।)",
        "**যে handler এ call-site এর `this` দরকার:** কিছু library (jQuery-ধাঁচের API, পুরোনো DOM `addEventListener` এ `this` কে element হিসেবে ব্যবহার) callback এর `this` সেট করে দেয়। Arrow সেটি উপেক্ষা করে; তখন event object (`event.currentTarget`) ব্যবহার করুন বা regular function রাখুন।",
        "**Constructor ও generator:** `new` ও `function*` arrow এ সম্ভব নয়।",
        "**`arguments` নির্ভর পুরোনো কোড** বা যেখানে function এর নিজস্ব `arguments` দরকার — rest parameter ব্যবহার করুন।",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "সাধারণ ভুল ধারণা",
      text: "(১) ‘Arrow সব জায়গায় regular function এর ভালো বিকল্প’ — না; `this`-নির্ভর জায়গায় ভুল ফল দেয়। (২) ‘Arrow দ্রুততর’ — পারফরম্যান্স এর ওপর নির্ভর করার মতো পার্থক্য নেই; বাছাই করুন আচরণ ও readability দেখে। (৩) ‘Arrow এ `this` সবসময় global’ — না, এটি **enclosing scope এর** `this`। (৪) ‘Implicit return এ `{}` লিখলে object ফেরত আসে’ — না, `{}` তখন block।",
    },
    { type: "h3", text: "React-style callback ও identity" },
    {
      type: "p",
      text: "React এ inline arrow handler অত্যন্ত প্রচলিত: `onClick={() => remove(item.id)}`। Handler এর ভেতরে `this` লাগে না — arrow এর lexical scope থেকে `item`, `remove` এর মতো variable (closure) পাওয়াই আসল সুবিধা। তবে প্রতিটি render এ `() => ...` একটি **নতুন function object** তৈরি করে — অর্থাৎ নতুন identity। সাধারণ DOM element এ এটি সমস্যা নয়, কিন্তু `React.memo` করা child component বা `useEffect`/`useCallback` এর dependency তে এটি অপ্রয়োজনীয় re-render/re-run ঘটাতে পারে; তখন `useCallback` বা handler কে স্থিত করার কথা ভাবা হয়। এটি React এর বিষয়, তাই এখানে শুধু ধারণাটুকু; এই Playground এ DOM বা React চলে না।",
    },
    {
      type: "code",
      code: `// ধারণা দেখানোর জন্য JSX — এই Playground এ চলবে না
function TodoList({ todos, onRemove }) {
  return todos.map(todo => (
    <li key={todo.id} onClick={() => onRemove(todo.id)}>
      {todo.title}
    </li>
  ));
}`,
      caption: "React component (JSX) — non-executed। `todo` ও `onRemove` closure থেকে আসছে; `this` এর প্রয়োজন নেই।",
    },
    { type: "h3", text: "Readability: যেখানে arrow ভালো, যেখানে নয়" },
    {
      type: "ul",
      items: [
        "ছোট callback (`items.filter(x => x.active)`) এ arrow অনেক পরিষ্কার।",
        "লম্বা chain (`.filter().map().reduce()`) এ প্রতিটি ধাপ আলাদা লাইনে লিখুন; জটিল callback কে **নাম দিন** (`const isOverdue = task => ...`) যাতে chain পড়া যায় গল্পের মতো।",
        "Curried arrow (`a => b => c => ...`) সংক্ষিপ্ত, কিন্তু তিনের বেশি স্তরে পড়া কঠিন হয়ে যায়।",
        "Top-level named function এ declaration প্রায়ই পরিষ্কার — hoisting ও নামযুক্ত stack trace সুবিধাসহ। `const` + arrow ও বৈধ এবং অনেক team এর convention; দুটোই চলে, কিন্তু একটি project এ একটি ধাঁচে লেখা ভালো।",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Browser ও Node.js",
      text: "Arrow function সব আধুনিক browser ও Node.js (Node 4+ এ মূল সাপোর্ট, আজ সব সংস্করণে) এ একই আচরণ করে। Top-level `this` এর মান environment ভেদে ভিন্ন: browser classic script এ global object (`window`), ES Module এ `undefined`, Node.js CommonJS এ `module.exports`। তাই top-level এ লেখা arrow এ `this` ব্যবহারে সতর্ক থাকুন। এই Playground এ কোড strict mode এ একটি Web Worker এ চলে।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ধরুন আপনি একটি কোম্পানিতে কাজ করেন। প্রতিটি কর্মীর (function) একটি **নিজস্ব পরিচয়পত্র (`this`)** আছে — যেখানে লেখা থাকে ‘আমি কার হয়ে কাজ করছি’। এই পরিচয়পত্র কর্মীকে **কে ডেকেছে** তার ওপর নির্ভর করে বদলায় (regular function)।",
    },
    {
      type: "ul",
      items: [
        "**Regular function = সাধারণ কর্মী।** প্রতিবার কাজে ডাকার সময় তাকে একটি নতুন পরিচয়পত্র দেওয়া হয়। ম্যানেজার (`obj`) ডাকলে কার্ডে ম্যানেজারের নাম; কোনো ম্যানেজার ছাড়া সাধারণ ডাকে (strict mode) কার্ড ফাঁকা (`undefined`)।",
        "**Arrow function = ম্যানেজারের সহকারী (intern) যার নিজের কার্ড নেই।** কেউ জিজ্ঞেস করলে সে **নিজের কার্ড না দেখিয়ে সে যে ম্যানেজারের টেবিলে বসে আছে, তার কার্ডই দেখায়** — এটি lexical `this`। সহকারী কোথায় বসে তা ঠিক হয়েছে তাকে নিয়োগের সময় (কোড লেখার জায়গা), পরে কে ডাকছে তাতে নয়।",
        "**Callback = ম্যানেজার একটি কাজ কাউকে (timer, array method) দিয়ে বলল ‘পরে করে দিও’।** যদি সাধারণ কর্মী (regular function) কে দেওয়া হয়, তাকে যে ডাকছে (timer) সে তার নিজের কার্ড বসিয়ে দেয় — ম্যানেজারের পরিচয় হারিয়ে যায়। সহকারী (arrow) কে দিলে সে সবসময় ম্যানেজারের কার্ড দেখাতে পারে।",
        "**কেন arrow `new` করা যায় না?** ‘নতুন কর্মী নিয়োগ’ (constructor) এর জন্য একটি **কর্মী-নমুনা (`prototype`)** ও নিজস্ব পরিচয় লাগে — সহকারীর এ দুটোর কোনোটিই নেই।",
        "**কেন object method এ arrow ঠিক নয়?** ম্যানেজার চাইছে ‘আমার নামে এই কাজটি করো’ (`obj.method()`), কিন্তু সহকারী নিজের টেবিলের কার্ড (object যেখানে লেখা সেই scope) দেখাচ্ছে, ম্যানেজারের নয়।",
        "**`call`/`bind` এ কার্ড বদলানো** — সহকারীর কার্ড নেই বলে সেখানে নতুন কার্ড পরানোর চেষ্টা কোনো কাজ করে না।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "Lexical this: arrow কোথা থেকে `this` পায়?",
      caption: "কোড: object এর `list()` method এর ভেতরে `this.items.forEach(callback)` — callback arrow হলে বনাম regular function হলে।",
      nodes: [
        { id: "callback", label: "Callback", sub: "forEach এর ভেতরের function" },
        { id: "method", label: "list() method", sub: "enclosing function" },
        { id: "outer", label: "বাইরের scope", sub: "module / script" },
      ],
      steps: [
        {
          active: ["method"],
          items: { callback: [], method: ["this = cart (cart.list() call এর কারণে)"], outer: ["this = (environment নির্ভর)"] },
          note: "`cart.list()` call হলো — method এর নিজস্ব `this` হলো `cart`। এখনো callback তৈরি হয়নি।",
        },
        {
          active: ["callback", "method"],
          items: { callback: ["arrow: নিজস্ব this নেই", "→ বাইরে খোঁজা হচ্ছে"], method: ["this = cart  ← পাওয়া গেল"], outer: ["this = (দরকার হয়নি)"] },
          note: "**Arrow callback:** `this` এর জন্য নিজের scope এ কিছু না পেয়ে scope chain ধরে বাইরে গেল এবং `list()` এর `this` (= `cart`) পেল। কোনো bind লাগেনি।",
        },
        {
          active: ["callback"],
          items: { callback: ["regular: নিজস্ব this আছে", "this = undefined (forEach এ thisArg নেই, strict mode)"], method: ["this = cart  (ব্যবহৃত হলো না)"], outer: [] },
          note: "**Regular callback:** এর নিজের `this` আছে, যার মান ঠিক করে `forEach` কীভাবে callback টি call করে — `thisArg` না দিলে `undefined` (strict mode)। ফলে `this.owner` পড়লে `TypeError`। এখানে scope chain এ বাইরে যাওয়ার প্রশ্নই ওঠে না।",
        },
        {
          active: ["method"],
          items: { callback: ["arrow → cart.owner ✔", "regular → TypeError ✘"], method: ["this = cart"], outer: [] },
          note: "সারাংশ: Arrow এর `this` নির্ধারিত হয় **কোথায় লেখা** তা দিয়ে (lexical); regular এর `this` নির্ধারিত হয় **কীভাবে call হলো** তা দিয়ে (dynamic)।",
        },
      ],
    },
    {
      kind: "memory-steps",
      title: "একই function এর চার রূপ: ক্রমশ সংক্ষিপ্ত",
      code: "const d1 = function (n) { return n * 2; };\nconst d2 = (n) => { return n * 2; };\nconst d3 = n => n * 2;\nconst d4 = () => ({ ok: true });",
      steps: [
        {
          line: -1,
          memory: [
            { name: "d1", value: "", kind: "const", state: "tdz" },
            { name: "d2", value: "", kind: "const", state: "tdz" },
            { name: "d3", value: "", kind: "const", state: "tdz" },
            { name: "d4", value: "", kind: "const", state: "tdz" },
          ],
          note: "চারটিই `const` expression — creation phase এ সবাই TDZ তে। কোনো function এখনো তৈরি হয়নি।",
        },
        {
          line: 0,
          memory: [
            { name: "d1", value: "ƒ d1  (regular)", kind: "const", state: "live" },
            { name: "d2", value: "", kind: "const", state: "tdz" },
            { name: "d3", value: "", kind: "const", state: "tdz" },
            { name: "d4", value: "", kind: "const", state: "tdz" },
          ],
          note: "প্রথম রূপ: regular function expression। এর নিজস্ব `this`, `arguments`, `prototype` আছে।",
        },
        {
          line: 1,
          memory: [
            { name: "d1", value: "ƒ d1  (regular)", kind: "const", state: "live" },
            { name: "d2", value: "ƒ d2  (arrow)", kind: "const", state: "live" },
            { name: "d3", value: "", kind: "const", state: "tdz" },
            { name: "d4", value: "", kind: "const", state: "tdz" },
          ],
          note: "Arrow এর সম্পূর্ণ রূপ — `function` এর বদলে `=>`, block body ও স্পষ্ট `return`। আচরণ এখানে `d1` এর মতো, কিন্তু `this`/`arguments` নেই।",
        },
        {
          line: 2,
          memory: [
            { name: "d1", value: "ƒ d1  (regular)", kind: "const", state: "live" },
            { name: "d2", value: "ƒ d2  (arrow)", kind: "const", state: "live" },
            { name: "d3", value: "ƒ d3  (arrow, implicit return)", kind: "const", state: "live" },
            { name: "d4", value: "", kind: "const", state: "tdz" },
          ],
          note: "একটি parameter তাই `()` ঐচ্ছিক; একটি মাত্র expression তাই `{ }` ও `return` বাদ — expression এর মানই return value।",
        },
        {
          line: 3,
          memory: [
            { name: "d1", value: "ƒ d1  (regular)", kind: "const", state: "live" },
            { name: "d2", value: "ƒ d2  (arrow)", kind: "const", state: "live" },
            { name: "d3", value: "ƒ d3  (arrow, implicit return)", kind: "const", state: "live" },
            { name: "d4", value: "ƒ d4  (→ { ok: true })", kind: "const", state: "live" },
          ],
          note: "Object ফেরত দিতে `( )` দিয়ে ঘেরা — নইলে `{` কে block ধরা হতো আর function `undefined` ফেরত দিত। Parameter না থাকলে `()` বাধ্যতামূলক।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Arrow এর syntax রূপ ও array method",
      description: "একই কাজ বিভিন্ন syntax এ। Implicit return, একক parameter ও object ফেরত দেওয়া (`( )` সহ) লক্ষ্য করুন।",
      code: `const add = (a, b) => a + b;
const double = n => n * 2;
const greet = () => "Hello";
const makeUser = name => ({ name, active: true });

console.log(add(2, 3), double(4), greet());
console.log(makeUser("Rina"));

const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(n => n % 2 === 0);
const doubled = numbers.map(n => n * 2);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log(evens, doubled, sum);`,
    },
    {
      level: "intermediate",
      title: "Lexical this: arrow বনাম regular callback",
      description: "একই object এর দুটি method। একটিতে callback regular function (`this` হারায়), অন্যটিতে arrow (`this` ঠিক থাকে)। Regular এর ফল error তাই `try/catch` দিয়ে `name` দেখানো হয়েছে — এই Playground strict mode এ চলে।",
      code: `const cart = {
  owner: "Rina",
  items: ["pen", "book"],

  listWithRegular() {
    try {
      this.items.forEach(function (item) {
        console.log(this.owner + ": " + item); // এখানে this = undefined (strict mode)
      });
    } catch (e) {
      console.log("regular callback:", e.name);
    }
  },

  listWithArrow() {
    this.items.forEach(item => {
      console.log(this.owner + ": " + item); // this = cart (lexical)
    });
  },
};

cart.listWithRegular();
cart.listWithArrow();

// setTimeout এর ভেতরেও একই
const timer = {
  label: "টাইমার",
  start() {
    setTimeout(() => {
      console.log(this.label, "শেষ");
    }, 0);
  },
};
timer.start();`,
    },
    {
      level: "real-world",
      title: "Store: closure, method shorthand ও returned arrow",
      description: "Redux-ধাঁচের ছোট store। Object এর method গুলো shorthand (`this` এর বদলে closure ব্যবহার), `subscribe` একটি arrow ফেরত দেয় (unsubscribe), এবং listener গুলো arrow callback। UI এর বাইরের যেকোনো state container এ এই ধাঁচ দেখা যায়।",
      code: `function createCounterStore(initial) {
  let state = initial;
  const listeners = new Set();

  return {
    getState() {
      return state;
    },
    increment() {
      state += 1;
      listeners.forEach(listener => listener(state));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener); // unsubscribe
    },
  };
}

const store = createCounterStore(0);
const unsubscribe = store.subscribe(state => console.log("listener:", state));

store.increment();
store.increment();
unsubscribe();
store.increment();

console.log("final:", store.getState());`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের arrow function লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
const square = n => n * n;

console.log([1, 2, 3].map(square));
`,
    },
    {
      label: "new, prototype ও arguments",
      code: `const Arrow = () => {};
function Regular() {}

console.log("Regular.prototype:", typeof Regular.prototype);
console.log("Arrow.prototype:", typeof Arrow.prototype);

try {
  new Arrow();
} catch (e) {
  console.log("new Arrow():", e.name);
}

// arguments: arrow নিজে বানায় না, বাইরের function এরটি দেখে
function outer() {
  const inner = () => arguments.length;
  return inner(1, 2, 3, 4);
}
console.log("outer এর arguments:", outer("a"));

// আধুনিক বিকল্প: rest parameter
const count = (...args) => args.length;
console.log("rest:", count(1, 2, 3, 4));
`,
    },
    {
      label: "call/bind arrow এর this বদলায় না",
      code: `const owner = { name: "Rina" };

function regular() {
  return this.name;
}

// arrow এর this বাইরের scope থেকে আসে; owner কে call/bind করে দিলেও ফল বদলাবে না
const arrow = () => (this === undefined ? "this undefined" : "this আছে");

console.log(regular.call(owner));
console.log(arrow.call(owner));
console.log(arrow.bind(owner)() === arrow.call(owner));
`,
    },
    {
      label: "Implicit return এ object এর ফাঁদ",
      code: `const wrong = name => { name: name };
const right = name => ({ name: name });
const shorthand = name => ({ name });

console.log(wrong("Rina"));
console.log(right("Rina"));
console.log(shorthand("Rina"));

// block body তে return লিখলে object ঠিকই আসে
const viaBlock = name => {
  return { name };
};
console.log(viaBlock("Rina"));
`,
    },
  ],

  debugging: [
    {
      title: "TypeError: Task is not a constructor",
      bad: `const Task = (title) => {
  this.title = title;
};

const t = new Task("পড়া");
console.log(t.title);`,
      why: "Arrow function এর `[[Construct]]` (constructor আচরণ) নেই এবং `prototype` ও নেই, তাই `new` দিলে TypeError। Constructor দরকার হলে `class` অথবা regular `function` ব্যবহার করুন। (আধুনিক কোডে `class` বা factory function পছন্দনীয়।)",
      fix: `class Task {
  constructor(title) {
    this.title = title;
  }
}

const t = new Task("পড়া");
console.log(t.title);`,
    },
    {
      title: "Object ফেরত দিতে চেয়েছিলাম, পেলাম undefined",
      bad: `const toOption = label => { value: label.toLowerCase(), label };
console.log(toOption("Dhaka"));`,
      why: "`=>` এর পর `{` দেখলে parser এটিকে function এর **block body** ধরে। তখন `value:` একটি label আর `label.toLowerCase(), label` একটি comma expression — কোড বৈধ, কিন্তু কোনো `return` নেই, তাই error ছাড়াই `undefined` ফেরত আসে। Object literal ফেরত দিতে সম্পূর্ণ object কে `( )` দিয়ে ঘিরুন।",
      fix: `const toOption = label => ({ value: label.toLowerCase(), label });
console.log(toOption("Dhaka"));`,
    },
    {
      title: "Object method এ arrow: this object নয়",
      bad: `const user = {
  name: "Rina",
  greet: () => "Hi, " + this.name,
};

console.log(user.greet());`,
      why: "Arrow এর `this` হলো ওই scope এর `this` যেখানে object literal লেখা হয়েছে — `user` object নয়। ES Module বা strict কোডে top-level `this` `undefined` (তাই `.name` পড়তেই TypeError); পুরোনো classic browser script এ global object (`window`), তখন `window.name` (সাধারণত খালি string) মিলে ভুল ফল আসে। Object এর method এ shorthand ব্যবহার করুন।",
      fix: `const user = {
  name: "Rina",
  greet() {
    return "Hi, " + this.name;
  },
};

console.log(user.greet());`,
    },
    {
      title: "Callback এ this হারিয়ে গেল (array method)",
      bad: `const pricing = {
  rate: 1.15,
  prices: [100, 200],
  withTax() {
    return this.prices.map(function (price) {
      return price * this.rate;
    });
  },
};

console.log(pricing.withTax());`,
      why: "`map` এর ভেতরের regular function এর নিজের `this` আছে; `map` কে `thisArg` না দিলে সেটি `undefined` (strict mode), তাই `this.rate` পড়তে TypeError। (Sloppy mode এ `this` global object হতো, `this.rate` হতো `undefined`, ফল `NaN` — নীরব ভুল!) Arrow callback `withTax` এর `this` (= `pricing`) ধার করে ঠিক কাজ করে।",
      fix: `const pricing = {
  rate: 1.15,
  prices: [100, 200],
  withTax() {
    return this.prices.map(price => price * this.rate);
  },
};

console.log(pricing.withTax());`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "Arrow function লিখুন",
      prompt: "`add` নামে একটি arrow function লিখুন যা দুটি সংখ্যা যোগ করে। Implicit return ব্যবহার করুন। `console.log(add(3, 4))` এ `7` print হবে।",
      starter: `// TODO: const add = ...

console.log(add(3, 4));`,
      expected: "7",
      hints: ["`const add = (a, b) => ...`", "`{ }` ও `return` ছাড়া শুধু `a + b` লিখুন।"],
      solution: `const add = (a, b) => a + b;

console.log(add(3, 4));`,
    },
    {
      level: "beginner",
      title: "Object ফেরত দিন",
      prompt: "`makeUser` সঠিকভাবে ঠিক করুন যেন `makeUser(\"Rina\")` একটি object `{ name: 'Rina' }` ফেরত দেয় (এখন `undefined` দিচ্ছে)।",
      starter: `const makeUser = name => { name: name };

console.log(makeUser("Rina"));`,
      expected: "{ name: 'Rina' }",
      hints: ["`{` কে function block ধরা হচ্ছে।", "পুরো object টিকে `( )` দিয়ে ঘিরুন।"],
      solution: `const makeUser = name => ({ name: name });

console.log(makeUser("Rina"));`,
      explanation: "Parentheses দিলে `{ ... }` expression অবস্থানে পড়ে, তাই object literal হিসেবে পড়া হয়।",
    },
    {
      level: "beginner",
      title: "map এ arrow callback",
      prompt: "`nums.map(...)` এ একটি arrow callback দিয়ে প্রতিটি সংখ্যার দ্বিগুণ বের করুন। Output হবে `[ 2, 4, 6 ]`।",
      starter: `const nums = [1, 2, 3];
const doubled = nums.map(/* TODO: arrow function */);

console.log(doubled);`,
      expected: "[ 2, 4, 6 ]",
      hints: ["`n => n * 2`।"],
      solution: `const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);

console.log(doubled);`,
    },
    {
      level: "intermediate",
      title: "this হারানোর সমস্যা ঠিক করুন",
      prompt: "নিচের কোড `TypeError` দেয় কারণ callback এ `this` নেই। শুধু callback এর ধরন বদলে `Rina: pen` ও `Rina: book` print করান।",
      starter: `const cart = {
  owner: "Rina",
  items: ["pen", "book"],
  list() {
    this.items.forEach(function (item) {
      console.log(this.owner + ": " + item);
    });
  },
};

cart.list();`,
      expected: "Rina: pen\nRina: book",
      hints: ["কোন ধরনের function নিজে `this` তৈরি করে না?", "`function (item) { ... }` কে `item => { ... }` করুন।"],
      solution: `const cart = {
  owner: "Rina",
  items: ["pen", "book"],
  list() {
    this.items.forEach(item => {
      console.log(this.owner + ": " + item);
    });
  },
};

cart.list();`,
      explanation: "Arrow callback `list()` এর `this` (= `cart`) lexical ভাবে ধার করে। `list` নিজে method shorthand — কারণ এখানে `this` কে `cart` হতে হবে।",
    },
    {
      level: "intermediate",
      title: "Curried arrow",
      prompt: "`multiply` কে এমন arrow বানান যেন `multiply(3)(4)` হয় `12`। এরপর `const triple = multiply(3)` দিয়ে `triple(4)` ও `multiply(2)(5)` print করুন (`12` ও `10`, আলাদা লাইনে)।",
      starter: `const multiply = (a, b) => a * b;

const triple = multiply(3);
console.log(triple(4));
console.log(multiply(2)(5));`,
      expected: "12\n10",
      hints: ["প্রথম arrow `a` নেবে এবং ভেতরে আরেকটি arrow ফেরত দেবে।", "`a => b => a * b`।"],
      solution: `const multiply = a => b => a * b;

const triple = multiply(3);
console.log(triple(4));
console.log(multiply(2)(5));`,
      explanation: "ভেতরের arrow বাইরের `a` কে closure হিসেবে ধরে রাখে। এই ‘আংশিক প্রয়োগ’ ধাঁচ configuration-সহ function (middleware, selector factory) বানাতে কাজে লাগে।",
    },
    {
      level: "challenge",
      title: "Real-world: Counter store (subscribe / unsubscribe)",
      prompt:
        "`createCounterStore(initial)` সম্পূর্ণ করুন। এটি `getState()`, `increment()` ও `subscribe(listener)` সহ একটি object ফেরত দেবে। `increment` state বাড়িয়ে সব listener কে নতুন state দিয়ে call করবে। `subscribe` listener যোগ করে একটি **arrow function** ফেরত দেবে, যা call করলে ওই listener সরে যাবে। Object এর method এ `this` ব্যবহার না করে closure ব্যবহার করুন।",
      starter: `function createCounterStore(initial) {
  let state = initial;
  const listeners = new Set();

  return {
    getState() {
      // TODO
    },
    increment() {
      // TODO: state বাড়ান ও listener দের জানান
    },
    subscribe(listener) {
      // TODO: listener যোগ করুন, unsubscribe arrow ফেরত দিন
    },
  };
}

const store = createCounterStore(0);
const unsubscribe = store.subscribe(state => console.log("listener:", state));

store.increment();
store.increment();
unsubscribe();
store.increment();

console.log("final:", store.getState());`,
      expected: "listener: 1\nlistener: 2\nfinal: 3",
      hints: ["`state` ও `listeners` closure এ আছে — `this` লাগবে না।", "`listeners.forEach(listener => listener(state))`।", "`return () => listeners.delete(listener);`"],
      solution: `function createCounterStore(initial) {
  let state = initial;
  const listeners = new Set();

  return {
    getState() {
      return state;
    },
    increment() {
      state += 1;
      listeners.forEach(listener => listener(state));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const store = createCounterStore(0);
const unsubscribe = store.subscribe(state => console.log("listener:", state));

store.increment();
store.increment();
unsubscribe();
store.increment();

console.log("final:", store.getState());`,
      explanation: "Method গুলো shorthand ও closure-ভিত্তিক (তাই `this` হারানোর ভয় নেই); callback ও unsubscribe এ ছোট arrow। `unsubscribe` কে আলাদা করে বা অন্য জায়গায় পাঠালেও কাজ করে — কারণ এটি `this` নয়, closure ব্যবহার করে। React এর `useEffect` cleanup ও store library গুলোর `subscribe` একই ধাঁচ।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`const F = () => {}; new F();` কী করবে?",
        options: ["একটি খালি object তৈরি করবে", "`undefined` ফেরত দেবে", "`TypeError` ছুড়বে", "`SyntaxError` ছুড়বে"],
        answer: 2,
        explanation:
          "Arrow function constructor নয় — `new` দিলে runtime এ `TypeError` (F is not a constructor)। খালি object তৈরি হতো regular `function F() {}` এ। `undefined` ফেরত আসা কোনো `new` এর ক্ষেত্রেই ঘটে না। `SyntaxError` parse এর সময়ের বিষয়; `new F()` লেখা বৈধ syntax, সমস্যা ধরা পড়ে চলার সময়।",
      },
      {
        question: "`const f = n => { value: n }; console.log(f(5));` কী print করবে?",
        options: ["undefined", "{ value: 5 }", "5", "SyntaxError"],
        answer: 0,
        explanation:
          "`{` কে block ধরা হয়, `value:` একটি label, আর `n` একটি expression statement; কোনো `return` নেই, তাই function `undefined` ফেরত দেয়। Object পেতে `n => ({ value: n })` লিখতে হতো। `5` আসত না, কারণ কেউ `return` করেনি। এই ক্ষেত্রে syntax সম্পূর্ণ বৈধ, তাই SyntaxError নয়।",
      },
      {
        question: "Arrow function এর ভেতরে `this` কীভাবে নির্ধারিত হয়?",
        options: [
          "যে object এর ওপর call করা হয় সেটি হয় (`obj.fn()` এর `obj`)",
          "Arrow যেখানে লেখা হয়েছে সেই enclosing scope এর `this` ই ব্যবহৃত হয়",
          "সবসময় global object হয়",
          "সবসময় `undefined` হয়",
        ],
        answer: 1,
        explanation:
          "Arrow এর নিজস্ব `this` নেই; `this` আর সব identifier এর মতো scope chain এ বাইরে খোঁজা হয় (lexical this)। প্রথম অপশন regular function এর আচরণ। তৃতীয় ও চতুর্থ অপশন নির্দিষ্ট পরিবেশে ঘটতে পারে (যেমন top-level এ), কিন্তু ‘সবসময়’ নয় — এটি নির্ভর করে enclosing scope এর ওপর।",
      },
      {
        question: "`function outer() { const inner = () => arguments.length; return inner(1, 2, 3); }` — `outer(9)` এর ফল কী?",
        options: ["3", "0", "undefined", "1"],
        answer: 3,
        explanation:
          "Arrow `inner` এর নিজস্ব `arguments` নেই, তাই scope chain ধরে `outer` এর `arguments` ই দেখে — যাতে শুধু `9` আছে, দৈর্ঘ্য `1`। `3` হতো যদি `inner` regular function হতো। `0` ও `undefined` এর কোনো ভিত্তি নেই — `arguments` পাওয়া যায়, ReferenceError ও আসে না।",
      },
      {
        question: "নিচের কোন ক্ষেত্রে arrow function ব্যবহার করা **উপযুক্ত নয়**?",
        options: [
          "`array.filter(x => x > 0)` এ ছোট callback",
          "`setTimeout(() => this.update(), 0)` — method এর ভেতরে, method এর `this` চাই",
          "Object literal এর method যা নিজের object এর `this.name` পড়ে",
          "Promise `.then(result => result.data)`",
        ],
        answer: 2,
        explanation:
          "Object এর method এ `this` হতে হবে call করা object, কিন্তু arrow enclosing scope এর `this` দেখে — তাই ভুল (method shorthand লিখুন)। প্রথম ও চতুর্থটি `this` নির্ভর নয় এমন ছোট callback — আদর্শ ক্ষেত্র। দ্বিতীয়টিতে ঠিক arrow ই দরকার, কারণ method এর `this` টি callback এ ধার করতে চাই।",
      },
    ],
    coding: [
      {
        title: "Sum of squares",
        prompt: "`sumOfSquares(nums)` নামে একটি arrow function লিখুন, যা সংখ্যার array এর প্রতিটির বর্গ যোগ করে ফেরত দেয় (`map` ও `reduce` এর arrow callback ব্যবহার করুন)। `[1, 2, 3]` এর জন্য `14` print হবে।",
        starter: `const sumOfSquares = nums => {
  // TODO
};

console.log(sumOfSquares([1, 2, 3]));`,
        expected: "14",
        solution: `const sumOfSquares = nums =>
  nums.map(n => n * n).reduce((acc, n) => acc + n, 0);

console.log(sumOfSquares([1, 2, 3]));`,
      },
      {
        title: "this ঠিক করুন: Tally",
        prompt: "নিচের `addAll` method এর callback এ `this.total` কাজ করছে না (`TypeError`)। callback এর ধরন বদলে `6` print করান।",
        starter: `const tally = {
  total: 0,
  addAll(numbers) {
    numbers.forEach(function (n) {
      this.total += n;
    });
    return this.total;
  },
};

console.log(tally.addAll([1, 2, 3]));`,
        expected: "6",
        solution: `const tally = {
  total: 0,
  addAll(numbers) {
    numbers.forEach(n => {
      this.total += n;
    });
    return this.total;
  },
};

console.log(tally.addAll([1, 2, 3]));`,
      },
    ],
  },

  interview: [
    {
      q: "Arrow function ও regular function এর মধ্যে মূল পার্থক্যগুলো কী?",
      a: "Syntax এর সংক্ষিপ্ততা ছাড়াও আচরণে পাঁচটি বড় পার্থক্য: (১) Arrow এর **নিজস্ব `this` নেই** — enclosing scope এর `this` ব্যবহার করে (lexical this); regular function এ `this` নির্ধারিত হয় call এর ধরন অনুযায়ী। (২) Arrow এর নিজস্ব `arguments` নেই (বাইরের function এরটি দেখে) — rest parameter বিকল্প। (৩) Arrow এর নিজস্ব `super` ও `new.target` নেই। (৪) Arrow constructor নয় — `new` দিলে TypeError, এবং `prototype` property নেই। (৫) Arrow generator হতে পারে না।\n\nএছাড়া `call`/`apply`/`bind` arrow এর `this` বদলায় না। সুতরাং arrow ‘ছোট regular function’ নয়, বরং ভিন্ন আচরণের function। পছন্দ হওয়া উচিত আচরণের প্রয়োজনে: callback ও closure ধরনের কাজে arrow, method/constructor এ regular বা shorthand।",
    },
    {
      q: "Lexical `this` বলতে কী বোঝায়? এটি কেন দরকারি?",
      a: "Lexical this মানে `this` এর মান **কোড কোথায় লেখা হয়েছে** তা দিয়ে নির্ধারিত হয়, কীভাবে call হয়েছে তা দিয়ে নয়। Arrow function এ `this` এর জন্য কোনো binding তৈরি হয় না, তাই `this` লিখলে engine সাধারণ variable এর মতো scope chain এ বাইরের দিকে খোঁজে এবং কাছের enclosing function (বা top-level) এর `this` পায়।\n\nদরকার কারণ callback এ `this` হারানো আগে খুব সাধারণ সমস্যা ছিল: method এর ভেতরে `setTimeout`, `forEach` বা `.then` এর regular callback এ `this` হয়ে যেত `undefined` (strict) বা global (sloppy)। ঐতিহাসিক সমাধান ছিল `var self = this` বা `.bind(this)`; arrow এ সেটি স্বাভাবিকভাবে ঘটে। উল্টো দিকে, dynamic `this` দরকার হলে (object method, কিছু library callback) arrow অনুপযুক্ত।",
    },
    {
      q: "Object এর method বা prototype method arrow দিয়ে লেখা উচিত নয় কেন?",
      a: "Method এর কাজই হলো যে object এর ওপর call হচ্ছে (`obj.method()`) তার `this` ব্যবহার করা। Arrow এ নিজস্ব `this` নেই; object literal যে scope এ লেখা হয়েছে সেই scope এর `this` ধরে — object টি নিজে `this` এর scope তৈরি করে না। ফলে `this.name` সাধারণত `undefined` বা TypeError দেয় (ES Module এ top-level `this` হলো `undefined`; classic browser script এ `window`; Node CommonJS এ `module.exports`)।\n\nPrototype method (`Person.prototype.say = () => ...`) এও একই কারণে instance পাওয়া যায় না। সমাধান: object literal এ method shorthand, class এ সাধারণ method। ব্যতিক্রম হিসেবে class field arrow (`handle = () => {}`) instance এ বাঁধা function তৈরি করে, কিন্তু প্রতি instance এ আলাদা function তৈরি হয়, prototype এ ভাগাভাগি হয় না — trade-off জেনে ব্যবহার করুন।",
    },
    {
      q: "React এ inline arrow handler (`onClick={() => remove(id)}`) নিয়ে কী বিবেচনা করবেন?",
      a: "Inline arrow handler এর ভালো দিক হলো এটি closure দিয়ে `id` এর মতো মান ধরে রাখে — `this` লাগে না, বয়লারপ্লেট কম। সাধারণ DOM element (`<button>`) এ এর খরচ উপেক্ষণীয়।\n\nখেয়াল রাখার বিষয়: প্রতিটি render এ `() => ...` একটি নতুন function object, অর্থাৎ নতুন identity। এটি `React.memo` করা child এর prop হিসেবে গেলে memoization ভেঙে দেয়, এবং `useEffect`/`useMemo`/`useCallback` এর dependency array তে থাকলে বারবার effect চালায়। তখন `useCallback` দিয়ে handler স্থির করা, বা মান ও handler আলাদা পাঠানোর কথা ভাবা হয়। তবে ‘সবকিছুতে আগেভাগে useCallback’ লাগানো ভুল প্রবণতা — আগে মাপুন, তারপর অপ্টিমাইজ করুন।",
    },
    {
      q: "`const f = x => { a: x };` কেন `undefined` ফেরত দেয় এবং ঠিক কীভাবে ঠিক করবেন?",
      a: "`=>` এর পর `{` দেখলে parser সেটিকে **function body block** ধরে, object literal নয়। ভেতরে `a: x` একটি **labeled statement** (label `a`, statement `x`) — বৈধ কিন্তু কোনো `return` নেই, তাই function `undefined` ফেরত দেয়। কোনো error না আসায় ভুলটি নীরবে থেকে যায়।\n\nসমাধান: object literal কে parentheses এ মুড়িয়ে expression বানান — `x => ({ a: x })` — অথবা block body তে স্পষ্ট `return { a: x };` লিখুন। ESLint এর `no-unused-labels` ও Prettier সাধারণত এমন সন্দেহজনক কোড ধরিয়ে দেয়। একই কারণে প্রতিটি `map(x => ({ ... }))` এ বাড়তি `( )` দেখা যায়।",
    },
  ],

  summary: {
    takeaways: [
      "Arrow function: `(params) => expression` (implicit return) বা `(params) => { ...; return value; }`।",
      "Object literal ফেরত দিতে `( )` দিন: `x => ({ a: x })` — নইলে `{` block হয়ে যায়।",
      "Arrow এর নিজস্ব `this`, `arguments`, `super`, `new.target` নেই — সবই enclosing scope থেকে (lexical)।",
      "Arrow constructor নয় (`new` → TypeError), `prototype` নেই, generator নয়; `call`/`bind` `this` বদলায় না।",
      "Callback এ (`map`, `forEach`, `setTimeout`, `.then`) arrow `this` হারানোর সমস্যা মেটায়।",
      "Object method, prototype method ও dynamic `this` দরকার এমন handler এ arrow এড়ান; দীর্ঘ chain এ জটিল callback কে নাম দিন।",
    ],
    syntax: `const add = (a, b) => a + b;          // implicit return
const double = n => n * 2;             // একক parameter
const make = name => ({ name });       // object ফেরত
const run = () => { /* block */ };     // parameter নেই
const curry = a => b => a + b;         // curried

const obj = {
  value: 1,
  method() {                           // method এ shorthand
    return [1, 2].map(n => n + this.value); // callback এ arrow
  },
};`,
    whenToUse: [
      "ছোট inline callback: `map`, `filter`, `reduce`, `.then`, event/timer callback।",
      "Method এর ভেতরের callback যেখানে method এর `this` ধার করতে চান।",
      "Closure-ভিত্তিক helper ও curried/factory function (React handler, selector, middleware)।",
      "Object/prototype method, constructor, বা dynamic `this` দরকার হলে নয় — shorthand method, `class` বা regular function।",
    ],
    next: ["Parameters and Arguments — default, rest ও `arguments` এর বিস্তারিত", "this keyword — `this` এর পূর্ণ নিয়ম (default/implicit/explicit/new binding)", "Callback Functions ও Higher-Order Functions — arrow এর সবচেয়ে সাধারণ ব্যবহারক্ষেত্র", "Closures — arrow কীভাবে বাইরের variable ধরে রাখে"],
  },

  compatibility:
    "Arrow function ES2015 এর অংশ — সব আধুনিক browser ও Node.js এ একই আচরণ করে (পুরোনো IE এ সাপোর্ট নেই; সেখানে transpile করতে হতো)। Top-level `this` এর মান environment ভেদে আলাদা: classic browser script এ `window`, ES Module এ `undefined`, Node.js CommonJS এ `module.exports` — তাই top-level এ arrow এর `this` এ নির্ভর করবেন না। এই Playground strict mode এ চলে; JSX/React এর অংশ কেবল ধারণার জন্য, এখানে চলে না।",
};
