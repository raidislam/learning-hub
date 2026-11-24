import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "`this` কোথায় লেখা হয়েছে তার ওপর নয়, function **কীভাবে call করা হয়েছে** তার ওপর নির্ভর করে (arrow function বাদে) — এই মূল নিয়মটি বুঝবেন।",
    "`this` নির্ধারণের চারটি binding rule (`new`, explicit, implicit, default) এবং তাদের precedence ক্রম বলতে ও প্রয়োগ করতে পারবেন।",
    "Arrow function এর **lexical `this`** কেন আলাদা এবং কখন সেটি সঠিক/ভুল হাতিয়ার — তা ব্যাখ্যা করতে পারবেন।",
    "**Lost-this bug** (method extract করা, callback হিসেবে পাঠানো, event handler) চিনে `bind`, arrow wrapper বা class field দিয়ে ঠিক করতে পারবেন।",
    "Strict mode ও sloppy mode এ default binding এর পার্থক্য এবং browser/Node.js এ top-level `this` এর আচরণ জানবেন।",
  ],

  concept: [
    { type: "h3", text: "`this` আসলে কী?" },
    {
      type: "p",
      text: "`this` হলো function এর ভেতরে পাওয়া একটি বিশেষ **implicit parameter** — আপনি তাকে parameter list এ লেখেন না, কিন্তু প্রতিটি (arrow ছাড়া) function call এর সময় engine তাকে একটি মান দিয়ে দেয়। সেই মানটি হলো ‘এই call এ কে আমাকে চালাচ্ছে?’ এর উত্তর। একই function একবার `this = userA`, আরেকবার `this = userB` নিয়ে চলতে পারে — এজন্যই `this` function কে **reusable** করে।",
    },
    {
      type: "p",
      text: "সবচেয়ে গুরুত্বপূর্ণ কথা: variable এর মান বের হয় **কোথায় লেখা হয়েছে** (lexical scope — Lexical Scope lesson দেখুন) তা দেখে। কিন্তু `this` এর মান বের হয় **কীভাবে call করা হয়েছে** (call-site) তা দেখে। এই দুটি মেকানিজম আলাদা — `this` scope chain ধরে খোঁজা হয় না (শুধু arrow function ছাড়া, যেখানে আলাদা নিয়ম)। বেশিরভাগ `this` confusion এখান থেকেই আসে।",
    },
    { type: "h3", text: "চারটি binding rule — precedence সহ" },
    {
      type: "p",
      text: "কোনো function call এর সময় engine নিচের ক্রমে প্রশ্ন করে। **ওপরের নিয়ম মিললে নিচেরগুলো আর দেখা হয় না।** (এখানে ‘rule’ গুলো ECMAScript spec এর ভাষা নয়, বোঝার সুবিধার জন্য সাজানো একটি mental model; spec এ এটি `[[Call]]`/`[[Construct]]` ও reference এর `thisValue` এর মাধ্যমে ঘটে।)",
    },
    {
      type: "ol",
      items: [
        "**`new` binding** — `new Foo()` দিয়ে call হলে একটি নতুন object তৈরি হয় এবং সেটিই `this`। (সবচেয়ে বেশি precedence।)",
        "**Explicit binding** — `fn.call(obj)`, `fn.apply(obj)` বা `fn.bind(obj)()` হলে `this` = `obj`। (বিস্তারিত পরের call, apply, bind lesson এ।)",
        "**Implicit binding** — `obj.fn()` আকারে dot (বা `obj['fn']()`) দিয়ে call হলে `this` = `.` এর বাঁ দিকের `obj`।",
        "**Default binding** — উপরের কোনোটি নয়, শুধু `fn()` plain call। **Strict mode এ `this === undefined`**, sloppy mode এ `this === globalThis`।",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "পঞ্চম ‘rule’: Arrow function (lexical this)",
      text: "Arrow function এর **নিজস্ব `this` নেই**। ভেতরে `this` লিখলে engine সেটি enclosing (বাইরের) scope থেকে খোঁজে — ঠিক যেমন বাইরের variable খোঁজা হয়। তাই arrow এর `this` তৈরির সময় (definition site) নির্ধারিত হয়, call এর সময় নয়; `call`/`apply`/`bind`/`new` কিছুই সেটি বদলাতে পারে না। Arrow Functions lesson এ এর অন্যান্য দিক দেখেছি।",
    },
    {
      type: "compare",
      headers: ["Call এর ধরন", "উদাহরণ", "this এর মান"],
      rows: [
        ["`new`", "`new Person('Rina')`", "নতুন তৈরি object"],
        ["Explicit", "`greet.call(user)` / `greet.bind(user)()`", "`user`"],
        ["Implicit (method call)", "`user.greet()`", "`user` (dot এর বাঁয়ের object)"],
        ["Default (plain call)", "`greet()`", "strict: `undefined` — sloppy: `globalThis`"],
        ["Arrow function", "`const f = () => this`", "বাইরের scope এর `this` (call-site ধর্তব্য নয়)"],
      ],
    },
    { type: "h3", text: "Implicit binding: dot এর বাঁ দিক দেখুন" },
    {
      type: "p",
      text: "`user.greet()` এ engine প্রথমে `user.greet` কে evaluate করে — এর ফল শুধু function নয়, বরং ‘`greet` property, base object `user`’ এই জোড়াটি (spec এ **Reference**)। call এর সময় এই base কে-ই `this` হিসেবে দেওয়া হয়। কিন্তু আপনি যখন `const f = user.greet;` লেখেন, তখন সেই Reference থেকে শুধু **function value** টি বের হয়ে `f` এ বসে — base object এর তথ্য হারিয়ে যায়। এরপর `f()` লিখলে call-site এ আর কোনো dot নেই, তাই default binding। এটাই **lost-this bug** এর মূল কারণ।",
    },
    {
      type: "code",
      caption: "Method object এর অংশ নয় — শুধু একটি property মাত্র। `this` ঠিক হয় call এর সময়।",
      code: `const user = { name: "Rina", greet() { return "Hi, " + this.name; } };

user.greet();        // implicit: this = user  → "Hi, Rina"
const f = user.greet;
f();                 // default: this = undefined (strict) → TypeError`,
    },
    { type: "h3", text: "Lost-this: যেসব জায়গায় ঘটে" },
    {
      type: "ul",
      items: [
        "**Method extract করা:** `const { inc } = counter;` বা `const f = counter.inc;`।",
        "**Callback হিসেবে পাঠানো:** `setTimeout(counter.inc, 100)`, `arr.map(obj.transform)`, `button.addEventListener('click', obj.onClick)` — receiver function টিকে plain function হিসেবে call করে।",
        "**Method এর ভেতরের nested regular function:** `this` এর মান সেখানে আবার নতুন করে নির্ধারিত হয় (default binding), outer method এর `this` উত্তরাধিকারসূত্রে আসে না।",
        "**Class method কে handler বানানো:** `onClick={this.handleClick}` — নিচে আলাদা করে দেখছি।",
      ],
    },
    {
      type: "p",
      text: "সমাধানের উপায়গুলো: (১) **arrow wrapper** — `() => counter.inc()`, যেখানে call এখনো dot দিয়ে হচ্ছে; (২) **`bind`** — `counter.inc.bind(counter)`; (৩) nested function এ **arrow function** ব্যবহার; (৪) class এ **class field arrow function**; (৫) কিছু API তে `thisArg` parameter আছে (যেমন `arr.forEach(fn, thisArg)`)। পুরোনো কোডে `const self = this;` বা `var that = this;` pattern ও দেখবেন — এটি arrow function আসার আগের workaround।",
    },
    { type: "h3", text: "Strict mode বনাম sloppy mode" },
    {
      type: "p",
      text: "Default binding এ strict ও sloppy mode আলাদা আচরণ করে। Sloppy mode এ `this` যদি `undefined`/`null` হতো, engine সেটিকে `globalThis` দিয়ে বদলে দেয় (এবং primitive `this` কে wrapper object এ বদলে দেয়) — ফলে ভুল করে global এ property লেখা হয়ে যেতে পারে এবং bug নীরবে লুকিয়ে থাকে। Strict mode এ `this` যেমন আছে তেমনই থাকে — `undefined` — তাই ভুল সাথে সাথে `TypeError` হয়ে ধরা পড়ে। **ES Module ও class body সবসময় strict।** তাই আধুনিক কোডে (React/Next.js, ESM Node.js) প্রায় সবসময় strict আচরণই পাবেন।",
    },
    {
      type: "code",
      caption: "শুধু বোঝার জন্য, এই lesson এর Playground এ চলবে না — Playground সবসময় strict mode এ চলে। পুরোনো classic `<script>` বা CommonJS ফাইলে (যেখানে `\"use strict\"` নেই) এরকম হয়।",
      code: `// sloppy (non-strict) mode — চালানো হচ্ছে না
function whoAmI() {
  return this === globalThis;
}
whoAmI();               // true  (default binding → globalThis)

function setName() {
  this.name = "oops";   // নীরবে global এ 'name' property তৈরি!
}
setName();

// strict mode:
// "use strict"; অথবা ES Module / class body
// whoAmI() এ this === undefined; setName() এ TypeError`,
    },
    { type: "h3", text: "`new` binding ও constructor" },
    {
      type: "p",
      text: "`new Foo(args)` কে engine মোটামুটি চার ধাপে চালায়: (১) `Foo.prototype` কে prototype ধরে একটি নতুন খালি object তৈরি; (২) সেটিকে `this` ধরে `Foo` চালানো; (৩) `Foo` যদি নিজে কোনো **object** return না করে তবে ওই নতুন object টিই ফলাফল; (৪) object return করলে সেই object টি ফলাফল (primitive return উপেক্ষিত)। `new` ভুলে গেলে constructor এ plain call হয় এবং `this.name = name` strict mode এ `TypeError` দেয় (sloppy এ global দূষিত হয়)। Class syntax (পরের OOP module এ) এ `new` ছাড়া call করলে সরাসরি `TypeError` দেয় — তাই ওটি বেশি নিরাপদ।",
    },
    { type: "h3", text: "Object method shorthand বনাম arrow property" },
    {
      type: "p",
      text: "Object literal এ `greet() { ... }` (method shorthand) বা `greet: function () { ... }` লিখলে call এর সময় implicit binding কাজ করে। কিন্তু `greet: () => { ... }` লিখলে arrow এর `this` আসে **object literal যেখানে লেখা হয়েছে সেই বাইরের scope** থেকে — object নিজে থেকে নয়। কারণ object literal `{ }` কোনো scope বা `this` context তৈরি করে না। তাই object এর method এ `this` চাইলে arrow নয়, **method shorthand** ব্যবহার করুন। উল্টো দিকে, method এর **ভেতরের callback** এ arrow ব্যবহার করুন, যাতে method এর `this` ধরে রাখা যায়।",
    },
    { type: "h3", text: "Getter, setter ও `this`" },
    {
      type: "p",
      text: "Getter/setter ও আসলে function — তারা property access এর সময় call হয়, এবং `this` হয় **যে object এর ওপর property টি access করা হয়েছে** (receiver), আর সেটি prototype chain এ উত্তরাধিকারসূত্রে পাওয়া হলেও। তাই child object এ `child.fullName` লিখলে getter এর `this` হয় `child`, যদিও getter টি parent এ লেখা। Playground এর ‘Getter ও receiver’ নমুনায় দেখুন।",
    },
    { type: "h3", text: "Class method, event handler ও React এর ইতিহাস" },
    {
      type: "p",
      text: "Class এর method গুলো prototype এ থাকে এবং **instance এর সাথে স্বয়ংক্রিয়ভাবে bound নয়**। তাই `button.addEventListener('click', this.handleClick)` বা (পুরোনো) React class component এ `onClick={this.handleClick}` লিখলে handler টি plain function হিসেবে call হয় এবং `this` হারায়। React class component এর যুগে এজন্য সবাই constructor এ `this.handleClick = this.handleClick.bind(this)` লিখত, বা JSX এ `onClick={() => this.handleClick()}` লিখত। পরে **class field + arrow function** (`handleClick = () => { ... }`) পদ্ধতি জনপ্রিয় হয়, কারণ arrow এর `this` instance তৈরির সময় constructor scope থেকে lexical ভাবে আসে। আজকের React এ function component ও hooks এ কোনো `this` ই নেই — handler গুলো closure দিয়ে state ধরে — কিন্তু বিশাল legacy কোডবেস, Web Components ও DOM/Node API এর callback পড়তে `this` বোঝা অপরিহার্য।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Class field arrow এর দাম",
      text: "Class field arrow function প্রতিটি **instance এর জন্য আলাদা function object** তৈরি করে (prototype এ shared থাকে না)। হাজার হাজার instance তৈরি হলে memory বাড়ে, এবং subclass এ `super.handleClick()` ডাকা যায় না (কারণ সেটি prototype method নয়)। সাধারণ UI component এ এটি সমস্যা নয়, কিন্তু বড় সংখ্যক instance এর ক্ষেত্রে বিবেচনা করুন।",
    },
    { type: "h3", text: "`setTimeout` ও callback এর `this`" },
    {
      type: "p",
      text: "`setTimeout(obj.method, 0)` এ method টি plain function হিসেবে timer থেকে call হয় — তাই `obj` হারায়। তবে regular function কে timer callback দিলে **host নিজেই** তার `this` ঠিক করে দেয়: Browser এ সাধারণত global object (`window`/`self`), আর Node.js এ `Timeout` object। এটি runtime-নির্ভর, তাই ওই `this` এর ওপর কখনো ভরসা করবেন না। Method এর ভেতর থেকে timer ব্যবহার করতে চাইলে **arrow callback** দিন — তাহলে `this` method থেকেই lexical ভাবে আসে।",
    },
    { type: "h3", text: "Browser-only ও Node.js-only আচরণ" },
    {
      type: "code",
      caption: "Browser-only — DOM দরকার, এই lesson এর sandbox এ চলবে না (শুধু পড়ার জন্য)।",
      code: `// Browser: classic <script> এর top-level
console.log(this === window);          // true

// Browser: ES Module (<script type="module">)
console.log(this);                     // undefined

// Browser: regular function handler — this = যে element এ listener বসানো
button.addEventListener("click", function (event) {
  console.log(this === event.currentTarget);   // true
});

// Arrow handler — this = বাইরের scope এর this, element নয়
button.addEventListener("click", (event) => {
  console.log(event.currentTarget);   // element এর জন্য event.currentTarget ব্যবহার করুন
});`,
    },
    {
      type: "code",
      caption: "Node.js-only — `module`/`require` আছে এমন environment; এই sandbox এ চলবে না (শুধু পড়ার জন্য)।",
      code: `// Node.js CommonJS ফাইলের top-level
console.log(this === module.exports);  // true
console.log(this === globalThis);      // false  (ফাইল একটি function wrapper এর ভেতরে চলে)

// Node.js ES Module (.mjs বা "type": "module")
console.log(this);                     // undefined`,
    },
    {
      type: "callout",
      tone: "info",
      title: "Common misconceptions",
      text: "**(১)** ‘`this` function নিজেকে বোঝায়’ — না। `function f() { return this; }` এ `this` f নয়, call-site অনুযায়ী ঠিক হয়। **(২)** ‘`this` সবসময় সেই object যেখানে function লেখা হয়েছে’ — না, লেখার জায়গা নয়, call এর ধরন। **(৩)** ‘Arrow function হলো shorter `function`’ — না, `this`, `arguments`, `new` এ মৌলিক পার্থক্য আছে। **(৪)** ‘Nested function এ outer method এর `this` চলে আসে’ — না, শুধু arrow এ আসে। **(৫)** ‘Plain call এ `this` সবসময় `window`’ — শুধু sloppy mode এ।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "Sloppy mode এ global দূষণ ও নিরাপত্তা-ঝুঁকি",
      text: "Sloppy mode এ lost-this হলে `this.token = value` বা `this.role = 'admin'` এর মতো লাইন নীরবে **global object এ** লেখা হয়ে যায় — অন্য কোডের সাথে সংঘর্ষ ও কখনো সেটি security-সংবেদনশীল state দূষণ ঘটাতে পারে। এছাড়া `this` যাতে untrusted input এর মাধ্যমে বদলে না যায় সে ব্যাপারে সতর্ক থাকুন — যেমন user-নিয়ন্ত্রিত ‘method name’ দিয়ে `obj[name]()` call করলে সেটি `this = obj` নিয়ে এমন method চালাতে পারে যা চালানোর কথা ছিল না। Strict mode (ES Module/class) ব্যবহার করুন এবং allow-list ছাড়া dynamic method dispatch এড়ান।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ধরুন একটি কোম্পানিতে একটি **ছাপানো চিঠির টেমপ্লেট** আছে: ‘প্রিয় ____, আপনার অর্ডার পৌঁছেছে।’ টেমপ্লেটটিই function; ফাঁকা ঘরটি `this`। কে চিঠিটি ছাপাচ্ছে (call-site) তা দেখে ফাঁকা ঘরে নাম বসে — টেমপ্লেট কোন ফাইলে লেখা ছিল তা দেখে নয়।",
    },
    {
      type: "ul",
      items: [
        "**Implicit binding (`user.greet()`)** — রিনার ডেস্ক থেকে ছাপা হচ্ছে, তাই ফাঁকা ঘরে অটোমেটিক ‘রিনা’ বসে। ডেস্ক = dot এর বাঁ দিকের object।",
        "**Lost-this (`const f = user.greet; f()`)** — টেমপ্লেটটির ফটোকপি নিয়ে নামহীন কাউন্টারে ছাপানো হলো। কপি করার সময় ‘কোন ডেস্ক থেকে’ তথ্যটি আসেনি, তাই ঘর ফাঁকাই থাকে (`undefined`) — আর কড়া অফিসে (strict) ছাপা আটকে যায়, ঢিলে অফিসে (sloppy) কেউ জোর করে ‘অফিসের নাম’ (global) বসিয়ে দেয়।",
        "**Explicit binding (`call`/`bind`)** — আপনি নিজে হাতে লিখে দিচ্ছেন ‘এই চিঠি করিমের নামে ছাপো’। `bind` হলো টেমপ্লেটে স্থায়ীভাবে করিমের নাম লিখে নতুন একটি কপি বানিয়ে রাখা।",
        "**`new` binding** — কোম্পানি একেবারে নতুন একজন গ্রাহকের ফাইল খুলে চিঠি ছাপছে; ফাঁকা ঘরে সেই নতুন গ্রাহক।",
        "**Arrow function** — একটি চিঠি যার ফাঁকা ঘর নেই; বরং চিঠিতে লেখা ‘যে বিভাগের ফাইলে আমাকে রাখা হয়েছে, সেই বিভাগের প্রধানের নাম’। কে ছাপাচ্ছে সেটি আর কোনো ব্যাপার নয় — নাম আগেই ঠিক।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "`this` নির্ধারণের decision flow: ‘Function কীভাবে call হয়েছে?’",
      caption: "ওপর থেকে নিচে (এখানে বাঁ থেকে ডানে) প্রশ্ন করুন; প্রথম মিলে যাওয়া rule জিতবে।",
      nodes: [
        { id: "q", label: "কীভাবে call?", sub: "call-site দেখুন" },
        { id: "arrow", label: "Arrow?", sub: "lexical this" },
        { id: "new", label: "`new`?", sub: "নতুন object" },
        { id: "explicit", label: "call/apply/bind?", sub: "explicit" },
        { id: "implicit", label: "`obj.fn()`?", sub: "implicit" },
        { id: "default", label: "plain `fn()`", sub: "default" },
        { id: "result", label: "this = ?", sub: "ফলাফল" },
      ],
      steps: [
        {
          active: ["q"],
          items: { q: ["call-site এর দিকে তাকান", "function কোথায় লেখা — অপ্রাসঙ্গিক"] },
          note: "প্রথমে নিজেকে প্রশ্ন করুন: **এই function টি কীভাবে call হচ্ছে?** লেখার জায়গা নয়, call এর আকার (`new f()`, `f.call(x)`, `x.f()`, `f()`) দেখাই মূল কাজ। শুধু arrow function হলে সরাসরি প্রথম ধাপে লাফিয়ে যাবেন।",
        },
        {
          active: ["q", "arrow", "result"],
          items: { arrow: ["const f = () => this", "নিজস্ব this নেই"], result: ["this = বাইরের scope এর this", "call/bind কিছুই বদলাতে পারে না"] },
          note: "**Arrow function:** call এর ধরন ধর্তব্য নয়। `this` ঠিক হয়ে গেছে যেখানে arrow টি **লেখা হয়েছে** সেই scope এর `this` থেকে। বাকি সব ধাপ এখানে বাতিল।",
        },
        {
          active: ["q", "new", "result"],
          items: { new: ["new Person('Rina')"], result: ["this = নতুন তৈরি object", "যার prototype = Person.prototype"] },
          note: "**`new` binding:** Regular function এ `new` থাকলে engine একটি নতুন object বানিয়ে সেটিকেই `this` করে। `bind` করা function এও `new` কাজ করলে `new` জেতে (bound `this` উপেক্ষিত)।",
        },
        {
          active: ["q", "explicit", "result"],
          items: { explicit: ["greet.call(user)", "greet.apply(user)", "greet.bind(user)()"], result: ["this = user", "(thisArg হিসেবে যা দেওয়া হয়েছে)"] },
          note: "**Explicit binding:** আপনি নিজে `this` ঠিক করে দিচ্ছেন। এটি implicit (`obj.fn`) এর চেয়ে শক্তিশালী — `a.greet.call(b)` এ `this` হয় `b`, `a` নয়।",
        },
        {
          active: ["q", "implicit", "result"],
          items: { implicit: ["user.greet()", "dot এর বাঁ দিক = user"], result: ["this = user", "(receiver object)"] },
          note: "**Implicit binding:** `obj.method()` আকারের call এ `this` হয় dot এর বাঁ দিকের object। শুধু **সরাসরি call এর মুহূর্তে** dot থাকলেই এটি কাজ করে — আগে কোথাও `const f = obj.method` করলে এই তথ্য হারিয়ে যায়।",
        },
        {
          active: ["q", "default", "result"],
          items: { default: ["greet()", "কোনো dot/call/new নেই"], result: ["strict: this = undefined", "sloppy: this = globalThis"] },
          note: "**Default binding:** উপরের কিছুই মেলেনি। Strict mode (ES Module, class, `\"use strict\"`) এ `this` হয় `undefined`; sloppy mode এ `globalThis`। Lost-this bug ঠিক এই ধাপে এসে পড়ে।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Lost-this bug: method extract করার সময় কী হারায়?",
      caption: "`counter.inc()` এ receiver (counter) call-site এ ছিল; `const f = counter.inc` এ শুধু function টি কপি হয়, receiver নয়।",
      nodes: [
        { id: "obj", label: "counter", sub: "object" },
        { id: "ref", label: "const f", sub: "variable" },
        { id: "site", label: "call-site", sub: "যেখানে call হয়" },
        { id: "this", label: "this", sub: "ফলাফল" },
      ],
      steps: [
        {
          active: ["obj", "site", "this"],
          items: {
            obj: ["{ count: 0, inc() {...} }"],
            site: ["counter.inc()", "base object = counter"],
            this: ["this = counter", "this.count++ → ঠিক"],
          },
          note: "**ঠিক call:** `counter.inc()` এ call-site এই dot এর বাঁ দিকে `counter` আছে। engine `this = counter` বসায়, `this.count++` ঠিকভাবে `counter.count` বাড়ায়।",
        },
        {
          active: ["obj", "ref"],
          items: {
            obj: ["{ count: 0, inc() {...} }"],
            ref: ["f → function inc (শুধু function টি)", "counter এর কোনো তথ্য নেই"],
          },
          note: "**Extract:** `const f = counter.inc;` — `f` এ শুধু `inc` function value টি কপি হলো। কোন object থেকে আনা হয়েছে, সেই সংযোগ function এর ভেতরে লেখা থাকে না। Function আর object স্বাধীন।",
        },
        {
          active: ["ref", "site", "this"],
          items: {
            ref: ["f → function inc"],
            site: ["f()", "কোনো dot নেই → default binding"],
            this: ["strict: this = undefined", "this.count++ → TypeError"],
          },
          note: "**Bug:** `f()` plain call। Default binding অনুযায়ী `this = undefined` (strict)। `this.count` পড়তে গিয়ে `TypeError`। Sloppy mode হলে `this = globalThis` হয়ে `globalThis.count` এ `NaN` লেখা হতো — আরও খারাপ, কারণ error ই আসত না।",
        },
        {
          active: ["obj", "ref", "this"],
          items: {
            obj: ["{ count: 0, inc() {...} }"],
            ref: ["f = counter.inc.bind(counter)", "অথবা f = () => counter.inc()"],
            this: ["this = counter (সবসময়)"],
          },
          note: "**সমাধান:** `bind` একটি নতুন function বানায় যার `this` স্থায়ীভাবে `counter`; অথবা arrow wrapper এর ভেতরে call টি আবার `counter.inc()` আকারে রাখুন। এখন `f()` plain call হলেও `this = counter`।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Implicit বনাম default binding: একই function, ভিন্ন `this`",
      description: "একই `greet` function তিনটি আলাদা object এ বসানো হয়েছে। Dot এর বাঁ দিকে যে আছে সেই `this`। শেষে plain call এ কী হয় লক্ষ্য করুন।",
      code: `const user = {
  name: "Rina",
  greet() {
    return "Hi, " + this.name;
  },
};

const admin = { name: "Karim", greet: user.greet };   // একই function, অন্য object এ

console.log(user.greet());    // this = user
console.log(admin.greet());   // this = admin

function whoAmI() {
  return this === undefined ? "this is undefined" : "this is something";
}
console.log(whoAmI());        // plain call → strict mode এ undefined`,
    },
    {
      level: "intermediate",
      title: "Lost-this ও তার তিনটি সমাধান",
      description: "`counter.inc` extract করলে `this` হারায়। `bind`, arrow wrapper এবং `call` — এই তিন উপায়ে ঠিক করুন।",
      code: `const counter = {
  count: 0,
  inc() {
    this.count++;
    return this.count;
  },
};

console.log(counter.inc());       // 1 — implicit binding

const lost = counter.inc;
try {
  lost();                         // default binding → this = undefined
} catch (e) {
  console.log("lost() failed:", e.name);
}

const bound = counter.inc.bind(counter);
console.log(bound());             // 2 — bind: this স্থায়ীভাবে counter

const wrapped = () => counter.inc();
console.log(wrapped());           // 3 — arrow wrapper: call এখনো dot দিয়ে

console.log(counter.inc.call(counter));   // 4 — প্রতিবার নিজে this দেওয়া`,
    },
    {
      level: "real-world",
      title: "Event emitter এ class handler: method, bound, arrow field",
      description: "UI/Node এ event system handler কে plain function হিসেবে call করে। দেখুন class এর তিন ধরনের handler এ কোনটি `this` হারায়, কোনটি হারায় না (React class component এর পুরোনো সমস্যার সরল রূপ)।",
      code: `class Emitter {
  constructor() {
    this.handlers = {};
  }
  on(name, fn) {
    (this.handlers[name] ??= []).push(fn);
    return this;
  }
  emit(name, ...args) {
    for (const fn of this.handlers[name] ?? []) {
      fn(...args);                  // handler কে plain function হিসেবে call
    }
  }
}

class Counter {
  count = 0;

  handleMethod() {                  // prototype method, bound নয়
    this.count++;
  }
  handleArrow = () => {             // class field arrow: প্রতি instance এ নিজস্ব function
    this.count++;
  };
  constructor() {
    this.handleBound = this.handleBound.bind(this);   // পুরোনো React class pattern
  }
  handleBound() {
    this.count++;
  }
}

function tryEmit(bus, name) {
  try {
    bus.emit(name);
    return "ok";
  } catch (e) {
    return e.name;
  }
}

const c = new Counter();
const bus = new Emitter();
bus.on("a", c.handleMethod).on("b", c.handleArrow).on("c", c.handleBound);

console.log("method:", tryEmit(bus, "a"), "count =", c.count);
console.log("arrow: ", tryEmit(bus, "b"), "count =", c.count);
console.log("bound: ", tryEmit(bus, "c"), "count =", c.count);`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
// টিপ: top-level this না দেখে, সবসময় function এর ভেতরে this পরীক্ষা করুন
function show() {
  return this;
}
console.log(show());
console.log(show.call("hello"));
`,
    },
    {
      label: "Precedence: new > explicit > implicit > default",
      code: `function show() {
  return this && this.id;
}
const a = { id: "a", show };
const b = { id: "b" };

console.log(a.show());          // implicit → a
console.log(show.call(b));      // explicit → b
console.log(a.show.call(b));    // explicit implicit কে হারায় → b

const bound = show.bind(a);
console.log(bound.call(b));     // bind আগে হয়েছে; পরের call দিয়ে বদলানো যায় না → a

function Thing() {
  this.tag = "thing";
}
const BoundThing = Thing.bind(a);
const t = new BoundThing();     // new, bound this কে হারায়
console.log(t.tag, t.id);       // thing undefined

console.log(show());            // default → this undefined → undefined`,
    },
    {
      label: "Getter ও receiver (prototype chain সহ)",
      code: `const person = {
  first: "Rina",
  last: "Akter",
  get fullName() {
    return this.first + " " + this.last;
  },
};

console.log(person.fullName);       // this = person

const child = Object.create(person);   // person কে prototype বানিয়ে
child.first = "Mim";
console.log(child.fullName);        // getter prototype এ, কিন্তু this = child → "Mim Akter"`,
    },
    {
      label: "Arrow এর lexical this: method ও timer",
      code: `const timer = {
  label: "T1",
  startArrow() {
    // arrow এর this = startArrow এর this = timer
    setTimeout(() => console.log("arrow  :", this.label), 0);
  },
  startRegular() {
    // regular function callback এর this নিজস্ব নিয়মে ঠিক হয় (runtime-নির্ভর) — কিন্তু timer নয়
    setTimeout(function () {
      console.log("regular:", this === timer);
    }, 0);
  },
};

timer.startArrow();
timer.startRegular();`,
    },
    {
      label: "Primitive this: strict mode বনাম boxing",
      code: `function typeOfThis() {
  return typeof this;
}

console.log(typeOfThis.call(5));        // strict: "number" (sloppy mode এ "object")
console.log(typeOfThis.call("hi"));     // "string"
console.log(typeOfThis.call(undefined)); // strict: "undefined"
console.log(typeOfThis.call(null));      // strict: "object" (typeof null এর পুরোনো quirk, this = null)`,
    },
  ],

  debugging: [
    {
      title: "TypeError: Cannot read properties of undefined (method extract)",
      bad: `const user = {
  name: "Rina",
  greet() {
    return "Hi, " + this.name;
  },
};

const greet = user.greet;
console.log(greet());`,
      why: "`const greet = user.greet` শুধু function টি কপি করে, `user` এর সংযোগ নয়। `greet()` plain call, তাই strict mode এ `this === undefined` এবং `this.name` পড়তে `TypeError`। Sloppy mode এ `this = globalThis` হয়ে `globalThis.name` (সাধারণত `undefined`) পড়া হতো — bug তখন নীরবে ভুল ফল দিত।",
      fix: `const user = {
  name: "Rina",
  greet() {
    return "Hi, " + this.name;
  },
};

const greet = user.greet.bind(user);   // অথবা () => user.greet()
console.log(greet());`,
    },
    {
      title: "Method এর ভেতরের nested function এ this হারানো",
      bad: `const team = {
  name: "Alpha",
  members: ["Rina", "Karim"],
  list() {
    return this.members.map(function (m) {
      return this.name + ": " + m;
    });
  },
};

console.log(team.list());`,
      why: "`team.list()` এ `list` এর `this = team` — ঠিক। কিন্তু `map` এর ভেতরের `function (m) {...}` regular function; `map` সেটিকে plain call করে, তাই ওই function এর `this` আবার নতুন করে নির্ধারিত হয় (strict এ `undefined`)। Outer `this` উত্তরাধিকারসূত্রে আসে না। সমাধান: arrow function (lexical `this`)।",
      fix: `const team = {
  name: "Alpha",
  members: ["Rina", "Karim"],
  list() {
    return this.members.map((m) => this.name + ": " + m);   // arrow: this = list এর this
  },
};

console.log(team.list());`,
    },
    {
      title: "Object literal এ arrow function দিয়ে method লেখা",
      bad: `function makeCounter() {
  return {
    n: 1,
    read: () => (this === undefined ? "no this" : this.n),
  };
}

const c = makeCounter();
console.log(c.read());`,
      why: "Object literal `{ }` নিজে `this` context তৈরি করে না। Arrow `read` এর `this` আসে বাইরের `makeCounter` এর `this` থেকে — যা এখানে plain call এর কারণে `undefined`। `c.read()` লিখলেও লাভ নেই, কারণ arrow এ implicit binding কাজ করে না। Object এর method এ `this` চাইলে method shorthand লিখুন।",
      fix: `function makeCounter() {
  return {
    n: 1,
    read() {
      return this.n;            // method shorthand: implicit binding কাজ করে
    },
  };
}

const c = makeCounter();
console.log(c.read());`,
    },
    {
      title: "Constructor এ `new` ভুলে যাওয়া",
      bad: `function Person(name) {
  this.name = name;
}

const p = Person("Rina");
console.log(p);`,
      why: "`new` ছাড়া `Person(\"Rina\")` plain call; strict mode এ `this === undefined`, তাই `this.name = name` এ `TypeError`। Sloppy mode এ `this = globalThis` হয়ে global এ `name` তৈরি হতো এবং `p` হতো `undefined` — নীরব দূষণ। আধুনিক কোডে `class` ব্যবহার করুন; `new` ছাড়া call করলে সেটি সরাসরি error দেয়।",
      fix: `function Person(name) {
  this.name = name;
}

const p = new Person("Rina");   // new binding: this = নতুন object
console.log(p.name);

class Person2 {
  constructor(name) {
    this.name = name;
  }
}
console.log(new Person2("Karim").name);`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "হারানো this ফিরিয়ে আনুন",
      prompt: "নিচের কোড `TypeError` দেয়। `user.greet` কে `user` এর সাথে বেঁধে `greet` তৈরি করুন, যাতে `Hi, Rina` print হয়।",
      starter: `const user = {
  name: "Rina",
  greet() {
    return "Hi, " + this.name;
  },
};

const greet = user.greet;   // TODO: ঠিক করুন

console.log(greet());`,
      expected: "Hi, Rina",
      hints: ["Function এর `this` স্থায়ীভাবে বাঁধতে কোন method আছে?", "`user.greet.bind(user)` একটি নতুন function ফেরত দেয়।"],
      solution: `const user = {
  name: "Rina",
  greet() {
    return "Hi, " + this.name;
  },
};

const greet = user.greet.bind(user);

console.log(greet());`,
      explanation: "`bind(user)` একটি নতুন function বানায় যার `this` সবসময় `user`। এখন `greet()` plain call হলেও `this = user`।",
    },
    {
      level: "beginner",
      title: "অন্য object এর this দিয়ে function চালান",
      prompt: "`describe` function টি `box` এর `this` নিয়ে চালান (function টি box এর property করবেন না) এবং `Box (3)` print করুন।",
      starter: `function describe() {
  return this.label + " (" + this.size + ")";
}

const box = { label: "Box", size: 3 };

// TODO: describe কে box কে this বানিয়ে call করুন
console.log(___);`,
      expected: "Box (3)",
      hints: ["Explicit binding: `call` বা `apply`।", "`describe.call(box)`।"],
      solution: `function describe() {
  return this.label + " (" + this.size + ")";
}

const box = { label: "Box", size: 3 };

console.log(describe.call(box));`,
      explanation: "`call(thisArg)` function টিকে তৎক্ষণাৎ চালায় এবং `this` হিসেবে `box` দেয়। এটি explicit binding।",
    },
    {
      level: "beginner",
      title: "Nested callback এর this ঠিক করুন",
      prompt: "`labels()` এর ভেতরের callback এ `this.prefix` পাওয়া যাচ্ছে না। শুধু callback এর ধরন বদলে `[ 'item-pen', 'item-book' ]` print করান।",
      starter: `const cart = {
  prefix: "item-",
  items: ["pen", "book"],
  labels() {
    return this.items.map(function (i) {
      return this.prefix + i;
    });
  },
};

console.log(cart.labels());`,
      expected: "[ 'item-pen', 'item-book' ]",
      hints: ["কোন ধরনের function এর নিজস্ব `this` নেই?", "`function (i) { ... }` কে arrow `(i) => ...` বানান।"],
      solution: `const cart = {
  prefix: "item-",
  items: ["pen", "book"],
  labels() {
    return this.items.map((i) => this.prefix + i);
  },
};

console.log(cart.labels());`,
      explanation: "Arrow function এর `this` বাইরের scope (`labels` method) থেকে আসে, যেখানে `this = cart`।",
    },
    {
      level: "intermediate",
      title: "Class handler কে নিরাপদ বানান",
      prompt: "`handler` plain function হিসেবে call হচ্ছে বলে `this` হারাচ্ছে। শুধু `Toggle` class বদলে (নিচের call অংশ বদলাবেন না) যেন তিনবার ডাকার পর `true` print হয়।",
      starter: `class Toggle {
  on = false;
  flip() {
    this.on = !this.on;
  }
}

const t = new Toggle();
const handler = t.flip;   // এটি বদলাবেন না

handler();
handler();
handler();
console.log(t.on);`,
      expected: "true",
      hints: ["Class field এ arrow function ব্যবহার করুন।", "`flip = () => { this.on = !this.on; };`"],
      solution: `class Toggle {
  on = false;
  flip = () => {
    this.on = !this.on;
  };
}

const t = new Toggle();
const handler = t.flip;

handler();
handler();
handler();
console.log(t.on);`,
      explanation: "Class field arrow function instance তৈরির সময় তৈরি হয়, এবং তার `this` সেই instance। তাই extract করলেও `this` হারায় না। (খরচ: প্রতি instance এ আলাদা function।)",
    },
    {
      level: "intermediate",
      title: "bind দিয়ে preset argument",
      prompt: "`bind` ব্যবহার করে `add10` তৈরি করুন, যা `add` এর প্রথম argument কে `10` দিয়ে বেঁধে রাখে। `add10(1, 2)` কে `13` print করতে হবে।",
      starter: `function add(a, b, c) {
  return a + b + c;
}

const add10 = undefined;   // TODO

console.log(add10(1, 2));`,
      expected: "13",
      hints: ["`bind` এর প্রথম argument `thisArg`, বাকিগুলো preset argument।", "এই function এ `this` লাগে না, তাই `null` দিন: `add.bind(null, 10)`।"],
      solution: `function add(a, b, c) {
  return a + b + c;
}

const add10 = add.bind(null, 10);

console.log(add10(1, 2));`,
      explanation: "`bind(null, 10)` এ `this` অপ্রাসঙ্গিক (`null`), `10` প্রথম argument হিসেবে preset। পরে `1, 2` যুক্ত হয়ে `add(10, 1, 2)`।",
    },
    {
      level: "challenge",
      title: "Real-world: `once` wrapper যা this হারায় না",
      prompt:
        "`once(fn)` এমন function ফেরত দেয় যা শুধু প্রথমবার `fn` চালায়, পরে প্রথম ফলাফল ফেরত দেয়। বর্তমান কোডে `api.url = once(api.url)` এর পর `this` হারিয়ে যায়। Wrapper ঠিক করুন যাতে wrapper কে যে `this` দিয়ে call করা হয়, সেটি `fn` ও পায় এবং সব argument ও যায়।",
      starter: `function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn(...args);   // BUG: this হারাচ্ছে
    }
    return result;
  };
}

const api = {
  base: "/v1",
  url(path) {
    return this.base + path;
  },
};

api.url = once(api.url);
console.log(api.url("/users"));
console.log(api.url("/posts"));`,
      expected: "/v1/users\n/v1/users",
      hints: ["Wrapper এ `function` (arrow নয়) রাখুন, যাতে call এর `this` পাওয়া যায়।", "`fn(...args)` এর বদলে `fn.apply(this, args)` বা `fn.call(this, ...args)`।"],
      solution: `function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const api = {
  base: "/v1",
  url(path) {
    return this.base + path;
  },
};

api.url = once(api.url);
console.log(api.url("/users"));
console.log(api.url("/posts"));`,
      explanation: "Wrapper regular function হওয়ায় `api.url(...)` call এ তার `this = api`। `fn.apply(this, args)` সেই `this` ও argument গুলো আসল function এ পাঠায়। দ্বিতীয় call এ cache করা ফলই ফেরত যায় — তাই `/v1/users` দুবার। এই `fn.apply(this, args)` pattern ই debounce/throttle/memoize এর মতো decorator এর ভিত্তি।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "Strict mode এ নিচের কোডে `f()` call এর সময় `this` কী? `const f = obj.method; f();`",
        options: ["`obj`", "`undefined`", "`globalThis`", "`method` function নিজে"],
        answer: 1,
        explanation: "`f()` plain call, কোনো dot/`call`/`new` নেই, তাই default binding। Strict mode এ default `this` হলো `undefined`। `obj` হতো যদি `obj.method()` লেখা হতো। `globalThis` শুধু sloppy mode এ। Function নিজে কখনোই `this` হয় না — এটি একটি জনপ্রিয় ভুল ধারণা।",
      },
      {
        question: "Arrow function এর `this` কখন নির্ধারিত হয়?",
        options: [
          "প্রতিবার call করার সময়, call-site দেখে",
          "`bind` করার সময়",
          "Arrow function যেখানে লেখা হয় সেই scope এ — lexically",
          "সবসময় `globalThis`",
        ],
        answer: 2,
        explanation: "Arrow এর নিজস্ব `this` নেই; বাইরের scope এর `this` ধার করে, তাই লেখার জায়গাই ঠিক করে দেয়। প্রথম অপশন regular function এর নিয়ম। `bind`/`call` arrow এর `this` বদলাতে পারে না। সবসময় `globalThis` ভুল — arrow কোনো method এর ভেতরে লেখা হলে সেই method এর `this` পায়।",
      },
      {
        question: "`const bound = show.bind(a); bound.call(b);` এ `show` এর ভেতরে `this` কী?",
        options: ["`a`", "`b`", "`undefined`", "`bound` function"],
        answer: 0,
        explanation: "`bind` একটি নতুন function তৈরি করে যার `this` স্থায়ীভাবে `a` এ বাঁধা। পরের `call(b)` সেই bound `this` বদলাতে পারে না। তাই `a`। `b` হতো unbound function এ `call(b)` করলে। (শুধু `new bound()` bound `this` কে উপেক্ষা করতে পারে।)",
      },
      {
        question: "`const o = { n: 1, get: () => this.n };` — কেন `o.get()` প্রত্যাশিত ফল দেয় না?",
        options: [
          "Arrow function property হতে পারে না",
          "`o.get()` এ implicit binding শুধু `const` এ কাজ করে না",
          "`this` সবসময় `undefined`",
          "Object literal `this` context তৈরি করে না, arrow এর `this` আসে বাইরের scope থেকে — `o` থেকে নয়",
        ],
        answer: 3,
        explanation: "Arrow এ implicit binding কাজ করে না, আর `{ }` literal কোনো `this` scope বানায় না — তাই বাইরের scope এর `this` ই ব্যবহৃত হয়। Arrow property বৈধ (প্রথম অপশন ভুল)। `const` এর সাথে সম্পর্ক নেই। ‘সবসময় `undefined`’ ভুল — বাইরের scope এ কী `this` আছে তার ওপর নির্ভর করে (module এ `undefined`, classic script এ `window` ইত্যাদি)।",
      },
      {
        question: "নিচের কোনটি lost-this bug **ঠিক করে না**?",
        options: [
          "`setTimeout(counter.inc.bind(counter), 0)`",
          "`setTimeout(() => counter.inc(), 0)`",
          "`setTimeout(counter.inc, 0)`",
          "`[1, 2].forEach(counter.add, counter)` (যেখানে `add` regular method)",
        ],
        answer: 2,
        explanation: "`setTimeout(counter.inc, 0)` ই bug টির উৎস — শুধু function টি পাঠানো হচ্ছে, `counter` নয়; timer সেটি plain function হিসেবে call করে। বাকিগুলো ঠিক: `bind` `this` বাঁধে, arrow wrapper এ call এখনো dot দিয়ে, আর `forEach` এর দ্বিতীয় argument `thisArg` হিসেবে `counter` দেয়।",
      },
    ],
    coding: [
      {
        title: "forEach এ thisArg দিয়ে logger",
        prompt: "`logger.log` কে `forEach` এর callback হিসেবে পাঠালে `this` হারায়। `bind` বা arrow ছাড়া, শুধু `forEach` এর দ্বিতীয় argument ব্যবহার করে `[app] a` ও `[app] b` (আলাদা লাইনে) print করান।",
        starter: `const logger = {
  prefix: "[app]",
  log(msg) {
    console.log(this.prefix + " " + msg);
  },
};

["a", "b"].forEach(logger.log);   // TODO: ঠিক করুন`,
        expected: "[app] a\n[app] b",
        solution: `const logger = {
  prefix: "[app]",
  log(msg) {
    console.log(this.prefix + " " + msg);
  },
};

["a", "b"].forEach(logger.log, logger);`,
      },
      {
        title: "Method chaining: this ফেরত দিন",
        prompt: "`Calculator` এর `add` ও `mul` কে chain করা যাওয়ার মতো বানান (`new Calculator(2).add(3).mul(4).value` = 20) এবং `20` print করুন।",
        starter: `class Calculator {
  constructor(value) {
    this.value = value;
  }
  add(n) {
    this.value += n;
  }
  mul(n) {
    this.value *= n;
  }
}

console.log(new Calculator(2).add(3).mul(4).value);`,
        expected: "20",
        solution: `class Calculator {
  constructor(value) {
    this.value = value;
  }
  add(n) {
    this.value += n;
    return this;
  }
  mul(n) {
    this.value *= n;
    return this;
  }
}

console.log(new Calculator(2).add(3).mul(4).value);`,
      },
    ],
  },

  interview: [
    {
      q: "JavaScript এ `this` কীভাবে নির্ধারিত হয়?",
      a: "Arrow function ছাড়া সব function এ `this` ঠিক হয় **call এর সময়**, function কোথায় লেখা হয়েছে তা দেখে নয়। Precedence অনুযায়ী চারটি নিয়ম: (১) `new` — নতুন object; (২) explicit — `call`/`apply`/`bind` এর `thisArg`; (৩) implicit — `obj.fn()` এ `obj`; (৪) default — strict এ `undefined`, sloppy এ `globalThis`।\n\nArrow function এ আলাদা: তার নিজস্ব `this` নেই, enclosing scope থেকে lexically নেয়, তাই `call`/`bind` ও তা বদলাতে পারে না। Interview এ একটি উদাহরণ দিয়ে দেখান: একই function তিনটি ভিন্ন ভাবে call করলে তিন ভিন্ন `this`।",
    },
    {
      q: "`const f = obj.method; f();` এ কী সমস্যা হয় এবং কীভাবে ঠিক করবেন?",
      a: "`obj.method` evaluate করলে শুধু function value টি পাওয়া যায়; `obj` এর সাথে সংযোগ (receiver) call-site এর সাথে ছিল, function এর ভেতরে নয়। `f()` plain call হওয়ায় default binding চলে — strict এ `this = undefined` (তাই `TypeError`), sloppy এ `globalThis` (নীরবে ভুল ফল/global দূষণ)।\n\nসমাধান: `obj.method.bind(obj)`, arrow wrapper `() => obj.method()`, class এ arrow field, অথবা API তে `thisArg` সুবিধা থাকলে সেটি। কোনটি কখন: handler দীর্ঘদিন বেঁচে থাকলে `bind`/field; এক-লাইনের callback এ arrow wrapper; আর design এর দিক থেকে যদি method এ `this` আদৌ দরকার না হয় তবে plain function ও closure ভালো বিকল্প।",
    },
    {
      q: "Arrow function ও regular function এ `this` এর পার্থক্য কী? কখন কোনটি ব্যবহার করবেন?",
      a: "Regular function এর `this` call এর সময় ঠিক হয়; arrow function এর `this` তার চারপাশের scope থেকে lexically আসে (ঠিক বাইরের variable এর মতো) এবং কখনো বদলায় না। এছাড়া arrow এ নিজস্ব `arguments` নেই এবং `new` দিয়ে call করা যায় না।\n\nনিয়ম: object/class এর **method** এ `this` চাইলে regular method shorthand (implicit binding কাজ করবে)। Method এর **ভেতরের callback** (`map`, `setTimeout`, promise `.then`) এ arrow, যাতে outer `this` ধরে রাখা যায়। Object literal এ arrow property দিয়ে method লিখবেন না — তার `this` object নয়, বাইরের scope।",
    },
    {
      q: "React class component এ `this.handleClick = this.handleClick.bind(this)` কেন লেখা হতো? এখন কী হয়?",
      a: "Class এর method prototype এ থাকে, instance এর সাথে bound নয়। `onClick={this.handleClick}` এ React handler টি event system থেকে plain function হিসেবে call করে, তাই `this` হারায় এবং `this.setState` এ `TypeError` আসত। সমাধান ছিল constructor এ একবার `bind` করে নতুন bound function instance এ রাখা (প্রতি render এ নতুন function বানানো এড়াতে), বা JSX এ arrow wrapper।\n\nপরে class field arrow (`handleClick = () => {}`) জনপ্রিয় হয় কারণ এটি লিখতে সহজ। এখন function component ও hooks এ কোনো `this` নেই — handler closure দিয়ে state/props ধরে। তবু legacy কোড, error boundary (যা এখনো class) ও অন্যান্য library এর callback বুঝতে এই জ্ঞান দরকার।",
    },
    {
      q: "Strict mode ও sloppy mode এ `this` এর পার্থক্য কী? কোথায় কোথায় সবসময় strict?",
      a: "Plain call এ strict mode এ `this` থাকে `undefined`; sloppy mode এ `undefined`/`null` কে `globalThis` দিয়ে বদলে দেওয়া হয়, এবং primitive `this` (যেমন `fn.call(5)`) wrapper object এ boxed হয় (`typeof this === 'object'`); strict এ primitive `this` যেমন আছে তেমনই (`'number'`)।\n\nSloppy mode এর বিপদ: ভুল করে global এ property লেখা, bug লুকিয়ে যাওয়া। **ES Module ও class body সবসময় strict**; `\"use strict\"` directive ও function/script কে strict বানায়। তাই আধুনিক bundler/ESM কোডে বাস্তবে প্রায় সবসময় strict আচরণ পাবেন; classic `<script>` ও পুরোনো CommonJS ফাইলে (directive ছাড়া) sloppy হতে পারে।",
    },
    {
      q: "`new` binding কীভাবে কাজ করে এবং `bind` করা function এ `new` দিলে কী হয়?",
      a: "`new F(...)` মোটামুটি: (১) `F.prototype` কে prototype ধরে নতুন object তৈরি; (২) সেটিকে `this` ধরে `F` চালানো; (৩) `F` যদি object return না করে তবে নতুন object টিই ফল (object return করলে সেটি, primitive return উপেক্ষিত)।\n\n`new` এর precedence সবচেয়ে বেশি: bound function কে `new` দিয়ে call করলে `bind` এ দেওয়া `thisArg` উপেক্ষিত হয় (preset argument গুলো তবু প্রযোজ্য)। Arrow function এ `[[Construct]]` নেই, তাই `new` দিলে `TypeError`। `new` ভুলে গেলে constructor এ default binding চলে — strict এ error, sloppy এ global দূষণ; class syntax এ `new` ছাড়া call করলেই error।",
    },
    {
      q: "`setTimeout(obj.method, 0)` এ `this` কী হয়? `this` এর ওপর কেন নির্ভর করা উচিত নয়?",
      a: "Timer method টিকে plain function হিসেবে call করে, তাই `obj` হারায়। তবে regular function callback এ `this` এর মান **host** ঠিক করে: browser এ সাধারণত global object (`window`/`self`), Node.js এ `Timeout` object। এটি runtime-নির্ভর, ECMAScript এর নিশ্চয়তা নয়, তাই কোনো কোডে এর ওপর নির্ভর করা ভুল।\n\nনির্ভরযোগ্য উপায়: method এর ভেতর থেকে timer শুরু করলে arrow callback (`() => this.tick()`), বাইরে থেকে পাঠালে `bind` বা arrow wrapper। ‘timer এর callback এর `this` কী’ এ ধরনের প্রশ্নে ‘environment-নির্ভর, ভরসা করা উচিত নয়’ বলাই সবচেয়ে সঠিক উত্তর।",
    },
  ],

  summary: {
    takeaways: [
      "`this` নির্ধারিত হয় **call-site** দেখে (arrow ছাড়া); function কোথায় লেখা, তা অপ্রাসঙ্গিক।",
      "Precedence: `new` > explicit (`call`/`apply`/`bind`) > implicit (`obj.fn()`) > default (strict: `undefined`, sloppy: `globalThis`)।",
      "Arrow function এর নিজস্ব `this` নেই — লেখার জায়গার (lexical) `this` ব্যবহার করে এবং `call`/`bind` ও তা বদলাতে পারে না।",
      "Method extract (`const f = obj.method`) বা callback হিসেবে পাঠালে receiver হারায় — lost-this bug; `bind`, arrow wrapper, class field arrow বা `thisArg` দিয়ে ঠিক হয়।",
      "Object method এ method shorthand, method এর ভেতরের callback এ arrow — এই জোড়া নিয়মই বেশির ভাগ সমস্যা এড়ায়।",
      "ES Module ও class body সবসময় strict; Browser classic script এ top-level `this` = `window`, Node CommonJS এ `module.exports`, ESM এ `undefined`।",
    ],
    syntax: `obj.method();               // implicit: this = obj
fn();                       // default: undefined (strict) / globalThis (sloppy)
fn.call(thisArg, a, b);     // explicit
fn.apply(thisArg, [a, b]);  // explicit
const g = fn.bind(thisArg); // explicit, স্থায়ী
new Fn();                   // new: this = নতুন object
const h = () => this;       // lexical: বাইরের scope এর this`,
    whenToUse: [
      "Object/class এর method এ `this` চাইলে → method shorthand (`greet() {}`), arrow নয়।",
      "Method এর ভেতরের callback (`map`, `setTimeout`, `.then`) এ outer `this` লাগলে → arrow function।",
      "Method কে callback/handler হিসেবে পাঠাতে হলে → `bind`, arrow wrapper বা class field arrow।",
      "`this` এর প্রয়োজন না থাকলে → plain function ও closure; অকারণে `this` এ জড়াবেন না।",
    ],
    next: ["call, apply, bind — explicit binding এর গভীরে", "Classes ও Prototype (OOP module) — `new`, `super` ও `this`", "Closures ও Lexical Scope — arrow এর `this` কেন variable এর মতো আচরণ করে"],
  },

  compatibility:
    "`this` এর নিয়ম (চার binding rule, arrow এর lexical `this`) ES5/ES2015 থেকে সব engine এ একই। Class field (`handle = () => {}`) ES2022 এর অংশ — সব আধুনিক browser ও Node.js (12+) এ কাজ করে। Top-level `this` এর মান environment ভেদে আলাদা: browser এর classic script এ `window`, ES Module এ `undefined`, Node.js CommonJS এ `module.exports`, Node.js ESM এ `undefined`। Timer callback এর `this` host-নির্ভর (browser এ global object, Node.js এ `Timeout`)। এই lesson এর Playground browser-like Web Worker এ strict mode এ চলে, তাই plain call এ `this` সবসময় `undefined`।",
};
