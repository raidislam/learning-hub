import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Primitive ও reference (object) type এর মূল পার্থক্য — copy-by-value বনাম copy-by-reference — নিজের ভাষায় ব্যাখ্যা করতে পারবেন।",
    "Stack/heap mental model টি কাজে লাগিয়ে কোডের memory চিত্র আঁকতে পারবেন, এবং এটি যে একটি **সরলীকৃত মডেল** তা জানবেন।",
    "JavaScript এ function argument সবসময় pass-by-value — আর object এর ক্ষেত্রে সেই value টি হলো reference — এই কারণে mutation আর reassignment এর ফল কেন আলাদা, তা বুঝবেন।",
    "`===` object এর ক্ষেত্রে identity তুলনা করে, content নয় — এই তথ্য ব্যবহার করে সাধারণ bug এড়াতে পারবেন।",
    "Spread (`{...obj}`) ও `structuredClone` দিয়ে shallow ও deep copy এর পার্থক্য বুঝে সঠিকটি বেছে নিতে পারবেন।",
    "`const` এর সাথে mutation এবং string এর immutability কীভাবে এই মডেলের সাথে মেলে তা ব্যাখ্যা করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "দুই ধরনের মান: primitive ও reference" },
    {
      type: "p",
      text: "JavaScript এর সব মান (value) দুই ভাগে পড়ে। **Primitive**: `number`, `string`, `boolean`, `undefined`, `null`, `symbol`, `bigint` — এই সাতটি। **Object (reference type)**: বাকি সবকিছু — plain object, array, function, `Date`, `Map`, `Set`, `RegExp`, ইত্যাদি। এই বিভাজনটি শুধু তাত্ত্বিক নয়; কোডে `=` চিহ্ন দিয়ে একটি variable থেকে আরেকটিতে মান দিলে কী ঘটে, function এ argument দিলে কী ঘটে, `===` দিয়ে তুলনা করলে কী ঘটে — সবই এই বিভাজনের ওপর নির্ভর করে।",
    },
    {
      type: "p",
      text: "মূল নিয়মটি এক লাইনে: **primitive এ variable নিজেই মান ধরে রাখে; object এ variable ধরে রাখে সেই object এর একটি reference (ঠিকানা-সদৃশ সূত্র), object টি থাকে অন্য কোথাও।** এই এক নিয়ম থেকেই বাকি সব আচরণ বেরিয়ে আসে।",
    },
    { type: "h3", text: "Stack ও heap — একটি সরলীকৃত mental model" },
    {
      type: "p",
      text: "আলোচনা সহজ করতে সাধারণত বলা হয়: primitive মান থাকে **stack** এ (দ্রুত, ছোট, সুশৃঙ্খল জায়গা), আর object থাকে **heap** এ (বড়, নমনীয় জায়গা) — stack এ থাকে শুধু heap এর object এর reference। এটি শেখার জন্য খুবই কার্যকর একটি ছবি।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "এটি একটি simplified model — engine এর বাস্তবতা আরও জটিল",
      text: "ECMAScript specification এ ‘stack’ বা ‘heap’ শব্দ দুটিই নেই; spec শুধু value ও তাদের আচরণ বর্ণনা করে। বাস্তবে V8 বা অন্য engine optimization করে কোন মান কোথায় রাখবে তা নিজেই ঠিক করে — যেমন ছোট integer সরাসরি inline থাকতে পারে, আবার একটি function এর বাইরে বের হয়ে যাওয়া (closure এ ধরা) primitive ও heap এ থাকতে পারে, এবং string এর ভেতরের representation আরও ভিন্ন হতে পারে। তাই এই lesson এ stack/heap কে **আচরণ বোঝার মডেল** হিসেবে ব্যবহার করা হচ্ছে, কোনো engine এর হুবহু বর্ণনা হিসেবে নয়। আচরণ (কোড কী print করে) নিয়ে কিন্তু কোনো দ্বিমত নেই।",
    },
    { type: "h3", text: "এক নজরে পার্থক্য" },
    {
      type: "compare",
      headers: ["বিষয়", "Primitive", "Object (reference)"],
      rows: [
        ["variable এ কী থাকে", "মান নিজেই", "object এর reference"],
        ["`b = a` করলে", "মান copy হয় — দুটি স্বাধীন মান", "reference copy হয় — দুই নাম একই object এ"],
        ["Mutable?", "না — primitive মান বদলানো যায় না, শুধু নতুন মান দেওয়া যায়", "হ্যাঁ — property/element বদলানো যায়"],
        ["`===` কী তুলনা করে", "মান", "identity (একই object কি না)"],
        ["Function এ পাঠালে", "মানের copy", "reference এর copy"],
        ["উদাহরণ", "`42`, `'hi'`, `true`, `null`", "`{}`, `[]`, `function(){}`, `new Date()`"],
      ],
    },
    { type: "h3", text: "Copy by value বনাম copy by reference" },
    {
      type: "p",
      text: "`let b = a;` যখন `a` একটি number, তখন `b` তে `a` এর মানের একটি স্বাধীন copy বসে। পরে `b` বদলালে `a` অক্ষত থাকে। কিন্তু `a` যখন একটি array, তখন `b` তে বসে **একই array এর reference**। দুটি নাম এখন একই object এর দিকে তাকিয়ে আছে — `b.push(4)` করলে `a` এর মধ্য দিয়েও পরিবর্তনটি দেখা যায়, কারণ object তো একটিই।",
    },
    {
      type: "code",
      caption: "Playground এ চালানো যায় এমন ছোট উদাহরণ (পুরো ব্যাখ্যা নিচের visual এ)",
      code: `let a = 10;
let b = a;       // মান copy
b = 20;
console.log(a, b);   // 10 20

const x = [1, 2];
const y = x;     // reference copy
y.push(3);
console.log(x);      // [ 1, 2, 3 ]`,
    },
    { type: "h3", text: "Function এ পাঠালে: JavaScript সবসময় pass-by-value" },
    {
      type: "p",
      text: "অনেকে ভাবেন ‘primitive pass-by-value, object pass-by-reference’। এটি **ভুল** বা অন্তত বিভ্রান্তিকর। সঠিক কথা: JavaScript এ argument **সবসময় pass-by-value**। object এর ক্ষেত্রে সেই ‘value’ টি হলো reference। অর্থাৎ function এর parameter একটি **নতুন variable**, যার ভেতরে caller এর reference এর একটি **copy** বসে।",
    },
    {
      type: "ul",
      items: [
        "**Mutation** (`param.x = 1`, `param.push(…)`): parameter ও caller এর variable একই object এ তাকিয়ে আছে, তাই caller পরিবর্তন দেখতে পায়।",
        "**Reassignment** (`param = { … }`): শুধু function এর ভেতরের parameter নামটি নতুন object এ ঘুরে যায়। caller এর variable এখনো পুরোনো object এ — তাই caller কিছুই টের পায় না।",
        "যদি সত্যিই pass-by-reference হতো (যেমন C++ এর `&`), তবে reassignment ও caller এর variable বদলে দিত। JavaScript এ এমন কিছু নেই।",
      ],
    },
    { type: "h3", text: "Comparison: `===` object এ identity দেখে" },
    {
      type: "p",
      text: "`{ a: 1 } === { a: 1 }` হলো `false`। কারণ প্রতিটি object literal মূল্যায়নের সময় **নতুন একটি object** তৈরি হয়, আর `===` দুটি reference তুলনা করে — ‘এরা কি একই object?’ — ভেতরের content নয়। অন্যদিকে `'ab' === 'ab'` হলো `true`, কারণ primitive এর ক্ষেত্রে মান তুলনা হয়। Content তুলনা করতে হলে নিজে field ধরে ধরে তুলনা করতে হবে (বা নির্ভরযোগ্য কোনো `deepEqual` utility ব্যবহার করতে হবে)।",
    },
    { type: "h3", text: "`const` ও mutation — var/let/const lesson এর সূত্র" },
    {
      type: "p",
      text: "আগের lesson এ দেখেছিলেন `const` binding আটকায়, object এর ভেতরের কনটেন্ট নয়। এখন কারণটি পরিষ্কার: `const user = {…}` এ `user` এর ভেতরে বসে আছে একটি **reference**, আর `const` বলছে ‘এই reference আর বদলাবে না’। কিন্তু reference এর গন্তব্য object টি mutable। তাই `user.name = 'x'` বৈধ, আর `user = {}` অবৈধ।",
    },
    { type: "h3", text: "Shallow copy এর প্রাথমিক ধারণা" },
    {
      type: "p",
      text: "Reference copy এড়িয়ে সত্যিকারের নতুন object চাইলে copy করতে হয়। `{ ...obj }` বা `[...arr]` (spread), `Object.assign({}, obj)`, `arr.slice()` — এগুলো **shallow copy**: উপরের স্তরের property গুলো নতুন object এ আসে, কিন্তু সেই property গুলোর মান যদি নিজেই object হয়, তবে সেই nested object এর **reference টিই** copy হয়, nested object নয়। ফলে `copy.address.city = 'x'` করলে `original.address.city` ও বদলে যায়। সম্পূর্ণ স্বাধীন (deep) copy এর জন্য আধুনিক ও সহজ উপায় হলো `structuredClone(obj)`।",
    },
    {
      type: "callout",
      tone: "info",
      title: "structuredClone এর সীমাবদ্ধতা",
      text: "`structuredClone` প্রায় সব সাধারণ data (object, array, `Date`, `Map`, `Set`, cycle সহ) copy করতে পারে, কিন্তু **function copy করতে পারে না** (`DataCloneError` ছোড়ে), এবং class instance এর prototype/methods হারিয়ে plain object এ পরিণত হয়। তাই ‘data’ copy করার জন্য এটি আদর্শ, ‘behaviour সহ object’ এর জন্য নয়।",
    },
    { type: "h3", text: "String কেন immutable?" },
    {
      type: "p",
      text: "String একটি primitive, তাই তা **immutable** — একবার তৈরি হলে তার ভেতরের অক্ষর বদলানো যায় না। `s.toUpperCase()` মূল string বদলায় না, **নতুন একটি string ফেরত দেয়**। `s[0] = 'X'` লিখলে strict mode এ `TypeError`, sloppy mode এ নীরবে কিছুই হয় না। একই কারণে primitive গুলোর ‘reference sharing’ সমস্যা নেই — কেউ মান বদলাতে পারে না, শুধু নিজের variable কে নতুন মানে বাঁধতে পারে।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "ভুল ধারণা ও নিরাপত্তার সতর্কতা",
      text: "**ভুল ধারণা ১:** ‘object pass-by-reference’ — না, সবই pass-by-value; object এর value হলো reference। **ভুল ধারণা ২:** ‘`const` মানে immutable’ — না, শুধু binding। **ভুল ধারণা ৩:** ‘spread দিয়ে copy করলে সব স্বাধীন’ — না, শুধু উপরের স্তর। **ভুল ধারণা ৪:** ‘`{...a} === a` ’ মনে হয় একই — না, নতুন object। **নিরাপত্তা:** নিজে হাতে deep merge/clone function লিখলে এবং তাতে অবিশ্বস্ত (untrusted) JSON এর key বিনা পরীক্ষায় বসালে `__proto__` key এর মাধ্যমে **prototype pollution** হতে পারে — যেখানে সব object এর prototype এ আক্রমণকারীর property ঢুকে যায়। তাই নিজে বানানোর চেয়ে `structuredClone` বা সুপরীক্ষিত library ব্যবহার করুন, এবং user input থেকে আসা key সরাসরি target object এ merge করবেন না।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Browser বনাম Node.js",
      text: "Primitive/reference এর আচরণ language এর অংশ — browser ও Node.js এ একই। `structuredClone` দুই জায়গাতেই আছে (আধুনিক browser ও Node.js 17+)। তবে যেসব মান এটি clone করতে পারে (যেমন DOM node, browser এর কিছু host object) তা environment ভেদে আলাদা — এই lesson এর সব কোড pure JS, তাই কোনো পার্থক্য নেই।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ভাবুন আপনার কাছে দুই ধরনের জিনিস আছে: **নোটবুকের পাতায় লেখা একটি সংখ্যা**, আর **একটি গুগল ডক এর লিংক**।",
    },
    {
      type: "ul",
      items: [
        "**Primitive = পাতায় লেখা সংখ্যা।** বন্ধুকে সংখ্যাটি দিতে চাইলে আপনি নিজের পাতা থেকে **টুকে** তার পাতায় লিখে দেন। এখন দুজনের কাছে দুটি আলাদা লেখা। সে তার সংখ্যা কেটে অন্য কিছু লিখলে আপনার পাতা বদলায় না। এটিই **copy by value**।",
        "**Object = গুগল ডক।** ডকটির ভেতরে আসল লেখা, আর আপনার কাছে আছে শুধু **লিংক**। বন্ধুকে ডক দিতে আপনি লিংকটি **কপি করে পাঠান**। এখন দুজনের কাছে দুটি লিংক, কিন্তু ডক একটিই। সে ডক এডিট করলে আপনিও পরিবর্তন দেখেন — এটি **mutation**। এটিই **copy by reference**।",
        "**Function এ পাঠানো** = বন্ধুকে লিংকের একটি কপি দেওয়া। সে ডকের ভেতরে লিখলে (mutation) আপনি দেখবেন। কিন্তু সে যদি তার কাছের লিংকটি ফেলে দিয়ে **অন্য একটি নতুন ডকের লিংক** নোট করে (reassignment), আপনার লিংক আগের ডকেই থেকে যায় — আপনার কিছুই বদলায় না।",
        "**`===` তুলনা** = দুটি লিংক কি একই ডকে যায়? দুটি আলাদা ডকে হুবহু একই লেখা থাকলেও লিংক দুটি সমান নয়।",
        "**Shallow copy** = ডকটি ‘Make a copy’ করা, কিন্তু ডকের ভেতরে যদি অন্য ডকের লিংক থাকে, সেই লিংক গুলো একই থাকে। **Deep copy** = ভেতরের সব ডকও নতুন করে কপি করা।",
      ],
    },
    {
      type: "p",
      text: "এই analogy তে সীমাবদ্ধতাও আছে: বাস্তবে গুগল ডক এর লিংক ‘ঠিকানা’ হিসেবে ব্যবহারযোগ্য, JavaScript এর reference কে আপনি পড়তে বা অঙ্ক করতে পারেন না (C এর pointer এর মতো নয়) — আপনি শুধু তার মাধ্যমে object এ পৌঁছাতে পারেন।",
    },
  ],

  visuals: [
    {
      kind: "memory-steps",
      title: "Copy by value বনাম copy by reference",
      code: "let a = 10;\nlet b = a;\nb = 20;\nconst p = { n: 1 };\nconst q = p;\nq.n = 2;",
      steps: [
        {
          line: 0,
          memory: [{ name: "a", value: "10", kind: "let", state: "live" }],
          note: "`a` তে primitive `10` বসল। মডেলে ধরা হচ্ছে মানটি variable এর নিজের জায়গাতেই আছে।",
        },
        {
          line: 1,
          memory: [
            { name: "a", value: "10", kind: "let", state: "live" },
            { name: "b", value: "10", kind: "let", state: "live" },
          ],
          note: "`b = a` — `a` এর **মান copy** হয়ে `b` তে বসল। দুটি সম্পূর্ণ স্বাধীন `10`।",
        },
        {
          line: 2,
          memory: [
            { name: "a", value: "10", kind: "let", state: "live" },
            { name: "b", value: "20", kind: "let", state: "live" },
          ],
          note: "`b = 20` — শুধু `b` বদলাল। `a` এখনো `10`, কারণ তারা কোনো কিছু ভাগ করছে না।",
        },
        {
          line: 3,
          memory: [
            { name: "a", value: "10", kind: "let", state: "live" },
            { name: "b", value: "20", kind: "let", state: "live" },
            { name: "p", value: "→ { n: 1 }", kind: "const", state: "live" },
          ],
          note: "`{ n: 1 }` object টি তৈরি হলো (মডেলে heap এ), আর `p` তে বসল তার **reference** — `→` চিহ্নটি তাই বোঝায়।",
        },
        {
          line: 4,
          memory: [
            { name: "a", value: "10", kind: "let", state: "live" },
            { name: "b", value: "20", kind: "let", state: "live" },
            { name: "p", value: "→ { n: 1 }", kind: "const", state: "live" },
            { name: "q", value: "→ { n: 1 }", kind: "const", state: "live" },
          ],
          note: "`q = p` — **reference copy** হলো। নতুন object তৈরি হয়নি; `p` ও `q` একই `{ n: 1 }` এর দিকে তাকিয়ে আছে।",
        },
        {
          line: 5,
          memory: [
            { name: "a", value: "10", kind: "let", state: "live" },
            { name: "b", value: "20", kind: "let", state: "live" },
            { name: "p", value: "→ { n: 2 }", kind: "const", state: "live" },
            { name: "q", value: "→ { n: 2 }", kind: "const", state: "live" },
          ],
          note: "`q.n = 2` — object টিই বদলাল (mutation)। তাই `p` এর মধ্য দিয়ে দেখলেও `n` এখন `2`। `const` এখানে বাধা দেয়নি, কারণ কোনো binding বদলায়নি।",
        },
      ],
      caption: "এটি একটি সরলীকৃত mental model — engine এর ভেতরের বাস্তব চিত্র আরও জটিল হতে পারে।",
    },
    {
      kind: "memory-steps",
      title: "Function এ object পাঠানো: mutation বনাম reassignment",
      code: "function f(o) {\n  o.x = 1;\n  o = { x: 99 };\n}\nconst obj = { x: 0 };\nf(obj);",
      steps: [
        {
          line: 4,
          memory: [{ name: "obj", value: "→ { x: 0 }", kind: "const", state: "live" }],
          note: "caller এ `obj` একটি object এর reference ধরে আছে।",
        },
        {
          line: 0,
          memory: [
            { name: "obj", value: "→ { x: 0 }", kind: "const", state: "live" },
            { name: "o", value: "→ { x: 0 }", kind: "value", state: "live" },
          ],
          note: "`f(obj)` ডাকলে parameter `o` নামে **নতুন একটি variable** তৈরি হয়, আর তাতে `obj` এর **reference এর copy** বসে। দুটি আলাদা variable, কিন্তু একই object এ তাকিয়ে।",
        },
        {
          line: 1,
          memory: [
            { name: "obj", value: "→ { x: 1 }", kind: "const", state: "live" },
            { name: "o", value: "→ { x: 1 }", kind: "value", state: "live" },
          ],
          note: "`o.x = 1` — **mutation**। একই object বদলাল, তাই caller এর `obj` এর মধ্য দিয়েও `x: 1` দেখা যায়।",
        },
        {
          line: 2,
          memory: [
            { name: "obj", value: "→ { x: 1 }", kind: "const", state: "live" },
            { name: "o", value: "→ { x: 99 }", kind: "value", state: "live" },
          ],
          note: "`o = { x: 99 }` — **reassignment**। শুধু parameter `o` নতুন object এ ঘুরে গেল। `obj` এখনো আগের object এ — তার কিছুই বদলাল না।",
        },
        {
          line: 5,
          memory: [{ name: "obj", value: "→ { x: 1 }", kind: "const", state: "live" }],
          note: "function শেষ হলে `o` চলে যায়। ফল: `obj` এ mutation এর প্রভাব আছে (`x: 1`), reassignment এর কোনো প্রভাব নেই। এটিই প্রমাণ যে JS pass-by-value — যদি pass-by-reference হতো তবে `obj` ও `{ x: 99 }` হয়ে যেত।",
        },
      ],
    },
    {
      kind: "memory-steps",
      title: "Shallow copy: উপরের স্তর স্বাধীন, ভেতরের nested object ভাগ করা",
      code: "const a = { id: 1, tags: [\"x\"] };\nconst b = { ...a };\nb.id = 2;\nb.tags.push(\"y\");",
      steps: [
        {
          line: 0,
          memory: [{ name: "a", value: "→ { id: 1, tags: → [ 'x' ] }", kind: "const", state: "live" }],
          note: "`a` এর object এর ভেতরে `tags` নিজেই আরেকটি array object এর reference।",
        },
        {
          line: 1,
          memory: [
            { name: "a", value: "→ { id: 1, tags: → T }", kind: "const", state: "live" },
            { name: "b", value: "→ { id: 1, tags: → T }", kind: "const", state: "live" },
          ],
          note: "spread দিয়ে **নতুন উপরের object** তৈরি হলো। `id: 1` copy হলো (primitive), কিন্তু `tags` এর **reference** copy হলো — `T` চিহ্নটি বোঝায় দুই object একই array `T` কে দেখছে।",
        },
        {
          line: 2,
          memory: [
            { name: "a", value: "→ { id: 1, tags: → T }", kind: "const", state: "live" },
            { name: "b", value: "→ { id: 2, tags: → T }", kind: "const", state: "live" },
          ],
          note: "`b.id = 2` — শুধু `b` এর নিজের object বদলাল, কারণ `id` primitive ও আলাদা।",
        },
        {
          line: 3,
          memory: [
            { name: "a", value: "→ { id: 1, tags: → T[ 'x', 'y' ] }", kind: "const", state: "live" },
            { name: "b", value: "→ { id: 2, tags: → T[ 'x', 'y' ] }", kind: "const", state: "live" },
          ],
          note: "`b.tags.push('y')` — ভাগ করা array `T` বদলাল, তাই `a` তেও `'y'` দেখা যায়। সমাধান: `structuredClone(a)` অথবা `tags` ও আলাদা করে copy করা।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Primitive copy বনাম object alias",
      description: "একই `=` চিহ্ন, কিন্তু primitive ও object এ ফল সম্পূর্ণ আলাদা। Output অনুমান করে তারপর চালান।",
      code: `let score = 50;
let backup = score;
backup = 99;
console.log("primitive:", score, backup);

const original = { name: "Rina" };
const alias = original;
alias.name = "Mim";
console.log("object:", original.name, alias.name);
console.log("একই object?", original === alias);

const lookalike = { name: "Mim" };
console.log("হুবহু content কিন্তু একই object?", original === lookalike);`,
    },
    {
      level: "intermediate",
      title: "Function এ argument: mutation বনাম reassignment",
      description: "তিনটি function একই object এ ভিন্ন কাজ করে। কোনটি caller এর object বদলায়, কোনটি বদলায় না — এবং কেন?",
      code: `function mutate(user) {
  user.age = 30;           // একই object বদলায়
}

function reassign(user) {
  user = { name: "নতুন", age: 99 };   // শুধু local নাম ঘোরে
  return user;
}

function pureUpdate(user) {
  return { ...user, age: 31 };        // নতুন object, মূলটি অক্ষত
}

const u = { name: "Rina", age: 20 };

mutate(u);
console.log("mutate এর পর:", u);

const r = reassign(u);
console.log("reassign এর পর u:", u);
console.log("reassign এর ফেরত:", r);

const p = pureUpdate(u);
console.log("pureUpdate এর পর u:", u);
console.log("pureUpdate এর ফেরত:", p);
console.log(u === p);`,
    },
    {
      level: "real-world",
      title: "State update: shallow copy এর ফাঁদ ও structuredClone",
      description: "UI state বা Redux-ধাঁচের store এ ‘আগের state বদলে ফেলা’ একটি জনপ্রিয় bug। নিচে দেখুন spread কোথায় যথেষ্ট, কোথায় নয়।",
      code: `const state = {
  user: { name: "Rina", address: { city: "Dhaka" } },
  cart: ["pen"],
};

// ১) ভুল: shallow copy করে nested object বদলানো
const bad = { ...state };
bad.user.address.city = "Chattogram";
console.log("মূল state বদলে গেছে:", state.user.address.city);

// ২) সঠিক: যে path বদলাচ্ছে শুধু সেটুকু নতুন বানানো (structural sharing)
const state2 = { user: { name: "Rina", address: { city: "Dhaka" } }, cart: ["pen"] };
const next = {
  ...state2,
  user: { ...state2.user, address: { ...state2.user.address, city: "Sylhet" } },
};
console.log("মূল:", state2.user.address.city, "নতুন:", next.user.address.city);
console.log("cart একই array ভাগ করছে:", state2.cart === next.cart);
console.log("user আলাদা object:", state2.user === next.user);

// ৩) সম্পূর্ণ স্বাধীন deep copy
const deep = structuredClone(state2);
deep.user.address.city = "Khulna";
console.log("deep এর পর মূল:", state2.user.address.city);
console.log("cart আলাদা array:", state2.cart === deep.cart);`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a, a === b);
`,
    },
    {
      label: "Object identity ও তুলনা",
      code: `console.log({ a: 1 } === { a: 1 });   // false
console.log([] === []);               // false
console.log("ab" === "ab");           // true
console.log(NaN === NaN);             // false (primitive হলেও!)

const o = { a: 1 };
const same = o;
console.log(o === same);              // true

// content তুলনার সহজ (কিন্তু সীমাবদ্ধ) উপায়
const x = { a: 1, b: 2 };
const y = { a: 1, b: 2 };
console.log(JSON.stringify(x) === JSON.stringify(y));  // key এর ক্রম বদলালে ভুল ফল!
console.log(JSON.stringify({ a: 1, b: 2 }) === JSON.stringify({ b: 2, a: 1 }));`,
    },
    {
      label: "String immutable",
      code: `let s = "hello";
try {
  s[0] = "J";          // strict mode এ TypeError, sloppy এ নীরবে ব্যর্থ
} catch (e) {
  console.log(e.name);
}
console.log(s);        // hello — অপরিবর্তিত

const upper = s.toUpperCase();
console.log(s, upper); // মূল অক্ষত, নতুন string ফেরত

s = "J" + s.slice(1);  // নতুন string বানিয়ে variable কে নতুন মানে বাঁধা
console.log(s);`,
    },
    {
      label: "Shallow বনাম deep copy",
      code: `const orig = { n: 1, nested: { m: 1 }, list: [1, 2] };

const shallow = { ...orig };
const deep = structuredClone(orig);

shallow.nested.m = 100;
deep.list.push(3);

console.log("orig:", orig);
console.log("shallow.nested === orig.nested:", shallow.nested === orig.nested);
console.log("deep.nested === orig.nested:", deep.nested === orig.nested);

// structuredClone function copy করতে পারে না
try {
  structuredClone({ f() {} });
} catch (e) {
  console.log(e.name);
}`,
    },
  ],

  debugging: [
    {
      title: "Array ‘copy’ করলাম, তবু মূল array বদলে গেল",
      bad: `const original = [1, 2, 3];
const copy = original;     // নতুন array নয়, একই array এর আরেক নাম
copy.push(4);
console.log(original);`,
      why: "`const copy = original` শুধু reference copy করে — দুই নাম একই array এ। `copy.push(4)` সেই একটিমাত্র array কেই বদলায়, তাই `original` এ `4` চলে আসে।",
      fix: `const original = [1, 2, 3];
const copy = [...original];   // নতুন array তৈরি
copy.push(4);
console.log(original);        // মূল অক্ষত`,
    },
    {
      title: "দুটি একই দেখতে object ‘সমান’ হচ্ছে না",
      bad: `const a = { id: 1, name: "Rina" };
const b = { id: 1, name: "Rina" };
if (a === b) {
  console.log("সমান");
} else {
  console.log("সমান নয়");
}`,
      why: "`===` object এর ক্ষেত্রে identity তুলনা করে। `a` ও `b` দুটি আলাদা object, তাই content এক হলেও ফল `false`।",
      fix: `const a = { id: 1, name: "Rina" };
const b = { id: 1, name: "Rina" };

// content তুলনা: নির্দিষ্ট field ধরে তুলনা করুন
const sameUser = a.id === b.id && a.name === b.name;
console.log(sameUser ? "সমান" : "সমান নয়");`,
    },
    {
      title: "Function এর ভেতরে reassign করলে caller এ প্রভাব পড়ছে না",
      bad: `function reset(settings) {
  settings = { theme: "light" };   // শুধু local parameter ঘুরছে
}
const mySettings = { theme: "dark" };
reset(mySettings);
console.log(mySettings);`,
      why: "Argument হিসেবে reference এর একটি copy পাঠানো হয়। `settings = ...` শুধু সেই copy টিকে নতুন object এ বাঁধে; caller এর `mySettings` পুরোনো object এই থাকে।",
      fix: `// ১) নতুন মান ফেরত দিন (pure style, সবচেয়ে ভালো)
function reset() {
  return { theme: "light" };
}
let mySettings = { theme: "dark" };
mySettings = reset();
console.log(mySettings);

// ২) অথবা সরাসরি mutation: mySettings.theme = "light";`,
    },
    {
      title: "Spread copy করেও nested data বদলে যাচ্ছে",
      bad: `const config = { db: { port: 5432 } };
const copy = { ...config };
copy.db.port = 6000;
console.log(config.db.port);`,
      why: "spread শুধু উপরের স্তর copy করে। `db` property তে থাকা reference টি দুই object ই ভাগ করছে, তাই `copy.db.port` বদলালে `config.db.port` ও বদলে যায়।",
      fix: `const config = { db: { port: 5432 } };
const copy = structuredClone(config);   // deep copy
copy.db.port = 6000;
console.log(config.db.port);            // 5432`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "Primitive এর স্বাধীন copy",
      prompt: "`y` নামে একটি variable বানান যেটি `x` এর মান copy করে, তারপর `y` কে `99` করুন। শেষে `console.log(x, y)` দিয়ে `1 99` print করুন।",
      starter: `let x = 1;
// TODO: y বানান ও বদলান

console.log(x, y);`,
      expected: "1 99",
      hints: ["`let y = x;` লিখলে মান copy হয়।", "তারপর `y = 99;`।"],
      solution: `let x = 1;
let y = x;
y = 99;
console.log(x, y);`,
      explanation: "Primitive এ `=` মান copy করে, তাই `y` বদলালে `x` প্রভাবিত হয় না।",
    },
    {
      level: "beginner",
      title: "Array এর আলাদা copy বানান",
      prompt: "`copy` তে `original` এর একটি স্বাধীন copy রেখে `copy` এ `4` push করুন, তবু `original.length` যেন `3` থাকে। `3` print করুন।",
      starter: `const original = [1, 2, 3];
const copy = original;
copy.push(4);
console.log(original.length);`,
      expected: "3",
      hints: ["শুধু `copy` এর declaration লাইন বদলান।", "spread: `[...original]`।"],
      solution: `const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original.length);`,
      explanation: "`const copy = original` একই array এর reference; spread নতুন array তৈরি করে।",
    },
    {
      level: "beginner",
      title: "দুটি নাম, একই object",
      prompt: "`q` কে এমনভাবে বানান যেন `p === q` হয় `true`। তারপর `true` print করুন।",
      starter: `const p = { id: 1 };
const q = { id: 1 };
console.log(p === q);`,
      expected: "true",
      hints: ["`===` identity দেখে। তাই `q` কে নতুন object নয়, `p` এর reference বানাতে হবে।"],
      solution: `const p = { id: 1 };
const q = p;
console.log(p === q);`,
      explanation: "`q = p` reference copy করে, ফলে দুই নাম একই object কে নির্দেশ করে এবং `===` সত্য হয়।",
    },
    {
      level: "intermediate",
      title: "Mutation ছাড়া item যোগ",
      prompt: "`addItem` function টি যেন মূল array বদলায় না, বরং নতুন array ফেরত দেয়। ফল: `[ 1, 2 ] [ 1, 2, 3 ]`।",
      starter: `function addItem(list, item) {
  list.push(item);
  return list;
}

const nums = [1, 2];
const more = addItem(nums, 3);
console.log(nums, more);`,
      expected: "[ 1, 2 ] [ 1, 2, 3 ]",
      hints: ["`push` মূল array বদলায়।", "`[...list, item]` নতুন array ফেরত দেয়।"],
      solution: `function addItem(list, item) {
  return [...list, item];
}

const nums = [1, 2];
const more = addItem(nums, 3);
console.log(nums, more);`,
      explanation: "Function এ পাঠানো reference ধরে mutation করলে caller এর array বদলায়; spread দিয়ে নতুন array বানালে মূল অক্ষত থাকে।",
    },
    {
      level: "intermediate",
      title: "Nested object এর নিরাপদ copy",
      prompt: "`copy.db.port` বদলালেও `cfg.db.port` যেন `5432` থাকে। কোড ঠিক করে `5432` print করুন।",
      starter: `const cfg = { db: { port: 5432 } };
const copy = { ...cfg };
copy.db.port = 6000;
console.log(cfg.db.port);`,
      expected: "5432",
      hints: ["spread shallow copy; কোনটি deep copy করে?"],
      solution: `const cfg = { db: { port: 5432 } };
const copy = structuredClone(cfg);
copy.db.port = 6000;
console.log(cfg.db.port);`,
      explanation: "`structuredClone` nested object ও নতুন করে তৈরি করে, তাই দুই object কোনো অংশই ভাগ করে না।",
    },
    {
      level: "challenge",
      title: "Immutable nested update",
      prompt:
        "`withCity(state, city)` function লিখুন যা `state.address.city` বদলানো একটি **নতুন** state ফেরত দেবে, মূল `state` একটুও বদলাবে না। যে অংশ বদলায়নি (যেমন `name`) তা ভাগ হবে, যা বদলেছে (`address`) তা নতুন object হবে। শেষ লাইনে চারটি মান print হবে।",
      starter: `const state = { name: "Rina", address: { city: "Dhaka", zip: "1200" } };

function withCity(state, city) {
  // TODO: নতুন state ফেরত দিন
}

const updated = withCity(state, "Chattogram");
console.log(state.address.city, updated.address.city, state.address === updated.address, state.name === updated.name);`,
      expected: "Dhaka Chattogram false true",
      hints: [
        "উপরের স্তরের জন্য `{ ...state, ... }`।",
        "`address` নিজেও object, তাই এর জন্যও আলাদা spread: `address: { ...state.address, city }`।",
        "`name` primitive, তাই copy হলেও `===` সত্য।",
      ],
      solution: `const state = { name: "Rina", address: { city: "Dhaka", zip: "1200" } };

function withCity(state, city) {
  return { ...state, address: { ...state.address, city } };
}

const updated = withCity(state, "Chattogram");
console.log(state.address.city, updated.address.city, state.address === updated.address, state.name === updated.name);`,
      explanation: "বদলানো path (`state` → `address`) এর প্রতিটি স্তরে নতুন object বানাতে হয়; বাকি অংশ ভাগ করে নেওয়া হয়। এটিই React/Redux এ ব্যবহৃত ‘structural sharing’ ধারণার ভিত্তি।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`const a = [1]; const b = a; b.push(2); console.log(a.length);` — কী print হবে?",
        options: ["1", "2", "3", "TypeError"],
        answer: 1,
        explanation:
          "`b = a` reference copy; দুই নাম একই array এ। `b.push(2)` সেই array কে বদলায়, তাই `a.length` হয় `2`। `1` হতো যদি array copy হতো। `const` mutation আটকায় না, তাই TypeError নয়। `3` এর কোনো কারণ নেই।",
      },
      {
        question: "JavaScript এ function argument পাঠানোর সঠিক বর্ণনা কোনটি?",
        options: [
          "Primitive pass-by-value, object pass-by-reference",
          "সবসময় pass-by-reference",
          "সবসময় pass-by-value; object এর ক্ষেত্রে value টি হলো reference",
          "`const` হলে pass-by-reference, নইলে pass-by-value",
        ],
        answer: 2,
        explanation:
          "প্রতিটি argument এর একটি copy parameter এ বসে — সবসময়। object এর ক্ষেত্রে copy হয় reference। তাই function এর ভেতরে reassign করলে caller এ প্রভাব পড়ে না, কিন্তু mutation পড়ে। প্রথম অপশনটি জনপ্রিয় কিন্তু বিভ্রান্তিকর; দ্বিতীয়টি ভুল কারণ reassignment caller এর variable বদলাত; চতুর্থটির `const` এর সাথে কোনো সম্পর্ক নেই।",
      },
      {
        question: "`let s = 'abc'; s.toUpperCase(); console.log(s);` — কী print হবে?",
        options: ["abc", "ABC", "undefined", "TypeError"],
        answer: 0,
        explanation:
          "String immutable; `toUpperCase()` মূল string বদলায় না, নতুন string ফেরত দেয় — আর সেই ফল কোথাও রাখা হয়নি। তাই `s` এখনো `abc`। `ABC` হতো যদি `s = s.toUpperCase()` লেখা হতো। `undefined` বা TypeError আসার কোনো কারণ নেই।",
      },
      {
        question: "কোনটি **nested** object সহ সম্পূর্ণ স্বাধীন (deep) copy দেয়?",
        options: ["`{ ...obj }`", "`Object.assign({}, obj)`", "`const copy = obj`", "`structuredClone(obj)`"],
        answer: 3,
        explanation:
          "`structuredClone` nested object গুলোও নতুন করে তৈরি করে। spread ও `Object.assign` শুধু shallow — nested reference ভাগ হয়। `const copy = obj` তো কোনো copy ই নয়, শুধু আরেকটি নাম।",
      },
      {
        question: "`const a = { x: 1 }; const b = { x: 1 }; console.log(a === b, a.x === b.x);` এর output কী?",
        options: ["true true", "false false", "true false", "false true"],
        answer: 3,
        explanation:
          "`a` ও `b` দুটি আলাদা object, তাই `a === b` হলো `false` (identity)। কিন্তু `a.x` ও `b.x` দুটি primitive `1`, মান সমান বলে `true`। অন্য অপশনগুলো এই দুই তুলনার নিয়ম গুলিয়ে ফেলেছে।",
      },
    ],
    coding: [
      {
        title: "মূল array না বদলে শেষ element বাদ",
        prompt: "`withoutLast(arr)` লিখুন যা শেষ element বাদ দিয়ে নতুন array ফেরত দেবে এবং মূল array বদলাবে না। `console.log(nums, result)` দিয়ে `[ 1, 2, 3 ] [ 1, 2 ]` print করুন।",
        starter: `// TODO: withoutLast লিখুন
`,
        expected: "[ 1, 2, 3 ] [ 1, 2 ]",
        solution: `function withoutLast(arr) {
  return arr.slice(0, -1);
}

const nums = [1, 2, 3];
const result = withoutLast(nums);
console.log(nums, result);`,
      },
      {
        title: "প্রতিটি সংখ্যা ১ বাড়ান — নতুন object এ",
        prompt: "`incrementAll(obj)` লিখুন যা প্রতিটি property এর মান `1` বাড়িয়ে **নতুন** object ফেরত দেবে, মূল object বদলাবে না। `{ a: 1, b: 2 }` দিয়ে `{ a: 1, b: 2 } { a: 2, b: 3 }` print করুন।",
        starter: `// TODO: incrementAll লিখুন
`,
        expected: "{ a: 1, b: 2 } { a: 2, b: 3 }",
        solution: `function incrementAll(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v + 1]));
}

const original = { a: 1, b: 2 };
const next = incrementAll(original);
console.log(original, next);`,
      },
    ],
  },

  interview: [
    {
      q: "JavaScript এ primitive ও reference type এর পার্থক্য কী?",
      a: "Primitive (`number`, `string`, `boolean`, `undefined`, `null`, `symbol`, `bigint`) immutable, এবং variable এ মান নিজেই থাকে — তাই assign করলে মান copy হয়। Object (array, function সহ) mutable, এবং variable এ থাকে object এর reference — তাই assign করলে reference copy হয়, দুই নাম একই object কে নির্দেশ করে।\n\nএর ফলে তিনটি আচরণ আলাদা: **assignment** (value copy বনাম reference copy), **comparison** (`===` এ মান বনাম identity), এবং **mutation এর দৃশ্যমানতা** (একটি নামের মধ্য দিয়ে বদলালে অন্য নামেও দেখা যায় কি না)। ভালো উত্তরে stack/heap এর উল্লেখ থাকতে পারে, তবে সেটিকে simplified model বলে স্বীকার করা উচিত — spec এ ওই শব্দ নেই এবং engine optimization ভিন্ন হতে পারে।",
    },
    {
      q: "JavaScript কি pass-by-reference? নাকি pass-by-value?",
      a: "JavaScript **সবসময় pass-by-value**। কিন্তু object এর ক্ষেত্রে সেই value টি হলো reference। তাই parameter হলো একটি নতুন variable যার ভেতরে caller এর reference এর copy বসে।\n\nপ্রমাণ: function এর ভেতরে `param.x = 1` (mutation) করলে caller তা দেখে, কারণ একই object। কিন্তু `param = {…}` (reassignment) করলে caller এর variable বদলায় না, কারণ শুধু local copy ঘুরেছে। সত্যিকারের pass-by-reference ভাষায় (যেমন C++ এর reference parameter) reassignment ও caller এর variable কে বদলে দিত। কখনো কখনো এই আচরণকে ‘call by sharing’ ও বলা হয়।",
    },
    {
      q: "`const` দিয়ে declare করা object কীভাবে বদলানো যায়? এটি কি const এর ব্যতিক্রম?",
      a: "ব্যতিক্রম নয়। `const` শুধু **binding** আটকায় — অর্থাৎ নামটি অন্য মানে বাঁধা যাবে না। object এর ক্ষেত্রে নামের ভেতরে থাকে একটি reference; `const` বলছে সেই reference আর বদলাবে না। কিন্তু reference এর গন্তব্য object টি mutable, তাই `obj.a = 1` বা `arr.push(1)` বৈধ।\n\nঅপরিবর্তনীয় object চাইলে `Object.freeze` (shallow) ব্যবহার করা যায়, অথবা কোড লেখার ধরন বদলে mutation এর বদলে নতুন object তৈরি করা যায় (immutable update pattern)।",
    },
    {
      q: "Shallow copy ও deep copy এর পার্থক্য কী? কখন কোনটি ব্যবহার করবেন?",
      a: "Shallow copy শুধু উপরের স্তরের property গুলো নতুন object এ তোলে; property এর মান যদি object হয়, তবে তার **reference** টিই copy হয়, ফলে nested অংশ মূল ও copy ভাগ করে। `{...obj}`, `[...arr]`, `Object.assign`, `slice()` সব shallow। Deep copy nested object গুলোও নতুন করে তৈরি করে — আধুনিক উপায় `structuredClone(obj)`।\n\nসব সময় deep copy দরকার হয় না; বড় state এ প্রতিবার deep clone ব্যয়বহুল। যে path বদলাচ্ছে শুধু সেটুকু spread দিয়ে নতুন করে বানানো (structural sharing) প্রায়ই ভালো। মনে রাখুন `structuredClone` function copy করতে পারে না এবং class instance এর prototype হারায়।",
    },
    {
      q: "`{} === {}` কেন false? দুটি object এর content কীভাবে তুলনা করবেন?",
      a: "প্রতিটি object literal মূল্যায়নে নতুন object তৈরি হয়, আর `===` object এ **identity** (একই object কি না) তুলনা করে। তাই দুটি আলাদা `{}` সমান নয়।\n\nContent তুলনার জন্য: ছোট ও জানা গঠনের object এ নির্দিষ্ট field ধরে তুলনা করুন। সাধারণ ক্ষেত্রে সুপরীক্ষিত `deepEqual` utility (বা library) ব্যবহার করুন। `JSON.stringify(a) === JSON.stringify(b)` সহজ কিন্তু ঝুঁকিপূর্ণ — key এর ক্রম বদলালে, `undefined`/function/`NaN`/`Date` থাকলে বা cycle থাকলে ভুল বা ব্যর্থ ফল দেয়।",
    },
    {
      q: "String immutable বলতে কী বোঝায়? `s[0] = 'X'` লিখলে কী হয়?",
      a: "String immutable মানে একবার তৈরি হলে তার ভেতরের অক্ষর বদলানো যায় না। `toUpperCase()`, `slice()`, `replace()` ইত্যাদি সব method মূল string অক্ষত রেখে **নতুন string ফেরত দেয়**।\n\n`s[0] = 'X'` লিখলে strict mode এ (ES Module ও class body সহ) `TypeError` হয়; sloppy mode এ নীরবে কিছুই হয় না, ফলে bug লুকিয়ে থাকতে পারে। তাই আধুনিক কোডে strict mode/Module ব্যবহার করা ভালো। loop এর ভেতরে বারবার `str += ...` করলে প্রতিবার নতুন string তৈরির ধারণা মাথায় রাখা ভালো, যদিও engine এ এর জন্য নানা optimization থাকে।",
    },
    {
      q: "Prototype pollution এর সাথে object copy/merge এর সম্পর্ক কী?",
      a: "নিজে হাতে লেখা recursive merge/clone function যদি অবিশ্বস্ত JSON এর key (বিশেষ করে `__proto__`, `constructor`, `prototype`) যাচাই ছাড়া target object এ বসায়, তবে আক্রমণকারী `Object.prototype` এ property ঢুকিয়ে দিতে পারে — যার প্রভাব অ্যাপ্লিকেশনের প্রায় সব object এ পড়ে (authorization bypass, logic bug ইত্যাদি)।\n\nপ্রতিরোধ: নিজে merge function না লিখে সুপরীক্ষিত library ব্যবহার করা; `__proto__` সহ বিপজ্জনক key বাদ দেওয়া; `Object.create(null)` বা `Map` ব্যবহার; এবং data copy এর জন্য `structuredClone` ব্যবহার করা।",
    },
  ],

  summary: {
    takeaways: [
      "Primitive এ variable মান ধরে রাখে (copy by value); object এ ধরে রাখে reference (copy by reference)।",
      "Stack/heap একটি সরলীকৃত mental model — spec এ নেই, engine ভেদে বাস্তবতা ভিন্ন হতে পারে; কিন্তু আচরণ সবসময় একই।",
      "JavaScript এ argument সবসময় pass-by-value; object এর value হলো reference। তাই mutation caller এ দেখা যায়, reassignment যায় না।",
      "`===` object এ identity তুলনা করে; content তুলনা করতে হলে field বা `deepEqual` ব্যবহার করুন।",
      "`const` binding আটকায়, mutation নয়। String সহ সব primitive immutable।",
      "`{...obj}`/`[...arr]` shallow copy; nested data স্বাধীন করতে `structuredClone` (function copy করতে পারে না)।",
    ],
    syntax: `let b = a;                    // primitive: মান copy; object: reference copy
const copy1 = { ...obj };     // shallow copy
const copy2 = [...arr];       // shallow copy (array)
const deep = structuredClone(obj);   // deep copy (data only)
a === b;                      // object এ: একই object কি না`,
    whenToUse: [
      "Function এ object পাঠানোর সময় ঠিক করুন mutation করবেন নাকি নতুন object ফেরত দেবেন — সম্ভব হলে নতুন object ফেরত দিন।",
      "State/config copy করার সময় nested আছে কি না দেখুন: না থাকলে spread, থাকলে path-wise spread বা `structuredClone`।",
      "Object তুলনা করার সময় identity (`===`) চান নাকি content সমতা — তা আগে ঠিক করুন।",
      "অবিশ্বস্ত JSON merge করার সময় বিপজ্জনক key (`__proto__`) সম্পর্কে সতর্ক থাকুন।",
    ],
    next: ["Type Conversion — explicit রূপান্তর", "Type Coercion — implicit রূপান্তর", "Equality (`==` বনাম `===`)", "Immutability ও Object.freeze (Objects module)"],
  },

  compatibility:
    "Primitive/reference এর আচরণ ECMAScript এর অংশ — browser ও Node.js এ একই। `structuredClone` আধুনিক browser ও Node.js 17+ এ আছে (browser ভেদে ন্যূনতম সংস্করণ আলাদা, পুরোনো environment এ থাকতে নাও পারে)। এই lesson এর সব কোড pure JavaScript এবং Web Worker sandbox এ চলে; DOM বা Node-specific API ব্যবহার হয়নি।",
};
