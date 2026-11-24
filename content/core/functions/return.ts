import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "`return` কী করে — function কে থামায় এবং caller কে একটি মান দেয় — এবং `return` না থাকলে কেন `undefined` আসে তা explain করতে পারবেন।",
    "`return` ও `console.log` এর পার্থক্য এবং side effect বনাম return value এর ভূমিকা বুঝবেন।",
    "Guard clause / early return দিয়ে কোড সমতল রাখতে এবং `return` এর পরে newline দিলে ASI trap ঘটে তা চিনতে পারবেন।",
    "একাধিক মান ফেরত দেওয়া (array/object), function ফেরত দেওয়া, arrow এর implicit return (`({ ... })` সহ) সঠিকভাবে লিখতে পারবেন।",
    "Loop, `forEach`, `try/finally` ও constructor এর ভেতরে `return` এর আচরণ এবং `return this` chaining বুঝবেন।",
  ],

  concept: [
    { type: "h3", text: "`return` আসলে কী করে?" },
    {
      type: "p",
      text: "`return` statement দুটি কাজ একসাথে করে। **প্রথমত**, সাথে সাথে function এর execution **থামিয়ে দেয়** — এর পরের কোনো লাইন চলে না। **দ্বিতীয়ত**, `return` এর পাশের expression টি evaluate করে সেই মানটি **caller কে ফেরত দেয়** — অর্থাৎ `f(x)` call expression টির নিজের মান হয়ে যায় সেই মান। Call stack এর ভাষায়: function এর frame pop হয় এবং ফেরত-মান caller এর হাতে চলে যায়।",
    },
    {
      type: "code",
      code: "function add(a, b) {\n  return a + b;     // মান দিয়ে ফিরে যায়\n  console.log('এটি চলবে না');   // unreachable\n}\n\nconst sum = add(2, 3);   // call expression এর মান = 5",
      caption: "Concept ব্যাখ্যার snippet; চালিয়ে দেখতে নিচের Examples ব্যবহার করুন।",
    },
    { type: "h3", text: "Implicit `undefined`" },
    {
      type: "p",
      text: "JavaScript এ প্রতিটি function call এর একটি মান থাকে। কোনো `return` না থাকলে, `return;` (মান ছাড়া) লিখলে, বা function body শেষ হয়ে গেলে ফেরত-মান হয় **`undefined`**। কোনো ভাষায় যেমন ‘void function’ নামে আলাদা ধরন আছে, JavaScript এ নেই। এই কারণে ভুলে `return` বাদ দিলে error আসে না — শুধু পরের কোডে `undefined` ছড়ায় (`undefined` এ property পড়তে গেলে `TypeError`)।",
    },
    { type: "h3", text: "`return` বনাম `console.log` — সবচেয়ে সাধারণ beginner বিভ্রান্তি" },
    {
      type: "p",
      text: "`console.log(x)` শুধু console এ **দেখায়** (একটি side effect) এবং নিজে `undefined` ফেরত দেয়। `return x` মানটি **কোডের কাছে** পৌঁছে দেয়, যাতে পরের কোড সেটি ব্যবহার করতে পারে (variable এ রাখা, গণনা, condition)। Console এ ‘সঠিক সংখ্যা’ দেখা মানেই function ঠিকভাবে `return` করছে — এমন নয়: যে function শুধু `console.log` করে, তার ফলকে `const total = calc()` এ রাখলে পাবেন `undefined`। UI তে (`React` component) মান screen এ পৌঁছায় `return` করা JSX দিয়ে, `console.log` দিয়ে নয়।",
    },
    {
      type: "compare",
      headers: ["", "`return value`", "`console.log(value)`"],
      rows: [
        ["উদ্দেশ্য", "Caller কে মান পৌঁছে দেওয়া", "Developer কে debugging এর জন্য দেখানো"],
        ["Function থামে?", "হ্যাঁ, সাথে সাথে", "না, কোড চলতে থাকে"],
        ["Call expression এর মান", "যা return করা হয়েছে", "`undefined`"],
        ["পরের কোড ব্যবহার করতে পারে?", "হ্যাঁ", "না"],
        ["Production এ", "ডেটা প্রবাহের মূল পথ", "সাধারণত বাদ দেওয়া হয়/logger এ বদলানো হয়"],
      ],
    },
    { type: "h3", text: "Early return ও guard clause" },
    {
      type: "p",
      text: "যেহেতু `return` সাথে সাথে বেরিয়ে যায়, ‘অবৈধ/ব্যতিক্রমী’ অবস্থা শুরুতেই সামলে নিয়ে বেরিয়ে যাওয়া যায় — একে বলে **guard clause**। এতে মূল (happy path) কোড nested `if/else` এর ভেতরে না থেকে সমতল ও পড়ার উপযোগী থাকে। Conditional Statements lesson এ `if/else` শিখেছি; guard clause হলো সেটিরই পরিচ্ছন্ন প্রয়োগ।",
    },
    {
      type: "code",
      code: "// nested — ডানে ডানে সরে যায়\nfunction discount(user, price) {\n  if (user) {\n    if (price > 0) {\n      return price * 0.9;\n    }\n  }\n  return 0;\n}\n\n// guard clause — সমতল\nfunction discount2(user, price) {\n  if (!user) return 0;\n  if (price <= 0) return 0;\n  return price * 0.9;     // happy path শেষে, নিরবচ্ছিন্ন\n}",
      caption: "দুটি function একই কাজ করে; দ্বিতীয়টি পড়া সহজ। (Concept snippet, non-executed।)",
    },
    { type: "h3", text: "ASI trap: `return` এর পরে newline" },
    {
      type: "p",
      text: "JavaScript এ `return` এবং তার মান একই লাইনে শুরু হতে হয়। `return` এর ঠিক পরেই line break থাকলে **Automatic Semicolon Insertion (ASI)** একটি semicolon বসিয়ে দেয়, তাই এটি `return;` হিসেবে পার্স হয় এবং function `undefined` ফেরত দেয়; নিচের লাইনের মান ‘unreachable code’ হয়ে পড়ে থাকে — কোনো error ছাড়াই। এই কারণে `return` এর পরে object literal এর `{` অথবা multi-line expression এর খোলা বন্ধনী `(` **একই লাইনে** লিখতে হয়। React এ multi-line JSX তাই `return (` দিয়ে শুরু হয়।",
    },
    {
      type: "code",
      code: "function bad() {\n  return          // ← ASI এখানে ; বসায়\n  {\n    ok: true\n  };\n}\nbad();   // undefined\n\nfunction good() {\n  return {        // { একই লাইনে\n    ok: true,\n  };\n}",
      caption: "Concept snippet; একই trap Debugging section এ চালিয়ে দেখানো আছে।",
    },
    { type: "h3", text: "একাধিক মান ফেরত দেওয়া" },
    {
      type: "p",
      text: "একটি function কেবল **একটি** মান ফেরত দিতে পারে (`return a, b` শুধু শেষটি `b` দেয় — comma operator)। একাধিক মান পাঠাতে সেগুলোকে একটি array বা object এ মুড়ে দিন, তারপর caller destructuring দিয়ে খুলে নেয়। **Array** ব্যবহার করুন যখন মান কম (২–৩টি) এবং ক্রম স্বাভাবিক — caller নিজের পছন্দের নাম দিতে পারে (যেমন React এর `const [count, setCount] = useState(0)`)। **Object** ব্যবহার করুন যখন মান বেশি বা নাম অর্থবহ — ক্রম মনে রাখতে হয় না, নতুন field যোগ করলে পুরোনো caller ভাঙে না (`const { data, error, isLoading } = useQuery(...)`)।",
    },
    { type: "h3", text: "Function ফেরত দেওয়া (closure এর পূর্বাভাস)" },
    {
      type: "p",
      text: "Function JavaScript এ সাধারণ মান, তাই `return` দিয়ে function ফেরত দেওয়া যায়: `const makeMultiplier = (factor) => (n) => n * factor;`। ভেতরের function টি বাইরের function এর `factor` মনে রাখে, এমনকি বাইরের function শেষ হয়ে যাওয়ার পরেও — এটাই **closure** (পরের lessons এ বিস্তারিত)। React hooks, event handler factory, `debounce` — সবই এই pattern এ তৈরি।",
    },
    { type: "h3", text: "Arrow function: implicit বনাম explicit return" },
    {
      type: "p",
      text: "Arrow function এর body যদি **একটি expression** হয় (কোনো `{}` ছাড়া), সেই expression এর মান **স্বয়ংক্রিয়ভাবে** ফেরত যায় — একে বলে implicit return: `x => x * 2`। Body তে `{ ... }` দিলে সেটি একটি সাধারণ function body হয়ে যায়, এবং তখন **আপনাকে স্পষ্ট `return`** লিখতে হয়। একটি বিখ্যাত ফাঁদ: implicit ভাবে **object literal** ফেরত দিতে চাইলে পুরো object টি বন্ধনীতে (`({ ... })`) মুড়তে হয়। নইলে `{` কে block এর শুরু ধরা হয়, ফলে `() => { a: 1 }` হয় ‘label `a` সহ expression `1`’ এবং function টি `undefined` ফেরত দেয়।",
    },
    {
      type: "compare",
      headers: ["লেখা", "ফেরত-মান", "কারণ"],
      rows: [
        ["`x => x * 2`", "`x * 2`", "concise body, implicit return"],
        ["`x => { x * 2 }`", "`undefined`", "block body — `return` লাগে"],
        ["`x => { return x * 2 }`", "`x * 2`", "explicit return"],
        ["`id => ({ id })`", "`{ id }` object", "বন্ধনী দিয়ে object literal"],
        ["`id => { id }`", "`undefined`", "`{}` block হিসেবে পার্স হয়"],
      ],
    },
    { type: "h3", text: "Loop, `forEach`, `try/finally` ও constructor এ `return`" },
    {
      type: "ul",
      items: [
        "**Loop এর ভেতরে**: `for`/`for...of`/`while` এর ভেতর থেকে `return` দিলে শুধু loop নয়, পুরো **function** থেকে বেরিয়ে যায় (`break` শুধু loop থেকে)। ‘প্রথম মিল খুঁজে বের করো’ ধরনের কাজে এটিই সবচেয়ে সরল।",
        "**`forEach` callback এ**: `return` শুধু সেই callback এর বর্তমান call থেকে বেরোয় (অনেকটা `continue` এর মতো); outer function বা `forEach` কে থামায় না, এবং `forEach` callback এর ফেরত-মান ব্যবহার করে না। থামাতে হলে `for...of`, `some`, `find` ব্যবহার করুন।",
        "**`try/finally`**: `try` তে `return` থাকলেও `finally` ব্লক চলে (cleanup এর জন্য), তারপর মান ফেরত যায়। `finally` এর ভেতরে নিজে `return` দিলে সেটি আগের ফেরত-মান (এমনকি ছোঁড়া error ও) **বাতিল করে দেয়** — তাই `finally` এ `return` লেখা এড়ানো হয়। বিস্তারিত Error Handling lesson এ।",
        "**Constructor এ (`new`)**: constructor যদি একটি **object** ফেরত দেয়, `new` সেই object ই দেয়; primitive ফেরত দিলে তা উপেক্ষিত হয় এবং নতুন তৈরি `this` ই ফেরত আসে। বাস্তবে constructor এ `return` প্রায় লাগেই না।",
        "**`async` function এ**: `return value` আসলে `value` দিয়ে resolved একটি **Promise** ফেরত দেয় (Async মডিউলে বিস্তারিত)।",
      ],
    },
    { type: "h3", text: "Side effect বনাম return value এবং `return this` chaining" },
    {
      type: "p",
      text: "একটি function সাধারণত দুইভাবে ‘কাজ’ করে: **return value** দিয়ে (নতুন মান তৈরি করে ফেরত দেয়) অথবা **side effect** দিয়ে (বাইরের কিছু বদলায় — console এ লেখা, global/argument mutate, DOM/network)। বুঝতে সহজ ও পরীক্ষাযোগ্য কোড লিখতে চাইলে গণনা return দিয়ে করুন এবং side effect আলাদা, সীমানার কাছে রাখুন (Pure Functions lesson এ এর গভীর আলোচনা আসবে)।",
    },
    {
      type: "p",
      text: "Object এর method এ `return this` দিলে caller পরপর method জুড়ে লিখতে পারে — **method chaining**: `query.where(...).limit(10).run()`। প্রতিটি method নিজের object টি (mutate করে) ফেরত দেয়, তাই পরের `.method()` সেটির উপর চলে। (Immutable ধাঁচে প্রতিবার নতুন object ফেরত দেওয়াও সম্ভব — array এর `map().filter()` chain এভাবেই চলে।) তবে সব method এ `return this` দিতে হবে এমন নয়; যে method কোনো মান ‘উত্তর’ হিসেবে দেয় (যেমন `total()`), সেটি chain শেষ করে।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "Silent bug: ভুলে যাওয়া `return` ও ASI",
      text: "ভুলে `return` বাদ দিলে, `return` এর পরে newline দিলে, অথবা arrow এ `{}` বসালে JavaScript কোনো error দেয় না — শুধু `undefined` ফেরত দেয়। Bug টি ধরা পড়ে অনেক দূরের কোডে (`Cannot read properties of undefined`)। অভ্যাস: multi-line return এ `return (` বা `return {` একই লাইনে; linter (`no-unreachable`, `consistent-return`) চালু রাখুন; এবং function যা ফেরত দেবে তার ধরন সবসময় একই রাখুন (কখনো array, কখনো `undefined` নয়)।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "সাধারণ ভুল ধারণা (Common misconceptions)",
      text: "(১) ‘`console.log` করলে মান ফেরত যায়’ — না, শুধু দেখায়; ফেরত-মান `undefined`। (২) ‘`forEach` এ `return` দিলে loop থামে’ — না, শুধু সেই iteration শেষ। (৩) ‘একাধিক মান একসাথে return করা যায় (`return a, b`)’ — না, comma operator শুধু শেষটি দেয়। (৪) ‘Arrow এ `{ ... }` দিলেও মান আপনা-আপনি ফেরত আসে’ — না, তখন স্পষ্ট `return` লাগে। (৫) ‘`finally` এর `return` নিরীহ’ — না, এটি `try` এর return/throw বাতিল করে।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "ব্যবহারের নিয়ম",
      text: "Function টিকে ‘মান-উৎপাদক’ হিসেবে ভাবুন: ইনপুট → `return` করা আউটপুট। শুরুতে guard clause, শেষে happy-path return। একাধিক মান লাগলে object (নামযুক্ত) বা ছোট tuple-এর জন্য array। Arrow এ object ফেরত দিলে `({ ... })`। `finally` তে `return` নয়।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "একটি **কুরিয়ার সার্ভিস** কল্পনা করুন। আপনি (caller) একটি কাজ বুঝিয়ে কুরিয়ারকে (function) পাঠান: ‘বাজার থেকে ১ কেজি চাল আনো’। কুরিয়ার কাজ করে ফিরে এসে **প্যাকেটটি আপনার হাতে দেয়** — এটিই `return`। প্যাকেটে যা থাকে সেটাই call expression এর মান।",
    },
    {
      type: "ul",
      items: [
        "**`return` মানে প্যাকেট হস্তান্তর + ডিউটি শেষ।** প্যাকেট দেওয়ার পরে কুরিয়ার আর কিছু করে না (`return` এর পরের কোড চলে না)।",
        "**`console.log` হলো কুরিয়ারের ফোনে বলা**: ‘আমি চাল পেয়েছি, ওজন ১ কেজি’। আপনি শুনলেন (console এ দেখলেন), কিন্তু **হাতে প্যাকেট এল না**। কুরিয়ার ফিরে এসে খালি হাতে দাঁড়ালে (`undefined`) আপনার রান্না এগোয় না।",
        "**কিছু না ফেরত দিলে** কুরিয়ার খালি হাতে ফেরে — কোনো অভিযোগ নেই, কিন্তু আপনার হাতে `undefined`। আর কুরিয়ারকে ‘ফিরে আসো আর **তারপর** প্যাকেট দাও’ বলার পরে যদি সে দরজায় নতুন লাইনে দাঁড়ায় (ASI), অফিস ভাবে সে খালি হাতেই ফিরে এসেছে।",
        "**Guard clause** হলো কুরিয়ারের ‘দোকান বন্ধ থাকলে শুরুতেই ফিরে এসে জানাও’ নিয়ম — অযথা পুরো রাস্তা না ঘুরে প্রথম বাধাতেই ফিরে আসা।",
        "**একাধিক মান** হলো একটি **বাক্সে** একাধিক জিনিস (array/object) — কুরিয়ার একবারে একটি বাক্সই দিতে পারে, আপনি বাক্স খুলে (destructuring) জিনিস আলাদা করেন।",
        "**Function ফেরত দেওয়া** হলো প্যাকেটের ভেতরে ‘নির্দেশনা কার্ড’ — কুরিয়ার এমন একজন সহকারী দিয়ে দিল যে ভবিষ্যতে আপনার ‘ঠিকানা’ মনে রেখে কাজ করবে (closure)।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "return কীভাবে মান caller এর হাতে পৌঁছায় (call stack)",
      caption: "`function b() { return 41; }`, `function a() { return b() + 1; }`, তারপর `const r = a();`।",
      nodes: [
        { id: "caller", label: "Caller", sub: "const r = a()" },
        { id: "stack", label: "Call stack" },
        { id: "value", label: "ফেরত-মান" },
      ],
      steps: [
        {
          active: ["caller", "stack"],
          items: { caller: ["const r = a()  (অপেক্ষায়)"], stack: ["a()"] },
          note: "`a()` call হলো — stack এ `a` এর frame বসল। Caller `r` এর মানের জন্য অপেক্ষা করছে।",
        },
        {
          active: ["stack"],
          items: { caller: ["const r = a()  (অপেক্ষায়)"], stack: ["b()", "a()  (b এর ফলের অপেক্ষায়)"] },
          note: "`a` এর ভেতরে `b()` call — stack এর মাথায় `b` এর frame। `a` থেমে আছে, কারণ `b() + 1` এর জন্য `b` এর মান লাগবে।",
        },
        {
          active: ["stack", "value"],
          items: { stack: ["a()  (b এর ফলের অপেক্ষায়)"], value: ["b → 41"] },
          note: "`b` এ `return 41` — `b` এর execution থামল, frame pop হলো এবং `41` ফেরত-মান হিসেবে `a` এর হাতে পৌঁছাল।",
        },
        {
          active: ["stack", "value"],
          items: { stack: ["a()  → 41 + 1 = 42"], value: ["a → 42"] },
          note: "`a` আবার চলল: `41 + 1 = 42`। এরপর `return 42` — `a` এর frame ও pop।",
        },
        {
          active: ["caller", "value"],
          items: { caller: ["r = 42"], stack: [], value: ["42"] },
          note: "Stack খালি। `a()` call expression টির মান এখন `42`, তাই `r = 42`। যদি `a` এ `return` না থাকত, `r` হতো `undefined`।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "ASI trap: `return` এর পরে newline",
      caption: "Parser এর চোখে নিচের কোড কীভাবে বদলে যায়।",
      nodes: [
        { id: "source", label: "আপনার কোড" },
        { id: "parser", label: "Parser (ASI)" },
        { id: "result", label: "ফল" },
      ],
      steps: [
        {
          active: ["source"],
          items: { source: ["return", "{ ok: true };"] },
          note: "আপনি `return` লিখে নতুন লাইনে object literal লিখেছেন — ভেবেছেন object ফেরত যাবে।",
        },
        {
          active: ["parser"],
          items: { parser: ["`return` + line break", "→ restricted production", "→ `;` বসানো হয়"] },
          note: "`return` এর পরে line terminator থাকলে ASI সেখানে `;` বসায় (spec এ `return` একটি ‘restricted production’ — এর পরে line break নিষিদ্ধ)। তাই এটি `return;` হিসেবে পড়া হয়।",
        },
        {
          active: ["parser", "result"],
          items: { parser: ["return;", "{ ok: true };  ← আলাদা block, কখনো চলে না"], result: ["f() === undefined"] },
          note: "নিচের `{ ok: true }` এখন আলাদা একটি block (`ok:` একটি label)। Function `undefined` ফেরত দেয়, কোনো error ছাড়াই।",
        },
        {
          active: ["source", "result"],
          items: { source: ["return {", "  ok: true", "};"], result: ["{ ok: true }"] },
          note: "সমাধান: `{` কে `return` এর **একই লাইনে** লিখুন। multi-line expression এ `return (` ব্যবহার করুন।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "try / finally এর ভেতরে return",
      caption: "`finally` এর কাজ ফেরত যাওয়ার আগেই হয়; `finally` এ `return` থাকলে সেটি জিতে যায়।",
      nodes: [
        { id: "try", label: "try", sub: "return 'try'" },
        { id: "finally", label: "finally", sub: "cleanup" },
        { id: "caller", label: "Caller" },
      ],
      steps: [
        {
          active: ["try"],
          items: { try: ["return 'try' মূল্যায়িত", "মান 'try' রাখা হলো"] },
          note: "`try` ব্লকে `return` এর মান evaluate হয় ও মনে রাখা হয়, কিন্তু function এখনই ফিরে যায় না।",
        },
        {
          active: ["finally"],
          items: { finally: ["console.log('cleanup')"] },
          output: "cleanup",
          note: "বেরোনোর আগে `finally` ব্লক অবশ্যই চলে — ফাইল বন্ধ, lock ছাড়া, loading `false` করার মতো cleanup এর জন্য।",
        },
        {
          active: ["caller"],
          items: { caller: ["পেল: 'try'"] },
          note: "`finally` তে `return` না থাকলে রাখা মান `'try'` caller এর কাছে যায়।",
        },
        {
          active: ["finally", "caller"],
          items: { finally: ["return 'finally'  ← try এর মান বাতিল"], caller: ["পেল: 'finally'"] },
          note: "কিন্তু `finally` এ নিজে `return 'finally'` থাকলে সেটিই ফেরত যায় — `try` এর return (এবং ছোঁড়া error ও) চাপা পড়ে। তাই `finally` এ `return` এড়ানো হয়।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "return বনাম console.log, implicit undefined, early exit",
      description: "একই কাজ দুই function এ: একটি শুধু `console.log` করে, অন্যটি `return` করে। ফেরত-মান ধরে পরের কোড কী করতে পারে তা দেখুন।",
      code: `function addLog(a, b) {
  console.log("log:", a + b);   // শুধু দেখায়
}

function add(a, b) {
  return a + b;                  // caller কে দেয়
}

const r1 = addLog(2, 3);
console.log("r1 =", r1);         // কিছু return হয়নি

const r2 = add(2, 3);
console.log("r2 * 10 =", r2 * 10);  // ফেরত-মান ব্যবহার করা গেল

function early() {
  return "first";
  console.log("এটি কখনো চলে না");
}
console.log(early());

function bare() {
  return;                        // মান ছাড়া return
}
console.log(bare());`,
    },
    {
      level: "intermediate",
      title: "একাধিক মান, function ফেরত দেওয়া, arrow এর implicit return",
      description: "Array/object destructuring দিয়ে একাধিক মান নেওয়া; closure এর পূর্বাভাস হিসেবে `makeMultiplier`; এবং arrow এ object ফেরত দিতে `({ ... })` কেন লাগে।",
      code: `// array: ছোট, ক্রমবদ্ধ জোড়া
function minMax(nums) {
  return [Math.min(...nums), Math.max(...nums)];
}
const [lo, hi] = minMax([3, 9, 1]);
console.log(lo, hi);

// object: নামযুক্ত, বাড়ানো সহজ
function stats(nums) {
  const sum = nums.reduce((a, n) => a + n, 0);
  return { sum, count: nums.length, avg: sum / nums.length };
}
const { avg, count } = stats([2, 4, 6]);
console.log(avg, count);

// function ফেরত দেওয়া
const makeMultiplier = (factor) => (n) => n * factor;
const double = makeMultiplier(2);
const triple = makeMultiplier(3);
console.log(double(5), triple(5));

// arrow: implicit return ও object literal
const toUser = (id) => ({ id, active: true });
const broken = (a, b) => { sum: a + b };   // block + label, কোনো return নেই
console.log(toUser(7));
console.log(broken(1, 2));`,
    },
    {
      level: "real-world",
      title: "Validation result ও query builder: guard clause + return this",
      description: "Production এর সাধারণ দুটি pattern: (১) form validator যা guard clause দিয়ে `{ valid, errors }` ফেরত দেয়, (২) chainable builder যেখানে setter গুলো `return this`, আর `build()` চূড়ান্ত মান দেয়।",
      code: `function validateSignup({ email, password } = {}) {
  const errors = [];
  if (typeof email !== "string" || !email.includes("@")) {
    errors.push("email is invalid");
  }
  if (typeof password !== "string" || password.length < 8) {
    errors.push("password must be at least 8 characters");
  }
  if (errors.length > 0) {
    return { valid: false, errors };     // guard: আগে বেরোও
  }
  return { valid: true, errors: [] };
}

console.log(validateSignup({ email: "rina@example.com", password: "s3cretpass" }));
console.log(validateSignup({ email: "nope", password: "123" }));

class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.conditions = [];
    this.max = null;
  }
  where(condition) {
    this.conditions.push(condition);
    return this;                         // chaining
  }
  limit(n) {
    this.max = n;
    return this;
  }
  build() {
    let sql = "SELECT * FROM " + this.table;
    if (this.conditions.length) sql += " WHERE " + this.conditions.join(" AND ");
    if (this.max !== null) sql += " LIMIT " + this.max;
    return sql;                          // চূড়ান্ত মান
  }
}

const sql = new QueryBuilder("users").where("age > 18").where("active = 1").limit(10).build();
console.log(sql);`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
function square(n) {
  return n * n;
}
console.log(square(7));
console.log(typeof (() => {})());
`,
    },
    {
      label: "ASI trap এবং arrow এর object",
      code: `function withASI() {
  return
  {
    ok: true
  };
}
function fixed() {
  return {
    ok: true
  };
}
console.log(withASI());
console.log(fixed());

const a = () => { ok: true };      // block
const b = () => ({ ok: true });    // object
console.log(a(), b());`,
    },
    {
      label: "Loop, forEach ও finally এর return",
      code: `function firstEven(nums) {
  for (const n of nums) {
    if (n % 2 === 0) return n;     // পুরো function থেকে বেরোয়
  }
  return null;
}
console.log(firstEven([1, 3, 6, 8]));
console.log(firstEven([1, 3]));

function viaForEach(nums) {
  let found = "none";
  nums.forEach((n) => {
    if (n % 2 === 0) return "even";  // শুধু এই callback থেকে বেরোয়
  });
  return found;
}
console.log(viaForEach([1, 6]));

function f1() {
  try { return "try"; } finally { console.log("cleanup"); }
}
function f2() {
  try { return "try"; } finally { return "finally"; }
}
console.log(f1());
console.log(f2());`,
    },
    {
      label: "Constructor এ return",
      code: `function A() {
  this.x = 1;
  return 5;               // primitive: উপেক্ষিত
}
function B() {
  this.x = 1;
  return { y: 2 };        // object: এটিই new এর ফল
}
const a = new A();
const b = new B();
console.log(a.x, b.x, b.y);

// return a, b কেবল শেষটি দেয়
function pair() {
  return 1, 2;
}
console.log(pair());`,
    },
  ],

  debugging: [
    {
      title: "return এর পরে newline (ASI)",
      bad: `function getUser() {
  return
  {
    name: "Rina"
  };
}
console.log(getUser());`,
      why: "`return` এর পরে line break থাকলে ASI একটি `;` বসায়, ফলে এটি `return;` হয়ে যায় এবং function `undefined` ফেরত দেয়। নিচের object টি unreachable block। কোনো error আসে না, তাই bug নীরব। `{` কে `return` এর একই লাইনে লিখুন।",
      fix: `function getUser() {
  return {
    name: "Rina",
  };
}
console.log(getUser());`,
    },
    {
      title: "return ভুলে যাওয়া",
      bad: `function double(n) {
  n * 2;
}
console.log(double(4));`,
      why: "`n * 2;` একটি expression statement — মান গণনা হয় কিন্তু কোথাও যায় না। `return` না থাকায় function `undefined` ফেরত দেয়। `console.log` ঠিক কাজ করছে (`undefined` দেখাচ্ছে), কিন্তু ভুল জিনিস। ESLint এর `no-unused-expressions` এবং `consistent-return` এই ধরনের ভুল ধরে।",
      fix: `function double(n) {
  return n * 2;
}
console.log(double(4));`,
    },
    {
      title: "Arrow এ object ফেরত — {} block হয়ে যাচ্ছে",
      bad: `const makeSum = (a, b) => { sum: a + b };
console.log(makeSum(1, 2));`,
      why: "Arrow এর `=>` এর পরে `{` কে function body block ধরা হয়, object literal নয়। ভেতরের `sum: a + b` হয় label `sum` সহ একটি expression, এবং `return` না থাকায় `undefined` ফেরত আসে। Object ফেরত দিতে পুরো literal টি বন্ধনীতে মুড়ুন, অথবা block body তে স্পষ্ট `return` লিখুন।",
      fix: `const makeSum = (a, b) => ({ sum: a + b });
console.log(makeSum(1, 2));`,
    },
    {
      title: "forEach এর ভেতরে return দিয়ে outer function থেকে বেরোনোর চেষ্টা",
      bad: `function hasNegative(nums) {
  nums.forEach((n) => {
    if (n < 0) return true;
  });
  return false;
}
console.log(hasNegative([1, -2, 3]));`,
      why: "`return true` শুধু `forEach` এর callback টি থেকে বেরোয়, `hasNegative` থেকে নয়; `forEach` callback এর ফেরত-মান উপেক্ষা করে। তাই function সবসময় `false` ফেরত দেয়। বাইরের function থেকে বেরোতে হলে `for...of` ব্যবহার করুন, অথবা `some`/`find` এর মতো ফলাফল-ফেরত-দেওয়া method।",
      fix: `function hasNegative(nums) {
  return nums.some((n) => n < 0);
}
console.log(hasNegative([1, -2, 3]));
console.log(hasNegative([1, 2]));`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "console.log নয়, return",
      prompt: "`square` function টি এখন শুধু `console.log` করে। এটিকে `return` ব্যবহার করতে বদলান, যাতে নিচের `console.log(square(4))` এক লাইনে `16` print করে (`undefined` নয়)।",
      starter: `function square(n) {
  console.log(n * n);
}

console.log(square(4));`,
      expected: "16",
      hints: ["`square` এর ভেতরের `console.log` বাদ দিয়ে মানটি `return` করুন।", "`return n * n;`"],
      solution: `function square(n) {
  return n * n;
}

console.log(square(4));`,
    },
    {
      level: "beginner",
      title: "Guard clause: safeDivide",
      prompt: "`safeDivide(a, b)` এ `b` শূন্য হলে শুরুতেই `null` ফেরত দিন (early return); নইলে `a / b`। `safeDivide(10, 2)` → `5`, `safeDivide(1, 0)` → `null`।",
      starter: `function safeDivide(a, b) {
  // TODO: b শূন্য হলে null return করুন
  return a / b;
}

console.log(safeDivide(10, 2));
console.log(safeDivide(1, 0));`,
      expected: "5\nnull",
      hints: ["`if (b === 0) return null;` শুরুতে লিখুন।", "এরপর স্বাভাবিক `return a / b;`।"],
      solution: `function safeDivide(a, b) {
  if (b === 0) return null;
  return a / b;
}

console.log(safeDivide(10, 2));
console.log(safeDivide(1, 0));`,
    },
    {
      level: "beginner",
      title: "দুটি মান object এ ফেরত",
      prompt: "`minMax(nums)` যেন `{ min, max }` object ফেরত দেয়; caller destructuring দিয়ে দুটি মান পায়। `minMax([3, 9, 1])` এ `1 9` print হবে।",
      starter: `function minMax(nums) {
  // TODO: { min, max } object return করুন
  return Math.min(...nums);
}

const { min, max } = minMax([3, 9, 1]);
console.log(min, max);`,
      expected: "1 9",
      hints: ["`Math.min(...nums)` ও `Math.max(...nums)` দুটিই লাগবে।", "`return { min: ..., max: ... };`"],
      solution: `function minMax(nums) {
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

const { min, max } = minMax([3, 9, 1]);
console.log(min, max);`,
    },
    {
      level: "intermediate",
      title: "Arrow থেকে object ফেরত",
      prompt: "`users.map(...)` এর arrow টি এখন `undefined` ফেরত দিচ্ছে। এটি ঠিক করুন যেন প্রতিটি user এর জন্য `{ id, label }` object (label = নাম বড় হাতের অক্ষরে) পাওয়া যায়।",
      starter: `const users = [
  { id: 1, name: "Rina" },
  { id: 2, name: "Mim" },
];

const dtos = users.map((u) => { id: u.id });
console.log(dtos);`,
      expected: "[ { id: 1, label: 'RINA' }, { id: 2, label: 'MIM' } ]",
      hints: ["`=>` এর পরের `{` block হিসেবে পার্স হচ্ছে।", "`(u) => ({ id: u.id, label: u.name.toUpperCase() })`।"],
      solution: `const users = [
  { id: 1, name: "Rina" },
  { id: 2, name: "Mim" },
];

const dtos = users.map((u) => ({ id: u.id, label: u.name.toUpperCase() }));
console.log(dtos);`,
      explanation: "Implicit return এ object literal পাঠাতে বন্ধনী লাগে, নইলে `{}` block হিসেবে ধরা হয়।",
    },
    {
      level: "intermediate",
      title: "Function ফেরত দেওয়া: makeAdder",
      prompt: "`makeAdder(n)` এমন একটি function ফেরত দিক যা নিজের argument এর সাথে `n` যোগ করে। `makeAdder(5)(3)` → `8` এবং `makeAdder(10)(1)` → `11`।",
      starter: `function makeAdder(n) {
  // TODO: একটি function return করুন
  return n;
}

const add5 = makeAdder(5);
console.log(add5(3));
console.log(makeAdder(10)(1));`,
      expected: "8\n11",
      hints: ["ভেতরে একটি নতুন function লিখে সেটিকেই `return` করুন।", "`return (x) => x + n;`"],
      solution: `function makeAdder(n) {
  return (x) => x + n;
}

const add5 = makeAdder(5);
console.log(add5(3));
console.log(makeAdder(10)(1));`,
      explanation: "ভেতরের function `n` মনে রাখে (closure) — বাইরের `makeAdder` শেষ হয়ে গেলেও।",
    },
    {
      level: "challenge",
      title: "Chainable Cart (return this)",
      prompt: "`Cart` class এ `add(name, price)` ও `discount(percent)` method যোগ করুন যেন chain করা যায় (`return this`), আর `total()` চূড়ান্ত সংখ্যা ফেরত দেয় (সব price এর যোগফল × (100 − percent) / 100)। `discount` একাধিকবার ডাকলে শেষেরটি কার্যকর। `add` যে `cart` কেই ফেরত দেয় তাও print করুন।",
      starter: `class Cart {
  constructor() {
    this.items = [];
    this.percent = 0;
  }
  add(name, price) {
    this.items.push({ name, price });
  }
  // TODO: discount(percent), total()
}

const cart = new Cart();
console.log(cart.add("pen", 100).add("book", 300).discount(10).total());
console.log(cart.add("x", 0) === cart);`,
      expected: "360\ntrue",
      hints: [
        "`add` এর শেষে `return this;`।",
        "`discount(percent)` এ `this.percent = percent; return this;`।",
        "`total()` এ `this.items.reduce(...)` দিয়ে যোগ করে `(100 - this.percent) / 100` দিয়ে গুণ করে `return` করুন (এটি chain শেষ করে, তাই `this` নয়)।",
      ],
      solution: `class Cart {
  constructor() {
    this.items = [];
    this.percent = 0;
  }
  add(name, price) {
    this.items.push({ name, price });
    return this;
  }
  discount(percent) {
    this.percent = percent;
    return this;
  }
  total() {
    const sum = this.items.reduce((acc, item) => acc + item.price, 0);
    return (sum * (100 - this.percent)) / 100;
  }
}

const cart = new Cart();
console.log(cart.add("pen", 100).add("book", 300).discount(10).total());
console.log(cart.add("x", 0) === cart);`,
      explanation: "Setter ধরনের method (`add`, `discount`) `return this` দিয়ে chain চালু রাখে; যে method উত্তর দেয় (`total`) সে নিজের মান ফেরত দিয়ে chain শেষ করে।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`function f() { 5; }` — `console.log(f())` এ কী print হবে?",
        options: ["`5`", "`undefined`", "`null`", "`SyntaxError`"],
        answer: 1,
        explanation: "`5;` একটি expression statement; `return` নেই, তাই function `undefined` ফেরত দেয়। `5` আসত শুধু `return 5;` হলে। `null` JavaScript নিজে কখনো ডিফল্টে দেয় না; syntax সম্পূর্ণ বৈধ, তাই SyntaxError নয়।",
      },
      {
        question: "নিচের function কী ফেরত দেয়?\n`function f() {`\n`  return`\n`  42;`\n`}`",
        options: ["`42`", "`null`", "`SyntaxError`", "`undefined`"],
        answer: 3,
        explanation: "`return` এর পরে line break হওয়ায় ASI একটি `;` বসায় — এটি `return;` হয়, তাই `undefined`। `42` unreachable। Syntax বৈধ থাকে, তাই error আসে না; `null` এর কোনো ভিত্তি নেই।",
      },
      {
        question: "`const f = () => { a: 1 };` — `f()` কী ফেরত দেয়?",
        options: [
          "`undefined` — `{ a: 1 }` block, `a:` একটি label",
          "`{ a: 1 }`",
          "`1`",
          "`SyntaxError`",
        ],
        answer: 0,
        explanation: "Arrow এর `=>` এর পর `{` কে block ধরা হয়। `a: 1` হয় label সহ expression এবং `return` নেই, তাই `undefined`। object চাইলে `() => ({ a: 1 })`। অন্য ফলগুলো ভুল কারণ কিছুই object বা `1` ফেরত দেয় না, আর syntax বৈধ।",
      },
      {
        question: "`forEach` এর callback এর ভেতরে `return` দিলে কী ঘটে?",
        options: [
          "পুরো `forEach` loop থেমে যায়",
          "Outer function টি সেই মান নিয়ে ফিরে যায়",
          "শুধু সেই callback এর বর্তমান call শেষ হয়, loop চলতে থাকে",
          "`SyntaxError` হয়",
        ],
        answer: 2,
        explanation: "Callback আলাদা function, তাই `return` তার নিজের call থেকেই বেরোয় (অনেকটা `continue`)। `forEach` কে থামানো বা outer function থেকে বের হওয়া যায় না — সেজন্য `for...of`, `some`, `find`। বাকি দুটি বিকল্প `return` এর পরিসর ভুল ধরেছে; syntax বৈধ।",
      },
      {
        question: "`function f() { try { return 1; } finally { return 2; } }` — `f()` কী দেয়?",
        options: ["`1`", "`2`", "`SyntaxError`", "`undefined`"],
        answer: 1,
        explanation: "`finally` সবসময় চলে, এবং তার ভেতরের `return 2` আগে-থেকে-রাখা `try` এর `return 1` কে বাতিল করে দেয়। তাই `2`। `1` হতো যদি `finally` তে `return` না থাকত। এটি বৈধ syntax, আর `undefined` আসার কারণ নেই।",
      },
    ],
    coding: [
      {
        title: "divide: ফলাফল object",
        prompt: "`divide(a, b)` এ `b === 0` হলে `{ ok: false, error: 'division by zero' }` (early return), নইলে `{ ok: true, value: a / b }` ফেরত দিন।",
        starter: `function divide(a, b) {
  // TODO
}

console.log(divide(10, 2));
console.log(divide(1, 0));`,
        expected: "{ ok: true, value: 5 }\n{ ok: false, error: 'division by zero' }",
        solution: `function divide(a, b) {
  if (b === 0) return { ok: false, error: "division by zero" };
  return { ok: true, value: a / b };
}

console.log(divide(10, 2));
console.log(divide(1, 0));`,
      },
      {
        title: "findFirstIndex: loop এর ভেতরে return",
        prompt: "`findFirstIndex(arr, predicate)` লিখুন: `for` loop দিয়ে প্রথম যে element এ `predicate` সত্য, তার index ফেরত দিন (মিল না পেলে `-1`)। Built-in `findIndex` ব্যবহার করবেন না।",
        starter: `function findFirstIndex(arr, predicate) {
  // TODO
}

console.log(findFirstIndex([5, 8, 12], (n) => n > 6));
console.log(findFirstIndex([1, 2], (n) => n > 6));`,
        expected: "1\n-1",
        solution: `function findFirstIndex(arr, predicate) {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return i;
  }
  return -1;
}

console.log(findFirstIndex([5, 8, 12], (n) => n > 6));
console.log(findFirstIndex([1, 2], (n) => n > 6));`,
      },
    ],
  },

  interview: [
    {
      q: "`return` ও `console.log` এর পার্থক্য কী?",
      a: "`return` function কে থামায় এবং একটি মান caller কে দেয়, যাতে পরের কোড সেটি ব্যবহার করতে পারে (variable এ রাখা, গণনা, condition)। `console.log` শুধু output দেখায় — এটি একটি side effect — এবং নিজে `undefined` ফেরত দেয়।\n\nতাই `const total = calc()` এ `calc` শুধু `console.log` করলে `total` হবে `undefined`, যদিও console এ সঠিক সংখ্যা দেখা যায়। Production কোডে গণনা `return` দিয়ে করা হয় (পরীক্ষাযোগ্য, পুনর্ব্যবহারযোগ্য); `console.log` কেবল debugging/logging এর জন্য।",
    },
    {
      q: "JavaScript এ `return` এর পরে newline দিলে কী সমস্যা হয়?",
      a: "ASI (Automatic Semicolon Insertion) এর কারণে `return` এর পর line break থাকলে সেখানে `;` বসে যায় — spec এ `return` একটি ‘restricted production’, অর্থাৎ তার পরে line terminator থাকলে ASI চালু হয়। তাই `return\\n{ ok: true }` পার্স হয় `return;` + একটি আলাদা block হিসেবে, এবং function `undefined` ফেরত দেয় — কোনো error ছাড়া।\n\nসমাধান: object literal এর `{` অথবা multi-line expression এর `(` `return` এর **একই লাইনে** লিখুন। React এর `return (` দিয়ে JSX শুরু করা এই কারণেই। Linter (`no-unreachable`) সাধারণত এটি ধরে।",
    },
    {
      q: "Arrow function এ implicit return কীভাবে কাজ করে, এবং object ফেরত দিতে কেন বন্ধনী লাগে?",
      a: "Arrow এর body `{}` ছাড়া একটি expression হলে সেই expression এর মান স্বয়ংক্রিয়ভাবে ফেরত যায় (`x => x * 2`)। `{}` দিলে সেটি সাধারণ function body হয়ে যায় এবং স্পষ্ট `return` লাগে।\n\nসমস্যা হলো `=>` এর পরে `{` কে parser block এর শুরু ধরে, object literal নয়। তাই `() => { a: 1 }` এ `a:` একটি label এবং function `undefined` ফেরত দেয়। Object চাইলে পুরো literal টি বন্ধনীতে মুড়ুন: `() => ({ a: 1 })` — বন্ধনীর ভেতরে এটি expression হিসেবে পার্স হয়। `map` এ object বানানোর সময় এই ভুল খুব সাধারণ।",
    },
    {
      q: "একটি function থেকে একাধিক মান কীভাবে ফেরত দেবেন, array নাকি object?",
      a: "JavaScript এ একটি function একটিই মান ফেরত দিতে পারে, তাই একাধিক মান array বা object এ মুড়ে দিতে হয়, এবং caller destructuring দিয়ে খোলে। `return a, b` কাজ করে না — comma operator শুধু শেষ মান দেয়।\n\n**Array**: মান সংখ্যা কম (২–৩), ক্রম স্বাভাবিক, আর caller কে নিজের পছন্দের নাম দিতে দিতে চাইলে (`const [count, setCount] = useState(0)` — একই hook বহুবার ব্যবহৃত হয়)। **Object**: মান বেশি বা নাম অর্থবহ, ক্রম মনে রাখতে না চাইলে, ভবিষ্যতে field যোগ হতে পারে এমন API তে (`const { data, error } = useFetch()`)। নতুন field যোগ করলে object এ পুরোনো caller ভাঙে না, array তে ক্রম পাল্টালে ভাঙে।",
    },
    {
      q: "`try/finally` তে `return` কীভাবে কাজ করে? `finally` এ `return` দিলে কী হয়?",
      a: "`try` এ `return expr` থাকলে `expr` evaluate হয় এবং মান জমা রাখা হয়, তারপর `finally` ব্লক চলে (cleanup এর জন্য), এবং শেষে জমা-রাখা মান caller কে যায়। অর্থাৎ `finally` এর কাজ সবসময় হয়, এমনকি `return` বা `throw` এর পরেও।\n\nকিন্তু `finally` এর ভেতরে নিজে `return` থাকলে সেটি আগের return মান এবং ছোঁড়া exception দুটোকেই **বাতিল** করে দেয় — একটি error নীরবে গিলে ফেলা যায়, তাই এটি bad practice এবং linter (`no-unsafe-finally`) সতর্ক করে। `finally` কে শুধু cleanup এর জন্য রাখুন।",
    },
    {
      q: "Function এ ‘return value’ বনাম ‘side effect’ — এই পার্থক্য কেন গুরুত্বপূর্ণ?",
      a: "Return value হলো function এর ‘ফলাফল’ (ইনপুট থেকে নতুন মান বানিয়ে দেওয়া); side effect হলো বাইরের অবস্থা বদলানো — console, DOM, network, global variable বা argument mutate। যে function শুধু return value দেয় এবং বাইরের কিছু বদলায় না, সেটি predictable, test করা সহজ (ইনপুট দিয়ে আউটপুট মিলিয়ে দেখা) এবং React এর rendering মডেলের সাথে মানানসই।\n\nতাই সাধারণ নিয়ম: গণনা `return` দিয়ে করুন, আর side effect (API call, logging, state set) আলাদা ও সীমানায় রাখুন (React এ `useEffect` / event handler)। Pure Functions lesson এ এটি আরও গভীরভাবে আসবে।",
    },
    {
      q: "Constructor এ `return` দিলে `new` এর ফল কী হয়?",
      a: "`new F()` সাধারণত নতুন তৈরি `this` object ফেরত দেয়। কিন্তু constructor যদি স্পষ্টভাবে একটি **object** `return` করে, তাহলে `new` সেই object ই দেয় — `this` এ যা বসানো হয়েছিল তা বাদ পড়ে। যদি primitive (`return 5`) ফেরত দেয় তাহলে তা উপেক্ষিত হয় এবং `this` ই ফেরত আসে।\n\nএই আচরণ কদাচিৎ কাজে লাগে (যেমন singleton বা caching pattern), আর বিভ্রান্তিকর বলে সাধারণত এড়ানো হয়। (Derived class এর constructor এ আরও কিছু বিধিনিষেধ আছে, যেমন `super()` এর আগে `this` নিষিদ্ধ — এটি Classes মডিউলে আসবে।)",
    },
  ],

  summary: {
    takeaways: [
      "`return` function কে সাথে সাথে থামায় এবং call expression এর মান ঠিক করে; `return` না থাকলে বা `return;` এ মান `undefined`।",
      "`console.log` শুধু দেখায় ও `undefined` দেয়; পরের কোডের জন্য মান `return` করতে হয়।",
      "Guard clause / early return মূল কোডকে সমতল রাখে; `return` এর পরে newline দিলে ASI এ `undefined` ফেরত যায়।",
      "একাধিক মান array/object এ মুড়ে return করুন; `return a, b` শুধু `b` দেয়। Function ও return করা যায় (closure)।",
      "Arrow: `{}` ছাড়া implicit return; object ফেরত দিতে `({ ... })`; `{}` থাকলে স্পষ্ট `return`।",
      "`forEach` এ `return` শুধু callback থেকে বেরোয়; `finally` এ `return` আগের return/throw বাতিল করে; constructor এ object return `new` এর ফল বদলায়।",
    ],
    syntax: `function f(x) {
  if (!x) return null;          // guard clause
  return { value: x };          // { একই লাইনে
}

const g = (x) => x * 2;         // implicit return
const h = (id) => ({ id });     // object literal
const [a, b] = [1, 2];          // array destructuring
const { value } = f(3);         // object destructuring

class Q { set(v) { this.v = v; return this; } }   // chaining`,
    whenToUse: [
      "ইনপুট থেকে নতুন মান বানালে `return`; শুধু debugging এর জন্য `console.log`।",
      "অবৈধ/ব্যতিক্রমী অবস্থা শুরুতেই সামলাতে guard clause।",
      "একাধিক সম্পর্কিত মান পাঠাতে object (নামযুক্ত) বা ছোট array।",
      "Fluent API/builder এ setter গুলোতে `return this`।",
    ],
    next: [
      "Callback Functions ও Higher-order Functions — function কে মান হিসেবে পাঠানো ও ফেরত দেওয়া",
      "Pure Functions — return value বনাম side effect",
      "Closures — ফেরত-দেওয়া function কীভাবে বাইরের মান মনে রাখে",
    ],
  },

  compatibility:
    "`return`, early return ও ASI আচরণ সব JavaScript environment এ (browser ও Node.js) একই। Arrow function ও destructuring ES2015 এর অংশ — সব আধুনিক browser ও Node.js এ কাজ করে। এই lesson এর সব কোড browser ও Node.js এ একই ফল দেয়। `async` function এর return (Promise) আলাদা মডিউলে আসবে।",
};
