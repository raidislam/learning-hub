import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "JavaScript এর পুরো **falsy** তালিকা (`false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`) মুখস্থ বলতে পারবেন এবং বাকি সবকিছু যে truthy তা জানবেন।",
    "`if`, `&&`, `||`, `!`, ternary ও loop এর শর্তে engine ভেতরে **ToBoolean** রূপান্তর কীভাবে করে তা ব্যাখ্যা করতে পারবেন।",
    "`'0'`, `'false'`, `[]`, `{}`, `new Boolean(false)` কেন truthy — এবং `[] == false` এর সাথে এর পার্থক্য বুঝবেন।",
    "`if (count)` এ `0` হারানো, `[]` কে ফাঁকা ভাবা, `if (x == true)` এর মতো সাধারণ bug চিনে ঠিক করতে পারবেন।",
    "`!!`, `Boolean()`, `filter(Boolean)` ও `??` ঠিক জায়গায় ব্যবহার করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Truthy ও Falsy কী এবং কেন আছে?" },
    {
      type: "p",
      text: "`if (user) { ... }` লিখলে `user` কিন্তু `true` বা `false` নয় — তবু JavaScript শর্তটি চালিয়ে দেয়। কারণ ভাষা যেখানেই **boolean প্রসঙ্গ** (condition) চায়, সেখানে যেকোনো মানকেই স্বয়ংক্রিয়ভাবে boolean এ রূপান্তর করে নেয়। যে মান রূপান্তরের পর `false` হয় তাকে বলা হয় **falsy**, আর যা `true` হয় তা **truthy**। এই ব্যবস্থার সুবিধা হলো সংক্ষিপ্ত কোড (`if (name)` বনাম `if (name !== undefined && name !== null && name !== '')`)। অসুবিধা হলো: এই সংক্ষেপ অনেক সময় এমন মানকেও ‘খালি’ ভাবে যা আসলে বৈধ (যেমন `0`) — যা থেকে বহু বাস্তব bug জন্মায়।",
    },
    { type: "h3", text: "সম্পূর্ণ falsy তালিকা — মাত্র আটটি (এবং একটি legacy ব্যতিক্রম)" },
    {
      type: "p",
      text: "JavaScript এ falsy মান **সসীম এবং ছোট**। পুরো তালিকাটি মুখস্থ রাখুন — বাকি সবকিছুই truthy:",
    },
    {
      type: "compare",
      headers: ["Falsy মান", "Type", "মন্তব্য"],
      rows: [
        ["`false`", "boolean", "একমাত্র falsy boolean"],
        ["`0`", "number", "ধনাত্মক শূন্য"],
        ["`-0`", "number", "ঋণাত্মক শূন্য — `-0 === 0`, দুটিই falsy"],
        ["`0n`", "bigint", "BigInt শূন্য (ES2020)"],
        ["`''` (এবং `\"\"`, template literal এর খালি রূপ)", "string", "দৈর্ঘ্য ০ এর string; `' '` (space) নয়"],
        ["`null`", "null", "ইচ্ছাকৃত ‘মান নেই’"],
        ["`undefined`", "undefined", "মান দেওয়া হয়নি"],
        ["`NaN`", "number", "অকার্যকর গাণিতিক ফল"],
      ],
    },
    {
      type: "p",
      text: "এছাড়া একটি **browser-only legacy ব্যতিক্রম** আছে: `document.all` (পুরোনো ওয়েবের compatibility এর জন্য রাখা বিশেষ object) object হয়েও falsy ধরা হয়। আধুনিক কোডে এটি ব্যবহার হয় না এবং Node.js এ এর অস্তিত্বই নেই — শুধু জেনে রাখুন, এর ওপর নির্ভর করার কিছু নেই।",
    },
    { type: "h3", text: "বাকি সবকিছু truthy — যেগুলো প্রায়ই ভুল ধরা হয়" },
    {
      type: "ul",
      items: [
        "**`'0'`** ও **`'false'`** — দুটিই **অ-খালি string**, তাই truthy। string এর truthiness শুধু ‘দৈর্ঘ্য > 0 কি না’ দেখে, ভেতরের অর্থ নয়।",
        "**`' '`** (একটি space) — অ-খালি, তাই truthy। `trim()` না করে ‘ফাঁকা input’ যাচাই করলে এটি ধরা পড়ে না।",
        "**`[]`** (খালি array) ও **`{}`** (খালি object) — **সব object truthy**, ভেতরে কিছু থাকুক বা না থাকুক।",
        "**function** (`() => {}` সহ), **`Symbol()`**, **`Infinity`**, **`-1`**, **`1n`** — সবই truthy।",
        "**`new Boolean(false)`**, `new Number(0)`, `new String('')` — wrapper **object**, তাই truthy! (primitive `false` falsy, কিন্তু তার wrapper object নয়। wrapper গুলো সাধারণত ব্যবহারই করা হয় না।)",
      ],
    },
    { type: "h3", text: "ভেতরে কীভাবে কাজ করে: ToBoolean" },
    {
      type: "p",
      text: "ECMAScript spec এ একটি অভ্যন্তরীণ অপারেশন আছে **ToBoolean(value)**। এটি value এর type দেখে সিদ্ধান্ত নেয়: `undefined` ও `null` → `false`; boolean → নিজেই; number → `0`, `-0`, `NaN` হলে `false`, নইলে `true`; string → খালি হলে `false`; bigint → `0n` হলে `false`; symbol → সবসময় `true`; object → সবসময় `true` (শুধু উপরের `document.all` ব্যতিক্রম)। `if`, `while`, `for` এর মাঝের শর্ত, ternary `?:` এর শর্ত, `!` operator, এবং `&&`/`||` এর বাঁ দিকের operand — সর্বত্র এই রূপান্তর হয়। আপনি স্পষ্টভাবে চাইলে `Boolean(value)` বা `!!value` লিখে একই রূপান্তর ঘটাতে পারেন (`!` একবার negate করে, আরেকটি `!` আবার উল্টে দেয়)।",
    },
    {
      type: "callout",
      tone: "info",
      title: "ToBoolean বনাম `==` এর রূপান্তর — আলাদা জিনিস",
      text: "`if (x)` ToBoolean ব্যবহার করে। কিন্তু `x == false` সম্পূর্ণ আলাদা algorithm (boolean কে **number** এ রূপান্তর) ব্যবহার করে। তাই `[]` truthy (`if ([])` চলে), অথচ `[] == false` ও `true`! দুটিকে গুলিয়ে ফেললে বিভ্রান্তি হয় — truthiness যাচাইতে `==` মেলাবেন না।",
    },
    { type: "h3", text: "Truthiness এর সাথে `&&`, `||`, `??`" },
    {
      type: "p",
      text: "`a || b` ও `a && b` truthiness দেখে সিদ্ধান্ত নেয় কোন operand ফেরত দেবে (এরা boolean নয়, operand-ই ফেরত দেয়)। `a ?? b` truthiness দেখে না — শুধু `null`/`undefined` দেখে। তাই ডিফল্ট মান বসাতে `value || default` লিখলে সব falsy মান (`0`, `''`, `false`, `NaN`) বদলে যায়; `value ?? default` লিখলে শুধু ‘সত্যিই অনুপস্থিত’ মান বদলায়। কোনটি দরকার তা ঠিক করুন: ‘খালি string কেও fallback চাই’ হলে `||`, ‘`0` বৈধ’ হলে `??`।",
    },
    {
      type: "code",
      caption: "যেকোনো environment এ চলে — গুরুত্বপূর্ণ pattern গুলো",
      code: "const user = { name: '', visits: 0 };\n\nconsole.log(user.name || 'Anonymous');   // 'Anonymous'  (খালি name বদলাতে চাই)\nconsole.log(user.visits || 1);           // 1  (ভুল: 0 বৈধ ছিল!)\nconsole.log(user.visits ?? 1);           // 0  (ঠিক)\nconsole.log(user.profile && user.profile.avatar); // undefined (guard)\nconst clean = ['a', '', 'b', null].filter(Boolean); // [ 'a', 'b' ]",
    },
    { type: "h3", text: "সাধারণ bug গুলো এবং সঠিক উপায়" },
    {
      type: "ol",
      items: [
        "**`if (count)` যেখানে `0` বৈধ** — `count = 0` হলে ব্লক চলে না। সঠিক: `if (count !== undefined)` বা `if (count != null)` বা শুধু প্রয়োজনে `typeof count === 'number'`।",
        "**`if (arr)` দিয়ে ‘array এ আইটেম আছে’ যাচাই** — `[]` truthy, তাই সবসময় `true`। সঠিক: `if (arr.length > 0)` (অথবা `arr.length` — কারণ `0` falsy, তবে স্পষ্টতার জন্য `> 0` ভালো)। `arr` নিজেই `undefined` হতে পারলে `arr?.length > 0`।",
        "**`if (x == true)`** — `true` কে আগে `1` করা হয়, তাই `2 == true` হলো `false` যদিও `2` truthy। truthiness চাইলে সরাসরি `if (x)`; নির্দিষ্ট boolean চাইলে `x === true`।",
        "**`'false'` / `'0'` string কে boolean ধরা** — `localStorage`, URL query, env variable, form data সবই string; `if (flag)` এ `'false'` truthy। রূপান্তর স্পষ্ট করুন: `flag === 'true'`।",
        "**React/JSX এ `{items.length && <List />}`** — `items.length` `0` হলে `0` render হয়ে যায় (কারণ `&&` operand ফেরত দেয়)। সঠিক: `items.length > 0 && ...`। (এটি framework এর বিষয়, তবে truthy নিয়মের সরাসরি ফল।)",
        "**`filter(Boolean)` দিয়ে `0` মুছে ফেলা** — সব falsy ছাঁটে, `0` ও `false` সহ। শুধু `null`/`undefined`/খালি string ছাঁটতে স্পষ্ট predicate লিখুন।",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Common misconceptions",
      text: "১) ‘খালি array/object falsy’ — না, `[]` ও `{}` truthy। ২) ‘`'0'` ও `'false'` falsy’ — না, অ-খালি string। ৩) ‘`if (x == false)` আর `if (!x)` একই’ — না (`[] == false` সত্য, `![]` মিথ্যা)। ৪) ‘`new Boolean(false)` falsy’ — না, wrapper object truthy। ৫) ‘`&&`/`||` boolean ফেরত দেয়’ — না, operand ফেরত দেয়। ৬) ‘`NaN` কোনো রকম সংখ্যা তাই truthy’ — `NaN` falsy।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "Security note: Truthy যাচাই দিয়ে অনুমতি/অ্যাক্সেস নির্ধারণ",
      text: "`if (user.isAdmin)` এর মতো যাচাইয়ে মানটি যদি JSON/form/query থেকে আসে এবং string হয়, তবে `'false'`, `'0'` সবই truthy — অর্থাৎ ভুলবশত privilege বা feature চালু হয়ে যেতে পারে। একইভাবে `if (token)` এ `' '` (শুধু space) বা `{}` পাস করে যায়। অনুমতি/payment/validation এর সিদ্ধান্তে truthiness ভরসা করবেন না: type যাচাই করুন (`typeof`), স্পষ্ট তুলনা করুন (`=== true`) এবং server-side এ input সবসময় schema দিয়ে যাচাই করুন।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Browser বনাম Node.js",
      text: "ToBoolean এর নিয়ম ECMAScript spec এ নির্ধারিত, তাই Browser ও Node.js এ একই। একমাত্র ব্যতিক্রম Browser এর legacy `document.all` (falsy object) — Node.js এ এটি নেই। `0n` (BigInt) আধুনিক সব environment এ সমর্থিত।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "কল্পনা করুন একটি **বিল্ডিং এর নিরাপত্তা গেটে** একজন প্রহরী বসে আছেন, যার কাজ ‘এই লোকটির সাথে কিছু আছে কি না’ — এই একটিমাত্র প্রশ্নে সবাইকে ‘ঢুকতে দাও’ বা ‘ফিরিয়ে দাও’ বলা। এই প্রহরীই হলো `if` এর ভেতরের **ToBoolean**।",
    },
    {
      type: "p",
      text: "প্রহরীর কাছে ‘ফিরিয়ে দেওয়ার’ তালিকা অত্যন্ত ছোট এবং বাঁধা: ঠিক আটটি ধরনের মানুষ — যারা **শূন্য হাতে** এসেছেন। কেউ খালি হাতে (`undefined`), কেউ ‘আমি ইচ্ছে করেই কিছু আনিনি’ (`null`), কেউ ‘`০`’ লেখা কার্ড দেখাচ্ছেন (`0`), কেউ ফাঁকা খাম (`''`), কেউ ‘বোধগম্য নয়’ লেখা কাগজ (`NaN`), ইত্যাদি। এর বাইরে **যে-ই হাতে কিছু একটা নিয়ে এসেছেন, তিনিই ঢুকবেন** — তা সে যাই হোক।",
    },
    {
      type: "p",
      text: "এখানেই মজার বিষয়: যিনি **‘০’ লেখা কার্ডের বদলে ‘০’ নামে একটি ছোট চিরকুট** (`'0'` string) হাতে এসেছেন, প্রহরী তাঁকে ঢুকতে দেন — চিরকুট তো আছে! সে একটি **খালি ব্যাগ** (`[]`) নিয়ে এলেও তাকে ঢুকতে দেওয়া হয়, কারণ প্রহরী ব্যাগ খুলে দেখে না ভেতরে কী — ব্যাগ থাকাই যথেষ্ট। তাই ‘ব্যাগে জিনিস আছে কি না’ জানতে আপনাকেই ব্যাগের ভেতর (`.length`) দেখতে হবে।",
    },
    {
      type: "ul",
      items: [
        "**`||`** হলো ‘যে প্রথম ব্যক্তি কিছু এনেছেন তাঁকে নিন’ — কিন্তু ‘০’ কার্ডধারীকে সে খালি হাত ভেবে বাদ দেয়।",
        "**`??`** হলো ‘যিনি সত্যিই খালি হাতে (`null`/`undefined`) এসেছেন কেবল তাঁকেই বাদ দিন’ — ‘০’ কার্ডধারী গ্রহণযোগ্য।",
        "**`!!`** হলো প্রহরীকে বলা ‘শুধু হ্যাঁ বা না বলুন, কাকে ঢুকতে দিলেন তা জানাতে হবে না’।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "`if (value)` এর ভেতরে ToBoolean এর সিদ্ধান্ত",
      nodes: [
        { id: "value", label: "value", sub: "শর্তের মান" },
        { id: "check", label: "ToBoolean", sub: "type দেখে সিদ্ধান্ত" },
        { id: "falsy", label: "Falsy তালিকা", sub: "৮টি মান" },
        { id: "branch", label: "if এর ফল", sub: "" },
      ],
      steps: [
        {
          active: ["value"],
          items: { value: ["value = []"] },
          note: "`if ([])` — শর্তের জায়গায় যে মানটি আছে তা boolean নয়, একটি খালি array।",
        },
        {
          active: ["check"],
          items: { value: ["value = []"], check: ["type: object", "object → সবসময় true"] },
          note: "engine ToBoolean চালায়। মানটি **object**, আর spec বলে object সবসময় `true` — ভেতরে কিছু আছে কি না তা দেখা হয় না।",
        },
        {
          active: ["falsy"],
          items: { falsy: ["false, 0, -0, 0n", "'', null, undefined, NaN"] },
          note: "তুলনায় falsy তালিকা মাত্র আটটি মান। `[]` তাতে নেই, তাই এটি falsy নয়।",
        },
        {
          active: ["branch"],
          items: { branch: ["true → if ব্লক চলে"] },
          output: "if ব্লক চলল",
          note: "ফল `true`, তাই `if ([])` এর ব্লক চলে। এ কারণেই ‘array খালি কি না’ জানতে `arr.length > 0` লিখতে হয় — `arr.length` এর মান `0` (number), যা falsy।",
        },
      ],
      caption: "Object সবসময় truthy; খালি হলেও।",
    },
    {
      kind: "memory-steps",
      title: "একই ‘শূন্য’, ভিন্ন type — ভিন্ন truthiness",
      code: "const a = 0;\nconst b = '0';\nconst c = [];\nconst d = c.length;\nconst e = '';",
      steps: [
        {
          line: 0,
          memory: [{ name: "a", value: "0 → falsy", kind: "const", state: "live" }],
          note: "`a` হলো number `0` — falsy তালিকার সদস্য।",
        },
        {
          line: 1,
          memory: [
            { name: "a", value: "0 → falsy", kind: "const", state: "live" },
            { name: "b", value: "'0' → truthy", kind: "const", state: "live" },
          ],
          note: "`b` হলো string `'0'` — অ-খালি string, তাই **truthy**। ‘০’ দেখতে একই, কিন্তু type আলাদা।",
        },
        {
          line: 2,
          memory: [
            { name: "a", value: "0 → falsy", kind: "const", state: "live" },
            { name: "b", value: "'0' → truthy", kind: "const", state: "live" },
            { name: "c", value: "→ [] → truthy", kind: "const", state: "live" },
          ],
          note: "`c` একটি খালি array object — object বলেই **truthy**।",
        },
        {
          line: 3,
          memory: [
            { name: "a", value: "0 → falsy", kind: "const", state: "live" },
            { name: "b", value: "'0' → truthy", kind: "const", state: "live" },
            { name: "c", value: "→ [] → truthy", kind: "const", state: "live" },
            { name: "d", value: "0 → falsy", kind: "const", state: "live" },
          ],
          note: "`c.length` এর মান number `0` — **falsy**। তাই ‘array তে আইটেম আছে কি না’ জানতে `c` নয়, `c.length` দেখতে হয়।",
        },
        {
          line: 4,
          memory: [
            { name: "a", value: "0 → falsy", kind: "const", state: "live" },
            { name: "b", value: "'0' → truthy", kind: "const", state: "live" },
            { name: "c", value: "→ [] → truthy", kind: "const", state: "live" },
            { name: "d", value: "0 → falsy", kind: "const", state: "live" },
            { name: "e", value: "'' → falsy", kind: "const", state: "live" },
          ],
          note: "`e` খালি string — falsy। অথচ `' '` (একটি space) থাকলে সেটি truthy হতো।",
        },
      ],
      caption: "Truthiness নির্ভর করে type ও মানের ওপর — দেখতে কেমন লাগে তার ওপর নয়।",
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Falsy তালিকা ও পরিচিত truthy মান",
      description: "আটটি falsy মান `every` দিয়ে যাচাই, এবং যে মানগুলো দেখে ভুল হয় সেগুলোর `Boolean()` ফল।",
      code: `const falsyValues = [false, 0, -0, 0n, "", null, undefined, NaN];
console.log(falsyValues.every((v) => !v));

console.log(Boolean("0"), Boolean("false"), Boolean(" "));
console.log(Boolean([]), Boolean({}), Boolean(() => {}));
console.log(Boolean(Infinity), Boolean(-1), Boolean(Symbol()));
console.log(Boolean(new Boolean(false)));

console.log(!!"hello", !!"", !!0, !!null);`,
    },
    {
      level: "intermediate",
      title: "শর্তে truthiness: ঠিক ও ভুল যাচাই",
      description: "`if (count)` এর সমস্যা, `[]` বনাম `.length`, এবং truthiness বনাম `==` — একসাথে দেখুন।",
      code: `function describe(count) {
  if (count) return "has items";
  return "empty";
}
console.log(describe(0), describe(5));   // 0 বৈধ হলে এটি ভুল ফল!

function describeSafe(count) {
  if (count === undefined) return "unknown";
  return count > 0 ? "has items" : "empty";
}
console.log(describeSafe(0), describeSafe(5), describeSafe());

const list = [];
console.log(list ? "truthy" : "falsy", list.length ? "non-empty" : "empty");

// truthiness বনাম ==
console.log([] ? "truthy" : "falsy");
console.log([] == false);   // আলাদা algorithm
console.log("0" ? "truthy" : "falsy", "0" == false);`,
    },
    {
      level: "real-world",
      title: "Data সাফ করা: filter(Boolean) এর ফাঁদ ও নিরাপদ বিকল্প",
      description: "API/form data থেকে ফাঁকা মান ছাঁটা — কিন্তু বৈধ `0` যেন হারিয়ে না যায়। সাথে `&&` guard ও `??` fallback।",
      code: `const raw = ["Rina", "", null, "Karim", undefined, 0, "Mim", false];

// সব falsy মুছে যায় — 0 ও
console.log(raw.filter(Boolean));

// শুধু null, undefined ও খালি string বাদ; 0 ও false থাকে
console.log(raw.filter((v) => v != null && v !== ""));

// && দিয়ে guard, ?? দিয়ে fallback
const order = { items: [], coupon: null, discount: 0 };
const firstItem = order.items.length > 0 && order.items[0];
console.log(firstItem);
console.log(order.coupon ?? "no coupon", order.discount ?? 10, order.discount || 10);

// UI এর ক্লাসিক ফাঁদ: 0 print হয়ে যায়
console.log([].length && "show list");
console.log([].length > 0 && "show list");`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
console.log(Boolean(""), Boolean(" "));
`,
    },
    {
      label: "Truthy/Falsy মাপার table",
      code: `const samples = [
  false, 0, -0, 0n, "", null, undefined, NaN,
  "0", "false", " ", [], {}, function () {}, Infinity, -1, Symbol("x"), 1n,
];

for (const v of samples) {
  const label = typeof v === "bigint" ? v + "n"
    : typeof v === "symbol" ? "Symbol()"
    : typeof v === "function" ? "function"
    : Object.is(v, -0) ? "-0"
    : typeof v === "string" ? "'" + v + "'"
    : Array.isArray(v) ? "[]"
    : (typeof v === "object" && v !== null) ? "{}"
    : String(v);
  console.log(label.padEnd(10), "->", Boolean(v));
}`,
    },
    {
      label: "&&, ||, ?? এর operand ফেরত দেওয়া",
      code: `console.log(0 || "default", 0 ?? "default");
console.log("" || "fallback", "" ?? "fallback");
console.log(null || "x", undefined ?? "y");
console.log(5 && "ok", 0 && "ok");

const user = { name: "Rina" };
console.log(user.address && user.address.city);
console.log(user.address?.city ?? "Unknown");`,
    },
    {
      label: "String থেকে boolean — ফাঁদ",
      code: `const fromStorage = "false";
console.log(Boolean(fromStorage));
console.log(fromStorage === "true");

function parseBool(s) {
  return String(s).trim().toLowerCase() === "true";
}
console.log(parseBool("true"), parseBool("false"), parseBool(" TRUE "), parseBool(undefined));

console.log(!!new Boolean(false));
console.log(!!Boolean(false));`,
    },
    {
      label: "Array খালি কি না — সঠিক উপায়",
      code: `const items = [];
if (items) console.log("[] truthy হওয়ায় এটি চলে");
if (items.length) console.log("এটি চলে না");
if (items.length > 0) console.log("এটিও চলে না");

const maybe = undefined;
console.log(maybe?.length > 0);
console.log((maybe ?? []).length > 0);

const nonEmpty = [0];
console.log(nonEmpty.length > 0, Boolean(nonEmpty[0]));`,
    },
  ],

  debugging: [
    {
      title: "`if (count)` যেখানে `0` বৈধ মান",
      bad: `function showCount(count) {
  return count ? count + " items" : "no data";
}
console.log(showCount(0));`,
      why: "`0` falsy, তাই `0 items` লেখার বদলে ‘no data’ আসছে। অথচ শূন্য একটি সম্পূর্ণ বৈধ ও অর্থপূর্ণ ফল। ‘মান নেই’ আর ‘মান শূন্য’ আলাদা — truthiness এ দুটিকে একই ধরা হয়।",
      fix: `function showCount(count) {
  return count === undefined ? "no data" : count + " items";
}
console.log(showCount(0));`,
    },
    {
      title: "খালি array কে falsy ভাবা",
      bad: `const results = [];
if (results) {
  console.log("found results");
} else {
  console.log("no results");
}`,
      why: "`[]` একটি object, আর object সবসময় truthy — তাই শর্ত সবসময় সত্য হয়। আসলে জানতে চাই array তে আইটেম আছে কি না, যার জন্য `length` দেখতে হয়।",
      fix: `const results = [];
if (results.length > 0) {
  console.log("found results");
} else {
  console.log("no results");
}`,
    },
    {
      title: "`'false'` string কে boolean ধরা",
      bad: `const enabledFlag = "false";   // ধরুন localStorage/env থেকে এসেছে
if (enabledFlag) {
  console.log("feature enabled");
} else {
  console.log("feature disabled");
}`,
      why: "`'false'` অ-খালি string, তাই truthy। localStorage, URL query ও env variable সবসময় string — তাই boolean এ রূপান্তর স্পষ্টভাবে করতে হবে।",
      fix: `const enabledFlag = "false";
if (enabledFlag === "true") {
  console.log("feature enabled");
} else {
  console.log("feature disabled");
}`,
    },
    {
      title: "`filter(Boolean)` এ বৈধ `0` হারানো",
      bad: `const scores = [0, 5, null, 8, 0, undefined];
console.log(scores.filter(Boolean));`,
      why: "`filter(Boolean)` সব falsy মুছে ফেলে — `0` ও। কিন্তু `0` নম্বরটি একটি বৈধ score। আপনি চেয়েছিলেন শুধু ‘অনুপস্থিত’ (`null`/`undefined`) বাদ দিতে।",
      fix: `const scores = [0, 5, null, 8, 0, undefined];
console.log(scores.filter((s) => s != null));`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "Boolean রূপান্তর print করুন",
      prompt: "`values` এর প্রতিটি মানকে `Boolean` এ রূপান্তর করে এক লাইনে print করুন: `true true false false`।",
      starter: `const values = ["0", [], 0, ""];
// TODO: প্রতিটির Boolean মান এক লাইনে print করুন`,
      expected: "true true false false",
      hints: ["`values.map(Boolean)` একটি array দেয়।", "spread দিয়ে `console.log(...arr)` লিখলে space দিয়ে এক লাইনে আসে।"],
      solution: `const values = ["0", [], 0, ""];
console.log(...values.map(Boolean));`,
    },
    {
      level: "beginner",
      title: "!! দিয়ে boolean এ রূপান্তর",
      prompt: "`name` খালি string। `hasName` এ `name` এর boolean রূপ (`false`) রেখে print করুন।",
      starter: `const name = "";
let hasName;
// TODO: hasName এ boolean বসান
console.log(hasName);`,
      expected: "false",
      hints: ["`!!value` বা `Boolean(value)`।"],
      solution: `const name = "";
let hasName = !!name;
console.log(hasName);`,
    },
    {
      level: "beginner",
      title: "খালি array যাচাই ঠিক করুন",
      prompt: "কোডটি ভুলভাবে `has items` print করে। শর্ত বদলে `empty` print করান।",
      starter: `const items = [];
if (items) {
  console.log("has items");
} else {
  console.log("empty");
}`,
      expected: "empty",
      hints: ["`[]` truthy। কোন property তে আইটেম সংখ্যা থাকে?"],
      solution: `const items = [];
if (items.length > 0) {
  console.log("has items");
} else {
  console.log("empty");
}`,
    },
    {
      level: "intermediate",
      title: "filter(Boolean) দিয়ে সাফ করা",
      prompt: "`raw` থেকে সব falsy মান বাদ দিয়ে শুধু বাকিগুলো print করুন: `[ 'a', 'b', 'c' ]`।",
      starter: `const raw = ["a", "", "b", null, "c", undefined];
const clean = raw; // TODO
console.log(clean);`,
      expected: "[ 'a', 'b', 'c' ]",
      hints: ["`Array.prototype.filter` এ `Boolean` function কে predicate হিসেবে দেওয়া যায়।"],
      solution: `const raw = ["a", "", "b", null, "c", undefined];
const clean = raw.filter(Boolean);
console.log(clean);`,
      explanation: "`filter(Boolean)` প্রতিটি element এ `Boolean(el)` চালায়; falsy হলে বাদ পড়ে। এখানে `''`, `null`, `undefined` বাদ গেছে। সতর্কতা: `0` ও বাদ যেত।",
    },
    {
      level: "intermediate",
      title: "`0` হারানো label ঠিক করুন",
      prompt: "`label(0)` এখন `no items` দেয়। শুধু একটি operator বদলে `0 items 3 items` print করান।",
      starter: `function label(n) {
  return (n || "no") + " items";
}
console.log(label(0), label(3));`,
      expected: "0 items 3 items",
      hints: ["`0` falsy, কিন্তু `null`/`undefined` নয়।", "কোন operator শুধু null/undefined এ fallback দেয়?"],
      solution: `function label(n) {
  return (n ?? "no") + " items";
}
console.log(label(0), label(3));`,
      explanation: "`n || 'no'` এ `0` falsy হওয়ায় `'no'` বসে। `n ?? 'no'` শুধু `null`/`undefined` এ বদলায়, তাই `0` অক্ষত থাকে।",
    },
    {
      level: "challenge",
      title: "Form validation: বৈধ শূন্য হারাবেন না",
      prompt:
        "`validate(form)` ঠিক করুন। নিয়ম: `name` এ কমপক্ষে একটি non-space অক্ষর থাকতে হবে (নইলে `'name required'`), `age` যেকোনো সংখ্যা (`0` সহ) বৈধ — `undefined`, `null` বা `NaN` হলে `'age required'`। বর্তমান কোডে `age: 0` ভুলভাবে ব্যর্থ হচ্ছে।",
      starter: `function validate(form) {
  const errors = [];
  if (!form.name || !form.name.trim()) errors.push("name required");
  if (!form.age) errors.push("age required");
  return errors;
}

console.log(validate({ name: "Rina", age: 0 }));
console.log(validate({ name: "  ", age: 25 }));
console.log(validate({ name: "Karim" }));
console.log(validate({ name: "", age: NaN }));`,
      expected: "[]\n[ 'name required' ]\n[ 'age required' ]\n[ 'name required', 'age required' ]",
      hints: ["`!form.age` এ `0` ও `NaN` দুটিই falsy — কিন্তু শুধু `NaN` ব্যর্থ হওয়া উচিত।", "`form.age == null || Number.isNaN(form.age)` দিয়ে শুধু ‘অনুপস্থিত বা অকার্যকর’ ধরুন।"],
      solution: `function validate(form) {
  const errors = [];
  if (!form.name || !form.name.trim()) errors.push("name required");
  if (form.age == null || Number.isNaN(form.age)) errors.push("age required");
  return errors;
}

console.log(validate({ name: "Rina", age: 0 }));
console.log(validate({ name: "  ", age: 25 }));
console.log(validate({ name: "Karim" }));
console.log(validate({ name: "", age: NaN }));`,
      explanation: "`name` এর জন্য truthiness যথেষ্ট (খালি string ও `undefined` falsy) এবং space-only ধরতে `trim()` ব্যবহার হয়েছে। `age` এ `0` বৈধ, তাই `!form.age` এর বদলে স্পষ্ট শর্ত: `== null` (null ও undefined) বা `Number.isNaN`।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "নিচের কোনটি **truthy**?",
        options: ["`0n`", "`'0'`", "`-0`", "`NaN`"],
        answer: 1,
        explanation:
          "`'0'` একটি অ-খালি string, তাই truthy — string এর truthiness শুধু দৈর্ঘ্য দেখে, অর্থ নয়। `0n` (BigInt শূন্য), `-0` ও `NaN` সবই falsy তালিকার সদস্য।",
      },
      {
        question: "`console.log([] ? 'A' : 'B', [].length ? 'A' : 'B')` কী print করবে?",
        options: ["`A A`", "`B B`", "`B A`", "`A B`"],
        answer: 3,
        explanation:
          "`[]` একটি object, তাই truthy → `'A'`। `[].length` হলো `0`, যা falsy → `'B'`। ফল `A B`। `A A` হতো যদি length কে truthy ভাবা হতো; `B B` বা `B A` হতো যদি খালি array কে falsy ধরা হতো — যা ভুল।",
      },
      {
        question: "`console.log([0, 1, '', 'a', null].filter(Boolean))` কী print করবে?",
        options: ["`[ 1, 'a' ]`", "`[ 0, 1, '', 'a' ]`", "`[ 1, 'a', null ]`", "`[ 0, 1, 'a' ]`"],
        answer: 0,
        explanation:
          "`Boolean` predicate হিসেবে সব falsy বাদ দেয়: `0`, `''` ও `null` বাদ যায়; থাকে `1` ও `'a'`। অন্য অপশনগুলোতে হয় `0` রাখা হয়েছে (যা falsy), নয়তো `null` রাখা হয়েছে।",
      },
      {
        question: "`if (new Boolean(false)) { ... }` — ব্লকটি কি চলবে?",
        options: ["না, কারণ ভেতরের মান `false`", "TypeError হবে", "হ্যাঁ, কারণ wrapper একটি object এবং object truthy", "শুধু strict mode এ চলবে"],
        answer: 2,
        explanation:
          "`new Boolean(false)` একটি Boolean **wrapper object**, primitive `false` নয়। ToBoolean এ সব object `true`, ভেতরের মান যাই হোক। তাই ব্লক চলে। TypeError বা strict mode এর সাথে এর কোনো সম্পর্ক নেই।",
      },
      {
        question: "`console.log(!!'false')` এর ফল কী?",
        options: ["`false`", "`true`", "`'false'`", "`undefined`"],
        answer: 1,
        explanation:
          "`'false'` অ-খালি string, তাই truthy; `!` দিলে `false`, আবার `!` দিলে `true`। `!` সবসময় boolean ফেরত দেয়, তাই `'false'` (string) বা `undefined` আসা সম্ভব নয়। ‘`false`’ ভাবলে string এর অর্থ দেখে ভুল করা হচ্ছে।",
      },
    ],
    coding: [
      {
        title: "কতগুলো truthy?",
        prompt: "`countTruthy(arr)` লিখুন যা array তে কতগুলো truthy মান আছে তার সংখ্যা ফেরত দেয়। দেওয়া array র জন্য `4` print করুন।",
        starter: `function countTruthy(arr) {
  // TODO
  return 0;
}
console.log(countTruthy([0, 1, "", "a", null, [], {}, NaN]));`,
        expected: "4",
        solution: `function countTruthy(arr) {
  return arr.filter(Boolean).length;
}
console.log(countTruthy([0, 1, "", "a", null, [], {}, NaN]));`,
      },
      {
        title: "isEmpty — শূন্য ‘খালি’ নয়",
        prompt: "`isEmpty(v)` লিখুন: `null`/`undefined`, খালি string, খালি array ও কী-হীন object এর জন্য `true`; অন্য সবকিছুর (যেমন `0`, `false`, `[0]`) জন্য `false`। ছয়টি মানের ফল এক লাইনে print করুন।",
        starter: `function isEmpty(v) {
  return !v; // TODO: ভুল — 0 ও [] ঠিকমতো সামলায় না
}
console.log(isEmpty([]), isEmpty(""), isEmpty({}), isEmpty(0), isEmpty(null), isEmpty([0]));`,
        expected: "true true true false true false",
        solution: `function isEmpty(v) {
  if (v == null) return true;
  if (typeof v === "string" || Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v).length === 0;
  return false;
}
console.log(isEmpty([]), isEmpty(""), isEmpty({}), isEmpty(0), isEmpty(null), isEmpty([0]));`,
      },
    ],
  },

  interview: [
    {
      q: "JavaScript এ falsy মান কী কী? বাকিগুলো সম্পর্কে কী বলা যায়?",
      a: "Falsy মান ঠিক আটটি: `false`, `0`, `-0`, `0n` (BigInt শূন্য), `''` (খালি string), `null`, `undefined`, `NaN`। এছাড়া Browser এ legacy `document.all` falsy ধরা হয় (Annex B ব্যতিক্রম, Node.js এ নেই)।\n\nএই তালিকার বাইরে **সবকিছু truthy** — `'0'`, `'false'`, `' '`, `[]`, `{}`, function, `Symbol()`, `Infinity`, `-1`, এমনকি `new Boolean(false)` (wrapper object)। এটি মনে রাখার সুবিধা: ‘আটটি জানলেই বাকি সব truthy’ — আলাদা করে truthy তালিকা মুখস্থ করতে হয় না।",
    },
    {
      q: "`if (x)` এর ভেতরে engine কী করে? ToBoolean কী?",
      a: "`if`, `while`, ternary, `!` এবং `&&`/`||` এর বাঁদিকের operand এ engine spec এর অভ্যন্তরীণ **ToBoolean** অপারেশন চালায়। নিয়ম type ভেদে: `undefined`/`null` → `false`; boolean → নিজে; number → `0`, `-0`, `NaN` হলে `false`; string → খালি হলে `false`; bigint → `0n` হলে `false`; symbol → `true`; object → সবসময় `true`।\n\nআমরা এই রূপান্তর স্পষ্টভাবে `Boolean(x)` বা `!!x` দিয়ে ঘটাতে পারি। লক্ষ্য রাখুন: এটি `==` এর রূপান্তর (boolean → number) থেকে আলাদা। তাই `[]` truthy, কিন্তু `[] == false` ও `true`।",
    },
    {
      q: "`if (arr)` ও `if (arr.length)` এর পার্থক্য কী? কোনটি ভালো?",
      a: "`arr` একটি array হলে সর্বদাই truthy (object), খালি হলেও। তাই `if (arr)` শুধু ‘`arr` অ-null/undefined’ যাচাই করে, ‘আইটেম আছে কি না’ নয়। `arr.length` একটি number; `0` হলে falsy, তাই `if (arr.length)` কাজ করে।\n\nপাঠযোগ্যতার জন্য `arr.length > 0` আরও স্পষ্ট ও পছন্দের। `arr` `undefined`/`null` হতে পারলে `arr?.length > 0` (`undefined > 0` হলো `false`) অথবা `(arr ?? []).length > 0`। মনে রাখবেন, array এর element ও `0`/`''` থাকলেও array নিজে ‘non-empty’ — তাই element এর truthiness আর array এর খালিত্ব আলাদা প্রশ্ন।",
    },
    {
      q: "`filter(Boolean)` কীভাবে কাজ করে? এর সতর্কতা কী?",
      a: "`Boolean` একটি function, যা একটি argument নিয়ে তার ToBoolean ফল ফেরত দেয়। `arr.filter(Boolean)` তাই প্রতিটি element এ `Boolean(element)` চালিয়ে শুধু truthy গুলো রাখে — `null`, `undefined`, `''` ছাঁটার জনপ্রিয় সংক্ষিপ্ত উপায়।\n\nসতর্কতা: এটি **সব** falsy মুছে — `0`, `false`, `NaN`ও। বৈধ সংখ্যা (score, quantity) থাকলে `0` হারিয়ে যায়। তখন স্পষ্ট predicate লিখুন: `filter((v) => v != null && v !== '')`। এছাড়া TypeScript এ `filter(Boolean)` এর type narrowing ভালো কাজ না-ও করতে পারে (সংস্করণ নির্ভর) — তাই কখনো type guard function লাগে।",
    },
    {
      q: "`[] == false` সত্য হওয়া সত্ত্বেও `if ([])` চলে কেন?",
      a: "দুটি ভিন্ন রূপান্তর algorithm। `if ([])` ToBoolean ব্যবহার করে — object সবসময় `true`, তাই ব্লক চলে। কিন্তু `[] == false` loose equality: boolean আগে number এ রূপান্তর (`false → 0`), তারপর `[] == 0` তে `[]` কে `ToPrimitive` করে `''`, আর `'' == 0` → `0 == 0` → `true`।\n\nশিক্ষা: **truthiness যাচাইতে `== true/false` কখনো ব্যবহার করবেন না**। শর্তের জন্য সরাসরি `if (x)` বা `if (!x)` লিখুন; নির্দিষ্ট boolean চাইলে `=== true`। এই পার্থক্য ইন্টারভিউয়ের অন্যতম জনপ্রিয় প্রশ্ন, কারণ এটি দুটি অভ্যন্তরীণ অপারেশনের পার্থক্য বোঝায়।",
    },
    {
      q: "Truthy/falsy নিয়ে কোন কোন বাস্তব bug দেখা যায় এবং কীভাবে এড়ান?",
      a: "(১) **`0` হারানো** — `qty || 1` বা `if (count)` এ বৈধ `0` ‘নেই’ ধরা পড়ে; সমাধান `??` ও স্পষ্ট `!== undefined`। (২) **খালি array/object truthy** — `if (list)` সবসময় সত্য; সমাধান `.length > 0`, `Object.keys(o).length`। (৩) **string `'false'`/`'0'`** — storage, query, env এ boolean আসলে string; সমাধান `=== 'true'` বা schema দিয়ে parse। (৪) **React এ `{n && <X/>}`** এ `0` render হওয়া; সমাধান `n > 0 && ...` বা ternary। (৫) **`filter(Boolean)`** এ `0` মোছা। (৬) **নিরাপত্তা** — `if (user.isAdmin)` এ string `'false'` truthy হয়ে যাওয়া।\n\nসাধারণ নীতি: যেখানে ‘অনুপস্থিত’ ও ‘শূন্য/খালি’ আলাদা অর্থ বহন করে, সেখানে truthiness এর বদলে স্পষ্ট তুলনা (`=== undefined`, `== null`, `> 0`, `=== ''`) ব্যবহার করুন।",
    },
  ],

  summary: {
    takeaways: [
      "Falsy মাত্র আটটি: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN` (Browser এ legacy `document.all` ও) — বাকি সব truthy।",
      "`'0'`, `'false'`, `' '`, `[]`, `{}`, function, `new Boolean(false)` সবই truthy; object সবসময় truthy।",
      "`if`, `while`, `?:`, `!`, `&&`/`||` এ engine ভেতরে ToBoolean চালায়; `!!x` ও `Boolean(x)` একই কাজ।",
      "ToBoolean ও `==` এর রূপান্তর আলাদা: `[]` truthy, কিন্তু `[] == false`ও সত্য; truthiness এ `== true/false` ব্যবহার করবেন না।",
      "বৈধ `0`/`''` যেখানে সম্ভব, সেখানে `||`/`if (x)` এর বদলে `??` বা স্পষ্ট তুলনা; array খালি কি না → `.length > 0`।",
      "`filter(Boolean)` সুবিধাজনক কিন্তু `0` ও `false` ও মুছে ফেলে; boolean এ আসা string (`'false'`) কে স্পষ্টভাবে parse করুন।",
    ],
    syntax: `if (value) { }          // ToBoolean(value)
!!value                 // boolean এ রূপান্তর
Boolean(value)          // একই
value || fallback       // falsy হলে fallback
value ?? fallback       // শুধু null/undefined হলে
arr.length > 0          // array তে আইটেম আছে কি না
arr.filter(Boolean)     // সব falsy বাদ`,
    whenToUse: [
      "‘মান আছে কি না’ এর সহজ যাচাইতে (`if (name)`) — যখন `0`/`''` অবৈধ হিসেবে ধরা নিরাপদ।",
      "শর্তের জন্য সরাসরি truthiness; boolean এ রূপান্তর চাইলে `!!` বা `Boolean()`।",
      "`0`, `''`, `false` বৈধ হতে পারে এমন ডিফল্টে `??`; স্পষ্ট `=== undefined`/`== null`।",
      "Array/object এর খালিত্ব: `.length > 0`, `Object.keys(o).length`।",
      "নিরাপত্তা ও validation এ truthiness ভরসা না করে স্পষ্ট type ও মান যাচাই।",
    ],
    next: ["Type Conversion ও Coercion", "Equality: `==` বনাম `===`", "Conditionals: `if`, `switch`", "Arrays ও `filter`/`some`/`every`"],
  },

  compatibility:
    "ToBoolean এর নিয়ম ECMAScript spec এ নির্ধারিত; Browser ও Node.js এ একই। শুধু Browser এ legacy `document.all` falsy object — Node.js এ নেই, এবং আধুনিক কোডে এর ওপর নির্ভর করা হয় না। `0n` (BigInt) ES2020 — Node 10.4+ ও আধুনিক সব browser এ। `??` ES2020, `?.` ES2020 (Node 14+)। এই Playground browser-like Web Worker এ চলে, তাই `document` নেই।",
};
