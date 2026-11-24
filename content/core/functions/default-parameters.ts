import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Default parameter এর syntax লিখতে এবং কখন এটি trigger হয় (শুধু `undefined`) তা নির্ভুলভাবে বলতে পারবেন।",
    "Default মান **প্রতিটি call এর সময়** evaluate হয় — তাই প্রতি call এ নতুন object/array তৈরি হয় — এই আচরণ এবং Python এর mutable-default trap এর সাথে পার্থক্য বুঝবেন।",
    "আগের parameter পরের default এ ব্যবহার, function call/expression default, এবং parameter তালিকার TDZ নিয়ম প্রয়োগ করতে পারবেন।",
    "Throwing default দিয়ে ‘বাধ্যতামূলক parameter’ বানাতে এবং destructuring এর সাথে `{ a = 1 } = {}` pattern লিখতে পারবেন।",
    "Default parameter বনাম body র ভেতরে `||` / `??` fallback এর সঠিক ব্যবহার বেছে নিতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Default parameter কী এবং কেন দরকার?" },
    {
      type: "p",
      text: "আগের lesson এ দেখেছি, argument না দিলে parameter পায় `undefined`, এবং সেই `undefined` পরে `NaN` বা `'undefined, Rina'` এর মতো bug হয়ে ফেরে। **Default parameter** (ES2015) এর সমাধান: parameter এর পাশে `=` দিয়ে একটি ডিফল্ট মান লিখে দেওয়া — argument না এলে সেই মান ব্যবহৃত হয়। `function greet(name = 'Guest') {}`।",
    },
    {
      type: "p",
      text: "ES2015 এর আগে এর জন্য function এর ভেতরে লেখা হতো `name = name || 'Guest'`। সেই pattern এ `0`, `''`, `false` ও ‘মিসিং’ ধরা হতো — সূক্ষ্ম bug এর উৎস (নিচে বিস্তারিত)। Default parameter এ এটি সোজা, পরিষ্কার এবং signature এই function এর ‘চুক্তি’ দেখিয়ে দেয়।",
    },
    {
      type: "code",
      code: "function greet(name = 'Guest', greeting = 'Hello') {\n  return greeting + ', ' + name;\n}\n\ngreet();               // 'Hello, Guest'\ngreet('Rina');         // 'Hello, Rina'\ngreet(undefined, 'Hi'); // 'Hi, Guest' — মাঝেরটি বাদ দিতে undefined",
      caption: "Concept ব্যাখ্যার snippet। চালিয়ে দেখতে নিচের Examples ও Playground ব্যবহার করুন।",
    },
    { type: "h3", text: "Trigger শর্ত: শুধুমাত্র `undefined`" },
    {
      type: "p",
      text: "এটিই সবচেয়ে গুরুত্বপূর্ণ নিয়ম। Default তখনই কাজ করে যখন parameter এর মান **`undefined`** — অর্থাৎ হয় argument দেওয়া হয়নি, নয়তো স্পষ্টভাবে `undefined` পাঠানো হয়েছে। `null`, `0`, `''` (খালি string), `false`, `NaN` — এগুলো ‘বৈধ মান’, তাই default **ট্রিগার করে না**। `null` প্রায়ই API response এ ‘মান নেই’ বোঝাতে আসে — তাই `greet(null)` এ `'Hello, null'` পাওয়া খুবই সাধারণ বিভ্রান্তি।",
    },
    {
      type: "compare",
      headers: ["Argument", "Default `x = 10` কাজ করে?", "ফল"],
      rows: [
        ["(কিছুই না)", "হ্যাঁ", "`10`"],
        ["`undefined`", "হ্যাঁ", "`10`"],
        ["`null`", "না", "`null`"],
        ["`0`", "না", "`0`"],
        ["`''` (খালি string)", "না", "`''`"],
        ["`false`", "না", "`false`"],
        ["`NaN`", "না", "`NaN`"],
      ],
    },
    { type: "h3", text: "Default মান call এর সময় evaluate হয় — প্রতিবার" },
    {
      type: "p",
      text: "Default expression function **define** করার সময় নয়, প্রতিটি **call** এ (এবং কেবল তখনই, যখন সেটি দরকার) evaluate হয়। এর দুটি গুরুত্বপূর্ণ ফল আছে: (১) `function f(list = [])` এ প্রতি call এ **নতুন** খালি array তৈরি হয় — দুই call এর মধ্যে কিছু ভাগ হয় না। (২) `function f(id = generateId())` এ `generateId()` শুধু তখনই চলে যখন argument দেওয়া হয়নি; argument দিলে function টি **ডাকাই হয় না** (lazy evaluation)।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Python এর mutable default trap এখানে নেই",
      text: "Python এ `def f(items=[])` এর default মান সাধারণত function define করার সময় **একবার** তৈরি হয় এবং সব call এ ভাগ হয় — তাই একটি call এ list এ যোগ করলে পরের call এ সেটি থেকে যায়। JavaScript এ ঠিক উল্টো: প্রতি call এ expression আবার চলে। তবে যদি default হিসেবে **বাইরে তৈরি করা** একটি object (`opts = SHARED_DEFAULTS`) দেন, তাহলে সেই একই object ই প্রতিবার আসবে — সমস্যা তখন আপনারই তৈরি। ‘fresh per call’ নিয়ম তখনই খাটে যখন object টি default expression এর **ভেতরেই** তৈরি হয় (`= []`, `= {}`, `= createDefaults()`)।",
    },
    { type: "h3", text: "আগের parameter, expression ও function call default" },
    {
      type: "p",
      text: "Default যেকোনো expression হতে পারে — literal, function call, arrow function, এমনকি **আগের parameter** এর উল্লেখ। Parameter গুলো বাম থেকে ডানে একে একে initialize হয়, তাই `function f(w, h = w)` বৈধ: `h` এর default হিসেবে `w` পাওয়া যায়। কিন্তু উল্টোটি (`function f(a = b, b = 2)`) `ReferenceError`, কারণ `a` এর default evaluate হওয়ার সময় `b` এখনো initialize হয়নি — এটি `let` এর **Temporal Dead Zone** (Variables lesson) এর মতোই আচরণ।",
    },
    {
      type: "ul",
      items: [
        "**আগের parameter**: `function box(w, h = w) {}` — square এর জন্য সুবিধাজনক।",
        "**Function call**: `function log(msg, time = getTime()) {}` — প্রতি call এ তাজা মান; argument দিলে `getTime` ডাকা হয় না।",
        "**বাইরের variable/const**: `function f(retries = DEFAULT_RETRIES) {}` — call এর সময় বাইরের scope থেকে খুঁজে নেয়।",
        "**Arrow function default**: `function f(cb = () => {}) {}` — optional callback এর জন্য নিরাপদ no-op, যাতে `cb()` ডাকতে `if (cb)` লাগে না।",
      ],
    },
    { type: "h3", text: "Parameter scope (ধারণাগত দৃষ্টিতে)" },
    {
      type: "p",
      text: "সাধারণভাবে বলা যায়, যখন কোনো function এ default (বা অন্য parameter expression) থাকে, তখন language spec parameter গুলোর জন্য একটি আলাদা scope তৈরি করে, এবং function body র `var`/`let` declaration গুলো (সাধারণভাবে) তার ভেতরের আলাদা scope এ থাকে। এর একটি দৃশ্যমান ফল: default expression এর ভেতরের closure body র ভেতরের local variable দেখতে পায় না — শুধু parameter ও বাইরের scope দেখে। রোজকার কোডে এটি খুব কমই আঘাত করে; মনে রাখার মতো কথা হলো ‘default expression body র আগে, parameter scope এ evaluate হয়’। সূক্ষ্ম নিয়মের জন্য ECMAScript spec এর FunctionDeclarationInstantiation অংশ দেখুন।",
    },
    { type: "h3", text: "বাধ্যতামূলক parameter: throwing default" },
    {
      type: "p",
      text: "যেহেতু default lazy ভাবে call এ evaluate হয়, এটিকে ‘মিসিং হলে error’ বানানো যায়: একটি helper লিখুন যা error ছোঁড়ে, এবং সেটিকে default হিসেবে দিন — `function f(id = required('id')) {}`। Argument থাকলে helper ডাকাই হয় না; না থাকলে সাথে সাথে পরিষ্কার error আসে। এটি TypeScript এর ‘required parameter’ এর runtime সংস্করণ।",
    },
    {
      type: "code",
      code: "function required(name) {\n  throw new TypeError(name + ' is required');\n}\n\nfunction getUser(id = required('id')) {\n  return { id };\n}\n\ngetUser(7);   // required() ডাকাই হয় না\ngetUser();    // TypeError: id is required",
      caption: "Concept ব্যাখ্যার snippet (Examples এ চালিয়ে দেখানো আছে)।",
    },
    { type: "h3", text: "Destructuring এর সাথে default" },
    {
      type: "p",
      text: "Destructured parameter এ দুই স্তরের default থাকতে পারে: প্রতিটি property র নিজস্ব default (`{ page = 1 }`) এবং পুরো parameter এর default (`= {}`)। দ্বিতীয়টি ছাড়া `fn()` (argument ছাড়া) এ `undefined` কে destructure করতে গিয়ে **TypeError** হয়, কারণ `undefined` থেকে property পড়া যায় না। তাই options-object pattern এর প্রচলিত রূপ: `function f({ a = 1, b = 2 } = {}) {}`। React component এর `function Button({ variant = 'primary', disabled = false })` এ প্রতিটি prop এর default একই কাজ করে। (Default এখানেও শুধু `undefined` এ কাজ করে — prop এ `null` এলে `null`ই থাকবে।)",
    },
    { type: "h3", text: "Default parameter বনাম `||` / `??` fallback" },
    {
      type: "p",
      text: "Body র ভেতরে `const v = value || 50` এবং `const v = value ?? 50` দুটিই fallback দেয়, কিন্তু আচরণ আলাদা। (Operators lesson এ `||` ও `??` এর পার্থক্য দেখেছি।) `||` যেকোনো **falsy** মান (`0`, `''`, `false`, `NaN`, `null`, `undefined`) এ fallback নেয়; `??` কেবল **`null` ও `undefined`** এ; আর default parameter কেবল **`undefined`** এ।",
    },
    {
      type: "compare",
      headers: ["মান", "`v || 50`", "`v ?? 50`", "`v = 50` (default param)"],
      rows: [
        ["`undefined`", "`50`", "`50`", "`50`"],
        ["`null`", "`50`", "`50`", "`null`"],
        ["`0`", "`50` (!)", "`0`", "`0`"],
        ["`''`", "`50` (!)", "`''`", "`''`"],
        ["`false`", "`50` (!)", "`false`", "`false`"],
      ],
    },
    {
      type: "p",
      text: "কোনটি কখন: ‘শুধু argument না দিলে’ — default parameter। ‘`null` ও মিসিং দুটোই একই ভাবে সামলাতে চাই (যেমন API থেকে আসা `null`)’ — body তে `??` (বা default parameter এর সাথে `value ?? fallback`)। `||` কেবল তখনই যখন সত্যিই ‘খালি/falsy হলেই বদলাও’ চান — যেমন খালি string এ placeholder দেখানো।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "সাধারণ ভুল ধারণা (Common misconceptions)",
      text: "(১) ‘`null` দিলেও default আসবে’ — না, শুধু `undefined`। (২) ‘Default মান একবারই বানানো হয়’ — না (Python এর সাথে গুলিয়ে ফেলবেন না); প্রতি call এ। (৩) ‘`fn.length` default parameter সহ সব parameter গোনে’ — না, প্রথম default এ এসে থেমে যায়। (৪) ‘`function f(a = b, b = 1)` চলে’ — না, TDZ এর `ReferenceError`। (৫) ‘`function f({ a = 1 })` argument ছাড়াও চলবে’ — না, `= {}` লাগে।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "ব্যবহারের নিয়ম",
      text: "ঐচ্ছিক parameter সবসময় বাধ্যতামূলক গুলোর **পরে** রাখুন (`f(id, opts = {})`), নইলে মাঝেরটি বাদ দিতে `undefined` দিতে হয়। Object/array default inline তৈরি করুন (`= []`), বাইরের shared object নয়। বেশি ঐচ্ছিক মান হলে একটি destructured options object এ সবগুলোর default দিন।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "একটি **চায়ের দোকানের অর্ডার** কল্পনা করুন। দোকানদারের নিয়ম: ‘চিনি কতটুকু — না বললে **২ চামচ**’। এই ‘না বললে ২ চামচ’ হলো **default parameter**।",
    },
    {
      type: "ul",
      items: [
        "আপনি কিছু না বললে (argument নেই) বা ‘যা খুশি’ (`undefined`) বললে দোকানদার ২ চামচ দেয় — default কাজ করে।",
        "আপনি ‘**০ চামচ**’ বললে দোকানদার সেটি **স্পষ্ট নির্দেশ** হিসেবে মানে; ২ চামচ দেয় না। এটাই `0` এ default না চলা। `||` ওয়ালা দোকানদার ‘০’ কে ‘কিছুই বলেননি’ ভেবে ভুল করে ২ চামচ দিত — এটাই পুরোনো `x || 2` bug।",
        "‘**না**, চিনি চাই না’ (`null`) বললেও সেটি একটি স্পষ্ট উত্তর — দোকানদার default ব্যবহার করে না। (`??` ওয়ালা দোকানদার এটিকে ‘বলেননি’ ধরে ২ চামচ দেয়।)",
        "‘২ চামচ’ প্রতিটি কাপ বানানোর সময় **নতুন করে মেপে** নেওয়া হয় (call-time evaluation)। দিনের শুরুতে একবার মেপে একটি বাটিতে রেখে সবাইকে সেই একই বাটি থেকে দেওয়া হয় না — তাই এক কাপের চিনি অন্য কাপে মিশে যায় না (Python এর shared-default trap এর বিপরীত)।",
        "‘চিনি না বললে **দুধের পরিমাণের সমান** চা পাতা’ — আগের parameter ব্যবহার করে পরের default; কিন্তু দুধ ঠিক করার আগে তার উপর নির্ভরশীল চা পাতার পরিমাণ জানতে চাইলে ঝামেলা (TDZ)।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "Default মান call এর সময়, lazy ভাবে evaluate হয়",
      caption: "`function f(list = makeList())` — দুটি call: `f()` এবং `f([9])`।",
      nodes: [
        { id: "call", label: "Call", sub: "f(...)" },
        { id: "check", label: "undefined?", sub: "argument যাচাই" },
        { id: "default", label: "Default expr", sub: "makeList()" },
        { id: "body", label: "Body", sub: "list ব্যবহার" },
      ],
      steps: [
        {
          active: ["call"],
          items: { call: ["f()   — argument নেই"] },
          note: "প্রথম call `f()`। `list` এর জন্য কোনো argument আসেনি।",
        },
        {
          active: ["check"],
          items: { check: ["list === undefined → হ্যাঁ"] },
          note: "Engine parameter এর মান যাচাই করে — `undefined`, তাই default লাগবে। (`null` বা `0` হলে এখানেই থেমে যেত।)",
        },
        {
          active: ["default"],
          items: { default: ["makeList() চলল", "→ নতুন [] (obj#A)"] },
          note: "Default expression **এই call এই** evaluate হলো, ফলে ‘নতুন’ array `obj#A` তৈরি হলো। আগের কোনো call এর array ব্যবহৃত হয়নি।",
        },
        {
          active: ["body"],
          items: { body: ["list = obj#A"] },
          note: "Body `obj#A` নিয়ে কাজ করে। Call শেষে এটি ফেলে দেওয়া হয়।",
        },
        {
          active: ["call", "check", "body"],
          items: { call: ["f([9])"], check: ["list === undefined → না"], body: ["list = [9] (caller এর array)"], default: [] },
          note: "দ্বিতীয় call `f([9])`: argument আছে, তাই check পার হয়ে সরাসরি body তে। Default expression (`makeList`) **ডাকাই হয়নি** — এটিই lazy evaluation।",
        },
      ],
    },
    {
      kind: "memory-steps",
      title: "Parameter বাম থেকে ডানে initialize হয়: f(1)",
      caption: "পরের default আগের parameter দেখতে পায়; উল্টোটা পায় না।",
      code: "function f(a, b = a * 2, c = b + 1) {\n  return [a, b, c];\n}\nf(1);",
      steps: [
        {
          line: 3,
          memory: [
            { name: "a", value: "", kind: "let", state: "tdz" },
            { name: "b", value: "", kind: "let", state: "tdz" },
            { name: "c", value: "", kind: "let", state: "tdz" },
          ],
          note: "`f(1)` call: parameter scope তৈরি হলো, কিন্তু parameter গুলো প্রাথমিকভাবে `let` এর মতো uninitialized (TDZ) অবস্থায়। এখান থেকে ক্রমানুসারে ভরা শুরু।",
        },
        {
          line: 0,
          memory: [
            { name: "a", value: "1", kind: "let", state: "live" },
            { name: "b", value: "", kind: "let", state: "tdz" },
            { name: "c", value: "", kind: "let", state: "tdz" },
          ],
          note: "প্রথম parameter `a` পেল argument `1`।",
        },
        {
          line: 0,
          memory: [
            { name: "a", value: "1", kind: "let", state: "live" },
            { name: "b", value: "2", kind: "let", state: "live" },
            { name: "c", value: "", kind: "let", state: "tdz" },
          ],
          note: "`b` এর argument নেই (`undefined`) → default `a * 2` evaluate: `a` ইতিমধ্যে live, তাই `2`।",
        },
        {
          line: 0,
          memory: [
            { name: "a", value: "1", kind: "let", state: "live" },
            { name: "b", value: "2", kind: "let", state: "live" },
            { name: "c", value: "3", kind: "let", state: "live" },
          ],
          note: "`c` এর default `b + 1`: `b` live, তাই `3`। যদি `b` এর default এ `c` লেখা হতো, তখন `c` TDZ তে থাকায় ReferenceError হতো।",
        },
        {
          line: 1,
          memory: [
            { name: "a", value: "1", kind: "let", state: "live" },
            { name: "b", value: "2", kind: "let", state: "live" },
            { name: "c", value: "3", kind: "let", state: "live" },
          ],
          output: "[ 1, 2, 3 ]",
          note: "সব parameter ready হওয়ার পর body চলে ও `[1, 2, 3]` ফেরত দেয়।",
        },
      ],
    },
    {
      kind: "memory-steps",
      title: "কোন মানে default কাজ করে: undefined বনাম null বনাম 0",
      code: "function f(x = 5) {\n  return x;\n}\nf(undefined);\nf(null);\nf(0);",
      steps: [
        {
          line: 3,
          memory: [{ name: "x", value: "5", kind: "let", state: "live" }],
          note: "`f(undefined)` — মান `undefined`, তাই default `5` নেওয়া হলো। (`f()` এ একই ঘটে।)",
        },
        {
          line: 4,
          memory: [{ name: "x", value: "null", kind: "let", state: "live" }],
          note: "`f(null)` — `null` একটি বৈধ মান, `undefined` নয়। default কাজ করে না; `x` হয় `null`।",
        },
        {
          line: 5,
          memory: [{ name: "x", value: "0", kind: "let", state: "live" }],
          note: "`f(0)` — `0` falsy কিন্তু `undefined` নয়, তাই `x` হয় `0`। `x || 5` লিখলে এখানে ভুলভাবে `5` আসত।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Default এবং কোন মানে এটি trigger হয়",
      description: "একই function কে `undefined`, `null`, `0`, `''` দিয়ে ডাকুন। কেবল প্রথম দুটি (না দেওয়া / `undefined`) default ট্রিগার করে।",
      code: `function show(x = "DEFAULT") {
  return x;
}

console.log(show());
console.log(show(undefined));
console.log(show(null));
console.log(show(0));
console.log(show(""));
console.log(show(false));

// মাঝের parameter বাদ দিতে undefined
function greet(name = "Guest", greeting = "Hello") {
  return greeting + ", " + name;
}
console.log(greet(undefined, "Hi"));`,
    },
    {
      level: "intermediate",
      title: "Call-time evaluation, আগের parameter ও Python trap এর বিপরীত",
      description: "`calls` গুনে দেখুন default expression কয়বার চলল। আর প্রতি call এ নতুন array কেন বাইরের shared array এর চেয়ে নিরাপদ তা দেখুন।",
      code: `let calls = 0;
function makeList() {
  calls++;
  return [];
}

function addItem(item, list = makeList()) {
  list.push(item);
  return list;
}

console.log(addItem("a"));        // নতুন list
console.log(addItem("b"));        // আবার নতুন list
const mine = ["x"];
console.log(addItem("c", mine));  // makeList ডাকা হয়নি
console.log("makeList calls:", calls);

// আগের parameter পরের default এ
function makeBox(width, height = width) {
  return { width, height };
}
console.log(makeBox(4), makeBox(4, 7));

// বাইরের shared object default দিলে সবাই একই object পায়
const SHARED = [];
function addShared(item, list = SHARED) {
  list.push(item);
  return list.length;
}
console.log(addShared("a"), addShared("b"));`,
    },
    {
      level: "real-world",
      title: "Query builder: required parameter, options default ও 0 এর নিরাপত্তা",
      description: "API client এর সাধারণ নকশা: `endpoint` বাধ্যতামূলক (throwing default), বাকি option destructured default সহ। লক্ষ্য করুন `limit: 0` default দিয়ে বদলে যায় না — `||` হলে বদলে যেত।",
      code: `function required(name) {
  throw new TypeError(name + " is required");
}

function buildQuery(endpoint = required("endpoint"), { page = 1, limit = 20, search = "" } = {}) {
  const parts = ["page=" + page, "limit=" + limit];
  if (search) parts.push("search=" + encodeURIComponent(search));
  return endpoint + "?" + parts.join("&");
}

console.log(buildQuery("/users"));
console.log(buildQuery("/users", { page: 3, search: "rina akter" }));
console.log(buildQuery("/users", { limit: 0 }));

try {
  buildQuery();
} catch (err) {
  console.log(err.name + ": " + err.message);
}

// তুলনা: পুরোনো || pattern এ 0 হারিয়ে যায়
function legacyLimit(limit) {
  return limit || 20;
}
console.log("legacy:", legacyLimit(0));`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
function power(base, exponent = 2) {
  return base ** exponent;
}
console.log(power(5));
console.log(power(2, 10));
`,
    },
    {
      label: "|| বনাম ?? বনাম default parameter",
      code: `function viaOr(v) { return v || 50; }
function viaNullish(v) { return v ?? 50; }
function viaDefault(v = 50) { return v; }

for (const input of [undefined, null, 0, "", false]) {
  console.log(
    String(input) === "" ? "(empty string)" : String(input),
    "| ||:", viaOr(input),
    "| ??:", viaNullish(input),
    "| default:", viaDefault(input)
  );
}`,
    },
    {
      label: "TDZ ও parameter scope",
      code: `// আগের parameter ঠিক আছে
function g(a = 1, b = a + 1) {
  return [a, b];
}
console.log(g(), g(10));

// পরের parameter আগে ব্যবহার = TDZ
try {
  (function (a = b, b = 2) { return a; })();
} catch (e) {
  console.log(e.name);
}

// default expression এর closure body র var দেখে না
const x = "outer";
function h(read = () => x) {
  var x = "body";
  return read();
}
console.log(h());`,
    },
    {
      label: "Destructuring + default",
      code: `function connect({ host = "localhost", port = 3000 } = {}) {
  return host + ":" + port;
}
console.log(connect());
console.log(connect({ port: 8080 }));
console.log(connect({ host: null }));   // null default ট্রিগার করে না

function noOuterDefault({ a = 1 }) { return a; }
try {
  noOuterDefault();
} catch (e) {
  console.log(e.name);
}
console.log(connect.length, noOuterDefault.length);`,
    },
  ],

  debugging: [
    {
      title: "null দিলেও default কাজ করে না",
      bad: `function greet(name = "Guest") {
  return "Hi " + name;
}
console.log(greet(null));`,
      why: "Default parameter শুধু `undefined` এ কাজ করে। `null` একটি স্পষ্ট মান, তাই `name` হয় `null` এবং string এ জুড়ে `'Hi null'` হয়। API response এ ‘মান নেই’ প্রায়ই `null` হয়ে আসে — সেক্ষেত্রে body তে `??` দিয়ে `null` ও `undefined` দুটোই সামলান।",
      fix: `function greet(name) {
  const safeName = name ?? "Guest";
  return "Hi " + safeName;
}
console.log(greet(null));
console.log(greet(undefined));
console.log(greet("Rina"));`,
    },
    {
      title: "পরের parameter আগের default এ ব্যবহার (TDZ)",
      bad: `function f(a = b, b = 2) {
  return [a, b];
}
console.log(f());`,
      why: "Parameter বাম থেকে ডানে initialize হয়। `a` এর default evaluate হওয়ার সময় `b` এখনো initialize হয়নি (TDZ), তাই `ReferenceError`। ক্রম বদলান — যে আগে লাগবে সেটি আগে রাখুন — অথবা `a` কে `b` এর উপর নির্ভরশীল না করুন।",
      fix: `function f(b = 2, a = b) {
  return [a, b];
}
console.log(f());`,
    },
    {
      title: "বাইরের shared object default — সব call একই object পায়",
      bad: `const DEFAULTS = { tags: [] };
function addTag(tag, opts = DEFAULTS) {
  opts.tags.push(tag);
  return opts.tags;
}
console.log(addTag("a"));
console.log(addTag("b"));`,
      why: "Default expression এ `DEFAULTS` একটি আগে-থেকে-তৈরি object এর **reference** মাত্র — প্রতি call এ সেই একই object আসে। ‘fresh per call’ কেবল তখনই যখন expression নিজেই নতুন object তৈরি করে। দ্বিতীয় call এ প্রথম call এর ডেটা জমে থাকে — Python এর mutable default trap এর মতো ফল।",
      fix: `function addTag(tag, opts = { tags: [] }) {
  opts.tags.push(tag);
  return opts.tags;
}
console.log(addTag("a"));
console.log(addTag("b"));`,
    },
    {
      title: "Destructured parameter এ `= {}` ভুলে যাওয়া",
      bad: `function connect({ host = "localhost", port = 3000 }) {
  return host + ":" + port;
}
console.log(connect());`,
      why: "Argument না দিলে parameter `undefined`, আর `undefined` কে `{ host, port }` এ destructure করা যায় না — `TypeError`। প্রতিটি property র default আছে বলে পুরো parameter এ সুরক্ষা আসে না। পুরো destructuring pattern এর পরে `= {}` দিন।",
      fix: `function connect({ host = "localhost", port = 3000 } = {}) {
  return host + ":" + port;
}
console.log(connect());`,
    },
    {
      title: "`||` fallback এ 0 হারিয়ে যায়",
      bad: `function setVolume(level) {
  const volume = level || 50;
  return "volume = " + volume;
}
console.log(setVolume(0));`,
      why: "`0` falsy, তাই `0 || 50` হয় `50`; ব্যবহারকারী ‘নিঃশব্দ’ চাইলেও ভলিউম ৫০ হয়ে যায়। ‘শুধু না দিলে’ বোঝাতে default parameter, ‘null/undefined’ বোঝাতে `??` ব্যবহার করুন; `||` কেবল ইচ্ছাকৃতভাবে falsy কে বদলাতে।",
      fix: `function setVolume(level = 50) {
  return "volume = " + level;
}
console.log(setVolume(0));
console.log(setVolume());`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "greet এ ডিফল্ট নাম",
      prompt: "`greet(name)` এ ডিফল্ট `'Guest'` দিন, যেন `greet()` এ `Hello, Guest` এবং `greet('Rina')` এ `Hello, Rina` আসে।",
      starter: `function greet(name) {
  // TODO: name এর জন্য default দিন
  return "Hello, " + name;
}

console.log(greet());
console.log(greet("Rina"));`,
      expected: "Hello, Guest\nHello, Rina",
      hints: ["Parameter এর পাশে `=` দিয়ে মান লিখুন।", "`function greet(name = 'Guest')`।"],
      solution: `function greet(name = "Guest") {
  return "Hello, " + name;
}

console.log(greet());
console.log(greet("Rina"));`,
    },
    {
      level: "beginner",
      title: "power: exponent এর default 2",
      prompt: "`power(base, exponent)` এ exponent এর default `2` দিন। `power(5)` → `25` এবং `power(2, 3)` → `8`।",
      starter: `function power(base, exponent) {
  return base ** exponent;
}

console.log(power(5));
console.log(power(2, 3));`,
      expected: "25\n8",
      hints: ["`exponent` না দিলে এখন `undefined`, তাই `NaN` আসছে।", "`exponent = 2` লিখুন।"],
      solution: `function power(base, exponent = 2) {
  return base ** exponent;
}

console.log(power(5));
console.log(power(2, 3));`,
    },
    {
      level: "beginner",
      title: "undefined বনাম null বনাম 0",
      prompt: "`label(text)` এ এমন default দিন যেন `undefined`(বা না দিলে) → `N/A`, কিন্তু `null` → `(none)` এবং `0` → `0` (যেমন আছে) print হয়। (Default এ `null` আসবে না, তাই body তে আলাদা শর্ত লাগবে।)",
      starter: `function label(text) {
  // TODO
  return text;
}

console.log(label());
console.log(label(undefined));
console.log(label(null));
console.log(label(0));`,
      expected: "N/A\nN/A\n(none)\n0",
      hints: ["Parameter এ `= 'N/A'`।", "Body তে `text === null` হলে `'(none)'` ফেরত দিন।"],
      solution: `function label(text = "N/A") {
  if (text === null) return "(none)";
  return text;
}

console.log(label());
console.log(label(undefined));
console.log(label(null));
console.log(label(0));`,
      explanation: "Default শুধু `undefined` ধরে; `null` আলাদা মান। তাই `null` এর জন্য body তে স্পষ্ট শর্ত।",
    },
    {
      level: "intermediate",
      title: "আগের parameter থেকে default",
      prompt: "`makeRect(width, height)` এ `height` এর default হবে `width` (square)। `makeRect(4)` → `{ width: 4, height: 4 }` এবং `makeRect(4, 7)` → `{ width: 4, height: 7 }`।",
      starter: `function makeRect(width, height) {
  return { width, height };
}

console.log(makeRect(4));
console.log(makeRect(4, 7));`,
      expected: "{ width: 4, height: 4 }\n{ width: 4, height: 7 }",
      hints: ["Default যেকোনো expression, আগের parameter ও হতে পারে।", "`height = width`।"],
      solution: `function makeRect(width, height = width) {
  return { width, height };
}

console.log(makeRect(4));
console.log(makeRect(4, 7));`,
    },
    {
      level: "intermediate",
      title: "Shared default এর bug ঠিক করুন",
      prompt: "নিচের `addItem` এ দুটি call এর ফলাফল একে অপরকে প্রভাবিত করছে। এটি ঠিক করুন যেন `[ 'a' ]` ও `[ 'b' ]` print হয়।",
      starter: `const shared = [];

function addItem(item, list = shared) {
  list.push(item);
  return list;
}

console.log(addItem("a"));
console.log(addItem("b"));`,
      expected: "[ 'a' ]\n[ 'b' ]",
      hints: ["Default এ বাইরের একটি array এর reference আছে।", "Default expression এর ভেতরেই `[]` লিখুন, যাতে প্রতি call এ নতুন হয়।"],
      solution: `function addItem(item, list = []) {
  list.push(item);
  return list;
}

console.log(addItem("a"));
console.log(addItem("b"));`,
      explanation: "`= []` প্রতি call এ evaluate হয় বলে নতুন array পাওয়া যায়; `= shared` প্রতিবার একই array ই দেয়।",
    },
    {
      level: "challenge",
      title: "formatPrice: required + options default (আগের binding সহ)",
      prompt: "`formatPrice(amount, options)`: `amount` বাধ্যতামূলক (না দিলে `TypeError('amount is required')` — throwing default দিয়ে)। `options` ঐচ্ছিক `{ currency = 'BDT', decimals = 2, prefix = currency + ' ' }` (options বাদ দিলেও চলবে; `prefix` এর default আগের `currency` ব্যবহার করে)। ফল: `prefix + amount.toFixed(decimals)`। `0` amount ও `decimals: 0` যেন default এ বদলে না যায়।",
      starter: `function formatPrice(amount) {
  // TODO: required default, destructured options (default সহ), prefix এর default currency থেকে
  return String(amount);
}

console.log(formatPrice(1234.5));
console.log(formatPrice(99, { currency: "USD", decimals: 0 }));
console.log(formatPrice(5, { prefix: "$" }));
console.log(formatPrice(0));
try {
  formatPrice();
} catch (e) {
  console.log(e.name + ": " + e.message);
}`,
      expected: "BDT 1234.50\nUSD 99\n$5.00\nBDT 0.00\nTypeError: amount is required",
      hints: [
        "একটি `required(name)` helper লিখুন যা `throw new TypeError(name + ' is required')` করে; `amount = required('amount')`।",
        "দ্বিতীয় parameter: `{ currency = 'BDT', decimals = 2, prefix = currency + ' ' } = {}`। Destructuring এ বাম থেকে ডানে চলে, তাই `prefix` এ `currency` দেখা যায়।",
        "`amount.toFixed(decimals)` ব্যবহার করুন।",
      ],
      solution: `function required(name) {
  throw new TypeError(name + " is required");
}

function formatPrice(
  amount = required("amount"),
  { currency = "BDT", decimals = 2, prefix = currency + " " } = {}
) {
  return prefix + amount.toFixed(decimals);
}

console.log(formatPrice(1234.5));
console.log(formatPrice(99, { currency: "USD", decimals: 0 }));
console.log(formatPrice(5, { prefix: "$" }));
console.log(formatPrice(0));
try {
  formatPrice();
} catch (e) {
  console.log(e.name + ": " + e.message);
}`,
      explanation: "`amount` এর default lazy, তাই argument দিলে `required` ডাকাই হয় না। `0` ও `decimals: 0` `undefined` নয়, তাই default এ বদলায় না (`||` হলে বদলে যেত)। Destructuring pattern এও default বাম থেকে ডানে চলে বলে `prefix` আগের `currency` দেখতে পায়।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`function f(x = 10) { return x; }` — `f(null)` কী ফেরত দেয়?",
        options: ["`10`", "`undefined`", "`null`", "`TypeError`"],
        answer: 2,
        explanation: "Default শুধু `undefined` এ কাজ করে। `null` একটি স্পষ্ট মান, তাই `x` হয় `null`। `10` পেতে হলে body তে `x ?? 10` লাগবে। `undefined` বা TypeError এর কোনো কারণ নেই।",
      },
      {
        question: "`let calls = 0; function f(a = ++calls) { return a; }` — `f(); f(); f(5);` এর পরে `calls` এর মান কত?",
        options: ["`2`", "`3`", "`1`", "`0`"],
        answer: 0,
        explanation: "Default expression প্রতিটি call এ এবং **শুধু দরকার হলে** evaluate হয়। প্রথম দুটি call এ argument নেই, তাই `++calls` দুবার চলে; `f(5)` এ চলে না। `3` ভুল কারণ default lazy; `1` ভুল কারণ প্রতি call এ আবার চলে (একবার নয়); `0` ভুল কারণ প্রথম দুটি call default ব্যবহার করেছে।",
      },
      {
        question: "`function f(a = b, b = 2) { return a; }` কে `f()` ডাকলে কী হয়?",
        options: [
          "`2` ফেরত আসে, কারণ `b` hoisted",
          "`undefined` ফেরত আসে",
          "Parse এর সময় `SyntaxError`",
          "`ReferenceError` — `a` এর default evaluate হওয়ার সময় `b` TDZ তে",
        ],
        answer: 3,
        explanation: "Parameter বাম থেকে ডানে initialize হয়, এবং আগে initialize হওয়া parameter কেবল তার আগের গুলো দেখতে পায়। `b` তখনো TDZ তে, তাই runtime এ `ReferenceError`। Syntax বৈধ, তাই SyntaxError নয়; `let` এর মতো আচরণ বলে hoisting এ `2` বা `undefined` আসে না।",
      },
      {
        question: "ব্যবহারকারী ভলিউম `0` দিতে পারে। `0` রেখে শুধু ‘না দিলে বা `null`/`undefined` হলে’ ৫০ নিতে কোনটি সঠিক?",
        options: ["`level || 50`", "`level ?? 50`", "`level && 50`", "`!level ? 50 : level`"],
        answer: 1,
        explanation: "`??` কেবল `null` ও `undefined` এ fallback নেয়, `0` রাখে। `||` ও `!level ? ...` (দুটিই falsy ধরে) `0` কে `50` বানিয়ে ফেলে; `&&` fallback দেয়ই না — উল্টো `level` truthy হলে `50` ফেরত দেয়।",
      },
      {
        question: "`function f(list = []) { list.push(1); return list.length; }` — `f(); f();` প্রথম ও দ্বিতীয় call এ কী ফেরত দেয়?",
        options: [
          "`1` ও `2` — array ভাগ হয়",
          "`2` ও `2`",
          "`1` ও `1` — প্রতি call এ নতুন array",
          "`1` ও একটি error",
        ],
        answer: 2,
        explanation: "`= []` প্রতি call এ evaluate হয়, তাই প্রতিবার নতুন খালি array; দুটিই `1`। এটি Python এর shared mutable default এর বিপরীত। `1, 2` ফল হতো যদি default টি বাইরে একবার তৈরি হয়ে ভাগ হতো; অন্য দুটি বিকল্পের কোনো ভিত্তি নেই।",
      },
    ],
    coding: [
      {
        title: "repeatText: একাধিক default",
        prompt: "`repeatText(text, times = 2, separator = '')` — `text` কে `times` বার `separator` দিয়ে জুড়ে ফেরত দিন। `times` `0` হলে খালি string (default এ বদলাবে না)।",
        starter: `function repeatText(text) {
  // TODO
}

console.log(repeatText("ab"));
console.log(repeatText("ab", 3, "-"));
console.log(repeatText("ab", 0).length);`,
        expected: "abab\nab-ab-ab\n0",
        solution: `function repeatText(text, times = 2, separator = "") {
  return Array(times).fill(text).join(separator);
}

console.log(repeatText("ab"));
console.log(repeatText("ab", 3, "-"));
console.log(repeatText("ab", 0).length);`,
      },
      {
        title: "Lazy default: id generator",
        prompt: "`tag(label, id = nextId())` function লিখুন যা `label + '#' + id` ফেরত দেয়। `nextId` একটি counter বাড়ায়। argument হিসেবে `id` দিলে `nextId` ডাকা যাবে না। আউটপুট দেখে বুঝুন counter কখন বাড়ে।",
        starter: `let n = 0;
function nextId() {
  return ++n;
}

function tag(label, id) {
  // TODO
}

console.log(tag("a"));
console.log(tag("b"));
console.log(tag("c", 100));
console.log(tag("d"));`,
        expected: "a#1\nb#2\nc#100\nd#3",
        solution: `let n = 0;
function nextId() {
  return ++n;
}

function tag(label, id = nextId()) {
  return label + "#" + id;
}

console.log(tag("a"));
console.log(tag("b"));
console.log(tag("c", 100));
console.log(tag("d"));`,
      },
    ],
  },

  interview: [
    {
      q: "Default parameter কখন কাজ করে, আর কখন করে না?",
      a: "Default শুধুমাত্র তখন কাজ করে যখন parameter এর মান **`undefined`** — অর্থাৎ argument দেওয়া হয়নি বা স্পষ্টভাবে `undefined` পাঠানো হয়েছে। `null`, `0`, `''`, `false`, `NaN` এগুলো বৈধ মান, তাই default ট্রিগার করে না।\n\nব্যবহারিক ফল: API থেকে `null` এলে `name = 'Guest'` কাজ করবে না; তখন body তে `name ?? 'Guest'` লাগবে। আর মাঝের parameter বাদ দিতে হলে `f(a, undefined, c)` লিখে default চালানো যায়।",
    },
    {
      q: "Default parameter এর মান কখন evaluate হয়? Python এর সাথে পার্থক্য কী?",
      a: "JavaScript এ default expression **প্রতিটি call এ**, এবং **শুধু দরকার হলে** (argument `undefined` হলে) evaluate হয়। তাই `function f(list = [])` এ প্রতি call এ নতুন array পাওয়া যায়, আর `id = generateId()` এ argument দিলে `generateId` ডাকাই হয় না।\n\nPython এ default সাধারণত function **define** করার সময় একবার evaluate হয় ও সব call এ ভাগ হয়, তাই mutable default (`items=[]`) একটি পরিচিত trap। JavaScript এ সেই trap নেই — তবে নিজে বাইরে একটি object তৈরি করে `= SHARED` দিলে সেই object প্রতিবার একই থাকে, তাই সেটি আপনারই তৈরি সমস্যা।",
    },
    {
      q: "Default parameter, `||` এবং `??` — কোনটি কখন ব্যবহার করবেন?",
      a: "**Default parameter** (`v = 50`): শুধু `undefined` এ — অর্থাৎ ‘caller কিছু দেয়নি’। সবচেয়ে পরিষ্কার, signature এ চুক্তি দেখায়। **`??`** (`v ?? 50`): `null` ও `undefined` দুটোতেই — API/DB থেকে আসা `null` সামলাতে উপযুক্ত, আর `0`/`''`/`false` রাখে। **`||`**: সব falsy তে (`0`, `''`, `false`, `NaN`, `null`, `undefined`) fallback নেয়।\n\n`||` তাই কেবল সচেতনভাবে ‘খালি হলেই বদলাও’ চাইলে (যেমন খালি string এ placeholder)। `volume || 50` এ ব্যবহারকারীর দেওয়া `0` হারিয়ে যায় — এটি production এর একটি পরিচিত bug। দুটি একসাথেও চলে: `function f(v = defaultV) { const x = v ?? other; }`।",
    },
    {
      q: "Parameter তালিকায় TDZ কীভাবে কাজ করে? `function f(a = b, b = 2)` কেন error দেয়?",
      a: "Parameter গুলো বাম থেকে ডানে একে একে initialize হয়, এবং প্রতিটি parameter binding `let` এর মতো — initialize হওয়ার আগে পড়তে গেলে `ReferenceError` (TDZ)। `a` এর default এ `b` পড়ার সময় `b` এখনো initialize হয়নি, তাই error।\n\nউল্টোটি বৈধ: `function f(a, b = a * 2)` — `b` এর default evaluate হওয়ার সময় `a` ইতিমধ্যে live। তাই dependent parameter গুলো সবসময় যার উপর নির্ভর করে তার **পরে** রাখুন। এটি Variables lesson এর TDZ ধারণারই প্রয়োগ।",
    },
    {
      q: "Throwing default দিয়ে required parameter কীভাবে বানান, এবং এর সুবিধা-অসুবিধা কী?",
      a: "একটি helper লিখি: `const required = (name) => { throw new TypeError(name + ' is required'); }` এবং parameter এ `function f(id = required('id')) {}`। Default lazy হওয়ায় argument থাকলে `required` ডাকাই হয় না; না থাকলে `f()` সাথে সাথে পরিষ্কার error দেয়।\n\nসুবিধা: কোনো `if` বা framework ছাড়াই signature এর ভেতরেই চুক্তি স্পষ্ট হয়। অসুবিধা: `undefined` কেই ‘মিসিং’ ধরা হয়, `null` ধরা পড়ে না; আর TypeScript থাকলে compile-time check আরও জোরালো — তবে runtime এ (network/user input) এটি এখনো কাজে লাগে।",
    },
    {
      q: "`function f({ a = 1, b = 2 })` কে `f()` ডাকলে কী হয়, এবং সমাধান কী?",
      a: "`TypeError` হয়। Argument না দিলে parameter `undefined`, আর `undefined` কে `{ a, b }` pattern এ destructure করা যায় না (`undefined` এর property পড়া যায় না)। প্রতিটি property র default (`a = 1`) এই সমস্যা থেকে বাঁচায় না, কারণ সেগুলো কেবল object **আছে** কিন্তু property নেই — সেই অবস্থার জন্য।\n\nসমাধান: পুরো pattern এর পরে `= {}`: `function f({ a = 1, b = 2 } = {}) {}`। এখন `f()` এ `{}` destructure হয় আর `a`, `b` default পায়। React component এ props সবসময় object হিসেবে আসে বলে সেখানে সাধারণত `= {}` লাগে না, কিন্তু utility function এ লাগে।",
    },
  ],

  summary: {
    takeaways: [
      "Default শুধু `undefined` এ কাজ করে — `null`, `0`, `''`, `false` এ নয়।",
      "Default expression প্রতি call এ, শুধু দরকার হলে evaluate হয় — তাই `= []`/`= {}` প্রতি call এ নতুন; Python এর shared-default trap নেই।",
      "Parameter বাম থেকে ডানে initialize হয়: আগেরটি পরের default এ ব্যবহারযোগ্য; উল্টোটি TDZ এর ReferenceError।",
      "Throwing default (`id = required('id')`) দিয়ে বাধ্যতামূলক parameter বানানো যায়।",
      "Destructured options এ দুই স্তর default: property (`a = 1`) এবং পুরো parameter (`= {}`)।",
      "Default (শুধু `undefined`) ≠ `??` (`null`+`undefined`) ≠ `||` (সব falsy)। `0`/`''` রাখতে চাইলে `||` নয়।",
    ],
    syntax: `function f(a, b = 10, c = a + b) {}        // আগের parameter ব্যবহার
function g(id = required("id")) {}          // throwing default
function h({ x = 1, y = 2 } = {}) {}        // destructuring + default
function k(list = []) {}                    // প্রতি call এ নতুন
const v = input ?? fallback;                // body তে null+undefined`,
    whenToUse: [
      "ঐচ্ছিক argument এর জন্য যুক্তিসঙ্গত ডিফল্ট থাকলে।",
      "Options object এর প্রতিটি property র default ও পুরো object এ `= {}`।",
      "API থেকে `null` আসতে পারে এমন জায়গায় body তে `??`।",
      "বাধ্যতামূলক parameter এ throwing default (বিশেষ করে plain JavaScript কোডে)।",
    ],
    next: [
      "Return — function থেকে মান ফেরত দেওয়া ও early return",
      "Closures — default expression ও scope এর গভীর ধারণা",
      "Higher-order Functions — optional callback এর default (no-op)",
    ],
  },

  compatibility:
    "Default parameter ES2015 এর অংশ — সব আধুনিক browser ও Node.js (6+) এ কাজ করে। `??` (nullish coalescing) ES2020; Node 14+ ও আধুনিক browser এ আছে। এই lesson এর সব কোড browser ও Node.js এ একই আচরণ করে।",
};
